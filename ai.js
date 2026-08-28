// AI assistant integration
const AI_ENDPOINT = "https://vibe-proxy-gqv4.onrender.com/v1/chat/completions";
const AI_AUTH = "Bearer sk-vibe-summer-2026";

async function aiRequest(message) {
  try {
    const res = await fetch(AI_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": AI_AUTH
      },
      body: JSON.stringify({
        model: "class-chat-model",
        messages: [
          { role: "user", content: message }
        ]
      })
    });
    const data = await res.json();
    const content = data?.choices?.[0]?.message?.content || "";
    return content;
  } catch (e) {
    console.error("AI error", e);
    return "AI assistant is currently unavailable.";
  }
}

window.initAIChat = function ({ messagesEl, inputEl, sendBtn, role }) {
  function addMessage(text, type) {
    const div = document.createElement("div");
    div.className = `ai-message ${type}`;
    div.textContent = text;
    messagesEl.appendChild(div);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  sendBtn.addEventListener("click", async () => {
    const text = inputEl.value.trim();
    if (!text) return;
    addMessage(text, "user");
    inputEl.value = "";
    const prefix = role === "carrier"
      ? "You are assisting a delivery carrier. "
      : "You are assisting an employer viewing delivery status. ";
    const reply = await aiRequest(prefix + text);
    addMessage(reply, "assistant");
  });
};

// Helper for cleaning addresses
window.aiCleanAddress = async function (rawText) {
  const prompt = `Clean and format this as a single delivery address only, no extra text: "${rawText}"`;
  const result = await aiRequest(prompt);
  return result;
};
