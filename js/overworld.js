/* G.Overworld — tile-based overworld: smooth 4-dir movement, collision, camera,
   NPCs (wander/talk/battle), tall-grass encounters, warps, signs, heal/shop/PC,
   START menu, anomaly event hooks, autosave on map change. */
window.G = window.G || {};
(function () {
  "use strict";
  var U = G.Util;

  var TILE = 16;
  var BLOCKED = { "#": 1, "T": 1, "o": 1, "~": 1, " ": 1 };

  var cur = null; // {map, scene}

  function getMap(id) {
    var list = (G.Maps && G.Maps.LIST) || {};
    if (list[id]) return list[id];
    // Fallback: tiny safe map so the game never hard-crashes on missing data.
    var tiles = [];
    for (var y = 0; y < 16; y++) {
      var row = "";
      for (var x = 0; x < 20; x++) row += (x === 0 || y === 0 || x === 19 || y === 15) ? "#" : ".";
      tiles.push(row);
    }
    return { id: id, name: "???", w: 20, h: 16, music: "town", tiles: tiles, npcs: [], trainers: [], warps: [], signs: [] };
  }

  function tileAt(map, x, y) {
    if (x < 0 || y < 0 || x >= map.w || y >= map.h) return "#";
    var row = map.tiles[y];
    return (row && row[x]) || "#";
  }
  function walkable(map, x, y) {
    return !BLOCKED[tileAt(map, x, y)];
  }

  function currentMap() { return cur ? cur.map : null; }
  function playerPos() { return cur && cur.scene ? cur.scene.player : null; }

  /* ---------------- map prerender ---------------- */
  function prerender(map) {
    var c = document.createElement("canvas");
    c.width = map.w * TILE; c.height = map.h * TILE;
    var g = c.getContext("2d");
    g.imageSmoothingEnabled = false;
    for (var y = 0; y < map.h; y++) {
      for (var x = 0; x < map.w; x++) {
        drawTile(g, tileAt(map, x, y), x * TILE, y * TILE, x, y);
      }
    }
    return c;
  }

  function drawTile(g, t, px, py, tx, ty) {
    var rng = U.RNG(tx * 733 + ty * 91);
    function r() { return rng(); }
    if (t === "#") {          // building / wall
      g.fillStyle = "#8a7a6a"; g.fillRect(px, py, 16, 16);
      g.fillStyle = "#6e5f52"; g.fillRect(px, py, 16, 4);
      g.fillStyle = "#9c8c7c";
      for (var i = 0; i < 3; i++) g.fillRect(px + 2 + i * 5, py + 7 + (i % 2) * 4, 3, 2);
    } else if (t === ".") {  // path
      g.fillStyle = "#d8c090"; g.fillRect(px, py, 16, 16);
      g.fillStyle = "#c8ae80";
      if (r() > 0.5) g.fillRect(px + 3, py + 5, 3, 2);
      if (r() > 0.5) g.fillRect(px + 10, py + 10, 3, 2);
    } else if (t === ",") {  // tall grass
      g.fillStyle = "#58a838"; g.fillRect(px, py, 16, 16);
      g.fillStyle = "#3f8a28";
      for (var k = 0; k < 5; k++) g.fillRect(px + Math.floor(r() * 14), py + Math.floor(r() * 12), 2, 5);
      g.fillStyle = "#6cc048";
      for (var k2 = 0; k2 < 3; k2++) g.fillRect(px + Math.floor(r() * 14), py + Math.floor(r() * 12), 2, 3);
    } else if (t === "=") {  // road
      g.fillStyle = "#b8b8b8"; g.fillRect(px, py, 16, 16);
      g.fillStyle = "#989898"; g.fillRect(px, py + 7, 16, 2);
    } else if (t === "*") {  // flowers
      g.fillStyle = "#58a838"; g.fillRect(px, py, 16, 16);
      var cols = ["#f05878", "#f0e038", "#f0f0f0"];
      for (var f = 0; f < 3; f++) {
        g.fillStyle = cols[Math.floor(r() * 3)];
        g.fillRect(px + 2 + Math.floor(r() * 11), py + 2 + Math.floor(r() * 11), 3, 3);
      }
    } else if (t === "s") {  // sand
      g.fillStyle = "#e8d898"; g.fillRect(px, py, 16, 16);
      g.fillStyle = "#d8c888";
      if (r() > 0.4) g.fillRect(px + 4, py + 6, 4, 2);
    } else if (t === "~") {  // water
      g.fillStyle = "#3868d8"; g.fillRect(px, py, 16, 16);
      g.fillStyle = "#5890f0";
      g.fillRect(px + 2, py + 4 + Math.floor(r() * 6), 5, 1);
      g.fillRect(px + 9, py + 4 + Math.floor(r() * 6), 5, 1);
    } else if (t === "T") {  // tree
      g.fillStyle = "#58a838"; g.fillRect(px, py, 16, 16);
      g.fillStyle = "#6e4a28"; g.fillRect(px + 6, py + 8, 4, 8);
      g.fillStyle = "#2f7a20"; g.fillRect(px + 2, py + 1, 12, 9);
      g.fillStyle = "#3f9a30"; g.fillRect(px + 4, py + 3, 5, 4);
    } else if (t === "o") {  // rock
      g.fillStyle = "#58a838"; g.fillRect(px, py, 16, 16);
      g.fillStyle = "#888890"; g.fillRect(px + 3, py + 4, 10, 9);
      g.fillStyle = "#a8a8b0"; g.fillRect(px + 5, py + 6, 4, 3);
    } else if (t === "D") {  // door mat
      g.fillStyle = "#a87848"; g.fillRect(px, py, 16, 16);
      g.fillStyle = "#885e38"; g.fillRect(px + 2, py + 2, 12, 12);
      g.fillStyle = "#c89868"; g.fillRect(px + 2, py + 2, 12, 3);
    } else {                 // void
      g.fillStyle = "#000"; g.fillRect(px, py, 16, 16);
    }
  }

  /* ---------------- scene ---------------- */
  function OverworldScene(map, sx, sy) {
    this.map = map;
    this.mapCanvas = prerender(map);
    this.player = { tx: sx, ty: sy, px: sx * TILE, py: sy * TILE, dir: "down", moving: false, fromX: sx, fromY: sy, stepT: 0, bob: 0 };
    this.npcs = (map.npcs || []).map(function (n, i) {
      return {
        idx: i, x: n.x, y: n.y, px: n.x * TILE, py: n.y * TILE,
        sprite: n.sprite || "kid", dir: n.dir || "down",
        dialog: n.dialog, wander: !!n.wander, wt: U.rand(1, 3), moving: false,
        fromX: n.x, fromY: n.y, stepT: 0, trainer: n.trainer || null, name: n.name || ""
      };
    });
    // Trainers placed on the map. Most reference the G.Maps.TRAINERS registry by id.
    this.trainerMobs = (map.trainers || []).map(function (t, i) {
      var r = null;
      try { if (t.id && G.Battle && G.Battle.resolveTrainer) r = G.Battle.resolveTrainer(t.id); } catch (e) {}
      return {
        idx: i, x: t.x, y: t.y, px: t.x * TILE, py: t.y * TILE,
        dir: t.dir || "down", range: t.range || 4, moving: false, stepT: 0, bob: 0,
        fromX: t.x, fromY: t.y,
        reg: r, raw: t,
        sprite: (r && r.trainer.sprite) || t.sprite || "grunt",
        name: (r && r.trainer.name) || t.name || "Trainer",
        key: "trainer_" + map.id + "_" + (t.id || ("mob" + i))
      };
    }).filter(function (m) { return m.reg || m.raw.team || m.raw.party || m.raw.echoStage; });
    this.camX = 0; this.camY = 0;
    this.exclaim = null; // {x,y,t}
    this.busy = false;
  }

  OverworldScene.prototype.enter = function () {
    var map = this.map;
    try {
      if (G.Audio) G.Audio.playSong(map.music || "town");
    } catch (e) {}
    // preload real sprites for party + nearby encounters (async, non-blocking)
    try {
      if (G.Sprites && G.Sprites.preload && G.Data && G.Data.SPECIES) {
        var S = G.Data.SPECIES, dexes = [];
        var party = (G.Save && G.Save.data && G.Save.data.party) || [];
        party.forEach(function (m) { if (m && S[m.sp] && S[m.sp].dex > 0) dexes.push(S[m.sp].dex); });
        var enc = map.encounters;
        var table = (enc && (enc.table || enc.grass)) || [];
        table.forEach(function (e) { if (e.sp && S[e.sp] && S[e.sp].dex > 0) dexes.push(S[e.sp].dex); });
        if (dexes.length) G.Sprites.preload(dexes);
      }
    } catch (e) {}
    // map enter script
    if (map.onEnter && !this._entered) {
      this._entered = true;
      var self = this;
      this.busy = true;
      runStoryScript(map.onEnter, function () { self.busy = false; });
    }
  };

  function runStoryScript(id, cb) {
    try {
      if (G.Story && typeof G.Story.play === "function") { G.Story.play(id, cb); return; }
    } catch (e) {}
    if (cb) cb();
  }

  OverworldScene.prototype.npcAt = function (x, y) {
    for (var i = 0; i < this.npcs.length; i++) {
      if (this.npcs[i].x === x && this.npcs[i].y === y) return this.npcs[i];
    }
    for (var k = 0; k < this.trainerMobs.length; k++) {
      if (this.trainerMobs[k].x === x && this.trainerMobs[k].y === y) return this.trainerMobs[k];
    }
    return null;
  };
  OverworldScene.prototype.mobAt = function (x, y) {
    for (var k = 0; k < this.trainerMobs.length; k++) {
      if (this.trainerMobs[k].x === x && this.trainerMobs[k].y === y) return this.trainerMobs[k];
    }
    return null;
  };

  OverworldScene.prototype.tryStep = function (ent, dx, dy) {
    var nx = ent.tx + dx, ny = ent.ty + dy;
    if (!walkable(this.map, nx, ny)) return false;
    if (ent === this.player) {
      if (this.npcAt(nx, ny)) return false;
    } else {
      if (this.npcAt(nx, ny)) return false;
      if (this.player.tx === nx && this.player.ty === ny) return false;
    }
    ent.fromX = ent.tx; ent.fromY = ent.ty;
    ent.tx = nx; ent.ty = ny;
    ent.moving = true; ent.stepT = 0;
    return true;
  };

  OverworldScene.prototype.facingTile = function (ent) {
    var dx = 0, dy = 0;
    if (ent.dir === "up") dy = -1; else if (ent.dir === "down") dy = 1;
    else if (ent.dir === "left") dx = -1; else if (ent.dir === "right") dx = 1;
    return { x: ent.tx + dx, y: ent.ty + dy };
  };

  OverworldScene.prototype.update = function (dt) {
    if (this.busy) return;
    var E = G.Engine, p = this.player;

    // check anomaly director events
    this.pollAnomaly();

    // trainer sight lines
    this.checkSight();

    if (!p.moving) {
      var dx = 0, dy = 0, dir = null;
      if (E.isHeld("up")) { dy = -1; dir = "up"; }
      else if (E.isHeld("down")) { dy = 1; dir = "down"; }
      else if (E.isHeld("left")) { dx = -1; dir = "left"; }
      else if (E.isHeld("right")) { dx = 1; dir = "right"; }
      if (dir) {
        p.dir = dir;
        if (!this.tryStep(p, dx, dy)) {
          // bumped into wall
          if (E.pressed("up") || E.pressed("down") || E.pressed("left") || E.pressed("right")) {
            try { if (G.Audio) G.Audio.sfx("bump"); } catch (e) {}
          }
        }
      } else if (E.pressed("a")) {
        this.interact();
      } else if (E.pressed("start")) {
        this.openStartMenu();
      }
      var t = E.consumeTap();
      if (t) {
        // tap on adjacent tile/NPC = interact; tap elsewhere ignored (dpad handles movement)
        this.tapInteract(t.x, t.y);
      }
    }

    // animate player step
    if (p.moving) {
      p.stepT += dt / 0.13;
      if (p.stepT >= 1) {
        p.moving = false; p.stepT = 0;
        p.px = p.tx * TILE; p.py = p.ty * TILE;
        this.onEnterTile(p.tx, p.ty);
      } else {
        p.px = U.lerp(p.fromX * TILE, p.tx * TILE, p.stepT);
        p.py = U.lerp(p.fromY * TILE, p.ty * TILE, p.stepT);
      }
      p.bob += dt * 20;
    }

    // NPC wander + animation
    for (var i = 0; i < this.npcs.length; i++) {
      var n = this.npcs[i];
      if (n.moving) {
        n.stepT += dt / 0.18;
        if (n.stepT >= 1) { n.moving = false; n.px = n.x * TILE; n.py = n.y * TILE; }
        else { n.px = U.lerp(n.fromX * TILE, n.x * TILE, n.stepT); n.py = U.lerp(n.fromY * TILE, n.y * TILE, n.stepT); }
      } else if (n.wander) {
        n.wt -= dt;
        if (n.wt <= 0) {
          n.wt = U.rand(1.5, 4);
          var dirs = [[0, -1, "up"], [0, 1, "down"], [-1, 0, "left"], [1, 0, "right"]];
          var d = U.choice(dirs);
          n.dir = d[2];
          this.tryStep(n, d[0], d[1]);
        }
      }
    }

    if (this.exclaim) {
      this.exclaim.t -= dt;
      if (this.exclaim.t <= 0) this.exclaim = null;
    }

    // camera
    var vw = G.Engine.W, vh = G.Engine.H;
    this.camX = U.clamp(p.px + TILE / 2 - vw / 2, 0, Math.max(0, this.map.w * TILE - vw));
    this.camY = U.clamp(p.py + TILE / 2 - vh / 2, 0, Math.max(0, this.map.h * TILE - vh));
  };

  OverworldScene.prototype.onEnterTile = function (x, y) {
    // warps
    var warps = this.map.warps || [];
    for (var i = 0; i < warps.length; i++) {
      var w = warps[i];
      if (w.x === x && w.y === y) { this.doWarp(w); return; }
    }
    // grass encounters
    if (tileAt(this.map, x, y) === ",") this.rollEncounter();
  };

  OverworldScene.prototype.doWarp = function (w) {
    this.busy = true;
    try { if (G.Audio) G.Audio.sfx("warp"); } catch (e) {}
    // record new position in save data before autosaving
    try {
      if (G.Save && G.Save.data) {
        G.Save.data.player = { map: w.to, x: w.tx, y: w.ty };
        G.Save.save();
      }
    } catch (e) {}
    G.Engine.fadeTo(new OverworldScene(getMap(w.to), w.tx, w.ty), 300);
  };

  OverworldScene.prototype.rollEncounter = function () {
    var enc = this.map.encounters;
    // Distortion Rift override: first grass step while rift is active on this map
    var riftSp = null;
    try { if (G.AI) riftSp = G.AI.consumeRift(this.map.id); } catch (e) {}
    if (riftSp) { this.startWild(riftSp, true); return; }
    if (!enc) return;
    var table = enc.table || enc.grass || [];
    if (!table.length) return;
    var rate = enc.rate !== undefined ? enc.rate : 12;
    if (rate > 1) rate = rate / 100; // data uses percent (12 = 12%)
    if (U.rand(0, 1) > rate) return;
    var total = 0, i;
    for (i = 0; i < table.length; i++) total += table[i].w || 1;
    var roll = U.rand(0, total), pick = table[0];
    for (i = 0; i < table.length; i++) {
      roll -= table[i].w || 1;
      if (roll <= 0) { pick = table[i]; break; }
    }
    this.startWild(pick.sp, false, pick.min || 3, pick.max || (pick.min || 3) + 2);
  };

  OverworldScene.prototype.startWild = function (sp, isRift, min, max) {
    var self = this;
    if (!G.Battle || !G.Party) return;
    var p = (G.Save && G.Save.data && G.Save.data.party) || [];
    var avg = 5;
    if (p.length) avg = Math.round(p.reduce(function (a, m) { return a + (m.lvl || 5); }, 0) / p.length);
    var lvl;
    if (isRift) {
      lvl = avg + 2;
      G.Engine.toast("The rift tears open...", 2000);
    } else {
      lvl = U.randi(min || 3, max || 5);
      try { if (G.AI) lvl = G.AI.syncAdjust(lvl, avg); } catch (e) {}
    }
    var inst = G.Party.makeMon(sp, lvl);
    if (!inst) return;
    this.busy = true;
    G.Battle.start({
      kind: "wild", foe: inst, canCatch: true,
      bossCatchBonus: isRift ? 1.5 : 1,
      onEnd: function (res) {
        self.busy = false;
        if (res && res.won === false && !res.fled) self.whiteout();
      }
    });
  };

  OverworldScene.prototype.whiteout = function () {
    var self = this;
    G.Engine.dialog([
      { name: "", text: "You have no Pokémon able to battle!" },
      { name: "", text: "You blacked out!" }
    ], function () {
      try { if (G.Party) G.Party.healAll(); } catch (e) {}
      var lh = (G.Save && G.Save.data && G.Save.data.lastHeal) || { map: "circuit-town", x: 10, y: 10 };
      self.doWarp({ to: lh.map, tx: lh.x, ty: lh.y });
    });
  };

  OverworldScene.prototype.pollAnomaly = function () {
    var ev = null;
    try { if (G.AI) ev = G.AI.pollEvent(); } catch (e) {}
    if (!ev) return;
    var self = this;
    if (ev.type === "ambush") {
      this.busy = true;
      var team = [{ sp: "gengar", lvl: 18 }, { sp: "weavile", lvl: 20 }];
      var p = (G.Save && G.Save.data && G.Save.data.party) || [];
      var avg = p.length ? Math.round(p.reduce(function (a, m) { return a + (m.lvl || 5); }, 0) / p.length) : 15;
      team.forEach(function (m) { m.lvl = Math.max(8, avg - 2); });
      var foes = team.map(function (m) { return G.Party.makeMon(m.sp, m.lvl); }).filter(Boolean);
      if (!foes.length) { this.busy = false; return; }
      G.Battle.start({
        kind: "trainer", foe: foes,
        trainer: { name: "UMBRA Grunt", sprite: "grunt", ai: "basic", reward: 300 },
        canCatch: false,
        onEnd: function (res) {
          self.busy = false;
          if (res && res.won === false) self.whiteout();
        }
      });
    } else if (ev.type === "distress" && ev.sp) {
      // Anime ally appears — catchable wild encounter
      this.startWild(ev.sp, false, 20, 25);
    }
  };

  OverworldScene.prototype.checkSight = function () {
    var p = this.player;
    for (var i = 0; i < this.trainerMobs.length; i++) {
      var t = this.trainerMobs[i];
      if (this.trainerBeaten(t)) continue;
      var range = t.range || 4;
      var dx = p.tx - t.x, dy = p.ty - t.y;
      var dir = t.dir || "down";
      var seen = false;
      if (dir === "up" && dx === 0 && dy < 0 && dy >= -range) seen = true;
      if (dir === "down" && dx === 0 && dy > 0 && dy <= range) seen = true;
      if (dir === "left" && dy === 0 && dx < 0 && dx >= -range) seen = true;
      if (dir === "right" && dy === 0 && dx > 0 && dx <= range) seen = true;
      if (seen) { this.startTrainerBattle(t); return; }
    }
  };

  OverworldScene.prototype.trainerBeaten = function (t) {
    try {
      var d = G.Save && G.Save.data;
      if (d && d.flags[t.key || ("trainer_" + this.map.id + "_mob")]) return true;
    } catch (e) {}
    return false;
  };

  OverworldScene.prototype.startTrainerBattle = function (t) {
    var self = this;
    this.busy = true;
    this.exclaim = { x: t.x, y: t.y, t: 0.8 };
    // Normalized battle data: registry-resolved mobs carry reg {foes, intro, outro, ...};
    // inline map trainers carry team/party + intro/outro directly.
    var reg = t.reg || null;
    var rawLines = (reg && reg.intro) || t.intro || [{ name: t.name || "Trainer", text: (t.taunt || "Let's battle!") }];
    var lines = rawLines.map(function (ln) {
      return typeof ln === "string" ? { name: (reg && reg.trainer.name) || t.name || "Trainer", text: ln } : ln;
    });
    // NEXUS pre-battle scout for notable trainers
    var tinfo = (reg && reg.trainer) || { name: t.name || "Trainer", sprite: t.sprite || "grunt", ai: t.ai || "basic", reward: t.reward || 200 };
    var scout = null;
    try {
      if (G.AI && (t.scout || tinfo.ai === "boss" || tinfo.ai === "echo")) {
        scout = G.AI.nexusScout({ name: tinfo.name, team: (reg ? null : (t.team || t.party || [])), ai: tinfo.ai });
      }
    } catch (e) {}
    var seq = [];
    if (scout) seq.push({ name: "NEXUS", text: scout });
    seq = seq.concat(lines);
    G.Engine.dialog(seq, function () {
      var foes = (reg && reg.foes) || null;
      if (!foes) {
        var team = t.team || t.party || [];
        if ((!team.length) && t.echoStage) {
          try { if (G.AI && G.AI.echoParty) team = G.AI.echoParty(t.echoStage); } catch (e) {}
        }
        foes = team.map(function (m) { return G.Party.makeMon(m.sp, m.lvl); }).filter(Boolean);
      }
      if (!foes.length) { self.busy = false; return; }
      G.Battle.start({
        kind: (reg && reg.kind) || (t.boss ? "boss" : "trainer"),
        foe: foes,
        trainer: tinfo,
        canCatch: false,
        catchable: !!((reg && reg.catchable) || t.catchable),
        onEnd: function (res) {
          if (res && res.won) {
            try {
              var d = G.Save && G.Save.data;
              if (d) {
                d.flags[t.key || ("trainer_" + self.map.id + "_mob")] = true;
                d.money = (d.money || 0) + (tinfo.reward || 200);
              }
            } catch (e) {}
            var rawOutro = (reg && reg.outro) || t.outro || [{ name: tinfo.name, text: "Not bad... not bad at all." }];
            var outro = rawOutro.map(function (ln) {
              return typeof ln === "string" ? { name: tinfo.name, text: ln } : ln;
            });
            G.Engine.dialog(outro, function () { self.busy = false; });
          } else {
            self.busy = false;
            if (res && res.won === false) self.whiteout();
          }
        }
      });
    });
  };

  OverworldScene.prototype.interact = function () {
    var ft = this.facingTile(this.player);
    var npc = this.npcAt(ft.x, ft.y);
    if (npc) { this.talkTo(npc); return; }
    // signs
    var signs = this.map.signs || [];
    for (var i = 0; i < signs.length; i++) {
      if (signs[i].x === ft.x && signs[i].y === ft.y) {
        G.Engine.textBox(signs[i].text);
        return;
      }
    }
    // heal / shop / pc (face the tile or stand next to it)
    var map = this.map;
    if (map.heal && map.heal.x === ft.x && map.heal.y === ft.y) { this.useHeal(); return; }
    if (map.shop && map.shop.x === ft.x && map.shop.y === ft.y) { if (G.Party) G.Party.openShop(); return; }
    if (map.pc && map.pc.x === ft.x && map.pc.y === ft.y) { if (G.Party) G.Party.openPC(); return; }
    // scripted interact tiles
    var ints = map.interact || [];
    for (var k = 0; k < ints.length; k++) {
      if (ints[k].x === ft.x && ints[k].y === ft.y && ints[k].script) {
        var self = this;
        this.busy = true;
        runStoryScript(ints[k].script, function () { self.busy = false; });
        return;
      }
    }
  };

  OverworldScene.prototype.tapInteract = function (x, y) {
    // convert screen tap to world tile near player; only allow adjacent interaction
    var wx = x + this.camX, wy = y + this.camY;
    var tx = Math.floor(wx / TILE), ty = Math.floor(wy / TILE);
    var p = this.player;
    if (Math.abs(tx - p.tx) + Math.abs(ty - p.ty) === 1) {
      var npc = this.npcAt(tx, ty);
      if (npc) {
        // face it
        if (tx < p.tx) p.dir = "left"; else if (tx > p.tx) p.dir = "right";
        else if (ty < p.ty) p.dir = "up"; else p.dir = "down";
        this.talkTo(npc);
      }
    }
  };

  OverworldScene.prototype.talkTo = function (npc) {
    var self = this;
    // face the player
    var p = this.player;
    if (npc.x < p.tx) npc.dir = "right"; else if (npc.x > p.tx) npc.dir = "left";
    else if (npc.y < p.ty) npc.dir = "down"; else npc.dir = "up";
    try { if (G.Audio) G.Audio.sfx("select"); } catch (e) {}
    if (npc.reg || npc.raw) {
      // map trainer mob (registry id or inline team)
      if (!this.trainerBeaten(npc)) this.startTrainerBattle(npc);
      else G.Engine.textBox(npc.name + ": ...");
      return;
    }
    if (npc.trainer) {
      var t = Object.assign({}, npc.trainer, { x: npc.x, y: npc.y, key: "trainer_" + this.map.id + "_npc" + npc.idx });
      if (!this.trainerBeaten(t)) this.startTrainerBattle(t);
      return;
    }
    if (npc.dialog) {
      this.busy = true;
      runStoryScript(npc.dialog, function () { self.busy = false; });
    } else {
      G.Engine.textBox(npc.name ? npc.name + ": ..." : "...");
    }
  };

  OverworldScene.prototype.useHeal = function () {
    var self = this;
    this.busy = true;
    try { if (G.Party) G.Party.healAll(); } catch (e) {}
    try {
      var d = G.Save && G.Save.data;
      if (d) d.lastHeal = { map: this.map.id, x: this.player.tx, y: this.player.ty };
      if (G.Audio) G.Audio.sfx("heal");
    } catch (e) {}
    G.Engine.dialog([{ name: "Nurse", text: "Your Pokémon are fully healed! Go get 'em, champ!" }], function () {
      self.busy = false;
    });
  };

  OverworldScene.prototype.openStartMenu = function () {
    var self = this;
    try { if (G.Audio) G.Audio.sfx("select"); } catch (e) {}
    G.Engine.menuList(
      ["Pokémon", "Bag", "NEXUS", "Pokédex", "Save", "Options", "Cancel"],
      { title: "MENU", x: G.Engine.W - 180, y: 12, w: 168 },
      function (i) {
        if (i === 0) { if (G.Party) G.Party.openPartyMenu(); }
        else if (i === 1) { if (G.Party) G.Party.openBag(); }
        else if (i === 2) self.openNexus();
        else if (i === 3) self.openPokedex();
        else if (i === 4) self.openSave();
        else if (i === 5) self.openOptions();
      }
    );
  };

  OverworldScene.prototype.openNexus = function () {
    var tip = "NEXUS: systems nominal.";
    try { if (G.AI) tip = G.AI.nexusTip(); } catch (e) {}
    G.Engine.dialog([{ name: "NEXUS", text: tip }]);
  };

  OverworldScene.prototype.openPokedex = function () {
    var d = (G.Save && G.Save.data) || {};
    var dex = d.dex || { seen: {}, caught: {} };
    var S = (G.Data && G.Data.SPECIES) || {};
    var seen = Object.keys(dex.seen || {}).length;
    var caught = Object.keys(dex.caught || {}).length;
    var total = Object.keys(S).length;
    var items = Object.keys(S).sort().map(function (id) {
      var c = dex.caught && dex.caught[id], s = dex.seen && dex.seen[id];
      var nm = S[id] && S[id].name ? S[id].name : U.titleCase(id);
      return (c ? "● " : s ? "○ " : "? ") + (c || s ? nm : "???");
    });
    items.unshift("Seen: " + seen + " / " + total + "   Caught: " + caught);
    G.Engine.menuList(items, { title: "POKéDEX", x: 40, y: 12, w: 400, h: 280, tapOutsideCancel: true }, function () {});
  };

  OverworldScene.prototype.openSave = function () {
    G.Engine.yesNo("Save your adventure?", function (yes) {
      if (yes) {
        try {
          if (G.Save) G.Save.save();
          G.Engine.toast("Game saved!");
          G.Audio.sfx("heal");
        } catch (e) { G.Engine.toast("Save failed!"); }
      }
    });
  };

  OverworldScene.prototype.openOptions = function () {
    var d = (G.Save && G.Save.data) || {};
    d.options = d.options || {};
    var o = d.options;
    if (o.textSpeed === undefined) o.textSpeed = 2;
    if (o.battleAnims === undefined) o.battleAnims = true;
    if (o.aiSync === undefined) o.aiSync = true;
    if (o.overclock === undefined) o.overclock = false;
    if (o.sound === undefined) o.sound = true;
    function labels() {
      return [
        { label: "Text speed: " + ["", "Slow", "Normal", "Fast"][o.textSpeed] },
        { label: "Battle anims: " + (o.battleAnims ? "ON" : "OFF") },
        { label: "AI-Sync difficulty: " + (o.aiSync ? "ON" : "OFF") },
        { label: "Overclock autopilot: " + (o.overclock ? "ON" : "OFF") },
        { label: "Sound: " + (o.sound ? "ON" : "OFF") },
        { label: "Done" }
      ];
    }
    function show() {
      G.Engine.menuList(labels(), { title: "OPTIONS", x: 90, y: 30, w: 300 }, function (i) {
        if (i < 0 || i === 5) return;
        if (i === 0) o.textSpeed = o.textSpeed % 3 + 1;
        else if (i === 1) o.battleAnims = !o.battleAnims;
        else if (i === 2) o.aiSync = !o.aiSync;
        else if (i === 3) o.overclock = !o.overclock;
        else if (i === 4) {
          o.sound = !o.sound;
          try { if (G.Audio) G.Audio.setEnabled(o.sound); } catch (e) {}
        }
        try {
          G.Engine.setTextSpeed(o.textSpeed);
          if (G.Save) G.Save.save();
        } catch (e) {}
        show();
      });
    }
    show();
  };

  OverworldScene.prototype.draw = function (c) {
    var camX = Math.round(this.camX), camY = Math.round(this.camY);
    c.drawImage(this.mapCanvas, -camX, -camY);
    var i, n;
    // NPCs + trainer mobs (sorted by y)
    var draws = [];
    for (i = 0; i < this.npcs.length; i++) draws.push(this.npcs[i]);
    for (var tm = 0; tm < this.trainerMobs.length; tm++) draws.push(this.trainerMobs[tm]);
    draws.push(this.player);
    draws.sort(function (a, b) { return (a.py - b.py); });
    for (i = 0; i < draws.length; i++) {
      var e = draws[i];
      var isPlayer = e === this.player;
      var img = null;
      try {
        img = G.Sprites.trainer(isPlayer ? "hero" : (e.sprite || "kid"), { size: 48 });
      } catch (err) {}
      var bob = (e.moving ? Math.abs(Math.sin(e.bob)) * -2 : 0);
      var flip = e.dir === "left";
      G.Engine.drawSprite(c, img, Math.round(e.px) - camX - 16, Math.round(e.py) - camY - 28 + bob, 48, 48, flip);
    }
    // exclaim
    if (this.exclaim) {
      var ex = (this.exclaim.x * TILE + 8) - camX, ey = (this.exclaim.y * TILE - 14) - camY;
      G.Engine.text(c, "!", ex, ey, { size: 16, bold: true, color: "#f02020", align: "center" });
    }
    // map name banner briefly? skip
  };

  /* ---------------- public API ---------------- */
  function enter(mapId, x, y) {
    var map = getMap(mapId);
    cur = { map: map, scene: new OverworldScene(map, x || 5, y || 5) };
    G.Engine.clearTo(cur.scene);
    return cur.scene;
  }

  function warpTo(mapId, x, y) {
    if (cur && cur.scene) cur.scene.doWarp({ to: mapId, tx: x, ty: y });
    else enter(mapId, x, y);
  }

  G.Overworld = {
    enter: enter, warpTo: warpTo, currentMap: currentMap, playerPos: playerPos,
    _OverworldScene: OverworldScene, _getMap: getMap
  };
})();
