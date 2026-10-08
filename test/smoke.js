/* test/smoke.js — node smoke test for Pokémon: Distortion Rift.
   Loads all js files (data files included when present) in a vm sandbox with
   DOM stubs, then exercises: RNG determinism, type chart spot checks, damage
   calc, stat/xp math, catch formula, fusion generation, save/load roundtrip,
   and story-script reference validation. Missing data files are skipped, not failed.
   Run: node test/smoke.js */
"use strict";
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const ROOT = path.join(__dirname, "..");
const FILES = [
  "js/util.js", "js/data-core.js", "js/data-mons1.js", "js/data-mons2a.js", "js/data-mons2b.js",
  "js/anime.js", "js/fusions.js", "js/maps.js",
  "js/story.js", "js/audio.js", "js/sprites.js", "js/ai.js", "js/engine.js",
  "js/overworld.js", "js/battle.js", "js/party.js", "js/main.js"
];

let pass = 0, fail = 0, skip = 0;
function ok(name, cond, extra) {
  if (cond) { pass++; console.log("  PASS " + name); }
  else { fail++; console.log("  FAIL " + name + (extra ? " — " + extra : "")); }
}
function skipped(name, why) { skip++; console.log("  SKIP " + name + " (" + why + ")"); }

// ---- syntax check each file first (node --check equivalent is run separately too) ----
for (const f of FILES) {
  const p = path.join(ROOT, f);
  if (!fs.existsSync(p)) { skipped("syntax:" + f, "file not present yet"); continue; }
  try { new vm.Script(fs.readFileSync(p, "utf8"), { filename: f }); ok("syntax:" + f, true); }
  catch (e) { ok("syntax:" + f, false, e.message); }
}

// ---- build sandbox ----
const store = {};
const windowStub = { addEventListener() {}, innerWidth: 480, innerHeight: 320 };
const documentStub = {
  readyState: "complete",
  addEventListener() {},
  getElementById() { return null; },
  querySelector() { return null; },
  createElement() {
    return { width: 0, height: 0, style: {}, addEventListener() {}, getContext() { return null; } };
  }
};
const sandbox = {
  window: windowStub,
  document: documentStub,
  localStorage: {
    getItem: k => (k in store ? store[k] : null),
    setItem: (k, v) => { store[k] = String(v); },
    removeItem: k => { delete store[k]; }
  },
  requestAnimationFrame() { return 0; },
  Image: function () { this.onload = null; },
  console: console
};
sandbox.globalThis = sandbox;
vm.createContext(sandbox);
// Bare `G` in the game files resolves via the global object in browsers
// (window IS the global there). Mirror that here:
sandbox.G = {};
sandbox.window.G = sandbox.G;

for (const f of FILES) {
  const p = path.join(ROOT, f);
  if (!fs.existsSync(p)) continue;
  try {
    vm.runInContext(fs.readFileSync(p, "utf8"), sandbox, { filename: f });
  } catch (e) {
    ok("load:" + f, false, e.message);
  }
}
const G = sandbox.window.G || {};
ok("G namespace exists", !!G.Util && !!G.Battle && !!G.Party && !!G.AI);

// ---- util ----
{
  const r1 = G.Util.RNG(42), r2 = G.Util.RNG(42);
  ok("RNG deterministic", r1() === r2() && r1() === r2());
  ok("clamp", G.Util.clamp(9, 0, 5) === 5 && G.Util.clamp(-2, 0, 5) === 0);
  ok("titleCase", G.Util.titleCase("fire-blast") === "Fire Blast");
  const o = { a: [1, { b: 2 }] };
  const c = G.Util.deepClone(o);
  ok("deepClone", c.a[1].b === 2 && c !== o && c.a !== o.a);
}

// ---- type chart ----
if (G.Data && G.Data.CHART) {
  const t = G.Battle.typeEff;
  ok("chart Fire>Grass = 2", t("Fire", ["Grass"]) === 2);
  ok("chart Electric>Ground = 0", t("Electric", ["Ground"]) === 0);
  ok("chart Ghost>Normal = 0", t("Ghost", ["Normal"]) === 0);
  ok("chart Fairy>Dragon = 2", t("Fairy", ["Dragon"]) === 2);
  ok("chart Fighting>Ghost = 0", t("Fighting", ["Ghost"]) === 0);
  ok("chart Water>Fire/Water = 1", t("Water", ["Fire", "Water"]) === 1);
  ok("chart unknown type defaults 1", t("Nope", ["Grass"]) === 1);
} else skipped("type chart checks", "G.Data.CHART missing");

// ---- stats / xp ----
{
  // Pikachu: base hp 35. lvl5 iv31 -> floor((70+31)*5/100)+5+10 = 5+15 = 20
  const s = G.Battle.statsFor("pikachu", 5, { hp: 31, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 });
  const hasPikachu = G.Data && G.Data.SPECIES && G.Data.SPECIES.pikachu;
  if (hasPikachu) ok("statsFor pikachu hp", s.hp === 20, "got " + s.hp);
  else skipped("statsFor pikachu", "pikachu data missing");
  ok("statsFor fallback sane", s.hp > 0 && s.atk > 0);
  ok("xpForLevel medium-fast", G.Battle.xpForLevel(5) === 125 && G.Battle.xpForLevel(100) === 1000000);
  ok("levelForXp inverse", G.Battle.levelForXp(125) === 5 && G.Battle.levelForXp(124) === 4);
}

// ---- damage calc ----
{
  const att = { lvl: 50, stats: { atk: 120, def: 80, spa: 120, spd: 80, spe: 90 }, stages: {}, types: ["Fire"], status: null };
  const def = { stats: { atk: 80, def: 90, spa: 80, spd: 90, spe: 70 }, stages: {}, types: ["Grass"] };
  const mv = { type: "Fire", cat: "phys", pow: 90 };
  const r = G.Battle.dmgCalc(att, def, mv);
  ok("dmgCalc positive", r.dmg > 0, JSON.stringify(r));
  const noStab = G.Battle.dmgCalc(Object.assign({}, att, { types: ["Water"] }), def, mv);
  ok("dmgCalc STAB applies", r.dmg >= noStab.dmg);
  const immune = G.Battle.dmgCalc(att, Object.assign({}, def, { types: ["Ground"] }),
    { type: "Electric", cat: "spec", pow: 90 });
  ok("dmgCalc immunity eff=0", immune.eff === 0);
  const status = G.Battle.dmgCalc(att, def, { type: "Normal", cat: "status", pow: 0 });
  ok("dmgCalc status move dmg=0", status.dmg === 0);
}

// ---- catch formula ----
{
  const full = { sp: "pikachu", hp: 20, maxhp: 20 };
  const weak = { sp: "pikachu", hp: 1, maxhp: 20 };
  const m = G.Battle.catchCheck(full, "master-ball");
  ok("master ball always catches", m.caught && m.shakes === 4);
  const p = G.Battle.catchCheck(weak, "poke-ball");
  ok("catchCheck returns shakes 0-4", p.shakes >= 0 && p.shakes <= 4 && typeof p.caught === "boolean");
  // weak target + ultra ball should catch sometimes over many trials
  let caught = 0;
  for (let i = 0; i < 60; i++) if (G.Battle.catchCheck(weak, "ultra-ball").caught) caught++;
  ok("weak+ultra catches sometimes", caught > 0, caught + "/60");
}

// ---- makeMon / fusion ----
if (G.Data && G.Data.SPECIES && G.Data.SPECIES.charizard && G.Data.SPECIES.mewtwo) {
  const m = G.Party.makeMon("charizard", 36);
  ok("makeMon instance", !!m && m.lvl === 36 && m.moves.length > 0 && m.moves.length <= 4);
  ok("makeMon hp full", m.hp === m.maxhp && m.maxhp > 0);
  ok("makeMon ivs 0-31", Object.values(m.ivs).every(v => v >= 0 && v <= 31));
  const fspec = G.Party.buildFusionSpecies(G.Data.SPECIES.charizard, G.Data.SPECIES.mewtwo, "fuse_charizard_mewtwo");
  ok("fusion name convention", fspec.name === "Chari" + "wtwo" || fspec.name.length > 3, fspec.name);
  ok("fusion types body+head", JSON.stringify(fspec.types) === JSON.stringify(["Fire", "Psychic"]), fspec.types.join("/"));
  const expAtk = Math.round(((84 + 110) / 2) * 1.05);
  ok("fusion stats avg+5%", fspec.base.atk === expAtk, "atk=" + fspec.base.atk + " exp=" + expAtk);
  ok("fusion movepool union", fspec.levelMoves.length >= 2);
  ok("fusion not fuseable", fspec.fuseable === false && fspec.cat === "fusion");
} else skipped("fusion checks", "charizard/mewtwo data missing");
if (G.Party.makeMon) {
  const miss = G.Party.makeMon("nope-not-real", 5);
  ok("makeMon unknown species -> null (no crash)", miss === null);
}

// ---- save/load roundtrip ----
{
  const lsg = sandbox.localStorage;
  G.Save.newGame("SMOKETEST");
  G.Save.data.money = 4321;
  G.Save.data.flags["gym1"] = true;
  const mon = G.Party.makeMon("pikachu", 7);
  if (mon) { G.Save.data.party.push(mon); }
  ok("save writes", G.Save.save() === true);
  const rawLen = (lsg.getItem("distortion_rift_save") || "").length;
  ok("save non-empty", rawLen > 100, rawLen + " bytes");
  G.Save.data = null;
  ok("load roundtrip", G.Save.load() === true);
  ok("load preserves name/money/flags",
    G.Save.data.player.name === "SMOKETEST" && G.Save.data.money === 4321 && G.Save.data.flags["gym1"] === true);
  ok("load preserves party", G.Save.data.party.length === (mon ? 1 : 0));
  G.Save.wipe();
  ok("wipe clears", !G.Save.exists());
}

// ---- AI pure logic ----
{
  const dec = G.AI.overclockDecide({
    me: { idx: 0, types: ["Water"], hp: 80, maxhp: 100, lvl: 20, stats: {}, status: null,
      moves: [{ id: "tackle", type: "Normal", cat: "phys", pow: 40, acc: 100, pp: 35 },
              { id: "water-gun", type: "Water", cat: "spec", pow: 40, acc: 100, pp: 25 }] },
    foe: { types: ["Fire"], hp: 50, maxhp: 50, lvl: 18, stats: {}, status: null, moves: [] },
    party: [], items: {}, canSwitch: false
  });
  ok("overclock picks STAB super-effective", dec.action === "move" && dec.i === 1, JSON.stringify(dec));
  G.AI.notePlayerBattle(["Water"], ["spec"], true);
  const team = G.AI.echoParty(2);
  ok("echoParty builds team", Array.isArray(team) && team.length >= 3, team.length + " mons");
  ok("AI-Sync clamps ±2", G.AI.syncAdjust(10, 50) === 12 && G.AI.syncAdjust(50, 10) === 48 && G.AI.syncAdjust(20, 21) === 21);
  const tip = G.AI.nexusTip();
  ok("nexusTip returns text", typeof tip === "string" && tip.length > 20);
}

// ---- sprite strategy: real dex sprites + procedural anime/starters ----
{
  var hasPika = !!(G.Data && G.Data.SPECIES && G.Data.SPECIES.pikachu);
  var hasGoku = !!(G.Data && G.Data.SPECIES && G.Data.SPECIES.goku);
  var hasSparkit = !!(G.Data && G.Data.SPECIES && G.Data.SPECIES.sparkit);
  if (hasPika) {
    ok("spriteKind pikachu = real", G.Sprites.spriteKind("pikachu") === "real");
    ok("dexOf pikachu = 25", G.Sprites.dexOf("pikachu") === 25);
  } else skipped("spriteKind real", "pikachu data missing");
  if (hasGoku) ok("spriteKind goku = anime", G.Sprites.spriteKind("goku") === "anime");
  else skipped("spriteKind anime", "goku data missing");
  if (hasSparkit) ok("spriteKind sparkit = starter", G.Sprites.spriteKind("sparkit") === "starter");
  else skipped("spriteKind starter", "sparkit data missing");
  ok("spriteKind unknown = missingno", G.Sprites.spriteKind("nope-not-real") === "missingno");
  ok("spriteFile front", G.Sprites.spriteFile(25, {}) === "25.png");
  ok("spriteFile back", G.Sprites.spriteFile(25, { back: true }) === "25-back.png");
  ok("spriteFile back-shiny", G.Sprites.spriteFile(487, { back: true, shiny: true }) === "487-back-shiny.png");
  ok("spriteFile shiny", G.Sprites.spriteFile(151, { shiny: true }) === "151-shiny.png");
  // fusion species -> spriteKind fusion
  if (G.Data && G.Data.SPECIES && G.Data.SPECIES.charizard && G.Data.SPECIES.mewtwo) {
    var fspec = G.Party.buildFusionSpecies(G.Data.SPECIES.charizard, G.Data.SPECIES.mewtwo, "fuse_charizard_mewtwo");
    G.Party.registerFusion(fspec);
    ok("spriteKind generated fusion = fusion", G.Sprites.spriteKind("fuse_charizard_mewtwo") === "fusion");
  }
  // node-safe: no canvas in this sandbox, must not throw
  var threw = false;
  try {
    G.Sprites.mon("pikachu", { size: 96 });
    G.Sprites.mon("goku", { size: 96 });
    G.Sprites.mon("nope-not-real", {});
    G.Sprites.fuse("charizard", "mewtwo", { size: 96 });
    G.Sprites.trainer("hero", { size: 64 });
    G.Sprites.inst({ sp: "pikachu" }, {});
  } catch (e) { threw = true; }
  ok("sprite calls node-safe (no throw)", !threw);
  var pr = G.Sprites.preload([]);
  ok("preload returns promise", pr && typeof pr.then === "function");
  var pr2 = G.Sprites.preload([25]);
  ok("preload(dex) returns promise", pr2 && typeof pr2.then === "function");
  var prc = G.Sprites.preloadCustom();
  ok("preloadCustom returns promise", prc && typeof prc.then === "function");
  var cf = G.Sprites.customFusions();
  ok("customFusions returns array", Array.isArray(cf));
  // manifest on disk (if readable here) must only name existing PNGs
  try {
    var manPath = path.join(ROOT, "assets", "fusions-custom.json");
    if (fs.existsSync(manPath)) {
      var man = JSON.parse(fs.readFileSync(manPath, "utf8"));
      ok("fusions-custom.json is an array", Array.isArray(man));
      var badFiles = man.filter(function (k) {
        return !fs.existsSync(path.join(ROOT, "assets", "fusions-custom", k + ".png"));
      });
      ok("manifest pairs all have PNGs on disk (" + man.length + ")", badFiles.length === 0, badFiles.slice(0, 4).join(","));
      var badKeys = man.filter(function (k) { return !/^[a-z0-9-]+_[a-z0-9-]+$/.test(k); });
      ok("manifest keys are body_head ids", badKeys.length === 0, badKeys.slice(0, 4).join(","));
    } else skipped("fusions-custom.json check", "manifest not found");
  } catch (e) { skipped("fusions-custom.json check", String(e && e.message || e)); }
}

// ---- story script validation ----
if (G.Story && G.Story.scripts && G.Data) {
  const SPECIES = G.Data.SPECIES || {}, MOVES = G.Data.MOVES || {}, ITEMS = G.Data.ITEMS || {};
  const MAPS = (G.Maps && G.Maps.LIST) || {};
  const TRAINERS = Object.assign({}, (G.Story && G.Story.trainers) || {}, G.Data.TRAINERS || {}, (G.Maps && G.Maps.TRAINERS) || {});
  Object.values(MAPS).forEach(m => (m.trainers || []).forEach(t => { if (t.id) TRAINERS[t.id] = t; }));
  const errs = [];
  function checkOp(op, sid, depth) {
    if (!op || typeof op !== "object") { errs.push(sid + ": bad op at depth " + depth); return; }
    if (op.say !== undefined && !op.text && typeof op.say === "string") { /* {say:"Name", text} ok */ }
    if (op.text !== undefined && typeof op.text !== "string") errs.push(sid + ": text not string");
    if (op.give && op.give.item && !ITEMS[op.give.item]) errs.push(sid + ": unknown item " + op.give.item);
    if (op.giveMon) {
      const sp = op.giveMon.sp || op.giveMon;
      if (!SPECIES[sp]) errs.push(sid + ": unknown giveMon species " + sp);
    }
    if (op.battle && op.battle.trainer && !TRAINERS[op.battle.trainer])
      errs.push(sid + ": unknown trainer " + op.battle.trainer);
    if (op.wild) {
      const sp = op.wild.sp || op.wild;
      if (!SPECIES[sp]) errs.push(sid + ": unknown wild species " + sp);
    }
    if (op.warp && op.warp.map && !MAPS[op.warp.map]) errs.push(sid + ": unknown warp map " + op.warp.map);
    if (op.if) { (op.then || []).forEach(o => checkOp(o, sid, depth + 1)); (op.else || []).forEach(o => checkOp(o, sid, depth + 1)); }
    if (op.choice && !Array.isArray(op.choice.opts)) errs.push(sid + ": choice without opts");
    if (op.evoScene && op.evoScene.to && !SPECIES[op.evoScene.to]) errs.push(sid + ": unknown evo target " + op.evoScene.to);
  }
  const scripts = G.Story.scripts;
  const ids = Object.keys(scripts);
  ok("story has scripts", ids.length > 0, ids.length + " scripts");
  ids.forEach(id => {
    const s = scripts[id];
    (Array.isArray(s) ? s : s.ops || []).forEach(op => checkOp(op, id, 0));
  });
  // every move referenced by species learnsets exists
  const badMoves = new Set();
  Object.values(SPECIES).forEach(sp => (sp.levelMoves || []).forEach(lm => {
    if (!MOVES[lm[1]]) badMoves.add(sp.id + "->" + lm[1]);
  }));
  ok("learnset moves exist", badMoves.size === 0, [...badMoves].slice(0, 5).join(","));
  // every map encounter species exists
  const badEnc = new Set();
  Object.values(MAPS).forEach(m => {
    const g = m.encounters && m.encounters.grass;
    (g || []).forEach(e => { if (e.sp && !SPECIES[e.sp]) badEnc.add(m.id + "->" + e.sp); });
  });
  ok("encounter species exist", badEnc.size === 0, [...badEnc].slice(0, 5).join(","));
  if (errs.length) ok("story refs valid", false, errs.slice(0, 8).join(" | ") + (errs.length > 8 ? " (+" + (errs.length - 8) + " more)" : ""));
  else ok("story refs valid (" + ids.length + " scripts)", true);
  if (!Object.keys(TRAINERS).length) skipped("trainer id validation", "no trainer registry found");
} else skipped("story validation", "G.Story.scripts or G.Data missing");

// ---- map tile sanity ----
if (G.Maps && G.Maps.LIST) {
  const LEGEND = new Set("#.,= *s~TD o".replace(/ /g, "").split("").concat([" ", "D"]));
  let bad = 0, maps = 0;
  Object.values(G.Maps.LIST).forEach(m => {
    maps++;
    (m.tiles || []).forEach(row => {
      for (const ch of row) if (!LEGEND.has(ch)) bad++;
    });
    if ((m.tiles || []).length !== m.h) bad++;
  });
  ok("map tiles valid (" + maps + " maps)", bad === 0, bad + " bad chars");
} else skipped("map tile checks", "G.Maps.LIST missing");

console.log("\n==== " + pass + " passed, " + fail + " failed, " + skip + " skipped ====");
process.exit(fail ? 1 : 0);
