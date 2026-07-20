const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 8080;

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
    perks: ["Unlimited premium data", "5G Ultra", "Mobile hotspot 25 GB", "International texting"],
  },
  {
    id: "orbit",
    name: "Orbit",
    price: 75,
    data: "Unlimited+",
    highlight: "Power users",
    perks: ["Priority 5G Ultra", "Hotspot 50 GB", "TravelPass days included", "Device protection discount"],
  },
];

app.get("/api/health", (_req, res) => {
  // DEMO: intentional failure so App Platform rejects this deploy
  res.status(503).json({ status: "error", service: "teleconnect", reason: "broken commit" });
});

app.get("/api/plans", (_req, res) => {
  res.json({ plans });
});

app.use(express.static(path.join(__dirname, "public")));

app.get("*", (_req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`TeleConnect listening on port ${PORT}`);
});
