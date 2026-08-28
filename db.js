// Simple localStorage-based DB
const DB_KEY_PREFIX = "delivery_app_";

window.dbGet = function (key) {
  try {
    const raw = localStorage.getItem(DB_KEY_PREFIX + key);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    console.error("dbGet error", e);
    return null;
  }
};

window.dbSet = function (key, value) {
  try {
    localStorage.setItem(DB_KEY_PREFIX + key, JSON.stringify(value));
  } catch (e) {
    console.error("dbSet error", e);
  }
};

window.dbClear = function () {
  Object.keys(localStorage)
    .filter(k => k.startsWith(DB_KEY_PREFIX))
    .forEach(k => localStorage.removeItem(k));
};
