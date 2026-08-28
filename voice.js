// Voice input using browser speech-to-text
window.initVoiceImport = function ({ startBtn, outputEl, onText }) {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    startBtn.disabled = true;
    outputEl.textContent = "Speech recognition not supported in this browser.";
    return;
  }

  const recognition = new SpeechRecognition();
  recognition.lang = "en-US";
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.onresult = async (event) => {
    const transcript = event.results[0][0].transcript;
    outputEl.textContent = `Heard: ${transcript}`;
    if (onText) {
      await onText(transcript);
    }
  };

  recognition.onerror = (event) => {
    outputEl.textContent = `Error: ${event.error}`;
  };

  startBtn.addEventListener("click", () => {
    outputEl.textContent = "Listening...";
    recognition.start();
  });
};
