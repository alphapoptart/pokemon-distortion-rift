/* G.Audio — WebAudio chiptune engine. Songs + SFX + procedural cries.
   init() must be called from a user gesture. All calls are safe before init (no-op). */
window.G = window.G || {};
(function () {
  "use strict";
  var U = G.Util;

  var ctx = null, master = null, musicGain = null, sfxGain = null;
  var enabled = true, ready = false;
  var currentSong = null, schedTimer = null, stepIdx = 0, nextStepTime = 0;

  function midi(m) { return 440 * Math.pow(2, (m - 69) / 12); }

  /* ---------------- Song data ----------------
     Each song: { tempo (bpm, eighth-note steps), wave, lead:[midi...], bass:[midi...] }
     0 = rest. Arrays loop; lead/bass may differ in length (each wraps). */
  var SONGS = {
    title: { tempo: 84, wave: "square",
      lead: [57,0,60,0, 64,0,67,69, 67,0,64,0, 62,0,60,0, 57,0,0,0, 52,0,55,0, 57,0,60,0, 64,0,0,0],
      bass: [45,0,0,0, 41,0,0,0, 43,0,0,0, 45,0,0,0, 40,0,0,0, 43,0,0,0, 45,0,0,0, 45,0,43,0] },
    town: { tempo: 112, wave: "square",
      lead: [72,74,76,74, 79,0,76,0, 74,72,74,76, 74,0,0,0, 72,74,76,74, 79,81,79,76, 74,76,74,72, 72,0,0,0],
      bass: [48,0,55,0, 53,0,55,0, 48,0,55,0, 48,0,43,0, 48,0,55,0, 53,0,55,0, 48,0,55,0, 48,0,48,0] },
    route: { tempo: 128, wave: "square",
      lead: [64,0,67,0, 69,0,67,64, 62,0,64,0, 67,0,0,0, 64,0,67,0, 69,71,72,71, 69,67,69,0, 64,0,0,0],
      bass: [40,0,40,0, 45,0,45,0, 41,0,41,0, 43,0,43,0, 40,0,40,0, 45,0,45,0, 43,0,47,0, 48,0,43,0] },
    gym: { tempo: 140, wave: "sawtooth",
      lead: [52,52,55,52, 57,52,55,52, 53,53,57,53, 60,57,55,53, 52,52,55,52, 57,60,62,60, 57,55,53,55, 52,0,50,0],
      bass: [40,40,0,40, 40,0,40,0, 41,41,0,41, 41,0,41,0, 40,40,0,40, 40,0,40,0, 43,0,45,0, 47,0,48,0] },
    "battle-wild": { tempo: 150, wave: "square",
      lead: [64,64,0,64, 0,67,0,69, 0,67,64,0, 62,0,64,0, 64,64,0,64, 0,72,0,69, 67,0,65,67, 69,0,0,0],
      bass: [40,0,40,40, 0,40,0,43, 0,40,0,38, 36,0,36,36, 40,0,40,40, 0,40,0,43, 45,0,43,40, 38,0,36,0] },
    "battle-trainer": { tempo: 160, wave: "square",
      lead: [67,0,69,0, 72,0,69,67, 69,0,72,0, 74,72,69,67, 67,0,69,0, 72,0,74,76, 74,72,74,69, 67,0,0,0],
      bass: [45,0,45,45, 0,45,0,48, 0,45,0,43, 41,0,41,41, 43,0,43,43, 0,43,0,45, 48,0,47,45, 43,0,41,0] },
    "battle-boss": { tempo: 132, wave: "sawtooth",
      lead: [50,0,50,53, 0,50,0,48, 50,0,55,0, 53,0,52,50, 48,0,50,53, 0,55,0,53, 52,50,48,0, 45,0,0,0],
      bass: [38,38,0,38, 38,0,38,0, 36,36,0,36, 36,0,36,0, 41,41,0,41, 41,0,41,0, 43,0,45,0, 47,0,48,0] },
    distortion: { tempo: 72, wave: "triangle",
      lead: [62,0,0,63, 0,0,61,0, 0,58,0,0, 57,0,0,56, 0,0,62,0, 0,66,0,0, 65,0,61,0, 58,0,0,0],
      bass: [33,0,0,0, 0,0,33,0, 32,0,0,0, 0,0,31,0, 33,0,0,0, 0,0,33,0, 34,0,0,0, 36,0,0,0] },
    evolution: { tempo: 100, wave: "triangle",
      lead: [60,64,67,72, 76,79,76,72, 67,72,76,79, 84,79,76,72, 76,79,84,88, 88,0,0,0],
      bass: [48,0,0,0, 45,0,0,0, 41,0,0,0, 43,0,0,0, 48,0,0,0, 48,0,0,0] },
    credits: { tempo: 96, wave: "triangle",
      lead: [65,0,69,0, 72,0,76,0, 77,76,72,76, 74,0,72,0, 69,0,72,0, 74,72,69,72, 65,0,0,0],
      bass: [41,0,0,0, 45,0,0,0, 48,0,0,0, 45,0,0,0, 41,0,0,0, 45,0,0,0, 41,0,43,0] }
  };

  function ensureCtx() {
    if (ctx || !enabled) return ctx;
    try {
      var AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
      master = ctx.createGain(); master.gain.value = 0.5; master.connect(ctx.destination);
      musicGain = ctx.createGain(); musicGain.gain.value = 0.5; musicGain.connect(master);
      sfxGain = ctx.createGain(); sfxGain.gain.value = 0.7; sfxGain.connect(master);
      ready = true;
    } catch (e) { ctx = null; }
    return ctx;
  }

  function init() {
    ensureCtx();
    if (ctx && ctx.state === "suspended") {
      try { ctx.resume(); } catch (e) {}
    }
    return !!ctx;
  }

  function noteFreq(m) { return m > 0 ? midi(m) : 0; }

  function playTone(freq, t, dur, wave, vol, dest) {
    if (!ctx || !freq) return;
    var o = ctx.createOscillator(), g = ctx.createGain();
    o.type = wave || "square";
    o.frequency.setValueAtTime(freq, t);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol || 0.25, t + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(dest || sfxGain);
    o.start(t); o.stop(t + dur + 0.02);
  }

  function schedulerTick() {
    if (!ctx || !currentSong) return;
    var song = SONGS[currentSong];
    if (!song) return;
    var stepDur = 60 / song.tempo / 2; // eighth notes
    while (nextStepTime < ctx.currentTime + 0.12) {
      var li = stepIdx % song.lead.length;
      var bi = stepIdx % song.bass.length;
      var lf = noteFreq(song.lead[li]), bf = noteFreq(song.bass[bi]);
      if (lf) playTone(lf, nextStepTime, stepDur * 0.92, song.wave, 0.16, musicGain);
      if (bf) playTone(bf, nextStepTime, stepDur * 0.92, "triangle", 0.14, musicGain);
      nextStepTime += stepDur;
      stepIdx++;
    }
  }

  function playSong(name) {
    if (!enabled) return;
    ensureCtx();
    if (!ctx || !SONGS[name]) return;
    if (currentSong === name) return;
    stopMusic();
    currentSong = name;
    stepIdx = 0;
    nextStepTime = ctx.currentTime + 0.05;
    schedTimer = setInterval(schedulerTick, 30);
  }

  function stopMusic() {
    if (schedTimer) { clearInterval(schedTimer); schedTimer = null; }
    currentSong = null;
  }

  function now() { return ctx ? ctx.currentTime : 0; }

  /* ---------------- SFX ---------------- */
  var SFX = {
    select: function () { var t = now(); playTone(midi(88), t, 0.06, "square", 0.2); },
    bump: function () { var t = now(); playTone(midi(45), t, 0.09, "square", 0.25); },
    heal: function () {
      var t = now(), seq = [72, 76, 79, 84];
      for (var i = 0; i < seq.length; i++) playTone(midi(seq[i]), t + i * 0.07, 0.08, "triangle", 0.25);
    },
    "catch-click": function () { var t = now(); playTone(midi(95), t, 0.04, "square", 0.3); playTone(midi(70), t + 0.05, 0.06, "square", 0.25); },
    shake: function () { var t = now(); playTone(midi(60), t, 0.05, "square", 0.2); playTone(midi(60), t + 0.09, 0.05, "square", 0.2); },
    fanfare: function () {
      var t = now(), seq = [72, 72, 72, 76, 79, 84];
      for (var i = 0; i < seq.length; i++) playTone(midi(seq[i]), t + i * 0.11, 0.12, "square", 0.22);
    },
    hit: function () {
      var t = now();
      playTone(midi(50), t, 0.1, "sawtooth", 0.3); playTone(midi(38), t, 0.12, "square", 0.25);
    },
    "super-effective": function () {
      var t = now();
      playTone(midi(70), t, 0.08, "sawtooth", 0.3); playTone(midi(55), t + 0.07, 0.14, "sawtooth", 0.3);
    },
    faint: function () {
      var t = now();
      for (var i = 0; i < 8; i++) playTone(midi(70 - i * 6), t + i * 0.06, 0.07, "square", 0.2);
    },
    evolve: function () {
      var t = now();
      for (var i = 0; i < 12; i++) playTone(midi(60 + i * 3), t + i * 0.05, 0.06, "triangle", 0.22);
    },
    warp: function () {
      var t = now();
      for (var i = 0; i < 10; i++) playTone(midi(80 - i * 4), t + i * 0.04, 0.05, "sine", 0.25);
    },
    levelup: function () {
      var t = now(), seq = [67, 72, 76, 79, 84];
      for (var i = 0; i < seq.length; i++) playTone(midi(seq[i]), t + i * 0.06, 0.07, "square", 0.2);
    },
    ball: function () {
      var t = now();
      playTone(midi(90), t, 0.05, "square", 0.25);
      for (var i = 1; i <= 3; i++) playTone(midi(90 - i * 12), t + i * 0.09, 0.05, "square", 0.2);
    },
    escape: function () {
      var t = now();
      for (var i = 0; i < 6; i++) playTone(midi(75 + i * 4), t + i * 0.05, 0.06, "square", 0.18);
    },
    error: function () { var t = now(); playTone(midi(40), t, 0.15, "square", 0.25); }
  };

  function sfx(name) {
    if (!enabled) return;
    ensureCtx();
    if (!ctx) return;
    var fn = SFX[name];
    if (fn) { try { fn(); } catch (e) {} }
  }

  // Procedural cry: 2-3 descending blips seeded per species.
  function cry(seed) {
    if (!enabled) return;
    ensureCtx();
    if (!ctx) return;
    var rng = U.RNG((seed >>> 0) + 7);
    var t = now();
    var base = 55 + Math.floor(rng() * 30);
    var n = 2 + Math.floor(rng() * 2);
    for (var i = 0; i < n; i++) {
      var f = midi(base - i * (3 + Math.floor(rng() * 5)));
      var wob = rng() > 0.5 ? "sawtooth" : "square";
      playTone(f, t + i * 0.11, 0.12, wob, 0.22);
      playTone(f * 1.5, t + i * 0.11 + 0.02, 0.08, "triangle", 0.1);
    }
  }

  function setEnabled(v) {
    enabled = !!v;
    if (!enabled) stopMusic();
  }
  function isEnabled() { return enabled; }
  function current() { return currentSong; }

  G.Audio = {
    init: init, playSong: playSong, stopMusic: stopMusic, sfx: sfx,
    cry: cry, setEnabled: setEnabled, isEnabled: isEnabled,
    current: current, songs: Object.keys(SONGS)
  };
})();
