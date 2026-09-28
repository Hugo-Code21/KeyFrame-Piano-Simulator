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
  const keyboardLayout = [
    ..."QWERTYUIOPASDFGHJKLZXCVBNM"
      .split("")
      .map((letter) => `Key${letter}`),
    "Backquote",
    "Minus",
    "Equal",
    "BracketLeft",
    "BracketRight",
    "Backslash",
    "Semicolon",
    "Quote",
    "Comma",
    "Period",
    "Slash",
  ];
  const volumeSlider = document.querySelector("#volume-slider");
  const volumeOutput = document.querySelector("#volume-output");
  const pianoModeSelector = document.querySelector("#piano-mode-selector");
  const bindGrid = document.querySelector("#bind-grid");
  const toast = document.querySelector("#toast");
  const pianoModes = ["midi", "classical", "jazz", "pop"];
  const bindings = JSON.parse(
    localStorage.getItem("keyframe-bindings") || "{}",
  );
  let waitingBinding = null;
  const firstMidi = 60;
  const allowedSymbols = new Set([
    "-",
    "=",
    "[",
    "]",
    "\\",
    ";",
    "'",
    "`",
    ",",
    ".",
    "/",
    "_",
    "+",
    "{",
    "}",
    "|",
    ":",
    '"',
    "~",
    "<",
    ">",
    "?",
  ]);
  const isAllowedBinding = (binding) =>
    typeof binding === "string"
      ? /^[a-z]$/i.test(binding) || allowedSymbols.has(binding)
      : Boolean(
          binding &&
            keyboardLayout.includes(binding.code) &&
            typeof binding.shift === "boolean",
        );
  Object.keys(bindings).forEach((midi) => {
    if (!isAllowedBinding(bindings[midi])) delete bindings[midi];
  });

  const showToast = (message) => {
    toast.textContent = message;
    toast.classList.add("show");
    window.setTimeout(() => toast.classList.remove("show"), 2200);
  };
  const defaultBinding = (midi) => {
    const index = midi - firstMidi;
    return {
      code: keyboardLayout[index % keyboardLayout.length],
      shift: index >= keyboardLayout.length,
    };
  };
  const getBinding = (midi) => bindings[midi] || defaultBinding(midi);
  const bindingLabel = (binding) => {
    if (typeof binding === "string") return binding;
    const code = binding.code;
    const label = code.startsWith("Key")
      ? code.slice(3).toLowerCase()
      : ({
            Minus: "-",
            Equal: "=",
            BracketLeft: "[",
            BracketRight: "]",
            Backslash: "\\",
            Semicolon: ";",
            Quote: "'",
            Backquote: "`",
            Comma: ",",
            Period: ".",
            Slash: "/",
          }[code] || code);
    return `${binding.shift ? "Shift+" : ""}${label}`;
  };
  const getNote = (midi) =>
    `${noteNames[midi % 12]}${Math.floor(midi / 12) - 1}`;
  const renderBindings = () => {
    bindGrid.innerHTML = Array.from(
      { length: 108 - firstMidi + 1 },
      (_, index) => firstMidi + index,
    )
      .map(
        (midi) =>
          `<button class="bind-key ${waitingBinding === midi ? "awaiting" : ""}" data-midi="${midi}" type="button">${bindingLabel(getBinding(midi)).toUpperCase()}<small>${getNote(midi)}</small></button>`,
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
  const savedPianoMode = localStorage.getItem("keyframe-piano-mode");
  if (pianoModes.includes(savedPianoMode)) {
    pianoModeSelector.querySelector(
      `input[value="${savedPianoMode}"]`,
    ).checked = true;
  }
  volumeSlider.addEventListener("input", () => {
    volumeOutput.textContent = `${volumeSlider.value}%`;
  });
  window.addEventListener("keydown", (event) => {
    if (waitingBinding === null) return;
    if (!keyboardLayout.includes(event.code)) return;
    bindings[waitingBinding] = {
      code: event.code,
      shift: event.shiftKey,
    };
    waitingBinding = null;
    renderBindings();
  });
  document.querySelector("#save-settings").addEventListener("click", () => {
    localStorage.setItem("keyframe-volume", volumeSlider.value);
    localStorage.setItem(
      "keyframe-piano-mode",
      pianoModeSelector.querySelector("input:checked").value,
    );
    localStorage.setItem("keyframe-bindings", JSON.stringify(bindings));
    showToast("Configuration saved.");
    window.setTimeout(() => {
      window.location.href = "index.html";
    }, 500);
  });
  renderBindings();
})();
