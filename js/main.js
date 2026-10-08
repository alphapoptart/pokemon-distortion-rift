/* G.Main — boot, title screen, new game / continue, G.Save (localStorage). */
window.G = window.G || {};
(function () {
  "use strict";
  var U = G.Util;
  var SAVE_KEY = "distortion_rift_save";

  /* ================= save ================= */
  function defaultData() {
    return {
      version: 1, started: false,
      player: { name: "RIFT", map: "circuit-town", x: 10, y: 8, dir: "down" },
      party: [], box: [],
      bag: { "poke-ball": 5, "potion": 3 },
      money: 1000,
      flags: {}, dex: { seen: {}, caught: {} }, badges: 0,
      playtime: 0,
      lastHeal: { map: "circuit-town", x: 10, y: 8 },
      echo: null,
      options: { textSpeed: 2, battleAnims: true, aiSync: true, overclock: false, sound: true },
      fusionCount: 0
    };
  }

  var Save = {
    data: null,
    exists: function () {
      try { return !!localStorage.getItem(SAVE_KEY); } catch (e) { return false; }
    },
    save: function () {
      if (!this.data) return false;
      try {
        if (G.AI && G.AI.saveState) this.data.echo = G.AI.saveState();
        // strip transient battle caches from instances
        var clean = function (m) {
          if (!m) return m;
          var c = U.deepClone(m);
          delete c._stats;
          return c;
        };
        var snapshot = U.deepClone(this.data);
        snapshot.party = (snapshot.party || []).map(clean);
        snapshot.box = (snapshot.box || []).map(clean);
        localStorage.setItem(SAVE_KEY, JSON.stringify(snapshot));
        return true;
      } catch (e) { return false; }
    },
    load: function () {
      try {
        var raw = localStorage.getItem(SAVE_KEY);
        if (!raw) return false;
        var d = JSON.parse(raw);
        if (!d || typeof d !== "object") return false;
        this.data = Object.assign(defaultData(), d);
        this.data.options = Object.assign(defaultData().options, d.options || {});
        this.data.dex = d.dex || { seen: {}, caught: {} };
        try {
          if (G.Party && G.Party.regenFusions) G.Party.regenFusions();
          if (G.AI && G.AI.loadState && d.echo) G.AI.loadState(d.echo);
          if (G.Engine) G.Engine.setTextSpeed(this.data.options.textSpeed);
          if (G.Audio) G.Audio.setEnabled(this.data.options.sound !== false);
        } catch (e) {}
        return true;
      } catch (e) { return false; }
    },
    newGame: function (name) {
      this.data = defaultData();
      this.data.player.name = name || "RIFT";
      this.data.started = true;
      try {
        if (G.AI && G.AI.reset) G.AI.reset();
        if (G.Engine) G.Engine.setTextSpeed(2);
      } catch (e) {}
      this.save();
    },
    wipe: function () {
      try { localStorage.removeItem(SAVE_KEY); } catch (e) {}
      this.data = null;
    }
  };
  G.Save = Save;

  /* ================= title screen ================= */
  var boxart = null, boxartReady = false;
  function loadBoxart() {
    try {
      boxart = new Image();
      boxart.onload = function () { boxartReady = true; };
      boxart.onerror = function () { boxartReady = false; };
      boxart.src = "assets/boxart.jpg";
    } catch (e) { boxartReady = false; }
  }

  function TitleScene() {
    this.cursor = 0;
    this.items = ["NEW GAME", "CONTINUE", "OPTIONS"];
    this.t = 0;
  }
  TitleScene.prototype.update = function () {
    var E = G.Engine;
    this.t += 1 / 60;
    if (E.pressed("up")) { this.cursor = (this.cursor - 1 + 3) % 3; sfx(); }
    else if (E.pressed("down")) { this.cursor = (this.cursor + 1) % 3; sfx(); }
    else if (E.pressed("a") || E.pressed("start")) { this.pick(this.cursor); }
    var t = E.consumeTap();
    if (t) {
      for (var i = 0; i < 3; i++) {
        var y = 218 + i * 30;
        if (t.y >= y && t.y <= y + 28 && t.x >= 140 && t.x <= 340) { this.pick(i); return; }
      }
      // tap anywhere also works as "press start" on first screen? keep menu-only
    }
  };
  function sfx() { try { if (G.Audio) G.Audio.sfx("select"); } catch (e) {} }
  TitleScene.prototype.pick = function (i) {
    sfx();
    if (i === 0) Main.newGameFlow();
    else if (i === 1) Main.continueFlow();
    else Main.titleOptions();
  };
  TitleScene.prototype.draw = function (c) {
    var E = G.Engine, W = E.W, H = E.H;
    if (boxartReady && boxart) {
      // cover-fit the 480x320 canvas
      var s = Math.max(W / boxart.width, H / boxart.height);
      var dw = boxart.width * s, dh = boxart.height * s;
      c.drawImage(boxart, (W - dw) / 2, (H - dh) / 2, dw, dh);
      c.fillStyle = "rgba(0,0,0,0.25)"; c.fillRect(0, 0, W, H);
    } else {
      var grd = c.createLinearGradient(0, 0, 0, H);
      grd.addColorStop(0, "#0a0a2a"); grd.addColorStop(1, "#2a0a3a");
      c.fillStyle = grd; c.fillRect(0, 0, W, H);
    }
    // logo
    var bob = Math.sin(this.t * 2) * 3;
    E.text(c, "POKéMON", W / 2, 30 + bob, { align: "center", size: 34, bold: true, color: "#ffe95a", shadowColor: "#203080" });
    E.text(c, "DISTORTION RIFT", W / 2, 70 + bob, { align: "center", size: 20, bold: true, color: "#fff", shadowColor: "#203080" });
    E.text(c, "A fan-made adventure", W / 2, 100 + bob, { align: "center", size: 9, color: "#c8c8e0" });
    // menu
    for (var i = 0; i < 3; i++) {
      var y = 218 + i * 30;
      if (i === this.cursor) {
        c.fillStyle = "rgba(20,20,40,0.75)";
        c.fillRect(140, y, 200, 26);
        E.text(c, "▶", 150, y + 7, { size: 11, bold: true, color: "#ffe95a" });
      }
      E.text(c, this.items[i], 240, y + 7, {
        align: "center", size: 11, bold: i === this.cursor,
        color: i === this.cursor ? "#ffe95a" : "#e8e8f0"
      });
    }
    if (!Save.exists()) {
      E.text(c, "(no save data)", 240, 312, { align: "center", size: 8, color: "#888" });
    }
    if (Math.floor(this.t * 2) % 2 === 0) {
      E.text(c, "v1.0 — press A / tap", W / 2, H - 24, { align: "center", size: 8, color: "#aaa" });
    }
  };

  /* ================= flows ================= */
  var Main = {
    boot: function () {
      if (!G.Engine.init("game")) return;
      loadBoxart();
      try { if (G.Sprites && G.Sprites.preloadCustom) G.Sprites.preloadCustom(); } catch (e) {}
      try { if (G.Audio) G.Audio.playSong("title"); } catch (e) {}
      G.Engine.clearTo(new TitleScene());
    },
    newGameFlow: function () {
      G.Engine.namingScreen("RIFT", 10, function (name) {
        Save.newGame(name);
        try { if (G.Audio) G.Audio.playSong("town"); } catch (e) {}
        // enter world, then run the intro story script
        try {
          if (G.Overworld) G.Overworld.enter("circuit-town", 10, 8);
        } catch (e) {}
        var started = false;
        try {
          if (G.Story && typeof G.Story.play === "function") {
            started = true;
            G.Story.play("intro", function () {
              try {
                Save.save();
                // preload the new party's sprites now that the starter is chosen
                if (G.Sprites && G.Sprites.preload && G.Data && G.Data.SPECIES) {
                  var S = G.Data.SPECIES, dexes = [];
                  (Save.data.party || []).forEach(function (m) {
                    if (m && S[m.sp] && S[m.sp].dex > 0) dexes.push(S[m.sp].dex);
                  });
                  if (dexes.length) G.Sprites.preload(dexes);
                }
              } catch (e) {}
            });
          }
        } catch (e) { started = false; }
        if (!started) {
          // fallback intro if story data is missing — still fully playable
          var S = (G.Data && G.Data.SPECIES) || {};
          var starterIds = ["sparkit", "terrafen", "aquil"].filter(function (id) { return !!S[id]; });
          G.Engine.dialog([
            { name: "PROF. MAPLE", text: "Welcome to the RIFT region, " + name + "! I'm PROF. MAPLE." },
            { name: "PROF. MAPLE", text: "A distortion is tearing our world apart... and NEXUS chose YOU to stop it." },
            { name: "NEXUS", text: "Greetings, " + name + ". I am NEXUS, your tactical companion. Let's save reality." },
            { name: "PROF. MAPLE", text: "Before you go — choose a partner Pokémon!" }
          ], function () {
            if (!starterIds.length) { try { Save.save(); } catch (e) {} return; }
            G.Engine.choiceBox("Choose your partner!",
              starterIds.map(function (id) { return S[id].name + " (" + (S[id].types || []).join("/") + ")"; }),
              function (i) {
                if (i < 0) i = 0;
                var inst = null;
                try { inst = G.Party.makeMon(starterIds[i], 5); } catch (e) {}
                if (inst) {
                  Save.data.party.push(inst);
                  Save.data.dex.seen[starterIds[i]] = true;
                  Save.data.dex.caught[starterIds[i]] = true;
                  G.Engine.dialog([
                    { name: "", text: "You received " + S[starterIds[i]].name + "!" },
                    { name: "NEXUS", text: "Excellent choice. Route 1 awaits — and so does destiny. Probably in that order." }
                  ], function () { try { Save.save(); } catch (e) {} });
                } else { try { Save.save(); } catch (e) {} }
              });
          });
        }
      });
    },
    continueFlow: function () {
      if (!Save.exists()) {
        G.Engine.toast("No save file found!");
        try { if (G.Audio) G.Audio.sfx("error"); } catch (e) {}
        return;
      }
      if (!Save.load()) {
        G.Engine.toast("Save data is corrupted!");
        return;
      }
      var p = Save.data.player || {};
      try {
        if (G.Overworld) G.Overworld.enter(p.map || "circuit-town", p.x == null ? 10 : p.x, p.y == null ? 8 : p.y);
      } catch (e) {}
      G.Engine.toast("Welcome back, " + (p.name || "RIFT") + "!");
    },
    titleOptions: function () {
      var o = { textSpeed: 2, sound: true };
      try {
        if (Save.data && Save.data.options) o = Save.data.options;
      } catch (e) {}
      function labels() {
        return [
          { label: "Text speed: " + ["", "Slow", "Normal", "Fast"][o.textSpeed || 2] },
          { label: "Sound: " + (o.sound !== false ? "ON" : "OFF") },
          { label: "Back" }
        ];
      }
      function show() {
        G.Engine.menuList(labels(), { title: "OPTIONS", x: 90, y: 60, w: 300 }, function (i) {
          if (i === 0) { o.textSpeed = (o.textSpeed || 2) % 3 + 1; G.Engine.setTextSpeed(o.textSpeed); show(); }
          else if (i === 1) {
            o.sound = !(o.sound !== false);
            try { if (G.Audio) G.Audio.setEnabled(o.sound); } catch (e) {}
            show();
          }
        });
      }
      show();
    }
  };
  G.Main = Main;

  // auto-boot when DOM is ready
  function boot() {
    try { Main.boot(); } catch (e) {}
  }
  if (typeof document !== "undefined") {
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
    else boot();
  }
})();
