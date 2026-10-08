/* Pokémon: Distortion Rift — fusions: 24 curated + the fusion engine.
   Infinite Fusion convention: name = body first-half + head second-half. */
window.G = window.G || {};
G.Fusions = G.Fusions || {};

(function(){
var S = G.Data.SPECIES;
G.Fusions._nextDex = 10001;

/** Infinite Fusion name blend: body first half + head second half. */
G.Fusions.blendName = function(bodyName, headName){
  var b = String(bodyName || "?"), h = String(headName || "?");
  return b.slice(0, Math.ceil(b.length/2)) + h.slice(Math.floor(h.length/2));
};

/** Can these two species be fused? Returns {ok, reason}. */
G.Fusions.canFuse = function(aId, bId){
  var a = S[aId], b = S[bId];
  if(!a || !b) return {ok:false, reason:"Unknown species."};
  if(aId === bId) return {ok:false, reason:"A Pokémon cannot fuse with itself."};
  if(a.anime || b.anime) return {ok:false, reason:"Anime allies refuse the splicer. Their power is already complete."};
  if(!a.fuseable || !b.fuseable) return {ok:false, reason:"The splicers reject this pair. Some powers must stay separate."};
  return {ok:true, reason:""};
};

/** Build (or fetch) the fused species object for body+head. Registers in G.Data.SPECIES. */
G.Fusions.make = function(bodyId, headId, level){
  var chk = G.Fusions.canFuse(bodyId, headId);
  if(!chk.ok) return null;
  var sid = "fuse_" + bodyId + "_" + headId;
  if(S[sid]) return S[sid];
  var body = S[bodyId], head = S[headId];
  var dex = G.Fusions._nextDex++;
  var name = G.Fusions.blendName(body.name, head.name);
  var types = [body.types[0]];
  if(head.types[0] !== body.types[0]) types.push(head.types[0]);
  var base = {}, k;
  ["hp","atk","def","spa","spd","spe"].forEach(function(st){
    base[st] = Math.max(1, Math.round(((body.base[st]||1) + (head.base[st]||1)) / 2 * 1.05));
  });
  /* union learnset: keep lowest level per move, sort, cap 14 */
  var seen = {}, lm = [];
  (body.levelMoves||[]).concat(head.levelMoves||[]).forEach(function(pair){
    var mv = pair[1], lv = pair[0];
    if(!G.Data.MOVES[mv]) return;
    if(seen[mv] === undefined || lv < seen[mv]) seen[mv] = lv;
  });
  Object.keys(seen).forEach(function(mv){ lm.push([seen[mv], mv]); });
  lm.sort(function(x,y){ return x[0]-y[0] || (x[1]<y[1]?-1:1); });
  lm = lm.slice(0, 14);
  var pal = [];
  [body.sprite.pal[0], head.sprite.pal[0], body.sprite.pal[2]||body.sprite.pal[1], head.sprite.pal[2]||head.sprite.pal[1]]
    .forEach(function(c){ if(c && pal.indexOf(c) < 0) pal.push(c); });
  pal = pal.slice(0, 4);
  var sp = {
    id: sid, name: name, dex: dex, cat: "fusion",
    types: types, base: base,
    abilities: [body.abilities[0] || "Adaptability"],
    catchRate: 3, levelMoves: lm, evo: [],
    sprite: { shape: (body.sprite||{}).shape || "blob",
              seed: ((body.sprite||{}).seed||1)*1000 + ((head.sprite||{}).seed||2),
              pal: pal.length ? pal : ["#888888","#bbbbbb","#555555"] },
    flavor: "A spliced fusion of " + body.name + " and " + head.name + ". Neither remembers which half dreams.",
    fuseable: true, anime: false,
    fusionOf: [bodyId, headId]
  };
  S[sid] = sp;
  return sp;
};

/** Build a battle-ready instance of a fusion. Never throws.
    Delegates to G.Party.makeMon (the canonical instance factory) so the shape
    matches the engine: {sp, lvl, moves:[{id,pp,maxpp}], hp, maxhp, ...}. */
G.Fusions.makeInstance = function(bodyId, headId, level){
  var sp = G.Fusions.make(bodyId, headId, level);
  if(!sp) return null;
  level = Math.max(1, Math.min(100, level|0 || 5));
  try {
    if (G.Party && G.Party.makeMon) return G.Party.makeMon(sp.id, level, {fusion: true});
  } catch(e){}
  // fallback (party.js absent): build the engine-shaped instance manually
  function iv(){ return 1 + Math.floor(Math.random()*31); }
  var ivs = {hp:iv(),atk:iv(),def:iv(),spa:iv(),spd:iv(),spe:iv()};
  var stats = null;
  try { stats = G.Battle.statsFor(sp.id, level, ivs); } catch(e){ stats = {hp:50,atk:50,def:50,spa:50,spd:50,spe:50}; }
  var pool = (sp.levelMoves||[]).filter(function(p){ return p[0] <= level; }).map(function(p){ return p[1]; });
  var moves = (pool.length ? pool.slice(-4) : ["tackle"]).map(function(id){
    var md = (G.Data.MOVES || {})[id] || {};
    return {id:id, pp: md.pp || 10, maxpp: md.pp || 10};
  });
  return {
    uid: "f" + Date.now().toString(36) + Math.floor(Math.random()*1e6),
    sp: sp.id, lvl: level, xp: 0,
    moves: moves, ivs: ivs, hp: stats.hp, maxhp: stats.hp,
    status: null, statusTurns: 0,
    shiny: (Math.random() < 1/512), nick: null, ot: "you", fusion: true
  };
};

/* ---- 24 curated signature fusions: [bodyId, headId, dex, flavor] ---- */
var CURATED = [
["charizard","mewtwo",1701,"A psychic dragon of lab and volcano. Its tail-flame burns violet."],
["gengar","alakazam",1702,"Two geniuses, one grinning shadow. It solved your strategy yesterday."],
["dragonite","tyranitar",1703,"A kaiju with wings and a mail route. Cities evacuate politely."],
["zoroark","lucario",1704,"An illusionist who read your aura and decided to be you, but stronger."],
["ampharos","manectric",1705,"A living power grid. Blackouts apologize to it."],
["metagross","aggron",1706,"Eight supercomputer brains inside a mountain. It does math at you."],
["salamence","flygon",1707,"The desert's dragon finally learned to sing and scream at once."],
["umbreon","gengar",1708,"A moonlit shadow that licks the dark itself. Spooky. Effective."],
["jolteon","vaporeon",1709,"Steam and lightning in one fluffy package. A weather event with ears."],
["tyranitar","salamence",1710,"It redrew the map, then ate the map. Cartographers wept."],
["dragonite","charizard",1711,"A dragon that finally admits it. Fire-breathing mail dragon."],
["blastoise","gyarados",1712,"Twin cannons on a sea serpent. The ocean filed a noise complaint."],
["venusaur","breloom",1713,"A flower that punches. Photosynthesis-powered uppercuts."],
["alakazam","metagross",1714,"Twelve brains, two spoons, zero mercy. It finished your homework."],
["gardevoir","espeon",1715,"It saw your future and decided to protect it. Black holes optional."],
["snorlax","lapras",1716,"A singing island that naps through tsunamis. Ferry service: unreliable."],
["aerodactyl","salamence",1717,"Extinct twice, flying anyway. Holds grudges at Mach 2."],
["houndoom","tyranitar",1718,"A hellhound in a kaiju suit. Its howl causes rockslides."],
["raichu","jolteon",1719,"Ten thousand volts of cheek-stored spite. Do not pet."],
["machamp","lucario",1720,"Six arms reading your aura. It knows your next three excuses."],
["espeon","alakazam",1721,"It predicted this fusion before you clicked. Smug about it."],
["absol","umbreon",1722,"A disaster prophet wrapped in moonlight. Warns you. Blamed anyway."],
["lapras","vaporeon",1723,"Ninety percent water, ten percent song, one hundred percent ferry."],
["gyarados","charizard",1724,"Rage with wings and a superiority complex. The sky is lava."]
];
CURATED.forEach(function(c){
  var sp = G.Fusions.make(c[0], c[1], 5);
  if(sp){ sp.dex = c[2]; sp.flavor = c[3]; }
});

/* sanity: curated fusions registered, all moves valid */
(function(){
var bad = [];
Object.keys(S).forEach(function(id){
  var s = S[id];
  if(s.cat !== "fusion") return;
  (s.levelMoves||[]).forEach(function(lm){ if(!G.Data.MOVES[lm[1]]) bad.push(id+":"+lm[1]); });
});
G.Data._fusionRefErrors = bad;
})();
})();
