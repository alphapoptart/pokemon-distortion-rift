/* G.AI — the AI twist: NEXUS companion, ECHO adaptive rival, ANOMALY director,
   Overclock autopilot, AI-Sync difficulty. All DOM-free; talks to Engine/Overworld/Battle defensively. */
window.G = window.G || {};
(function () {
  "use strict";
  var U = G.Util;

  var state = {
    echo: { typeUse: {}, catUse: {}, battles: 0, wins: 0, losses: 0, lastTaunt: "" },
    anomalyTimer: 0,
    rift: null,          // {sp, map, until}
    surgeUntil: 0,
    pendingEvent: null,  // consumed by overworld: {type, ...}
    giftCooldown: 0
  };

  /* ---------- helpers to read game state defensively ---------- */
  function saveData() {
    try { return (G.Save && G.Save.data) || null; } catch (e) { return null; }
  }
  function party() {
    var d = saveData();
    return (d && d.party) || [];
  }
  function options() {
    var d = saveData();
    return (d && d.options) || { aiSync: true, overclock: false, textSpeed: 2, battleAnims: true };
  }
  function flags() {
    var d = saveData();
    return (d && d.flags) || {};
  }
  function mapName() {
    try {
      if (G.Overworld && G.Overworld.currentMap) {
        var m = G.Overworld.currentMap();
        if (m && m.name) return m.name;
      }
    } catch (e) {}
    return "the wilds";
  }
  function badges() {
    var d = saveData();
    return (d && d.badges) || 0;
  }
  function spOf(id) {
    var S = (G.Data && G.Data.SPECIES) || {};
    return S[id] || null;
  }
  function monName(inst) {
    if (!inst) return "???";
    if (inst.nick) return inst.nick;
    var sp = spOf(inst.sp);
    return sp ? sp.name : U.titleCase(inst.sp || "???");
  }
  function monTypes(inst) {
    var sp = spOf(inst.sp);
    return (sp && sp.types) || ["Normal"];
  }

  /* ================= 1. NEXUS companion ================= */
  var NEXUS_QUIPS = [
    "Running diagnostics... conclusion: you're doing great. Probably.",
    "I computed 14,000 battle outcomes. In 13,999 you win. Let's make it all of them.",
    "Fun fact: Giratina's Distortion World has no up. I checked. Twice.",
    "My empathy module says: that last loss stung. My logic module says: rematch.",
    "Arceus built the universe in six days. I built this pep talk in six milliseconds."
  ];

  function partyWeaknesses() {
    // Count how many party members are weak to each attacking type (x2+).
    var weak = {};
    var p = party().filter(function (m) { return m && m.hp > 0; });
    p.forEach(function (m) {
      var types = monTypes(m);
      var chart = (G.Data && G.Data.CHART) || {};
      Object.keys(chart).forEach(function (atk) {
        var mult = 1;
        types.forEach(function (dt) {
          var v = chart[atk] && chart[atk][dt];
          mult *= (v === undefined || v === null) ? 1 : v;
        });
        if (mult >= 2) weak[atk] = (weak[atk] || 0) + 1;
      });
    });
    return { weak: weak, count: p.length };
  }

  function nextObjective() {
    try {
      if (G.Story && typeof G.Story.nextObjective === "function") {
        var o = G.Story.nextObjective();
        if (o) return o;
      }
    } catch (e) {}
    var b = badges();
    var goals = [
      "Challenge VOLTA at the Volt City Gym",
      "Earn the Fern Badge in Fern Town",
      "Take on MARINA at the Harbor Gym",
      "Face DRAKE, the Dragon master of Summit Town",
      "Conquer Victory Road",
      "Defeat the Elite Four and Champion SERAPHINA",
      "Enter the Distortion World and stop Team UMBRA",
      "Hunt the remaining legends in the Rift Den"
    ];
    return goals[Math.min(b, goals.length - 1)];
  }

  function nexusTip() {
    var p = party();
    var w = partyWeaknesses();
    var obj = nextObjective();
    var fl = flags();
    var lines = [];
    lines.push(U.choice(NEXUS_QUIPS));
    if (!p.length) {
      return "NEXUS: No Pokémon detected. Bold strategy. Might I suggest catching one? Objective: " + obj + ".";
    }
    var worst = null, worstN = 0;
    Object.keys(w.weak).forEach(function (t) {
      if (w.weak[t] > worstN && w.weak[t] >= Math.ceil(w.count / 2) && w.count > 1) { worst = t; worstN = w.weak[t]; }
    });
    if (worst) {
      lines.push("Heads up: " + worstN + " of your team fold to " + worst + "-type hits. Pack a resist or a hard counter.");
    }
    var low = p.filter(function (m) { return m.hp > 0 && m.hp < (m.maxhp || 50) * 0.35; });
    if (low.length) {
      lines.push(low.map(monName).join(", ") + (low.length > 1 ? " are" : " is") + " running on fumes. A Pokémon Center visit is 100% free. Just saying.");
    }
    if (state.echo.losses >= 2) {
      lines.push("You've dropped " + state.echo.losses + " recently. ECHO's adapting to you — time to adapt back. Vary your lead types.");
    }
    if (state.rift && Date.now() < state.rift.until) {
      var rsp = spOf(state.rift.sp);
      lines.push("URGENT: a Distortion Rift is open on " + state.rift.map + " — " + (rsp ? rsp.name : "something big") + " is stepping through. Don't let it close!");
    }
    lines.push("Current objective: " + obj + ".");
    return "NEXUS: " + lines.join(" ");
  }

  // Pre-battle scout for gyms/bosses: reveal ace + type tips.
  function nexusScout(trainer) {
    if (!trainer) return "NEXUS: No intel on this one. Wing it. (My favorite strategy.)";
    var team = trainer.team || [];
    if (!team.length) return "NEXUS: " + (trainer.name || "???") + " shows no team on the scanner. Suspicious.";
    var ace = null, aceScore = -1;
    team.forEach(function (m) {
      var sp = spOf(m.sp);
      var tot = sp ? (sp.base.hp + sp.base.atk + sp.base.def + sp.base.spa + sp.base.spd + sp.base.spe) : 300;
      var s = tot + (m.lvl || 5) * 10;
      if (s > aceScore) { aceScore = s; ace = m; }
    });
    var aceSp = ace ? spOf(ace.sp) : null;
    var aceName = aceSp ? aceSp.name : "???";
    var aceTypes = aceSp ? aceSp.types.join("/") : "???";
    var tip = "";
    if (aceSp) {
      var counters = counterTypes(aceSp.types);
      if (counters.length) tip = " Bring " + counters.slice(0, 2).join(" or ") + "-type offense.";
    }
    return "NEXUS SCOUT — " + (trainer.name || "???") + ": ace is " + aceName + " (" + aceTypes + ", Lv" + (ace ? ace.lvl : "?") + ")." + tip + " And hydrate. Battles are cardio.";
  }

  function counterTypes(defTypes) {
    var chart = (G.Data && G.Data.CHART) || {};
    var out = [];
    Object.keys(chart).forEach(function (atk) {
      var mult = 1;
      defTypes.forEach(function (dt) {
        var v = chart[atk] && chart[atk][dt];
        mult *= (v === undefined || v === null) ? 1 : v;
      });
      if (mult >= 2) out.push(atk);
    });
    return out;
  }

  function nexusPostBattle(summary) {
    // summary: {won, turns, foeName, mvp}
    var s = summary || {};
    if (s.won === false) {
      var ls = [
        "Post-battle analysis: we lost. Contributing factors: the opponent, and also the opponent.",
        "That one hurt. Recalibrating... New plan: hit them harder, get hit less. Revolutionary.",
        "Loss logged. ECHO is definitely taking notes. So am I. Mostly about snacks."
      ];
      return "NEXUS: " + U.choice(ls);
    }
    var ws = [
      "Flawless-ish victory" + (s.turns ? " in " + s.turns + " turns" : "") + ". " + (s.mvp ? monName(s.mvp) + " gets the golden star." : "Team gets the golden star."),
      "Victory! I've already written the ballad. It's three notes long and extremely catchy.",
      "Another win for the algorithm. By which I mean you. Mostly you. 12% me."
    ];
    return "NEXUS: " + U.choice(ws);
  }

  /* ================= 2. ECHO adaptive rival ================= */
  function notePlayerBattle(leadTypes, moveCats, won) {
    var e = state.echo;
    e.battles++;
    if (won) e.wins++; else e.losses++;
    (leadTypes || []).forEach(function (t) { e.typeUse[t] = (e.typeUse[t] || 0) + 1; });
    (moveCats || []).forEach(function (c) { e.catUse[c] = (e.catUse[c] || 0) + 1; });
  }

  function topKeys(obj, n) {
    return Object.keys(obj).sort(function (a, b) { return (obj[b] || 0) - (obj[a] || 0); }).slice(0, n || 3);
  }

  // Counter pool: species ids ECHO may field. Filtered to ones that exist.
  // NOTE: every id here must exist in G.Data.SPECIES (Gen 1-3 roster).
  var ECHO_POOL = [
    "pikachu", "raichu", "charizard", "blastoise", "venusaur", "gengar", "alakazam",
    "gyarados", "dragonite", "tyranitar", "gardevoir", "aggron", "flygon", "metagross",
    "salamence", "lucario", "jolteon", "vaporeon", "flareon", "espeon", "umbreon",
    "machamp", "lapras", "aerodactyl", "scizor", "houndoom", "manectric", "breloom",
    "absol", "zoroark", "ampharos", "electrike", "flaaffy", "eevee", "kadabra",
    "haunter", "machoke", "graveler", "scyther", "houndour", "mareep", "aron"
  ];
  // Pseudo-legendaries: at most 2 per ECHO team (ace is never stronger than this).
  var ECHO_PSEUDO = ["dragonite", "tyranitar", "metagross", "salamence"];
  // ECHO's thematic core: personal favorites that fill out his team beyond counters.
  var ECHO_SIGNATURE = ["zoroark", "lucario", "gengar", "alakazam", "scizor",
    "houndoom", "absol", "manectric", "aggron", "flygon", "aerodactyl", "machamp"];

  function echoParty(stage) {
    stage = U.clamp(stage || 1, 1, 5);
    var S = (G.Data && G.Data.SPECIES) || {};
    var pool = ECHO_POOL.filter(function (id) { return !!S[id]; });
    if (!pool.length) {
      // ultimate fallback: any species at all
      pool = Object.keys(S).slice(0, 40);
    }
    if (!pool.length) return [];
    var e = state.echo;
    var playerTop = topKeys(e.typeUse, 3);
    var chart = (G.Data && G.Data.CHART) || {};

    function scoreSp(id) {
      var sp = S[id];
      if (!sp) return -1e9;
      var types = sp.types || ["Normal"];
      var score = 0;
      // Offense: SE coverage vs player's favorite types
      playerTop.forEach(function (pt) {
        types.forEach(function (st) {
          var row = chart[st] || {};
          var v = row[pt];
          if (v >= 2) score += 3 * (e.typeUse[pt] || 1);
        });
      });
      // Defense: resist player's favorite types
      playerTop.forEach(function (pt) {
        var mult = 1;
        types.forEach(function (dt) {
          var row = chart[pt] || {};
          var v = row[dt];
          mult *= (v === undefined || v === null) ? 1 : v;
        });
        if (mult <= 0.5) score += 2 * (e.typeUse[pt] || 1);
        if (mult >= 2) score -= 2 * (e.typeUse[pt] || 1);
      });
      var tot = sp.base ? (sp.base.hp + sp.base.atk + sp.base.def + sp.base.spa + sp.base.spd + sp.base.spe) : 300;
      score += tot / 200; // slight preference for strong mons
      return score;
    }

    function isPseudo(id) { return ECHO_PSEUDO.indexOf(id) >= 0; }
    function take(id) { if (id && S[id] && picked.indexOf(id) < 0) { picked.push(id); return true; } return false; }
    var picked = [];
    var size = Math.min(2 + stage, 6);

    // 1) Stage-1 lead: ECHO's anime partner — the counter-pick to the player's starter.
    //    Flags echo_lead_luffy / echo_lead_naruto / echo_lead_goku are set by the intro script.
    if (stage === 1) {
      var fl = {};
      try { fl = (G.Save && G.Save.data && G.Save.data.flags) || {}; } catch (x) {}
      var leadId = fl.echo_lead_luffy ? "luffy" : fl.echo_lead_naruto ? "naruto" : fl.echo_lead_goku ? "goku" : null;
      take(leadId);
    }

    // 2) Counter-picks: "checks, not hard counters" — at most 2, vs the player's
    //    most-used types. The rest of the team is thematic, not optimized.
    var ranked = pool.filter(function (id) { return picked.indexOf(id) < 0; })
      .map(function (id) { return { id: id, s: scoreSp(id) + U.rand(0, 1.5) }; })
      .sort(function (a, b) { return b.s - a.s; });
    var nCounters = Math.min(2, size - picked.length);
    for (var ci = 0; ci < nCounters && ci < ranked.length; ci++) take(ranked[ci].id);

    // 3) Thematic fill: ECHO's signature favorites, rotated per stage for variety.
    //    Pseudo-legendary cap: 2 per team. Ace is never stronger than a pseudo.
    var pseudoCount = picked.filter(isPseudo).length;
    var sigPool = ECHO_SIGNATURE.filter(function (id) { return S[id] && picked.indexOf(id) < 0; });
    var rot = (stage - 1) * 2, ordered = [];
    for (var si = 0; si < sigPool.length; si++) ordered.push(sigPool[(si + rot) % sigPool.length]);
    pool.forEach(function (id) {
      if (ordered.indexOf(id) < 0 && picked.indexOf(id) < 0) ordered.push(id);
    });
    for (var oi = 0; oi < ordered.length && picked.length < size; oi++) {
      var oid = ordered[oi];
      if (isPseudo(oid) && pseudoCount >= 2) continue;
      if (take(oid) && isPseudo(oid)) pseudoCount++;
    }
    // absolute fallback: anything at all
    pool.forEach(function (id) { if (picked.length < size) take(id); });
    if (!picked.length) return [];

    // 4) Level: player party average, NEVER above. Challenging, not cheap.
    var p = party();
    var avg = 5;
    if (p.length) avg = Math.round(p.reduce(function (a, m) { return a + (m.lvl || 5); }, 0) / p.length);
    var lvl = Math.max(5, avg);
    return picked.map(function (id) { return { sp: id, lvl: lvl }; });
  }

  function echoTaunt() {
    var e = state.echo;
    var top = topKeys(e.typeUse, 1)[0];
    var cat = topKeys(e.catUse, 1)[0];
    var taunts = [];
    if (top) taunts.push("Still spamming " + top + "-types? I brought a counter. Obviously.");
    if (cat === "status") taunts.push("All those status moves... did you forget how damage works?");
    if (e.losses > e.wins) taunts.push("You've lost " + e.losses + " times and I'm keeping count. This'll be fun.");
    else if (e.wins > 0) taunts.push("You've won " + e.wins + " against me. Cute. The sample size was too small anyway.");
    taunts.push("NEXUS can't save you this time. Actually it probably can. Whatever — battle me!");
    taunts.push("I analyzed your last battle frame by frame. You're welcome for the free coaching.");
    return U.choice(taunts);
  }

  /* ================= 3. ANOMALY director ================= */
  var RIFT_POOL = [
    "mewtwo", "mew", "lugia", "ho-oh", "celebi", "kyogre", "groudon", "rayquaza",
    "jirachi", "deoxys", "dialga", "palkia", "darkrai", "shaymin", "victini",
    "genesect", "xerneas", "yveltal", "zygarde", "diancie", "volcanion", "marshadow",
    "zeraora", "zacian", "zamazenta", "eternatus", "koraidon", "miraidon", "terapagos"
  ];
  var DISTRESS_POOL = ["goku", "luffy", "gojo", "naruto", "ichigo", "deku", "tanjiro", "saitama"];
  var GIFT_POOL = ["rare-candy", "master-ball", "pp-max", "ultra-ball", "max-revive", "dna-splicers"];

  function anomalyTick(dt) {
    // dt in seconds of playtime. Rolls an event every ~3-5 minutes.
    state.anomalyTimer += dt;
    if (state.anomalyTimer < 180 + U.rand(0, 120)) return;
    state.anomalyTimer = 0;
    var S = (G.Data && G.Data.SPECIES) || {};
    var roll = U.rand(0, 100);
    var map = mapName();
    var ev = null;
    if (roll < 30) {
      var pool = RIFT_POOL.filter(function (id) { return !!S[id]; });
      if (pool.length) {
        var sp = U.choice(pool);
        state.rift = { sp: sp, map: map, until: Date.now() + 5 * 60 * 1000 };
        var nm = S[sp].name;
        toast("DISTORTION RIFT! " + nm + " is stepping through on " + map + "! (5 min)");
        ev = { type: "rift", sp: sp };
      }
    } else if (roll < 50) {
      state.surgeUntil = Date.now() + 5 * 60 * 1000;
      toast("SHINY SURGE! Shiny odds boosted for 5 minutes!");
      ev = { type: "surge" };
    } else if (roll < 68) {
      ev = { type: "ambush" };
      toast("UMBRA AMBUSH! A grunt is moving on your position!");
      state.pendingEvent = ev;
    } else if (roll < 84) {
      var apool = DISTRESS_POOL.filter(function (id) { return !!S[id]; });
      if (apool.length) {
        var ally = U.choice(apool);
        ev = { type: "distress", sp: ally };
        toast("ANIME DISTRESS! " + S[ally].name + " needs help on " + map + "!");
        state.pendingEvent = ev;
      }
    } else {
      var gpool = GIFT_POOL.filter(function (id) {
        return !(G.Data && G.Data.ITEMS) || !!G.Data.ITEMS[id];
      });
      var gift = gpool.length ? U.choice(gpool) : "potion";
      ev = { type: "gift", item: gift };
      try {
        if (G.Save && G.Save.data && G.Save.data.bag) {
          var bag = G.Save.data.bag;
          bag[gift] = (bag[gift] || 0) + 1;
        }
      } catch (e) {}
      var iname = (G.Data && G.Data.ITEMS && G.Data.ITEMS[gift] && G.Data.ITEMS[gift].name) || gift;
      toast("NEXUS GIFT! Received " + iname + "!");
      try { G.Audio && G.Audio.sfx("fanfare"); } catch (e) {}
    }
    return ev || undefined;
  }

  function toast(msg) {
    try {
      if (G.Engine && G.Engine.toast) G.Engine.toast(msg, 4200);
    } catch (e) {}
  }

  function pollEvent() {
    var e = state.pendingEvent;
    state.pendingEvent = null;
    return e;
  }

  function consumeRift(mapIdOrName) {
    // Called by overworld when rolling a wild encounter. Returns species id if rift fires here.
    if (!state.rift) return null;
    if (Date.now() > state.rift.until) { state.rift = null; return null; }
    return state.rift.sp;
  }

  function shinyBonus() {
    return Date.now() < state.surgeUntil ? 8 : 1;
  }

  /* ================= 4. Overclock autopilot ================= */
  // battleState: { me:{types,hp,maxhp,moves:[{id,type,cat,pow,acc}],lvl,stats,status},
  //                 foe:{types,hp,maxhp,moves:[{id,type,cat,pow}],lvl,stats,status},
  //                 party:[{types,hp,maxhp,moves,lvl,alive,idx}], items:{potion:2,...} }
  function chartMult(atkType, defTypes) {
    var chart = (G.Data && G.Data.CHART) || {};
    var row = chart[atkType] || {};
    var m = 1;
    (defTypes || []).forEach(function (dt) {
      var v = row[dt];
      m *= (v === undefined || v === null) ? 1 : v;
    });
    return m;
  }

  function moveScore(mv, meTypes, foeTypes) {
    if (!mv || mv.pp === 0) return -1;
    if (mv.cat === "status" || !mv.pow) {
      // setup moves: decent if we're healthy and foe isn't threatening
      return 8;
    }
    var stab = meTypes.indexOf(mv.type) >= 0 ? 1.5 : 1;
    var eff = chartMult(mv.type, foeTypes);
    if (eff === 0) return -1;
    var acc = (mv.acc === undefined || mv.acc === null) ? 100 : mv.acc;
    return mv.pow * stab * eff * (acc / 100);
  }

  function overclockDecide(bs) {
    if (!bs || !bs.me) return { action: "move", i: 0 };
    var me = bs.me, foe = bs.foe || { types: ["Normal"], hp: 1, maxhp: 1, moves: [] };
    var meTypes = me.types || ["Normal"], foeTypes = foe.types || ["Normal"];

    // 1) Heal check: safe heal if a potion exists, we're <45%, and foe can't KO us.
    var items = bs.items || {};
    var healItems = ["hyper-potion", "max-potion", "super-potion", "potion"];
    var healId = null;
    for (var hi = 0; hi < healItems.length; hi++) {
      if (items[healItems[hi]] > 0) { healId = healItems[hi]; break; }
    }
    var foeBest = 0;
    (foe.moves || []).forEach(function (fm) {
      if (fm.cat === "status" || !fm.pow) return;
      var eff = chartMult(fm.type, meTypes);
      foeBest = Math.max(foeBest, fm.pow * eff);
    });
    // rough KO estimate: foeBest * (foeAtk/meDef) ~ foeBest * 1.2 as crude proxy
    var danger = foeBest * 1.2 > me.hp;
    if (healId && me.hp < me.maxhp * 0.45 && !danger) {
      return { action: "item", item: healId };
    }

    // 2) Switch check: 4x weakness or <25% hp and a better counter exists.
    var myWeak = 1;
    (foe.moves || []).forEach(function (fm) {
      if (!fm.type || fm.cat === "status") return;
      myWeak = Math.max(myWeak, chartMult(fm.type, meTypes));
    });
    var shouldSwitch = (myWeak >= 4 || me.hp < me.maxhp * 0.25) && bs.canSwitch !== false;
    if (shouldSwitch && bs.party && bs.party.length) {
      var best = null, bestS = -1e9;
      var myBestOffense = 0;
      (me.moves || []).forEach(function (mv) { myBestOffense = Math.max(myBestOffense, moveScore(mv, meTypes, foeTypes)); });
      bs.party.forEach(function (cand) {
        if (!cand || !cand.alive || cand.idx === me.idx) return;
        var ct = cand.types || ["Normal"];
        var def = 1;
        (foe.moves || []).forEach(function (fm) {
          if (!fm.type || fm.cat === "status") return;
          def = Math.max(def, chartMult(fm.type, ct));
        });
        var off = 0;
        (cand.moves || []).forEach(function (mv) { off = Math.max(off, moveScore(mv, ct, foeTypes)); });
        var s = off - def * 30 + (cand.hp / cand.maxhp) * 20;
        if (s > bestS) { bestS = s; best = cand; }
      });
      if (best && bestS > myBestOffense * 0.6) {
        return { action: "switch", i: best.idx };
      }
    }

    // 3) Pick best move.
    var bi = 0, bscore = -1e9;
    (me.moves || []).forEach(function (mv, i) {
      var s = moveScore(mv, meTypes, foeTypes);
      if (s > bscore) { bscore = s; bi = i; }
    });
    return { action: "move", i: bi };
  }

  /* ================= 5. AI-Sync difficulty ================= */
  function syncAdjust(lvl, partyAvg) {
    if (!options().aiSync) return lvl;
    var avg = partyAvg || 5;
    var diff = U.clamp(avg - lvl, -2, 2);
    return Math.max(1, Math.round(lvl + diff));
  }

  /* ---------- persistence ---------- */
  function saveState() {
    return { echo: U.deepClone(state.echo) };
  }
  function loadState(s) {
    if (!s) return;
    if (s.echo) state.echo = Object.assign(state.echo, U.deepClone(s.echo));
  }
  function reset() {
    state.echo = { typeUse: {}, catUse: {}, battles: 0, wins: 0, losses: 0, lastTaunt: "" };
    state.anomalyTimer = 0; state.rift = null; state.surgeUntil = 0; state.pendingEvent = null;
  }

  G.AI = {
    nexusTip: nexusTip, nexusScout: nexusScout, nexusPostBattle: nexusPostBattle,
    notePlayerBattle: notePlayerBattle, echoParty: echoParty, echoTaunt: echoTaunt,
    anomalyTick: anomalyTick, pollEvent: pollEvent, consumeRift: consumeRift, shinyBonus: shinyBonus,
    overclockDecide: overclockDecide, syncAdjust: syncAdjust,
    saveState: saveState, loadState: loadState, reset: reset,
    _state: state
  };
})();
