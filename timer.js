// Weekly countdown timer: Thu 00:00 → Fri 17:00
window.startWeeklyTimer = function (textEl, progressEl) {
  function update() {
    const now = new Date();

    // Find current week's Thursday 00:00 and Friday 17:00
    const day = now.getDay(); // 0=Sun
    const diffToThu = (4 - day + 7) % 7; // Thursday
    const diffToFri = (5 - day + 7) % 7; // Friday

    const start = new Date(now);
    start.setHours(0, 0, 0, 0);
    start.setDate(now.getDate() + diffToThu);

    const end = new Date(now);
    end.setHours(17, 0, 0, 0);
    end.setDate(now.getDate() + diffToFri);

    let total = end - start;
    let remaining = end - now;

    if (remaining < 0) {
      // After Friday 5 PM, next week
      start.setDate(start.getDate() + 7);
      end.setDate(end.getDate() + 7);
      total = end - start;
      remaining = end - now;
    }

    const pct = Math.max(0, Math.min(100, (1 - remaining / total) * 100));

    const hours = Math.floor(remaining / (1000 * 60 * 60));
    const minutes = Math.floor((remaining / (1000 * 60)) % 60);

    if (textEl) {
      textEl.textContent = `Time remaining: ${hours}h ${minutes}m`;
    }
    if (progressEl) {
      progressEl.style.width = `${pct}%`;
    }
  }

  update();
  setInterval(update, 60000);
};
