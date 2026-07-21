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

const chatWidget = document.getElementById("chat-widget");
const chatPanel = document.getElementById("chat-panel");
const chatLauncher = document.getElementById("chat-launcher");
const chatClose = document.getElementById("chat-close");
const chatForm = document.getElementById("chat-form");
const chatInput = document.getElementById("chat-input");
const chatSend = document.getElementById("chat-send");
const chatMessages = document.getElementById("chat-messages");

const chatHistory = [];
const GREETING =
  "Hi — I'm the TeleConnect helper. Ask about plans, coverage, or switching.";

function appendBubble(text, kind) {
  const bubble = document.createElement("div");
  bubble.className = `chat-bubble ${kind}`;
  bubble.textContent = text;
  chatMessages.appendChild(bubble);
  chatMessages.scrollTop = chatMessages.scrollHeight;
  return bubble;
}

function setChatOpen(open) {
  chatPanel.hidden = !open;
  chatPanel.setAttribute("aria-hidden", open ? "false" : "true");
  chatLauncher.setAttribute("aria-expanded", open ? "true" : "false");
  chatWidget.classList.toggle("is-open", open);
  if (open) {
    chatInput.focus();
  }
}

function setChatBusy(busy) {
  chatInput.disabled = busy;
  chatSend.disabled = busy;
}

chatLauncher.addEventListener("click", () => {
  setChatOpen(chatPanel.hidden);
});

chatClose.addEventListener("click", () => {
  setChatOpen(false);
});

appendBubble(GREETING, "bot");

chatForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const content = chatInput.value.trim();
  if (!content) return;

  appendBubble(content, "user");
  chatHistory.push({ role: "user", content });
  chatInput.value = "";
  setChatBusy(true);

  const pending = appendBubble("Thinking…", "bot pending");

  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: chatHistory }),
    });

    const data = await response.json().catch(() => ({}));
    pending.remove();

    if (!response.ok) {
      appendBubble(data.error || "Something went wrong. Please try again.", "error");
      return;
    }

    const reply = data.reply || "I could not generate a reply.";
    appendBubble(reply, "bot");
    chatHistory.push({ role: "assistant", content: reply });
  } catch (_err) {
    pending.remove();
    appendBubble("Network error. Check your connection and try again.", "error");
  } finally {
    setChatBusy(false);
    chatInput.focus();
  }
});
