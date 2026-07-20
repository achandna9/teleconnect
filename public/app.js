const plans = {
  signal: {
    name: "Signal",
    price: "$35",
    data: "15 GB high-speed data",
    highlight: "Everyday essentials",
    perks: ["Unlimited talk & text", "5G access", "Mobile hotspot 5 GB"],
  },
  pulse: {
    name: "Pulse",
    price: "$55",
    data: "Unlimited premium data",
    highlight: "Most popular",
    perks: [
      "Unlimited premium data",
      "5G Ultra",
      "Mobile hotspot 25 GB",
      "International texting",
    ],
  },
  orbit: {
    name: "Orbit",
    price: "$75",
    data: "Unlimited+ with priority",
    highlight: "Power users",
    perks: [
      "Priority 5G Ultra",
      "Hotspot 50 GB",
      "TravelPass days included",
      "Device protection discount",
    ],
  },
};

const stage = document.getElementById("plan-stage");
const kicker = document.getElementById("plan-kicker");
const nameEl = document.getElementById("plan-name");
const priceEl = document.getElementById("plan-price");
const dataEl = document.getElementById("plan-data");
const perksEl = document.getElementById("plan-perks");
const tabs = Array.from(document.querySelectorAll(".plan-tab"));
const header = document.querySelector(".site-header");
const year = document.getElementById("year");
const zipForm = document.getElementById("zip-form");
const zipResult = document.getElementById("zip-result");

year.textContent = String(new Date().getFullYear());

function renderPlan(id) {
  const plan = plans[id];
  if (!plan) return;

  stage.classList.add("is-swapping");

  window.setTimeout(() => {
    kicker.textContent = plan.highlight;
    nameEl.textContent = plan.name;
    priceEl.textContent = plan.price;
    dataEl.textContent = plan.data;
    perksEl.innerHTML = plan.perks.map((perk) => `<li>${perk}</li>`).join("");
    stage.classList.remove("is-swapping");
  }, 180);
}

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    tabs.forEach((t) => {
      t.classList.toggle("is-active", t === tab);
      t.setAttribute("aria-selected", t === tab ? "true" : "false");
    });
    renderPlan(tab.dataset.plan);
  });
});

renderPlan("signal");

window.addEventListener(
  "scroll",
  () => {
    header.classList.toggle("is-scrolled", window.scrollY > 12);
  },
  { passive: true }
);

zipForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const zip = new FormData(zipForm).get("zip");
  const lastDigit = Number(String(zip).slice(-1));
  const strength = lastDigit >= 7 ? "excellent" : lastDigit >= 3 ? "strong" : "good";

  zipResult.hidden = false;
  zipResult.textContent = `ZIP ${zip}: ${strength} TeleConnect 5G coverage in your area.`;
});
