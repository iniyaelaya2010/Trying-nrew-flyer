// Statistics rendering
window.renderStats = function (containerEl) {
  const addresses = window.dbGetAddresses();
  const history = window.dbGetHistory();

  const total = addresses.length;
  const pending = addresses.filter(a => a.status === "pending").length;
  const delivered = addresses.filter(a => a.status === "delivered").length;
  const revisit = addresses.filter(a => a.status === "revisit").length;

  const byUser = {};
  history.forEach(h => {
    if (!byUser[h.userId]) byUser[h.userId] = { delivered: 0, revisit: 0 };
    if (h.status === "delivered") byUser[h.userId].delivered++;
    if (h.status === "revisit") byUser[h.userId].revisit++;
  });

  const users = window.dbGetUsers();

  let html = `
    <p>Total addresses: ${total}</p>
    <p>Pending: ${pending}</p>
    <p>Delivered: ${delivered}</p>
    <p>Revisit: ${revisit}</p>
    <h4>Per-user performance</h4>
  `;

  users.forEach(u => {
    const stats = byUser[u.id] || { delivered: 0, revisit: 0 };
    html += `<p>${u.name} (${u.role}): Delivered ${stats.delivered}, Revisit ${stats.revisit}</p>`;
  });

  containerEl.innerHTML = html;
};
