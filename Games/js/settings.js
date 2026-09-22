(() => {
  "use strict";

  const noteNames = [
    "C",
    "C#",
    "D",
    "D#",
    "E",
    "F",
    "F#",
    "G",
    "G#",
    "A",
    "A#",
    "B",
  ];
  const blackNotes = new Set(["C#", "D#", "F#", "G#", "A#"]);
  const keyboardLayout = "awsedftgyhujkolp;".split("");
  const volumeSlider = document.querySelector("#volume-slider");
  const volumeOutput = document.querySelector("#volume-output");
  const bindGrid = document.querySelector("#bind-grid");
  const toast = document.querySelector("#toast");
  const bindings = JSON.parse(
    localStorage.getItem("keyframe-bindings") || "{}",
  );
  let waitingBinding = null;

  const showToast = (message) => {
    toast.textContent = message;
    toast.classList.add("show");
    window.setTimeout(() => toast.classList.remove("show"), 2200);
  };
  const getBinding = (midi) =>
    bindings[midi] || keyboardLayout[(midi - 21) % keyboardLayout.length];
  const getNote = (midi) =>
    `${noteNames[midi % 12]}${Math.floor(midi / 12) - 1}`;
  const renderBindings = () => {
    bindGrid.innerHTML = Array.from({ length: 16 }, (_, index) => 21 + index)
      .filter((midi) => !blackNotes.has(noteNames[midi % 12]))
      .map(
        (midi) =>
          `<button class="bind-key ${waitingBinding === midi ? "awaiting" : ""}" data-midi="${midi}" type="button">${getBinding(midi).toUpperCase()}<small>${getNote(midi)}</small></button>`,
      )
      .join("");
    bindGrid.querySelectorAll("[data-midi]").forEach((button) =>
      button.addEventListener("click", () => {
        waitingBinding = Number(button.dataset.midi);
        renderBindings();
        showToast(`Press a new key for ${getNote(waitingBinding)}`);
      }),
    );
  };

  volumeSlider.value = Number(localStorage.getItem("keyframe-volume") || 70);
  volumeOutput.textContent = `${volumeSlider.value}%`;
  volumeSlider.addEventListener("input", () => {
    volumeOutput.textContent = `${volumeSlider.value}%`;
  });
  window.addEventListener("keydown", (event) => {
    if (waitingBinding === null) return;
    if (event.key.length !== 1) return;
    bindings[waitingBinding] = event.key.toLowerCase();
    waitingBinding = null;
    renderBindings();
  });
  document.querySelector("#save-settings").addEventListener("click", () => {
    localStorage.setItem("keyframe-volume", volumeSlider.value);
    localStorage.setItem("keyframe-bindings", JSON.stringify(bindings));
    showToast("Configuration saved.");
    window.setTimeout(() => {
      window.location.href = "index.html";
    }, 500);
  });
  renderBindings();
})();
