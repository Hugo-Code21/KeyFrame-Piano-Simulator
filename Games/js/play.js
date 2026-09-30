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
  const pianoModes = new Set(["midi", "classical", "jazz", "pop"]);
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
  const state = {
    volume: Number(localStorage.getItem("keyframe-volume") || 70),
    pianoMode: pianoModes.has(localStorage.getItem("keyframe-piano-mode"))
      ? localStorage.getItem("keyframe-piano-mode")
      : "midi",
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
  const timelineStartedAt = performance.now();
  const timelineWindowMs = 8000;
  let audioContext = null;
  const activeVoices = new Map();
  const sampledInstruments = new Map();
  const instrumentLoads = new Map();
  const smplrModulePromise = import(
    "https://unpkg.com/smplr@1.0.0/dist/index.mjs"
  ).catch(() => null);
  const modeLabels = {
    midi: "MIDI",
    classical: "Classical",
    jazz: "Jazz",
    pop: "Pop",
  };
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

  const defaultBinding = (midi) => {
    const index = midi - firstMidi;
    return {
      code: keyboardLayout[index % keyboardLayout.length],
      shift: index >= keyboardLayout.length,
    };
  };
  const getBinding = (midi) =>
    isAllowedBinding(state.bindings[midi])
      ? state.bindings[midi]
      : defaultBinding(midi);
  const bindingLabel = (binding) => {
    if (typeof binding === "string") return binding;
    const code = binding.code;
    const label = code.startsWith("Key")
      ? code.slice(3).toLowerCase()
      : {
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
          }[code] || code;
    return `${binding.shift ? "Shift+" : ""}${label}`;
  };
  const bindingMatchesEvent = (binding, event) =>
    typeof binding === "string"
      ? binding === event.key.toLowerCase()
      : binding.code === event.code && binding.shift === event.shiftKey;
  const keyValueForCode = (code, shiftKey) => {
    if (code.startsWith("Key")) {
      const letter = code.slice(3);
      return shiftKey ? letter : letter.toLowerCase();
    }
    const values = {
      Minus: shiftKey ? "_" : "-",
      Equal: shiftKey ? "+" : "=",
      BracketLeft: shiftKey ? "{" : "[",
      BracketRight: shiftKey ? "}" : "]",
      Backslash: shiftKey ? "|" : "\\",
      Semicolon: shiftKey ? ":" : ";",
      Quote: shiftKey ? '"' : "'",
      Backquote: shiftKey ? "~" : "`",
      Comma: shiftKey ? "<" : ",",
      Period: shiftKey ? ">" : ".",
      Slash: shiftKey ? "?" : "/",
    };
    return values[code];
  };
  const findKey = (midi) =>
    keys.find((key) => key.dataset.midi === String(midi));
  const noteName = (midi) =>
    `${noteNames[midi % 12]}${Math.floor(midi / 12) - 1}`;
  const noteFrequency = (midi) => 440 * Math.pow(2, (midi - 69) / 12);
  const pianoProfiles = {
    midi: {
      partials: [[1, 1], [2, 0.24], [3, 0.08]],
      peak: 0.045,
      attack: 0.008,
      decay: 0.16,
      sustain: 0.42,
      release: 0.09,
    },
    classical: {
      partials: [[1, 1], [2, 0.32], [3, 0.15], [4, 0.065], [5, 0.025]],
      peak: 0.04,
      attack: 0.018,
      decay: 0.32,
      sustain: 0.52,
      release: 0.32,
    },
    jazz: {
      partials: [[1, 1], [2, 0.2], [3, 0.07], [4, 0.025]],
      detune: [0, 2.5, -2.5, 3.5],
      peak: 0.042,
      attack: 0.004,
      decay: 0.2,
      sustain: 0.36,
      release: 0.18,
    },
    pop: {
      partials: [[1, 1], [2, 0.42], [3, 0.2], [4, 0.1], [5, 0.05]],
      peak: 0.045,
      attack: 0.003,
      decay: 0.1,
      sustain: 0.28,
      release: 0.12,
    },
  };
  const ensureAudioContext = () => {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return null;
    audioContext ||= new AudioContext();
    return audioContext;
  };
  const loadPianoInstrument = (mode) => {
    if (sampledInstruments.has(mode))
      return Promise.resolve(sampledInstruments.get(mode));
    if (instrumentLoads.has(mode)) return instrumentLoads.get(mode);
    const context = ensureAudioContext();
    if (!context) return Promise.reject(new Error("Web Audio is unavailable"));

    const load = smplrModulePromise
      .then((library) => {
        if (!library) throw new Error("The sampled piano library did not load");
        const instrument =
          mode === "classical"
            ? library.SplendidGrandPiano(context)
            : library.Soundfont(context, {
                instrument:
                  mode === "jazz"
                    ? "electric_piano_1"
                    : mode === "pop"
                      ? "bright_acoustic_piano"
                      : "acoustic_grand_piano",
                kit: "FluidR3_GM",
              });
        return instrument.ready.then(() => instrument);
      })
      .then((instrument) => {
        sampledInstruments.set(mode, instrument);
        $("#piano-sound-status").textContent = `${modeLabels[mode]} piano samples ready`;
        return instrument;
      })
      .catch((error) => {
        $("#piano-sound-status").textContent = "Sample library unavailable; using synth";
        throw error;
      })
      .finally(() => instrumentLoads.delete(mode));
    instrumentLoads.set(mode, load);
    return load;
  };
  const startSampledNote = (midi, instrument) => {
    const context = ensureAudioContext();
    if (!context) return;
    if (context.state === "suspended") context.resume();
    instrument.output.volume = Math.round((state.volume / 100) * 127);
    const stop = instrument.start({
      note: Number(midi),
      velocity: 100,
      time: context.currentTime,
    });
    activeVoices.set(midi, { sampled: true, stop });
  };
  const playFallbackTone = (midi) => {
    const context = ensureAudioContext();
    if (!context) return;

    const now = context.currentTime;
    const fundamental = noteFrequency(midi);
    const profile = pianoProfiles[state.pianoMode] || pianoProfiles.midi;
    const envelope = context.createGain();
    const peak = (state.volume / 100) * profile.peak;
    const oscillators = profile.partials.map(([harmonic, level], index) => {
      const oscillator = context.createOscillator();
      const partial = context.createGain();
      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(fundamental * harmonic, now);
      if (profile.detune) oscillator.detune.setValueAtTime(profile.detune[index], now);
      partial.gain.value = level;
      oscillator.connect(partial).connect(envelope);
      oscillator.start(now);
      return oscillator;
    });

    envelope.gain.setValueAtTime(0.0001, now);
    envelope.gain.exponentialRampToValueAtTime(peak, now + profile.attack);
    envelope.gain.exponentialRampToValueAtTime(
      peak * profile.sustain,
      now + profile.decay,
    );
    envelope.connect(context.destination);
    activeVoices.set(midi, {
      envelope,
      oscillators,
      sampled: false,
    });
  };
  const playTone = (midi, pressStartedAt) => {
    if (state.volume <= 0) return;
    const context = ensureAudioContext();
    if (!context) return;
    if (context.state === "suspended") context.resume();

    const instrument = sampledInstruments.get(state.pianoMode);
    if (instrument) {
      startSampledNote(midi, instrument);
      return;
    }

    playFallbackTone(midi);
    $("#piano-sound-status").textContent = `Loading ${modeLabels[state.pianoMode]} piano samples`;
    loadPianoInstrument(state.pianoMode)
      .then((loadedInstrument) => {
        if (state.pressed.get(midi) !== pressStartedAt) return;
        const currentVoice = activeVoices.get(midi);
        if (currentVoice?.sampled) return;
        if (currentVoice) releaseTone(midi);
        startSampledNote(midi, loadedInstrument);
      })
      .catch(() => {});
  };
  const releaseTone = (midi) => {
    const voice = activeVoices.get(midi);
    if (!voice) return;
    if (voice.sampled) voice.stop({ time: audioContext.currentTime });
    else {
      const now = audioContext.currentTime;
      const stopAt = now + 0.005;
      voice.envelope.gain.cancelScheduledValues(now);
      voice.envelope.gain.setValueAtTime(
        Math.max(0.0001, voice.envelope.gain.value),
        now,
      );
      voice.envelope.gain.exponentialRampToValueAtTime(0.0001, stopAt);
      voice.oscillators.forEach((oscillator) =>
        oscillator.stop(stopAt + 0.002),
      );
    }
    activeVoices.delete(midi);
  };
  for (let midi = firstMidi; midi <= 108; midi += 1) {
    const note = noteNames[midi % 12];
    const key = document.createElement("button");
    key.className = `${blackNotes.has(note) ? "black-key" : "white-key"} key-${midi}`;
    key.dataset.midi = midi;
    key.dataset.note = noteName(midi);
    key.setAttribute("aria-label", noteName(midi));
    key.innerHTML = `<span>${noteName(midi)}</span><small class="key-bind">${bindingLabel(getBinding(midi))}</small>`;
    if (!blackNotes.has(note)) piano.appendChild(key);
    else {
      piano.querySelector(".white-key:last-child").appendChild(key);
      key.style.left = "calc(100% - 10px)";
    }
    keys.push(key);
  }
  const playableNotes = new Set();
  keyboardLayout.forEach((code) => {
    [false, true].forEach((shiftKey) => {
      const event = {
        code,
        shiftKey,
        key: keyValueForCode(code, shiftKey),
      };
      const key = keys.find((item) =>
        bindingMatchesEvent(getBinding(item.dataset.midi), event),
      );
      if (key) playableNotes.add(key.dataset.midi);
    });
  });
  keys.forEach((key) => {
    if (!playableNotes.has(key.dataset.midi))
      key.classList.add("keyboard-unbound");
  });

  const updateNoteBar = (note) => {
    if (!note.block) return;
    const laneCount = 108 - firstMidi + 1;
    const laneHeight = $("#note-stage").clientHeight / laneCount;
    const barHeight = Math.max(4, Math.min(8, laneHeight * 0.8));
    const elapsed = note.startedAt - timelineStartedAt;
    const left = ((elapsed % timelineWindowMs) / timelineWindowMs) * 100;
    const top = (108 - note.midi) * laneHeight + (laneHeight - barHeight) / 2;
    const width = Math.min(
      100 - left,
      Math.max(0.8, (note.duration / timelineWindowMs) * 100),
    );
    note.block.style.left = `${left}%`;
    note.block.style.top = `${top}px`;
    note.block.style.height = `${barHeight}px`;
    note.block.style.width = `${width}%`;
  };

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
            (note) => {
              const kind = note.kind || "Hold";
              return `<div class="recent-row"><b>${note.note}</b><span class="recent-kind recent-kind--${kind.toLowerCase()}">${kind}</span><span>${Math.round(note.duration)}ms</span></div>`;
            },
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
    playTone(midi, now);
    const previous = state.notes.at(-1);
    const note = {
      midi,
      note: key.dataset.note,
      startedAt: now,
      releasedAt: now,
      duration: 0,
      interval: previous ? now - previous.startedAt : null,
      previousReleased: previous
        ? previous.releasedAt !== previous.startedAt
        : false,
      kind: "Hold",
      block: null,
    };
    state.notes.push(note);
    if (
      note.previousReleased &&
      previous.duration < 250 &&
      note.interval !== null &&
      note.interval <= 180
    )
      previous.kind = "Fast";
    state.unique.add(midi);
    $("#stage-empty").style.display = "none";
    const block = document.createElement("div");
    block.className = `note-block ${midi % 3 === 0 ? "alt" : ""}`;
    block.textContent = note.note;
    block.title = `${note.note} - held`;
    $("#note-stage").appendChild(block);
    note.block = block;
    updateNoteBar(note);
    const animateBar = () => {
      if (state.pressed.get(midi) !== now) return;
      note.duration = performance.now() - now;
      updateNoteBar(note);
      note.animationFrame = window.requestAnimationFrame(animateBar);
    };
    note.animationFrame = window.requestAnimationFrame(animateBar);
    updateStats();
  };
  const releaseKey = (midi) => {
    const started = state.pressed.get(midi);
    const key = findKey(midi);
    if (started === undefined || !key) return;
    releaseTone(midi);
    const note = [...state.notes]
      .reverse()
      .find((item) => item.midi === midi && item.releasedAt === item.startedAt);
    if (note) {
      note.releasedAt = performance.now();
      note.duration = note.releasedAt - started;
      note.kind =
        note.duration >= 250
          ? "Hold"
          : note.previousReleased &&
              note.interval !== null &&
              note.interval <= 180
            ? "Fast"
            : "Tap";
      const seconds = ((note.startedAt - timelineStartedAt) / 1000).toFixed(1);
      note.block.title = `${note.note} at ${seconds}s - ${note.kind.toLowerCase()} - ${Math.round(note.duration)}ms`;
      window.cancelAnimationFrame(note.animationFrame);
      updateNoteBar(note);
      state.longest = Math.max(state.longest, note.duration);
      window.setTimeout(() => {
        note.block?.remove();
        if (!$("#note-stage").querySelector(".note-block"))
          $("#stage-empty").style.display = "grid";
      }, Math.max(3000, timelineWindowMs - (performance.now() - note.startedAt)));
    }
    state.pressed.delete(midi);
    key.classList.remove("active");
    updateStats();
  };
  const midiForKey = (event) =>
    keys.find((key) => bindingMatchesEvent(getBinding(key.dataset.midi), event))
      ?.dataset.midi;
  const midiForRelease = (event) =>
    keys.find((key) => {
      const midi = key.dataset.midi;
      const binding = getBinding(midi);
      return (
        state.pressed.has(midi) &&
        (typeof binding === "string"
          ? binding === event.key.toLowerCase()
          : binding.code === event.code)
      );
    })?.dataset.midi;
  window.addEventListener("keydown", (event) => {
    if (event.repeat) return;
    const midi = midiForKey(event);
    if (midi) {
      event.preventDefault();
      pressKey(midi);
    }
  });
  window.addEventListener("keyup", (event) => {
    const midi = midiForRelease(event);
    if (midi) releaseKey(midi);
  });
  window.addEventListener("blur", () => {
    state.pressed.forEach((_, midi) => releaseKey(midi));
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
  piano.addEventListener("pointercancel", (event) => {
    const key = event.target.closest("[data-midi]");
    if (key) releaseKey(key.dataset.midi);
  });
  piano.addEventListener("lostpointercapture", (event) => {
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
