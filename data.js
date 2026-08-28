// Data helpers built on top of db.js
window.dbAddUser = function ({ name, role }) {
  const users = window.dbGetUsers();
  const id = "u_" + Date.now() + "_" + Math.random().toString(16).slice(2);
  users.push({ id, name, role });
  window.dbSetUsers(users);
};

window.dbDeleteUser = function (id) {
  const users = window.dbGetUsers().filter(u => u.id !== id);
  window.dbSetUsers(users);
};

window.dbGetUsers = function () {
  return window.dbGet("users") || [];
};

window.dbSetUsers = function (users) {
  window.dbSet("users", users);
};

window.dbAddAddress = function ({ text, lat, lng }) {
  const addresses = window.dbGetAddresses();
  const id = "a_" + Date.now() + "_" + Math.random().toString(16).slice(2);
  addresses.push({
    id,
    text,
    lat,
    lng,
    status: "pending",
    timestamp: null
  });
  window.dbSetAddresses(addresses);
};

window.dbGetAddresses = function () {
  return window.dbGet("addresses") || [];
};

window.dbSetAddresses = function (addresses) {
  window.dbSet("addresses", addresses);
};

window.dbGetAddress = function (id) {
  return window.dbGetAddresses().find(a => a.id === id) || null;
};

window.dbUpdateAddress = function (id, updates) {
  const addresses = window.dbGetAddresses().map(a => {
    if (a.id === id) {
      return { ...a, ...updates };
    }
    return a;
  });
  window.dbSetAddresses(addresses);
};

window.dbDeleteAddress = function (id) {
  const addresses = window.dbGetAddresses().filter(a => a.id !== id);
  window.dbSetAddresses(addresses);
};

window.dbAddHistory = function ({ addressId, userId, status, timestamp }) {
  const history = window.dbGetHistory();
  const id = "h_" + Date.now() + "_" + Math.random().toString(16).slice(2);
  history.push({ id, addressId, userId, status, timestamp });
  window.dbSetHistory(history);
};

window.dbGetHistory = function () {
  return window.dbGet("history") || [];
};

window.dbSetHistory = function (history) {
  window.dbSet("history", history);
};
