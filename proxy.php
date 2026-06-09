<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit();
}

$action = $_GET["action"] ?? "";

// ── Blocket sökning ────────────────────────────────────────
if ($action === "search") {
    $url = $_GET["url"] ?? "";
    if (!$url || strpos($url, "blocket.se") === false) {
        echo json_encode(["error" => "Ogiltig URL"]);
        exit();
    }

    $parsed = parse_url($url);
    parse_str($parsed["query"] ?? "", $params);

    $params["lim"] = 40;
    $params["offset"] = 0;
    $params["gl"] = 3;
    $params["include"] = "extend_with_shipping";
    $params["st"] = "s";

    $apiUrl = "https://api.blocket.se/search_bff/v1/content?" . http_build_query($params);

    $ch = curl_init($apiUrl);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        "Accept: application/json",
        "User-Agent: Mozilla/5.0 (compatible; BlocketMonitor/1.0)"
    ]);
    curl_setopt($ch, CURLOPT_TIMEOUT, 15);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, true);

    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $error = curl_error($ch);
    curl_close($ch);

    if ($error) {
        echo json_encode(["error" => $error]);
        exit();
    }
    if ($httpCode !== 200) {
        echo json_encode(["error" => "Blocket svarade: $httpCode"]);
        exit();
    }

    echo $response;
    exit();
}

// ── Slack-notis ────────────────────────────────────────────
if ($action === "slack") {
    $body = json_decode(file_get_contents("php://input"), true);
    $webhook = $body["webhook"] ?? "";
    $ad = $body["ad"] ?? [];

    if (!$webhook || !$ad) {
        echo json_encode(["error" => "Saknar webhook eller annons"]);
        exit();
    }

    $price = isset($ad["price"]["value"])
        ? number_format((int)$ad["price"]["value"], 0, ",", " ") . " kr"
        : "Pris saknas";
    $title = $ad["subject"] ?? "Okänd annons";
    $link  = $ad["share_url"] ?? ("https://www.blocket.se" . ($ad["url"] ?? ""));
    $img   = $ad["images"][0]["url"] ?? "";
    $loc   = $ad["location"]["name"] ?? "";

    $payload = [
        "blocks" => [
            [
                "type" => "section",
                "text" => [
                    "type" => "mrkdwn",
                    "text" => "🆕 *Ny Blocket-annons!*\n*$title*\n💰 $price\n📍 $loc"
                ],
                ...($img ? ["accessory" => [
                    "type" => "image",
                    "image_url" => $img . "?type=mob_iphone_vi_normal_2x",
                    "alt_text" => $title
                ]] : [])
            ],
            [
                "type" => "actions",
                "elements" => [[
                    "type" => "button",
                    "text" => ["type" => "plain_text", "text" => "Öppna annons ↗"],
                    "url" => $link
                ]]
            ]
        ]
    ];

    $ch = curl_init($webhook);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
    curl_setopt($ch, CURLOPT_HTTPHEADER, ["Content-Type: application/json"]);
    curl_setopt($ch, CURLOPT_TIMEOUT, 10);
    curl_exec($ch);
    curl_close($ch);

    echo json_encode(["ok" => true]);
    exit();
}

// ── WhatsApp via Twilio ────────────────────────────────────
if ($action === "whatsapp") {
    $body = json_decode(file_get_contents("php://input"), true);
    $sid   = $body["sid"]   ?? "";
    $token = $body["token"] ?? "";
    $to    = $body["to"]    ?? "";
    $from  = $body["from"]  ?? "";
    $ad    = $body["ad"]    ?? [];

    if (!$sid || !$token || !$to || !$from || !$ad) {
        echo json_encode(["error" => "Saknar Twilio-uppgifter eller annons"]);
        exit();
    }

    $price = isset($ad["price"]["value"])
        ? number_format((int)$ad["price"]["value"], 0, ",", " ") . " kr"
        : "Pris saknas";
    $title = $ad["subject"] ?? "Okänd annons";
    $link  = $ad["share_url"] ?? ("https://www.blocket.se" . ($ad["url"] ?? ""));
    $msg   = "🆕 Ny Blocket-annons!\n*$title*\n💰 $price\n$link";

    $twilioUrl = "https://api.twilio.com/2010-04-01/Accounts/$sid/Messages.json";

    $ch = curl_init($twilioUrl);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_USERPWD, "$sid:$token");
    curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query([
        "From" => "whatsapp:$from",
        "To"   => "whatsapp:$to",
        "Body" => $msg
    ]));
    curl_setopt($ch, CURLOPT_TIMEOUT, 10);

    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($httpCode >= 200 && $httpCode < 300) {
        echo json_encode(["ok" => true]);
    } else {
        $data = json_decode($response, true);
        echo json_encode(["error" => $data["message"] ?? "Twilio-fel: $httpCode"]);
    }
    exit();
}

echo json_encode(["error" => "Okänd åtgärd"]);
