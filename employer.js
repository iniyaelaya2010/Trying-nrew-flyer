// Employer portal logic (read-only)
window.initEmployerPortal = function () {
  const addrListEl = document.getElementById("employer-address-list");
  const empCountPending = document.getElementById("emp-count-pending");
  const empCountDelivered = document.getElementById("emp-count-delivered");
  const empCountRevisit = document.getElementById("emp-count-revisit");
  const empMapIframe = document.getElementById("employer-map");
  const empEtaEl = document.getElementById("employer-eta");
  const timerText = document.getElementById("emp-timer-text");
  const timerProgress = document.getElementById("emp-timer-progress");

  const aiMessagesEl = document.getElementById("employer-ai-messages");
  const aiInputEl = document.getElementById("employer-ai-input");
  const aiSendBtn = document.getElementById("employer-ai-send");

  function renderAddresses() {
    const addresses = window.dbGetAddresses();
    addrListEl.innerHTML = "";
    let pending = 0, delivered = 0, revisit = 0;
    addresses.forEach(a => {
      if (a.status === "pending") pending++;
      else if (a.status === "delivered") delivered++;
      else if (a.status === "revisit") revisit++;

      const li = document.createElement("li");
      li.className = "address-item";
      li.innerHTML = `
        <div>
          <span>${a.text}</span>
          <small>Status: ${a.status}</small>
        </div>
        <div class="address-actions">
          <button class="secondary-btn" data-id="${a.id}">View</button>
        </div>
      `;
      addrListEl.appendChild(li);
    });
    empCountPending.textContent = pending;
    empCountDelivered.textContent = delivered;
    empCountRevisit.textContent = revisit;

    addrListEl.querySelectorAll("button").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.dataset.id;
        const addr = window.dbGetAddress(id);
        if (!addr) return;
        window.updateMapIframe(empMapIframe, addr.lat, addr.lng);
        window.updateEtaDistance(empEtaEl, addr);
      });
    });
  }

  window.startWeeklyTimer(timerText, timerProgress);

  window.initAIChat({
    messagesEl: aiMessagesEl,
    inputEl: aiInputEl,
    sendBtn: aiSendBtn,
    role: "employer"
  });

  renderAddresses();
};
