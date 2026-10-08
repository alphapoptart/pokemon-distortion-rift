/* Pokémon: Distortion Rift — anime allies. NOT fuseable. */
window.G = window.G || {};
(function(){
var S = G.Data.SPECIES;
function sp(o){ o.cat = "anime"; o.anime = true; o.fuseable = false; S[o.id] = o; }
function A(id,name,dex,types,b,ab,mv,evo,fl,seed,pal){
  sp({id:id,name:name,dex:dex,types:types,
    base:{hp:b[0],atk:b[1],def:b[2],spa:b[3],spd:b[4],spe:b[5]},
    abilities:[ab],catchRate:3,levelMoves:mv,evo:evo||[],
    sprite:{shape:"humanoid",seed:seed,pal:pal},flavor:fl});
}

/* ===== GOKU — 7 stages ===== */
A("goku","Goku",1601,["Fighting"],[75,95,70,60,70,90],"Saiyan Spirit",
[[1,"tackle"],[1,"quick-attack"],[8,"mach-punch"],[16,"brick-break"],[24,"kamehameha"],[32,"bulk-up"]],
[{to:"goku-ssj",by:"level",at:32}],
"An alien martial artist who fell from the sky. Hungry. Always hungry.",1601,["#e2703a","#2b2b33","#f2e0c4"]);
A("goku-ssj","Super Saiyan Goku",1602,["Fighting"],[85,120,85,80,85,110],"Saiyan Spirit",
[[1,"kamehameha"],[1,"brick-break"],[32,"bulk-up"],[36,"spirit-bomb"],[42,"close-combat"]],
[{to:"goku-ssj2",by:"level",at:40}],
"Golden hair, zero chill. The legend that started a thousand playground debates.",1602,["#f5d742","#e2703a","#f2e0c4"]);
A("goku-ssj2","SSJ2 Goku",1603,["Fighting"],[90,135,95,90,95,120],"Saiyan Spirit",
[[1,"kamehameha"],[1,"spirit-bomb"],[40,"close-combat"],[44,"superpower"],[48,"agility"]],
[{to:"goku-ssj3",by:"level",at:48}],
"Lightning crackles around him. The hair defies physics and barbers.",1603,["#f5d742","#fff3b0","#e2703a"]);
A("goku-ssj3","SSJ3 Goku",1604,["Fighting"],[95,150,100,100,100,130],"Saiyan Spirit",
[[1,"kamehameha"],[1,"spirit-bomb"],[48,"superpower"],[52,"close-combat"],[56,"dragon-dance"]],
[{to:"goku-ssg",by:"level",at:56}],
"Hair for days. Power for eons. Stamina for about five minutes.",1604,["#f5d742","#e2703a","#fff3b0"]);
A("goku-ssg","SSG Goku",1605,["Fighting","Fire"],[100,160,105,120,110,140],"God Ki",
[[1,"kamehameha"],[1,"spirit-bomb"],[56,"calm-mind"],[60,"close-combat"],[64,"agility"]],
[{to:"goku-ssb",by:"level",at:64}],
"A god's calm wrapped in a brawler's grin. The ritual worked. Mostly.",1605,["#e33e5a","#e2703a","#f2e0c4"]);
A("goku-ssb","SSB Goku",1606,["Fighting","Electric"],[105,175,110,135,115,150],"God Ki",
[[1,"kamehameha"],[1,"spirit-bomb"],[64,"thunder-punch"],[68,"close-combat"],[72,"bulk-up"]],
[{to:"goku-ui",by:"level",at:72}],
"Blue hair, blue aura, red flags for anyone standing across from him.",1606,["#4fa8ff","#2e5fc2","#e2703a"]);
A("goku-ui","Ultra Instinct Goku",1607,["Fighting","Psychic"],[110,185,120,150,130,170],"Autonomous Ultra Instinct",
[[1,"kamehameha"],[1,"spirit-bomb"],[72,"infinity-guard"],[76,"close-combat"],[80,"agility"],[84,"calm-mind"]],
[],
"His body moves before his mind can ruin it. The ultimate dodge. The ultimate hair.",1607,["#c9c9d9","#7a7a8a","#e2703a"]);

/* ===== LUFFY — 5 stages ===== */
A("luffy","Luffy",1608,["Fighting"],[80,85,75,60,65,85],"Rubber Body",
[[1,"pound"],[1,"quick-attack"],[10,"mach-punch"],[18,"brick-break"],[26,"bulk-up"]],
[{to:"luffy-g2",by:"level",at:28}],
"A rubber pirate captain. Future King. Current menace to lunch.",1608,["#e33e2b","#2b2b33","#f2e0c4"]);
A("luffy-g2","Gear 2 Luffy",1609,["Fighting"],[85,105,80,70,75,115],"Rubber Body",
[[1,"mach-punch"],[1,"brick-break"],[28,"agility"],[34,"close-combat"]],
[{to:"luffy-g3",by:"level",at:36}],
"Pumps his legs like bellows. Steams. Screams. Wins.",1609,["#e33e2b","#ff8c42","#f2e0c4"]);
A("luffy-g3","Gear 3 Luffy",1610,["Fighting"],[95,125,95,70,80,70],"Rubber Body",
[[1,"brick-break"],[1,"close-combat"],[36,"superpower"],[42,"body-slam"]],
[{to:"luffy-g4",by:"level",at:44}],
"Inflates his bones into a giant's fist. Physics filed a complaint.",1610,["#e33e2b","#f2e0a8","#f2e0c4"]);
A("luffy-g4","Gear 4 Luffy",1611,["Fighting"],[100,140,110,80,90,95],"Rubber Body",
[[1,"close-combat"],[1,"superpower"],[44,"bulk-up"],[50,"drain-punch"]],
[{to:"luffy-g5",by:"level",at:56}],
"Boundman mode: bouncy, burly, and bouncing off the walls. Literally.",1611,["#e33e2b","#2b2b33","#ff8c42"]);
A("luffy-g5","Gear 5: Nika",1612,["Fighting","Fire"],[110,160,110,110,100,130],"Warrior of Liberation",
[[1,"bajrang-gun"],[1,"close-combat"],[56,"superpower"],[62,"agility"],[68,"bulk-up"]],
[],
"The Sun God awakens. Reality becomes a cartoon. The drums of liberation never stop.",1612,["#f2f2e8","#e33e2b","#f5d742"]);

/* ===== GOJO — 3 stages ===== */
A("gojo","Gojo",1613,["Psychic"],[70,60,80,110,120,95],"Six Eyes",
[[1,"psybeam"],[8,"calm-mind"],[16,"psychic"],[24,"hollow-purple"],[32,"light-screen"]],
[{to:"gojo-sorcerer",by:"level",at:32}],
"The strongest sorcerer. Blindfolded. Still sees your strategy. Still unimpressed.",1613,["#e8e8f2","#2b2b33","#7dd8f2"]);
A("gojo-sorcerer","Gojo: Sorcerer",1614,["Psychic"],[80,70,95,140,150,110],"Six Eyes",
[[1,"psychic"],[1,"hollow-purple"],[32,"infinity-guard"],[38,"calm-mind"],[44,"hyperspace-hole"]],
[{to:"gojo-honored",by:"level",at:52}],
"Limitless cursed technique. Between him and you: infinity. Good luck.",1614,["#d9d9e8","#2b2b33","#4fa8ff"]);
A("gojo-honored","Gojo: The Honored One",1615,["Psychic"],[90,80,110,170,180,130],"Six Eyes",
[[1,"hollow-purple"],[1,"domain-expansion"],[52,"infinity-guard"],[58,"calm-mind"],[64,"psychic"],[70,"nasty-plot"]],
[],
"Throughout heaven and earth, he alone is the honored one. He will remind you.",1615,["#ffffff","#7d5ac2","#4fa8ff"]);

/* ===== NARUTO — 4 stages ===== */
A("naruto","Naruto",1616,["Fighting"],[75,90,70,65,70,90],"Nine-Tails Chakra",
[[1,"scratch"],[8,"quick-attack"],[16,"rasengan"],[24,"brick-break"],[30,"bulk-up"]],
[{to:"naruto-sage",by:"level",at:30}],
"A knucklehead ninja with a demon fox roommate. Never gives up. Never shuts up.",1616,["#e8a83e","#2b4a8a","#f2e0c4"]);
A("naruto-sage","Sage Naruto",1617,["Fighting","Ground"],[85,115,90,80,90,105],"Sage Mode",
[[1,"rasengan"],[1,"brick-break"],[30,"earth-power"],[36,"close-combat"],[42,"bulk-up"]],
[{to:"naruto-kcm",by:"level",at:42}],
"Toad sage training complete. Senses everything. Still pranks everyone.",1617,["#e8a83e","#c8352e","#f2e0c4"]);
A("naruto-kcm","KCM Naruto",1618,["Fighting","Electric"],[90,135,95,95,100,130],"Nine-Tails Chakra Mode",
[[1,"rasengan"],[1,"close-combat"],[42,"thunder-punch"],[48,"agility"],[54,"superpower"]],
[{to:"naruto-sixpaths",by:"level",at:58}],
"A blazing golden cloak of chakra. Speed that embarrasses teleportation.",1618,["#f5d742","#ff8c42","#2b2b33"]);
A("naruto-sixpaths","Six Paths Naruto",1619,["Fighting","Fairy"],[100,155,110,130,120,145],"Six Paths Sage Mode",
[[1,"rasengan"],[1,"spirit-bomb"],[58,"close-combat"],[64,"moonblast"],[70,"recover"],[76,"calm-mind"]],
[],
"The reincarnation of ninja Jesus. Truth-seeking orbs included. No refunds.",1619,["#f2f2e8","#c9a227","#e8a83e"]);

/* ===== ICHIGO — 3 stages ===== */
A("ichigo","Ichigo",1620,["Ghost","Fighting"],[80,100,75,70,70,95],"Soul Reaper",
[[1,"slash"],[10,"shadow-claw"],[18,"getsuga-tensho"],[26,"brick-break"],[34,"swords-dance"]],
[{to:"ichigo-bankai",by:"level",at:34}],
"A substitute Soul Reaper with a very big sword and very big attitude.",1620,["#e2703a","#2b2b33","#f2e0c4"]);
A("ichigo-bankai","Bankai Ichigo",1621,["Ghost","Fighting"],[90,130,85,85,85,130],"Tensa Zangetsu",
[[1,"getsuga-tensho"],[1,"shadow-claw"],[34,"agility"],[40,"close-combat"],[46,"swords-dance"]],
[{to:"ichigo-hos",by:"level",at:52}],
"Bankai: a black blade and speed that breaks sound barriers. And friendships.",1621,["#2b2b33","#4a4a5a","#e2703a"]);
A("ichigo-hos","Horn of Salvation",1622,["Ghost","Fighting"],[100,155,100,110,100,145],"Merged Hollow",
[[1,"getsuga-tensho"],[1,"close-combat"],[52,"shadow-force"],[58,"superpower"],[64,"agility"],[70,"bulk-up"]],
[],
"Shinigami and Hollow, fused at last. One horn, zero mercy, all drip.",1622,["#e8e8f2","#2b2b33","#c9a227"]);

/* ===== DEKU — 3 stages ===== */
A("deku","Deku",1623,["Fighting","Electric"],[70,85,70,60,70,80],"One For All",
[[1,"tackle"],[8,"quick-attack"],[16,"thunder-punch"],[24,"brick-break"],[30,"bulk-up"]],
[{to:"deku-cowling",by:"level",at:30}],
"A quirkless kid who inherited everything. Cries. Then wins anyway.",1623,["#4a9e35","#e33e2b","#f2e0c4"]);
A("deku-cowling","Full Cowling Deku",1624,["Fighting","Electric"],[80,110,85,75,85,105],"One For All: Full Cowling",
[[1,"thunder-punch"],[1,"brick-break"],[30,"agility"],[36,"detroit-smash"],[42,"close-combat"]],
[{to:"deku-100",by:"level",at:48}],
"Green lightning veins, full-body control. The muttering never stops.",1624,["#4a9e35","#7df9ff","#f2e0c4"]);
A("deku-100","100% Deku",1625,["Fighting","Electric"],[90,140,95,90,95,130],"One For All: 100%",
[[1,"detroit-smash"],[1,"close-combat"],[48,"thunder-punch"],[54,"superpower"],[60,"agility"],[66,"bulk-up"]],
[],
"One hundred percent of a legend. Bones: optional. Victory: mandatory.",1625,["#2e7d22","#f5d742","#e33e2b"]);

/* ===== TANJIRO — 3 stages ===== */
A("tanjiro","Tanjiro",1626,["Fire","Fighting"],[75,90,70,70,70,85],"Total Concentration",
[[1,"scratch"],[10,"slash"],[18,"flamethrower"],[26,"brick-break"],[35,"swords-dance"]],
[{to:"tanjiro-hinokami",by:"level",at:35}],
"A kind boy with a hard head and a box carrying his sister. Do not touch the box.",1626,["#8a2a2a","#2b2b33","#f2e0c4"]);
A("tanjiro-hinokami","Hinokami Tanjiro",1627,["Fire","Fighting"],[85,115,85,95,85,105],"Hinokami Kagura",
[[1,"hinokami-kagura"],[1,"flamethrower"],[35,"swords-dance"],[42,"close-combat"],[48,"fire-blast"]],
[{to:"tanjiro-hashira",by:"level",at:52}],
"Dances the fire god's kagura. Demons hate this one simple trick.",1627,["#e2703a","#ff3b1f","#2b2b33"]);
A("tanjiro-hashira","Sun Hashira Tanjiro",1628,["Fire","Fighting"],[95,140,100,115,100,125],"Sun Breathing Master",
[[1,"hinokami-kagura"],[1,"fire-blast"],[52,"sacred-fire"],[58,"close-combat"],[64,"swords-dance"],[70,"agility"]],
[],
"The original breath, reborn. The sun itself fights through him.",1628,["#f5d742","#e2703a","#ff3b1f"]);

/* ===== SAITAMA — 2 stages ===== */
A("saitama","Caped Baldy",1629,["Fighting","Normal"],[90,130,100,50,100,90],"Unbothered",
[[1,"pound"],[10,"mach-punch"],[20,"brick-break"],[30,"close-combat"],[40,"bulk-up"]],
[{to:"saitama-serious",by:"level",at:40}],
"A hero for fun. Lost his hair, found infinite power. Fair trade.",1629,["#f2e0c4","#e8a83e","#f2f2e8"]);
A("saitama-serious","Serious Saitama",1630,["Fighting","Normal"],[100,180,120,60,120,110],"Serious Series",
[[1,"one-punch"],[1,"close-combat"],[40,"superpower"],[48,"agility"],[56,"bulk-up"],[64,"body-slam"]],
[],
"He got serious. The fight ended three panels ago. You're watching the epilogue.",1630,["#f2e0c4","#e8a83e","#c8352e"]);

/* sanity: all anime learnsets must reference real moves */
(function(){
var bad = [];
Object.keys(G.Data.SPECIES).forEach(function(id){
  var s = G.Data.SPECIES[id];
  if(s.cat !== "anime") return;
  (s.levelMoves||[]).forEach(function(lm){ if(!G.Data.MOVES[lm[1]]) bad.push(id+":"+lm[1]); });
  (s.evo||[]).forEach(function(e){ if(!G.Data.SPECIES[e.to]) bad.push(id+":evo:"+e.to); });
});
G.Data._animeRefErrors = bad;
})();

})();

/* ===== Anime custom signature moves + rebuilt learnsets (refinement pass) ===== */
(function(){
var MOVES = G.Data.MOVES;
function M(o){ MOVES[o.id] = o; }

/* ---- GOKU ---- */
M({id:"instant-transmission",name:"Instant Transmission",type:"Fighting",cat:"phys",pow:60,acc:100,pp:20,eff:{priority:2},
desc:"Locks onto a ki signature and teleports mid-punch. You never saw it. He was already behind you."});
M({id:"dragon-fist",name:"Dragon Fist",type:"Fighting",cat:"phys",pow:110,acc:90,pp:10,eff:{},
desc:"A golden dragon erupts from his fist and bites clean through. Crits so hard the camera shakes."});
M({id:"kaioken",name:"Kaioken",type:"Fighting",cat:"status",pow:0,acc:100,pp:10,eff:{stat:{atk:2,spe:2},recoil:0.125},
desc:"Multiplies his power with a red aura scream. Sharply boosts Attack and Speed — but his body pays for it every turn."});
M({id:"meteor-combination",name:"Meteor Combination",type:"Fighting",cat:"phys",pow:25,acc:90,pp:15,eff:{hits:[2,5]},
desc:"A teleporting barrage of fists and kicks from every angle. Guess which one's real. Wrong."});

/* ---- LUFFY ---- */
M({id:"gum-gum-pistol",name:"Gum-Gum Pistol",type:"Fighting",cat:"phys",pow:70,acc:100,pp:20,eff:{},
desc:"His arm stretches across the arena and PISTOLS you. Rubber physics, real pain."});
M({id:"jet-pistol",name:"Jet Pistol",type:"Fighting",cat:"phys",pow:60,acc:100,pp:20,eff:{priority:1},
desc:"Gear Second: blood pumps like an engine and the pistol arrives before the thought does."});
M({id:"gigant-pistol",name:"Gigant Pistol",type:"Fighting",cat:"phys",pow:120,acc:85,pp:10,eff:{stat:{spe:-1}},
desc:"Gear Third: a fist the size of a house. Devastating — and now he's too big to dodge."});
M({id:"kong-gun",name:"Kong Gun",type:"Fighting",cat:"phys",pow:140,acc:90,pp:5,eff:{recoil:0.25},
desc:"Gear Fourth: compressed, bouncing, absurd. The recoil hits him too. He does not care."});
M({id:"red-hawk",name:"Red Hawk",type:"Fire",cat:"phys",pow:90,acc:100,pp:15,eff:{status:"brn",statusChance:10},
desc:"Armament Haki ignites his fist mid-stretch. A flaming eagle stamp screams across the sky."});
M({id:"observation-haki",name:"Observation Haki",type:"Fighting",cat:"status",pow:0,acc:100,pp:20,eff:{stat:{spe:2}},
desc:"He sees the attack a heartbeat before it happens. Sharply boosts Speed — good luck landing anything."});
M({id:"conquerors-haki",name:"Conqueror's Haki",type:"Dark",cat:"status",pow:0,acc:90,pp:10,eff:{flinch:30,foeStat:{atk:-1}},
desc:"The will of a king crashes over the arena. The weak flinch; the strong reconsider."});

/* ---- GOJO ---- */
M({id:"unlimited-void",name:"Unlimited Void",type:"Psychic",cat:"status",pow:0,acc:90,pp:5,eff:{status:"par",foeStat:{spe:-2}},
desc:"His Domain traps you in infinite knowledge. Your brain bluescreens: paralyzed, and your thoughts slow to a crawl."});
M({id:"infinity",name:"Infinity",type:"Psychic",cat:"status",pow:0,acc:100,pp:10,eff:{priority:4},
desc:"Neutral infinity. Between you and him: an infinite distance. Your attack will arrive... never."});
M({id:"cursed-reversal-red",name:"Cursed Reversal: Red",type:"Psychic",cat:"spec",pow:80,acc:100,pp:15,eff:{priority:1},
desc:"Reversed cursed energy detonates outward. It strikes first and hurls the foe back."});
M({id:"cursed-lapse-blue",name:"Cursed Lapse: Blue",type:"Psychic",cat:"spec",pow:70,acc:100,pp:15,eff:{foeStat:{spe:-1}},
desc:"Maximum cursed energy output: a miniature black hole that drags the foe in and slows them down."});
M({id:"six-eyes",name:"Six Eyes",type:"Psychic",cat:"status",pow:0,acc:100,pp:10,eff:{stat:{spa:1,spe:1}},
desc:"The Six Eyes analyze every atom of the fight. His precision becomes absolute; Sp. Atk and Speed rise."});

/* ---- NARUTO ---- */
M({id:"rasenshuriken",name:"Rasenshuriken",type:"Fighting",cat:"spec",pow:120,acc:90,pp:10,eff:{recoil:0.25},
desc:"A screaming shuriken of wind blades that shreds on a cellular level. It shreds his arm a little too."});
M({id:"shadow-clones",name:"Shadow Clones",type:"Normal",cat:"status",pow:0,acc:100,pp:15,eff:{stat:{spe:1}},
desc:"A dozen Narutos surround you, all grinning. Good luck hitting the real one — Speed rises."});
M({id:"sage-mode",name:"Sage Mode",type:"Fighting",cat:"status",pow:0,acc:100,pp:10,eff:{stat:{atk:1,spa:1,def:1}},
desc:"He gathers nature energy, eyes turning toad-sage slits. Attack, Sp. Atk and Defense all rise."});
M({id:"tailed-beast-bomb",name:"Tailed Beast Bomb",type:"Fighting",cat:"spec",pow:170,acc:85,pp:5,eff:{},
desc:"Positive and negative chakra compressed into a sphere of apocalypse. Kurama approved."});
M({id:"talk-no-jutsu",name:"Talk no Jutsu",type:"Normal",cat:"status",pow:0,acc:90,pp:10,eff:{foeStat:{atk:-2}},
desc:"He lectures the foe about friendship, pain, and never giving up. It WORKS. Sharply lowers their Attack."});

/* ---- ICHIGO ---- */
M({id:"bankai",name:"Bankai",type:"Ghost",cat:"status",pow:0,acc:100,pp:10,eff:{stat:{atk:2,spe:2}},
desc:"TENSA ZANGETSU. All his power compresses into one black blade. Attack and Speed surge."});
M({id:"hollowfication",name:"Hollowfication",type:"Ghost",cat:"status",pow:0,acc:100,pp:5,eff:{stat:{atk:3},recoil:0.125},
desc:"The Hollow mask tears onto his face. Attack skyrockets — but the Hollow claws at him every turn."});
M({id:"final-getsuga",name:"Final Getsuga Tensho",type:"Ghost",cat:"spec",pow:200,acc:100,pp:3,eff:{recoil:1},
desc:"MUGETSU. He becomes the Getsuga itself: one slash of pure night. Then he faints. Worth it."});
M({id:"blut-vene",name:"Blut Vene",type:"Ghost",cat:"status",pow:0,acc:100,pp:10,eff:{stat:{def:2,spd:2}},
desc:"Quincy blood hardens into glowing veins of armor. Defense and Sp. Def rise sharply."});

/* ---- DEKU ---- */
M({id:"delaware-smash",name:"Delaware Smash",type:"Fighting",cat:"spec",pow:80,acc:100,pp:15,eff:{},
desc:"A finger-flick that fires a bullet of air pressure. Ranged, precise, and his finger regrets it."});
M({id:"full-cowling",name:"Full Cowling",type:"Electric",cat:"status",pow:0,acc:100,pp:15,eff:{stat:{atk:1,spe:1}},
desc:"Green lightning veins crackle across his body. One For All flows everywhere: Attack and Speed rise."});
M({id:"united-states-of-smash",name:"United States of Smash",type:"Fighting",cat:"phys",pow:180,acc:90,pp:5,eff:{recoil:0.25},
desc:"His master's legacy in one punch. The shockwave rewrites the weather. His arm files for retirement."});
M({id:"shoot-style",name:"Shoot Style",type:"Fighting",cat:"phys",pow:60,acc:100,pp:20,eff:{priority:1},
desc:"Legs, not arms: a lightning-fast kick that lands before the foe blinks."});
M({id:"danger-sense",name:"Danger Sense",type:"Electric",cat:"status",pow:0,acc:100,pp:10,eff:{priority:3,stat:{spe:1}},
desc:"His quirk screams a warning a split-second early. He moves first and slips the blow."});

/* ---- TANJIRO ---- */
M({id:"water-wheel",name:"Water Wheel",type:"Water",cat:"spec",pow:80,acc:100,pp:15,eff:{},
desc:"Water Breathing, First Form: a spinning wheel of water slashes. Flowing, relentless, beautiful."});
M({id:"raging-sun",name:"Raging Sun",type:"Fire",cat:"spec",pow:150,acc:90,pp:5,eff:{},
desc:"The sun itself descends through his blade. Demons don't fear the dark — they fear THIS."});
M({id:"total-concentration",name:"Total Concentration",type:"Fire",cat:"status",pow:0,acc:100,pp:10,eff:{stat:{atk:1,def:1,spa:1,spd:1,spe:1}},
desc:"Total Concentration Breathing: every breath feeds the flame. All stats rise."});
M({id:"flame-tiger",name:"Flame Tiger",type:"Fire",cat:"phys",pow:90,acc:100,pp:15,eff:{status:"brn",statusChance:10},
desc:"Flame Breathing, Second Form: a roaring tiger of fire pounces with the slash."});

/* ---- SAITAMA ---- */
M({id:"serious-punch",name:"Serious Punch",type:"Fighting",cat:"phys",pow:150,acc:95,pp:5,eff:{},
desc:"He actually tries, a little. The shockwave splits the clouds. The clouds apologize."});
M({id:"consecutive-normal-punches",name:"Consecutive Normal Punches",type:"Fighting",cat:"phys",pow:30,acc:90,pp:15,eff:{hits:[2,5]},
desc:"Normal punches. Consecutively. An absurd number of them. None of them are serious. All of them hurt."});
M({id:"serious-table-flip",name:"Serious Table Flip",type:"Fighting",cat:"phys",pow:110,acc:90,pp:10,eff:{flinch:30},
desc:"He flips the entire arena like a table. The foe flinches. So does the ground."});
M({id:"heros-resolve",name:"Hero's Resolve",type:"Normal",cat:"status",pow:0,acc:100,pp:5,eff:{priority:3},
desc:"A hero for fun does not fall. He endures the hit and keeps walking forward."});

/* ---- tune existing anime signatures per the new direction ---- */
MOVES.rasengan.cat = "spec";
MOVES.rasengan.desc = "Naruto's spinning sphere of pure chakra. It drills through anything — including the plot.";
MOVES["hinokami-kagura"].pow = 55;
MOVES["hinokami-kagura"].pp = 15;
MOVES["hinokami-kagura"].eff = {hits:[2,5],status:"brn",statusChance:10};
MOVES["hinokami-kagura"].desc = "The Dance of the Fire God: a whirling storm of flame slashes, strike after strike after strike.";
MOVES["one-punch"].pp = 3;
MOVES["one-punch"].desc = "Saitama ends it. Obviously. Only three uses — the fight never lasts longer.";
MOVES["spirit-bomb"].pow = 140;
MOVES["spirit-bomb"].desc = "He raises his hands and the whole planet lends its light. It takes everything he's got.";

/* ---- rebuilt learnsets: basics early, ultimates on later evolutions ---- */
var S = G.Data.SPECIES;
function LM(id, arr){ if(S[id]) S[id].levelMoves = arr; }

/* GOKU */
LM("goku",[[1,"tackle"],[1,"quick-attack"],[8,"mach-punch"],[14,"kamehameha"],[20,"brick-break"],[26,"kaioken"],[30,"dragon-fist"]]);
LM("goku-ssj",[[1,"kamehameha"],[1,"brick-break"],[32,"kaioken"],[34,"instant-transmission"],[38,"meteor-combination"],[44,"spirit-bomb"]]);
LM("goku-ssj2",[[1,"kamehameha"],[1,"instant-transmission"],[40,"meteor-combination"],[44,"superpower"],[48,"spirit-bomb"]]);
LM("goku-ssj3",[[1,"kamehameha"],[1,"meteor-combination"],[48,"dragon-fist"],[52,"spirit-bomb"],[56,"agility"]]);
LM("goku-ssg",[[1,"kamehameha"],[1,"spirit-bomb"],[56,"calm-mind"],[60,"instant-transmission"],[64,"meteor-combination"]]);
LM("goku-ssb",[[1,"kamehameha"],[1,"spirit-bomb"],[64,"dragon-fist"],[68,"superpower"],[72,"instant-transmission"]]);
LM("goku-ui",[[1,"kamehameha"],[1,"spirit-bomb"],[72,"infinity-guard"],[76,"instant-transmission"],[80,"meteor-combination"],[84,"agility"]]);
/* LUFFY */
LM("luffy",[[1,"pound"],[1,"quick-attack"],[10,"gum-gum-pistol"],[18,"mach-punch"],[24,"bulk-up"]]);
LM("luffy-g2",[[1,"gum-gum-pistol"],[1,"mach-punch"],[28,"jet-pistol"],[32,"observation-haki"],[36,"brick-break"]]);
LM("luffy-g3",[[1,"gum-gum-pistol"],[1,"jet-pistol"],[36,"gigant-pistol"],[40,"red-hawk"],[44,"bulk-up"]]);
LM("luffy-g4",[[1,"gigant-pistol"],[1,"red-hawk"],[44,"kong-gun"],[48,"conquerors-haki"],[52,"observation-haki"]]);
LM("luffy-g5",[[1,"bajrang-gun"],[1,"kong-gun"],[56,"red-hawk"],[62,"conquerors-haki"],[68,"gigant-pistol"],[74,"observation-haki"]]);
/* GOJO */
LM("gojo",[[1,"psybeam"],[8,"calm-mind"],[16,"psychic"],[24,"hollow-purple"],[32,"light-screen"]]);
LM("gojo-sorcerer",[[1,"psychic"],[1,"hollow-purple"],[32,"infinity"],[36,"cursed-reversal-red"],[42,"cursed-lapse-blue"],[48,"six-eyes"]]);
LM("gojo-honored",[[1,"hollow-purple"],[1,"infinity"],[52,"unlimited-void"],[58,"domain-expansion"],[64,"six-eyes"],[70,"cursed-reversal-red"]]);
/* NARUTO */
LM("naruto",[[1,"scratch"],[8,"quick-attack"],[16,"rasengan"],[24,"brick-break"],[28,"shadow-clones"],[30,"bulk-up"]]);
LM("naruto-sage",[[1,"rasengan"],[1,"shadow-clones"],[30,"sage-mode"],[36,"earth-power"],[40,"rasenshuriken"]]);
LM("naruto-kcm",[[1,"rasengan"],[1,"rasenshuriken"],[42,"thunder-punch"],[48,"tailed-beast-bomb"],[54,"agility"]]);
LM("naruto-sixpaths",[[1,"rasengan"],[1,"tailed-beast-bomb"],[58,"talk-no-jutsu"],[64,"moonblast"],[70,"sage-mode"],[76,"rasenshuriken"]]);
/* ICHIGO */
LM("ichigo",[[1,"slash"],[10,"shadow-claw"],[18,"getsuga-tensho"],[26,"brick-break"],[32,"swords-dance"]]);
LM("ichigo-bankai",[[1,"getsuga-tensho"],[1,"shadow-claw"],[34,"bankai"],[40,"agility"],[46,"close-combat"]]);
LM("ichigo-hos",[[1,"getsuga-tensho"],[1,"bankai"],[52,"hollowfication"],[58,"blut-vene"],[64,"shadow-force"],[70,"final-getsuga"]]);
/* DEKU */
LM("deku",[[1,"tackle"],[8,"quick-attack"],[16,"thunder-punch"],[24,"brick-break"],[30,"full-cowling"]]);
LM("deku-cowling",[[1,"thunder-punch"],[1,"full-cowling"],[30,"detroit-smash"],[36,"agility"],[42,"delaware-smash"]]);
LM("deku-100",[[1,"detroit-smash"],[1,"delaware-smash"],[48,"shoot-style"],[54,"danger-sense"],[60,"united-states-of-smash"],[66,"superpower"]]);
/* TANJIRO */
LM("tanjiro",[[1,"scratch"],[10,"slash"],[18,"flamethrower"],[26,"brick-break"],[32,"water-wheel"],[35,"swords-dance"]]);
LM("tanjiro-hinokami",[[1,"hinokami-kagura"],[1,"flamethrower"],[35,"total-concentration"],[42,"flame-tiger"],[48,"fire-blast"]]);
LM("tanjiro-hashira",[[1,"hinokami-kagura"],[1,"flame-tiger"],[52,"raging-sun"],[58,"total-concentration"],[64,"agility"],[70,"fire-blast"]]);
/* SAITAMA */
LM("saitama",[[1,"pound"],[10,"mach-punch"],[20,"brick-break"],[30,"close-combat"],[36,"consecutive-normal-punches"],[40,"bulk-up"]]);
LM("saitama-serious",[[1,"one-punch"],[1,"consecutive-normal-punches"],[40,"serious-punch"],[48,"serious-table-flip"],[56,"heros-resolve"],[64,"agility"]]);

/* validate: every anime learnset move + evo target exists */
(function(){
var bad = [];
Object.keys(G.Data.SPECIES).forEach(function(id){
  var s = G.Data.SPECIES[id];
  if(s.cat !== "anime") return;
  (s.levelMoves||[]).forEach(function(lm){ if(!G.Data.MOVES[lm[1]]) bad.push(id+":"+lm[1]); });
  (s.evo||[]).forEach(function(e){ if(!G.Data.SPECIES[e.to]) bad.push(id+":evo:"+e.to); });
});
G.Data._animeRefErrors = (G.Data._animeRefErrors||[]).concat(bad);
G.Data._animeCustomMoves = Object.keys(G.Data.MOVES).filter(function(m){
  return ["instant-transmission","dragon-fist","kaioken","meteor-combination","gum-gum-pistol","jet-pistol",
  "gigant-pistol","kong-gun","red-hawk","observation-haki","conquerors-haki","unlimited-void","infinity",
  "cursed-reversal-red","cursed-lapse-blue","six-eyes","rasenshuriken","shadow-clones","sage-mode",
  "tailed-beast-bomb","talk-no-jutsu","bankai","hollowfication","final-getsuga","blut-vene","delaware-smash",
  "full-cowling","united-states-of-smash","shoot-style","danger-sense","water-wheel","raging-sun",
  "total-concentration","flame-tiger","serious-punch","consecutive-normal-punches","serious-table-flip",
  "heros-resolve"].indexOf(m) >= 0;
});
})();

})();
