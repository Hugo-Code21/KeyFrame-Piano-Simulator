(() => {
  "use strict";

  const keyboardLayout = [
    ..."QWERTYUIOPASDFGHJKLZXCVBNM".split("").map((letter) => `Key${letter}`),
    "Backquote", "Minus", "Equal", "BracketLeft", "BracketRight", "Backslash",
    "Semicolon", "Quote", "Comma", "Period", "Slash",
  ];
  const laneNames = ["Lane 1", "Lane 2", "Lane 3", "Lane 4"];
  const defaultBindings = ["KeyD", "KeyF", "KeyJ", "KeyK"];
  const volumeSlider = document.querySelector("#volume-slider");
  const volumeOutput = document.querySelector("#volume-output");
  const bindGrid = document.querySelector("#bind-grid");
  const toast = document.querySelector("#toast");
  let waitingBinding = null;

  const readBindings = () => {
    try {
      const saved = JSON.parse(localStorage.getItem("keyframe-rhythm-bindings") || "[]");
      const used = new Set();
      return defaultBindings.map((fallback, index) => {
        const savedBinding = saved[index];
        const binding = keyboardLayout.includes(savedBinding) && !used.has(savedBinding)
          ? savedBinding
          : defaultBindings.find((candidate) => !used.has(candidate)) || fallback;
        used.add(binding);
        return binding;
      });
    } catch {
      return [...defaultBindings];
    }
  };
  const bindings = readBindings();
  const bindingLabel = (code) => {
    if (code.startsWith("Key")) return code.slice(3);
    return {
      Backquote: "`", Minus: "-", Equal: "=", BracketLeft: "[",
      BracketRight: "]", Backslash: "\\", Semicolon: ";", Quote: "'",
      Comma: ",", Period: ".", Slash: "/",
    }[code] || code;
  };
  const showToast = (message) => {
    toast.textContent = message;
    toast.classList.add("show");
    window.setTimeout(() => toast.classList.remove("show"), 2200);
  };
  const renderBindings = () => {
    bindGrid.innerHTML = bindings
      .map((binding, index) =>
        `<button class="bind-key ${waitingBinding === index ? "awaiting" : ""}" data-lane="${index}" type="button">${bindingLabel(binding)}<small>${laneNames[index]}</small></button>`,
      )
      .join("");
    bindGrid.querySelectorAll("[data-lane]").forEach((button) =>
      button.addEventListener("click", () => {
        waitingBinding = Number(button.dataset.lane);
        renderBindings();
        showToast(`Press a key for ${laneNames[waitingBinding]}`);
      }),
    );
  };

  volumeSlider.value = Number(localStorage.getItem("keyframe-volume") || 70);
  volumeOutput.textContent = `${volumeSlider.value}%`;
  volumeSlider.addEventListener("input", () => {
    volumeOutput.textContent = `${volumeSlider.value}%`;
  });
  window.addEventListener("keydown", (event) => {
    if (waitingBinding === null || event.repeat || event.ctrlKey || event.altKey || event.metaKey) return;
    if (!keyboardLayout.includes(event.code)) return;
    if (bindings.some((binding, index) => index !== waitingBinding && binding === event.code)) {
      showToast("That key is already assigned.");
      return;
    }
    event.preventDefault();
    bindings[waitingBinding] = event.code;
    waitingBinding = null;
    renderBindings();
  });
  document.querySelector("#save-settings").addEventListener("click", () => {
    localStorage.setItem("keyframe-volume", volumeSlider.value);
    localStorage.setItem("keyframe-rhythm-bindings", JSON.stringify(bindings));
    showToast("Rhythm settings saved.");
    window.setTimeout(() => {
      window.location.href = "index.html";
    }, 500);
  });
  renderBindings();
})();
