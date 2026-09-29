(() => {
  "use strict";

  const songs = [
    {
      title: "EYES ON US", artist: "2frers", videoId: "CsQ59uMYB_Y", bpm: 132, offsetMs: 0,
      chart: [
        [[0, 0], [4, 1], [8, 2], [12, 3]], [[0, 2], [4, 0], [8, 3], [12, 1]],
        [[0, 1], [3, 2], [8, 0], [12, 3]], [[0, 3], [4, 2], [10, 1], [14, 0]],
        [[0, 0], [4, 2], [6, 3], [8, 1], [12, 2]], [[0, 3], [4, 1], [8, 0], [11, 2], [14, 1]],
        [[0, 1], [2, 0], [6, 2], [8, 3], [12, 0]], [[0, 2], [4, 3], [8, 1], [12, 0], [14, 2]],
        [[0, 0], [4, 1], [8, 2], [10, 3], [12, 1]], [[0, 3], [4, 0], [6, 1], [8, 2], [12, 3]],
        [[0, 1], [4, 2], [8, 0], [12, 1], [14, 3]], [[0, 2], [3, 1], [6, 0], [10, 3], [14, 2]],
        [[0, 0], [4, 3], [8, 1], [10, 2], [12, 0]], [[0, 3], [2, 1], [6, 2], [8, 0], [12, 1]],
        [[0, 2], [4, 0], [8, 3], [11, 1], [14, 0]], [[0, 1], [4, 2], [6, 3], [8, 1], [12, 3]],
      ],
    },
    {
      title: "I Still Hear Your Voice", artist: "Lynxie, johnny joined", videoId: "Oq_K2wZPP8Y", bpm: 120, offsetMs: 0,
      chart: [
        [[0, 0], [8, 2]], [[0, 1], [4, 3], [8, 2], [12, 0]],
        [[0, 2], [6, 1], [8, 3], [14, 0]], [[0, 3], [4, 1], [8, 0], [12, 2]],
        [[0, 1], [4, 0], [8, 3], [10, 2], [12, 1]], [[0, 2], [4, 3], [8, 1], [12, 0]],
        [[0, 0], [3, 2], [8, 1], [12, 3]], [[0, 3], [4, 2], [6, 1], [8, 0], [12, 2]],
        [[0, 0], [4, 1], [8, 3], [12, 2]], [[0, 2], [4, 0], [8, 1], [10, 3], [14, 2]],
        [[0, 1], [4, 3], [8, 2], [12, 0]], [[0, 3], [2, 1], [6, 0], [10, 2], [14, 1]],
        [[0, 2], [4, 1], [8, 0], [12, 3]], [[0, 0], [4, 2], [6, 3], [8, 1], [12, 0]],
        [[0, 1], [4, 0], [8, 2], [12, 3]], [[0, 3], [4, 1], [8, 0], [10, 2], [14, 3]],
      ],
    },
    {
      title: "whatdoyousee", artist: "prodBigMike, Glitch Cat", videoId: "R723k04E8Ic", bpm: 130, offsetMs: 0,
      chart: [
        [[0, 0], [4, 2], [8, 1], [12, 3]], [[0, 2], [2, 1], [6, 3], [10, 0], [14, 2]],
        [[0, 1], [4, 3], [8, 0], [12, 2]], [[0, 3], [4, 0], [6, 1], [10, 2], [14, 1]],
        [[0, 2], [4, 1], [8, 3], [12, 0]], [[0, 0], [3, 2], [6, 1], [10, 3], [14, 0]],
        [[0, 3], [4, 2], [8, 1], [12, 0]], [[0, 1], [2, 3], [6, 0], [8, 2], [14, 1]],
        [[0, 0], [4, 3], [8, 2], [12, 1]], [[0, 2], [4, 0], [6, 3], [10, 1], [14, 2]],
        [[0, 1], [4, 2], [8, 0], [12, 3]], [[0, 3], [2, 1], [6, 2], [10, 0], [14, 3]],
        [[0, 2], [4, 0], [8, 1], [12, 3]], [[0, 0], [4, 2], [6, 1], [10, 3], [14, 0]],
        [[0, 3], [4, 1], [8, 2], [12, 0]], [[0, 1], [2, 0], [6, 3], [8, 2], [14, 1]],
      ],
    },
    {
      title: "LAST TIME", artist: "Milkoi", videoId: "USsJ2Yi5r3c", bpm: 98, offsetMs: 0,
      chart: [
        [[0, 0], [4, 1], [8, 2], [12, 3]], [[0, 2], [4, 3], [8, 1], [12, 0]],
        [[0, 1], [2, 3], [6, 2], [10, 0], [14, 1]], [[0, 3], [4, 0], [8, 2], [12, 1]],
        [[0, 0], [4, 2], [8, 3], [10, 1], [14, 0]], [[0, 2], [4, 1], [8, 0], [12, 3]],
        [[0, 1], [4, 0], [6, 2], [10, 3], [14, 1]], [[0, 3], [2, 1], [6, 0], [8, 2], [12, 3]],
        [[0, 0], [4, 1], [8, 3], [12, 2]], [[0, 2], [4, 0], [6, 1], [10, 3], [14, 2]],
        [[0, 1], [4, 3], [8, 0], [12, 2]], [[0, 3], [2, 0], [6, 1], [10, 2], [14, 3]],
        [[0, 2], [4, 1], [8, 3], [12, 0]], [[0, 0], [4, 2], [6, 3], [10, 1], [14, 0]],
        [[0, 3], [4, 1], [8, 2], [12, 0]], [[0, 1], [2, 0], [6, 2], [8, 3], [14, 1]],
      ],
    },
    {
      title: "REWIND", artist: "DJ PUMA", videoId: "aVw71vt-U4s", bpm: 128, offsetMs: 0,
      chart: [
        [[0, 0], [4, 2], [8, 1], [12, 3]], [[0, 2], [2, 0], [6, 3], [10, 1], [14, 2]],
        [[0, 1], [4, 3], [8, 0], [12, 2]], [[0, 3], [4, 1], [6, 2], [10, 0], [14, 3]],
        [[0, 0], [4, 1], [8, 3], [12, 2]], [[0, 2], [2, 3], [6, 1], [10, 0], [14, 2]],
        [[0, 1], [4, 0], [8, 2], [12, 3]], [[0, 3], [4, 2], [6, 0], [10, 1], [14, 3]],
        [[0, 0], [4, 3], [8, 1], [12, 2]], [[0, 2], [2, 1], [6, 3], [10, 0], [14, 2]],
        [[0, 1], [4, 2], [8, 0], [12, 3]], [[0, 3], [2, 0], [6, 1], [10, 2], [14, 3]],
        [[0, 2], [4, 1], [8, 3], [12, 0]], [[0, 0], [2, 3], [6, 2], [10, 1], [14, 0]],
        [[0, 3], [4, 0], [8, 2], [12, 1]], [[0, 1], [2, 2], [6, 0], [10, 3], [14, 1]],
      ],
    },
  ];
  const difficultySettings = {
    Easy: { window: 210, speed: 1900, subdivisions: 0 },
    Normal: { window: 145, speed: 1650, subdivisions: 1 },
    Hard: { window: 90, speed: 1400, subdivisions: 2 },
  };
  const defaultKeyCodes = ["KeyD", "KeyF", "KeyJ", "KeyK"];
  const savedVolume = localStorage.getItem("keyframe-volume");
  const keyboardLayout = [
    ..."QWERTYUIOPASDFGHJKLZXCVBNM".split("").map((letter) => `Key${letter}`),
    "Backquote", "Minus", "Equal", "BracketLeft", "BracketRight", "Backslash",
    "Semicolon", "Quote", "Comma", "Period", "Slash",
  ];
  let savedKeyCodes = [];
  try {
    savedKeyCodes = JSON.parse(localStorage.getItem("keyframe-rhythm-bindings") || "[]");
  } catch {}
  const usedKeyCodes = new Set();
  const keyCodes = defaultKeyCodes.map((fallback, index) => {
    const saved = savedKeyCodes[index];
    const keyCode = keyboardLayout.includes(saved) && !usedKeyCodes.has(saved)
      ? saved
      : defaultKeyCodes.find((candidate) => !usedKeyCodes.has(candidate)) || fallback;
    usedKeyCodes.add(keyCode);
    return keyCode;
  });
  const $ = (selector) => document.querySelector(selector);
  const lanes = [...document.querySelectorAll(".lane")];
  const levelList = $("#level-list");
  let youtubePlayer = null;
  let youtubeReady = false;
  let loadedVideoId = null;
  const state = {
    level: 0,
    difficulty: "Easy",
    unlocked: Number(localStorage.getItem("keyframe-unlocked-level") || 1),
    score: 0,
    combo: 0,
    bestCombo: 0,
    hits: 0,
    misses: 0,
    notes: [],
    running: false,
    startedAt: 0,
    raf: 0,
    result: "",
    phase: "ready",
    pausedAt: 0,
    runId: 0,
    countdownTimer: 0,
    goTimer: 0,
    trackStartAt: 0,
    loadingTimer: 0,
    volume: Math.max(0, Math.min(1, Number(savedVolume === null ? 70 : savedVolume) / 100)),
  };

  const storedBest = () =>
    JSON.parse(localStorage.getItem("keyframe-best-scores") || "{}");
  const renderLevels = () => {
    levelList.innerHTML = songs
      .map((song, index) => {
        const locked = index + 1 > state.unlocked;
        return `<button class="level-button ${index === state.level ? "selected" : ""}" type="button" data-level="${index}" ${locked ? "disabled" : ""}><span class="level-number">${String(index + 1).padStart(2, "0")}</span><span class="level-copy"><strong>${song.title}</strong><small>${song.bpm} BPM</small></span><span class="level-mark">${locked ? "LOCK" : index + 1 < state.unlocked ? "CLEAR" : "▶"}</span></button>`;
      })
      .join("");
    levelList.querySelectorAll("[data-level]").forEach((button) =>
      button.addEventListener("click", () => {
        if (state.phase !== "ready" && state.phase !== "finished") return;
        state.level = Number(button.dataset.level);
        updateSongInfo();
        renderLevels();
        resetBoard();
      }),
    );
    $("#level-progress").textContent = `${state.unlocked} / ${songs.length} UNLOCKED`;
  };

  const updateSongInfo = () => {
    const song = songs[state.level];
    $("#song-title").textContent = song.title;
    $("#song-kicker").textContent = `LEVEL ${String(state.level + 1).padStart(2, "0")} / NCS RELEASE`;
    $("#play-title").textContent = song.title;
    $("#song-bpm").textContent = song.bpm;
    $("#track-source").href = `https://www.youtube.com/watch?v=${song.videoId}`;
    $("#track-source").textContent = `Watch ${song.artist} on NCS`;
    const best = storedBest()[`${state.level}-${state.difficulty}`] || 0;
    $("#best-score").textContent = `BEST ${String(best).padStart(6, "0")}`;
    lanes.forEach((lane, index) => {
      const label = bindingLabel(keyCodes[index]);
      lane.querySelector("b").textContent = label;
      $(".lane-keys").children[index].textContent = label;
    });
    if (youtubeReady && loadedVideoId !== song.videoId) {
      loadedVideoId = song.videoId;
      youtubePlayer.cueVideoById(song.videoId);
    }
  };

  const bindingLabel = (code) => code.startsWith("Key")
    ? code.slice(3)
    : ({ Backquote: "`", Minus: "-", Equal: "=", BracketLeft: "[", BracketRight: "]", Backslash: "\\", Semicolon: ";", Quote: "'", Comma: ",", Period: ".", Slash: "/" }[code] || code);

  const makeChart = (durationMs) => {
    const song = songs[state.level];
    const settings = difficultySettings[state.difficulty];
    const beatMs = 60000 / song.bpm;
    const stepMs = beatMs / 4;
    const startOffsetMs = song.offsetMs;
    const firstStep = Math.max(0, Math.ceil((settings.speed - startOffsetMs) / stepMs));
    const notes = [];
    for (let step = firstStep; step * stepMs + startOffsetMs < durationMs; step += 1) {
      const bar = Math.floor(step / 16) % song.chart.length;
      const slot = step % 16;
      const event = song.chart[bar].find(([eventStep]) => eventStep === slot);
      if (!event) continue;
      const onQuarterBeat = slot % 4 === 0;
      const onEighthBeat = slot % 2 === 0;
      const included = state.difficulty === "Easy"
        ? onQuarterBeat
        : state.difficulty === "Normal"
          ? onEighthBeat
          : true;
      if (included) {
        notes.push({
          beat: step / 4,
          lane: event[1],
          targetAt: step * stepMs + startOffsetMs,
          hit: false,
          missed: false,
          element: null,
        });
      }
    }
    notes.sort((a, b) => a.beat - b.beat);
    return { notes, beatMs, settings, duration: durationMs };
  };

  const resetBoard = () => {
    state.runId += 1;
    clearTimeout(state.countdownTimer);
    clearTimeout(state.goTimer);
    clearTimeout(state.loadingTimer);
    cancelAnimationFrame(state.raf);
    state.running = false;
    state.phase = "ready";
    state.pausedAt = 0;
    youtubePlayer?.stopVideo();
    state.notes.forEach((note) => note.element?.remove());
    state.notes = [];
    state.score = 0;
    state.combo = 0;
    state.hits = 0;
    state.misses = 0;
    $("#score-readout").textContent = "000000";
    $("#combo-readout").textContent = "0";
    $("#accuracy-readout").textContent = "100%";
    $("#song-progress").style.width = "0%";
    $("#board-message").classList.remove("is-hidden");
    $("#board-message strong").textContent = "READY?";
    $("#board-message span").textContent = "Choose a level and press start.";
    $("#start-button").disabled = false;
    $("#start-button").innerHTML = "<span>&#9654;</span> Start level";
    $("#pause-button").disabled = true;
    $("#pause-button").textContent = "Pause";
    $("#countdown").textContent = "";
    $("#result-overlay").hidden = true;
    updateSongInfo();
  };

  const updateHud = () => {
    $("#score-readout").textContent = String(state.score).padStart(6, "0");
    $("#combo-readout").textContent = state.combo;
    const judged = state.hits + state.misses;
    const accuracy = judged ? Math.round((state.hits / judged) * 100) : 100;
    $("#accuracy-readout").textContent = `${accuracy}%`;
    return accuracy;
  };

  const showJudge = (label, kind) => {
    const callout = $("#judge-callout");
    callout.textContent = label;
    callout.className = `judge-callout judge-${kind}`;
    callout.classList.remove("judge-pop");
    void callout.offsetWidth;
    callout.classList.add("judge-pop");
  };

  const missNote = (note) => {
    if (note.hit || note.missed) return;
    note.missed = true;
    note.element?.remove();
    state.misses += 1;
    state.combo = 0;
    showJudge("MISS", "miss");
    updateHud();
  };

  const getTrackElapsed = () =>
    Math.max(0, (youtubePlayer.getCurrentTime() - state.trackStartAt) * 1000);

  const hitLane = (laneIndex) => {
    if (state.phase !== "playing") return;
    const elapsed = getTrackElapsed();
    const settings = difficultySettings[state.difficulty];
    const note = state.notes
      .filter((item) => !item.hit && !item.missed && item.lane === laneIndex)
      .sort((a, b) => Math.abs(a.targetAt - elapsed) - Math.abs(b.targetAt - elapsed))[0];
    if (!note) {
      showJudge("-", "miss");
      return;
    }
    const delta = Math.abs(note.targetAt - elapsed);
    if (delta > settings.window * 1.55) {
      showJudge("-", "miss");
      return;
    }
    const judgment = delta <= settings.window * 0.38 ? "PERFECT" : delta <= settings.window ? "GREAT" : "GOOD";
    const points = judgment === "PERFECT" ? 100 : judgment === "GREAT" ? 70 : 40;
    note.hit = true;
    note.element?.remove();
    state.hits += 1;
    state.combo += 1;
    state.bestCombo = Math.max(state.bestCombo, state.combo);
    state.score += points + Math.min(50, Math.floor(state.combo / 10) * 10);
    lanes[laneIndex].classList.add("lane-hit");
    window.setTimeout(() => lanes[laneIndex].classList.remove("lane-hit"), 100);
    showJudge(judgment, judgment.toLowerCase());
    updateHud();
  };

  const applyTrackVolume = () => {
    if (!youtubePlayer) return;
    youtubePlayer.setVolume(Math.round(state.volume * 100));
    if (state.volume === 0) youtubePlayer.mute();
    else youtubePlayer.unMute();
  };

  const startChart = () => {
    clearTimeout(state.loadingTimer);
    const duration = youtubePlayer.getDuration();
    if (!duration || duration < 60 || duration > 180) {
      state.phase = "ready";
      $("#board-message strong").textContent = "TRACK UNAVAILABLE";
      $("#board-message span").textContent = "This level needs an NCS track between 1 and 3 minutes.";
      $("#board-message").classList.remove("is-hidden");
      $("#start-button").disabled = false;
      return;
    }
    state.trackStartAt = 0;
    state.chart = makeChart(duration * 1000);
    state.notes = state.chart.notes;
    state.running = true;
    state.phase = "playing";
    $("#board-message").classList.add("is-hidden");
    $("#start-button").textContent = "Playing";
    $("#pause-button").disabled = false;
    state.raf = requestAnimationFrame(animate);
  };

  const onYouTubeStateChange = (event) => {
    if (event.data === YT.PlayerState.PLAYING) {
      if (state.phase === "loading") startChart();
      else if (state.phase === "resume-pending") {
        state.phase = "playing";
        state.running = true;
        $("#board-message").classList.add("is-hidden");
        $("#pause-button").textContent = "Pause";
        state.raf = requestAnimationFrame(animate);
      }
    } else if (event.data === YT.PlayerState.PAUSED && state.phase === "playing") {
      state.phase = "paused";
      state.running = false;
      cancelAnimationFrame(state.raf);
      $("#board-message strong").textContent = "PAUSED";
      $("#board-message span").textContent = "Press continue when you are ready.";
      $("#board-message").classList.remove("is-hidden");
      $("#pause-button").textContent = "Continue";
    } else if (event.data === YT.PlayerState.ENDED && state.phase === "playing") {
      finishRun();
    }
  };

  const onYouTubeReady = (event) => {
    youtubePlayer = event.target;
    youtubeReady = true;
    applyTrackVolume();
    updateSongInfo();
    $("#start-button").disabled = false;
  };

  window.onYouTubeIframeAPIReady = () => {
    youtubePlayer = new YT.Player("youtube-player", {
      width: "100%",
      height: "100%",
      videoId: songs[state.level].videoId,
      playerVars: { controls: 1, playsinline: 1, rel: 0, enablejsapi: 1 },
      events: {
        onReady: onYouTubeReady,
        onStateChange: onYouTubeStateChange,
        onError: () => {
          state.phase = "ready";
          state.running = false;
          $("#start-button").disabled = false;
          $("#start-button").textContent = "Start level";
          $("#board-message strong").textContent = "TRACK UNAVAILABLE";
          $("#board-message span").textContent = "This video cannot be embedded. Open the NCS track instead.";
          $("#board-message").classList.remove("is-hidden");
        },
      },
    });
  };
  const youtubeApi = document.createElement("script");
  youtubeApi.src = "https://www.youtube.com/iframe_api";
  document.head.appendChild(youtubeApi);

  const finishRun = () => {
    state.running = false;
    state.phase = "finished";
    $("#pause-button").disabled = true;
    cancelAnimationFrame(state.raf);
    youtubePlayer?.stopVideo();
    const accuracy = updateHud();
    const won = accuracy >= 70;
    state.result = won ? "win" : "lose";
    if (won) {
      const bestScores = storedBest();
      const key = `${state.level}-${state.difficulty}`;
      bestScores[key] = Math.max(bestScores[key] || 0, state.score);
      localStorage.setItem("keyframe-best-scores", JSON.stringify(bestScores));
      if (state.level + 1 === state.unlocked && state.unlocked < songs.length) {
        state.unlocked += 1;
        localStorage.setItem("keyframe-unlocked-level", String(state.unlocked));
      }
        $("#result-title").textContent = "You Win!!";
        $("#result-message").textContent = "Congratulations! You may now proceed to the next level.";
      $("#result-kicker").textContent = "LEVEL CLEARED";
      $("#result-button").textContent = state.level < songs.length - 1 ? "Next level" : "Play again";
      renderLevels();
    } else {
      $("#result-title").textContent = "You lose!";
      $("#result-message").textContent = "Try Again!";
      $("#result-kicker").textContent = "RUN COMPLETE";
      $("#result-button").textContent = "Try again";
    }
    $("#final-score").textContent = state.score.toLocaleString();
    $("#final-accuracy").textContent = `${accuracy}%`;
    $("#result-overlay").hidden = false;
    $("#result-button").focus();
    updateSongInfo();
  };

  const animate = () => {
    if (state.phase !== "playing") return;
    const elapsed = getTrackElapsed();
    const chart = state.chart;
    $("#song-progress").style.width = `${Math.min(100, (elapsed / chart.duration) * 100)}%`;
    state.notes.forEach((note) => {
      if (note.hit || note.missed) return;
      const remaining = note.targetAt - elapsed;
      const position = 82 * (1 - remaining / chart.settings.speed);
      if (position > 96) {
        missNote(note);
        return;
      }
      if (position < -6) return;
      if (!note.element) {
        note.element = document.createElement("span");
        note.element.className = "fall-note";
        note.element.setAttribute("aria-hidden", "true");
        lanes[note.lane].appendChild(note.element);
      }
      note.element.style.top = `${position}%`;
      const approachScale = 2.4 - Math.min(1, Math.max(0, position / 82)) * 1.4;
      note.element.style.setProperty("--approach-scale", approachScale);
    });
    if (elapsed >= chart.duration) {
      finishRun();
      return;
    }
    state.raf = requestAnimationFrame(animate);
  };

  const startRun = () => {
    if (state.phase !== "ready" && state.phase !== "finished") return;
    if (!youtubeReady) {
      $("#board-message strong").textContent = "LOADING YOUTUBE";
      $("#board-message span").textContent = "The official music player is still loading.";
      $("#board-message").classList.remove("is-hidden");
      return;
    }
    resetBoard();
    state.phase = "loading";
    $("#start-button").disabled = true;
    $("#start-button").textContent = "Starting track...";
    $("#board-message strong").textContent = "GET READY";
    $("#board-message span").textContent = "Starting the NCS track...";
    $("#board-message").classList.remove("is-hidden");
    applyTrackVolume();
    youtubePlayer.seekTo(0, true);
    youtubePlayer.playVideo();
    state.loadingTimer = window.setTimeout(() => {
      if (state.phase !== "loading") return;
      state.phase = "ready";
      $("#start-button").disabled = false;
      $("#start-button").textContent = "Start level";
      $("#board-message strong").textContent = "TRACK DID NOT START";
      $("#board-message span").textContent = "Check the YouTube player or open the NCS link.";
    }, 12000);
  };

  document.addEventListener("keydown", (event) => {
    if (event.repeat || $("#result-overlay").hidden === false) return;
    const lane = keyCodes.indexOf(event.code);
    if (lane !== -1) {
      event.preventDefault();
      hitLane(lane);
    }
  });
  lanes.forEach((lane, index) => {
    lane.addEventListener("pointerdown", (event) => {
      event.preventDefault();
      lane.setPointerCapture(event.pointerId);
      hitLane(index);
    });
  });
  $("#difficulty-selector").addEventListener("change", (event) => {
    if ((state.phase !== "ready" && state.phase !== "finished") || event.target.name !== "difficulty") return;
    state.difficulty = event.target.value;
    updateSongInfo();
    resetBoard();
  });
  $("#start-button").addEventListener("click", startRun);
  $("#reset-button").addEventListener("click", resetBoard);
  $("#pause-button").addEventListener("click", async () => {
    if (state.phase === "playing") {
      state.running = false;
      state.phase = "paused";
      state.pausedAt = performance.now();
      cancelAnimationFrame(state.raf);
      $("#board-message strong").textContent = "PAUSED";
      $("#board-message span").textContent = "Press continue when you are ready.";
      $("#board-message").classList.remove("is-hidden");
      $("#pause-button").textContent = "Continue";
      youtubePlayer.pauseVideo();
    } else if (state.phase === "paused") {
      state.phase = "resume-pending";
      $("#pause-button").textContent = "Continuing...";
      youtubePlayer.playVideo();
    }
  });
  $("#result-button").addEventListener("click", () => {
    $("#result-overlay").hidden = true;
    if (state.result === "win" && state.level < songs.length - 1) {
      state.level += 1;
      renderLevels();
      updateSongInfo();
    }
    resetBoard();
    $("#start-button").focus();
  });

  renderLevels();
  updateSongInfo();
  resetBoard();
})();