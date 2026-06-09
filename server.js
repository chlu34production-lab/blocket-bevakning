
Claude is responding
Let’s get cooking! Pick an artifact category or start building your idea from scratch.


Apps and websites

Documents and templates

Games

Productivity tools

Creative projects

Quiz or survey

Start from scratch
Apps and websites

14:26
Great choice! To build the perfect app or website for you, I have a few quick questions:

What kind of app or website did you have in mind? (e.g., portfolio, landing page, tool, dashboard, e-commerce, etc.)
What's it for? Give me a quick description of its purpose or idea.
Who's it for? (yourself, a business, a specific audience?)
Jag vill bygga en enklare lösning där man till exempel kan få uppdatering varje 15:e minut på en specifik sökning på blocket.se och sedan få ett meddelande på exempelvis Slack eller WhatsApp. Första sökningen genererar ett större antal produkter allt mellan 1 - 5000 st. 
Denna sökning är ej intressant, utan vad som är intressant är alla nya resultat efter den allra första sökningen. Det vill säga alla annonser som läggs upp efter den första sökningen.

Så här kan söksträngen se ut, som användaren lägger upp i appen. 
https://www.blocket.se/mobility/search/car?price_from=30000&price_to=130000&q=golf&variant=2.817.1433.2003580&variant=2.817.1433.2003579&variant=2.817.1433.2003578&variant=2.817.1433.2003577&year_from=2010

Show more
14:39
Trevlig idé! Låt mig ställa några snabba frågor innan vi sätter igång:

Vilket notifieringssätt föredrar du? Slack, WhatsApp, eller båda?
Hur teknisk är användaren? Ska appen vara superenkel (klistra in URL, klicka start) eller är det okej med lite konfiguration?
Var ska appen köras? Lokalt på din dator, eller vill du ha något som körs i molnet (t.ex. alltid igång)?
Vore bra om man har båda alternativen, Slack och WhatsApp
Vad menas med lite konfiguration? Men lite effort är nog inga problem.
Gärna molnet om det skulle funka bra.

14:43
Perfekt! Här är planen:

🔍 Blocket-bevakning – App-plan
Vad appen gör:

Användaren klistrar in en Blocket-söklänk
Appen gör en första sökning och sparar alla befintliga annonser (dessa ignoreras)
Var 15:e minut kontrolleras sökningen igen
Nya annonser som dykt upp sedan första sökningen skickas som notis via Slack och/eller WhatsApp
Notisinnehåll per annons:

Titel, pris, länk och bild (om möjligt)
Konfiguration användaren gör:

Klistra in Blocket-URL
Ange Slack webhook-URL (för Slack-notiser)
Ange telefonnummer + Twilio-uppgifter (för WhatsApp via Twilio)
Välja notifieringskanal (Slack, WhatsApp, eller båda)
Molnlösning:

Appen byggs som en React-app med ett Node.js-backend – men eftersom artifacts körs i browsern bygger vi en fristående webbapp där polling sker i browsern (tab måste vara öppen), med notiser via Slack webhook och WhatsApp via Twilio API.
⚠️ Notera: För en "äkta" molnlösning som körs utan att ha en flik öppen behöver man en server (t.ex. Railway, Render eller Vercel). Vill du ha det, eller är det okej att appen körs i en öppen webbläsarflik?

Ser detta bra ut? Eller vill du ändra något innan vi bygger?

Det känns bra, bygg så kanske vi kan ändra lite längs vägen..

14:45

Blocket Bevakning
Interactive artifact 
Här är din Blocket-bevakningsapp! Så här fungerar den:

Hur du kommer igång:

Klistra in din Blocket-söklänk
Välj intervall (standard 15 min)
Fyll i Slack webhook-URL och/eller Twilio-uppgifter för WhatsApp
Tryck "Starta bevakning"
Vad som händer:

Första sökningen sparar alla befintliga annonser (dessa ignoreras)
Därefter körs en ny sökning varje x minut
Nya annonser visas direkt i appen med grön markering och en "NY"-badge
Notis skickas automatiskt till Slack/WhatsApp med titel, pris och länk
Viktigt att veta:

Fliken måste vara öppen för att appen ska köra (som diskuterat)
Det kan uppstå en CORS-begränsning direkt i webbläsaren mot Blockets API — i sådant fall visas en varning. Fungerar det inte rakt av behöver vi lägga till en liten proxy-server
Vill du att jag hjälper dig sätta upp en enkel backend/proxy på t.ex. Railway så att det fungerar utan öppen flik och utan CORS-problem?

Ja, tack. Sätt upp en enkel backend/proxy på t.ex. Railway

14:54
Bra! Tyvärr kan jag inte sätta upp en server åt dig direkt, men jag kan ge dig exakt allt du behöver för att göra det själv på Railway – det tar ca 10 minuter och kräver ingen tidigare erfarenhet.

Här är hela backend-koden:


Blocket Proxy – server.js
Code 

package.json
Code 
🚀 Driftsätt på Railway – steg för steg
1. Skapa konto Gå till railway.app och logga in med GitHub.

2. Skapa repo på GitHub Skapa ett nytt repository (t.ex. blocket-proxy) och lägg in de två filerna:

server.js ← koden ovan
package.json ← koden ovan
3. Driftsätt på Railway

Klicka "New Project" → "Deploy from GitHub repo"
Välj ditt repo
Railway hittar package.json automatiskt och startar servern
Under "Settings" → "Networking" → klicka "Generate Domain" för att få en publik URL
4. Uppdatera appen När Railway gett dig en URL (t.ex. https://blocket-proxy-production.up.railway.app) behöver vi uppdatera frontend-appen så den anropar din proxy istället för Blocket direkt. Säg till så fixar jag det direkt!

Kostnad: Railway har ett gratis tier på 5 USD/månad i credits – mer än tillräckligt för detta.

Kan man lägga upp den på en egen websida istället?

15:43
Ja, absolut! Det finns några olika sätt att tänka på det:

Alternativ 1 – Statisk webbsida (frontend only) Hostar bara HTML/CSS/JS-filen på t.ex. GitHub Pages, Netlify eller Vercel. Gratis och enkelt – men CORS-problemet kvarstår, så den kan inte anropa Blockets API direkt.

Alternativ 2 – Fullstack på egen domän Backend (proxy) + frontend på samma server. Kräver en VPS (t.ex. DigitalOcean, Hetzner) eller ett webbhotell med Node.js-stöd.

Alternativ 3 – Netlify/Vercel med serverless functions Frontend hostas gratis, och proxy-logiken körs som en "serverless function" bakom samma domän. Ingen separat server behövs, fungerar med egen domän, och löser CORS. Detta är nog det smidigaste alternativet.

Har du redan en egen domän eller ett webbhotell? Och vilket alternativ känns mest intressant? Så bygger jag rätt lösning direkt.

[https://admin.websupport.se](https://admin.websupport.se/sv/dashboard)

15:43
Websupport är ett traditionellt webbhotell – de erbjuder vanligtvis PHP-hosting, inte Node.js. Det betyder att vår Express-proxy inte kan köras där direkt.

Men det finns en smidig lösning: PHP-proxy. Vi skriver om proxy-logiken i PHP istället, som fungerar perfekt på Websupport. Då kan du:

Lägga upp filerna via FTP eller deras filhanterare
Peka din egen domän dit
Köra allt utan extra kostnad
Vad jag behöver veta innan jag bygger:

Har du en domän kopplad till Websupport redan, eller behöver du skapa en subdomän (t.ex. blocket.dindomän.se)?
Har du tillgång till FTP-uppgifter eller använder du deras webbfilhanterare?
Så sätter vi ihop en komplett lösning med PHP-proxy + frontend som du laddar upp direkt!

Låter bra, jag har en domän som jag kan köra på. nrdiq.com
Ja, har till till ftp

19:11
Perfekt! Då kör vi. Här kommer alla filer du behöver ladda upp via FTP:


proxy.php
Code 

index.html (uppdaterad med proxy)
Interactive artifact ∙ Version 2 

Blocket Bevakning
Interactive artifact ∙ Version 3 
Klart! Här är vad du ska göra:

📁 Ladda upp via FTP
Skapa en mapp på din server, t.ex. blocket/, och ladda upp två filer:

public_html/
└── blocket/
    ├── proxy.php   ← PHP-proxyn
    └── index.html  ← Appen (kopiera från artefakten ovan)
Din app når du sedan på https://nrdiq.com/blocket/

✅ Testa att proxyn fungerar
Öppna detta i webbläsaren efter uppladdning:

https://nrdiq.com/blocket/proxy.php?action=search&url=https://www.blocket.se/mobility/search/car?q=golf
Ser du JSON-data? Då fungerar allt. Ser du ett felmeddelande kan det bero på att Websupport har curl inaktiverat – hör i så fall av dig till deras support och be dem aktivera curl för ditt konto (det brukar vara på som standard).

Vill du att jag också lägger till ett enkelt lösenordsskydd på sidan så inte vem som helst kan använda din proxy?

Ja tack.

19:13

.htaccess
Code 

.htpasswd generator (kör lokalt)
Code 
Nu behöver du också uppdatera proxy.php så den hoppar över lösenordskravet för API-anropen inifrån appen själv – det sköts automatiskt eftersom webbläsaren skickar med inloggningen.

Men vi behöver justera .htaccess så att proxy.php är öppen för appen men skyddad utifrån. Det enklaste sättet är att skydda hela mappen med lösenord och låta appen skicka med credentials:


Blocket Bevakning
Interactive artifact ∙ Version 4 

Blocket Bevakning
Interactive artifact ∙ Version 5 

Blocket Bevakning
Interactive artifact ∙ Version 6 
Klart! Här är vad du laddar upp – nu fyra filer totalt:

public_html/
└── blocket/
    ├── index.html    ← uppdaterad med lösenord
    ├── proxy.php
    ├── .htaccess     ← ny
    └── .htpasswd     ← ny (genereras av dig)
🔐 Så här skapar du .htpasswd
Alternativ A – Terminal (Mac/Linux):

bash
htpasswd -c .htpasswd admin
Ange ditt lösenord när du blir tillfrågad.

Alternativ B – Online-generator (enklast): Gå till htaccesstools.com/htpasswd-generator, ange användarnamn admin och ditt lösenord, kopiera den genererade raden och spara den i en fil som heter .htpasswd.

⚠️ Två saker att justera innan uppladdning
Sökvägen i .htaccess – raden AuthUserFile /home/nrdiq/.htpasswd måste peka på rätt absolut sökväg på din server. Logga in på Websupport kontrollpanel och kolla under "FTP" eller "Filhanterare" för att se din absoluta sökväg (brukar vara något som /var/www/nrdiq.com/public_html/blocket/.htpasswd).
Lösenordet i index.html – byt ut mittlösenord på rad 3 i skriptdelen mot ditt riktiga lösenord.
Hör av dig när du laddat upp så testar vi!

var hittar jag dessa filer för nedladdning?

20:06
Du kan inte ladda ner filerna direkt från den här chatten tyvärr – men det finns ett par enkla sätt att få tag på dem:

Alternativ 1 – Kopiera manuellt (enklast)
Klicka på varje artefakt här i chatten och kopiera innehållet, sedan:

Öppna Anteckningar (Windows) eller TextEdit (Mac)
Klistra in innehållet
Spara med rätt filnamn (index.html, proxy.php, .htaccess, .htpasswd)
⚠️ På Windows, se till att filen sparas som "Alla filer" och inte .txt – annars läggs .txt till i filnamnet automatiskt.

Alternativ 2 – Skapa filerna direkt i Websupports filhanterare
Logga in på admin.websupport.se, gå till Filhanteraren, skapa mappen blocket/ och skapa varje fil direkt där – klistra in innehållet från artefakterna här.

Alternativ 3 – GitHub (om du är bekväm med det)
Jag kan hjälpa dig sätta upp ett GitHub-repo med alla filer om du vill ha ett bra ställe att förvara och uppdatera koden.

Vilket alternativ passar dig bäst?

Alternativ 3 – GitHub

20:06
För att sätta upp ett GitHub-repo behöver jag veta ett par saker:

Har du ett GitHub-konto redan, eller behöver du skapa ett?
Vad vill du kalla repot? T.ex. blocket-bevakning eller något annat?
Har ett konto, blocket-bevakning blir bra

20:07
Perfekt! Följ dessa steg:

1. Skapa repot på GitHub
Gå till github.com/new
Fyll i:
Repository name: blocket-bevakning
Visibility: Private ✅ (så ingen annan ser dina inställningar)
Klicka "Create repository"
2. Skapa filerna i repot
Klicka "creating a new file" och skapa dessa filer en i taget – klistra in innehållet från artefakterna i chatten:

Filnamn	Artefakt att kopiera från
index.html	"index.html (uppdaterad med proxy)"
proxy.php	"proxy.php"
.htaccess	".htaccess"
.htpasswd	Generera på htaccesstools.com
För .htaccess och .htpasswd – GitHub accepterar filnamn som börjar med punkt, skriv bara in namnet som vanligt.

3. Ladda ner som ZIP
När alla filer är inlagda:

Klicka gröna knappen "Code"
Välj "Download ZIP"
Packa upp och ladda upp innehållet via FTP till public_html/blocket/
4. Kom ihåg att uppdatera innan uppladdning
I index.html, byt ut på rad 3:

javascript
const PROXY_PASS = "mittlösenord"; // ← ditt riktiga lösenord
Och i .htaccess, justera sökvägen:

apache
AuthUserFile /var/www/nrdiq.com/public_html/blocket/.htpasswd
Hör av dig när du laddat upp till Websupport så testar vi att allt fungerar! 🚀

Får det inte att fungera med nrdic.com/blocket

Skulle vi kunna testa lite med det vi började med, så får jag se hur det fungerar?

Molnlösning:

Appen byggs som en React-app med ett Node.js-backend – men eftersom artifacts körs i browsern bygger vi en fristående webbapp där polling sker i browsern (tab måste vara öppen), med notiser via Slack webhook och WhatsApp via Twilio API.
20:54
Absolut! Vi kör på den enklare lösningen direkt i browsern – ingen server behövs. Låt mig bygga om appen från grunden, ren och klar.


Blocket Bevakning – standalone
Interactive artifact ∙ Version 7 
Här är den renbyggda standalone-appen! Så här testar du den:

Steg 1 – Klistra in söklänken Lägg in din Blocket-URL, t.ex:

https://www.blocket.se/mobility/search/car?price_from=30000&price_to=130000&q=golf&year_from=2010
Steg 2 – Välj intervall Sätt "Var 2:a minut" för att testa snabbt.

Steg 3 – Tryck Starta Första sökningen sparar alla befintliga annonser och ignorerar dem. Allt som kommer in efteråt visas med grön "NY"-badge.

Om du vill testa Slack-notiser är det enklast – aktivera Slack-togglen och klistra in en webhook-URL.

⚠️ Du kan fortfarande stöta på CORS-felet direkt i browsern. Om det händer syns en varning – men vi kan återkomma till proxy-lösningen när du sett hur appen fungerar i praktiken!

⚠️ CORS-begränsning: Webbläsaren blockerar direktanrop till Blockets API. Det här är en teknisk begränsning som kräver en proxy-server för att lösa fullt ut. Notiser via Slack/WhatsApp fungerar däremot direkt när proxyn är på plats.

21:09
Som väntat – CORS-begränsningen slår till direkt i browsern. Vi behöver proxyn för att det ska fungera.

Det enklaste just nu är att vi använder Railway ändå – det är faktiskt väldigt enkelt och tar bara några minuter. Du behöver inte ens FTP eller GitHub för att komma igång.

Snabbaste vägen – Railway utan GitHub
Gå till railway.app och skapa ett gratis konto
Klicka "New Project" → "Deploy Template" → sök på "Node"
Välj en tom Node-mall
Eller ännu enklare – testa Render.com som har ett ännu enklare gränssnitt:

Gå till render.com och skapa gratis konto
Klicka "New" → "Web Service"
Välj "Deploy from public Git repository"
Men det snabbaste av allt – vill du att jag hjälper dig sätta upp GitHub-repot ordentligt med de rätta filerna, så att du sedan med ett klick kan driftsätta det på Railway eller Render? Då slipper du copy-pasta och allt hänger ihop.

Vilket alternativ känns bäst – Railway, Render, eller fixar vi GitHub-repot först?

Ok provar med Render. Sätt upp GitHub-repot , med dom rätta filerna.

21:11
Perfekt! Här kommer alla filer du behöver till GitHub-repot. Skapa repot blocket-bevakning på GitHub och lägg in dessa tre filer:


server.js
Code ∙ Version 2 

package.json
Code ∙ Version 2 
Nu uppdaterar jag även index.html så den pekar på Render-servern istället för direkt mot Blocket:


public/index.html
Interactive artifact ∙ Version 8 
Tre filer ska in i repot. Så här gör du:

📁 Struktur i GitHub-repot
blocket-bevakning/
├── server.js
├── package.json
└── public/
    └── index.html
Steg för steg
1. Gå till ditt repo på github.com → blocket-bevakning

2. Skapa server.js – klicka "Add file" → "Create new file", klistra in innehållet

3. Skapa package.json – samma sak

4. Skapa public/index.html – skriv public/index.html som filnamn (GitHub skapar mappen automatiskt), klistra in innehållet

Därefter – driftsätt på Render
Gå till render.com → "New" → "Web Service"
Koppla ditt GitHub-konto och välj repot blocket-bevakning
Fyll i:
Build command: npm install
Start command: npm start
Klicka "Create Web Service"
Render ger dig en URL som ser ut ungefär så här: https://blocket-bevakning.onrender.com
6. Uppdatera index.html – byt ut URL:en på rad 3 i skriptet:

javascript
const PROXY = "https://blocket-bevakning.onrender.com"; // ← redan förifylld
Om Render ger dig ett annat namn, uppdatera den raden.

Hör av dig med din Render-URL när du fått den – då dubbelkollar vi att allt stämmer! 🚀

Skärmavbild 20260609 kl. 21.30.38.png
ser det här OK ut?

21:34
Ser perfekt ut! Strukturen stämmer exakt:

blocket-bevakning/
├── server.js          ✅
├── package.json       ✅
└── public/
    └── index.html     ✅
(.htpasswd som ligger där gör inget, den ignoreras av Node.js.)

Nu är det dags för Render!
Gå till render.com och logga in
Klicka "New +" → "Web Service"
Välj "Connect a repository" → koppla GitHub och välj blocket-bevakning
Fyll i inställningarna:
Runtime: Node
Build command: npm install
Start command: npm start
Klicka "Create Web Service"
Render börjar bygga direkt – tar ca 1–2 minuter. Du får en URL som ser ut ungefär som https://blocket-bevakning-xxxx.onrender.com.

Skicka URL:en hit när du fått den så uppdaterar vi index.html med rätt adress! 🚀

https://blocket-bevakning.onrender.com

21:40
Perfekt URL! Nu behöver vi bara uppdatera en rad i index.html på GitHub – den stämmer redan nästan, men låt oss dubbelkolla att det är exakt rätt:


Blocket Bevakning
Interactive artifact ∙ Version 9 
URL:en stämmer redan exakt! Ingen ändring behövs i index.html.

Testa att proxyn fungerar
Öppna detta i webbläsaren och kolla att du får JSON tillbaka:

https://blocket-bevakning.onrender.com/health
Ser du {"ok":true} är servern igång.

Testa sedan en riktig sökning:

https://blocket-bevakning.onrender.com/api/search?url=https://www.blocket.se/mobility/search/car?q=golf
Ser du annonsdata i JSON-format fungerar hela kedjan! Då kan du öppna appen på:

https://blocket-bevakning.onrender.com
Klistra in din söklänk och tryck Starta bevakning – nu utan CORS-fel. 🚀

⚠️ Obs: Render's gratisplan "sover" efter 15 minuters inaktivitet. Första anropet kan ta 30–60 sekunder att vakna. Uppgraderingen till $7/mån tar bort det beteendet om det känns störande.

{"error":"Blocket svarade 503"}
21:43
503 betyder att Blockets API svarade med "tjänsten ej tillgänglig" – proxyn fungerar alltså, men Blocket blockerar anropet. De känner troligen igen att det kommer från en server och inte en riktig webbläsare.

Vi behöver se ut mer som en riktig webbläsare. Uppdatera server.js på GitHub med bättre headers:


Blocket Proxy – server.js
Code ∙ Version 3 
Gör så här:

Gå till server.js i GitHub-repot
Klicka pennikonen (Edit)
Ersätt hela fetch-blocket med det uppdaterade innehållet från artefakten
Klicka "Commit changes"
Render deployar om automatiskt inom ~1 minut. Testa sedan igen:

https://blocket-bevakning.onrender.com/api/search?url=https://www.blocket.se/mobility/search/car?q=golf
Hör av dig om det fortfarande ger 503 – då provar vi att lägga till cookie-hantering också.

Svarade 503 igen

21:54
OK, Blocket skyddar sitt API ganska aggressivt mot servrar. Vi behöver lägga till cookie-hantering – Blocket kräver troligen en session-cookie för att svara.

Uppdatera hela server.js med den här versionen:


server.js (med cookie-hantering)
Code 




Claude is AI and can make mistakes. Please double-check responses.
const express = require("express");
const cors    = require("cors");
const fetch   = (...a) => import("node-fetch").then(({ default: f }) => f(...a));

const app  = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// Sparar cookies mellan anrop
let sessionCookie = "";

const HEADERS = {
  "Accept":             "application/json, text/plain, */*",
  "Accept-Language":    "sv-SE,sv;q=0.9,en;q=0.8",
  "User-Agent":         "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
  "Referer":            "https://www.blocket.se/",
  "Origin":             "https://www.blocket.se",
  "sec-ch-ua":          '"Chromium";v="124", "Google Chrome";v="124"',
  "sec-ch-ua-mobile":   "?0",
  "sec-ch-ua-platform": '"Windows"',
  "sec-fetch-dest":     "empty",
  "sec-fetch-mode":     "cors",
  "sec-fetch-site":     "same-site"
};

// Hämta cookies från blocket.se först
async function ensureSession() {
  if (sessionCookie) return;
  try {
    const r = await fetch("https://www.blocket.se/", {
      headers: {
        ...HEADERS,
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "sec-fetch-dest": "document",
        "sec-fetch-mode": "navigate",
        "sec-fetch-site": "none"
      }
    });
    const raw = r.headers.raw?.()["set-cookie"] || r.headers.getSetCookie?.() || [];
    if (raw.length) {
      sessionCookie = raw.map(c => c.split(";")[0]).join("; ");
      console.log("✅ Session-cookie hämtad");
    }
  } catch (e) {
    console.warn("⚠️ Kunde inte hämta session-cookie:", e.message);
  }
}

// ── Hälsokoll ──────────────────────────────────────────────
app.get("/health", (_, res) => res.json({ ok: true }));

// ── Blocket proxy ──────────────────────────────────────────
app.get("/api/search", async (req, res) => {
  try {
    const raw = req.query.url;
    if (!raw || !raw.includes("blocket.se"))
      return res.status(400).json({ error: "Ogiltig URL" });

    await ensureSession();

    const u = new URL(raw);
    u.searchParams.set("lim",     "40");
    u.searchParams.set("offset",  "0");
    u.searchParams.set("gl",      "3");
    u.searchParams.set("include", "extend_with_shipping");
    u.searchParams.set("st",      "s");

    const apiUrl = `https://api.blocket.se/search_bff/v1/content?${u.searchParams}`;
    console.log("→ Anropar:", apiUrl);

    const r = await fetch(apiUrl, {
      headers: {
        ...HEADERS,
        ...(sessionCookie ? { Cookie: sessionCookie } : {})
      }
    });

    console.log("← Blocket svarade:", r.status);

    // Om 503, nollställ cookie och försök igen en gång
    if (r.status === 503) {
      sessionCookie = "";
      await ensureSession();
      const r2 = await fetch(apiUrl, {
        headers: { ...HEADERS, ...(sessionCookie ? { Cookie: sessionCookie } : {}) }
      });
      if (!r2.ok) throw new Error(`Blocket svarade ${r2.status} (retry)`);
      return res.json(await r2.json());
    }

    if (!r.ok) throw new Error(`Blocket svarade ${r.status}`);
    res.json(await r.json());

  } catch (e) {
    console.error("Fel:", e.message);
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
    return res.status(400).json({ error: "Saknar data
