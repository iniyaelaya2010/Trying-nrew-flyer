// Basic service worker registration (in main page) and SW file
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("sw.js").catch(err => {
    console.log("SW registration failed", err);
  });
}
