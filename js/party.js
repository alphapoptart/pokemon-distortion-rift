/* G.Party — monster instances, party/box/PC, bag, shop, fusion lab, summaries.
   Instance: {uid,sp,lvl,xp,ivs,shiny,nick,moves:[{id,pp,maxpp}],hp,maxhp,status,fusion} */
window.G = window.G || {};
(function () {
  "use strict";
  var U = G.Util;

  var uidC = 1;

  function SPECIES() { return (G.Data && G.Data.SPECIES) || {}; }
  function spOf(id) {
    return SPECIES()[id] || (G.Sprites ? G.Sprites.missingNo() : { id: id, name: U.titleCase(id), types: ["Normal"], base: { hp: 50, atk: 50, def: 50, spa: 50, spd: 50, spe: 50 }, catchRate: 45, levelMoves: [] });
  }
  function mvOf(id) {
    var M = (G.Data && G.Data.MOVES) || {};
    return M[id] || { id: id, name: U.titleCase(id), type: "Normal", cat: "phys", pow: 40, acc: 100, pp: 20, eff: {}, desc: "" };
  }
  function itemOf(id) {
    var I = (G.Data && G.Data.ITEMS) || {};
    return I[id] || { id: id, name: U.titleCase(id), desc: "", price: 100, kind: "heal" };
  }
  function saveData() { return (G.Save && G.Save.data) || null; }
  function bag() { var d = saveData(); return (d && d.bag) || {}; }

  function statsFor(spId, lvl, ivs) {
    try {
      if (G.Battle && G.Battle.statsFor) return G.Battle.statsFor(spId, lvl, ivs);
    } catch (e) {}
    // inline fallback
    var sp = spOf(spId), b = sp.base || {}, iv = ivs || {};
    function st(x, v) { return Math.floor(Math.floor((2 * (x || 50) + (v || 0)) * lvl / 100) + 5); }
    return {
      hp: Math.floor((2 * (b.hp || 50) + (iv.hp || 0)) * lvl / 100) + lvl + 10,
      atk: st(b.atk, iv.atk), def: st(b.def, iv.def),
      spa: st(b.spa, iv.spa), spd: st(b.spd, iv.spd), spe: st(b.spe, iv.spe)
    };
  }
  function xpForLevel(n) {
    try { if (G.Battle && G.Battle.xpForLevel) return G.Battle.xpForLevel(n); } catch (e) {}
    return Math.max(1, n) * Math.max(1, n) * Math.max(1, n);
  }

  /* ================= instance factory ================= */
  function makeMon(spId, lvl, opts) {
    opts = opts || {};
    var sp = spOf(spId);
    if (!sp || sp.id === "missingno") {
      var real = SPECIES()[spId];
      if (!real) return null;
    }
    lvl = U.clamp(Math.round(lvl) || 5, 1, 100);
    var ivs = {
      hp: U.randi(0, 31), atk: U.randi(0, 31), def: U.randi(0, 31),
      spa: U.randi(0, 31), spd: U.randi(0, 31), spe: U.randi(0, 31)
    };
    var shinyOdds = 1 / 512;
    try { if (G.AI && G.AI.shinyBonus) shinyOdds *= G.AI.shinyBonus(); } catch (e) {}
    var shiny = opts.shiny !== undefined ? !!opts.shiny : (U.rand(0, 1) < shinyOdds);
    var stats = statsFor(spId, lvl, ivs);
    var learns = (sp.levelMoves || []).filter(function (lm) { return lm[0] <= lvl; }).slice(-4);
    var moves = learns.map(function (lm) {
      var md = mvOf(lm[1]);
      return { id: lm[1], pp: md.pp || 10, maxpp: md.pp || 10 };
    });
    if (!moves.length) moves = [{ id: "tackle", pp: 35, maxpp: 35 }];
    var inst = {
      uid: "m" + (uidC++) + "_" + Date.now().toString(36),
      sp: spId, lvl: lvl, xp: opts.xp != null ? opts.xp : xpForLevel(lvl),
      ivs: ivs, shiny: shiny, nick: opts.nick || null,
      moves: moves, hp: stats.hp, maxhp: stats.hp,
      status: null, statusTurns: 0,
      fusion: opts.fusion || null
    };
    return inst;
  }

  function recalc(inst) {
    if (!inst) return;
    var stats = statsFor(inst.sp, inst.lvl, inst.ivs);
    var ratio = inst.maxhp ? inst.hp / inst.maxhp : 1;
    inst.maxhp = stats.hp;
    inst.hp = inst.hp > 0 ? Math.max(1, Math.round(stats.hp * ratio)) : 0;
    inst._stats = stats;
  }
  function statsOf(inst) {
    if (!inst._stats) inst._stats = statsFor(inst.sp, inst.lvl, inst.ivs);
    return inst._stats;
  }
  function monName(inst) {
    if (!inst) return "???";
    return inst.nick || spOf(inst.sp).name || U.titleCase(inst.sp);
  }

  function partyArr() { var d = saveData(); return (d && d.party) || []; }
  function boxArr() { var d = saveData(); return (d && d.box) || []; }

  function healAll() {
    partyArr().forEach(function (m) {
      if (!m) return;
      recalc(m);
      m.hp = m.maxhp;
      m.status = null; m.statusTurns = 0;
      m.moves.forEach(function (mm) { mm.pp = mm.maxpp; });
    });
  }

  function addToPartyOrBox(inst) {
    var d = saveData();
    if (!d) return "box";
    d.party = d.party || []; d.box = d.box || [];
    recalc(inst);
    if (d.party.length < 6) { d.party.push(inst); return "party"; }
    if (d.box.length < 90) { d.box.push(inst); return "box"; }
    d.party.push(inst); // shouldn't happen; keep it safe
    return "party";
  }

  /* ================= party menu (field) ================= */
  function PartyScene(mode, cb) {
    // mode: "menu" (field actions) | "deposit" | "withdraw" handled by PC scene
    this.mode = mode || "menu";
    this.cb = cb;
    this.cursor = 0;
    this.sub = null; // submenu open
  }
  PartyScene.prototype.list = function () { return partyArr(); };
  PartyScene.prototype.update = function () {
    var E = G.Engine, p = this.list();
    if (E.pressed("b")) { this.close(-1); return; }
    if (E.pressed("up")) { this.cursor = (this.cursor - 1 + p.length) % Math.max(1, p.length); sfxSel(); }
    else if (E.pressed("down")) { this.cursor = (this.cursor + 1) % Math.max(1, p.length); sfxSel(); }
    else if (E.pressed("a")) { this.pick(this.cursor); }
    var t = E.consumeTap();
    if (t) {
      for (var i = 0; i < p.length; i++) {
        var y = 56 + i * 40;
        if (t.y >= y && t.y <= y + 40 && t.x >= 8 && t.x <= 472) { this.pick(i); return; }
      }
    }
  };
  function sfxSel() { try { if (G.Audio) G.Audio.sfx("select"); } catch (e) {} }
  PartyScene.prototype.pick = function (i) {
    var p = this.list();
    if (!p[i]) return;
    sfxSel();
    var self = this;
    G.Engine.menuList(
      ["Summary", "Switch", "Nickname", "Release", "Cancel"],
      { title: monName(p[i]), x: 300, y: 40, w: 170 },
      function (c) {
        if (c === 0) self.showSummary(p[i]);
        else if (c === 1) self.pickSwitch(i);
        else if (c === 2) self.nickname(p[i]);
        else if (c === 3) self.release(i);
      }
    );
  };
  PartyScene.prototype.pickSwitch = function (i) {
    var p = this.list(), self = this;
    var items = p.map(function (m, k) { return { label: (k + 1) + ". " + monName(m), disabled: k === i }; });
    items.push({ label: "Cancel" });
    G.Engine.menuList(items, { title: "Switch with...", x: 120, y: 40, w: 240 }, function (c) {
      if (c >= 0 && c < p.length && c !== i) {
        var t = p[i]; p[i] = p[c]; p[c] = t;
        sfxSel();
      }
    });
  };
  PartyScene.prototype.nickname = function (m) {
    var self = this;
    G.Engine.namingScreen(m.nick || spOf(m.sp).name, 10, function (nm) {
      m.nick = nm;
      sfxSel();
    });
  };
  PartyScene.prototype.release = function (i) {
    var p = this.list();
    if (p.length <= 1) { G.Engine.toast("Can't release your last Pokémon!"); return; }
    var m = p[i];
    G.Engine.yesNo("Release " + monName(m) + "?", function (yes) {
      if (yes) { p.splice(i, 1); G.Engine.toast("Bye-bye, " + monName(m) + "!"); }
    });
  };
  PartyScene.prototype.showSummary = function (m) {
    G.Engine.pushScene(new SummaryScene(m));
  };
  PartyScene.prototype.close = function (v) {
    G.Engine.popScene();
    if (this.cb) { try { this.cb(v); } catch (e) {} }
  };
  PartyScene.prototype.draw = function (c) {
    var E = G.Engine;
    c.fillStyle = "#181822"; c.fillRect(0, 0, E.W, E.H);
    E.text(c, "PARTY", 16, 12, { size: 12, bold: true, color: "#fff" });
    var p = this.list();
    for (var i = 0; i < p.length; i++) {
      var m = p[i], y = 56 + i * 40;
      if (i === this.cursor) { c.fillStyle = "#2a3a5a"; c.fillRect(8, y, 464, 38); }
      E.drawPanel(c, 8, y, 464, 38);
      var img = null;
      try { img = G.Sprites.inst(m, { size: 40 }); } catch (e) {}
      E.drawSprite(c, img, 14, y - 2, 40, 40);
      var sp = spOf(m.sp);
      E.text(c, monName(m) + (m.shiny ? " ★" : ""), 62, y + 5, { bold: true, size: 10, color: m.shiny ? "#c08020" : "#202028" });
      E.text(c, "Lv" + m.lvl, 62, y + 20, { size: 8 });
      (sp.types || []).forEach(function (t, ti) {
        c.fillStyle = E.typeColor(t);
        c.fillRect(150 + ti * 66, y + 18, 60, 14);
        E.text(c, t.toUpperCase(), 180 + ti * 66, y + 20, { size: 7, bold: true, color: "#fff", align: "center", shadow: false });
      });
      E.hpBar(c, 300, y + 12, 120, m.hp / Math.max(1, m.maxhp));
      E.text(c, m.hp + "/" + m.maxhp, 426, y + 12, { size: 8 });
    }
    E.text(c, "A: select   B: back", 16, E.H - 22, { size: 8, color: "#888" });
  };

  function SummaryScene(m) { this.m = m; }
  SummaryScene.prototype.update = function () {
    var E = G.Engine;
    if (E.pressed("a") || E.pressed("b")) { sfxSel(); E.popScene(); return; }
    E.consumeTap();
  };
  SummaryScene.prototype.draw = function (c) {
    var E = G.Engine, m = this.m, sp = spOf(m.sp);
    c.fillStyle = "#181822"; c.fillRect(0, 0, E.W, E.H);
    E.drawPanel(c, 8, 8, 464, 304);
    var img = null;
    try { img = G.Sprites.inst(m, { size: 120, shiny: m.shiny }); } catch (e) {}
    E.drawSprite(c, img, 24, 24, 120, 120);
    if (m.shiny) E.text(c, "★ SHINY ★", 84, 148, { align: "center", size: 9, bold: true, color: "#c08020" });
    E.text(c, monName(m), 170, 20, { size: 14, bold: true });
    E.text(c, "Lv " + m.lvl + "   XP " + (m.xp || 0), 170, 42, { size: 9 });
    (sp.types || []).forEach(function (t, ti) {
      c.fillStyle = E.typeColor(t);
      c.fillRect(170 + ti * 80, 60, 72, 18);
      E.text(c, t.toUpperCase(), 206 + ti * 80, 64, { size: 8, bold: true, color: "#fff", align: "center", shadow: false });
    });
    var st = statsOf(m);
    var labels = [["HP", m.hp + "/" + m.maxhp], ["ATK", st.atk], ["DEF", st.def], ["SPA", st.spa], ["SPD", st.spd], ["SPE", st.spe]];
    labels.forEach(function (L, i) {
      E.text(c, L[0] + ": " + L[1], 170, 92 + i * 15, { size: 9 });
    });
    E.text(c, "MOVES", 24, 190, { size: 10, bold: true });
    (m.moves || []).forEach(function (mm, i) {
      var md = mvOf(mm.id);
      c.fillStyle = E.typeColor(md.type);
      c.fillRect(24, 208 + i * 22, 200, 18);
      E.text(c, md.name, 30, 211 + i * 22, { size: 8, bold: true, color: "#fff", shadow: false });
      E.text(c, "PP " + mm.pp + "/" + mm.maxpp, 230, 211 + i * 22, { size: 8 });
    });
    var fl = sp.flavor || "";
    E.wrap(c, fl, 430, 8).slice(0, 2).forEach(function (ln, i) {
      E.text(c, ln, 24, 208 + 4 * 22 + i * 12, { size: 8, color: "#404048" });
    });
    E.text(c, "A/B: back", 16, E.H - 24, { size: 8, color: "#888" });
  };

  function openPartyMenu(cb) { G.Engine.pushScene(new PartyScene("menu", cb)); }

  /* ================= bag ================= */
  function BagScene() { this.cursor = 0; this.tab = 0; }
  var BAG_TABS = [["ball", "BALLS"], ["heal", "HEAL"], ["evo", "STONES"], ["key", "KEY"], ["battle", "BATTLE"]];
  BagScene.prototype.items = function () {
    var b = bag(), tab = BAG_TABS[this.tab][0];
    var out = [];
    Object.keys(b).forEach(function (id) {
      if (!(b[id] > 0)) return;
      var it = itemOf(id);
      if (it.kind === tab) out.push({ id: id, it: it, n: b[id] });
    });
    return out;
  };
  BagScene.prototype.update = function () {
    var E = G.Engine;
    var items = this.items();
    if (E.pressed("b")) { sfxSel(); E.popScene(); return; }
    if (E.pressed("left")) { this.tab = (this.tab - 1 + BAG_TABS.length) % BAG_TABS.length; this.cursor = 0; sfxSel(); }
    else if (E.pressed("right")) { this.tab = (this.tab + 1) % BAG_TABS.length; this.cursor = 0; sfxSel(); }
    else if (items.length && E.pressed("up")) { this.cursor = (this.cursor - 1 + items.length) % items.length; sfxSel(); }
    else if (items.length && E.pressed("down")) { this.cursor = (this.cursor + 1) % items.length; sfxSel(); }
    else if (items.length && E.pressed("a")) { this.use(items[this.cursor]); }
    var t = E.consumeTap();
    if (t) {
      // tab bar taps
      for (var ti = 0; ti < BAG_TABS.length; ti++) {
        if (t.x >= 8 + ti * 92 && t.x <= 8 + ti * 92 + 88 && t.y >= 34 && t.y <= 56) {
          this.tab = ti; this.cursor = 0; sfxSel(); return;
        }
      }
      for (var i = 0; i < items.length; i++) {
        var y = 66 + i * 24;
        if (t.y >= y && t.y <= y + 24 && t.x >= 8 && t.x <= 472) { this.use(items[i]); return; }
      }
    }
  };
  BagScene.prototype.use = function (entry) {
    var self = this, it = entry.it;
    if (it.kind === "ball") { G.Engine.toast("Use balls in battle!"); return; }
    if (it.kind === "key") { G.Engine.textBox(it.name + ": " + (it.desc || "A precious item.")); return; }
    if (it.kind === "evo") { this.useStone(entry); return; }
    // heal items: pick target
    var p = partyArr();
    var items = p.map(function (m, i) {
      return { label: monName(m) + "  " + m.hp + "/" + m.maxhp, disabled: m.hp <= 0 && entry.id !== "revive" && entry.id !== "max-revive", idx: i };
    });
    items.push({ label: "Cancel" });
    G.Engine.menuList(items, { title: "Use " + it.name + " on?", x: 90, y: 30, w: 300 }, function (c) {
      if (c < 0 || c >= p.length) return;
      self.applyHeal(entry, p[c]);
    });
  };
  BagScene.prototype.applyHeal = function (entry, m) {
    var id = entry.id, b = bag();
    if (!(b[id] > 0)) return;
    var healAmt = itemOf(id).heal || 0;
    if (id === "max-potion" || id === "full-restore") healAmt = 99999;
    if (id === "revive") { if (m.hp > 0) { G.Engine.toast("It's already conscious!"); return; } m.hp = Math.floor(m.maxhp / 2); }
    else if (id === "max-revive") { if (m.hp > 0) { G.Engine.toast("It's already conscious!"); return; } m.hp = m.maxhp; }
    else {
      if (m.hp <= 0) { G.Engine.toast("Can't use that on a fainted Pokémon!"); return; }
      m.hp = Math.min(m.maxhp, m.hp + (healAmt || 20));
    }
    var cure = itemOf(id).cure;
    if (cure || id === "full-heal" || id === "full-restore") { m.status = null; m.statusTurns = 0; }
    b[id]--;
    try { if (G.Audio) G.Audio.sfx("heal"); } catch (e) {}
    G.Engine.toast(itemOf(id).name + " used on " + monName(m) + "!");
  };
  BagScene.prototype.useStone = function (entry) {
    var p = partyArr(), id = entry.id, b = bag();
    var cands = [];
    p.forEach(function (m, i) {
      var sp = spOf(m.sp);
      var ev = (sp.evo || []).filter(function (e) { return e.by === "stone" && e.item === id; });
      if (ev.length) cands.push({ m: m, to: ev[0].to, idx: i });
    });
    if (!cands.length) { G.Engine.toast("No Pokémon can use that here."); return; }
    var items = cands.map(function (cc) { return { label: monName(cc.m) + " → " + spOf(cc.to).name }; });
    items.push({ label: "Cancel" });
    G.Engine.menuList(items, { title: "Use " + itemOf(id).name + "?", x: 90, y: 30, w: 300 }, function (c) {
      if (c < 0 || c >= cands.length) return;
      b[id]--;
      evolveWithScene(cands[c].m, cands[c].to, function () {});
    });
  };
  BagScene.prototype.draw = function (c) {
    var E = G.Engine;
    c.fillStyle = "#181822"; c.fillRect(0, 0, E.W, E.H);
    E.text(c, "BAG", 16, 8, { size: 12, bold: true, color: "#fff" });
    for (var ti = 0; ti < BAG_TABS.length; ti++) {
      var x = 8 + ti * 92;
      if (ti === this.tab) { c.fillStyle = "#c02020"; c.fillRect(x, 34, 88, 22); }
      c.fillStyle = ti === this.tab ? "#fff" : "#888";
      c.font = "bold 8px 'Courier New',monospace"; c.textAlign = "center"; c.textBaseline = "top";
      c.fillText(BAG_TABS[ti][1], x + 44, 40);
    }
    var items = this.items();
    if (!items.length) E.text(c, "(empty)", 24, 80, { size: 9, color: "#888" });
    for (var i = 0; i < items.length; i++) {
      var y = 66 + i * 24;
      if (i === this.cursor) { c.fillStyle = "#2a3a5a"; c.fillRect(8, y, 464, 22); }
      E.text(c, items[i].it.name + " x" + items[i].n, 20, y + 5, { size: 9, bold: i === this.cursor, color: "#fff", shadow: false });
      E.text(c, items[i].it.desc || "", 240, y + 5, { size: 7, color: "#888", shadow: false });
    }
    E.text(c, "◀ ▶ tabs   A: use   B: back", 16, E.H - 22, { size: 8, color: "#888" });
  };
  function openBag() { G.Engine.pushScene(new BagScene()); }

  /* ================= PC ================= */
  function PCScene() { this.cursor = 0; this.mode = "menu"; }
  PCScene.prototype.update = function () {
    var E = G.Engine;
    if (this.mode === "menu") {
      if (E.pressed("b")) { sfxSel(); E.popScene(); return; }
      if (E.pressed("up") || E.pressed("down")) { this.cursor = this.cursor ? 0 : 1; sfxSel(); }
      else if (E.pressed("a")) {
        sfxSel();
        this.mode = this.cursor === 0 ? "deposit" : "withdraw";
        this.cursor = 0;
      }
      var t = E.consumeTap();
      if (t) {
        if (t.y >= 90 && t.y <= 130) { this.mode = "deposit"; this.cursor = 0; }
        else if (t.y >= 140 && t.y <= 180) { this.mode = "withdraw"; this.cursor = 0; }
      }
      return;
    }
    var list = this.mode === "deposit" ? partyArr() : boxArr();
    if (E.pressed("b")) { this.mode = "menu"; return; }
    if (list.length && E.pressed("up")) { this.cursor = (this.cursor - 1 + list.length) % list.length; sfxSel(); }
    else if (list.length && E.pressed("down")) { this.cursor = (this.cursor + 1) % list.length; sfxSel(); }
    else if (list.length && E.pressed("a")) { this.transfer(list[this.cursor]); }
    var t2 = E.consumeTap();
    if (t2) {
      for (var i = 0; i < list.length; i++) {
        var y = 60 + i * 26;
        if (t2.y >= y && t2.y <= y + 26) { this.transfer(list[i]); return; }
      }
    }
  };
  PCScene.prototype.transfer = function (m) {
    var d = saveData();
    if (!d) return;
    if (this.mode === "deposit") {
      if (d.party.length <= 1) { G.Engine.toast("Can't deposit your last Pokémon!"); return; }
      d.party.splice(d.party.indexOf(m), 1);
      d.box.push(m);
      G.Engine.toast(monName(m) + " deposited!");
    } else {
      if (d.party.length >= 6) { G.Engine.toast("Party is full!"); return; }
      d.box.splice(d.box.indexOf(m), 1);
      d.party.push(m);
      G.Engine.toast(monName(m) + " withdrew!");
    }
    sfxSel();
    this.cursor = 0;
  };
  PCScene.prototype.draw = function (c) {
    var E = G.Engine;
    c.fillStyle = "#181822"; c.fillRect(0, 0, E.W, E.H);
    E.text(c, "POKéMON STORAGE", 16, 12, { size: 12, bold: true, color: "#fff" });
    if (this.mode === "menu") {
      var opts = ["Deposit Pokémon", "Withdraw Pokémon"];
      for (var i = 0; i < 2; i++) {
        var y = 90 + i * 50;
        if (i === this.cursor) { c.fillStyle = "#2a3a5a"; c.fillRect(60, y, 360, 40); }
        E.drawPanel(c, 60, y, 360, 40);
        E.text(c, opts[i], 240, y + 12, { align: "center", size: 10, bold: i === this.cursor });
      }
      E.text(c, "A: select   B: back", 16, E.H - 22, { size: 8, color: "#888" });
      return;
    }
    var list = this.mode === "deposit" ? partyArr() : boxArr();
    E.text(c, this.mode === "deposit" ? "PARTY → BOX" : "BOX → PARTY", 16, 36, { size: 10, bold: true, color: "#ffe95a" });
    for (var k = 0; k < list.length; k++) {
      var m = list[k], y2 = 60 + k * 26;
      if (k === this.cursor) { c.fillStyle = "#2a3a5a"; c.fillRect(16, y2, 448, 24); }
      E.text(c, monName(m) + "  Lv" + m.lvl + "  " + m.hp + "/" + m.maxhp, 28, y2 + 6, { size: 9, color: "#fff", shadow: false });
    }
    if (!list.length) E.text(c, "(empty)", 28, 70, { size: 9, color: "#888" });
    E.text(c, "A: transfer   B: back", 16, E.H - 22, { size: 8, color: "#888" });
  };
  function openPC() { G.Engine.pushScene(new PCScene()); }

  /* ================= shop ================= */
  var SHOP_STOCK = [
    "poke-ball", "great-ball", "ultra-ball",
    "potion", "super-potion", "hyper-potion", "max-potion", "revive", "full-heal",
    "antidote", "paralyze-heal", "awakening", "burn-heal", "ice-heal"
  ];
  function ShopScene() { this.cursor = 0; this.mode = "buy"; }
  ShopScene.prototype.money = function () { var d = saveData(); return (d && d.money) || 0; };
  ShopScene.prototype.update = function () {
    var E = G.Engine;
    if (E.pressed("b")) {
      if (this.mode === "menu") { sfxSel(); E.popScene(); return; }
      this.mode = "menu"; return;
    }
    if (this.mode === "menu") {
      if (E.pressed("up") || E.pressed("down")) { this.cursor = this.cursor ? 0 : 1; sfxSel(); }
      else if (E.pressed("a")) { sfxSel(); this.mode = this.cursor === 0 ? "buy" : "sell"; this.cursor = 0; }
      return;
    }
    var list = this.list();
    if (list.length && E.pressed("up")) { this.cursor = (this.cursor - 1 + list.length) % list.length; sfxSel(); }
    else if (list.length && E.pressed("down")) { this.cursor = (this.cursor + 1) % list.length; sfxSel(); }
    else if (list.length && E.pressed("a")) { this.transact(list[this.cursor]); }
    var t = E.consumeTap();
    if (t) {
      for (var i = 0; i < list.length; i++) {
        var y = 70 + i * 24;
        if (t.y >= y && t.y <= y + 24) { this.transact(list[i]); return; }
      }
    }
  };
  ShopScene.prototype.list = function () {
    var self = this;
    if (this.mode === "buy") {
      return SHOP_STOCK.filter(function (id) { return itemOf(id).price > 0; }).map(function (id) { return { id: id, it: itemOf(id) }; });
    }
    var b = bag(), out = [];
    Object.keys(b).forEach(function (id) {
      if (b[id] > 0 && (itemOf(id).kind === "ball" || itemOf(id).kind === "heal" || itemOf(id).kind === "battle")) {
        out.push({ id: id, it: itemOf(id), n: b[id] });
      }
    });
    return out;
  };
  ShopScene.prototype.transact = function (entry) {
    var d = saveData(); if (!d) return;
    d.money = d.money || 0; d.bag = d.bag || {};
    if (this.mode === "buy") {
      var price = entry.it.price || 100;
      if (d.money < price) { G.Engine.toast("Not enough money!"); try { if (G.Audio) G.Audio.sfx("error"); } catch (e) {} return; }
      d.money -= price;
      d.bag[entry.id] = (d.bag[entry.id] || 0) + 1;
      G.Engine.toast("Bought " + entry.it.name + "!");
    } else {
      var sell = Math.floor((entry.it.price || 100) / 2);
      d.bag[entry.id]--;
      d.money += sell;
      G.Engine.toast("Sold " + entry.it.name + " for $" + sell + "!");
    }
    sfxSel();
  };
  ShopScene.prototype.draw = function (c) {
    var E = G.Engine;
    c.fillStyle = "#181822"; c.fillRect(0, 0, E.W, E.H);
    E.text(c, "POKé MART", 16, 12, { size: 12, bold: true, color: "#fff" });
    E.text(c, "$" + this.money(), E.W - 16, 12, { align: "right", size: 12, bold: true, color: "#ffe95a" });
    if (this.mode === "menu") {
      var opts = ["Buy", "Sell"];
      for (var i = 0; i < 2; i++) {
        var y = 90 + i * 50;
        if (i === this.cursor) { c.fillStyle = "#2a3a5a"; c.fillRect(60, y, 360, 40); }
        E.drawPanel(c, 60, y, 360, 40);
        E.text(c, opts[i], 240, y + 12, { align: "center", size: 10, bold: i === this.cursor });
      }
      return;
    }
    var list = this.list();
    E.text(c, this.mode === "buy" ? "BUY" : "SELL (1/2 price)", 16, 44, { size: 10, bold: true, color: "#ffe95a" });
    for (var k = 0; k < list.length; k++) {
      var e = list[k], y2 = 70 + k * 24;
      if (k === this.cursor) { c.fillStyle = "#2a3a5a"; c.fillRect(16, y2, 448, 22); }
      var price = this.mode === "buy" ? (e.it.price || 100) : Math.floor((e.it.price || 100) / 2);
      E.text(c, e.it.name + (e.n ? " x" + e.n : ""), 28, y2 + 6, { size: 9, color: "#fff", shadow: false });
      E.text(c, "$" + price, 440, y2 + 6, { align: "right", size: 9, color: "#ffe95a", shadow: false });
    }
    E.text(c, "A: confirm   B: back", 16, E.H - 22, { size: 8, color: "#888" });
  };
  function openShop() { G.Engine.pushScene(new ShopScene()); }

  /* ================= evolution scene (field) ================= */
  function EvoScene(m, toId, cb) {
    this.m = m; this.toId = toId; this.cb = cb; this.t = 0; this.done = false;
  }
  EvoScene.prototype.update = function (dt) {
    this.t += dt;
    if (this.t > 2.4 && !this.done) {
      this.done = true;
      var m = this.m, from = spOf(m.sp), to = spOf(this.toId);
      var ratio = m.maxhp ? m.hp / m.maxhp : 1;
      m.sp = this.toId;
      recalc(m);
      m.hp = Math.max(1, Math.round(m.maxhp * ratio));
      try {
        var d = saveData();
        if (d && d.dex) { d.dex.seen[this.toId] = true; d.dex.caught[this.toId] = true; }
        if (G.Audio) G.Audio.sfx("fanfare");
      } catch (e) {}
      var self = this, cb = this.cb;
      G.Engine.popScene();
      G.Engine.dialog([
        { name: "", text: "What? " + monName(m) + " is evolving!" },
        { name: "", text: monName(m) + " evolved into " + to.name + "!" }
      ], function () { if (cb) cb(); });
    }
  };
  EvoScene.prototype.draw = function (c) {
    var E = G.Engine;
    c.fillStyle = "rgba(10,10,18,0.92)"; c.fillRect(0, 0, E.W, E.H);
    var showFrom = Math.sin(this.t * 10) > 0;
    var img = null;
    try { img = G.Sprites.mon(showFrom ? this.m.sp : this.toId, { size: 160 }); } catch (e) {}
    E.drawSprite(c, img, E.W / 2 - 80, 60, 160, 160);
    c.fillStyle = "rgba(255,255,255," + (0.25 + 0.25 * Math.abs(Math.sin(this.t * 10))) + ")";
    c.fillRect(0, 0, E.W, E.H);
    E.text(c, "What? " + monName(this.m) + " is evolving!", E.W / 2, 250, { align: "center", color: "#fff", size: 11, bold: true });
  };
  function evolveWithScene(m, toId, cb) {
    try { if (G.Audio) G.Audio.playSong("evolution"); } catch (e) {}
    G.Engine.pushScene(new EvoScene(m, toId, cb || function () {
      try {
        var mm = G.Overworld && G.Overworld.currentMap ? G.Overworld.currentMap() : null;
        if (G.Audio) G.Audio.playSong((mm && mm.music) || "town");
      } catch (e) {}
    }));
  }

  /* ================= fusion lab ================= */
  var FUSE_BLOCK_MSG = {
    anime: "Its spirit is bound to its own legend. It refuses fusion!",
    divine: "A god's essence cannot be spliced. The machine recoils!"
  };

  function fuseBlockReason(sp) {
    if (!sp) return "It cannot be fused.";
    var id = sp.id || "";
    if (id === "arceus" || id === "giratina") return FUSE_BLOCK_MSG.divine;
    if (sp.anime) return FUSE_BLOCK_MSG.anime;
    if (sp.fuseable === false) return "Its DNA is too unstable to splice!";
    return null;
  }

  function fusionName(aName, bName) {
    // Infinite Fusion convention: first half of body + second half of head
    var a = (aName || "???").replace(/[^A-Za-z]/g, "") || "X";
    var b = (bName || "???").replace(/[^A-Za-z]/g, "") || "Y";
    return a.slice(0, Math.ceil(a.length / 2)) + b.slice(Math.floor(b.length / 2));
  }

  function buildFusionSpecies(bodySp, headSp, genId) {
    var bT = (bodySp.types || ["Normal"])[0], hT = (headSp.types || ["Normal"])[0];
    var types = bT === hT ? [bT] : [bT, hT];
    var base = {};
    ["hp", "atk", "def", "spa", "spd", "spe"].forEach(function (k) {
      var bv = (bodySp.base && bodySp.base[k]) || 50, hv = (headSp.base && headSp.base[k]) || 50;
      base[k] = Math.round(((bv + hv) / 2) * 1.05);
    });
    var lm = {};
    (bodySp.levelMoves || []).concat(headSp.levelMoves || []).forEach(function (e) {
      if (!lm[e[1]] || e[0] < lm[e[1]]) lm[e[1]] = e[0];
    });
    var levelMoves = Object.keys(lm).map(function (mid) { return [lm[mid], mid]; })
      .sort(function (x, y) { return x[0] - y[0]; }).slice(0, 14);
    return {
      id: genId,
      name: fusionName(bodySp.name, headSp.name),
      dex: 10000 + (Object.keys(SPECIES()).length % 9000),
      cat: "fusion",
      types: types, base: base,
      abilities: (bodySp.abilities || []).slice(0, 1),
      catchRate: 45,
      levelMoves: levelMoves.length ? levelMoves : [[1, "tackle"]],
      evo: [],
      sprite: { shape: (bodySp.sprite && bodySp.sprite.shape) || "blob", seed: U.hashStr(genId), pal: (bodySp.sprite && bodySp.sprite.pal) || undefined, fusionOf: [bodySp.id, headSp.id] },
      flavor: "A DNA splice of " + bodySp.name + " and " + headSp.name + ". Neither nature nor lab intended this.",
      fuseable: false, anime: false
    };
  }

  function registerFusion(species) {
    try {
      if (G.Data) {
        G.Data.SPECIES = G.Data.SPECIES || {};
        G.Data.SPECIES[species.id] = species;
      }
    } catch (e) {}
  }

  function regenFusions() {
    // Re-register generated fusion species found in party/box (needed after load).
    var all = partyArr().concat(boxArr());
    all.forEach(function (m) {
      if (m && m.fusion && m.sp && m.sp.indexOf("fuse_") === 0 && !SPECIES()[m.sp]) {
        var b = spOf(m.fusion.body), h = spOf(m.fusion.head);
        registerFusion(buildFusionSpecies(b, h, m.sp));
      }
    });
  }

  function FusionScene() {
    this.step = "body"; // body -> head -> preview
    this.body = null; this.head = null;
    this.cursor = 0;
    this.listCache = null;
  }
  FusionScene.prototype.eligible = function () {
    var out = [];
    function scan(arr, where) {
      arr.forEach(function (m, i) {
        if (!m) return;
        var sp = spOf(m.sp);
        var reason = fuseBlockReason(sp);
        if (!reason) out.push({ m: m, where: where, idx: i, sp: sp });
      });
    }
    scan(partyArr(), "party"); scan(boxArr(), "box");
    return out;
  };
  FusionScene.prototype.update = function () {
    var E = G.Engine;
    if (E.pressed("b")) {
      if (this.step === "body") { sfxSel(); E.popScene(); return; }
      this.step = this.step === "head" ? "body" : "head";
      this.cursor = 0;
      return;
    }
    var list = this.eligible().filter(function (e) { return !this.body || e.m !== this.body.m; }, this);
    if (E.pressed("up") && list.length) { this.cursor = (this.cursor - 1 + list.length) % list.length; sfxSel(); }
    else if (E.pressed("down") && list.length) { this.cursor = (this.cursor + 1) % list.length; sfxSel(); }
    else if (E.pressed("a") && list.length) {
      var pick = list[this.cursor];
      sfxSel();
      if (this.step === "body") { this.body = pick; this.step = "head"; this.cursor = 0; }
      else { this.head = pick; this.step = "preview"; }
    }
    var t = E.consumeTap();
    if (t && this.step !== "preview") {
      for (var i = 0; i < list.length; i++) {
        var y = 70 + i * 26;
        if (t.y >= y && t.y <= y + 26) {
          var pk = list[i];
          if (this.step === "body") { this.body = pk; this.step = "head"; }
          else { this.head = pk; this.step = "preview"; }
          this.cursor = 0; sfxSel(); return;
        }
      }
    }
    if (this.step === "preview") this.updatePreview();
  };
  FusionScene.prototype.updatePreview = function () {
    var E = G.Engine, self = this;
    var bsp = this.body.sp, hsp = this.head.sp;
    // one-shot confirm dialog
    if (!this._asked) {
      this._asked = true;
      var tmpId = "fuse_" + bsp.id + "_" + hsp.id;
      var fspec = buildFusionSpecies(bsp, hsp, tmpId);
      this._preview = fspec;
      var warn = "Fuse " + monName(this.body.m) + " (body) + " + monName(this.head.m) + " (head) into " + fspec.name +
        " [" + fspec.types.join("/") + "]? WARNING: both Pokémon will be consumed by the splicer!";
      E.yesNo(warn, function (yes) {
        if (yes) self.doFuse();
        else { self.step = "head"; self._asked = false; self._preview = null; }
      });
    }
  };
  FusionScene.prototype.doFuse = function () {
    var E = G.Engine;
    var d = saveData();
    var bodyM = this.body.m, headM = this.head.m;
    var bsp = this.body.sp, hsp = this.head.sp;
    var genId = "fuse_" + bsp.id + "_" + hsp.id;
    var n = 2;
    while (SPECIES()[genId]) { genId = "fuse_" + bsp.id + "_" + hsp.id + "_" + (n++); }
    var fspec = buildFusionSpecies(bsp, hsp, genId);
    registerFusion(fspec);
    // remove originals
    function removeFrom(arr, m) { var i = arr.indexOf(m); if (i >= 0) arr.splice(i, 1); }
    removeFrom(this.body.where === "party" ? d.party : d.box, bodyM);
    removeFrom(this.head.where === "party" ? d.party : d.box, headM);
    var lvl = Math.max(bodyM.lvl, headM.lvl);
    var inst = makeMon(genId, lvl, { fusion: { body: bsp.id, head: hsp.id } });
    try {
      var dd = saveData();
      if (dd && dd.dex) { dd.dex.seen[genId] = true; dd.dex.caught[genId] = true; }
      if (G.Audio) G.Audio.sfx("evolve");
    } catch (e) {}
    var where = addToPartyOrBox(inst);
    var self = this;
    E.popScene();
    E.dialog([
      { name: "SPLICER", text: "Splicing DNA... stabilizing..." },
      { name: "", text: "Created " + fspec.name + "! (" + where + ")" }
    ]);
  };
  FusionScene.prototype.draw = function (c) {
    var E = G.Engine;
    c.fillStyle = "#0a1420"; c.fillRect(0, 0, E.W, E.H);
    E.text(c, "DNA SPLICER LAB", 16, 12, { size: 12, bold: true, color: "#58f0f0" });
    if (this.step === "preview" && this._preview) {
      var fs = this._preview;
      var img = null;
      try { img = G.Sprites.fuse(this.body.sp.id, this.head.sp.id, { size: 140 }); } catch (e) {}
      E.drawSprite(c, img, E.W / 2 - 70, 50, 140, 140);
      E.text(c, fs.name, E.W / 2, 200, { align: "center", size: 14, bold: true, color: "#fff" });
      E.text(c, fs.types.join(" / "), E.W / 2, 222, { align: "center", size: 10, color: "#58f0f0" });
      var b = fs.base;
      E.text(c, "HP" + b.hp + " ATK" + b.atk + " DEF" + b.def + " SPA" + b.spa + " SPD" + b.spd + " SPE" + b.spe,
        E.W / 2, 244, { align: "center", size: 8, color: "#aaa" });
      return;
    }
    E.text(c, this.step === "body" ? "Select BODY Pokémon:" : "Select HEAD Pokémon:", 16, 40, { size: 10, bold: true, color: "#ffe95a" });
    var list = this.eligible().filter(function (e) { return !this.body || e.m !== this.body.m; }, this);
    if (!list.length) E.text(c, "(no fuseable Pokémon!)", 24, 80, { size: 9, color: "#888" });
    for (var i = 0; i < Math.min(9, list.length); i++) {
      var e = list[i], y = 70 + i * 26;
      if (i === this.cursor) { c.fillStyle = "#1a3a4a"; c.fillRect(16, y, 448, 24); }
      E.text(c, monName(e.m) + "  Lv" + e.m.lvl + "  [" + e.where + "]", 28, y + 6, { size: 9, color: "#fff", shadow: false });
      E.text(c, (e.sp.types || []).join("/"), 380, y + 6, { size: 8, color: "#58f0f0", shadow: false });
    }
    E.text(c, "B: back", 16, E.H - 22, { size: 8, color: "#888" });
  };
  function openFusionLab() {
    var b = bag();
    if (!(b["dna-splicers"] > 0)) {
      G.Engine.textBox("The splicer is inert. You need the DNA SPLICERS key item to use it.");
      return;
    }
    G.Engine.pushScene(new FusionScene());
  }

  G.Party = {
    makeMon: makeMon, recalc: recalc, statsOf: statsOf, monName: monName,
    healAll: healAll, addToPartyOrBox: addToPartyOrBox,
    openPartyMenu: openPartyMenu, openBag: openBag, openPC: openPC, openShop: openShop,
    openFusionLab: openFusionLab, evolveWithScene: evolveWithScene,
    regenFusions: regenFusions, registerFusion: registerFusion,
    buildFusionSpecies: buildFusionSpecies, fusionName: fusionName,
    _spOf: spOf, _itemOf: itemOf
  };
})();
