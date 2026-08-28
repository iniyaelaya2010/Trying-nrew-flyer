// History rendering
window.renderHistory = function (listEl) {
  const history = window.dbGetHistory();
  const addresses = window.dbGetAddresses();
  const users = window.dbGetUsers();

  listEl.innerHTML = "";
  history
    .slice()
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .forEach(h => {
      const addr = addresses.find(a => a.id === h.addressId);
      const user = users.find(u => u.id === h.userId);
      const li = document.createElement("li");
      li.className = "history-item";
      li.innerHTML = `
        <div>
          <span>${addr ? addr.text : "Unknown address"}</span>
          <small>${h.status} by ${user ? user.name : "Unknown"} at ${h.timestamp}</small>
        </div>
      `;
      listEl.appendChild(li);
    });
};
