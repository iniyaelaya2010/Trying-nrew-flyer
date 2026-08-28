// Map helpers
window.updateMapIframe = function (iframeEl, lat, lng) {
  if (!iframeEl) return;
  const url = `https://www.google.com/maps?q=${lat},${lng}&z=16&output=embed`;
  iframeEl.src = url;
};

window.openNavigation = function (lat, lng) {
  const navUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=driving`;
  window.open(navUrl, "_blank");
};

// Simple ETA/distance placeholder (no real API)
window.updateEtaDistance = function (etaEl, address) {
  if (!etaEl || !address) return;
  // Fake values based on status
  let eta = "15-30 min";
  let distance = "5-10 km";
  etaEl.textContent = `ETA: ${eta} | Distance: ${distance}`;
};
