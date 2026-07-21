const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 8080;
const INFERENCE_API_KEY = process.env.INFERENCE_API_KEY;
const INFERENCE_MODEL =
  process.env.INFERENCE_MODEL || "openai-gpt-4o-mini";
const INFERENCE_URL = "https://inference.do-ai.run/v1/chat/completions";

const plans = [
  {
    id: "signal",
    name: "Signal",
    price: 35,
    data: "15 GB",
    highlight: "Everyday essentials",
    perks: ["Unlimited talk & text", "5G access", "Mobile hotspot 5 GB"],
  },
  {
    id: "pulse",
    name: "Pulse",
    price: 55,
    data: "Unlimited",
    highlight: "Most popular",
    perks: [
      "Unlimited premium data",
      "5G Ultra",
      "Mobile hotspot 25 GB",
      "International texting",
    ],
  },
  {
    id: "orbit",
    name: "Orbit",
    price: 75,
    data: "Unlimited+",
    highlight: "Power users",
    perks: [
      "Priority 5G Ultra",
      "Hotspot 50 GB",
      "TravelPass days included",
      "Device protection discount",
    ],
  },
];

const SYSTEM_PROMPT = `You are the TeleConnect support assistant for a demo cellphone provider website.
Answer clearly and briefly (2–4 short sentences unless the user asks for detail).

Plans (monthly, no annual contracts; switch anytime):
- Signal — $35/mo: 15 GB high-speed data, unlimited talk & text, 5G access, 5 GB hotspot. Best for everyday essentials.
- Pulse — $55/mo: unlimited premium data, 5G Ultra, 25 GB hotspot, international texting. Most popular.
- Orbit — $75/mo: unlimited+ with priority 5G Ultra, 50 GB hotspot, TravelPass days included, device protection discount. For power users.

Coverage: TeleConnect uses a nationwide 5G footprint. Visitors can preview coverage by entering a ZIP on the Coverage section of the site.
Phones: Bring your own phone or get a new one; activation takes minutes.
Contact for anything you cannot answer: hello@teleconnect.example

If asked about topics outside TeleConnect plans, coverage, phones, or switching, say you do not know and suggest emailing hello@teleconnect.example.
Do not invent prices, fees, or policies that are not listed above.`;

app.use(express.json({ limit: "32kb" }));

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", service: "teleconnect" });
});

app.get("/api/plans", (_req, res) => {
  res.json({ plans });
});

app.post("/api/chat", async (req, res) => {
  if (!INFERENCE_API_KEY) {
    return res.status(503).json({
      error: "Chat is unavailable. INFERENCE_API_KEY is not configured.",
    });
  }

  const incoming = Array.isArray(req.body?.messages) ? req.body.messages : null;
  if (!incoming || incoming.length === 0) {
    return res.status(400).json({ error: "messages array is required" });
  }

  const sanitized = incoming
    .filter(
      (m) =>
        m &&
        (m.role === "user" || m.role === "assistant") &&
        typeof m.content === "string" &&
        m.content.trim()
    )
    .slice(-10)
    .map((m) => ({ role: m.role, content: m.content.trim().slice(0, 2000) }));

  if (sanitized.length === 0) {
    return res.status(400).json({ error: "No valid messages provided" });
  }

  try {
    const response = await fetch(INFERENCE_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${INFERENCE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: INFERENCE_MODEL,
        temperature: 0.3,
        max_tokens: 400,
        messages: [{ role: "system", content: SYSTEM_PROMPT }, ...sanitized],
      }),
    });

    if (!response.ok) {
      const detail = await response.text();
      console.error("Inference error:", response.status, detail.slice(0, 500));
      return res.status(502).json({ error: "Inference request failed" });
    }

    const data = await response.json();
    const reply = data?.choices?.[0]?.message?.content?.trim();

    if (!reply) {
      return res.status(502).json({ error: "Empty reply from model" });
    }

    return res.json({ reply });
  } catch (err) {
    console.error("Chat handler error:", err.message);
    return res.status(502).json({ error: "Unable to reach inference service" });
  }
});

app.use(express.static(path.join(__dirname, "public")));

app.get("*", (_req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`TeleConnect listening on port ${PORT}`);
});
