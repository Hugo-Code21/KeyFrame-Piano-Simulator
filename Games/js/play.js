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
  const state = {
    volume: Number(localStorage.getItem("keyframe-volume") || 70),
    bindings: JSON.parse(localStorage.getItem("keyframe-bindings") || "{}"),
    pressed: new Map(),
    notes: [],
    started: Date.now(),
    unique: new Set(),
    fastest: null,
    longest: 0,
  };
  const $ = (selector) => document.querySelector(selector);
  const keys = [];
  const piano = $("#piano");

  const getBinding = (midi) =>
    state.bindings[midi] || keyboardLayout[(midi - 21) % keyboardLayout.length];
  const findKey = (midi) =>
    keys.find((key) => key.dataset.midi === String(midi));
  const noteName = (midi) =>
    `${noteNames[midi % 12]}${Math.floor(midi / 12) - 1}`;
  for (let midi = 21; midi <= 108; midi += 1) {
    const note = noteNames[midi % 12];
    const key = document.createElement("button");
    key.className = `${blackNotes.has(note) ? "black-key" : "white-key"} key-${midi}`;
    key.dataset.midi = midi;
    key.dataset.note = noteName(midi);
    key.setAttribute("aria-label", noteName(midi));
    key.innerHTML = `<span>${noteName(midi)}</span><small class="key-bind">${getBinding(midi)}</small>`;
    if (!blackNotes.has(note)) piano.appendChild(key);
    else {
      piano.querySelector(".white-key:last-child").appendChild(key);
      key.style.left = "calc(100% - 10px)";
    }
    keys.push(key);
  }

  const updateStats = () => {
    const last = state.notes.at(-1);
    $("#active-note").textContent = last?.note || "--";
    $("#key-count").textContent = state.notes.length;
    $("#touch-count").textContent = state.notes.length;
    $("#unique-count").textContent = state.unique.size;
    $("#fastest-tap").textContent = state.fastest
      ? `${Math.round(state.fastest)}ms`
      : "--";
    $("#longest-hold").textContent = state.longest
      ? `${Math.round(state.longest)}ms`
      : "--";
    if (last?.interval) {
      $("#interval-readout").textContent = `${Math.round(last.interval)}ms`;
      state.fastest =
        state.fastest === null
          ? last.interval
          : Math.min(state.fastest, last.interval);
    }
    const energy = Math.min(
      100,
      state.notes.length * 7 + (last?.duration || 0) / 7,
    );
    $("#energy-meter").style.width = `${energy}%`;
    $("#energy-label").textContent =
      energy > 70 ? "charged" : energy > 30 ? "warming" : "quiet";
    $("#recent-list").innerHTML = state.notes.length
      ? state.notes
          .slice(-5)
          .reverse()
          .map(
            (note) =>
              `<div class="recent-row"><b>${note.note}</b><span>${Math.round(note.duration)}ms hold</span></div>`,
          )
          .join("")
      : '<span class="recent-empty">No notes yet.</span>';
  };
  const pressKey = (midi) => {
    const key = findKey(midi);
    if (!key || state.pressed.has(midi)) return;
    const now = performance.now();
    state.pressed.set(midi, now);
    key.classList.add("active");
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (state.volume > 0 && AudioContext) {
      const context = new AudioContext();
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.frequency.value = 440 * Math.pow(2, (midi - 69) / 12);
      oscillator.type = "sine";
      gain.gain.setValueAtTime(
        (state.volume / 100) * 0.035,
        context.currentTime,
      );
      gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.7);
      oscillator.connect(gain).connect(context.destination);
      oscillator.start();
      oscillator.stop(context.currentTime + 0.7);
    }
    const previous = state.notes.at(-1);
    const note = {
      midi,
      note: key.dataset.note,
      startedAt: now,
      releasedAt: now,
      duration: 0,
      interval: previous ? now - previous.releasedAt : null,
      block: null,
    };
    state.notes.push(note);
    state.unique.add(midi);
    $("#stage-empty").style.display = "none";
    const block = document.createElement("div");
    block.className = `note-block ${midi % 3 === 0 ? "alt" : ""}`;
    block.style.left = `${Math.min(92, 3 + ((state.notes.length * 11) % 91))}%`;
    block.innerHTML = `<small>${note.note}</small><strong>${getBinding(midi).toUpperCase()}</strong><span>tap</span>`;
    $("#note-stage").appendChild(block);
    note.block = block;
    updateStats();
  };
  const releaseKey = (midi) => {
    const started = state.pressed.get(midi);
    const key = findKey(midi);
    if (started === undefined || !key) return;
    const note = [...state.notes]
      .reverse()
      .find((item) => item.midi === midi && item.releasedAt === item.startedAt);
    if (note) {
      note.releasedAt = performance.now();
      note.duration = note.releasedAt - started;
      state.longest = Math.max(state.longest, note.duration);
      window.setTimeout(() => {
        note.block?.remove();
        if (!$("#note-stage").querySelector(".note-block"))
          $("#stage-empty").style.display = "grid";
      }, 3000);
    }
    state.pressed.delete(midi);
    key.classList.remove("active");
    updateStats();
  };
  const midiForKey = (pressedKey) =>
    keys.find(
      (key) => getBinding(key.dataset.midi) === pressedKey.toLowerCase(),
    )?.dataset.midi;
  window.addEventListener("keydown", (event) => {
    if (event.repeat) return;
    const midi = midiForKey(event.key);
    if (midi) {
      event.preventDefault();
      pressKey(midi);
    }
  });
  window.addEventListener("keyup", (event) => {
    const midi = midiForKey(event.key);
    if (midi) releaseKey(midi);
  });
  piano.addEventListener("pointerdown", (event) => {
    const key = event.target.closest("[data-midi]");
    if (key) {
      key.setPointerCapture(event.pointerId);
      pressKey(key.dataset.midi);
    }
  });
  piano.addEventListener("pointerup", (event) => {
    const key = event.target.closest("[data-midi]");
    if (key) releaseKey(key.dataset.midi);
  });
  piano.addEventListener("pointerleave", () =>
    state.pressed.forEach((_, midi) => releaseKey(midi)),
  );
  $("#clear-history").addEventListener("click", () => {
    state.notes = [];
    state.unique.clear();
    state.fastest = null;
    state.longest = 0;
    $("#note-stage")
      .querySelectorAll(".note-block")
      .forEach((block) => block.remove());
    $("#stage-empty").style.display = "grid";
    updateStats();
  });
  $("#reset-session").addEventListener("click", () => {
    $("#clear-history").click();
    state.started = Date.now();
  });
  window.setInterval(() => {
    const elapsed = Math.floor((Date.now() - state.started) / 1000);
    $("#session-time").textContent =
      `${String(Math.floor(elapsed / 60)).padStart(2, "0")}:${String(elapsed % 60).padStart(2, "0")}`;
  }, 1000);
  updateStats();
})();
