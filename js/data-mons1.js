var S = G.Data.SPECIES;
function sp(o){ o.anime = !!o.anime; o.fuseable = (o.fuseable !== false); S[o.id] = o; }

/* ===== Synthetic starters (AI-region theme) ===== */
sp({id:"sparkit",name:"Sparkit",dex:1501,cat:"starter",types:["Electric"],base:{hp:45,atk:55,def:45,spa:65,spd:55,spe:70},abilities:["Static"],catchRate:45,
levelMoves:[[1,"scratch"],[1,"thunder-shock"],[6,"quick-attack"],[10,"thunder-wave"],[14,"swift"],[18,"thunderbolt"],[24,"agility"],[30,"thunder"],[36,"wild-charge"]],
evo:[{to:"voltkit",by:"level",at:16}],sprite:{shape:"quad",seed:1501,pal:["#f5d742","#2b2b33","#fff3b0"]},
flavor:"Its tail-tip sparks when excited. NEXUS swears it chose you first."});
sp({id:"voltkit",name:"Voltkit",dex:1502,cat:"starter",types:["Electric"],base:{hp:60,atk:70,def:55,spa:85,spd:65,spe:95},abilities:["Static"],catchRate:45,
levelMoves:[[1,"thunder-shock"],[1,"quick-attack"],[10,"thunder-wave"],[16,"swift"],[22,"thunderbolt"],[28,"thunder-punch"],[34,"agility"],[40,"thunder"],[46,"wild-charge"]],
evo:[{to:"amperion",by:"level",at:36}],sprite:{shape:"quad",seed:1502,pal:["#ffd23f","#33334d","#fff3b0","#ff8c42"]},
flavor:"It stores storms in its striped tail and discharges them as battle cries."});
sp({id:"amperion",name:"Amperion",dex:1503,cat:"starter",types:["Electric"],base:{hp:80,atk:95,def:75,spa:115,spd:85,spe:120},abilities:["Static"],catchRate:45,
levelMoves:[[1,"thunderbolt"],[1,"quick-attack"],[36,"thunder"],[42,"wild-charge"],[48,"agility"],[54,"close-combat"],[60,"iron-tail"]],
evo:[],sprite:{shape:"quad",seed:1503,pal:["#ffd23f","#1e1e2e","#fff3b0","#ff8c42","#7df9ff"]},
flavor:"A living thunderhead. Its roar once rebooted an entire city's power grid."});
sp({id:"aquil",name:"Aquil",dex:1504,cat:"starter",types:["Water"],base:{hp:50,atk:50,def:60,spa:65,spd:60,spe:55},abilities:["Torrent"],catchRate:45,
levelMoves:[[1,"tackle"],[1,"water-gun"],[7,"tail-whip"],[12,"bubble-beam"],[18,"aqua-tail"],[24,"icy-wind"],[30,"surf"],[36,"hydro-pump"]],
evo:[{to:"marquil",by:"level",at:18}],sprite:{shape:"fish",seed:1504,pal:["#4fa8ff","#e8f6ff","#1e5fa8"]},
flavor:"It naps inside rain clouds and wakes up only for snacks and battles."});
sp({id:"marquil",name:"Marquil",dex:1505,cat:"starter",types:["Water"],base:{hp:65,atk:65,def:75,spa:85,spd:75,spe:70},abilities:["Torrent"],catchRate:45,
levelMoves:[[1,"water-gun"],[1,"bubble-beam"],[18,"aqua-tail"],[24,"icy-wind"],[30,"surf"],[36,"hydro-pump"],[42,"ice-beam"],[48,"waterfall"]],
evo:[{to:"aquilon",by:"level",at:36}],sprite:{shape:"fish",seed:1505,pal:["#4fa8ff","#e8f6ff","#1e5fa8","#7df9ff"]},
flavor:"Its dorsal fin slices waves in half. Surfers both fear and worship it."});
sp({id:"aquilon",name:"Aquilon",dex:1506,cat:"starter",types:["Water"],base:{hp:85,atk:90,def:95,spa:110,spd:95,spe:90},abilities:["Torrent"],catchRate:45,
levelMoves:[[1,"surf"],[1,"aqua-tail"],[36,"hydro-pump"],[42,"ice-beam"],[48,"waterfall"],[54,"blizzard"],[60,"earthquake"]],
evo:[],sprite:{shape:"serpent",seed:1506,pal:["#2e7fd9","#e8f6ff","#0e3a6b","#7df9ff"]},
flavor:"An abyssal sovereign. Old sailors claim it decides where storms are born."});
sp({id:"terrafen",name:"Terrafen",dex:1507,cat:"starter",types:["Grass","Ground"],base:{hp:55,atk:65,def:70,spa:50,spd:55,spe:45},abilities:["Overgrow"],catchRate:45,
levelMoves:[[1,"tackle"],[1,"vine-whip"],[8,"growl"],[13,"razor-leaf"],[18,"seed-bomb"],[24,"earth-power"],[30,"solar-beam"],[36,"earthquake"]],
evo:[{to:"terrabud",by:"level",at:16}],sprite:{shape:"quad",seed:1507,pal:["#6fbf4a","#8a5a33","#d9f2c4"]},
flavor:"It photosynthesizes while it sleeps, which is most of the day."});
sp({id:"terrabud",name:"Terrabud",dex:1508,cat:"starter",types:["Grass","Ground"],base:{hp:70,atk:80,def:90,spa:65,spd:70,spe:55},abilities:["Overgrow"],catchRate:45,
levelMoves:[[1,"vine-whip"],[1,"razor-leaf"],[16,"seed-bomb"],[22,"earth-power"],[28,"solar-beam"],[34,"earthquake"],[40,"rock-slide"],[46,"leaf-blade"]],
evo:[{to:"terradon",by:"level",at:36}],sprite:{shape:"quad",seed:1508,pal:["#4a9e35","#6b4423","#d9f2c4","#a8e05f"]},
flavor:"The bud on its back blooms only when it trusts its trainer completely."});
sp({id:"terradon",name:"Terradon",dex:1509,cat:"starter",types:["Grass","Ground"],base:{hp:90,atk:115,def:110,spa:80,spd:85,spe:70},abilities:["Overgrow"],catchRate:45,
levelMoves:[[1,"earthquake"],[1,"seed-bomb"],[36,"leaf-blade"],[42,"rock-slide"],[48,"solar-beam"],[54,"precipice-blades"],[60,"stone-edge"]],
evo:[],sprite:{shape:"quad",seed:1509,pal:["#2e7d22","#4a2f16","#d9f2c4","#a8e05f","#8a8a8a"]},
flavor:"Where it walks, flowers bloom in its footprints. Do not stand in them."});

/* ===== Regulars: Gen 1 favorites ===== */
sp({id:"pikachu",name:"Pikachu",dex:25,cat:"regular",types:["Electric"],base:{hp:35,atk:55,def:40,spa:50,spd:50,spe:90},abilities:["Static"],catchRate:190,
levelMoves:[[1,"thunder-shock"],[1,"quick-attack"],[5,"tail-whip"],[10,"thunder-wave"],[16,"swift"],[24,"thunderbolt"],[32,"agility"],[40,"thunder"]],
evo:[{to:"raichu",by:"stone",item:"thunder-stone"}],sprite:{shape:"quad",seed:25,pal:["#f5d742","#2b2b33","#e33e2b"]},
flavor:"It stores electricity in its cheeks. Handle with oven mitts."});
sp({id:"raichu",name:"Raichu",dex:26,cat:"regular",types:["Electric"],base:{hp:60,atk:90,def:55,spa:90,spd:80,spe:110},abilities:["Static"],catchRate:75,
levelMoves:[[1,"thunder-shock"],[1,"quick-attack"],[1,"thunderbolt"],[1,"thunder-punch"],[30,"agility"],[40,"thunder"],[50,"wild-charge"]],
evo:[],sprite:{shape:"quad",seed:26,pal:["#e8a83e","#2b2b33","#fff3b0"]},
flavor:"Its long tail grounds excess voltage. Do not touch the tail."});
sp({id:"charmander",name:"Charmander",dex:4,cat:"regular",types:["Fire"],base:{hp:39,atk:52,def:43,spa:60,spd:50,spe:65},abilities:["Blaze"],catchRate:45,
levelMoves:[[1,"scratch"],[1,"ember"],[7,"growl"],[14,"flamethrower"],[22,"slash"],[30,"dragon-claw"],[38,"fire-blast"]],
evo:[{to:"charmeleon",by:"level",at:16}],sprite:{shape:"biped",seed:4,pal:["#e2703a","#f5d742","#ff8c42"]},
flavor:"The flame on its tail is its life bar. Keep it lit."});
sp({id:"charmeleon",name:"Charmeleon",dex:5,cat:"regular",types:["Fire"],base:{hp:58,atk:64,def:58,spa:80,spd:65,spe:80},abilities:["Blaze"],catchRate:45,
levelMoves:[[1,"scratch"],[1,"ember"],[1,"flamethrower"],[24,"slash"],[32,"dragon-claw"],[40,"fire-blast"],[48,"flare-blitz"]],
evo:[{to:"charizard",by:"level",at:36}],sprite:{shape:"biped",seed:5,pal:["#c8552e","#f5d742","#ff8c42"]},
flavor:"Teenage phase: moodier, spikier, still obsessed with fire."});
sp({id:"charizard",name:"Charizard",dex:6,cat:"regular",types:["Fire","Flying"],base:{hp:78,atk:84,def:78,spa:109,spd:85,spe:100},abilities:["Blaze"],catchRate:45,
levelMoves:[[1,"flamethrower"],[1,"wing-attack"],[36,"slash"],[42,"dragon-claw"],[48,"fire-blast"],[54,"air-slash"],[60,"flare-blitz"],[66,"earthquake"]],
evo:[],sprite:{shape:"winged",seed:6,pal:["#e2703a","#f5d742","#7ec8e3"]},
flavor:"Spits fire hot enough to melt boulders. Still not a Dragon. Don't ask."});
sp({id:"squirtle",name:"Squirtle",dex:7,cat:"regular",types:["Water"],base:{hp:44,atk:48,def:65,spa:50,spd:64,spe:43},abilities:["Torrent"],catchRate:45,
levelMoves:[[1,"tackle"],[1,"water-gun"],[7,"tail-whip"],[14,"bubble-beam"],[22,"bite"],[30,"surf"],[38,"hydro-pump"]],
evo:[{to:"wartortle",by:"level",at:16}],sprite:{shape:"biped",seed:7,pal:["#4fa8ff","#e8d8a8","#1e5fa8"]},
flavor:"Hides in its shell, then squirts. Classic mischief."});
sp({id:"wartortle",name:"Wartortle",dex:8,cat:"regular",types:["Water"],base:{hp:59,atk:63,def:80,spa:65,spd:80,spe:58},abilities:["Torrent"],catchRate:45,
levelMoves:[[1,"water-gun"],[1,"bubble-beam"],[24,"bite"],[32,"surf"],[40,"aqua-tail"],[48,"hydro-pump"]],
evo:[{to:"blastoise",by:"level",at:36}],sprite:{shape:"biped",seed:8,pal:["#3a8fd9","#e8d8a8","#1e5fa8"]},
flavor:"Its tail is furry now. Nobody knows why. It won't say."});
sp({id:"blastoise",name:"Blastoise",dex:9,cat:"regular",types:["Water"],base:{hp:79,atk:83,def:100,spa:85,spd:105,spe:78},abilities:["Torrent"],catchRate:45,
levelMoves:[[1,"surf"],[1,"bite"],[36,"hydro-pump"],[42,"ice-beam"],[48,"aqua-tail"],[54,"flash-cannon"],[60,"earthquake"]],
evo:[],sprite:{shape:"biped",seed:9,pal:["#2e6fb0","#c8c8c8","#0e3a6b"]},
flavor:"Twin cannons, zero subtlety. Car insurance hates it."});
sp({id:"bulbasaur",name:"Bulbasaur",dex:1,cat:"regular",types:["Grass","Poison"],base:{hp:45,atk:49,def:49,spa:65,spd:65,spe:45},abilities:["Overgrow"],catchRate:45,
levelMoves:[[1,"tackle"],[1,"vine-whip"],[7,"growl"],[14,"razor-leaf"],[22,"sleep-powder"],[30,"seed-bomb"],[38,"solar-beam"]],
evo:[{to:"ivysaur",by:"level",at:16}],sprite:{shape:"quad",seed:1,pal:["#6fbf4a","#3a7d2e","#d9f2c4"]},
flavor:"The bulb on its back is solar-powered. Basically a plant with legs."});
sp({id:"ivysaur",name:"Ivysaur",dex:2,cat:"regular",types:["Grass","Poison"],base:{hp:60,atk:62,def:63,spa:80,spd:80,spe:60},abilities:["Overgrow"],catchRate:45,
levelMoves:[[1,"vine-whip"],[1,"razor-leaf"],[24,"sleep-powder"],[32,"seed-bomb"],[40,"solar-beam"],[48,"sludge-bomb"]],
evo:[{to:"venusaur",by:"level",at:32}],sprite:{shape:"quad",seed:2,pal:["#5aa843","#2e6b24","#f2b8d0"]},
flavor:"Its bud smells sweet right before it blooms. And right before it wins."});
sp({id:"venusaur",name:"Venusaur",dex:3,cat:"regular",types:["Grass","Poison"],base:{hp:80,atk:82,def:83,spa:100,spd:100,spe:80},abilities:["Overgrow"],catchRate:45,
levelMoves:[[1,"seed-bomb"],[1,"razor-leaf"],[32,"solar-beam"],[40,"sludge-bomb"],[48,"earthquake"],[56,"sleep-powder"],[64,"energy-ball"]],
evo:[],sprite:{shape:"quad",seed:3,pal:["#4a9e35","#1e5c1a","#f2b8d0","#d9f2c4"]},
flavor:"Its flower photosynthesizes pure victory."});
sp({id:"geodude",name:"Geodude",dex:74,cat:"regular",types:["Rock","Ground"],base:{hp:40,atk:80,def:100,spa:30,spd:30,spe:20},abilities:["Rock Head"],catchRate:255,
levelMoves:[[1,"tackle"],[1,"rock-throw"],[12,"rock-slide"],[20,"earthquake"],[28,"stone-edge"]],
evo:[{to:"graveler",by:"level",at:25}],sprite:{shape:"blob",seed:74,pal:["#8a8a8a","#5a5a5a","#2b2b2b"]},
flavor:"Often mistaken for an ordinary rock. Takes it personally."});
sp({id:"graveler",name:"Graveler",dex:75,cat:"regular",types:["Rock","Ground"],base:{hp:55,atk:95,def:115,spa:45,spd:45,spe:35},abilities:["Rock Head"],catchRate:120,
levelMoves:[[1,"rock-throw"],[1,"rock-slide"],[28,"earthquake"],[36,"stone-edge"],[44,"rock-blast"]],
evo:[{to:"golem",by:"level",at:40}],sprite:{shape:"blob",seed:75,pal:["#7a7a7a","#4a4a4a","#2b2b2b"]},
flavor:"Rolls downhill for fun. Downhill towns have complaints on file."});
sp({id:"golem",name:"Golem",dex:76,cat:"regular",types:["Rock","Ground"],base:{hp:80,atk:120,def:130,spa:55,spd:65,spe:45},abilities:["Rock Head"],catchRate:45,
levelMoves:[[1,"earthquake"],[1,"rock-slide"],[40,"stone-edge"],[48,"iron-head"],[56,"rock-blast"],[64,"earthquake"]],
evo:[],sprite:{shape:"biped",seed:76,pal:["#6e6e6e","#3d3d3d","#a8a8a8"]},
flavor:"Sheds its shell yearly. The old shells become hiking trails."});
sp({id:"machop",name:"Machop",dex:66,cat:"regular",types:["Fighting"],base:{hp:70,atk:80,def:50,spa:35,spd:35,spe:35},abilities:["Guts"],catchRate:180,
levelMoves:[[1,"karate-chop"],[1,"leer"],[12,"brick-break"],[20,"cross-chop"],[28,"bulk-up"]],
evo:[{to:"machoke",by:"level",at:28}],sprite:{shape:"humanoid",seed:66,pal:["#8a9a9a","#5a6a6a","#2b3b3b"]},
flavor:"Trains by lifting boulders. Skips leg day never."});
sp({id:"machoke",name:"Machoke",dex:67,cat:"regular",types:["Fighting"],base:{hp:80,atk:100,def:70,spa:50,spd:60,spe:45},abilities:["Guts"],catchRate:90,
levelMoves:[[1,"karate-chop"],[1,"brick-break"],[32,"cross-chop"],[40,"bulk-up"],[48,"close-combat"]],
evo:[{to:"machamp",by:"level",at:40}],sprite:{shape:"humanoid",seed:67,pal:["#7a8a8a","#4a5a5a","#8a2a2a"]},
flavor:"Its belt regulates its power. Without it, the gym owes you a wall."});
sp({id:"machamp",name:"Machamp",dex:68,cat:"regular",types:["Fighting"],base:{hp:90,atk:130,def:80,spa:65,spd:85,spe:55},abilities:["Guts"],catchRate:45,
levelMoves:[[1,"close-combat"],[1,"cross-chop"],[44,"stone-edge"],[52,"earthquake"],[60,"bulk-up"],[68,"drain-punch"]],
evo:[],sprite:{shape:"humanoid",seed:68,pal:["#6e7e7e","#3d4d4d","#8a2a2a","#d9d9d9"]},
flavor:"Four arms, zero patience for skipping workouts."});
sp({id:"gastly",name:"Gastly",dex:92,cat:"regular",types:["Ghost","Poison"],base:{hp:30,atk:35,def:30,spa:100,spd:35,spe:80},abilities:["Levitate"],catchRate:190,
levelMoves:[[1,"hypnosis"],[1,"shadow-ball"],[12,"hex"],[20,"sludge-bomb"],[28,"dark-pulse"]],
evo:[{to:"haunter",by:"level",at:25}],sprite:{shape:"ghostly",seed:92,pal:["#5a4a7a","#2e2440","#b8a8e0"]},
flavor:"95% gas. The other 5% is attitude."});
sp({id:"haunter",name:"Haunter",dex:93,cat:"regular",types:["Ghost","Poison"],base:{hp:45,atk:50,def:45,spa:115,spd:55,spe:95},abilities:["Levitate"],catchRate:90,
levelMoves:[[1,"shadow-ball"],[1,"hex"],[28,"sludge-bomb"],[36,"dark-pulse"],[44,"hypnosis"]],
evo:[{to:"gengar",by:"level",at:40}],sprite:{shape:"ghostly",seed:93,pal:["#4a3a6a","#241c38","#b8a8e0","#e33e5a"]},
flavor:"It licks you to steal warmth. And dignity."});
sp({id:"gengar",name:"Gengar",dex:94,cat:"regular",types:["Ghost","Poison"],base:{hp:60,atk:65,def:60,spa:130,spd:75,spe:110},abilities:["Levitate"],catchRate:45,
levelMoves:[[1,"shadow-ball"],[1,"sludge-bomb"],[44,"dark-pulse"],[52,"focus-blast"],[60,"hex"],[68,"psychic"]],
evo:[],sprite:{shape:"ghostly",seed:94,pal:["#3d2f5c","#1c162e","#c9b8f0","#e33e5a"]},
flavor:"Your shadow's shadow. Grins because it knows something."});
sp({id:"abra",name:"Abra",dex:63,cat:"regular",types:["Psychic"],base:{hp:25,atk:20,def:15,spa:105,spd:55,spe:90},abilities:["Synchronize"],catchRate:200,
levelMoves:[[1,"psybeam"],[8,"calm-mind"],[14,"psychic"]],
evo:[{to:"kadabra",by:"level",at:16}],sprite:{shape:"biped",seed:63,pal:["#d9a83e","#8a6a2e","#f2e0a8"]},
flavor:"Sleeps 18 hours a day and still outsmarts everyone."});
sp({id:"kadabra",name:"Kadabra",dex:64,cat:"regular",types:["Psychic"],base:{hp:40,atk:35,def:30,spa:120,spd:70,spe:105},abilities:["Synchronize"],catchRate:100,
levelMoves:[[1,"psybeam"],[1,"psychic"],[20,"calm-mind"],[28,"shadow-ball"],[36,"recover"]],
evo:[{to:"alakazam",by:"level",at:40}],sprite:{shape:"humanoid",seed:64,pal:["#c89838","#7a5a24","#f2e0a8","#8a2a2a"]},
flavor:"Its spoon bends when it focuses. So does reality, slightly."});
sp({id:"alakazam",name:"Alakazam",dex:65,cat:"regular",types:["Psychic"],base:{hp:55,atk:50,def:45,spa:135,spd:95,spe:120},abilities:["Synchronize"],catchRate:50,
levelMoves:[[1,"psychic"],[1,"shadow-ball"],[44,"calm-mind"],[52,"focus-blast"],[60,"recover"],[68,"dazzling-gleam"]],
evo:[],sprite:{shape:"humanoid",seed:65,pal:["#d9a83e","#8a6a2e","#fff3c4","#8a2a2a","#5a4a7a"]},
flavor:"IQ of 5000. Still can't figure out why you won't just use a spoon too."});
sp({id:"snorlax",name:"Snorlax",dex:143,cat:"regular",types:["Normal"],base:{hp:160,atk:110,def:65,spa:65,spd:110,spe:30},abilities:["Thick Fat"],catchRate:25,
levelMoves:[[1,"tackle"],[1,"body-slam"],[30,"rest"],[38,"crunch"],[46,"earthquake"],[54,"hyper-voice"]],
evo:[],sprite:{shape:"biped",seed:143,pal:["#3a5a3a","#d9d9c4","#1e2e1e"]},
flavor:"Eats 400kg a day, then naps. Living the dream, literally."});
sp({id:"lapras",name:"Lapras",dex:131,cat:"regular",types:["Water","Ice"],base:{hp:130,atk:85,def:80,spa:85,spd:95,spe:60},abilities:["Water Absorb"],catchRate:45,
levelMoves:[[1,"water-gun"],[1,"surf"],[30,"ice-beam"],[38,"body-slam"],[46,"hydro-pump"],[54,"blizzard"],[62,"sing"]],
evo:[],sprite:{shape:"fish",seed:131,pal:["#4fa8ff","#e8f6ff","#1e5fa8","#7df9ff"]},
flavor:"Sings sailors to safety. Also sings them to karaoke. Both work."});
sp({id:"aerodactyl",name:"Aerodactyl",dex:142,cat:"regular",types:["Rock","Flying"],base:{hp:80,atk:105,def:65,spa:60,spd:75,spe:130},abilities:["Rock Head"],catchRate:45,
levelMoves:[[1,"wing-attack"],[1,"rock-slide"],[30,"bite"],[38,"earthquake"],[46,"stone-edge"],[54,"brave-bird"],[62,"iron-head"]],
evo:[],sprite:{shape:"winged",seed:142,pal:["#8a8a9a","#5a5a6a","#2b2b33","#e33e2b"]},
flavor:"Extinct, then un-extincted. Holds a grudge about the whole thing."});
sp({id:"dratini",name:"Dratini",dex:147,cat:"regular",types:["Dragon"],base:{hp:41,atk:64,def:45,spa:50,spd:50,spe:50},abilities:["Shed Skin"],catchRate:45,
levelMoves:[[1,"tackle"],[8,"thunder-wave"],[16,"dragon-pulse"],[24,"aqua-tail"]],
evo:[{to:"dragonair",by:"level",at:30}],sprite:{shape:"serpent",seed:147,pal:["#6a7fd9","#e8e8ff","#2e3a8a"]},
flavor:"Sheds its skin daily. Landfills of tiny dragon skins exist somewhere."});
sp({id:"dragonair",name:"Dragonair",dex:148,cat:"regular",types:["Dragon"],base:{hp:61,atk:84,def:65,spa:70,spd:70,spe:70},abilities:["Shed Skin"],catchRate:45,
levelMoves:[[1,"dragon-pulse"],[1,"aqua-tail"],[34,"thunder-wave"],[42,"ice-beam"],[50,"draco-meteor"]],
evo:[{to:"dragonite",by:"level",at:55}],sprite:{shape:"serpent",seed:148,pal:["#5a6fd0","#e8e8ff","#2e3a8a","#f2e0a8"]},
flavor:"Controls the weather with the orbs on its body. Mostly uses it for drizzle."});
sp({id:"dragonite",name:"Dragonite",dex:149,cat:"regular",types:["Dragon","Flying"],base:{hp:91,atk:134,def:95,spa:100,spd:100,spe:80},abilities:["Inner Focus"],catchRate:45,
levelMoves:[[1,"outrage"],[1,"wing-attack"],[55,"earthquake"],[62,"dragon-claw"],[70,"thunder-punch"],[78,"fire-punch"],[86,"draco-meteor"]],
evo:[],sprite:{shape:"winged",seed:149,pal:["#d9a03e","#f2e0a8","#2e8a5a"]},
flavor:"Flies around the world in 16 hours. Delivers mail. Fights gods. Multitasks."});
sp({id:"eevee",name:"Eevee",dex:133,cat:"regular",types:["Normal"],base:{hp:55,atk:55,def:50,spa:45,spd:65,spe:55},abilities:["Adaptability"],catchRate:45,
levelMoves:[[1,"tackle"],[1,"quick-attack"],[8,"tail-whip"],[16,"bite"],[24,"swift"]],
evo:[{to:"vaporeon",by:"stone",item:"water-stone"},{to:"jolteon",by:"stone",item:"thunder-stone"},{to:"flareon",by:"stone",item:"fire-stone"},{to:"espeon",by:"level",at:25},{to:"umbreon",by:"stone",item:"moon-stone"}],
sprite:{shape:"quad",seed:133,pal:["#c89858","#8a5f30","#f2e0c4"]},
flavor:"Its DNA is famously indecisive. Eight futures, one fluffy present."});
sp({id:"vaporeon",name:"Vaporeon",dex:134,cat:"regular",types:["Water"],base:{hp:130,atk:65,def:60,spa:110,spd:95,spe:65},abilities:["Water Absorb"],catchRate:45,
levelMoves:[[1,"surf"],[1,"water-gun"],[30,"ice-beam"],[38,"hydro-pump"],[46,"aqua-tail"],[54,"blizzard"]],
evo:[],sprite:{shape:"quad",seed:134,pal:["#4fa8ff","#e8f6ff","#1e5fa8"]},
flavor:"Its cells match water molecules. Science gave up explaining it."});
sp({id:"jolteon",name:"Jolteon",dex:135,cat:"regular",types:["Electric"],base:{hp:65,atk:65,def:60,spa:110,spd:95,spe:130},abilities:["Volt Absorb"],catchRate:45,
levelMoves:[[1,"thunderbolt"],[1,"thunder-shock"],[30,"thunder-wave"],[38,"thunder"],[46,"wild-charge"],[54,"agility"],[62,"chidori"]],
evo:[],sprite:{shape:"quad",seed:135,pal:["#f5d742","#fff3b0","#2b2b33"]},
flavor:"Every hair is a lightning rod. Petting it is a trust exercise."});
sp({id:"flareon",name:"Flareon",dex:136,cat:"regular",types:["Fire"],base:{hp:65,atk:130,def:60,spa:95,spd:110,spe:65},abilities:["Flash Fire"],catchRate:45,
levelMoves:[[1,"flamethrower"],[1,"ember"],[30,"fire-blast"],[38,"flare-blitz"],[46,"bite"],[54,"quick-attack"]],
evo:[],sprite:{shape:"quad",seed:136,pal:["#e2703a","#f5d742","#fff3b0"]},
flavor:"Its fluffy collar vents 900-degree air. Hugs are inadvisable."});
sp({id:"magikarp",name:"Magikarp",dex:129,cat:"regular",types:["Water"],base:{hp:20,atk:10,def:55,spa:15,spd:20,spe:80},abilities:["Swift Swim"],catchRate:255,
levelMoves:[[1,"tackle"],[15,"quick-attack"]],
evo:[{to:"gyarados",by:"level",at:20}],sprite:{shape:"fish",seed:129,pal:["#e2703a","#f2e0c4","#c8552e"]},
flavor:"The weakest Pokémon alive. Keep training it anyway. Trust the process."});
sp({id:"gyarados",name:"Gyarados",dex:130,cat:"regular",types:["Water","Flying"],base:{hp:95,atk:125,def:79,spa:60,spd:100,spe:81},abilities:["Intimidate"],catchRate:45,
levelMoves:[[1,"waterfall"],[1,"bite"],[24,"crunch"],[32,"earthquake"],[40,"hydro-pump"],[48,"outrage"],[56,"ice-beam"]],
evo:[],sprite:{shape:"serpent",seed:130,pal:["#3a6fd9","#e8e8ff","#1e3a8a","#f2e0a8"]},
flavor:"Rage incarnate. The process was worth it."});
/* ===== Gen 2 favorites ===== */
sp({id:"larvitar",name:"Larvitar",dex:246,cat:"regular",types:["Rock","Ground"],base:{hp:50,atk:64,def:50,spa:45,spd:50,spe:41},abilities:["Guts"],catchRate:45,
levelMoves:[[1,"tackle"],[1,"bite"],[12,"rock-slide"],[20,"crunch"]],
evo:[{to:"pupitar",by:"level",at:30}],sprite:{shape:"biped",seed:246,pal:["#6a8a4a","#3d5c2e","#a8c878"]},
flavor:"Eats mountains. Literally. One bite at a time."});
sp({id:"pupitar",name:"Pupitar",dex:247,cat:"regular",types:["Rock","Ground"],base:{hp:70,atk:84,def:70,spa:65,spd:70,spe:51},abilities:["Shed Skin"],catchRate:45,
levelMoves:[[1,"rock-slide"],[1,"crunch"],[34,"earthquake"],[42,"stone-edge"]],
evo:[{to:"tyranitar",by:"level",at:55}],sprite:{shape:"blob",seed:247,pal:["#5a7a3a","#2e4a24","#a8c878"]},
flavor:"A living cocoon full of compressed rage and rock gas."});
sp({id:"tyranitar",name:"Tyranitar",dex:248,cat:"regular",types:["Rock","Dark"],base:{hp:100,atk:134,def:110,spa:95,spd:100,spe:61},abilities:["Sand Stream"],catchRate:45,
levelMoves:[[1,"crunch"],[1,"stone-edge"],[55,"earthquake"],[62,"outrage"],[70,"iron-head"],[78,"dark-pulse"]],
evo:[],sprite:{shape:"biped",seed:248,pal:["#4a6a3a","#2e4a24","#8a8a8a","#d9d9d9"]},
flavor:"Its rampages redraw maps. Cartographers fear it."});
sp({id:"mareep",name:"Mareep",dex:179,cat:"regular",types:["Electric"],base:{hp:55,atk:40,def:40,spa:65,spd:45,spe:35},abilities:["Static"],catchRate:235,
levelMoves:[[1,"tackle"],[1,"thunder-shock"],[8,"thunder-wave"]],
evo:[{to:"flaaffy",by:"level",at:15}],sprite:{shape:"quad",seed:179,pal:["#f2e0a8","#e8a83e","#2b2b33"]},
flavor:"Its wool builds static. Shearing day is a light show."});
sp({id:"flaaffy",name:"Flaaffy",dex:180,cat:"regular",types:["Electric"],base:{hp:70,atk:55,def:55,spa:80,spd:60,spe:45},abilities:["Static"],catchRate:120,
levelMoves:[[1,"thunder-shock"],[1,"thunder-wave"],[18,"thunderbolt"],[26,"thunder-punch"]],
evo:[{to:"ampharos",by:"level",at:30}],sprite:{shape:"biped",seed:180,pal:["#f2d8a0","#e8a83e","#c8552e"]},
flavor:"Loses wool as it charges up. Fashion suffers for power."});
sp({id:"ampharos",name:"Ampharos",dex:181,cat:"regular",types:["Electric"],base:{hp:90,atk:75,def:85,spa:115,spd:90,spe:55},abilities:["Static"],catchRate:45,
levelMoves:[[1,"thunderbolt"],[1,"thunder-shock"],[34,"thunder"],[42,"thunder-punch"],[50,"focus-blast"],[58,"agility"]],
evo:[],sprite:{shape:"biped",seed:181,pal:["#f2d8a0","#e33e2b","#fff3b0"]},
flavor:"Its tail light is visible from space. Lighthouses filed a complaint."});
sp({id:"houndour",name:"Houndour",dex:228,cat:"regular",types:["Dark","Fire"],base:{hp:45,atk:60,def:30,spa:80,spd:50,spe:65},abilities:["Flash Fire"],catchRate:120,
levelMoves:[[1,"bite"],[1,"ember"],[12,"flamethrower"],[20,"crunch"]],
evo:[{to:"houndoom",by:"level",at:24}],sprite:{shape:"quad",seed:228,pal:["#3d3d4a","#e8e8e8","#e2703a"]},
flavor:"Travels in packs, howls at servers. Loyal to a fault."});
sp({id:"houndoom",name:"Houndoom",dex:229,cat:"regular",types:["Dark","Fire"],base:{hp:75,atk:90,def:50,spa:110,spd:80,spe:95},abilities:["Flash Fire"],catchRate:45,
levelMoves:[[1,"crunch"],[1,"flamethrower"],[28,"dark-pulse"],[36,"fire-blast"],[44,"sludge-bomb"],[52,"nasty-plot"]],
evo:[],sprite:{shape:"quad",seed:229,pal:["#2e2e3a","#d9d9d9","#e2703a","#8a2a2a"]},
flavor:"Its eerie howl is the last thing bad decisions hear."});
sp({id:"espeon",name:"Espeon",dex:196,cat:"regular",types:["Psychic"],base:{hp:65,atk:65,def:60,spa:130,spd:95,spe:110},abilities:["Synchronize"],catchRate:45,
levelMoves:[[1,"psybeam"],[1,"quick-attack"],[30,"psychic"],[38,"calm-mind"],[46,"shadow-ball"],[54,"dazzling-gleam"]],
evo:[],sprite:{shape:"quad",seed:196,pal:["#d9a8e0","#8a5a9a","#f2e0f2"]},
flavor:"Reads air currents to see the future. Mostly sees snacks."});
sp({id:"umbreon",name:"Umbreon",dex:197,cat:"regular",types:["Dark"],base:{hp:95,atk:65,def:110,spa:60,spd:130,spe:65},abilities:["Synchronize"],catchRate:45,
levelMoves:[[1,"bite"],[1,"quick-attack"],[30,"crunch"],[38,"dark-pulse"],[46,"toxic"],[54,"psychic"]],
evo:[],sprite:{shape:"quad",seed:197,pal:["#2b2b33","#f5d742","#1e1e26"]},
flavor:"Its rings glow when the moon rises. Moody, but make it lunar."});
sp({id:"riolu",name:"Riolu",dex:447,cat:"regular",types:["Fighting"],base:{hp:40,atk:70,def:40,spa:35,spd:40,spe:60},abilities:["Inner Focus"],catchRate:75,
levelMoves:[[1,"quick-attack"],[8,"brick-break"],[14,"bulk-up"],[20,"vacuum-wave"]],
evo:[{to:"lucario",by:"level",at:22}],sprite:{shape:"biped",seed:447,pal:["#4a7ec2","#2e2e3a","#f2e0c4"]},
flavor:"Senses aura like weather. Storms of emotion give it headaches."});
sp({id:"lucario",name:"Lucario",dex:448,cat:"regular",types:["Fighting","Steel"],base:{hp:70,atk:110,def:70,spa:115,spd:70,spe:90},abilities:["Inner Focus"],catchRate:45,
levelMoves:[[1,"aura-sphere"],[1,"quick-attack"],[26,"close-combat"],[34,"bullet-punch"],[42,"earthquake"],[50,"dragon-pulse"],[58,"calm-mind"]],
evo:[],sprite:{shape:"humanoid",seed:448,pal:["#3a6eb2","#2e2e3a","#f2e0c4","#d9d9d9"]},
flavor:"Reads aura, speaks little, hits hard. The strong silent type."});
sp({id:"zoroark",name:"Zoroark",dex:571,cat:"regular",types:["Dark"],base:{hp:60,atk:105,def:60,spa:120,spd:60,spe:105},abilities:["Illusion"],catchRate:45,
levelMoves:[[1,"scratch"],[1,"night-slash"],[30,"dark-pulse"],[38,"flamethrower"],[46,"nasty-plot"],[54,"sucker-punch"],[62,"shadow-ball"]],
evo:[],sprite:{shape:"biped",seed:571,pal:["#3d3d4a","#8a8a9a","#e33e2b","#2e2e3a"]},
flavor:"A master of illusion. You never actually saw it. It saw you."});
sp({id:"scyther",name:"Scyther",dex:123,cat:"regular",types:["Bug","Flying"],base:{hp:70,atk:110,def:80,spa:55,spd:80,spe:105},abilities:["Swarm"],catchRate:45,
levelMoves:[[1,"quick-attack"],[1,"wing-attack"],[24,"x-scissor"],[32,"aerial-ace"],[40,"swords-dance"]],
evo:[{to:"scizor",by:"level",at:40}],sprite:{shape:"insect",seed:123,pal:["#4a9e35","#2e6b24","#f2e0c4"]},
flavor:"Its scythes cut air itself. Lawn care nightmare."});
sp({id:"scizor",name:"Scizor",dex:212,cat:"regular",types:["Bug","Steel"],base:{hp:70,atk:130,def:100,spa:55,spd:80,spe:65},abilities:["Swarm"],catchRate:25,
levelMoves:[[1,"bullet-punch"],[1,"x-scissor"],[44,"iron-head"],[52,"swords-dance"],[60,"aerial-ace"],[68,"bug-bite"]],
evo:[],sprite:{shape:"insect",seed:212,pal:["#c8352e","#8a2420","#d9d9d9","#f2e0c4"]},
flavor:"Steel pincers crush anything. Opens jars effortlessly."});
/* ===== Gen 3 favorites ===== */
sp({id:"ralts",name:"Ralts",dex:280,cat:"regular",types:["Psychic","Fairy"],base:{hp:28,atk:25,def:25,spa:45,spd:35,spe:40},abilities:["Synchronize"],catchRate:235,
levelMoves:[[1,"growl"],[6,"psybeam"],[12,"calm-mind"]],
evo:[{to:"kirlia",by:"level",at:20}],sprite:{shape:"humanoid",seed:280,pal:["#e8f2e8","#4a9e8a","#f2b8d0"]},
flavor:"Senses emotions with its horns. Cries at sad movies."});
sp({id:"kirlia",name:"Kirlia",dex:281,cat:"regular",types:["Psychic","Fairy"],base:{hp:38,atk:35,def:35,spa:65,spd:55,spe:50},abilities:["Synchronize"],catchRate:120,
levelMoves:[[1,"psybeam"],[1,"calm-mind"],[24,"psychic"],[30,"draining-kiss"]],
evo:[{to:"gardevoir",by:"level",at:30}],sprite:{shape:"humanoid",seed:281,pal:["#e8f2e8","#3d8a76","#f2b8d0","#7df9ff"]},
flavor:"Dances when happy. Its twirls predict sunny days."});
sp({id:"gardevoir",name:"Gardevoir",dex:282,cat:"regular",types:["Psychic","Fairy"],base:{hp:68,atk:65,def:65,spa:125,spd:115,spe:80},abilities:["Synchronize"],catchRate:45,
levelMoves:[[1,"psychic"],[1,"moonblast"],[34,"calm-mind"],[42,"shadow-ball"],[50,"thunderbolt"],[58,"dazzling-gleam"]],
evo:[],sprite:{shape:"humanoid",seed:282,pal:["#e8f2e8","#2e6b5c","#f2b8d0","#7df9ff","#d9a8e0"]},
flavor:"Would create a black hole to protect its trainer. Romantic, terrifying."});
sp({id:"aron",name:"Aron",dex:304,cat:"regular",types:["Steel","Rock"],base:{hp:50,atk:70,def:100,spa:40,spd:40,spe:30},abilities:["Sturdy"],catchRate:180,
levelMoves:[[1,"tackle"],[8,"rock-throw"],[16,"iron-defense"],[24,"rock-slide"]],
evo:[{to:"lairon",by:"level",at:32}],sprite:{shape:"quad",seed:304,pal:["#8a8a9a","#5a5a6a","#2b2b33"]},
flavor:"Eats iron ore to build its armor. Chews loudly."});
sp({id:"lairon",name:"Lairon",dex:305,cat:"regular",types:["Steel","Rock"],base:{hp:60,atk:90,def:140,spa:50,spd:50,spe:40},abilities:["Sturdy"],catchRate:90,
levelMoves:[[1,"rock-slide"],[1,"iron-head"],[36,"earthquake"],[44,"iron-defense"]],
evo:[{to:"aggron",by:"level",at:42}],sprite:{shape:"quad",seed:305,pal:["#7a7a8a","#4a4a5a","#a8c8e0"]},
flavor:"Rams mountains for fun. Mountains file noise complaints."});
sp({id:"aggron",name:"Aggron",dex:306,cat:"regular",types:["Steel","Rock"],base:{hp:70,atk:110,def:180,spa:60,spd:60,spe:50},abilities:["Sturdy"],catchRate:45,
levelMoves:[[1,"iron-head"],[1,"stone-edge"],[46,"earthquake"],[54,"rock-slide"],[62,"iron-defense"]],
evo:[],sprite:{shape:"biped",seed:306,pal:["#6e6e7e","#3d3d4d","#a8c8e0","#d9d9d9"]},
flavor:"Claims a mountain as territory. Eviction is impossible."});
sp({id:"trapinch",name:"Trapinch",dex:328,cat:"regular",types:["Ground"],base:{hp:45,atk:100,def:45,spa:45,spd:45,spe:10},abilities:["Arena Trap"],catchRate:255,
levelMoves:[[1,"bite"],[10,"rock-slide"],[18,"crunch"]],
evo:[{to:"vibrava",by:"level",at:35}],sprite:{shape:"insect",seed:328,pal:["#e2703a","#8a4a24","#f2e0c4"]},
flavor:"Its jaws could bite through steel. Its legs cannot walk."});
sp({id:"vibrava",name:"Vibrava",dex:329,cat:"regular",types:["Ground","Dragon"],base:{hp:50,atk:70,def:50,spa:50,spd:50,spe:70},abilities:["Levitate"],catchRate:120,
levelMoves:[[1,"dragon-pulse"],[1,"earth-power"],[38,"bug-buzz"],[44,"air-slash"]],
evo:[{to:"flygon",by:"level",at:45}],sprite:{shape:"insect",seed:329,pal:["#4a9e5a","#2e6b3a","#e2703a"]},
flavor:"The evolved jaws became wings. Trade-off: excellent."});
sp({id:"flygon",name:"Flygon",dex:330,cat:"regular",types:["Ground","Dragon"],base:{hp:80,atk:100,def:80,spa:80,spd:80,spe:100},abilities:["Levitate"],catchRate:45,
levelMoves:[[1,"earthquake"],[1,"dragon-claw"],[48,"outrage"],[56,"earth-power"],[64,"bug-buzz"],[72,"stone-edge"]],
evo:[],sprite:{shape:"winged",seed:330,pal:["#4a9e5a","#2e6b3a","#e2703a","#f2e0c4"]},
flavor:"The desert spirit. Its wingbeats sing. Its earthquakes don't."});
sp({id:"bagon",name:"Bagon",dex:371,cat:"regular",types:["Dragon"],base:{hp:45,atk:75,def:60,spa:40,spd:30,spe:50},abilities:["Rock Head"],catchRate:45,
levelMoves:[[1,"tackle"],[1,"bite"],[12,"leer"],[20,"dragon-claw"]],
evo:[{to:"shelgon",by:"level",at:30}],sprite:{shape:"biped",seed:371,pal:["#4a7ec2","#2e4a7a","#f2e0c4"]},
flavor:"Dreams of flying. Practices by jumping off cliffs. Repeatedly."});
sp({id:"shelgon",name:"Shelgon",dex:372,cat:"regular",types:["Dragon"],base:{hp:65,atk:95,def:100,spa:60,spd:50,spe:50},abilities:["Rock Head"],catchRate:45,
levelMoves:[[1,"dragon-claw"],[1,"crunch"],[34,"protect"],[42,"dragon-pulse"]],
evo:[{to:"salamence",by:"level",at:50}],sprite:{shape:"blob",seed:372,pal:["#e8e8e8","#8a8a9a","#4a7ec2"]},
flavor:"A shell full of cells screaming to become wings."});
sp({id:"salamence",name:"Salamence",dex:373,cat:"regular",types:["Dragon","Flying"],base:{hp:95,atk:135,def:80,spa:110,spd:80,spe:100},abilities:["Intimidate"],catchRate:45,
levelMoves:[[1,"outrage"],[1,"dragon-claw"],[54,"earthquake"],[62,"flamethrower"],[70,"brave-bird"],[78,"draco-meteor"]],
evo:[],sprite:{shape:"winged",seed:373,pal:["#4a7ec2","#e33e2b","#f2e0c4","#2e2e3a"]},
flavor:"Finally flying. Never landing. Emotionally, also never landing."});
sp({id:"beldum",name:"Beldum",dex:374,cat:"regular",types:["Steel","Psychic"],base:{hp:40,atk:55,def:80,spa:35,spd:60,spe:30},abilities:["Clear Body"],catchRate:3,
levelMoves:[[1,"tackle"],[10,"iron-defense"]],
evo:[{to:"metang",by:"level",at:20}],sprite:{shape:"blob",seed:374,pal:["#8ab8d9","#4a7a9a","#e33e2b"]},
flavor:"A floating magnet claw. Communicates in static and menace."});
sp({id:"metang",name:"Metang",dex:375,cat:"regular",types:["Steel","Psychic"],base:{hp:60,atk:75,def:100,spa:55,spd:80,spe:50},abilities:["Clear Body"],catchRate:3,
levelMoves:[[1,"bullet-punch"],[1,"iron-head"],[24,"psychic"],[32,"earthquake"]],
evo:[{to:"metagross",by:"level",at:45}],sprite:{shape:"blob",seed:375,pal:["#7aa8c9","#3d6a8a","#e33e2b","#d9d9d9"]},
flavor:"Two Beldum fused by magnetism. Four brains, one grudge."});
sp({id:"metagross",name:"Metagross",dex:376,cat:"regular",types:["Steel","Psychic"],base:{hp:80,atk:135,def:130,spa:95,spd:90,spe:70},abilities:["Clear Body"],catchRate:3,
levelMoves:[[1,"bullet-punch"],[1,"iron-head"],[48,"earthquake"],[56,"psychic"],[64,"zen-headbutt"],[72,"agility"]],
evo:[],sprite:{shape:"quad",seed:376,pal:["#6e98b9","#2e5a7a","#e33e2b","#d9d9d9","#f2f2f2"]},
flavor:"Four supercomputer brains. Uses them exclusively for violence."});
sp({id:"absol",name:"Absol",dex:359,cat:"regular",types:["Dark"],base:{hp:65,atk:130,def:60,spa:75,spd:60,spe:75},abilities:["Pressure"],catchRate:30,
levelMoves:[[1,"quick-attack"],[1,"night-slash"],[28,"swords-dance"],[36,"sucker-punch"],[44,"play-rough"],[52,"stone-edge"]],
evo:[],sprite:{shape:"quad",seed:359,pal:["#e8e8f2","#8a8a9a","#3d3d4a","#5a4a7a"]},
flavor:"Appears before disasters to warn people. Gets blamed anyway. Rough gig."});

/* ===== Legendary & Mythical Pokémon: Gen 1 ===== */
var S = G.Data.SPECIES;
function sp(o){ o.anime = !!o.anime; o.fuseable = (o.fuseable !== false); S[o.id] = o; }
var LEG = function(id,name,dex,types,b,ab,cr,mv,fl,sh,seed,pal,cat){ sp({id:id,name:name,dex:dex,cat:cat||"legendary",types:types,
base:{hp:b[0],atk:b[1],def:b[2],spa:b[3],spd:b[4],spe:b[5]},abilities:[ab],catchRate:cr,levelMoves:mv,evo:[],
sprite:{shape:sh,seed:seed,pal:pal},flavor:fl}); };

LEG("articuno","Articuno",144,["Ice","Flying"],[90,85,100,95,125,85],"Pressure",3,
[[1,"ice-beam"],[1,"air-slash"],[20,"icy-wind"],[32,"blizzard"],[44,"hurricane"],[56,"agility"],[68,"reflect"]],
"Legendary bird of ice. Its wings leave trails of aurora.","winged",144,["#7dd8f2","#e8f8ff","#2e7ec2"]);
LEG("zapdos","Zapdos",145,["Electric","Flying"],[90,90,85,125,90,100],"Pressure",3,
[[1,"thunderbolt"],[1,"drill-peck"],[20,"thunder-wave"],[32,"thunder"],[44,"air-slash"],[56,"hurricane"],[68,"wild-charge"]],
"Legendary bird of lightning. Thunderstorms follow it like groupies.","winged",145,["#f5d742","#2b2b33","#ff8c42"]);
LEG("moltres","Moltres",146,["Fire","Flying"],[90,100,90,125,85,90],"Pressure",3,
[[1,"flamethrower"],[1,"wing-attack"],[20,"will-o-wisp"],[32,"fire-blast"],[44,"hurricane"],[56,"air-slash"],[68,"flare-blitz"]],
"Legendary bird of fire. Its migration ends winter. Allegedly.","winged",146,["#e2703a","#f5d742","#ff3b1f"]);
LEG("mewtwo","Mewtwo",150,["Psychic"],[106,110,90,154,90,130],"Pressure",3,
[[1,"psychic"],[1,"psycho-boost"],[20,"aura-sphere"],[32,"shadow-ball"],[44,"recover"],[56,"calm-mind"],[68,"ice-beam"],[80,"genesis-supernova"]],
"Born in a lab, raised by spite. The original 'created, not born' villain.","humanoid",150,["#c9a8e0","#8a6ab0","#e8dcf2"]);
LEG("mew","Mew",151,["Psychic"],[100,100,100,100,100,100],"Synchronize",45,
[[1,"psychic"],[1,"aura-sphere"],[20,"genesis-supernova"],[32,"ancient-power"],[44,"dragon-pulse"],[56,"dazzling-gleam"],[68,"calm-mind"],[80,"recover"]],
"The ancestor of all Pokémon. Plays dumb. Is not dumb.","quad",151,["#f2b8d0","#e08ab0","#fff0f5"],"mythical");

/* ===== Gen 2 ===== */
LEG("raikou","Raikou",243,["Electric"],[90,85,75,115,100,115],"Pressure",3,
[[1,"thunderbolt"],[1,"thunder-wave"],[24,"thunder"],[36,"calm-mind"],[48,"reflect"],[60,"wild-charge"]],
"Embodies the speed of lightning. Never sits still. Ever.","quad",243,["#f5d742","#2b2b33","#7dd8f2"]);
LEG("entei","Entei",244,["Fire"],[115,115,85,90,75,100],"Pressure",3,
[[1,"flamethrower"],[1,"bite"],[24,"sacred-fire"],[36,"fire-blast"],[48,"stone-edge"],[60,"agility"]],
"Embodies the passion of magma. Barks volcanoes into existence.","quad",244,["#8a5a33","#e2703a","#f5d742"]);
LEG("suicune","Suicune",245,["Water"],[100,75,115,90,115,85],"Pressure",3,
[[1,"surf"],[1,"ice-beam"],[24,"hydro-pump"],[36,"blizzard"],[48,"calm-mind"],[60,"agility"]],
"Embodies the fury of rain. Purifies water just by showing up.","quad",245,["#4fa8ff","#e8f6ff","#7d5ac2"]);
LEG("lugia","Lugia",249,["Psychic","Flying"],[106,90,130,90,154,110],"Pressure",3,
[[1,"aeroblast"],[1,"psychic"],[24,"hydro-pump"],[36,"blizzard"],[48,"recover"],[60,"calm-mind"],[72,"hurricane"],[84,"ancient-power"]],
"Guardian of the seas. One wingbeat is a weather event.","winged",249,["#e8e8f2","#7a9ac2","#2e4a7a"]);
LEG("ho-oh","Ho-Oh",250,["Fire","Flying"],[106,130,90,110,154,90],"Pressure",3,
[[1,"sacred-fire"],[1,"brave-bird"],[24,"flamethrower"],[36,"earthquake"],[48,"recover"],[60,"calm-mind"],[72,"fire-blast"],[84,"ancient-power"]],
"Guardian of the skies. Grants eternal happiness. No refunds.","winged",250,["#e2703a","#f5d742","#4a9e35"]);
LEG("celebi","Celebi",251,["Psychic","Grass"],[100,100,100,100,100,100],"Natural Cure",45,
[[1,"psychic"],[1,"energy-ball"],[24,"ancient-power"],[36,"recover"],[48,"calm-mind"],[60,"dazzling-gleam"],[72,"seed-bomb"]],
"The time-traveling onion fairy. Cute. Chronologically confusing.","quad",251,["#6fbf4a","#f2b8d0","#d9f2c4"],"mythical");

/* ===== Gen 3 ===== */
LEG("regirock","Regirock",377,["Rock"],[80,100,200,50,100,50],"Clear Body",3,
[[1,"stone-edge"],[1,"rock-slide"],[24,"earthquake"],[36,"iron-defense"],[48,"ancient-power"],[60,"superpower"]],
"A golem of boulders. Repairing itself since the stone age.","humanoid",377,["#8a6a4a","#5a4632","#d9c8a8"]);
LEG("regice","Regice",378,["Ice"],[80,50,100,100,200,50],"Clear Body",3,
[[1,"ice-beam"],[1,"ancient-power"],[24,"blizzard"],[36,"thunderbolt"],[48,"amnesia"],[60,"earth-power"]],
"A golem of Antarctic ice. Cold storage for ancient grudges.","humanoid",378,["#7dd8f2","#4a9ec2","#e8f8ff"]);
LEG("registeel","Registeel",379,["Steel"],[80,75,150,75,150,50],"Clear Body",3,
[[1,"iron-head"],[1,"flash-cannon"],[24,"earthquake"],[36,"iron-defense"],[48,"amnesia"],[60,"ancient-power"]],
"A golem of meteor metal. Harder than your ranked grind.","humanoid",379,["#8a8a9a","#4a4a5a","#d9d9e0"]);
LEG("latias","Latias",380,["Dragon","Psychic"],[80,80,90,110,130,110],"Levitate",3,
[[1,"psychic"],[1,"dragon-pulse"],[24,"calm-mind"],[36,"recover"],[48,"ice-beam"],[60,"thunderbolt"]],
"The eon Pokémon. Shares emotions. Shares snacks. Mostly snacks.","winged",380,["#e33e5a","#f2f2f2","#f5d742"]);
LEG("latios","Latios",381,["Dragon","Psychic"],[80,90,80,130,110,110],"Levitate",3,
[[1,"psychic"],[1,"dragon-pulse"],[24,"draco-meteor"],[36,"calm-mind"],[48,"thunderbolt"],[60,"ice-beam"],[72,"recover"]],
"Faster than a jet, smarter than your group chat.","winged",381,["#4a7ec2","#f2f2f2","#2e4a7a"]);
LEG("kyogre","Kyogre",382,["Water"],[100,100,90,150,140,90],"Drizzle",3,
[[1,"origin-pulse"],[1,"surf"],[24,"hydro-pump"],[36,"ice-beam"],[48,"blizzard"],[60,"thunder"],[72,"calm-mind"],[84,"ancient-power"]],
"Embodiment of the sea. Expands oceans. HOA of the planet.","fish",382,["#2e5fc2","#e8f0ff","#e33e2b"]);
LEG("groudon","Groudon",383,["Ground"],[100,150,140,100,90,90],"Drought",3,
[[1,"precipice-blades"],[1,"earthquake"],[24,"stone-edge"],[36,"fire-blast"],[48,"solar-beam"],[60,"bulk-up"],[72,"ancient-power"],[84,"dragon-claw"]],
"Embodiment of land. Sunbathing causes droughts. Sorry.","quad",383,["#c8352e","#2b2b33","#f5d742"]);
LEG("rayquaza","Rayquaza",384,["Dragon","Flying"],[105,150,90,150,90,95],"Air Lock",3,
[[1,"outrage"],[1,"draco-meteor"],[24,"dragon-pulse"],[36,"earthquake"],[48,"hurricane"],[60,"ancient-power"],[72,"iron-head"]],
"Sky guardian. Eats meteors. Settles god-fights from orbit.","serpent",384,["#4a9e35","#f5d742","#e33e2b"]);
LEG("jirachi","Jirachi",385,["Steel","Psychic"],[100,100,100,100,100,100],"Serene Grace",3,
[[1,"doom-desire"],[1,"psychic"],[24,"iron-head"],[36,"zen-headbutt"],[48,"calm-mind"],[60,"thunderbolt"],[72,"cosmic-power"],[84,"recover"]],
"Grants wishes one week per millennium. Book early.","humanoid",385,["#f2e0a8","#e8a83e","#7dd8f2"],"mythical");
LEG("deoxys","Deoxys",386,["Psychic"],[50,150,50,150,50,150],"Pressure",3,
[[1,"psycho-boost"],[1,"psychic"],[24,"shadow-ball"],[36,"ice-beam"],[48,"thunderbolt"],[60,"recover"],[72,"nasty-plot"],[84,"agility"]],
"A space virus that learned karate. DNA of pure offense.","humanoid",386,["#e2703a","#2e4a3a","#7df9ff"],"mythical");

/* ===== Gen 4 ===== */
LEG("uxie","Uxie",480,["Psychic"],[75,75,130,75,130,95],"Levitate",3,
[[1,"psychic"],[1,"calm-mind"],[24,"amnesia"],[36,"thunderbolt"],[48,"shadow-ball"],[60,"ancient-power"]],
"Being of knowledge. One glance erases memories. Rude.","quad",480,["#f5d742","#8a7a2e","#7dd8f2"]);
LEG("mesprit","Mesprit",481,["Psychic"],[80,105,105,105,105,80],"Levitate",3,
[[1,"psychic"],[1,"dazzling-gleam"],[24,"ice-beam"],[36,"thunderbolt"],[48,"calm-mind"],[60,"shadow-ball"]],
"Being of emotion. Taught humans joy, sorrow, and drama.","quad",481,["#f2b8d0","#c27ab0","#7dd8f2"]);
LEG("azelf","Azelf",482,["Psychic"],[75,125,70,125,70,115],"Levitate",3,
[[1,"psychic"],[1,"nasty-plot"],[24,"flamethrower"],[36,"thunderbolt"],[48,"shadow-ball"],[60,"ancient-power"]],
"Being of willpower. Sleeps to keep humans from doing anything rash.","quad",482,["#7dd8f2","#4a8ab0","#f5d742"]);
LEG("dialga","Dialga",483,["Steel","Dragon"],[100,120,120,150,100,90],"Pressure",3,
[[1,"roar-of-time"],[1,"draco-meteor"],[24,"flash-cannon"],[36,"earth-power"],[48,"thunderbolt"],[60,"ancient-power"],[72,"iron-tail"]],
"Controls time. Still shows up late to meetings. Ironic.","quad",483,["#4a7ec2","#2e4a7a","#7df9ff"]);
LEG("palkia","Palkia",484,["Water","Dragon"],[90,120,100,150,120,100],"Pressure",3,
[[1,"spacial-rend"],[1,"hydro-pump"],[24,"draco-meteor"],[36,"earth-power"],[48,"thunderbolt"],[60,"ancient-power"],[72,"aura-sphere"]],
"Controls space. Its personal space is the entire universe.","winged",484,["#c27ac2","#7a4a8a","#f2b8e0"]);
LEG("heatran","Heatran",485,["Fire","Steel"],[91,90,106,130,106,77],"Flash Fire",3,
[[1,"flamethrower"],[1,"flash-cannon"],[24,"fire-blast"],[36,"earth-power"],[48,"stone-edge"],[60,"ancient-power"]],
"Born in magma. Its blood is lava. Do not donate.","quad",485,["#8a5a33","#e2703a","#5a5a5a"]);
LEG("regigigas","Regigigas",486,["Normal"],[110,160,110,80,110,100],"Slow Start",3,
[[1,"body-slam"],[1,"earthquake"],[24,"stone-edge"],[36,"iron-head"],[48,"drain-punch"],[60,"ancient-power"],[72,"thunder-punch"],[84,"ice-punch"]],
"Dragged continents with ropes. Needs five turns to wake up. Same.","biped",486,["#e8e8d0","#8a8a6a","#c8352e"]);
LEG("giratina","Giratina",487,["Ghost","Dragon"],[150,100,120,100,120,90],"Pressure",3,
[[1,"shadow-force"],[1,"dragon-claw"],[24,"shadow-ball"],[36,"draco-meteor"],[48,"earth-power"],[60,"ancient-power"],[72,"outrage"],[84,"hex"]],
"Banished to the Distortion World for violence. Has not calmed down.","serpent",487,["#3a3a4a","#c9a227","#8a8a9a"],true);
LEG("cresselia","Cresselia",488,["Psychic"],[120,70,120,75,130,85],"Levitate",3,
[[1,"psychic"],[1,"moonblast"],[24,"ice-beam"],[36,"calm-mind"],[48,"recover"],[60,"ancient-power"]],
"Bringer of pleasant dreams. Darkrai's eternal group-project partner.","winged",488,["#f2e0a8","#e8a83e","#7d5ac2"]);
LEG("darkrai","Darkrai",491,["Dark"],[70,90,90,135,90,125],"Bad Dreams",3,
[[1,"dark-pulse"],[1,"hypnosis"],[24,"shadow-ball"],[36,"focus-blast"],[48,"nasty-plot"],[60,"ice-beam"],[72,"thunderbolt"]],
"Gives nightmares it can't control. The misunderstood edgelord.","ghostly",491,["#2b2b33","#e8e8f2","#e33e2b"],"mythical");
LEG("shaymin","Shaymin",492,["Grass"],[100,100,100,100,100,100],"Natural Cure",45,
[[1,"seed-bomb"],[1,"energy-ball"],[24,"psychic"],[36,"air-slash"],[48,"ancient-power"],[60,"growth"]],
"Gratitude Pokémon. Turns wastelands into flower fields. Wholesome.","quad",492,["#6fbf4a","#f2b8d0","#d9f2c4"],"mythical");
LEG("arceus","Arceus",493,["Normal"],[120,120,120,120,120,120],"Multitype",3,
[[1,"judgment"],[1,"ancient-power"],[24,"earth-power"],[36,"ice-beam"],[48,"thunderbolt"],[60,"flamethrower"],[72,"recover"],[84,"cosmic-power"],[96,"hyper-voice"]],
"The Original One. Shaped the universe with a thousand arms. Busy.","quad",493,["#f2f2e8","#c9a227","#8a8a6a"],true);
LEG("phione","Phione",489,["Water"],[80,80,80,80,80,80],"Hydration",30,
[[1,"surf"],[1,"ice-beam"],[24,"ancient-power"],[36,"recover"]],
"A mythical drifter of warm seas. Nobody knows where it comes from.","blob",489,["#4fa8ff","#e8f6ff","#f2b8d0"],"mythical");
LEG("manaphy","Manaphy",490,["Water"],[100,100,100,100,100,100],"Hydration",3,
[[1,"surf"],[1,"ice-beam"],[24,"psychic"],[36,"energy-ball"],[48,"ancient-power"],[60,"calm-mind"],[72,"recover"],[84,"nasty-plot"]],
"Prince of the sea. Its cry bonds any Pokémon to it. Charismatic.","blob",490,["#4fa8ff","#e8f6ff","#f2e0a8"],"mythical");

/* ===== Gen 5 ===== */
LEG("victini","Victini",494,["Psychic","Fire"],[100,100,100,100,100,100],"Victory Star",3,
[[1,"v-create"],[1,"psychic"],[24,"fusion-flare"],[36,"fusion-bolt"],[48,"thunderbolt"],[60,"focus-blast"],[72,"zen-headbutt"],[84,"work-up"]],
"Victory incarnate. Brings luck to trainers. Loses at rock-paper-scissors.","biped",494,["#e2703a","#f2e0a8","#7dd8f2"],"mythical");
LEG("cobalion","Cobalion",638,["Steel","Fighting"],[91,90,129,90,72,108],"Justified",3,
[[1,"iron-head"],[1,"sacred-sword"],[24,"stone-edge"],[36,"close-combat"],[48,"swords-dance"],[60,"quick-attack"]],
"Leader of the Swords of Justice. Judges humans. Strictly.","quad",638,["#4a7ec2","#2e4a7a","#f5d742"]);
LEG("terrakion","Terrakion",639,["Rock","Fighting"],[91,129,90,72,90,108],"Justified",3,
[[1,"stone-edge"],[1,"sacred-sword"],[24,"close-combat"],[36,"earthquake"],[48,"swords-dance"],[60,"rock-slide"]],
"Shatters castle walls with a charge. The bulldozer of justice.","quad",639,["#8a6a4a","#5a4632","#d9c8a8"]);
LEG("virizion","Virizion",640,["Grass","Fighting"],[91,90,72,90,129,108],"Justified",3,
[[1,"leaf-blade"],[1,"sacred-sword"],[24,"close-combat"],[36,"stone-edge"],[48,"swords-dance"],[60,"energy-ball"]],
"Protects Pokémon with whiplash speed. Graceful. Judgmental.","quad",640,["#4a9e5a","#2e6b3a","#f2b8d0"]);
LEG("tornadus","Tornadus",641,["Flying"],[79,115,70,125,80,111],"Prankster",3,
[[1,"hurricane"],[1,"air-slash"],[24,"focus-blast"],[36,"nasty-plot"],[48,"agility"],[60,"dark-pulse"]],
"A storm cloud with attitude. Fights its brother for fun.","winged",641,["#4a9e5a","#2e6b3a","#7dd8f2"]);
LEG("thundurus","Thundurus",642,["Electric","Flying"],[79,115,70,125,80,111],"Prankster",3,
[[1,"thunder"],[1,"thunderbolt"],[24,"focus-blast"],[36,"nasty-plot"],[48,"agility"],[60,"dark-pulse"]],
"Fires lightning from its tail. The sky's problem child.","winged",642,["#4a7ec2","#2e4a7a","#f5d742"]);
LEG("reshiram","Reshiram",643,["Dragon","Fire"],[100,120,100,150,120,90],"Turboblaze",3,
[[1,"blue-flare"],[1,"fusion-flare"],[24,"draco-meteor"],[36,"dragon-pulse"],[48,"focus-blast"],[60,"ancient-power"],[72,"flamethrower"]],
"Vast white truth. Burns away lies. And forests. Mostly lies.","winged",643,["#f2f2e8","#d9d9d9","#7dd8f2"]);
LEG("zekrom","Zekrom",644,["Dragon","Electric"],[100,150,120,100,120,90],"Teravolt",3,
[[1,"bolt-strike"],[1,"fusion-bolt"],[24,"outrage"],[36,"dragon-claw"],[48,"stone-edge"],[60,"ancient-power"],[72,"wild-charge"]],
"Deep black ideals. Its tail is a generator. Plug in responsibly.","winged",644,["#2b2b33","#4a4a5a","#7df9ff"]);
LEG("landorus","Landorus",645,["Ground","Flying"],[89,125,90,115,80,101],"Sand Force",3,
[[1,"earthquake"],[1,"stone-edge"],[24,"earth-power"],[36,"rock-slide"],[48,"bulk-up"],[60,"iron-tail"]],
"Brings harvests wherever it lands. Farmers worship it. Deservedly.","winged",645,["#e2703a","#8a4a24","#4a9e5a"]);
LEG("kyurem","Kyurem",646,["Dragon","Ice"],[125,130,90,130,90,95],"Pressure",3,
[[1,"ice-beam"],[1,"blizzard"],[24,"draco-meteor"],[36,"dragon-pulse"],[48,"ancient-power"],[60,"earth-power"]],
"An empty husk awaiting its other halves. Cold, literally and emotionally.","winged",646,["#8ab8d9","#4a7a9a","#f5d742"]);
LEG("keldeo","Keldeo",647,["Water","Fighting"],[91,72,90,129,90,108],"Justified",3,
[[1,"secret-sword"],[1,"hydro-pump"],[24,"surf"],[36,"close-combat"],[48,"calm-mind"],[60,"ice-beam"]],
"The youngest Sword of Justice. Still learning. Already dangerous.","quad",647,["#4fa8ff","#e8f6ff","#e33e2b"],"mythical");
LEG("meloetta","Meloetta",648,["Normal","Psychic"],[100,77,77,128,128,90],"Serene Grace",3,
[[1,"relic-song"],[1,"psychic"],[24,"hyper-voice"],[36,"close-combat"],[48,"calm-mind"],[60,"thunderbolt"],[72,"shadow-ball"]],
"Its songs move hearts and boulders. Tour schedule: classified.","humanoid",648,["#3d5a3a","#6fbf4a","#f2e0a8"],"mythical");
LEG("genesect","Genesect",649,["Bug","Steel"],[71,120,95,120,95,99],"Download",3,
[[1,"techno-blast"],[1,"iron-head"],[24,"x-scissor"],[36,"thunderbolt"],[48,"ice-beam"],[60,"flamethrower"],[72,"bug-buzz"],[84,"flash-cannon"]],
"Ancient predator upgraded by science. Team Plasma's resume highlight.","insect",649,["#7a5a8a","#4a3a5a","#c9a227"],"mythical");

/* ===== Gen 6 ===== */
LEG("xerneas","Xerneas",716,["Fairy"],[126,131,95,131,98,99],"Fairy Aura",3,
[[1,"moonblast"],[1,"dazzling-gleam"],[24,"thunderbolt"],[36,"focus-blast"],[48,"psychic"],[60,"calm-mind"],[72,"ancient-power"]],
"Giver of eternal life. Its antlers are a rainbow. A literal rainbow.","quad",716,["#4a7ec2","#2e4a7a","#f2b8d0"]);
LEG("yveltal","Yveltal",717,["Dark","Flying"],[126,131,95,131,98,99],"Dark Aura",3,
[[1,"oblivion-wing"],[1,"dark-pulse"],[24,"hurricane"],[36,"psychic"],[48,"focus-blast"],[60,"sucker-punch"],[72,"ancient-power"]],
"Taker of life. Sleeps as a cocoon. Do not poke the cocoon.","winged",717,["#c8352e","#2b2b33","#4a4a5a"]);
LEG("zygarde","Zygarde",718,["Dragon","Ground"],[108,100,121,81,95,95],"Aura Break",3,
[[1,"thousand-arrows"],[1,"core-enforcer"],[24,"outrage"],[36,"earthquake"],[48,"stone-edge"],[60,"dragon-pulse"],[72,"bulk-up"]],
"Order incarnate. Watches ecosystems. Judges yours.","serpent",718,["#4a9e35","#2e6b3a","#e33e2b"]);
LEG("diancie","Diancie",719,["Rock","Fairy"],[50,100,150,100,150,50],"Clear Body",3,
[[1,"diamond-storm"],[1,"moonblast"],[24,"power-gem"],[36,"ancient-power"],[48,"calm-mind"],[60,"dazzling-gleam"],[72,"earth-power"]],
"A Carbink that got a glow-up. Royalty of the diamond domain.","humanoid",719,["#f2b8d0","#e08ab0","#7dd8f2"],"mythical");
LEG("hoopa","Hoopa",720,["Psychic","Ghost"],[80,110,60,150,130,70],"Magician",3,
[[1,"hyperspace-hole"],[1,"psychic"],[24,"shadow-ball"],[36,"focus-blast"],[48,"nasty-plot"],[60,"thunderbolt"]],
"Mischief through rings. Teleports things. Usually the wrong things.","ghostly",720,["#e8a83e","#8a5a2e","#7d5ac2"],"mythical");
LEG("volcanion","Volcanion",721,["Fire","Water"],[80,110,120,130,90,70],"Water Absorb",3,
[[1,"steam-eruption"],[1,"flamethrower"],[24,"hydro-pump"],[36,"earth-power"],[48,"ancient-power"]],
"A steam-powered loner. Hates humans. Loves explosions. Fair.","quad",721,["#c8352e","#4fa8ff","#8a8a8a"],"mythical");


/* Giratina & Arceus are never fuseable (box-art rule). */
G.Data.SPECIES.giratina.fuseable = false;
G.Data.SPECIES.arceus.fuseable = false;
G.Data.SPECIES.giratina.cat = "legendary";
G.Data.SPECIES.arceus.cat = "legendary";

/* ===== Gen 7 ===== */
