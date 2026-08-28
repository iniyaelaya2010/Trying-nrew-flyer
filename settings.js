// Settings page logic
window.initSettings = function ({
  importTextEl,
  importBtn,
  exportHistoryBtn,
  backupBtn,
  restoreFileInput,
  restoreBtn,
  deleteAllBtn,
  onDataChanged
}) {
  importBtn.addEventListener("click", () => {
    const text = importTextEl.value.trim();
    if (!text) return;
    // Simple CSV/text: each line is "address,lat,lng" or just address
    const lines = text.split(/\r?\n/);
    lines.forEach(line => {
      const parts = line.split(",");
      if (parts.length >= 3) {
        const addrText = parts[0].trim();
        const lat = parseFloat(parts[1].trim());
        const lng = parseFloat(parts[2].trim());
        if (addrText && !isNaN(lat) && !isNaN(lng)) {
          window.dbAddAddress({ text: addrText, lat, lng });
        }
      } else if (parts.length === 1 && parts[0].trim()) {
        // If only address text, ask AI to guess lat/lng? For now, set 0,0.
        window.dbAddAddress({ text: parts[0].trim(), lat: 0, lng: 0 });
      }
    });
    importTextEl.value = "";
    onDataChanged && onDataChanged();
  });

  exportHistoryBtn.addEventListener("click", () => {
    const history = window.dbGetHistory();
    const addresses = window.dbGetAddresses();
    const users = window.dbGetUsers();

    let csv = "id,address,user,status,timestamp\n";
    history.forEach(h => {
      const addr = addresses.find(a => a.id === h.addressId);
      const user = users.find(u => u.id === h.userId);
      csv += `${h.id},"${addr ? addr.text : ""}",${user ? user.name : ""},${h.status},${h.timestamp}\n`;
    });

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "history.csv";
    a.click();
    URL.revokeObjectURL(url);
  });

  backupBtn.addEventListener("click", () => {
    const data = {
      users: window.dbGetUsers(),
      addresses: window.dbGetAddresses(),
      history: window.dbGetHistory()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "backup.json";
    a.click();
    URL.revokeObjectURL(url);
  });

  restoreBtn.addEventListener("click", () => {
    const file = restoreFileInput.files && restoreFileInput.files[0];
    if (!file) {
      alert("Select a backup JSON file first.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result);
        window.dbSetUsers(data.users || []);
        window.dbSetAddresses(data.addresses || []);
        window.dbSetHistory(data.history || []);
        onDataChanged && onDataChanged();
        alert("Restore complete.");
      } catch (e) {
        alert("Invalid backup file.");
      }
    };
    reader.readAsText(file);
  });

  deleteAllBtn.addEventListener("click", () => {
    if (!confirm("Delete all users, addresses, and history?")) return;
    window.dbClear();
    onDataChanged && onDataChanged();
  });
};
