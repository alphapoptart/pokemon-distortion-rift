var S = G.Data.SPECIES;
function sp(o){ o.anime = !!o.anime; o.fuseable = (o.fuseable !== false); S[o.id] = o; }
var LEG = function(id,name,dex,types,b,ab,cr,mv,fl,sh,seed,pal,cat){ sp({id:id,name:name,dex:dex,cat:cat||"legendary",types:types,
base:{hp:b[0],atk:b[1],def:b[2],spa:b[3],spd:b[4],spe:b[5]},abilities:[ab],catchRate:cr,levelMoves:mv,evo:[],
sprite:{shape:sh,seed:seed,pal:pal},flavor:fl}); };

LEG("tapu-koko","Tapu Koko",785,["Electric","Fairy"],[70,115,85,95,75,130],"Electric Surge",3,
[[1,"thunderbolt"],[1,"wild-charge"],[24,"thunder"],[36,"dazzling-gleam"],[48,"agility"],[60,"thunder-punch"]],
"Guardian of Melemele. Curious about everything. Touches everything.","bird",785,["#f5d742","#e2703a","#2b2b33"]);
LEG("tapu-lele","Tapu Lele",786,["Psychic","Fairy"],[70,85,75,130,115,95],"Psychic Surge",3,
[[1,"psychic"],[1,"moonblast"],[24,"focus-blast"],[36,"calm-mind"],[48,"thunderbolt"],[60,"shadow-ball"]],
"Guardian of Akala. Innocent cruelty. Scales everything it likes.","quad",786,["#f2b8d0","#e08ab0","#2b2b33"]);
LEG("tapu-bulu","Tapu Bulu",787,["Grass","Fairy"],[70,130,115,85,95,75],"Grassy Surge",3,
[[1,"leaf-blade"],[1,"play-rough"],[24,"close-combat"],[36,"stone-edge"],[48,"bulk-up"],[60,"superpower"]],
"Guardian of Ula'ula. Rings a bell to grow plants. Gym bro energy.","quad",787,["#c8352e","#e8a83e","#4a9e35"]);
LEG("tapu-fini","Tapu Fini",788,["Water","Fairy"],[70,75,115,95,130,95],"Misty Surge",3,
[[1,"surf"],[1,"moonblast"],[24,"ice-beam"],[36,"calm-mind"],[48,"hydro-pump"],[60,"dazzling-gleam"]],
"Guardian of Poni. Its mist hides it from the world's nonsense.","fish",788,["#7d5ac2","#e8e0f2","#4fa8ff"]);
LEG("cosmog","Cosmog",789,["Psychic"],[43,29,31,29,31,37],"Unaware",45,
[[1,"tackle"],[1,"cosmic-power"]],
"A nebula baby. Cries starlight. Heavier than it looks. Much heavier.",
"blob",789,["#4a3a6a","#8a7ac2","#f2e0f2"]);
S.cosmog.evo = [{to:"cosmoem",by:"level",at:43}];
LEG("cosmoem","Cosmoem",790,["Psychic"],[43,29,131,29,131,37],"Sturdy",45,
[[1,"cosmic-power"],[1,"ancient-power"]],
"A cocoon of collapsing star-stuff. Basically a black hole with manners.",
"blob",790,["#2e2440","#5a4a8a","#c9a227"]);
S.cosmoem.evo = [{to:"solgaleo",by:"level",at:53},{to:"lunala",by:"level",at:53}];
LEG("solgaleo","Solgaleo",791,["Psychic","Steel"],[137,137,107,113,89,97],"Full Metal Body",3,
[[1,"sunsteel-strike"],[1,"psychic"],[24,"searing-sunraze-smash"],[36,"flamethrower"],[48,"earthquake"],[60,"zen-headbutt"],[72,"wild-charge"]],
"The beast that devours the sun. Polite about it.","quad",791,["#f2e0a8","#e8a83e","#4a7ec2"]);
LEG("lunala","Lunala",792,["Psychic","Ghost"],[137,113,89,137,107,97],"Shadow Shield",3,
[[1,"moongeist-beam"],[1,"psychic"],[24,"shadow-ball"],[36,"ice-beam"],[48,"thunderbolt"],[60,"calm-mind"],[72,"hyperspace-hole"]],
"The beast that calls the moon. Third shift, every night, forever.","winged",792,["#4a3a6a","#8a7ac2","#f2e0f2"]);
LEG("nihilego","Nihilego",793,["Rock","Poison"],[109,53,47,127,131,103],"Beast Boost",3,
[[1,"power-gem"],[1,"sludge-bomb"],[24,"thunderbolt"],[36,"ancient-power"],[48,"dazzling-gleam"]],
"An Ultra Beast that parasitizes minds. Glass cannon. Actual glass.","ghostly",793,["#e8f8ff","#7dd8f2","#f5d742"]);
LEG("buzzwole","Buzzwole",794,["Bug","Fighting"],[107,139,139,53,53,79],"Beast Boost",3,
[[1,"close-combat"],[1,"x-scissor"],[24,"stone-edge"],[36,"earthquake"],[48,"bulk-up"],[60,"drain-punch"]],
"An Ultra Beast that poses. Flexes to absorb energy. Relatable.","humanoid",794,["#c8352e","#8a2420","#f5d742"]);
LEG("pheromosa","Pheromosa",795,["Bug","Fighting"],[71,137,37,137,37,151],"Beast Boost",3,
[[1,"close-combat"],[1,"bug-buzz"],[24,"ice-beam"],[36,"agility"],[48,"poison-jab"]],
"An Ultra Beast of blinding beauty. Its sweat is toxic. Avoid.","humanoid",795,["#f2f2e8","#d9d9d9","#c9a227"]);
LEG("xurkitree","Xurkitree",796,["Electric"],[83,89,71,173,71,83],"Beast Boost",3,
[[1,"thunderbolt"],[1,"thunder"],[24,"thunder-wave"],[36,"calm-mind"],[48,"power-gem"]],
"A living power line. Plugs itself into anything. Anything.","humanoid",796,["#f5d742","#2b2b33","#fff3b0"]);
LEG("celesteela","Celesteela",797,["Steel","Flying"],[97,101,103,107,101,61],"Beast Boost",3,
[[1,"flash-cannon"],[1,"air-slash"],[24,"earthquake"],[36,"flamethrower"],[48,"ancient-power"],[60,"iron-defense"]],
"A rocket that became a bamboo princess. Launches itself for fun.","winged",797,["#8ab8d9","#4a7a9a","#e8f8ff"]);
LEG("kartana","Kartana",798,["Grass","Steel"],[59,181,131,59,31,109],"Beast Boost",3,
[[1,"leaf-blade"],[1,"x-scissor"],[24,"sacred-sword"],[36,"night-slash"],[48,"swords-dance"],[60,"aerial-ace"]],
"A paper-thin Ultra Beast. Cuts everything. Including the fourth wall.","humanoid",798,["#f2f2e8","#d9d9d9","#e33e2b"]);
LEG("guzzlord","Guzzlord",799,["Dark","Dragon"],[223,101,53,97,53,43],"Beast Boost",3,
[[1,"crunch"],[1,"outrage"],[24,"earthquake"],[36,"dark-pulse"],[48,"dragon-pulse"]],
"Eats everything, forever. The universe's garbage disposal.","blob",799,["#3d3d4a","#8a8a9a","#f5d742"]);
LEG("necrozma","Necrozma",800,["Psychic"],[97,107,101,127,89,79],"Prism Armor",3,
[[1,"photon-geyser"],[1,"psychic"],[24,"light-that-burns-the-sky"],[36,"earth-power"],[48,"ancient-power"],[60,"calm-mind"]],
"A light-eater in constant pain. Steals light to feel whole. Tragic.","humanoid",800,["#2b2b33","#4a4a5a","#f2e0a8"]);
LEG("magearna","Magearna",801,["Steel","Fairy"],[80,95,115,130,115,65],"Soul-Heart",3,
[[1,"fleur-cannon"],[1,"flash-cannon"],[24,"ice-beam"],[36,"thunderbolt"],[48,"calm-mind"],[60,"aura-sphere"],[72,"ancient-power"]],
"A 500-year-old robot with a soul. Cries at weddings.","humanoid",801,["#c9a227","#8a6a1e","#f2b8d0"],"mythical");
LEG("marshadow","Marshadow",802,["Fighting","Ghost"],[90,125,80,90,90,125],"Technician",3,
[[1,"spectral-thief"],[1,"close-combat"],[24,"shadow-ball"],[36,"ice-punch"],[48,"thunder-punch"],[60,"bulk-up"]],
"Lurks in shadows, mimics the strong. The ultimate fanboy.","ghostly",802,["#5a6a5a","#2e3a2e","#e8e8e8"],"mythical");
LEG("poipole","Poipole",803,["Poison"],[67,73,67,73,67,73],"Beast Boost",45,
[[1,"sludge-bomb"],[12,"dragon-pulse"],[24,"nasty-plot"]],
"A playful Ultra Beast. Sprays adhesive poison. Do not hug.","blob",803,["#7d5ac2","#4a3a7a","#f2e0f2"]);
S.poipole.evo = [{to:"naganadel",by:"level",at:53}];
LEG("naganadel","Naganadel",804,["Poison","Dragon"],[73,73,73,127,73,121],"Beast Boost",3,
[[1,"sludge-bomb"],[1,"dragon-pulse"],[24,"flamethrower"],[36,"nasty-plot"],[48,"thunderbolt"]],
"Poipole all grown up. A wasp-dragon with a PhD in venom.","winged",804,["#8a6ac2","#4a3a7a","#f2e0f2"]);
LEG("stakataka","Stakataka",805,["Rock","Steel"],[61,131,211,53,101,13],"Beast Boost",3,
[[1,"stone-edge"],[1,"iron-head"],[24,"earthquake"],[36,"ancient-power"],[48,"iron-defense"],[60,"rock-slide"]],
"A walking castle of stacked stones. Very slow. Very committed.","quad",805,["#8a8a9a","#4a4a5a","#d9d9d9"]);
LEG("blacephalon","Blacephalon",806,["Fire","Ghost"],[53,127,53,151,53,107],"Beast Boost",3,
[[1,"flamethrower"],[1,"shadow-ball"],[24,"psychic"],[36,"calm-mind"]],
"A clown-headed Ultra Beast. Its head explodes. For applause.","humanoid",806,["#f2f2e8","#e2703a","#c8352e"]);
LEG("zeraora","Zeraora",807,["Electric"],[88,112,75,102,80,143],"Volt Absorb",3,
[[1,"thunderbolt"],[1,"thunder"],[24,"close-combat"],[36,"wild-charge"],[48,"agility"],[60,"thunder-punch"]],
"A lightning-fast mythical. Runs so fast its fur crackles.","humanoid",807,["#f5d742","#2b2b33","#7df9ff"],"mythical");
LEG("meltan","Meltan",808,["Steel"],[46,65,65,55,35,34],"Magnet Pull",45,
[[1,"thunder-shock"],[12,"iron-head"],[24,"thunder-wave"]],
"A liquid-metal mythical. Melts into machinery. Adorable hex nut.","blob",808,["#8ab8d9","#4a7a9a","#e33e2b"],"mythical");
S.meltan.evo = [{to:"melmetal",by:"level",at:40}];
LEG("melmetal","Melmetal",809,["Steel"],[135,143,143,80,65,34],"Iron Fist",3,
[[1,"iron-head"],[1,"thunder-punch"],[24,"earthquake"],[36,"ice-punch"],[48,"body-slam"],[60,"thunderbolt"]],
"Meltan, but a thousand of them punched together. Respect.","humanoid",809,["#8ab8d9","#3d6a8a","#e33e2b"],"mythical");

/* ===== Gen 8 ===== */
LEG("zacian","Zacian",888,["Fairy"],[92,130,115,80,115,138],"Intrepid Sword",3,
[[1,"behemoth-blade"],[1,"play-rough"],[24,"close-combat"],[36,"iron-head"],[48,"swords-dance"],[60,"crunch"]],
"The sword hero of Galar. Sleeps as a statue. Dramatic.","quad",888,["#4a7ec2","#2e4a7a","#c9a227"]);
LEG("zamazenta","Zamazenta",889,["Fighting"],[92,130,115,80,115,138],"Dauntless Shield",3,
[[1,"behemoth-bash"],[1,"close-combat"],[24,"iron-head"],[36,"crunch"],[48,"iron-defense"],[60,"wild-charge"]],
"The shield hero of Galar. Blocks anything. Including criticism.","quad",889,["#c8352e","#8a2420","#d9d9d9"]);
LEG("eternatus","Eternatus",890,["Poison","Dragon"],[140,85,95,145,95,130],"Pressure",3,
[[1,"eternabeam"],[1,"sludge-bomb"],[24,"dragon-pulse"],[36,"flamethrower"],[48,"cosmic-power"],[60,"recover"],[72,"ancient-power"]],
"A sky-skeleton of endless energy. The darkest day, personified.","serpent",890,["#5a2a6a","#2e1a3a","#e33e5a"]);
LEG("kubfu","Kubfu",891,["Fighting"],[60,90,60,53,50,72],"Inner Focus",45,
[[1,"brick-break"],[12,"iron-head"],[24,"bulk-up"]],
"A tiny martial artist. Trains on mountains. Very earnest.","biped",891,["#e8e8d0","#8a8a6a","#4a4a4a"]);
S.kubfu.evo = [{to:"urshifu",by:"level",at:50}];
LEG("urshifu","Urshifu",892,["Fighting","Water"],[100,130,100,63,60,97],"Unseen Fist",3,
[[1,"surging-strikes"],[1,"wicked-blow"],[24,"close-combat"],[36,"iron-head"],[48,"bulk-up"]],
"Master of two styles. Picks one. Judges you for asking.","humanoid",892,["#e8e8d0","#4a4a4a","#4fa8ff"]);
LEG("zarude","Zarude",893,["Dark","Grass"],[105,120,105,70,95,105],"Leaf Guard",3,
[[1,"seed-bomb"],[1,"crunch"],[24,"close-combat"],[36,"bulk-up"],[48,"dark-pulse"]],
"A rogue jungle mythical. Raises orphans. Fights poachers. Legend.","biped",893,["#3d5a3a","#2e4a2e","#f2b8d0"],"mythical");
LEG("regieleki","Regieleki",894,["Electric"],[80,100,50,100,50,200],"Transistor",3,
[[1,"thunderbolt"],[1,"thunder"],[24,"ancient-power"],[36,"thunder-wave"],[48,"agility"],[60,"wild-charge"]],
"A golem of pure voltage. Fastest thing alive. Probably.","blob",894,["#f5d742","#2b2b33","#ff8c42"]);
LEG("regidrago","Regidrago",895,["Dragon"],[200,100,50,100,50,80],"Dragon's Maw",3,
[[1,"dragon-pulse"],[1,"outrage"],[24,"ancient-power"],[36,"crunch"]],
"A golem of dragon energy. Its head is a cannon. Obviously.","serpent",895,["#c8352e","#8a2420","#f5d742"]);
LEG("glastrier","Glastrier",896,["Ice"],[100,145,130,65,110,30],"Chilling Neigh",3,
[[1,"glacial-lance"],[1,"icicle-spear"],[24,"close-combat"],[36,"ancient-power"]],
"An ice horse of unstoppable charges. Neighs avalanches.","quad",896,["#7dd8f2","#4a9ec2","#e8f8ff"]);
LEG("spectrier","Spectrier",897,["Ghost"],[100,65,60,145,80,130],"Grim Neigh",3,
[[1,"shadow-ball"],[1,"psychic"],[24,"nasty-plot"],[36,"agility"]],
"A ghost horse that feeds on fear. Gallops through nightmares.","quad",897,["#2b2b33","#5a4a7a","#e8e8f2"]);
LEG("calyrex","Calyrex",898,["Psychic","Grass"],[100,80,80,80,80,80],"Unnerve",3,
[[1,"psychic"],[1,"energy-ball"],[24,"ancient-power"],[36,"calm-mind"]],
"A tiny king who once ruled Galar. Still expects the crown treatment.","humanoid",898,["#4a9e5a","#2e6b3a","#c9a227"]);
LEG("enamorus","Enamorus",905,["Fairy","Flying"],[74,115,70,135,80,106],"Contrary",3,
[[1,"moonblast"],[1,"hurricane"],[24,"psychic"],[36,"calm-mind"]],
"A herald of spring. Or spite. Depends on the day.","winged",905,["#f2b8d0","#e08ab0","#7d5ac2"],"mythical");

/* ===== Gen 9 ===== */
LEG("koraidon","Koraidon",1007,["Fighting","Dragon"],[100,135,115,85,100,135],"Orichalcum Pulse",3,
[[1,"collision-course"],[1,"outrage"],[24,"flare-blitz"],[36,"close-combat"],[48,"bulk-up"],[60,"ancient-power"]],
"The winged king of the past. Eats sandwiches. Fights paradoxes.","winged",1007,["#c8352e","#f2e0a8","#7df9ff"]);
LEG("miraidon","Miraidon",1008,["Electric","Dragon"],[100,85,100,135,115,135],"Hadron Engine",3,
[[1,"electro-drift"],[1,"draco-meteor"],[24,"thunderbolt"],[36,"calm-mind"],[48,"ancient-power"]],
"The iron serpent of the future. Runs on data. And sandwiches.","serpent",1008,["#7d5ac2","#4a3a7a","#f5d742"]);
LEG("wo-chien","Wo-Chien",1001,["Dark","Grass"],[85,85,100,95,135,70],"Tablets of Ruin",3,
[[1,"dark-pulse"],[1,"energy-ball"],[24,"ancient-power"],[36,"nasty-plot"]],
"A grudge given leaves. Drains forests to feed old spite.","quad",1001,["#3d5a3a","#2e4a2e","#c9a227"]);
LEG("chien-pao","Chien-Pao",1002,["Dark","Ice"],[80,120,100,90,65,135],"Sword of Ruin",3,
[[1,"icicle-spear"],[1,"crunch"],[24,"sacred-sword"],[36,"sucker-punch"]],
"A hatred given fangs. Slides through blizzards it summoned.","quad",1002,["#7dd8f2","#4a9ec2","#2b2b33"]);
LEG("ting-lu","Ting-Lu",1003,["Dark","Ground"],[155,110,125,55,80,45],"Vessel of Ruin",3,
[[1,"earthquake"],[1,"dark-pulse"],[24,"stone-edge"],[36,"ancient-power"]],
"A fear given a vessel. Its footsteps crack the earth open.","quad",1003,["#8a6a4a","#5a4632","#c9a227"]);
LEG("chi-yu","Chi-Yu",1004,["Dark","Fire"],[55,80,80,135,120,100],"Beads of Ruin",3,
[[1,"flamethrower"],[1,"dark-pulse"],[24,"nasty-plot"],[36,"ancient-power"]],
"An envy given flame. Burns at 3000 degrees. Petty, too.","fish",1004,["#c8352e","#f5d742","#2b2b33"]);
LEG("ogerpon","Ogerpon",1017,["Grass"],[80,120,84,60,96,110],"Defiant",3,
[[1,"ivy-cudgel"],[1,"seed-bomb"],[24,"superpower"],[36,"swords-dance"]],
"A masked ogre with a heart of gold. Misunderstood. Club first.","humanoid",1017,["#4a9e35","#2e6b3a","#e8a83e"]);
LEG("terapagos","Terapagos",1024,["Normal"],[90,65,85,105,110,60],"Tera Shift",3,
[[1,"ancient-power"],[1,"earth-power"],[24,"calm-mind"],[36,"hyper-voice"],[48,"tri-attack"]],
"A turtle carrying every type. The world's most defensive tortoise.","quad",1024,["#7dd8f2","#4a9ec2","#f2e0a8"]);
LEG("pecharunt","Pecharunt",1025,["Poison","Ghost"],[88,88,160,88,88,88],"Poison Puppeteer",3,
[[1,"malignant-chain"],[1,"shadow-ball"],[24,"nasty-plot"],[36,"recover"]],
"A mochi-obsessed puppet master. Controls minds with sweets.","ghostly",1025,["#7d5ac2","#4a3a7a","#f2b8d0"],"mythical");

/* quick data sanity: every levelMoves id must exist in MOVES */
var bad = [];
Object.keys(G.Data.SPECIES).forEach(function(id){
  var s = G.Data.SPECIES[id];
  (s.levelMoves||[]).forEach(function(lm){
    if(!G.Data.MOVES[lm[1]]) bad.push(id+":"+lm[1]);
  });
  (s.evo||[]).forEach(function(e){
    if(e.by==="stone" && !G.Data.ITEMS[e.item]) bad.push(id+":item:"+e.item);
  });
});
G.Data._moveRefErrors = bad;

/* ===== Regulars: late additions (gym teams reference these) ===== */
var S = G.Data.SPECIES;
function sp(o){ o.anime = !!o.anime; o.fuseable = (o.fuseable !== false); S[o.id] = o; }
sp({id:"electrike",name:"Electrike",dex:309,cat:"regular",types:["Electric"],base:{hp:40,atk:45,def:40,spa:65,spd:40,spe:65},abilities:["Static"],catchRate:120,
levelMoves:[[1,"tackle"],[1,"thunder-shock"],[8,"thunder-wave"],[16,"bite"],[24,"thunderbolt"]],
evo:[{to:"manectric",by:"level",at:26}],sprite:{shape:"quad",seed:309,pal:["#4a9e5a","#2e6b3a","#f5d742"]},
flavor:"Stores static in its mane. Shocks first, asks never."});
sp({id:"manectric",name:"Manectric",dex:310,cat:"regular",types:["Electric"],base:{hp:70,atk:75,def:60,spa:105,spd:80,spe:105},abilities:["Static"],catchRate:45,
levelMoves:[[1,"thunderbolt"],[1,"bite"],[30,"thunder"],[38,"wild-charge"],[46,"agility"],[54,"thunder-wave"]],
evo:[],sprite:{shape:"quad",seed:310,pal:["#3d8a4a","#1e5c2e","#f5d742","#2b2b33"]},
flavor:"Discharges lightning from its mane. Thunder follows it like a fan club."});
sp({id:"shroomish",name:"Shroomish",dex:285,cat:"regular",types:["Grass"],base:{hp:60,atk:40,def:60,spa:40,spd:60,spe:35},abilities:["Effect Spore"],catchRate:255,
levelMoves:[[1,"tackle"],[8,"poison-powder"],[14,"stun-spore"],[20,"seed-bomb"]],
evo:[{to:"breloom",by:"level",at:23}],sprite:{shape:"blob",seed:285,pal:["#c9a86a","#8a6a3a","#e33e2b"]},
flavor:"A grumpy mushroom. Sprays spores when startled. Startles easily."});
sp({id:"breloom",name:"Breloom",dex:286,cat:"regular",types:["Grass","Fighting"],base:{hp:60,atk:130,def:80,spa:60,spd:60,spe:70},abilities:["Effect Spore"],catchRate:90,
levelMoves:[[1,"seed-bomb"],[1,"mach-punch"],[28,"brick-break"],[36,"close-combat"],[44,"sleep-powder"],[52,"bulk-up"]],
evo:[],sprite:{shape:"humanoid",seed:286,pal:["#c9a86a","#8a6a3a","#e33e2b","#4a9e35"]},
flavor:"A boxing mushroom. Its punches are technically spores. Tell that to your jaw."});

/* ===== Roster expansion: every Infinite Fusion 1 (Kanto/Johto) + 2 Hoenn regular, dex 1-386 ===== */
var S = G.Data.SPECIES;
function sp(o){ o.anime = !!o.anime; o.fuseable = (o.fuseable !== false); S[o.id] = o; }
sp({id:"caterpie",name:"Caterpie",dex:10,cat:"regular",types:["Bug"],base:{hp:45,atk:30,def:35,spa:20,spd:20,spe:45},abilities:["Shield Dust"],catchRate:255,
levelMoves:[[1,"tackle"],[1,"leer"],[9,"bug-bite"]],
evo:[{to:"metapod",by:"level",at:7}],sprite:{shape:"insect",seed:10,pal:["#7dc24a","#4a8a2e","#2e5c1e"]},
flavor:"Eats leaves faster than you can blink. Blink slower.",fuseable:true});
sp({id:"metapod",name:"Metapod",dex:11,cat:"regular",types:["Bug"],base:{hp:50,atk:20,def:55,spa:25,spd:25,spe:30},abilities:["Shed Skin"],catchRate:120,
levelMoves:[[1,"tackle"],[1,"leer"],[7,"iron-defense"]],
evo:[{to:"butterfree",by:"level",at:10}],sprite:{shape:"insect",seed:11,pal:["#4a8a2e","#2e5c1e","#7dc24a"]},
flavor:"A green sleeping bag with commitment issues. Do not shake.",fuseable:true});
sp({id:"butterfree",name:"Butterfree",dex:12,cat:"regular",types:["Bug","Flying"],base:{hp:60,atk:45,def:50,spa:90,spd:80,spe:70},abilities:["Compound Eyes"],catchRate:45,
levelMoves:[[1,"tackle"],[10,"sleep-powder"],[14,"stun-spore"],[20,"psybeam"],[28,"bug-buzz"],[34,"air-slash"],[42,"quiver-dance"]],
evo:[],sprite:{shape:"winged",seed:12,pal:["#8a5ac2","#e8e8f2","#5a3a8a"]},
flavor:"Scales shed sleeping powder. Apologizes. Does it again.",fuseable:true});
sp({id:"weedle",name:"Weedle",dex:13,cat:"regular",types:["Bug","Poison"],base:{hp:40,atk:35,def:30,spa:20,spd:20,spe:50},abilities:["Shield Dust"],catchRate:255,
levelMoves:[[1,"tackle"],[1,"leer"],[9,"poison-jab"]],
evo:[{to:"kakuna",by:"level",at:7}],sprite:{shape:"insect",seed:13,pal:["#c98a3a","#8a5c1e","#5c3a0e"]},
flavor:"The stinger is loaded. The attitude is loaded. Everything is loaded.",fuseable:true});
sp({id:"kakuna",name:"Kakuna",dex:14,cat:"regular",types:["Bug","Poison"],base:{hp:45,atk:25,def:50,spa:25,spd:25,spe:35},abilities:["Shed Skin"],catchRate:120,
levelMoves:[[1,"tackle"],[1,"leer"],[7,"iron-defense"]],
evo:[{to:"beedrill",by:"level",at:10}],sprite:{shape:"insect",seed:14,pal:["#c98a3a","#5c3a0e","#8a5c1e"]},
flavor:"Yellow. Still. Plotting.",fuseable:true});
sp({id:"beedrill",name:"Beedrill",dex:15,cat:"regular",types:["Bug","Poison"],base:{hp:65,atk:90,def:40,spa:45,spd:80,spe:75},abilities:["Swarm"],catchRate:45,
levelMoves:[[1,"poison-jab"],[12,"bug-bite"],[20,"x-scissor"],[28,"agility"],[36,"cross-poison"],[44,"swords-dance"]],
evo:[],sprite:{shape:"winged",seed:15,pal:["#e8c83a","#3a3a3a","#8a6a1e"]},
flavor:"Three drills, zero patience. The swarm has opinions.",fuseable:true});
sp({id:"pidgey",name:"Pidgey",dex:16,cat:"regular",types:["Normal","Flying"],base:{hp:40,atk:45,def:40,spa:35,spd:35,spe:56},abilities:["Keen Eye"],catchRate:255,
levelMoves:[[1,"tackle"],[1,"leer"],[9,"quick-attack"],[13,"wing-attack"]],
evo:[{to:"pidgeotto",by:"level",at:18}],sprite:{shape:"bird",seed:16,pal:["#8a6a4a","#5c422e","#e8d8b8"]},
flavor:"Gusts sand in your face, then acts innocent. Classic.",fuseable:true});
sp({id:"pidgeotto",name:"Pidgeotto",dex:17,cat:"regular",types:["Normal","Flying"],base:{hp:63,atk:60,def:55,spa:50,spd:50,spe:71},abilities:["Keen Eye"],catchRate:120,
levelMoves:[[1,"quick-attack"],[1,"leer"],[18,"wing-attack"],[24,"aerial-ace"],[30,"agility"]],
evo:[{to:"pidgeot",by:"level",at:36}],sprite:{shape:"bird",seed:17,pal:["#8a6a4a","#5c422e","#e8d8b8","#c22e2e"]},
flavor:"Patrols a huge territory. Trespassers get the talons.",fuseable:true});
sp({id:"pidgeot",name:"Pidgeot",dex:18,cat:"regular",types:["Normal","Flying"],base:{hp:83,atk:80,def:75,spa:70,spd:70,spe:101},abilities:["Keen Eye"],catchRate:45,
levelMoves:[[1,"wing-attack"],[36,"aerial-ace"],[42,"agility"],[48,"hurricane"],[54,"brave-bird"]],
evo:[],sprite:{shape:"bird",seed:18,pal:["#8a6a4a","#c22e2e","#e8d8b8","#5c422e"]},
flavor:"Its crest feathers sense air currents. And drama.",fuseable:true});
sp({id:"rattata",name:"Rattata",dex:19,cat:"regular",types:["Normal"],base:{hp:30,atk:56,def:35,spa:25,spd:35,spe:72},abilities:["Run Away"],catchRate:255,
levelMoves:[[1,"tackle"],[1,"tail-whip"],[7,"quick-attack"],[13,"bite"],[20,"crunch"]],
evo:[{to:"raticate",by:"level",at:20}],sprite:{shape:"quad",seed:19,pal:["#9a6ac2","#6a4a8a","#e8d8f2"]},
flavor:"Chews through anything. Including your plans.",fuseable:true});
sp({id:"raticate",name:"Raticate",dex:20,cat:"regular",types:["Normal"],base:{hp:55,atk:81,def:60,spa:50,spd:70,spe:97},abilities:["Run Away"],catchRate:127,
levelMoves:[[1,"quick-attack"],[1,"leer"],[20,"bite"],[27,"crunch"],[34,"double-edge"],[41,"swords-dance"]],
evo:[],sprite:{shape:"quad",seed:20,pal:["#9a6ac2","#6a4a8a","#e8d8f2"]},
flavor:"Teeth never stop growing. Neither does its appetite.",fuseable:true});
sp({id:"spearow",name:"Spearow",dex:21,cat:"regular",types:["Normal","Flying"],base:{hp:40,atk:60,def:30,spa:31,spd:31,spe:70},abilities:["Keen Eye"],catchRate:255,
levelMoves:[[1,"peck"],[1,"leer"],[9,"quick-attack"],[13,"aerial-ace"]],
evo:[{to:"fearow",by:"level",at:20}],sprite:{shape:"bird",seed:21,pal:["#a88a5c","#6e5a3a","#e8d8b8"]},
flavor:"Flaps weakly. Screeches strongly. Priorities.",fuseable:true});
sp({id:"fearow",name:"Fearow",dex:22,cat:"regular",types:["Normal","Flying"],base:{hp:65,atk:90,def:65,spa:61,spd:61,spe:100},abilities:["Keen Eye"],catchRate:90,
levelMoves:[[1,"peck"],[20,"drill-peck"],[27,"aerial-ace"],[34,"agility"],[41,"brave-bird"]],
evo:[],sprite:{shape:"bird",seed:22,pal:["#a88a5c","#6e5a3a","#e8d8b8"]},
flavor:"Its long neck strikes like a spear. The beak helps too.",fuseable:true});
sp({id:"ekans",name:"Ekans",dex:23,cat:"regular",types:["Poison"],base:{hp:35,atk:60,def:44,spa:40,spd:54,spe:55},abilities:["Intimidate"],catchRate:255,
levelMoves:[[1,"tackle"],[1,"leer"],[9,"poison-jab"],[17,"bite"],[25,"toxic"]],
evo:[{to:"arbok",by:"level",at:22}],sprite:{shape:"serpent",seed:23,pal:["#8a5ac2","#5c3a8a","#e8c83a"]},
flavor:"Swallows prey whole. Regrets nothing.",fuseable:true});
sp({id:"arbok",name:"Arbok",dex:24,cat:"regular",types:["Poison"],base:{hp:60,atk:95,def:69,spa:65,spd:79,spe:80},abilities:["Intimidate"],catchRate:90,
levelMoves:[[1,"poison-jab"],[22,"bite"],[30,"crunch"],[38,"sludge-bomb"],[46,"toxic"]],
evo:[],sprite:{shape:"serpent",seed:24,pal:["#8a5ac2","#5c3a8a","#e8c83a"]},
flavor:"The pattern on its chest changes by region. The menace does not.",fuseable:true});
sp({id:"raichu",name:"Raichu",dex:26,cat:"regular",types:["Electric"],base:{hp:60,atk:90,def:55,spa:90,spd:80,spe:110},abilities:["Static"],catchRate:75,
levelMoves:[[1,"thunder-shock"],[1,"quick-attack"],[26,"thunderbolt"],[34,"thunder"],[42,"brick-break"],[50,"agility"]],
evo:[],sprite:{shape:"quad",seed:26,pal:["#e89a2e","#b86a1e","#e8e8f2"]},
flavor:"Discharges stored electricity through its cheeks. Do not boop.",fuseable:true});
sp({id:"sandshrew",name:"Sandshrew",dex:27,cat:"regular",types:["Ground"],base:{hp:50,atk:75,def:85,spa:20,spd:30,spe:40},abilities:["Sand Veil"],catchRate:255,
levelMoves:[[1,"scratch"],[1,"leer"],[9,"rock-throw"],[17,"slash"],[25,"earthquake"]],
evo:[{to:"sandslash",by:"level",at:22}],sprite:{shape:"quad",seed:27,pal:["#d8b86a","#a88a4a","#6e5a2e"]},
flavor:"Curls into a spiky ball when scared. Or bored. Or Tuesday.",fuseable:true});
sp({id:"sandslash",name:"Sandslash",dex:28,cat:"regular",types:["Ground"],base:{hp:75,atk:100,def:110,spa:45,spd:55,spe:65},abilities:["Sand Veil"],catchRate:90,
levelMoves:[[1,"scratch"],[22,"rock-slide"],[29,"slash"],[36,"earthquake"],[43,"swords-dance"]],
evo:[],sprite:{shape:"quad",seed:28,pal:["#d8b86a","#a88a4a","#6e5a2e"]},
flavor:"Its spikes shed and regrow yearly. Vacuum salesmen fear it.",fuseable:true});
sp({id:"nidoran-f",name:"Nidoran F",dex:29,cat:"regular",types:["Poison"],base:{hp:55,atk:47,def:52,spa:40,spd:40,spe:41},abilities:["Poison Point"],catchRate:235,
levelMoves:[[1,"scratch"],[1,"leer"],[9,"poison-powder"],[17,"bite"],[25,"toxic"]],
evo:[{to:"nidorina",by:"level",at:16}],sprite:{shape:"quad",seed:29,pal:["#7d9ed8","#4a6ea8","#e8f0ff"]},
flavor:"Small, blue, and already judging your life choices.",fuseable:true});
sp({id:"nidorina",name:"Nidorina",dex:30,cat:"regular",types:["Poison"],base:{hp:70,atk:62,def:67,spa:55,spd:55,spe:56},abilities:["Poison Point"],catchRate:120,
levelMoves:[[1,"scratch"],[16,"poison-jab"],[24,"bite"],[32,"toxic"],[40,"sludge-bomb"]],
evo:[{to:"nidoqueen",by:"stone",item:"moon-stone"}],sprite:{shape:"quad",seed:30,pal:["#7d9ed8","#4a6ea8","#e8f0ff"]},
flavor:"Gentle until provoked. Then extremely not gentle.",fuseable:true});
sp({id:"nidoqueen",name:"Nidoqueen",dex:31,cat:"regular",types:["Poison","Ground"],base:{hp:90,atk:92,def:87,spa:75,spd:85,spe:76},abilities:["Poison Point"],catchRate:45,
levelMoves:[[1,"poison-jab"],[1,"leer"],[32,"earthquake"],[40,"crunch"],[48,"sludge-bomb"],[56,"superpower"]],
evo:[],sprite:{shape:"quad",seed:31,pal:["#4a6ea8","#2e4a78","#7d9ed8"]},
flavor:"Shields its young with a toxin-laced body. Supermom.",fuseable:true});
sp({id:"nidoran-m",name:"Nidoran M",dex:32,cat:"regular",types:["Poison"],base:{hp:46,atk:57,def:40,spa:40,spd:40,spe:50},abilities:["Poison Point"],catchRate:235,
levelMoves:[[1,"tackle"],[1,"leer"],[9,"poison-powder"],[17,"bite"],[25,"toxic"]],
evo:[{to:"nidorino",by:"level",at:16}],sprite:{shape:"quad",seed:32,pal:["#b87dd8","#7a4aa8","#f0e8ff"]},
flavor:"Its horn oozes venom. Its confidence oozes more.",fuseable:true});
sp({id:"nidorino",name:"Nidorino",dex:33,cat:"regular",types:["Poison"],base:{hp:61,atk:72,def:57,spa:55,spd:55,spe:65},abilities:["Poison Point"],catchRate:120,
levelMoves:[[1,"tackle"],[16,"poison-jab"],[24,"bite"],[32,"toxic"],[40,"sludge-bomb"]],
evo:[{to:"nidoking",by:"stone",item:"moon-stone"}],sprite:{shape:"quad",seed:33,pal:["#b87dd8","#7a4aa8","#f0e8ff"]},
flavor:"Stabs with its horn first, asks questions never.",fuseable:true});
sp({id:"nidoking",name:"Nidoking",dex:34,cat:"regular",types:["Poison","Ground"],base:{hp:81,atk:102,def:77,spa:85,spd:75,spe:85},abilities:["Poison Point"],catchRate:45,
levelMoves:[[1,"poison-jab"],[1,"leer"],[32,"earthquake"],[40,"brick-break"],[48,"sludge-bomb"],[56,"earth-power"]],
evo:[],sprite:{shape:"quad",seed:34,pal:["#7a4aa8","#4a2a78","#b87dd8"]},
flavor:"Its tail can topple buildings. Its roar can topple eardrums.",fuseable:true});
sp({id:"clefairy",name:"Clefairy",dex:35,cat:"regular",types:["Fairy"],base:{hp:70,atk:45,def:48,spa:60,spd:65,spe:35},abilities:["Cute Charm"],catchRate:150,
levelMoves:[[1,"pound"],[1,"growl"],[8,"sing"],[16,"dazzling-gleam"],[24,"moonblast"]],
evo:[{to:"clefable",by:"stone",item:"moon-stone"}],sprite:{shape:"blob",seed:35,pal:["#f2b8d8","#d88ab8","#fff0f8"]},
flavor:"Dances under full moons. The moon approves.",fuseable:true});
sp({id:"clefable",name:"Clefable",dex:36,cat:"regular",types:["Fairy"],base:{hp:95,atk:70,def:73,spa:95,spd:90,spe:60},abilities:["Cute Charm"],catchRate:25,
levelMoves:[[1,"pound"],[1,"sing"],[24,"moonblast"],[32,"dazzling-gleam"],[40,"recover"],[48,"calm-mind"]],
evo:[],sprite:{shape:"blob",seed:36,pal:["#f2b8d8","#d88ab8","#fff0f8"]},
flavor:"Extremely timid. Extremely powerful. Pick one to notice.",fuseable:true});
sp({id:"vulpix",name:"Vulpix",dex:37,cat:"regular",types:["Fire"],base:{hp:38,atk:41,def:40,spa:50,spd:65,spe:65},abilities:["Flash Fire"],catchRate:190,
levelMoves:[[1,"ember"],[1,"tail-whip"],[9,"quick-attack"],[17,"will-o-wisp"],[25,"flamethrower"]],
evo:[{to:"ninetales",by:"stone",item:"fire-stone"}],sprite:{shape:"quad",seed:37,pal:["#e89a3a","#b86a1e","#fff0d8"]},
flavor:"Six tails, all of them plotting something warm.",fuseable:true});
sp({id:"ninetales",name:"Ninetales",dex:38,cat:"regular",types:["Fire"],base:{hp:73,atk:76,def:75,spa:81,spd:100,spe:100},abilities:["Flash Fire"],catchRate:75,
levelMoves:[[1,"ember"],[1,"quick-attack"],[24,"flamethrower"],[32,"will-o-wisp"],[40,"fire-blast"],[48,"agility"]],
evo:[],sprite:{shape:"quad",seed:38,pal:["#f2e8b8","#d8c88a","#fff8e0"]},
flavor:"Legends say it curses for a thousand years. Worth the wait.",fuseable:true});
sp({id:"jigglypuff",name:"Jigglypuff",dex:39,cat:"regular",types:["Normal","Fairy"],base:{hp:115,atk:45,def:20,spa:45,spd:25,spe:20},abilities:["Cute Charm"],catchRate:170,
levelMoves:[[1,"pound"],[1,"sing"],[12,"dazzling-gleam"],[20,"body-slam"],[28,"hyper-voice"]],
evo:[{to:"wigglytuff",by:"stone",item:"moon-stone"}],sprite:{shape:"blob",seed:39,pal:["#f2a8c8","#d878a8","#ffe8f2"]},
flavor:"Sings you to sleep, then draws on your face. Rude. Iconic.",fuseable:true});
sp({id:"wigglytuff",name:"Wigglytuff",dex:40,cat:"regular",types:["Normal","Fairy"],base:{hp:140,atk:70,def:45,spa:85,spd:50,spe:45},abilities:["Cute Charm"],catchRate:50,
levelMoves:[[1,"pound"],[1,"sing"],[28,"hyper-voice"],[36,"moonblast"],[44,"body-slam"],[52,"rest"]],
evo:[],sprite:{shape:"blob",seed:40,pal:["#f2a8c8","#d878a8","#ffe8f2"]},
flavor:"Its fur is the softest thing known to science. Peer reviewed.",fuseable:true});
sp({id:"zubat",name:"Zubat",dex:41,cat:"regular",types:["Poison","Flying"],base:{hp:40,atk:45,def:35,spa:30,spd:40,spe:55},abilities:["Inner Focus"],catchRate:255,
levelMoves:[[1,"tackle"],[1,"leer"],[9,"bite"],[17,"wing-attack"],[25,"toxic"]],
evo:[{to:"golbat",by:"level",at:22}],sprite:{shape:"winged",seed:41,pal:["#5a6ac2","#3a4a8a","#b8c2f2"]},
flavor:"No eyes, no problem. Echolocates your snacks.",fuseable:true});
sp({id:"golbat",name:"Golbat",dex:42,cat:"regular",types:["Poison","Flying"],base:{hp:75,atk:80,def:70,spa:65,spd:75,spe:90},abilities:["Inner Focus"],catchRate:90,
levelMoves:[[1,"bite"],[22,"wing-attack"],[30,"air-slash"],[38,"toxic"],[46,"crunch"]],
evo:[{to:"crobat",by:"level",at:40}],sprite:{shape:"winged",seed:42,pal:["#5a6ac2","#3a4a8a","#b8c2f2"]},
flavor:"Its fangs pierce steel. Its friendship pierces hearts. Weird combo.",fuseable:true});
sp({id:"oddish",name:"Oddish",dex:43,cat:"regular",types:["Grass","Poison"],base:{hp:45,atk:50,def:55,spa:75,spd:65,spe:30},abilities:["Chlorophyll"],catchRate:255,
levelMoves:[[1,"tackle"],[1,"leer"],[9,"sleep-powder"],[15,"stun-spore"],[21,"razor-leaf"]],
evo:[{to:"gloom",by:"level",at:21}],sprite:{shape:"blob",seed:43,pal:["#4a7dc2","#2e5c8a","#7dc24a"]},
flavor:"A walking weed with dreams. Mostly of sunlight.",fuseable:true});
sp({id:"gloom",name:"Gloom",dex:44,cat:"regular",types:["Grass","Poison"],base:{hp:60,atk:65,def:70,spa:85,spd:75,spe:40},abilities:["Chlorophyll"],catchRate:120,
levelMoves:[[1,"sleep-powder"],[21,"razor-leaf"],[28,"sludge-bomb"],[36,"toxic"],[44,"growth"]],
evo:[{to:"vileplume",by:"stone",item:"leaf-stone"},{to:"bellossom",by:"stone",item:"sun-stone"}],sprite:{shape:"blob",seed:44,pal:["#8a5a2e","#5c3a1e","#c24a3a"]},
flavor:"Drools honey that smells awful. The worst of both worlds.",fuseable:true});
sp({id:"vileplume",name:"Vileplume",dex:45,cat:"regular",types:["Grass","Poison"],base:{hp:75,atk:80,def:85,spa:110,spd:90,spe:50},abilities:["Chlorophyll"],catchRate:45,
levelMoves:[[1,"sleep-powder"],[1,"leer"],[32,"solar-beam"],[40,"sludge-bomb"],[48,"energy-ball"],[56,"stun-spore"]],
evo:[],sprite:{shape:"blob",seed:45,pal:["#c23a3a","#8a2a2a","#e87d5a"]},
flavor:"The world's largest petal. Also the world's loudest sneeze.",fuseable:true});
sp({id:"paras",name:"Paras",dex:46,cat:"regular",types:["Bug","Grass"],base:{hp:35,atk:70,def:55,spa:45,spd:55,spe:25},abilities:["Effect Spore"],catchRate:190,
levelMoves:[[1,"scratch"],[1,"leer"],[9,"sleep-powder"],[17,"bug-bite"],[25,"seed-bomb"]],
evo:[{to:"parasect",by:"level",at:24}],sprite:{shape:"insect",seed:46,pal:["#e87d3a","#b85a1e","#f2c88a"]},
flavor:"The mushrooms are in charge. The bug is just transport.",fuseable:true});
sp({id:"parasect",name:"Parasect",dex:47,cat:"regular",types:["Bug","Grass"],base:{hp:60,atk:95,def:80,spa:60,spd:80,spe:30},abilities:["Effect Spore"],catchRate:75,
levelMoves:[[1,"bug-bite"],[24,"seed-bomb"],[32,"slash"],[40,"toxic"],[48,"x-scissor"]],
evo:[],sprite:{shape:"insect",seed:47,pal:["#e87d3a","#b85a1e","#f2c88a"]},
flavor:"The mushroom won. It always wins.",fuseable:true});
sp({id:"venonat",name:"Venonat",dex:48,cat:"regular",types:["Bug","Poison"],base:{hp:60,atk:55,def:50,spa:40,spd:55,spe:45},abilities:["Compound Eyes"],catchRate:190,
levelMoves:[[1,"tackle"],[1,"leer"],[9,"sleep-powder"],[17,"psybeam"],[25,"bug-bite"]],
evo:[{to:"venomoth",by:"level",at:31}],sprite:{shape:"insect",seed:48,pal:["#8a5ac2","#5c3a8a","#e83a5a"]},
flavor:"Its eyes are radar dishes. Its hobbies are secrets.",fuseable:true});
sp({id:"venomoth",name:"Venomoth",dex:49,cat:"regular",types:["Bug","Poison"],base:{hp:70,atk:65,def:60,spa:90,spd:75,spe:90},abilities:["Shield Dust"],catchRate:75,
levelMoves:[[1,"sleep-powder"],[31,"psybeam"],[38,"bug-buzz"],[46,"toxic"],[54,"quiver-dance"]],
evo:[],sprite:{shape:"winged",seed:49,pal:["#8a5ac2","#5c3a8a","#e8b83a"]},
flavor:"Wing scales scatter toxic dust. Also glitter. Mostly toxic.",fuseable:true});
sp({id:"diglett",name:"Diglett",dex:50,cat:"regular",types:["Ground"],base:{hp:10,atk:55,def:25,spa:35,spd:45,spe:90},abilities:["Sand Veil"],catchRate:255,
levelMoves:[[1,"scratch"],[1,"leer"],[9,"rock-throw"],[17,"slash"],[25,"earthquake"]],
evo:[{to:"dugtrio",by:"level",at:26}],sprite:{shape:"blob",seed:50,pal:["#a87848","#7a5230","#e8c88a"]},
flavor:"Just a nose and a dream. The dream is dirt.",fuseable:true});
sp({id:"dugtrio",name:"Dugtrio",dex:51,cat:"regular",types:["Ground"],base:{hp:35,atk:100,def:50,spa:50,spd:70,spe:120},abilities:["Sand Veil"],catchRate:50,
levelMoves:[[1,"scratch"],[26,"rock-slide"],[33,"slash"],[40,"earthquake"],[47,"swords-dance"]],
evo:[],sprite:{shape:"blob",seed:51,pal:["#a87848","#7a5230","#e8c88a"]},
flavor:"Three noses, one mind. Arguably.",fuseable:true});
sp({id:"meowth",name:"Meowth",dex:52,cat:"regular",types:["Normal"],base:{hp:40,atk:45,def:35,spa:40,spd:40,spe:90},abilities:["Pickup"],catchRate:255,
levelMoves:[[1,"scratch"],[1,"leer"],[9,"bite"],[17,"slash"],[25,"nasty-plot"]],
evo:[{to:"persian",by:"level",at:28}],sprite:{shape:"quad",seed:52,pal:["#e8d8a8","#b8a878","#8a6a3a"]},
flavor:"Loves coins. Steals coins. Is, spiritually, a coin.",fuseable:true});
sp({id:"persian",name:"Persian",dex:53,cat:"regular",types:["Normal"],base:{hp:65,atk:70,def:60,spa:65,spd:65,spe:115},abilities:["Limber"],catchRate:90,
levelMoves:[[1,"scratch"],[28,"bite"],[35,"slash"],[42,"nasty-plot"],[49,"night-slash"]],
evo:[],sprite:{shape:"quad",seed:53,pal:["#e8d8a8","#b8a878","#8a6a3a"]},
flavor:"The jewel on its forehead is real. The attitude is realer.",fuseable:true});
sp({id:"psyduck",name:"Psyduck",dex:54,cat:"regular",types:["Water"],base:{hp:50,atk:52,def:48,spa:65,spd:50,spe:55},abilities:["Damp"],catchRate:190,
levelMoves:[[1,"scratch"],[1,"leer"],[9,"water-gun"],[17,"psybeam"],[25,"amnesia"]],
evo:[{to:"golduck",by:"level",at:33}],sprite:{shape:"biped",seed:54,pal:["#e8c83a","#b8941e","#fff2b8"]},
flavor:"Constant headache. Occasionally weaponizes it.",fuseable:true});
sp({id:"golduck",name:"Golduck",dex:55,cat:"regular",types:["Water"],base:{hp:80,atk:82,def:78,spa:95,spd:80,spe:85},abilities:["Damp"],catchRate:75,
levelMoves:[[1,"water-gun"],[33,"psybeam"],[40,"surf"],[48,"amnesia"],[56,"hydro-pump"]],
evo:[],sprite:{shape:"biped",seed:55,pal:["#4a7dc2","#2e5c8a","#b8d8f2"]},
flavor:"Swims like an Olympian. Thinks like one too, sadly.",fuseable:true});
sp({id:"mankey",name:"Mankey",dex:56,cat:"regular",types:["Fighting"],base:{hp:40,atk:80,def:35,spa:35,spd:45,spe:70},abilities:["Vital Spirit"],catchRate:190,
levelMoves:[[1,"scratch"],[1,"leer"],[9,"karate-chop"],[17,"brick-break"],[25,"bulk-up"]],
evo:[{to:"primeape",by:"level",at:28}],sprite:{shape:"biped",seed:56,pal:["#d8b878","#a88a4a","#f2e8c8"]},
flavor:"Angry about everything. Especially mornings.",fuseable:true});
sp({id:"primeape",name:"Primeape",dex:57,cat:"regular",types:["Fighting"],base:{hp:65,atk:105,def:60,spa:60,spd:70,spe:95},abilities:["Vital Spirit"],catchRate:75,
levelMoves:[[1,"karate-chop"],[28,"brick-break"],[35,"cross-chop"],[42,"bulk-up"],[49,"close-combat"]],
evo:[],sprite:{shape:"biped",seed:57,pal:["#d8b878","#a88a4a","#f2e8c8"]},
flavor:"Calms down only in sleep. Do not wake it. Ever.",fuseable:true});
sp({id:"growlithe",name:"Growlithe",dex:58,cat:"regular",types:["Fire"],base:{hp:55,atk:70,def:45,spa:70,spd:50,spe:60},abilities:["Intimidate"],catchRate:190,
levelMoves:[[1,"tackle"],[1,"leer"],[9,"ember"],[17,"bite"],[25,"flamethrower"]],
evo:[{to:"arcanine",by:"stone",item:"fire-stone"}],sprite:{shape:"quad",seed:58,pal:["#e89a3a","#b86a1e","#3a3a3a"]},
flavor:"Barks at strangers. Barks at friends. Barks at barks.",fuseable:true});
sp({id:"arcanine",name:"Arcanine",dex:59,cat:"regular",types:["Fire"],base:{hp:90,atk:110,def:80,spa:100,spd:80,spe:95},abilities:["Intimidate"],catchRate:75,
levelMoves:[[1,"ember"],[1,"leer"],[32,"flamethrower"],[40,"crunch"],[48,"flare-blitz"],[56,"agility"]],
evo:[],sprite:{shape:"quad",seed:59,pal:["#e89a3a","#b86a1e","#3a3a3a"]},
flavor:"Legendary in China. Legendary in your heart. Fast everywhere.",fuseable:true});
sp({id:"poliwag",name:"Poliwag",dex:60,cat:"regular",types:["Water"],base:{hp:40,atk:50,def:40,spa:40,spd:40,spe:90},abilities:["Water Absorb"],catchRate:255,
levelMoves:[[1,"tackle"],[1,"leer"],[9,"water-gun"],[17,"bubble-beam"],[25,"hypnosis"]],
evo:[{to:"poliwhirl",by:"level",at:25}],sprite:{shape:"blob",seed:60,pal:["#4a7dc2","#2e5c8a","#b8d8f2"]},
flavor:"The spiral on its belly is its intestines. You're welcome.",fuseable:true});
sp({id:"poliwhirl",name:"Poliwhirl",dex:61,cat:"regular",types:["Water"],base:{hp:65,atk:65,def:65,spa:50,spd:50,spe:90},abilities:["Water Absorb"],catchRate:120,
levelMoves:[[1,"water-gun"],[25,"bubble-beam"],[32,"hypnosis"],[40,"surf"],[48,"brick-break"]],
evo:[{to:"poliwrath",by:"stone",item:"water-stone"},{to:"politoed",by:"level",at:38}],sprite:{shape:"blob",seed:61,pal:["#4a7dc2","#2e5c8a","#b8d8f2"]},
flavor:"Sweats to stay slippery. Slippery to stay employed.",fuseable:true});
sp({id:"poliwrath",name:"Poliwrath",dex:62,cat:"regular",types:["Water","Fighting"],base:{hp:90,atk:95,def:95,spa:70,spd:90,spe:70},abilities:["Water Absorb"],catchRate:45,
levelMoves:[[1,"surf"],[1,"leer"],[38,"brick-break"],[46,"hydro-pump"],[54,"close-combat"]],
evo:[],sprite:{shape:"biped",seed:62,pal:["#4a7dc2","#2e5c8a","#f2f2f2"]},
flavor:"Muscles for days. Swims butterfly. Judges your form.",fuseable:true});
sp({id:"bellsprout",name:"Bellsprout",dex:69,cat:"regular",types:["Grass","Poison"],base:{hp:50,atk:75,def:35,spa:70,spd:30,spe:40},abilities:["Chlorophyll"],catchRate:255,
levelMoves:[[1,"vine-whip"],[1,"leer"],[9,"sleep-powder"],[15,"razor-leaf"],[21,"growth"]],
evo:[{to:"weepinbell",by:"level",at:21}],sprite:{shape:"blob",seed:69,pal:["#7dc24a","#4a8a2e","#e8c83a"]},
flavor:"Its bud drools acid. Gardening is dangerous.",fuseable:true});
sp({id:"weepinbell",name:"Weepinbell",dex:70,cat:"regular",types:["Grass","Poison"],base:{hp:65,atk:90,def:50,spa:85,spd:45,spe:55},abilities:["Chlorophyll"],catchRate:120,
levelMoves:[[1,"razor-leaf"],[21,"sleep-powder"],[28,"sludge-bomb"],[36,"growth"],[44,"toxic"]],
evo:[{to:"victreebel",by:"stone",item:"leaf-stone"}],sprite:{shape:"blob",seed:70,pal:["#7dc24a","#4a8a2e","#e8c83a"]},
flavor:"Spits poison when hungry. It is always hungry.",fuseable:true});
sp({id:"victreebel",name:"Victreebel",dex:71,cat:"regular",types:["Grass","Poison"],base:{hp:80,atk:105,def:65,spa:100,spd:70,spe:70},abilities:["Chlorophyll"],catchRate:45,
levelMoves:[[1,"razor-leaf"],[1,"leer"],[32,"solar-beam"],[40,"sludge-bomb"],[48,"leaf-blade"],[56,"sleep-powder"]],
evo:[],sprite:{shape:"blob",seed:71,pal:["#7dc24a","#4a8a2e","#c22e2e"]},
flavor:"Lures prey with honey, then eats the prey. Efficient.",fuseable:true});
sp({id:"tentacool",name:"Tentacool",dex:72,cat:"regular",types:["Water","Poison"],base:{hp:40,atk:40,def:35,spa:50,spd:100,spe:70},abilities:["Clear Body"],catchRate:190,
levelMoves:[[1,"tackle"],[1,"leer"],[9,"water-gun"],[17,"poison-jab"],[25,"toxic"]],
evo:[{to:"tentacruel",by:"level",at:30}],sprite:{shape:"blob",seed:72,pal:["#4a9ed8","#2e6e9e","#e83a5a"]},
flavor:"Drifts with the tide. Stings with the tentacles. Multitasks.",fuseable:true});
sp({id:"tentacruel",name:"Tentacruel",dex:73,cat:"regular",types:["Water","Poison"],base:{hp:80,atk:70,def:65,spa:80,spd:120,spe:100},abilities:["Clear Body"],catchRate:60,
levelMoves:[[1,"water-gun"],[30,"poison-jab"],[38,"surf"],[46,"sludge-bomb"],[54,"hydro-pump"]],
evo:[],sprite:{shape:"blob",seed:73,pal:["#4a9ed8","#2e6e9e","#e83a5a"]},
flavor:"Eighty tentacles, all of them rude.",fuseable:true});
sp({id:"ponyta",name:"Ponyta",dex:77,cat:"regular",types:["Fire"],base:{hp:50,atk:85,def:55,spa:65,spd:65,spe:90},abilities:["Run Away"],catchRate:190,
levelMoves:[[1,"tackle"],[1,"leer"],[9,"ember"],[17,"quick-attack"],[25,"flamethrower"]],
evo:[{to:"rapidash",by:"level",at:40}],sprite:{shape:"quad",seed:77,pal:["#e89a3a","#f2f2f2","#c22e2e"]},
flavor:"Its mane is fire but never burns friends. Selective flames.",fuseable:true});
sp({id:"rapidash",name:"Rapidash",dex:78,cat:"regular",types:["Fire"],base:{hp:65,atk:100,def:70,spa:80,spd:80,spe:105},abilities:["Run Away"],catchRate:60,
levelMoves:[[1,"ember"],[40,"flamethrower"],[47,"flare-blitz"],[54,"agility"],[61,"drill-run"]],
evo:[],sprite:{shape:"quad",seed:78,pal:["#e89a3a","#f2f2f2","#c22e2e"]},
flavor:"Gallops at 150 mph. Traffic laws do not apply.",fuseable:true});
sp({id:"slowpoke",name:"Slowpoke",dex:79,cat:"regular",types:["Water","Psychic"],base:{hp:90,atk:65,def:65,spa:40,spd:40,spe:15},abilities:["Oblivious"],catchRate:190,
levelMoves:[[1,"tackle"],[1,"leer"],[9,"water-gun"],[17,"psybeam"],[25,"amnesia"]],
evo:[{to:"slowbro",by:"level",at:37},{to:"slowking",by:"level",at:40}],sprite:{shape:"quad",seed:79,pal:["#e89ab8","#b86a88","#f2d8e2"]},
flavor:"So slow it takes five seconds to feel pain. Enviable, honestly.",fuseable:true});
sp({id:"slowbro",name:"Slowbro",dex:80,cat:"regular",types:["Water","Psychic"],base:{hp:95,atk:75,def:110,spa:100,spd:80,spe:30},abilities:["Oblivious"],catchRate:75,
levelMoves:[[1,"psybeam"],[37,"surf"],[44,"amnesia"],[51,"psychic"],[58,"calm-mind"]],
evo:[],sprite:{shape:"quad",seed:80,pal:["#e89ab8","#b86a88","#7a5a8a"]},
flavor:"The Shellder bit its tail and unlocked genius. Science!",fuseable:true});
sp({id:"magnemite",name:"Magnemite",dex:81,cat:"regular",types:["Electric","Steel"],base:{hp:25,atk:35,def:70,spa:95,spd:55,spe:45},abilities:["Magnet Pull"],catchRate:190,
levelMoves:[[1,"tackle"],[1,"leer"],[9,"thunder-shock"],[17,"thunder-wave"],[25,"flash-cannon"]],
evo:[{to:"magneton",by:"level",at:30}],sprite:{shape:"blob",seed:81,pal:["#8a8a9a","#5c5c6e","#e8c83a"]},
flavor:"Floats via electromagnetism. Sticks to fridges. Relatable.",fuseable:true});
sp({id:"magneton",name:"Magneton",dex:82,cat:"regular",types:["Electric","Steel"],base:{hp:50,atk:60,def:95,spa:120,spd:70,spe:70},abilities:["Magnet Pull"],catchRate:60,
levelMoves:[[1,"thunder-shock"],[30,"thunderbolt"],[38,"flash-cannon"],[46,"thunder-wave"],[54,"thunder"]],
evo:[],sprite:{shape:"blob",seed:82,pal:["#8a8a9a","#5c5c6e","#e8c83a"]},
flavor:"Three Magnemite in a trench coat. Nobody is fooled.",fuseable:true});
sp({id:"farfetchd",name:"Farfetch'd",dex:83,cat:"regular",types:["Normal","Flying"],base:{hp:52,atk:90,def:55,spa:58,spd:62,spe:60},abilities:["Keen Eye"],catchRate:45,
levelMoves:[[1,"peck"],[1,"leer"],[16,"slash"],[24,"aerial-ace"],[32,"swords-dance"],[40,"brave-bird"]],
evo:[],sprite:{shape:"bird",seed:83,pal:["#8a6a4a","#4a8a2e","#e8d8b8"]},
flavor:"Never without its leek. The leek is load-bearing.",fuseable:true});
sp({id:"doduo",name:"Doduo",dex:84,cat:"regular",types:["Normal","Flying"],base:{hp:35,atk:85,def:45,spa:35,spd:35,spe:75},abilities:["Run Away"],catchRate:190,
levelMoves:[[1,"peck"],[1,"leer"],[9,"quick-attack"],[17,"drill-peck"],[25,"agility"]],
evo:[{to:"dodrio",by:"level",at:31}],sprite:{shape:"bird",seed:84,pal:["#a88a5c","#6e5a3a","#e8d8b8"]},
flavor:"Two heads are better than one. They never agree, though.",fuseable:true});
sp({id:"dodrio",name:"Dodrio",dex:85,cat:"regular",types:["Normal","Flying"],base:{hp:60,atk:110,def:70,spa:60,spd:60,spe:110},abilities:["Run Away"],catchRate:45,
levelMoves:[[1,"drill-peck"],[31,"aerial-ace"],[38,"agility"],[45,"brave-bird"],[52,"swords-dance"]],
evo:[],sprite:{shape:"bird",seed:85,pal:["#a88a5c","#6e5a3a","#e8d8b8"]},
flavor:"Three heads, six opinions, one direction: forward.",fuseable:true});
sp({id:"seel",name:"Seel",dex:86,cat:"regular",types:["Water"],base:{hp:65,atk:45,def:55,spa:45,spd:70,spe:45},abilities:["Thick Fat"],catchRate:190,
levelMoves:[[1,"tackle"],[1,"leer"],[9,"water-gun"],[17,"icy-wind"],[25,"ice-beam"]],
evo:[{to:"dewgong",by:"level",at:34}],sprite:{shape:"quad",seed:86,pal:["#e8f2f8","#b8d8e8","#5a7a8a"]},
flavor:"The horn on its head is for breaking ice. And hearts.",fuseable:true});
sp({id:"dewgong",name:"Dewgong",dex:87,cat:"regular",types:["Water","Ice"],base:{hp:90,atk:70,def:80,spa:70,spd:95,spe:70},abilities:["Thick Fat"],catchRate:75,
levelMoves:[[1,"icy-wind"],[34,"ice-beam"],[42,"surf"],[50,"hydro-pump"],[58,"blizzard"]],
evo:[],sprite:{shape:"quad",seed:87,pal:["#e8f2f8","#b8d8e8","#5a7a8a"]},
flavor:"Stores thermal energy in its body. A living thermos.",fuseable:true});
sp({id:"grimer",name:"Grimer",dex:88,cat:"regular",types:["Poison"],base:{hp:80,atk:80,def:50,spa:40,spd:50,spe:25},abilities:["Sticky Hold"],catchRate:190,
levelMoves:[[1,"tackle"],[1,"leer"],[9,"poison-jab"],[17,"toxic"],[25,"amnesia"]],
evo:[{to:"muk",by:"level",at:38}],sprite:{shape:"blob",seed:88,pal:["#7a4a8a","#4a2a5c","#a87dc2"]},
flavor:"Born from sludge. Achieved dreams anyway.",fuseable:true});
sp({id:"muk",name:"Muk",dex:89,cat:"regular",types:["Poison"],base:{hp:105,atk:105,def:75,spa:65,spd:100,spe:50},abilities:["Sticky Hold"],catchRate:75,
levelMoves:[[1,"poison-jab"],[38,"sludge-bomb"],[46,"toxic"],[54,"amnesia"],[62,"brick-break"]],
evo:[],sprite:{shape:"blob",seed:89,pal:["#7a4a8a","#4a2a5c","#a87dc2"]},
flavor:"One drop of its sweat is lethally toxic. It sweats a lot.",fuseable:true});
sp({id:"shellder",name:"Shellder",dex:90,cat:"regular",types:["Water"],base:{hp:30,atk:65,def:100,spa:45,spd:25,spe:40},abilities:["Shell Armor"],catchRate:190,
levelMoves:[[1,"tackle"],[1,"leer"],[9,"water-gun"],[17,"ice-beam"],[25,"icicle-spear"]],
evo:[{to:"cloyster",by:"stone",item:"water-stone"}],sprite:{shape:"blob",seed:90,pal:["#5a6ac2","#3a4a8a","#b8c2f2"]},
flavor:"Its shell is harder than diamond. Its feelings are not.",fuseable:true});
sp({id:"cloyster",name:"Cloyster",dex:91,cat:"regular",types:["Water","Ice"],base:{hp:50,atk:95,def:180,spa:85,spd:45,spe:70},abilities:["Shell Armor"],catchRate:60,
levelMoves:[[1,"icicle-spear"],[1,"leer"],[32,"ice-beam"],[40,"surf"],[48,"blizzard"]],
evo:[],sprite:{shape:"blob",seed:91,pal:["#5a6ac2","#3a4a8a","#e8f2ff"]},
flavor:"Clamps shut on anything. Opens for no one. Boundaries.",fuseable:true});
sp({id:"onix",name:"Onix",dex:95,cat:"regular",types:["Rock","Ground"],base:{hp:35,atk:45,def:160,spa:30,spd:45,spe:70},abilities:["Rock Head"],catchRate:45,
levelMoves:[[1,"tackle"],[1,"leer"],[9,"rock-throw"],[17,"rock-slide"],[25,"earthquake"]],
evo:[{to:"steelix",by:"level",at:42}],sprite:{shape:"serpent",seed:95,pal:["#8a8a8a","#5c5c5c","#b8b8b8"]},
flavor:"A living subway tunnel. Commuters welcome.",fuseable:true});
sp({id:"drowzee",name:"Drowzee",dex:96,cat:"regular",types:["Psychic"],base:{hp:60,atk:48,def:45,spa:43,spd:90,spe:42},abilities:["Insomnia"],catchRate:190,
levelMoves:[[1,"pound"],[1,"leer"],[9,"psybeam"],[17,"hypnosis"],[25,"calm-mind"]],
evo:[{to:"hypno",by:"level",at:26}],sprite:{shape:"biped",seed:96,pal:["#e8c83a","#b8941e","#8a6a2e"]},
flavor:"Eats dreams. Prefers the fun ones. Yours are fun.",fuseable:true});
sp({id:"hypno",name:"Hypno",dex:97,cat:"regular",types:["Psychic"],base:{hp:85,atk:73,def:70,spa:73,spd:115,spe:67},abilities:["Insomnia"],catchRate:75,
levelMoves:[[1,"psybeam"],[26,"psychic"],[34,"hypnosis"],[42,"calm-mind"],[50,"brick-break"]],
evo:[],sprite:{shape:"biped",seed:97,pal:["#e8c83a","#b8941e","#8a6a2e"]},
flavor:"Swings its pendulum. You feel sleepy. You feel compliant.",fuseable:true});
sp({id:"krabby",name:"Krabby",dex:98,cat:"regular",types:["Water"],base:{hp:30,atk:105,def:90,spa:25,spd:25,spe:50},abilities:["Hyper Cutter"],catchRate:225,
levelMoves:[[1,"tackle"],[1,"leer"],[9,"water-gun"],[17,"slash"],[25,"waterfall"]],
evo:[{to:"kingler",by:"level",at:28}],sprite:{shape:"quad",seed:98,pal:["#e83a3a","#b81e1e","#f2a88a"]},
flavor:"Its pincers are its resume. Impressive resume.",fuseable:true});
sp({id:"kingler",name:"Kingler",dex:99,cat:"regular",types:["Water"],base:{hp:55,atk:130,def:115,spa:50,spd:50,spe:75},abilities:["Hyper Cutter"],catchRate:60,
levelMoves:[[1,"waterfall"],[28,"slash"],[36,"rock-slide"],[44,"swords-dance"],[52,"surf"]],
evo:[],sprite:{shape:"quad",seed:99,pal:["#e83a3a","#b81e1e","#f2a88a"]},
flavor:"One giant claw for crushing, one small claw for snacks.",fuseable:true});
sp({id:"voltorb",name:"Voltorb",dex:100,cat:"regular",types:["Electric"],base:{hp:40,atk:30,def:50,spa:55,spd:55,spe:100},abilities:["Soundproof"],catchRate:190,
levelMoves:[[1,"tackle"],[1,"leer"],[9,"thunder-shock"],[17,"thunder-wave"],[25,"thunderbolt"]],
evo:[{to:"electrode",by:"level",at:30}],sprite:{shape:"blob",seed:100,pal:["#e83a3a","#f2f2f2","#b81e1e"]},
flavor:"Looks like a Poke Ball. Is not a Poke Ball. Usually.",fuseable:true});
sp({id:"electrode",name:"Electrode",dex:101,cat:"regular",types:["Electric"],base:{hp:60,atk:50,def:70,spa:80,spd:80,spe:150},abilities:["Soundproof"],catchRate:60,
levelMoves:[[1,"thunder-shock"],[30,"thunderbolt"],[38,"thunder-wave"],[46,"thunder"],[54,"swift"]],
evo:[],sprite:{shape:"blob",seed:101,pal:["#e83a3a","#f2f2f2","#b81e1e"]},
flavor:"Explodes when excited. Is always excited.",fuseable:true});
sp({id:"exeggcute",name:"Exeggcute",dex:102,cat:"regular",types:["Grass","Psychic"],base:{hp:60,atk:40,def:80,spa:60,spd:45,spe:40},abilities:["Chlorophyll"],catchRate:90,
levelMoves:[[1,"tackle"],[1,"leer"],[9,"psybeam"],[17,"seed-bomb"],[25,"hypnosis"]],
evo:[{to:"exeggutor",by:"stone",item:"leaf-stone"}],sprite:{shape:"blob",seed:102,pal:["#e8a83a","#b87a1e","#f2d88a"]},
flavor:"Six eggs, one mind. Democracy in action.",fuseable:true});
sp({id:"exeggutor",name:"Exeggutor",dex:103,cat:"regular",types:["Grass","Psychic"],base:{hp:95,atk:95,def:85,spa:125,spd:75,spe:55},abilities:["Chlorophyll"],catchRate:45,
levelMoves:[[1,"psybeam"],[1,"leer"],[32,"energy-ball"],[40,"psychic"],[48,"solar-beam"]],
evo:[],sprite:{shape:"blob",seed:103,pal:["#a87848","#7a5230","#4a8a2e"]},
flavor:"Each head thinks different thoughts. Meetings take forever.",fuseable:true});
sp({id:"cubone",name:"Cubone",dex:104,cat:"regular",types:["Ground"],base:{hp:50,atk:50,def:95,spa:40,spd:50,spe:35},abilities:["Rock Head"],catchRate:190,
levelMoves:[[1,"scratch"],[1,"leer"],[9,"rock-throw"],[17,"earthquake"],[25,"brick-break"]],
evo:[{to:"marowak",by:"level",at:28}],sprite:{shape:"biped",seed:104,pal:["#d8a868","#a87838","#f2e8d8"]},
flavor:"Wears its mother's skull. Cries at sunsets. Icon.",fuseable:true});
sp({id:"marowak",name:"Marowak",dex:105,cat:"regular",types:["Ground"],base:{hp:60,atk:80,def:110,spa:50,spd:80,spe:45},abilities:["Rock Head"],catchRate:75,
levelMoves:[[1,"rock-throw"],[28,"earthquake"],[36,"brick-break"],[44,"swords-dance"],[52,"rock-slide"]],
evo:[],sprite:{shape:"biped",seed:105,pal:["#d8a868","#a87838","#f2e8d8"]},
flavor:"Its bone club never misses. Its grief never fades.",fuseable:true});
sp({id:"hitmonlee",name:"Hitmonlee",dex:106,cat:"regular",types:["Fighting"],base:{hp:50,atk:120,def:53,spa:35,spd:110,spe:87},abilities:["Limber"],catchRate:45,
levelMoves:[[1,"tackle"],[1,"leer"],[16,"karate-chop"],[24,"brick-break"],[32,"close-combat"],[40,"bulk-up"]],
evo:[],sprite:{shape:"biped",seed:106,pal:["#c2a878","#8a6e48","#f2e8d8"]},
flavor:"Legs stretch to triple length. Yoga goals.",fuseable:true});
sp({id:"hitmonchan",name:"Hitmonchan",dex:107,cat:"regular",types:["Fighting"],base:{hp:50,atk:105,def:79,spa:35,spd:110,spe:76},abilities:["Keen Eye"],catchRate:45,
levelMoves:[[1,"karate-chop"],[16,"thunder-punch"],[24,"ice-punch"],[32,"fire-punch"],[40,"brick-break"]],
evo:[],sprite:{shape:"biped",seed:107,pal:["#a86a5a","#7a463a","#e8b8a8"]},
flavor:"Punches faster than a camera shutter. Poses after.",fuseable:true});
sp({id:"lickitung",name:"Lickitung",dex:108,cat:"regular",types:["Normal"],base:{hp:90,atk:55,def:75,spa:60,spd:75,spe:30},abilities:["Own Tempo"],catchRate:45,
levelMoves:[[1,"tackle"],[1,"leer"],[16,"slash"],[24,"body-slam"],[32,"hyper-voice"],[40,"swords-dance"]],
evo:[],sprite:{shape:"biped",seed:108,pal:["#e89ab8","#b86a88","#f2d8e2"]},
flavor:"Its tongue is twice its body length. Licks everything. Everything.",fuseable:true});
sp({id:"koffing",name:"Koffing",dex:109,cat:"regular",types:["Poison"],base:{hp:40,atk:65,def:95,spa:60,spd:45,spe:35},abilities:["Levitate"],catchRate:190,
levelMoves:[[1,"tackle"],[1,"leer"],[9,"poison-jab"],[17,"toxic"],[25,"will-o-wisp"]],
evo:[{to:"weezing",by:"level",at:35}],sprite:{shape:"blob",seed:109,pal:["#8a6ac2","#5c4a8a","#b89ad8"]},
flavor:"Floats on toxic gas. Burps constantly. Zero shame.",fuseable:true});
sp({id:"weezing",name:"Weezing",dex:110,cat:"regular",types:["Poison"],base:{hp:65,atk:90,def:120,spa:85,spd:70,spe:60},abilities:["Levitate"],catchRate:60,
levelMoves:[[1,"poison-jab"],[35,"sludge-bomb"],[43,"toxic"],[51,"will-o-wisp"],[59,"double-edge"]],
evo:[],sprite:{shape:"blob",seed:110,pal:["#8a6ac2","#5c4a8a","#b89ad8"]},
flavor:"Two heads argue about who smells worse. Both lose.",fuseable:true});
sp({id:"rhyhorn",name:"Rhyhorn",dex:111,cat:"regular",types:["Ground","Rock"],base:{hp:80,atk:85,def:95,spa:30,spd:30,spe:25},abilities:["Lightning Rod"],catchRate:120,
levelMoves:[[1,"tackle"],[1,"leer"],[9,"rock-throw"],[17,"earthquake"],[25,"rock-slide"]],
evo:[{to:"rhydon",by:"level",at:42}],sprite:{shape:"quad",seed:111,pal:["#8a8a8a","#5c5c5c","#b8b8b8"]},
flavor:"Charges in a straight line. Forgets why. Charges again.",fuseable:true});
sp({id:"rhydon",name:"Rhydon",dex:112,cat:"regular",types:["Ground","Rock"],base:{hp:105,atk:130,def:120,spa:45,spd:45,spe:40},abilities:["Lightning Rod"],catchRate:60,
levelMoves:[[1,"rock-throw"],[42,"earthquake"],[50,"rock-slide"],[58,"drill-run"],[66,"brick-break"]],
evo:[],sprite:{shape:"biped",seed:112,pal:["#8a8a8a","#5c5c5c","#b8b8b8"]},
flavor:"Its horn can shatter diamonds. Its brain cannot remember lunch.",fuseable:true});
sp({id:"chansey",name:"Chansey",dex:113,cat:"regular",types:["Normal"],base:{hp:250,atk:5,def:5,spa:35,spd:105,spe:50},abilities:["Natural Cure"],catchRate:30,
levelMoves:[[1,"pound"],[1,"sing"],[16,"recover"],[24,"hyper-voice"],[32,"calm-mind"]],
evo:[{to:"blissey",by:"level",at:40}],sprite:{shape:"blob",seed:113,pal:["#f2b8d8","#d88ab8","#fff0f8"]},
flavor:"Shares its egg with the injured. The egg is lucky. So are you.",fuseable:true});
sp({id:"tangela",name:"Tangela",dex:114,cat:"regular",types:["Grass"],base:{hp:65,atk:55,def:115,spa:100,spd:40,spe:60},abilities:["Chlorophyll"],catchRate:45,
levelMoves:[[1,"vine-whip"],[1,"leer"],[16,"sleep-powder"],[24,"energy-ball"],[32,"growth"],[40,"ancient-power"]],
evo:[],sprite:{shape:"blob",seed:114,pal:["#4a8a5c","#2e5c3a","#7dc24a"]},
flavor:"A tangle of vines with eyes. Nobody has seen its feet.",fuseable:true});
sp({id:"kangaskhan",name:"Kangaskhan",dex:115,cat:"regular",types:["Normal"],base:{hp:105,atk:95,def:80,spa:40,spd:80,spe:90},abilities:["Early Bird"],catchRate:45,
levelMoves:[[1,"pound"],[1,"leer"],[16,"bite"],[24,"body-slam"],[32,"crunch"],[40,"brick-break"]],
evo:[],sprite:{shape:"biped",seed:115,pal:["#a87848","#7a5230","#e8c88a"]},
flavor:"Fiercely protective mother. The baby is also fierce.",fuseable:true});
sp({id:"horsea",name:"Horsea",dex:116,cat:"regular",types:["Water"],base:{hp:30,atk:40,def:70,spa:70,spd:25,spe:60},abilities:["Swift Swim"],catchRate:225,
levelMoves:[[1,"tackle"],[1,"leer"],[9,"water-gun"],[17,"bubble-beam"],[25,"agility"]],
evo:[{to:"seadra",by:"level",at:32}],sprite:{shape:"fish",seed:116,pal:["#4a9ed8","#2e6e9e","#b8e2f2"]},
flavor:"Spits ink when startled. Startles at its own reflection.",fuseable:true});
sp({id:"seadra",name:"Seadra",dex:117,cat:"regular",types:["Water"],base:{hp:55,atk:65,def:95,spa:95,spd:45,spe:85},abilities:["Poison Point"],catchRate:75,
levelMoves:[[1,"water-gun"],[32,"bubble-beam"],[40,"surf"],[48,"agility"],[56,"hydro-pump"]],
evo:[{to:"kingdra",by:"level",at:45}],sprite:{shape:"fish",seed:117,pal:["#4a9ed8","#2e6e9e","#e83a5a"]},
flavor:"Its spines are venomous. Its glare is worse.",fuseable:true});
sp({id:"goldeen",name:"Goldeen",dex:118,cat:"regular",types:["Water"],base:{hp:45,atk:67,def:60,spa:35,spd:50,spe:63},abilities:["Swift Swim"],catchRate:225,
levelMoves:[[1,"tackle"],[1,"leer"],[9,"water-gun"],[17,"waterfall"],[25,"agility"]],
evo:[{to:"seaking",by:"level",at:33}],sprite:{shape:"fish",seed:118,pal:["#e89a3a","#f2f2f2","#e83a3a"]},
flavor:"Its horn is its pride. Its pride is enormous.",fuseable:true});
sp({id:"seaking",name:"Seaking",dex:119,cat:"regular",types:["Water"],base:{hp:80,atk:92,def:65,spa:65,spd:80,spe:68},abilities:["Swift Swim"],catchRate:60,
levelMoves:[[1,"waterfall"],[33,"surf"],[41,"agility"],[49,"hydro-pump"],[57,"drill-run"]],
evo:[],sprite:{shape:"fish",seed:119,pal:["#e89a3a","#f2f2f2","#e83a3a"]},
flavor:"Drills through riverbeds with its horn. Interior decorator of rivers.",fuseable:true});
sp({id:"staryu",name:"Staryu",dex:120,cat:"regular",types:["Water"],base:{hp:30,atk:45,def:55,spa:70,spd:55,spe:85},abilities:["Illuminate"],catchRate:225,
levelMoves:[[1,"tackle"],[1,"leer"],[9,"water-gun"],[17,"bubble-beam"],[25,"recover"]],
evo:[{to:"starmie",by:"stone",item:"water-stone"}],sprite:{shape:"blob",seed:120,pal:["#c2a83a","#8a782e","#f2e8b8"]},
flavor:"Its core glows red when excited. It is always excited.",fuseable:true});
sp({id:"starmie",name:"Starmie",dex:121,cat:"regular",types:["Water","Psychic"],base:{hp:60,atk:75,def:85,spa:100,spd:85,spe:115},abilities:["Illuminate"],catchRate:60,
levelMoves:[[1,"surf"],[1,"leer"],[32,"psybeam"],[40,"psychic"],[48,"hydro-pump"]],
evo:[],sprite:{shape:"blob",seed:121,pal:["#8a6ac2","#5c4a8a","#c2a83a"]},
flavor:"Spins its body to swim. Thinks in geometry.",fuseable:true});
sp({id:"mr-mime",name:"Mr. Mime",dex:122,cat:"regular",types:["Psychic","Fairy"],base:{hp:40,atk:45,def:65,spa:100,spd:120,spe:90},abilities:["Soundproof"],catchRate:45,
levelMoves:[[1,"pound"],[1,"leer"],[16,"psybeam"],[24,"dazzling-gleam"],[32,"reflect"],[40,"psychic"]],
evo:[],sprite:{shape:"biped",seed:122,pal:["#f2b8d8","#d88ab8","#4a4a5c"]},
flavor:"Mimes invisible walls. The walls are real to him. Respect it.",fuseable:true});
sp({id:"jynx",name:"Jynx",dex:124,cat:"regular",types:["Ice","Psychic"],base:{hp:65,atk:50,def:35,spa:115,spd:95,spe:95},abilities:["Oblivious"],catchRate:45,
levelMoves:[[1,"pound"],[1,"leer"],[16,"icy-wind"],[24,"psybeam"],[32,"ice-beam"],[40,"psychic"]],
evo:[],sprite:{shape:"biped",seed:124,pal:["#e8b83a","#f2f2f2","#8a3a5c"]},
flavor:"Communicates in a rhythmic language. Sings backup for itself.",fuseable:true});
sp({id:"electabuzz",name:"Electabuzz",dex:125,cat:"regular",types:["Electric"],base:{hp:65,atk:83,def:57,spa:95,spd:85,spe:105},abilities:["Static"],catchRate:45,
levelMoves:[[1,"thunder-punch"],[16,"thunderbolt"],[24,"thunder-wave"],[32,"thunder"],[40,"brick-break"]],
evo:[],sprite:{shape:"biped",seed:125,pal:["#e8c83a","#b8941e","#3a3a3a"]},
flavor:"Eats electricity for breakfast. And lunch. And dinner.",fuseable:true});
sp({id:"magmar",name:"Magmar",dex:126,cat:"regular",types:["Fire"],base:{hp:65,atk:95,def:57,spa:100,spd:85,spe:93},abilities:["Flame Body"],catchRate:45,
levelMoves:[[1,"fire-punch"],[16,"ember"],[24,"flamethrower"],[32,"fire-blast"],[40,"brick-break"]],
evo:[],sprite:{shape:"biped",seed:126,pal:["#e83a2e","#b81e1e","#f2a88a"]},
flavor:"Its body is always 1200 degrees. Do not hug.",fuseable:true});
sp({id:"pinsir",name:"Pinsir",dex:127,cat:"regular",types:["Bug"],base:{hp:65,atk:125,def:100,spa:55,spd:70,spe:85},abilities:["Hyper Cutter"],catchRate:45,
levelMoves:[[1,"tackle"],[1,"leer"],[16,"x-scissor"],[24,"swords-dance"],[32,"brick-break"],[40,"bug-bite"]],
evo:[],sprite:{shape:"insect",seed:127,pal:["#8a6a4a","#5c422e","#e8d8b8"]},
flavor:"Cracks its prey in half with its horns. Then naps.",fuseable:true});
sp({id:"tauros",name:"Tauros",dex:128,cat:"regular",types:["Normal"],base:{hp:75,atk:100,def:95,spa:40,spd:70,spe:110},abilities:["Intimidate"],catchRate:45,
levelMoves:[[1,"tackle"],[1,"leer"],[16,"body-slam"],[24,"earthquake"],[32,"zen-headbutt"],[40,"outrage"]],
evo:[],sprite:{shape:"quad",seed:128,pal:["#a87848","#7a5230","#e8c88a"]},
flavor:"Charges at anything that moves. Including wind.",fuseable:true});
sp({id:"ditto",name:"Ditto",dex:132,cat:"regular",types:["Normal"],base:{hp:48,atk:48,def:48,spa:48,spd:48,spe:48},abilities:["Limber"],catchRate:35,
levelMoves:[[1,"tackle"],[1,"leer"],[16,"agility"],[24,"amnesia"],[32,"growl"],[40,"tail-whip"]],
evo:[],sprite:{shape:"blob",seed:132,pal:["#c28ad8","#8a5ab8","#f2e8ff"]},
flavor:"Transforms perfectly, except the face. The face is always :).",fuseable:true});
sp({id:"porygon",name:"Porygon",dex:137,cat:"regular",types:["Normal"],base:{hp:65,atk:60,def:70,spa:85,spd:75,spe:40},abilities:["Trace"],catchRate:45,
levelMoves:[[1,"tackle"],[1,"leer"],[16,"psybeam"],[24,"tri-attack"],[32,"agility"]],
evo:[{to:"porygon2",by:"level",at:36}],sprite:{shape:"blob",seed:137,pal:["#e83a5a","#b81e1e","#4a9ed8"]},
flavor:"The first artificial Pokemon. Runs on dial-up.",fuseable:true});
sp({id:"omanyte",name:"Omanyte",dex:138,cat:"regular",types:["Rock","Water"],base:{hp:35,atk:40,def:100,spa:90,spd:55,spe:35},abilities:["Swift Swim"],catchRate:45,
levelMoves:[[1,"tackle"],[1,"leer"],[16,"water-gun"],[24,"ancient-power"],[32,"surf"]],
evo:[{to:"omastar",by:"level",at:40}],sprite:{shape:"blob",seed:138,pal:["#8a9ed8","#5c7ab8","#e8c83a"]},
flavor:"Extinct for millennia. Back and bitter about it.",fuseable:true});
sp({id:"omastar",name:"Omastar",dex:139,cat:"regular",types:["Rock","Water"],base:{hp:70,atk:60,def:125,spa:115,spd:70,spe:55},abilities:["Swift Swim"],catchRate:45,
levelMoves:[[1,"ancient-power"],[40,"surf"],[48,"rock-slide"],[56,"hydro-pump"],[64,"ice-beam"]],
evo:[],sprite:{shape:"blob",seed:139,pal:["#8a9ed8","#5c7ab8","#e8c83a"]},
flavor:"Its tentacles were too heavy to swim well. Evolution said no.",fuseable:true});
sp({id:"kabuto",name:"Kabuto",dex:140,cat:"regular",types:["Rock","Water"],base:{hp:30,atk:80,def:90,spa:55,spd:45,spe:55},abilities:["Swift Swim"],catchRate:45,
levelMoves:[[1,"scratch"],[1,"leer"],[16,"ancient-power"],[24,"rock-slide"],[32,"surf"]],
evo:[{to:"kabutops",by:"level",at:40}],sprite:{shape:"blob",seed:140,pal:["#a87848","#7a5230","#e8c88a"]},
flavor:"A living fossil. Has seen some things. Mostly oceans.",fuseable:true});
sp({id:"kabutops",name:"Kabutops",dex:141,cat:"regular",types:["Rock","Water"],base:{hp:60,atk:115,def:105,spa:65,spd:70,spe:80},abilities:["Swift Swim"],catchRate:45,
levelMoves:[[1,"ancient-power"],[40,"rock-slide"],[48,"surf"],[56,"brick-break"],[64,"swords-dance"]],
evo:[],sprite:{shape:"biped",seed:141,pal:["#a87848","#7a5230","#e8c88a"]},
flavor:"Slices prey with scythe arms. Retired from the sea, not from violence.",fuseable:true});
sp({id:"chikorita",name:"Chikorita",dex:152,cat:"regular",types:["Grass"],base:{hp:45,atk:49,def:65,spa:49,spd:65,spe:45},abilities:["Overgrow"],catchRate:45,
levelMoves:[[1,"tackle"],[1,"leer"],[9,"razor-leaf"],[17,"sleep-powder"],[25,"growth"]],
evo:[{to:"bayleef",by:"level",at:16}],sprite:{shape:"quad",seed:152,pal:["#7dc24a","#4a8a2e","#e8f2b8"]},
flavor:"The leaf on its head senses temperature. And vibes.",fuseable:true});
sp({id:"bayleef",name:"Bayleef",dex:153,cat:"regular",types:["Grass"],base:{hp:60,atk:62,def:80,spa:63,spd:80,spe:60},abilities:["Overgrow"],catchRate:45,
levelMoves:[[1,"razor-leaf"],[16,"sleep-powder"],[24,"growth"],[32,"energy-ball"],[40,"solar-beam"]],
evo:[{to:"meganium",by:"level",at:32}],sprite:{shape:"quad",seed:153,pal:["#7dc24a","#4a8a2e","#e8f2b8"]},
flavor:"Its neck buds smell spicy. Hugs smell spicy too.",fuseable:true});
sp({id:"meganium",name:"Meganium",dex:154,cat:"regular",types:["Grass"],base:{hp:80,atk:82,def:100,spa:83,spd:100,spe:80},abilities:["Overgrow"],catchRate:45,
levelMoves:[[1,"razor-leaf"],[32,"energy-ball"],[40,"solar-beam"],[48,"growth"],[56,"sleep-powder"]],
evo:[],sprite:{shape:"quad",seed:154,pal:["#7dc24a","#4a8a2e","#f2b8d8"]},
flavor:"Its breath revives dead plants. Its presence revives dead parties.",fuseable:true});
sp({id:"cyndaquil",name:"Cyndaquil",dex:155,cat:"regular",types:["Fire"],base:{hp:39,atk:52,def:43,spa:60,spd:50,spe:65},abilities:["Blaze"],catchRate:45,
levelMoves:[[1,"tackle"],[1,"leer"],[9,"ember"],[17,"quick-attack"],[25,"flamethrower"]],
evo:[{to:"quilava",by:"level",at:14}],sprite:{shape:"quad",seed:155,pal:["#4a7dc2","#e8c83a","#2e5c8a"]},
flavor:"Flames erupt from its back when angry. Or startled. Or awake.",fuseable:true});
sp({id:"quilava",name:"Quilava",dex:156,cat:"regular",types:["Fire"],base:{hp:58,atk:64,def:58,spa:80,spd:65,spe:80},abilities:["Blaze"],catchRate:45,
levelMoves:[[1,"ember"],[14,"flamethrower"],[22,"agility"],[30,"fire-blast"],[38,"quick-attack"]],
evo:[{to:"typhlosion",by:"level",at:36}],sprite:{shape:"quad",seed:156,pal:["#4a7dc2","#e8c83a","#2e5c8a"]},
flavor:"Intimidates foes with heat waves. Also with eyebrows.",fuseable:true});
