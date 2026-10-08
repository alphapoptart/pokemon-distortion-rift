/* G.Battle — complete battle engine: turn loop, damage formula, type chart, status,
   stat stages, catch formula, XP/evolution, animations, trainer AI (basic/echo/boss).
   Pure-logic helpers (typeEff, dmgCalc, statsFor, xp) are DOM-free. */
window.G = window.G || {};
(function () {
  "use strict";
  var U = G.Util;

  /* ================= pure logic (DOM-free) ================= */
  function SPECIES() { return (G.Data && G.Data.SPECIES) || {}; }
  function MOVES() { return (G.Data && G.Data.MOVES) || {}; }
  function CHART() { return (G.Data && G.Data.CHART) || {}; }

  function spOf(id) {
    return SPECIES()[id] || (G.Sprites ? G.Sprites.missingNo() : null) || { id: id, name: id, types: ["Normal"], base: { hp: 50, atk: 50, def: 50, spa: 50, spd: 50, spe: 50 }, catchRate: 45, levelMoves: [] };
  }
  function mvOf(id) {
    return MOVES()[id] || { id: id, name: U.titleCase(id), type: "Normal", cat: "phys", pow: 40, acc: 100, pp: 20, eff: {}, desc: "" };
  }

  function typeEff(atkType, defTypes) {
    var chart = CHART(), row = chart[atkType] || {}, m = 1;
    (defTypes || []).forEach(function (dt) {
      var v = row[dt];
      m *= (v === undefined || v === null) ? 1 : v;
    });
    return m;
  }

  function statsFor(spId, lvl, ivs) {
    var sp = spOf(spId), b = sp.base || {}, iv = ivs || {};
    function st(base, ivv) { return Math.floor(Math.floor((2 * (base || 50) + (ivv || 0)) * lvl / 100) + 5); }
    return {
      hp: Math.floor((2 * (b.hp || 50) + (iv.hp || 0)) * lvl / 100) + lvl + 10,
      atk: st(b.atk, iv.atk), def: st(b.def, iv.def),
      spa: st(b.spa, iv.spa), spd: st(b.spd, iv.spd), spe: st(b.spe, iv.spe)
    };
  }

  function xpForLevel(n) { n = Math.max(1, Math.floor(n)); return n * n * n; }
  function levelForXp(xp) { return Math.max(1, Math.floor(Math.cbrt(Math.max(0, xp || 0)))); }
  function statTotal(spId) {
    var b = (spOf(spId).base) || {};
    return (b.hp || 0) + (b.atk || 0) + (b.def || 0) + (b.spa || 0) + (b.spd || 0) + (b.spe || 0);
  }
  function baseExp(spId) {
    var sp = spOf(spId);
    if (sp.baseExp) return sp.baseExp;
    return Math.max(40, Math.round(statTotal(spId) / 5));
  }

  function stageMult(s) { return s >= 0 ? (2 + s) / 2 : 2 / (2 - s); }
  function accMult(s) { return s >= 0 ? (3 + s) / 3 : 3 / (3 - s); }

  // att/def: {lvl, stats, stages, types, status}. mv: move data.
  function dmgCalc(att, def, mv) {
    if (!mv || mv.cat === "status" || !mv.pow) return { dmg: 0, eff: 1, crit: false, stab: 1 };
    var crit = U.rand(0, 1) < 1 / 16;
    var aStat = mv.cat === "phys" ? "atk" : "spa";
    var dStat = mv.cat === "phys" ? "def" : "spd";
    var aStage = crit ? Math.max(0, att.stages[aStat] || 0) : (att.stages[aStat] || 0);
    var dStage = crit ? Math.min(0, def.stages[dStat] || 0) : (def.stages[dStat] || 0);
    var A = (att.stats[aStat] || 50) * stageMult(aStage);
    var D = Math.max(1, (def.stats[dStat] || 50) * stageMult(dStage));
    if (mv.cat === "phys" && att.status === "brn") A /= 2;
    var base = Math.floor(Math.floor(Math.floor(2 * att.lvl / 5 + 2) * mv.pow * A / D) / 50) + 2;
    var stab = (att.types || []).indexOf(mv.type) >= 0 ? 1.5 : 1;
    var eff = typeEff(mv.type, def.types || ["Normal"]);
    var rand = 0.85 + U.rand(0, 0.15);
    var dmg = Math.max(1, Math.floor(base * stab * eff * (crit ? 1.5 : 1) * rand));
    return { dmg: dmg, eff: eff, crit: crit, stab: stab };
  }

  var BALL_BONUS = { "poke-ball": 1, "great-ball": 1.5, "ultra-ball": 2, "master-ball": 255, "safari-ball": 1.5 };

  // Returns {caught, shakes} using gen3-style formula.
  function catchCheck(inst, ballId, bonus) {
    var ball = BALL_BONUS[ballId] || 1;
    if (ballId === "master-ball") return { caught: true, shakes: 4 };
    var sp = spOf(inst.sp);
    var rate = (sp.catchRate === undefined ? 45 : sp.catchRate) * (bonus || 1);
    var maxhp = inst.maxhp || 50, hp = Math.max(1, inst.hp || 1);
    var a = ((3 * maxhp - 2 * hp) * rate * ball) / (3 * maxhp);
    if (a >= 255) return { caught: true, shakes: 4 };
    var shakeCheck = Math.floor(1048560 / Math.sqrt(Math.sqrt(16711680 / Math.max(a, 1))));
    var shakes = 0;
    for (var i = 0; i < 4; i++) {
      if (Math.floor(U.rand(0, 65536)) < shakeCheck) shakes++;
      else break;
    }
    return { caught: shakes === 4, shakes: shakes };
  }

  /* ================= battler ================= */
  function makeBattler(inst, side) {
    var stats = statsFor(inst.sp, inst.lvl, inst.ivs);
    var sp = spOf(inst.sp);
    return {
      inst: inst, side: side, sp: sp,
      stats: stats, maxhp: stats.hp, hp: Math.max(1, Math.min(stats.hp, inst.hp == null ? stats.hp : inst.hp)),
      lvl: inst.lvl, types: (sp.types || ["Normal"]).slice(),
      stages: { atk: 0, def: 0, spa: 0, spd: 0, spe: 0, acc: 0, eva: 0 },
      status: inst.status || null, statusTurns: inst.statusTurns || 0,
      volatile: {}, fainted: false,
      moves: (inst.moves || []).map(function (m) {
        var md = mvOf(m.id);
        return { id: m.id, pp: m.pp == null ? md.pp : m.pp, maxpp: md.pp || 10 };
      })
    };
  }
  function effSpe(b) {
    var s = (b.stats.spe || 50) * stageMult(b.stages.spe);
    if (b.status === "par") s /= 4;
    return s;
  }
  function battlerName(b) {
    return (b.inst.nick || b.sp.name || U.titleCase(b.inst.sp));
  }

  /* ================= battle scene ================= */
  var STATUS_LABEL = { par: "PAR", brn: "BRN", psn: "PSN", slp: "SLP", frz: "FRZ" };

  function BattleScene(opts) {
    this.opts = opts || {};
    this.kind = opts.kind || "wild";
    this.trainer = opts.trainer || null;
    this.canCatch = opts.canCatch !== false && this.kind === "wild";
    this.catchable = !!opts.catchable; // boss catch flag
    this.bossBonus = opts.bossCatchBonus || 1;
    this.noRun = !!opts.noRun; // story-critical wild battles (Giratina/Arceus)
    this.onEnd = opts.onEnd;
    this.foeTeam = (Array.isArray(opts.foe) ? opts.foe : [opts.foe]).filter(Boolean);
    this.foeIdx = 0;
    this.dead = false;
    this.phase = "intro";
    this.msg = null; // {text, shown, resolve}
    this.menu = null; // {items, cursor, resolve}
    this.particles = [];
    this.anims = { foeX: 0, foeFlash: 0, meX: 0, meFlash: 0, foeHpShown: -1, meHpShown: -1, ballT: -1, shakeN: 0 };
    this.turnCount = 0;
    this.runAttempts = 0;
    this.participants = {}; // party idx -> true
    this.moveCatsUsed = {};
    this.leadTypes = [];
    this.overclockUsed = false;
    this.foeHeals = (this.kind === "boss" || (this.trainer && this.trainer.ai === "echo")) ? 2 : 0;
  }

  BattleScene.prototype.party = function () {
    try { return (G.Save && G.Save.data && G.Save.data.party) || []; } catch (e) { return []; }
  };
  BattleScene.prototype.options = function () {
    try { return (G.Save && G.Save.data && G.Save.data.options) || {}; } catch (e) { return {}; }
  };
  BattleScene.prototype.animsOn = function () { return this.options().battleAnims !== false; };

  BattleScene.prototype.enter = function () {
    var song = this.kind === "boss" ? "battle-boss" : (this.kind === "trainer" ? "battle-trainer" : "battle-wild");
    try { if (G.Audio) G.Audio.playSong(song); } catch (e) {}
    // preload real sprites for both sides (async, non-blocking; canvases pop in live)
    try {
      if (G.Sprites && G.Sprites.preload && G.Data && G.Data.SPECIES) {
        var S = G.Data.SPECIES, dexes = [];
        this.foeTeam.forEach(function (f) { if (f && S[f.sp] && S[f.sp].dex > 0) dexes.push(S[f.sp].dex); });
        var party = (G.Save && G.Save.data && G.Save.data.party) || [];
        party.forEach(function (m) { if (m && S[m.sp] && S[m.sp].dex > 0) dexes.push(S[m.sp].dex); });
        if (dexes.length) G.Sprites.preload(dexes);
      }
    } catch (e) {}
    this.foeActive = makeBattler(this.foeTeam[0], "foe");
    this.anims.foeHpShown = this.foeActive.hp;
    this.run();
  };

  BattleScene.prototype.exit = function () {
    // restore overworld music
    try {
      var m = G.Overworld && G.Overworld.currentMap ? G.Overworld.currentMap() : null;
      if (G.Audio) G.Audio.playSong((m && m.music) || "town");
    } catch (e) {}
  };

  /* ----- message + menu primitives (promise based) ----- */
  BattleScene.prototype.say = function (text) {
    var self = this;
    return new Promise(function (res) {
      self.msg = { text: text, shown: 0, resolve: res };
      self.phase = "msg";
    });
  };
  BattleScene.prototype.choose = function (items, opts) {
    // items: [{label, desc, disabled}] ; resolves index or -1
    var self = this;
    return new Promise(function (res) {
      self.menu = { items: items, cursor: 0, resolve: res, opts: opts || {}, t: 0 };
      for (var i = 0; i < items.length; i++) if (!items[i].disabled) { self.menu.cursor = i; break; }
      self.phase = "menu";
    });
  };
  BattleScene.prototype.wait = function (sec) {
    var self = this;
    return new Promise(function (res) {
      self._waitT = sec; self._waitRes = res; self.phase = "wait";
    });
  };

  BattleScene.prototype.update = function (dt) {
    if (this.dead) return;
    // particles
    for (var i = this.particles.length - 1; i >= 0; i--) {
      var p = this.particles[i];
      p.x += p.vx * dt; p.y += p.vy * dt; p.life -= dt;
      if (p.life <= 0) this.particles.splice(i, 1);
    }
    if (this.anims.foeFlash > 0) this.anims.foeFlash -= dt;
    if (this.anims.meFlash > 0) this.anims.meFlash -= dt;
    // hp tween
    this.tweenHp(dt);
    var E = G.Engine;
    if (this.phase === "msg" && this.msg) {
      var speed = [0, 30, 60, 120][this.options().textSpeed || 2] || 60;
      if (this.msg.shown < this.msg.text.length) {
        this.msg.shown = Math.min(this.msg.text.length, this.msg.shown + speed * dt);
        if (E.pressed("a") || E.pressed("b")) { this.msg.shown = this.msg.text.length; E.consumeTap(); }
      } else if (E.pressed("a") || E.consumeTap()) {
        var r = this.msg.resolve; this.msg = null;
        try { if (G.Audio) G.Audio.sfx("select"); } catch (e) {}
        if (r) r();
      } else { E.consumeTap(); }
    } else if (this.phase === "menu" && this.menu) {
      this.menu.t += dt;
      var m = this.menu, n = m.items.length;
      function move(d) {
        for (var k = 0; k < n; k++) {
          m.cursor = (m.cursor + d + n) % n;
          if (!m.items[m.cursor].disabled) break;
        }
        try { if (G.Audio) G.Audio.sfx("select"); } catch (e) {}
      }
      if (E.pressed("up")) move(m.opts.cols === 2 ? -2 : -1);
      else if (E.pressed("down")) move(m.opts.cols === 2 ? 2 : 1);
      else if (E.pressed("left") && m.opts.cols === 2) move(-1);
      else if (E.pressed("right") && m.opts.cols === 2) move(1);
      else if (E.pressed("a")) {
        var idx = m.cursor, it = m.items[idx], res = m.resolve;
        this.menu = null;
        try { if (G.Audio) G.Audio.sfx("select"); } catch (e) {}
        if (res) res(it && it.disabled ? -1 : idx);
      } else if (E.pressed("b") && !m.opts.noCancel) {
        var res2 = m.resolve; this.menu = null;
        if (res2) res2(-1);
      }
      var t = E.consumeTap();
      if (t && this.menu) this.tapMenu(t.x, t.y);
    } else if (this.phase === "wait") {
      this._waitT -= dt;
      if (this._waitT <= 0) { var r2 = this._waitRes; this._waitRes = null; this.phase = ""; if (r2) r2(); }
    }
  };

  BattleScene.prototype.tapMenu = function (x, y) {
    var m = this.menu; if (!m) return;
    var L = this.menuLayout();
    for (var i = 0; i < L.rows.length; i++) {
      var r = L.rows[i];
      var idx = (r.item !== undefined) ? r.item : i;
      if (x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h) {
        if (m.items[idx].disabled) return;
        var res = m.resolve; this.menu = null;
        try { if (G.Audio) G.Audio.sfx("select"); } catch (e) {}
        if (res) res(idx);
        return;
      }
    }
  };

  BattleScene.prototype.menuLayout = function () {
    var m = this.menu, o = m.opts;
    var rows = [];
    if (o.kind === "moves") {
      for (var i = 0; i < m.items.length; i++) {
        var cx = 8 + (i % 2) * 236, cy = 232 + Math.floor(i / 2) * 40;
        rows.push({ x: cx, y: cy, w: 232, h: 36 });
      }
    } else if (o.kind === "command") {
      for (var j = 0; j < m.items.length; j++) {
        rows.push({ x: 330 + (j % 2) * 72, y: 196 + Math.floor(j / 2) * 30, w: 70, h: 28 });
      }
    } else {
      // generic list: mirrors drawMenu's list layout (panel 40,40,400x240; rows from y=74 step 20)
      var start = Math.max(0, Math.min(m.cursor - 4, m.items.length - 9));
      var vis = Math.min(9, m.items.length);
      for (var k = 0; k < vis; k++) {
        rows.push({ x: 40, y: 74 + k * 20 - 4, w: 400, h: 20, item: start + k });
      }
    }
    return { rows: rows };
  };

  BattleScene.prototype.tweenHp = function (dt) {
    var a = this.anims;
    function tw(cur, target) {
      if (cur < 0) return target;
      if (cur === target) return cur;
      var d = Math.max(1, Math.ceil(Math.abs(target - cur) * dt * 8));
      return cur < target ? Math.min(target, cur + d) : Math.max(target, cur - d);
    }
    if (this.foeActive) a.foeHpShown = tw(a.foeHpShown, this.foeActive.hp);
    if (this.meActive) a.meHpShown = tw(a.meHpShown, this.meActive.hp);
  };

  /* ----- visual effects ----- */
  BattleScene.prototype.burst = function (x, y, color, n) {
    if (!this.animsOn()) return;
    for (var i = 0; i < (n || 12); i++) {
      var ang = U.rand(0, Math.PI * 2), sp = U.rand(40, 160);
      this.particles.push({ x: x, y: y, vx: Math.cos(ang) * sp, vy: Math.sin(ang) * sp - 40, life: U.rand(0.3, 0.7), color: color, size: U.randi(2, 4) });
    }
  };
  BattleScene.prototype.lunge = async function (side) {
    if (!this.animsOn()) return;
    var a = this.anims, key = side === "foe" ? "foeX" : "meX";
    var dir = side === "foe" ? -1 : 1;
    var t = 0;
    while (t < 0.16) { a[key] = dir * 26 * (t / 0.16); t += 1 / 60; await this.wait(1 / 60); }
    t = 0;
    while (t < 0.16) { a[key] = dir * 26 * (1 - t / 0.16); t += 1 / 60; await this.wait(1 / 60); }
    a[key] = 0;
  };
  BattleScene.prototype.flashTarget = function (side) {
    var a = this.anims;
    if (side === "foe") a.foeFlash = 0.25; else a.meFlash = 0.25;
  };

  /* ================= main flow ================= */
  BattleScene.prototype.run = async function () {
    var self = this;
    try {
      if (this.kind === "trainer" || this.kind === "boss") {
        var tn = this.trainer ? this.trainer.name : "Trainer";
        var timg = null;
        try { timg = G.Sprites.trainer(this.trainer ? this.trainer.sprite : "grunt", { size: 96 }); } catch (e) {}
        this.trainerImg = timg;
        this.phase = "trainerintro";
        await this.wait(0.9);
        this.trainerImg = null;
        await this.say(tn + " wants to battle!");
        await this.say("Go! " + this.foeName(this.foeActive) + "!");
      } else {
        await this.say("Wild " + this.foeName(this.foeActive) + " appeared!");
      }
      try { if (G.Audio) G.Audio.cry((this.foeActive.sp.sprite && this.foeActive.sp.sprite.seed) || 1); } catch (e) {}

      // send out player mon
      var idx = this.firstAlive();
      if (idx < 0) { this.endBattle(false, false); return; }
      this.leadTypes = (this.party()[idx] ? spOf(this.party()[idx].sp).types : ["Normal"]) || ["Normal"];
      this.sendOut(idx, true);
      await this.say("Go! " + battlerName(this.meActive) + "!");
      try { if (G.Audio) G.Audio.cry((this.meActive.sp.sprite && this.meActive.sp.sprite.seed) || 2); } catch (e) {}

      this.battleLoop();
    } catch (e) { this.endBattle(false, false); }
  };

  BattleScene.prototype.foeName = function (b) {
    var nm = battlerName(b);
    return (this.kind === "wild" ? "" : "") + nm + (this.kind !== "wild" ? "" : "");
  };

  BattleScene.prototype.firstAlive = function () {
    var p = this.party();
    for (var i = 0; i < p.length; i++) if (p[i] && p[i].hp > 0) return i;
    return -1;
  };

  BattleScene.prototype.sendOut = function (idx, first) {
    var inst = this.party()[idx];
    this.meActive = makeBattler(inst, "me");
    this.meIdx = idx;
    this.participants[idx] = true;
    this.anims.meHpShown = this.meActive.hp;
    this.anims.meX = 0;
  };

  BattleScene.prototype.battleLoop = async function () {
    while (!this.dead) {
      if (this.meActive.fainted) {
        var sw = await this.chooseFaintSwitch();
        if (sw < 0) { this.endBattle(false, false); return; }
        this.sendOut(sw);
        await this.say("Go! " + battlerName(this.meActive) + "!");
      }
      if (this.foeActive.fainted) {
        var more = await this.handleFoeFaint();
        if (more === "end") return;
      }
      this.turnCount++;
      var cmd = await this.commandPhase();
      if (this.dead) return;
      var playerActed = false;
      if (cmd === "run") {
        var fled = this.tryRun();
        if (fled) { await this.say("Got away safely!"); this.endBattle(true, true); return; }
        await this.say("Can't escape!");
      } else if (cmd && cmd.action === "catch") {
        var caught = await this.doCatch(cmd.ball);
        if (caught === true) { this.endBattle(true, false, { caught: [this.foeActive.inst] }); return; }
        // failed catch: foe still moves
        await this.foeTurnAfterPlayer(cmd);
        continue;
      } else if (cmd && cmd.action === "item") {
        await this.useBattleItem(cmd.item, cmd.target);
        playerActed = true;
      } else if (cmd && cmd.action === "switch") {
        this.sendOut(cmd.idx);
        await this.say("Go! " + battlerName(this.meActive) + "!");
        playerActed = true;
      } else if (cmd && cmd.action === "move") {
        this.playerMoveIdx = cmd.i;
      } else if (cmd && cmd.action === "ai") {
        var dec = this.overclockPick();
        this.overclockUsed = true;
        if (dec.action === "move") this.playerMoveIdx = dec.i;
        else if (dec.action === "switch") {
          this.sendOut(dec.i);
          await this.say("NEXUS sent out " + battlerName(this.meActive) + "!");
          playerActed = true;
        }
        else if (dec.action === "item") { await this.useBattleItem(dec.item, this.meIdx); playerActed = true; }
      }
      // foe picks (switching / items cost the player's turn; foe still acts)
      var foeDec = this.foePick();
      if (foeDec.action === "heal") {
        await this.foeHeal();
        if (!playerActed && !this.dead) {
          await this.execSingle({ action: "move", i: this.playerMoveIdx }, this.meActive, this.foeActive);
        }
      } else if (playerActed) {
        await this.execSingle({ action: "move", i: foeDec.i }, this.foeActive, this.meActive);
      } else {
        await this.executeTurn(foeDec);
      }
      if (this.dead) return;
      await this.endOfTurn();
      if (this.dead) return;
    }
  };

  BattleScene.prototype.commandPhase = async function () {
    var items = [{ label: "FIGHT" }, { label: "POKéMON" }, { label: "BAG" }];
    if (this.options().overclock) items.push({ label: "AI" });
    var canRun = this.kind === "wild" && !this.noRun;
    items.push({ label: "RUN", disabled: !canRun });
    var i = await this.choose(items, { kind: "command", noCancel: true });
    if (i === 0) return await this.fightPhase();
    if (i === 1) {
      var sw = await this.partyPhase();
      if (sw < 0) return await this.commandPhase();
      return { action: "switch", idx: sw };
    }
    if (i === 2) {
      var b = await this.bagPhase();
      if (!b) return await this.commandPhase();
      return b;
    }
    var aiIdx = this.options().overclock ? 3 : -1;
    if (i === aiIdx) return { action: "ai" };
    return "run";
  };

  BattleScene.prototype.fightPhase = async function () {
    var b = this.meActive;
    var items = b.moves.map(function (m, i) {
      var md = mvOf(m.id);
      return { label: md.name, desc: "PP " + m.pp + "/" + m.maxpp + "  " + md.type, disabled: m.pp <= 0, moveIdx: i, type: md.type };
    });
    while (items.length < 4) items.push({ label: "—", disabled: true });
    var i = await this.choose(items, { kind: "moves" });
    if (i < 0) return await this.commandPhase();
    var it = items[i];
    if (it.disabled || it.moveIdx === undefined) return await this.fightPhase();
    return { action: "move", i: it.moveIdx };
  };

  BattleScene.prototype.partyPhase = async function () {
    // inline party select (conscious, not active)
    var p = this.party();
    var items = p.map(function (m, i) {
      var sp = spOf(m.sp);
      var nm = m.nick || sp.name;
      var dead = !m || m.hp <= 0;
      return { label: nm + " Lv" + m.lvl, desc: "HP " + Math.max(0, m.hp) + "/" + (m.maxhp || "?"), disabled: dead || i === this.meIdx, idx: i };
    }, this);
    items.push({ label: "Cancel" });
    var i = await this.choose(items, { kind: "list" });
    if (i < 0 || i >= p.length) return -1;
    return items[i].idx;
  };

  BattleScene.prototype.bagPhase = async function () {
    var bag = (G.Save && G.Save.data && G.Save.data.bag) || {};
    var items = [];
    var self = this;
    Object.keys(bag).forEach(function (id) {
      if (bag[id] <= 0) return;
      var it = (G.Data && G.Data.ITEMS && G.Data.ITEMS[id]) || { name: U.titleCase(id), kind: "heal", desc: "" };
      var usable = false, action = null;
      if (it.kind === "ball" && self.canCatch) { usable = true; action = { action: "catch", ball: id }; }
      else if (it.kind === "heal") { usable = true; action = { action: "item", item: id, target: "choose" }; }
      if (usable) items.push({ label: it.name + " x" + bag[id], desc: it.desc || "", disabled: false, act: action, id: id });
    });
    if (!items.length) { await this.say("No usable items!"); return null; }
    items.push({ label: "Cancel" });
    var i = await this.choose(items, { kind: "list" });
    if (i < 0 || i >= items.length - 1) return null;
    var act = items[i].act;
    if (act.action === "item" && act.target === "choose") {
      var t = await this.partyPhaseHeal();
      if (t < 0) return null;
      act.target = t;
    }
    return act;
  };

  BattleScene.prototype.partyPhaseHeal = async function () {
    var p = this.party();
    var items = p.map(function (m, i) {
      var sp = spOf(m.sp);
      var nm = m.nick || sp.name;
      return { label: nm + " Lv" + m.lvl, desc: "HP " + Math.max(0, m.hp) + "/" + (m.maxhp || "?"), disabled: m.hp <= 0, idx: i };
    });
    items.push({ label: "Cancel" });
    var i = await this.choose(items, { kind: "list" });
    if (i < 0 || i >= p.length) return -1;
    return items[i].idx;
  };

  BattleScene.prototype.useBattleItem = async function (itemId, targetIdx) {
    var d = G.Save && G.Save.data;
    var bag = d ? d.bag : {};
    if (!bag || !(bag[itemId] > 0)) { await this.say("None left!"); return; }
    var it = (G.Data && G.Data.ITEMS && G.Data.ITEMS[itemId]) || { name: U.titleCase(itemId), kind: "heal" };
    if (it.kind === "ball") return; // handled via catch path
    bag[itemId]--;
    try { if (G.Audio) G.Audio.sfx("heal"); } catch (e) {}
    var p = this.party();
    var m = p[targetIdx];
    if (!m) return;
    var healAmt = it.heal || 20;
    if (itemId === "max-potion") healAmt = 9999;
    if (itemId === "full-restore") healAmt = 9999;
    m.hp = Math.min(m.maxhp || 100, m.hp + healAmt);
    if (it.cure || itemId === "full-heal" || itemId === "full-restore") m.status = null;
    if (this.meIdx === targetIdx && this.meActive) {
      this.meActive.hp = m.hp; this.meActive.status = m.status;
    }
    this.burst(120, 200, "#58f858", 10);
    await this.say("Used " + it.name + " on " + (m.nick || spOf(m.sp).name) + "!");
  };

  BattleScene.prototype.tryRun = function () {
    if (this.kind !== "wild") return false;
    this.runAttempts++;
    var ps = effSpe(this.meActive), fs = effSpe(this.foeActive);
    if (ps >= fs) return true;
    var odds = Math.floor(ps * 128 / Math.max(1, fs) + 30 * this.runAttempts) % 256;
    return U.rand(0, 256) < odds;
  };

  /* ----- foe AI ----- */
  BattleScene.prototype.foePick = function () {
    var ai = (this.trainer && this.trainer.ai) || "basic";
    var foe = this.foeActive;
    // boss + echo heal (echo capped at 2 per battle, set at init)
    if ((ai === "boss" || ai === "echo") && this.foeHeals > 0 && foe.hp < foe.maxhp * 0.3 && U.rand(0, 1) < 0.45) {
      return { action: "heal" };
    }
    if (ai === "echo" || ai === "boss") {
      var dec;
      if (ai === "echo" && U.rand(0, 1) < 0.30) {
        // ECHO shows off / misreads: human-like mistake ~30% of turns
        dec = this.flavorPick(foe);
      } else {
        dec = this.smartPick(foe, this.meActive);
      }
      return { action: "move", i: dec };
    }
    // basic: prefer effective moves, some randomness
    var scored = foe.moves.map(function (m, i) {
      var md = mvOf(m.id);
      if (m.pp <= 0) return { i: i, s: -1 };
      var s;
      if (md.cat === "status" || !md.pow) s = U.rand(0, 20);
      else s = md.pow * Math.max(0.25, typeEff(md.type, this.meActive.types)) * U.rand(0.7, 1.3);
      return { i: i, s: s };
    }, this).filter(function (x) { return x.s >= 0; });
    if (!scored.length) return { action: "move", i: 0 };
    scored.sort(function (a, b) { return b.s - a.s; });
    var pick = scored[Math.min(scored.length - 1, U.randi(0, Math.min(2, scored.length - 1)))];
    return { action: "move", i: pick.i };
  };

  BattleScene.prototype.smartPick = function (foe, me) {
    // shared smart heuristic (also used for echo AI)
    var best = 0, bestS = -1e9;
    foe.moves.forEach(function (m, i) {
      var md = mvOf(m.id);
      if (m.pp <= 0) return;
      var s;
      if (md.cat === "status" || !md.pow) {
        s = 10 + U.rand(0, 5);
        // don't spam setup at full stages
      } else {
        var stab = foe.types.indexOf(md.type) >= 0 ? 1.5 : 1;
        s = md.pow * stab * Math.max(0.1, typeEff(md.type, me.types)) * ((md.acc || 100) / 100);
        if (typeEff(md.type, me.types) >= 2) s *= 1.4;
        s *= U.rand(0.9, 1.1);
      }
      if (s > bestS) { bestS = s; best = i; }
    });
    return best;
  };

  // ECHO's "human" turn: picks a legal move with show-off bias instead of the
  // optimal one — random damaging move, sometimes a mistimed status move.
  BattleScene.prototype.flavorPick = function (foe) {
    var usable = [];
    foe.moves.forEach(function (m, i) {
      if (m.pp > 0) usable.push(i);
    });
    if (!usable.length) return 0;
    var dmg = usable.filter(function (i) {
      var md = mvOf(foe.moves[i].id);
      return md && md.cat !== "status" && md.pow > 0;
    });
    // 75%: random damaging move (not necessarily best); 25%: any legal move
    var pool = (dmg.length && U.rand(0, 1) < 0.75) ? dmg : usable;
    return pool[U.randi(0, pool.length - 1)];
  };

  BattleScene.prototype.foeHeal = async function () {
    this.foeHeals--;
    var foe = this.foeActive;
    foe.hp = Math.min(foe.maxhp, foe.hp + Math.floor(foe.maxhp / 2));
    this.burst(360, 100, "#58f858", 10);
    var tn = this.trainer ? this.trainer.name : "Foe";
    await this.say(tn + " used a Hyper Potion!");
  };

  BattleScene.prototype.foeTurnAfterPlayer = async function (cmd) {
    // player used ball and failed: foe gets a move
    var foeDec = this.foePick();
    if (foeDec.action === "heal") await this.foeHeal();
    else await this.execSingle(foeDec, this.foeActive, this.meActive);
    await this.endOfTurn();
  };

  BattleScene.prototype.executeTurn = async function (foeDec) {
    var pAct = { kind: "move", i: this.playerMoveIdx == null ? 0 : this.playerMoveIdx, user: this.meActive, foe: this.foeActive };
    var fAct = { kind: foeDec.action === "heal" ? "heal" : "move", i: foeDec.i || 0, user: this.foeActive, foe: this.meActive };
    var pPrio = this.movePrio(this.meActive, pAct.i);
    var fPrio = this.movePrio(this.foeActive, fAct.i);
    var order;
    if (pPrio !== fPrio) order = pPrio > fPrio ? [pAct, fAct] : [fAct, pAct];
    else {
      var ps = effSpe(this.meActive), fs = effSpe(this.foeActive);
      order = ps === fs ? (U.rand(0, 1) < 0.5 ? [pAct, fAct] : [fAct, pAct]) : (ps > fs ? [pAct, fAct] : [fAct, pAct]);
    }
    for (var k = 0; k < order.length; k++) {
      if (this.dead) return;
      var a = order[k];
      if (a.user.fainted) continue;
      if (a.kind === "heal") { await this.foeHeal(); continue; }
      await this.execSingle({ action: "move", i: a.i }, a.user, a.foe);
      if (this.meActive.fainted || this.foeActive.fainted) break;
    }
  };

  BattleScene.prototype.movePrio = function (b, i) {
    var m = b.moves[i];
    if (!m) return 0;
    var md = mvOf(m.id);
    return (md.eff && md.eff.priority) || 0;
  };

  BattleScene.prototype.execSingle = async function (dec, user, target) {
    if (!user || !target || user.fainted || target.fainted || this.dead) return;
    var m = user.moves[dec.i];
    if (!m) m = user.moves[0];
    if (!m) return;
    var md = mvOf(m.id);
    var uname = battlerName(user);

    // status pre-checks
    if (user.status === "slp") {
      user.statusTurns = (user.statusTurns || 1) - 1;
      if (user.statusTurns <= 0) {
        user.status = null; user.inst.status = null;
        await this.say(uname + " woke up!");
      } else { await this.say(uname + " is fast asleep!"); return; }
    }
    if (user.status === "frz") {
      if (U.rand(0, 1) < 0.2) {
        user.status = null; user.inst.status = null;
        await this.say(uname + " thawed out!");
      } else { await this.say(uname + " is frozen solid!"); return; }
    }
    if (user.status === "par" && U.rand(0, 1) < 0.25) {
      await this.say(uname + " is paralyzed! It can't move!");
      return;
    }
    if (user.volatile.flinch) { user.volatile.flinch = false; await this.say(uname + " flinched!"); return; }
    if (m.pp <= 0) { await this.say("No PP left for " + md.name + "!"); return; }
    m.pp--;

    await this.say(uname + " used " + md.name + "!");
    if (this.playerSide(user)) this.moveCatsUsed[md.cat] = (this.moveCatsUsed[md.cat] || 0) + 1;
    await this.lunge(user.side);

    // protect
    if (target.volatile.protect) {
      target.volatile.protect = false;
      await this.say(battlerName(target) + " protected itself!");
      return;
    }

    // accuracy
    var acc = md.acc == null ? 100 : md.acc;
    var accM = accMult(user.stages.acc) / accMult(target.stages.eva);
    if (U.rand(0, 100) > acc * accM) {
      await this.say("But it missed!");
      return;
    }

    if (md.cat === "status") {
      await this.applyStatusMove(user, target, md);
      return;
    }

    var hits = 1;
    if (md.eff && md.eff.hits) {
      var hr = md.eff.hits;
      hits = U.randi(hr[0], hr[1]);
    }
    var totalDealt = 0;
    for (var h = 0; h < hits; h++) {
      if (target.fainted) break;
      var r = dmgCalc(
        { lvl: user.lvl, stats: user.stats, stages: user.stages, types: user.types, status: user.status },
        { stats: target.stats, stages: target.stages, types: target.types },
        md
      );
      if (r.eff === 0) {
        await this.say("It doesn't affect " + battlerName(target) + "...");
        break;
      }
      target.hp = Math.max(0, target.hp - r.dmg);
      totalDealt += r.dmg;
      this.flashTarget(target.side);
      this.burst(target.side === "foe" ? 360 : 120, target.side === "foe" ? 100 : 190, G.Engine.typeColor(md.type), 10);
      try { if (G.Audio) G.Audio.sfx(r.eff > 1 ? "super-effective" : "hit"); } catch (e) {}
      await this.wait(this.animsOn() ? 0.35 : 0.05);
      if (r.crit) await this.say("A critical hit!");
      if (r.eff > 1) await this.say("It's super effective!");
      else if (r.eff < 1) await this.say("It's not very effective...");
      if (hits > 1) await this.say("Hit " + (h + 1) + " time(s)!");
      if (target.hp <= 0) { this.faint(target); break; }
    }

    // secondary effects
    var eff = md.eff || {};
    if (totalDealt > 0 && !target.fainted) {
      if (eff.flinch && U.rand(0, 100) < eff.flinch) target.volatile.flinch = true;
      if (eff.status && U.rand(0, 100) < (eff.statusChance == null ? 100 : eff.statusChance)) {
        this.inflictStatus(target, eff.status, true);
      }
      if (eff.foeStat) this.applyStages(target, eff.foeStat, false);
    }
    if (eff.stat) this.applyStages(user, eff.stat, true);
    if (eff.recoil && totalDealt > 0) {
      var rec = Math.max(1, Math.floor(totalDealt * eff.recoil));
      user.hp = Math.max(0, user.hp - rec);
      await this.say(uname + " was hit by recoil!");
      if (user.hp <= 0) this.faint(user);
    }
    if (eff.drain && totalDealt > 0 && !user.fainted) {
      var dr = Math.max(1, Math.floor(totalDealt * eff.drain));
      user.hp = Math.min(user.maxhp, user.hp + dr);
      await this.say(uname + " drained HP!");
    }
    if (eff.heal && !user.fainted) {
      user.hp = Math.min(user.maxhp, user.hp + Math.floor(user.maxhp * eff.heal));
      this.burst(user.side === "foe" ? 360 : 120, user.side === "foe" ? 100 : 190, "#58f858", 8);
      await this.say(uname + " restored HP!");
    }
    this.syncInst(user); this.syncInst(target);
  };

  BattleScene.prototype.playerSide = function (b) { return b.side === "me"; };

  BattleScene.prototype.applyStatusMove = async function (user, target, md) {
    var eff = md.eff || {}, uname = battlerName(user), tname = battlerName(target);
    if (eff.protect) {
      user.volatile.protect = true;
      await this.say(uname + " protected itself!");
      return;
    }
    if (eff.stat) this.applyStages(user, eff.stat, true);
    if (eff.foeStat) this.applyStages(target, eff.foeStat, false);
    if (eff.heal) {
      user.hp = Math.min(user.maxhp, user.hp + Math.floor(user.maxhp * eff.heal));
      this.burst(user.side === "foe" ? 360 : 120, user.side === "foe" ? 100 : 190, "#58f858", 8);
      await this.say(uname + " restored HP!");
    }
    if (eff.status) {
      if (U.rand(0, 100) < (eff.statusChance == null ? 100 : eff.statusChance)) {
        this.inflictStatus(target, eff.status, true);
      } else {
        await this.say("But it failed!");
      }
    } else if (!eff.stat && !eff.foeStat && !eff.heal && !eff.protect) {
      await this.say("But nothing happened!");
    }
    this.syncInst(user); this.syncInst(target);
  };

  BattleScene.prototype.applyStages = async function (b, changes, isSelf) {
    var names = { atk: "Attack", def: "Defense", spa: "Sp. Atk", spd: "Sp. Def", spe: "Speed", acc: "accuracy", eva: "evasiveness" };
    var msgs = [];
    for (var k in changes) {
      var d = changes[k];
      var before = b.stages[k] || 0;
      b.stages[k] = U.clamp(before + d, -6, 6);
      if (b.stages[k] !== before) {
        msgs.push(battlerName(b) + "'s " + (names[k] || k) + (d > 0 ? " rose!" : " fell!"));
      }
    }
    for (var i = 0; i < msgs.length; i++) await this.say(msgs[i]);
  };

  BattleScene.prototype.inflictStatus = async function (b, st, silent) {
    if (b.status) { if (!silent) await this.say("But it failed!"); return; }
    var immune = { par: ["Electric"], brn: ["Fire"], frz: ["Ice"], psn: ["Poison", "Steel"] };
    if ((immune[st] || []).some(function (t) { return b.types.indexOf(t) >= 0; })) { await this.say("But it failed!"); return; }
    b.status = st; b.inst.status = st;
    if (st === "slp") { b.statusTurns = U.randi(1, 3); b.inst.statusTurns = b.statusTurns; }
    var label = { par: "paralyzed", brn: "burned", psn: "poisoned", slp: "fell asleep", frz: "frozen" }[st] || st;
    await this.say(battlerName(b) + " was " + label + "!");
  };

  BattleScene.prototype.faint = function (b) {
    b.fainted = true; b.hp = 0;
    this.syncInst(b);
    try { if (G.Audio) G.Audio.sfx("faint"); } catch (e) {}
  };

  BattleScene.prototype.syncInst = function (b) {
    if (b.side === "me") {
      b.inst.hp = b.hp;
      b.inst.status = b.status;
      b.inst.statusTurns = b.statusTurns;
      b.inst.moves.forEach(function (mm, i) { if (b.moves[i]) mm.pp = b.moves[i].pp; });
    } else {
      b.inst.hp = b.hp;
    }
  };

  BattleScene.prototype.endOfTurn = async function () {
    var order = [this.meActive, this.foeActive];
    for (var i = 0; i < order.length; i++) {
      var b = order[i];
      if (!b || b.fainted) continue;
      if (b.status === "brn") {
        b.hp = Math.max(0, b.hp - Math.max(1, Math.floor(b.maxhp / 16)));
        await this.say(battlerName(b) + " was hurt by its burn!");
      } else if (b.status === "psn") {
        b.hp = Math.max(0, b.hp - Math.max(1, Math.floor(b.maxhp / 8)));
        await this.say(battlerName(b) + " was hurt by poison!");
      }
      if (b.hp <= 0 && !b.fainted) this.faint(b);
      this.syncInst(b);
    }
  };

  BattleScene.prototype.chooseFaintSwitch = async function () {
    await this.say(battlerName(this.meActive) + " fainted!");
    var p = this.party();
    var alive = p.some(function (m, i) { return m && m.hp > 0 && i !== this.meIdx; }, this);
    if (!alive) return -1;
    var items = p.map(function (m, i) {
      var sp = spOf(m.sp);
      return { label: (m.nick || sp.name) + " Lv" + m.lvl, desc: "HP " + Math.max(0, m.hp), disabled: m.hp <= 0 || i === this.meIdx, idx: i };
    }, this);
    var i = await this.choose(items, { kind: "list", noCancel: true });
    return items[i] ? items[i].idx : -1;
  };

  BattleScene.prototype.handleFoeFaint = async function () {
    var foe = this.foeActive;
    await this.say("Enemy " + battlerName(foe) + " fainted!");
    this.burst(360, 100, "#ffffff", 14);
    await this.giveXp(foe);
    this.foeIdx++;
    if (this.foeIdx >= this.foeTeam.length) {
      // victory
      if (this.kind === "trainer" || this.kind === "boss") {
        var reward = (this.trainer && this.trainer.reward) || 200;
        try {
          var d = G.Save && G.Save.data;
          if (d) d.money = (d.money || 0) + reward;
        } catch (e) {}
        await this.say("You defeated " + (this.trainer ? this.trainer.name : "the trainer") + "! Got $" + reward + "!");
      }
      await this.postBattleEvos();
      this.endBattle(true, false);
      return "end";
    }
    this.foeActive = makeBattler(this.foeTeam[this.foeIdx], "foe");
    this.anims.foeHpShown = this.foeActive.hp;
    this.anims.foeX = 0;
    await this.say("Enemy sent out " + battlerName(this.foeActive) + "!");
    return "next";
  };

  BattleScene.prototype.giveXp = async function (foe) {
    var gain = Math.floor(baseExp(foe.inst.sp) * foe.lvl / 7);
    var idxs = Object.keys(this.participants).map(Number).filter(function (i) {
      var p = this.party()[i];
      return p && p.hp > 0;
    }, this);
    if (!idxs.length) return;
    var self = this;
    for (var k = 0; k < idxs.length; k++) {
      var m = this.party()[idxs[k]];
      if (!m) continue;
      m.xp = (m.xp || 0) + gain;
      await this.say((m.nick || spOf(m.sp).name) + " gained " + gain + " XP!");
      while (m.xp >= xpForLevel(m.lvl + 1) && m.lvl < 100) {
        m.lvl++;
        try { if (G.Audio) G.Audio.sfx("levelup"); } catch (e) {}
        await this.say((m.nick || spOf(m.sp).name) + " grew to Lv" + m.lvl + "!");
        if (G.Party && G.Party.recalc) G.Party.recalc(m);
        await this.checkMoveLearn(m);
      }
    }
  };

  BattleScene.prototype.checkMoveLearn = async function (m) {
    var sp = spOf(m.sp);
    var learns = (sp.levelMoves || []).filter(function (lm) { return lm[0] === m.lvl; });
    for (var i = 0; i < learns.length; i++) {
      var mvId = learns[i][1], md = mvOf(mvId);
      var known = m.moves.some(function (mm) { return mm.id === mvId; });
      if (known) continue;
      if (m.moves.length < 4) {
        m.moves.push({ id: mvId, pp: md.pp, maxpp: md.pp });
        await this.say((m.nick || sp.name) + " learned " + md.name + "!");
      } else {
        var items = m.moves.map(function (mm) {
          var d = mvOf(mm.id);
          return { label: d.name };
        });
        items.push({ label: "Don't learn" });
        var c = await this.choose(items, { kind: "list", noCancel: true });
        if (c >= 0 && c < 4) {
          var oldName = mvOf(m.moves[c].id).name;
          m.moves[c] = { id: mvId, pp: md.pp, maxpp: md.pp };
          await this.say("Forgot " + oldName + "... and learned " + md.name + "!");
        }
      }
    }
  };

  BattleScene.prototype.postBattleEvos = async function () {
    var p = this.party();
    for (var i = 0; i < p.length; i++) {
      var m = p[i];
      if (!m || m.hp <= 0) continue;
      var sp = spOf(m.sp);
      var evos = sp.evo || [];
      for (var e = 0; e < evos.length; e++) {
        var ev = evos[e];
        if (ev.by === "level" && m.lvl >= ev.at) {
          await this.evolveScene(m, ev.to);
          break;
        }
      }
    }
  };

  BattleScene.prototype.evolveScene = async function (m, toId) {
    var from = spOf(m.sp), to = spOf(toId);
    try { if (G.Audio) G.Audio.playSong("evolution"); } catch (e) {}
    this.evoAnim = { from: from.id, to: toId, t: 0 };
    await this.say("What? " + (m.nick || from.name) + " is evolving!");
    var t = 0;
    while (t < 2.2) { this.evoAnim.t = t; t += 1 / 60; await this.wait(1 / 60); }
    var oldMax = m.maxhp || 50, pct = oldMax ? m.hp / oldMax : 1;
    m.sp = toId;
    if (G.Party && G.Party.recalc) G.Party.recalc(m);
    m.hp = Math.max(1, Math.round((m.maxhp || 50) * pct));
    try {
      var d = G.Save && G.Save.data;
      if (d && d.dex) { d.dex.seen[toId] = true; d.dex.caught[toId] = true; }
    } catch (e) {}
    try { if (G.Audio) G.Audio.sfx("fanfare"); } catch (e) {}
    this.evoAnim = null;
    await this.say((m.nick || from.name) + " evolved into " + to.name + "!");
    await this.checkMoveLearn(m);
    try {
      var m2 = G.Overworld && G.Overworld.currentMap ? G.Overworld.currentMap() : null;
      if (G.Audio) G.Audio.playSong(this.kind === "boss" ? "battle-boss" : (this.kind === "trainer" ? "battle-trainer" : "battle-wild"));
    } catch (e) {}
  };

  /* ----- catching ----- */
  BattleScene.prototype.doCatch = async function (ballId) {
    var d = G.Save && G.Save.data;
    var bag = d ? d.bag : {};
    if (!(bag[ballId] > 0)) { await this.say("No " + ballId + " left!"); return null; }
    bag[ballId]--;
    try { if (G.Audio) G.Audio.sfx("ball"); } catch (e) {}
    await this.say("You threw a " + ((G.Data && G.Data.ITEMS && G.Data.ITEMS[ballId] && G.Data.ITEMS[ballId].name) || ballId) + "!");
    var res = catchCheck(this.foeActive.inst, ballId, this.bossBonus);
    try { if (G.Audio) G.Audio.sfx("catch-click"); } catch (e) {}
    for (var s = 0; s < res.shakes; s++) {
      await this.wait(0.55);
      try { if (G.Audio) G.Audio.sfx("shake"); } catch (e) {}
      this.anims.shakeN = s + 1;
    }
    this.anims.shakeN = 0;
    if (res.caught) {
      await this.say("Gotcha! " + battlerName(this.foeActive) + " was caught!");
      try { if (G.Audio) G.Audio.sfx("fanfare"); } catch (e) {}
      var inst = this.foeActive.inst;
      try {
        var dd = G.Save && G.Save.data;
        if (dd && dd.dex) { dd.dex.seen[inst.sp] = true; dd.dex.caught[inst.sp] = true; }
      } catch (e) {}
      // nickname?
      var nm = await this.askNickname(battlerName(this.foeActive));
      if (nm) inst.nick = nm;
      try { if (G.Party) G.Party.addToPartyOrBox(inst); } catch (e) {}
      return true;
    }
    await this.say("Oh no! It broke free!");
    return false;
  };

  BattleScene.prototype.askNickname = async function (defName) {
    var self = this;
    var c = await this.choose([{ label: "Yes" }, { label: "No" }], { kind: "list", title: "Give a nickname?" });
    if (c !== 0) return null;
    return new Promise(function (res) {
      try {
        G.Engine.namingScreen(defName, 10, function (nm) { res(nm === defName ? null : nm); });
      } catch (e) { res(null); }
    });
  };

  /* ----- overclock ----- */
  BattleScene.prototype.overclockPick = function () {
    var bs = {
      me: {
        idx: this.meIdx, types: this.meActive.types, hp: this.meActive.hp, maxhp: this.meActive.maxhp,
        lvl: this.meActive.lvl, stats: this.meActive.stats, status: this.meActive.status,
        moves: this.meActive.moves.map(function (m) {
          var md = mvOf(m.id);
          return { id: m.id, type: md.type, cat: md.cat, pow: md.pow, acc: md.acc, pp: m.pp };
        })
      },
      foe: {
        types: this.foeActive.types, hp: this.foeActive.hp, maxhp: this.foeActive.maxhp,
        lvl: this.foeActive.lvl, stats: this.foeActive.stats, status: this.foeActive.status,
        moves: this.foeActive.moves.map(function (m) {
          var md = mvOf(m.id);
          return { id: m.id, type: md.type, cat: md.cat, pow: md.pow, acc: md.acc };
        })
      },
      party: this.party().map(function (m, i) {
        return {
          idx: i, alive: m.hp > 0, hp: m.hp, maxhp: m.maxhp || 50,
          types: spOf(m.sp).types || ["Normal"],
          moves: (m.moves || []).map(function (mm) {
            var md = mvOf(mm.id);
            return { id: mm.id, type: md.type, cat: md.cat, pow: md.pow, acc: md.acc, pp: mm.pp };
          })
        };
      }),
      items: (function () {
        var bag = (G.Save && G.Save.data && G.Save.data.bag) || {};
        var o = {};
        ["potion", "super-potion", "hyper-potion", "max-potion"].forEach(function (id) { o[id] = bag[id] || 0; });
        return o;
      })(),
      canSwitch: this.party().some(function (m, i) { return m.hp > 0 && i !== this.meIdx; }, this)
    };
    try {
      if (G.AI) return G.AI.overclockDecide(bs);
    } catch (e) {}
    return { action: "move", i: 0 };
  };

  /* ----- end ----- */
  BattleScene.prototype.endBattle = function (won, fled, extra) {
    if (this.dead) return;
    this.dead = true;
    // sync player mons
    if (this.meActive) this.syncInst(this.meActive);
    // AI learns
    try {
      if (G.AI) G.AI.notePlayerBattle(this.leadTypes, Object.keys(this.moveCatsUsed), won && !fled);
    } catch (e) {}
    var post = null;
    try {
      if (G.AI) post = G.AI.nexusPostBattle({ won: won && !fled, turns: this.turnCount, foeName: this.trainer ? this.trainer.name : "wild" });
    } catch (e) {}
    var self = this, cb = this.onEnd;
    var res = Object.assign({ won: won, fled: !!fled, caught: [] }, extra || {});
    G.Engine.popScene();
    if (post && (won || this.turnCount > 3)) {
      // show NEXUS line via toast so flow isn't blocked
      try { G.Engine.toast(post, 3500); } catch (e) {}
    }
    if (cb) { try { cb(res); } catch (e) {} }
  };

  /* ================= drawing ================= */
  BattleScene.prototype.draw = function (c) {
    var E = G.Engine, W = E.W, H = E.H;
    // background: gradient sky + ground
    var grd = c.createLinearGradient(0, 0, 0, H);
    var boss = this.kind === "boss";
    if (boss) { grd.addColorStop(0, "#1a0a2a"); grd.addColorStop(0.6, "#2a1040"); grd.addColorStop(0.6, "#0a0a12"); grd.addColorStop(1, "#14141c"); }
    else { grd.addColorStop(0, "#78a8e8"); grd.addColorStop(0.62, "#a8d8f0"); grd.addColorStop(0.62, "#58a838"); grd.addColorStop(1, "#3f8a28"); }
    c.fillStyle = grd; c.fillRect(0, 0, W, H);
    // platforms
    c.fillStyle = boss ? "rgba(120,40,160,0.35)" : "rgba(255,255,255,0.25)";
    c.beginPath(); c.ellipse(360, 150, 78, 18, 0, 0, Math.PI * 2); c.fill();
    c.beginPath(); c.ellipse(110, 235, 88, 20, 0, 0, Math.PI * 2); c.fill();

    var a = this.anims;
    // foe sprite
    if (this.foeActive && !this.foeActive.fainted) {
      var fimg = null;
      try { fimg = G.Sprites.inst(this.foeActive.inst, { size: 112 }); } catch (e) {}
      var fx = 304 + a.foeX, fy = 46;
      if (this.anims.shakeN > 0) fx += Math.sin(Date.now() / 60) * 3 * this.anims.shakeN;
      if (a.foeFlash > 0 && Math.floor(Date.now() / 60) % 2 === 0) {
        c.save(); c.globalAlpha = 0.6; c.fillStyle = "#fff"; c.fillRect(fx, fy, 112, 112); c.restore();
      } else {
        E.drawSprite(c, fimg, fx, fy, 112, 112);
      }
      this.drawFoeBox(c);
    }
    // trainer intro portrait
    if (this.phase === "trainerintro" && this.trainerImg) {
      c.fillStyle = "rgba(0,0,0,0.45)"; c.fillRect(0, 0, W, H);
      E.drawSprite(c, this.trainerImg, W / 2 - 72, 60, 144, 144);
      E.text(c, this.trainer ? this.trainer.name : "", W / 2, 220, { align: "center", color: "#fff", size: 12, bold: true });
    }
    // player sprite (back)
    if (this.meActive && !this.meActive.fainted) {
      var mimg = null;
      try { mimg = G.Sprites.inst(this.meActive.inst, { size: 128, back: true }); } catch (e) {}
      var mx = 46 + a.meX, my = 130;
      if (a.meFlash > 0 && Math.floor(Date.now() / 60) % 2 === 0) {
        c.save(); c.globalAlpha = 0.6; c.fillStyle = "#fff"; c.fillRect(mx, my, 128, 128); c.restore();
      } else {
        E.drawSprite(c, mimg, mx, my, 128, 128);
      }
      this.drawMeBox(c);
    }
    // evolution overlay
    if (this.evoAnim) {
      c.fillStyle = "rgba(255,255,255," + (0.4 + 0.4 * Math.abs(Math.sin(this.evoAnim.t * 8))) + ")";
      c.fillRect(0, 0, W, H);
      var eimg = null;
      try {
        var eid = Math.sin(this.evoAnim.t * 8) > 0 ? this.evoAnim.from : this.evoAnim.to;
        eimg = G.Sprites.mon(eid, { size: 160 });
      } catch (e) {}
      E.drawSprite(c, eimg, W / 2 - 80, 70, 160, 160);
    }
    // particles
    for (var i = 0; i < this.particles.length; i++) {
      var p = this.particles[i];
      c.fillStyle = p.color;
      c.globalAlpha = U.clamp(p.life * 2, 0, 1);
      c.fillRect(p.x, p.y, p.size, p.size);
      c.globalAlpha = 1;
    }
    // message box
    if (this.phase === "msg" && this.msg) {
      E.drawPanel(c, 8, 232, W - 16, 80);
      var shown = this.msg.text.slice(0, Math.floor(this.msg.shown));
      var lines = E.wrap(c, shown, W - 40, 9);
      lines.slice(0, 4).forEach(function (ln, li) { E.text(c, ln, 20, 242 + li * 14, { size: 9 }); });
    }
    // menus
    if (this.phase === "menu" && this.menu) this.drawMenu(c);
  };

  BattleScene.prototype.drawFoeBox = function (c) {
    var E = G.Engine, b = this.foeActive, a = this.anims;
    E.drawPanel(c, 16, 12, 210, 56);
    E.text(c, battlerName(b), 26, 18, { bold: true, size: 9 });
    E.text(c, "Lv" + b.lvl, 190, 18, { size: 9, align: "right" });
    E.hpBar(c, 26, 36, 150, a.foeHpShown / b.maxhp);
    if (this.kind === "boss") E.text(c, "BOSS", 182, 36, { size: 8, bold: true, color: "#c02020" });
  };

  BattleScene.prototype.drawMeBox = function (c) {
    var E = G.Engine, b = this.meActive, a = this.anims;
    E.drawPanel(c, 254, 196, 218, 66);
    E.text(c, battlerName(b), 264, 202, { bold: true, size: 9 });
    E.text(c, "Lv" + b.lvl, 452, 202, { size: 9, align: "right" });
    E.hpBar(c, 264, 218, 150, a.meHpShown / b.maxhp);
    E.text(c, Math.max(0, Math.ceil(a.meHpShown)) + "/" + b.maxhp, 420, 218, { size: 8 });
    if (b.status && STATUS_LABEL[b.status]) {
      c.fillStyle = "#c08020";
      c.fillRect(264, 230, 34, 12);
      E.text(c, STATUS_LABEL[b.status], 281, 231, { size: 7, bold: true, color: "#fff", align: "center", shadow: false });
    }
    // xp bar
    var m = b.inst;
    var cur = (m.xp || 0) - xpForLevel(m.lvl), need = Math.max(1, xpForLevel(m.lvl + 1) - xpForLevel(m.lvl));
    c.fillStyle = "#202028"; c.fillRect(264, 246, 150, 4);
    c.fillStyle = "#38a8f0"; c.fillRect(264, 246, 150 * U.clamp(cur / need, 0, 1), 4);
  };

  BattleScene.prototype.drawMenu = function (c) {
    var E = G.Engine, m = this.menu, o = m.opts;
    if (o.kind === "command") {
      E.drawPanel(c, 322, 188, 150, 96);
      var labels = m.items.map(function (it) { return it.label; });
      for (var i = 0; i < m.items.length; i++) {
        var x = 330 + (i % 2) * 72, y = 196 + Math.floor(i / 2) * 30;
        if (i === m.cursor) E.text(c, "▶", x - 10, y + 4, { color: "#c02020", size: 9, bold: true });
        E.text(c, m.items[i].label, x, y + 4, { size: 9, bold: i === m.cursor, color: m.items[i].disabled ? "#909090" : "#202028" });
      }
      void labels;
    } else if (o.kind === "moves") {
      E.drawPanel(c, 8, 224, W() - 16, 88);
      for (var k = 0; k < m.items.length; k++) {
        var it = m.items[k];
        var cx = 8 + (k % 2) * 236, cy = 232 + Math.floor(k / 2) * 40;
        if (k === m.cursor) { c.fillStyle = "#ffe9a8"; c.fillRect(cx + 2, cy + 2, 228, 32); }
        var tc = it.type ? E.typeColor(it.type) : "#888";
        c.fillStyle = tc; c.fillRect(cx + 6, cy + 6, 8, 24);
        E.text(c, it.label, cx + 22, cy + 5, { size: 9, bold: k === m.cursor, color: it.disabled ? "#909090" : "#202028" });
        if (it.desc) E.text(c, it.desc, cx + 22, cy + 19, { size: 7, color: "#606060" });
      }
    } else {
      // generic list (party/bag)
      var title = o.title || "Choose";
      E.drawPanel(c, 40, 40, 400, 240);
      E.text(c, title, 60, 50, { bold: true, size: 10 });
      var start = Math.max(0, Math.min(m.cursor - 4, m.items.length - 9));
      for (var j = 0; j < Math.min(9, m.items.length); j++) {
        var gi = start + j, git = m.items[gi];
        var gy = 74 + j * 20;
        if (gi === m.cursor) E.text(c, "▶", 52, gy, { color: "#c02020", size: 9, bold: true });
        E.text(c, git.label, 70, gy, { size: 9, bold: gi === m.cursor, color: git.disabled ? "#909090" : "#202028" });
        if (git.desc) E.text(c, git.desc, 300, gy, { size: 8, color: "#606060" });
      }
    }
    function W() { return G.Engine.W; }
  };

  /* ================= public API ================= */
  // Resolve a trainer id from any registry (G.Maps.TRAINERS, G.Story.trainers, G.Data.TRAINERS)
  // into battle-ready {foes, trainer, intro, outro, kind}. Handles echoStage via G.AI.echoParty.
  function resolveTrainer(id) {
    var reg = null;
    try {
      if (G.Maps && G.Maps.TRAINERS && G.Maps.TRAINERS[id]) reg = G.Maps.TRAINERS[id];
      else if (G.Story && G.Story.trainers && G.Story.trainers[id]) reg = G.Story.trainers[id];
      else if (G.Data && G.Data.TRAINERS && G.Data.TRAINERS[id]) reg = G.Data.TRAINERS[id];
    } catch (e) {}
    if (!reg) return null;
    var team = reg.party || reg.team || [];
    if ((!team || !team.length) && reg.echoStage) {
      try { if (G.AI && G.AI.echoParty) team = G.AI.echoParty(reg.echoStage); } catch (e) { team = []; }
    }
    var foes = [];
    try {
      foes = (team || []).map(function (m) { return G.Party.makeMon(m.sp, m.lvl); }).filter(Boolean);
    } catch (e) {}
    if (!foes.length) return null;
    function lines(arr) {
      return (arr || []).map(function (t) {
        return typeof t === "string" ? { name: reg.name || "Trainer", text: t } : t;
      });
    }
    return {
      id: id,
      foes: foes,
      trainer: { name: reg.name || "Trainer", sprite: reg.sprite || "grunt", ai: reg.ai || "basic", reward: reg.reward || 200 },
      intro: lines(reg.intro && reg.intro.length ? reg.intro : [(reg.taunt || "Let's battle!")]),
      outro: lines(reg.outro && reg.outro.length ? reg.outro : ["Not bad... not bad at all."]),
      kind: reg.boss ? "boss" : "trainer",
      catchable: !!reg.catchable
    };
  }

  function start(opts) {
    opts = opts || {};
    var foe = opts.foe;
    var foes = Array.isArray(foe) ? foe : [foe];
    if (!foes.length || !foes[0]) return;
    // AI-Sync difficulty on foe levels (trainer teams defined in data; wild already synced)
    try {
      if (G.AI && opts.kind !== "wild") {
        var p = (G.Save && G.Save.data && G.Save.data.party) || [];
        var avg = p.length ? Math.round(p.reduce(function (a, m) { return a + (m.lvl || 5); }, 0) / p.length) : 5;
        foes.forEach(function (f) { f.lvl = G.AI.syncAdjust(f.lvl || 5, avg); });
      }
    } catch (e) {}
    var scene = new BattleScene(opts);
    try { G.Engine.pushScene(scene); } catch (e) {}
    return scene;
  }

  G.Battle = {
    start: start, resolveTrainer: resolveTrainer,
    typeEff: typeEff, dmgCalc: dmgCalc, statsFor: statsFor,
    xpForLevel: xpForLevel, levelForXp: levelForXp,
    catchCheck: catchCheck, baseExp: baseExp, statTotal: statTotal,
    _spOf: spOf, _mvOf: mvOf, _BattleScene: BattleScene
  };
})();
