// Handles login screen and portal switching
document.addEventListener("DOMContentLoaded", () => {
  const employerBtn = document.getElementById("employer-btn");
  const carrierBtn = document.getElementById("carrier-btn");
  const passcodeModal = document.getElementById("passcode-modal");
  const passcodeTitle = document.getElementById("passcode-title");
  const passcodeInput = document.getElementById("passcode-input");
  const passcodeSubmit = document.getElementById("passcode-submit");
  const passcodeCancel = document.getElementById("passcode-cancel");
  const passcodeError = document.getElementById("passcode-error");

  let targetPortal = null;

  function showScreen(id) {
    document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
    const screen = document.getElementById(id);
    if (screen) screen.classList.add("active");
  }

  employerBtn.addEventListener("click", () => {
    targetPortal = "employer";
    passcodeTitle.textContent = "Employer Passcode";
    passcodeInput.value = "";
    passcodeError.textContent = "";
    passcodeModal.classList.remove("hidden");
  });

  carrierBtn.addEventListener("click", () => {
    targetPortal = "carrier";
    passcodeTitle.textContent = "Carrier Passcode";
    passcodeInput.value = "";
    passcodeError.textContent = "";
    passcodeModal.classList.remove("hidden");
  });

  passcodeCancel.addEventListener("click", () => {
    passcodeModal.classList.add("hidden");
    targetPortal = null;
  });

  passcodeSubmit.addEventListener("click", () => {
    const code = passcodeInput.value.trim();
    if (targetPortal === "employer") {
      if (code === "2010") {
        passcodeModal.classList.add("hidden");
        showScreen("employer-screen");
        window.currentUserRole = "employer";
        window.currentUserId = "employer-viewer";
        window.initEmployerPortal && window.initEmployerPortal();
      } else {
        passcodeError.textContent = "Incorrect employer passcode.";
      }
    } else if (targetPortal === "carrier") {
      if (code === "2014") {
        passcodeModal.classList.add("hidden");
        showScreen("carrier-screen");
        window.currentUserRole = "carrier";
        window.currentUserId = "carrier-main";
        window.initCarrierPortal && window.initCarrierPortal();
      } else {
        passcodeError.textContent = "Incorrect carrier passcode.";
      }
    }
  });

  const employerLogout = document.getElementById("employer-logout");
  const carrierLogout = document.getElementById("carrier-logout");

  employerLogout.addEventListener("click", () => {
    showScreen("login-screen");
  });

  carrierLogout.addEventListener("click", () => {
    showScreen("login-screen");
  });
});
