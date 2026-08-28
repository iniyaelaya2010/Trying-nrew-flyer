// NEXT address helper
window.getNextPendingAddress = function () {
  const addresses = window.dbGetAddresses();
  return addresses.find(a => a.status === "pending") || null;
};
