// Carrier portal logic (full access)
window.initCarrierPortal = function () {
  const userNameInput = document.getElementById("carrier-user-name");
  const userRoleSelect = document.getElementById("carrier-user-role");
  const addUserBtn = document.getElementById("carrier-add-user");
  const userListEl = document.getElementById("carrier-user-list");

  const addrTextInput = document.getElementById("carrier-address-text");
  const addrLatInput = document.getElementById("carrier-address-lat");
  const addrLngInput = document.getElementById("carrier-address-lng");
  const addAddrBtn = document.getElementById("carrier-add-address");
  const addrListEl = document.getElementById("carrier-address-list");

  const carCountPending = document.getElementById("car-count-pending");
  const carCountDelivered = document.getElementById("car-count-delivered");
  const carCountRevisit = document.getElementById("car-count-revisit");

  const currentAddrEl = document.getElementById("carrier-current-address");
  const nextBtn = document.getElementById("carrier-next-btn");
  const markDeliveredBtn = document.getElementById("carrier-mark-delivered");
  const markRevisitBtn = document.getElementById("carrier-mark-revisit");
  const carrierMapIframe = document.getElementById("carrier-map");
  const carrierEtaEl = document.getElementById("carrier-eta");

  const subNavBtns = document.querySelectorAll(".sub-nav-btn");
  const views = document.querySelectorAll(".portal-view");

  const historyListEl = document.getElementById("carrier-history-list");
  const statsContentEl = document.getElementById("carrier-stats-content");

  const timerText = document.getElementById("car-timer-text");
  const timerProgress = document.getElementById("car-timer-progress");

  const aiMessagesEl = document.getElementById("carrier-ai-messages");
  const aiInputEl = document.getElementById("carrier-ai-input");
  const aiSendBtn = document.getElementById("carrier-ai-send");

  // Sub navigation
  subNavBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      subNavBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const viewId = btn.dataset.view;
      views.forEach(v => v.classList.remove("active"));
      const view = document.getElementById(viewId);
      if (view) view.classList.add("active");
      if (viewId === "carrier-history-view") {
        window.renderHistory(historyListEl);
      } else if (viewId === "carrier-stats-view") {
        window.renderStats(statsContentEl);
      }
    });
  });

  // Users
  function renderUsers() {
    const users = window.dbGetUsers();
    userListEl.innerHTML = "";
    users.forEach(u => {
      const li = document.createElement("li");
      li.className = "user-item";
      li.innerHTML = `
        <span>${u.name} (${u.role})</span>
        <button class="secondary-btn" data-id="${u.id}">Delete</button>
      `;
      userListEl.appendChild(li);
    });
    userListEl.querySelectorAll("button").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.dataset.id;
        window.dbDeleteUser(id);
        renderUsers();
      });
    });
  }

  addUserBtn.addEventListener("click", () => {
    const name = userNameInput.value.trim();
    const role = userRoleSelect.value;
    if (!name) return;
    window.dbAddUser({ name, role });
    userNameInput.value = "";
    renderUsers();
  });

  // Addresses
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
          <button class="secondary-btn" data-action="center" data-id="${a.id}">Map</button>
          <button class="secondary-btn" data-action="edit" data-id="${a.id}">Edit</button>
          <button class="danger-btn" data-action="delete" data-id="${a.id}">Delete</button>
        </div>
      `;
      addrListEl.appendChild(li);
    });
    carCountPending.textContent = pending;
    carCountDelivered.textContent = delivered;
    carCountRevisit.textContent = revisit;

    addrListEl.querySelectorAll("button").forEach(btn => {
      const id = btn.dataset.id;
      const action = btn.dataset.action;
      btn.addEventListener("click", () => {
        const addr = window.dbGetAddress(id);
        if (!addr) return;
        if (action === "center") {
          window.updateMapIframe(carrierMapIframe, addr.lat, addr.lng);
          currentAddrEl.textContent = addr.text;
          window.updateEtaDistance(carrierEtaEl, addr);
          window.currentAddressId = addr.id;
        } else if (action === "edit") {
          addrTextInput.value = addr.text;
          addrLatInput.value = addr.lat;
          addrLngInput.value = addr.lng;
          addrTextInput.dataset.editId = addr.id;
        } else if (action === "delete") {
          window.dbDeleteAddress(id);
          renderAddresses();
        }
      });
    });
  }

  addAddrBtn.addEventListener("click", () => {
    const text = addrTextInput.value.trim();
    const lat = parseFloat(addrLatInput.value.trim());
    const lng = parseFloat(addrLngInput.value.trim());
    if (!text || isNaN(lat) || isNaN(lng)) return;

    const editId = addrTextInput.dataset.editId;
    if (editId) {
      window.dbUpdateAddress(editId, { text, lat, lng });
      addrTextInput.dataset.editId = "";
    } else {
      window.dbAddAddress({ text, lat, lng });
    }
    addrTextInput.value = "";
    addrLatInput.value = "";
    addrLngInput.value = "";
    renderAddresses();
  });

  // NEXT button
  nextBtn.addEventListener("click", () => {
    const nextAddr = window.getNextPendingAddress();
    if (!nextAddr) {
      currentAddrEl.textContent = "No pending addresses.";
      return;
    }
    currentAddrEl.textContent = nextAddr.text;
    window.currentAddressId = nextAddr.id;
    window.updateMapIframe(carrierMapIframe, nextAddr.lat, nextAddr.lng);
    window.openNavigation(nextAddr.lat, nextAddr.lng);
    window.updateEtaDistance(carrierEtaEl, nextAddr);
  });

  // Mark delivered / revisit
  function markStatus(status) {
    const addrId = window.currentAddressId;
    if (!addrId) return;
    const addr = window.dbGetAddress(addrId);
    if (!addr) return;
    const timestamp = new Date().toISOString();
    window.dbUpdateAddress(addrId, { status, timestamp });
    window.dbAddHistory({
      addressId: addrId,
      userId: window.currentUserId,
      status,
      timestamp
    });
    renderAddresses();
    window.renderHistory(historyListEl);
  }

  markDeliveredBtn.addEventListener("click", () => markStatus("delivered"));
  markRevisitBtn.addEventListener("click", () => markStatus("revisit"));

  // Timer
  window.startWeeklyTimer(timerText, timerProgress);

  // AI assistant
  window.initAIChat({
    messagesEl: aiMessagesEl,
    inputEl: aiInputEl,
    sendBtn: aiSendBtn,
    role: "carrier"
  });

  // Voice & image import
  window.initVoiceImport({
    startBtn: document.getElementById("carrier-voice-start"),
    outputEl: document.getElementById("carrier-voice-output"),
    onText: async (text) => {
      const cleaned = await window.aiCleanAddress(text);
      addrTextInput.value = cleaned || text;
    }
  });

  window.initImageImport({
    fileInput: document.getElementById("carrier-image-input"),
    importBtn: document.getElementById("carrier-image-import"),
    onText: async (text) => {
      const cleaned = await window.aiCleanAddress(text);
      addrTextInput.value = cleaned || text;
    }
  });

  // Settings hooks
  window.initSettings({
    importTextEl: document.getElementById("settings-import-text"),
    importBtn: document.getElementById("settings-import-btn"),
    exportHistoryBtn: document.getElementById("settings-export-history"),
    backupBtn: document.getElementById("settings-backup"),
    restoreFileInput: document.getElementById("settings-restore-file"),
    restoreBtn: document.getElementById("settings-restore"),
    deleteAllBtn: document.getElementById("settings-delete-all"),
    onDataChanged: () => {
      renderAddresses();
      renderUsers();
      window.renderHistory(historyListEl);
      window.renderStats(statsContentEl);
    }
  });

  // Initial render
  renderUsers();
  renderAddresses();
  window.renderHistory(historyListEl);
  window.renderStats(statsContentEl);
};
