const express = require("express");
const cors    = require("cors");
const fetch   = (...a) => import("node-fetch").then(({ default: f }) => f(...a));

const app  = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// ── Hälsokoll ──────────────────────────────────────────────
app.get("/health", (_, res) => res.json({ ok: true }));

// ── Blocket proxy ──────────────────────────────────────────
app.get("/api/search", async (req, res) => {
  try {
    const raw = req.query.url;
    if (!raw || !raw.includes("blocket.se"))
      return res.status(400).json({ error: "Ogiltig URL" });

    const u = new URL(raw);
    u.searchParams.set("lim",     "40");
    u.searchParams.set("offset",  "0");
    u.searchParams.set("gl",      "3");
    u.searchParams.set("include", "extend_with_shipping");
    u.searchParams.set("st",      "s");

    const apiUrl = `https://api.blocket.se/search_bff/v1/content?${u.searchParams}`;
    const r = await fetch(apiUrl, {
      headers: {
        Accept:       "application/json",
        "User-Agent": "Mozilla/5.0 (compatible; BlocketMonitor/1.0)"
      }
    });
    if (!r.ok) throw new Error(`Blocket svarade ${r.status}`);
    const data = await r.json();
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ── Slack-notis ────────────────────────────────────────────
app.post("/api/notify/slack", async (req, res) => {
  const { webhook, ad } = req.body;
  if (!webhook || !ad) return res.status(400).json({ error: "Saknar data" });

  const price = ad.price?.value
    ? `${parseInt(ad.price.value).toLocaleString("sv-SE")} kr`
    : "Pris saknas";
  const link = ad.share_url || `https://www.blocket.se${ad.url || ""}`;
  const img  = ad.images?.[0]?.url;

  const body = {
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `🆕 *Ny Blocket-annons!*\n*${ad.subject || "Okänd"}*\n💰 ${price}\n📍 ${ad.location?.name || ""}`
        },
        ...(img ? { accessory: { type: "image", image_url: img + "?type=mob_iphone_vi_normal_2x", alt_text: ad.subject || "bild" } } : {})
      },
      {
        type: "actions",
        elements: [{ type: "button", text: { type: "plain_text", text: "Öppna annons ↗" }, url: link }]
      }
    ]
  };

  try {
    await fetch(webhook, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ── WhatsApp via Twilio ────────────────────────────────────
app.post("/api/notify/whatsapp", async (req, res) => {
  const { sid, token, to, from, ad } = req.body;
  if (!sid || !token || !to || !from || !ad)
    return res.status(400).json({ error: "Saknar data" });

  const price = ad.price?.value
    ? `${parseInt(ad.price.value).toLocaleString("sv-SE")} kr`
    : "Pris saknas";
  const link = ad.share_url || `https://www.blocket.se${ad.url || ""}`;
  const msg  = `🆕 Ny Blocket-annons!\n${ad.subject || "Okänd"}\n💰 ${price}\n${link}`;

  try {
    const r = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`, {
      method:  "POST",
      headers: {
        Authorization:  "Basic " + Buffer.from(`${sid}:${token}`).toString("base64"),
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: new URLSearchParams({ From: `whatsapp:${from}`, To: `whatsapp:${to}`, Body: msg })
    });
    const data = await r.json();
    if (r.ok) res.json({ ok: true });
    else res.status(400).json({ error: data.message });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.listen(PORT, () => console.log(`✅ Server körs på port ${PORT}`));
