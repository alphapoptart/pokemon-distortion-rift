/* Pokémon: Distortion Rift — story scripts.
   Ops: say, give, giveMon, battle, wild, warp, set, if, choice, heal, fanfare.
   G.AI.echoParty(stage) builds ECHO's team at battle time — never hardcoded here.
   NOTE for G.AI: starter flags are starter_goku / starter_luffy / starter_naruto.
   echo_lead_luffy / echo_lead_naruto / echo_lead_goku = ECHO's stage-1 counter-pick
   (player goku->luffy, luffy->naruto, naruto->goku). echoParty(1) should lead with it. */
window.G = window.G || {};
G.Story = G.Story || {};
G.Story.flags = G.Story.flags || {};
G.Story.SCRIPTS = {

/* ================= INTRO ================= */
intro:[
 {say:"NEXUS",text:"...boot sequence complete. Hello? Hello?! Can you hear me in there?"},
 {say:"NEXUS",text:"Excellent — you're alive. I'm NEXUS: the AI in your pocket, your strategist, your walking encyclopedia of bad decisions."},
 {say:"NEXUS",text:"Situation: this region runs on my tech. TEAM UMBRA wants to crack reality open. And ARCEUS — yes, THAT Arceus — chose YOU to stop them."},
 {say:"NEXUS",text:"Before we save the world: how do you like to battle? I'll tailor my advice."},
 {choice:{q:"NEXUS: What's your battle style?",opts:["Hit hard and fast","Slow and strategic","Tricks and status"],set:"playstyle"}},
 {say:"NEXUS",text:"Noted. Now get up — your mom's calling, and PROF. MAPLE has three... visitors... at the NEXUS Lab with your name on them."},
 {warp:{map:"player-house",x:6,y:5}},
 {set:"intro_done"}
],

npc_mom:[
 {if:"met_mom",then:[
   {say:"MOM",text:"Don't forget to eat! And hydrate! And call your mother! ...Have fun saving the world, sweetie!"}
 ],else:[
   {say:"MOM",text:"Morning, sleepyhead! You were muttering about 'NEXUS' in your sleep. Adorable."},
   {say:"MOM",text:"PROF. MAPLE's lab, Circuit Town — go pick your first partner! ECHO already ran ahead, the little show-off."},
   {give:{item:"potion",n:5}},
   {say:"NEXUS",text:"Five Potions acquired. Your mom is officially the best item shop in the game."},
   {set:"met_mom"}
 ]}
],

npc_prof:[
 {if:"starter_chosen",then:[
   {if:"postgame",then:[
     {say:"PROF. MAPLE",text:"The Rift Den stirs — legendaries are converging there even as we speak."},
     {say:"PROF. MAPLE",text:"Take this RIFT KEY. Try not to break reality while you're in there."},
     {give:{item:"rift-key",n:1}},
     {warp:{map:"rift-den",x:9,y:12}}
   ],else:[
     {say:"PROF. MAPLE",text:"How's the team? Remember — my Fusion Lab can splice two partners into ONE!"},
     {say:"NEXUS",text:"(We'll need the DNA Splicers first. Word is the PROF hands them over after the fourth badge.)"}
   ]}
 ],else:[
   {say:"PROF. MAPLE",text:"Ah! There you are! Three... visitors... arrived through rifts recently — lost, far from home."},
   {say:"PROF. MAPLE",text:"GOKU, LUFFY, NARUTO — they wait in the pods behind me. Walk up to one and press A — choose wisely!"},
   {say:"NEXUS",text:"No pressure. This choice only determines the next sixty hours of your life."},
   {say:"ECHO",text:"Too slow! I've been here for MINUTES. My NEXUS already analyzed all three — whatever you pick, mine picks the counter."},
   {say:"ECHO",text:"That's the difference between us: your partner picks YOU. Mine gets optimized."}
 ]}
],

npc_aide:[
 {if:"dna",then:[
   {say:"AIDE",text:"The Fusion Lab is HOT! Pick a body and a head, preview the splice, and confirm!"},
   {say:"AIDE",text:"Warning: both Pokémon become the fusion. It's beautiful. It's permanent. It's science!"}
 ],else:[
   {say:"AIDE",text:"I calibrate the DNA Splicers! ...Which are currently with the PROF. Long story."},
   {say:"AIDE",text:"Come back when you've proven yourself — say, FOUR badges proven."}
 ]}
],

starter_a:[
 {if:"starter_chosen",then:[
   {say:"NEXUS",text:"The pod is empty. Your partner's already with you — no take-backs!"}
 ],else:[
   {say:"NEXUS",text:"The pod hisses open..."},
   {giveMon:{sp:"goku",lvl:5}},
   {say:"GOKU",text:"Heheh! Hi! I'm GOKU! ...Are we gonna be friends? Are we gonna FIGHT? Is there FOOD?"},
   {say:"NEXUS",text:"GOKU joined! ...Meanwhile, ECHO's NEXUS just finished ten thousand simulations."},
   {say:"ECHO",text:"Done. Goku's straightforward power? My NEXUS says LUFFY's rubber body and pure chaos hard-counter it."},
   {say:"ECHO",text:"Say hello to my partner. Let's test my AI's math — battle!"},
   {battle:{trainer:"echo1"}},
   {say:"PROF. MAPLE",text:"What a first battle! Here — a Pokédex and some Balls. Route 1 is north of town!"},
   {give:{item:"poke-ball",n:5}},
   {heal:true},
   {set:"starter_chosen"},
   {set:"starter_goku"},
   {set:"echo_lead_luffy"},
   {set:"echo1_done"}
 ]}
],

starter_b:[
 {if:"starter_chosen",then:[
   {say:"NEXUS",text:"The pod is empty. Your partner's already with you — no take-backs!"}
 ],else:[
   {say:"NEXUS",text:"The pod hisses open..."},
   {giveMon:{sp:"luffy",lvl:5}},
   {say:"LUFFY",text:"SHISHISHI! Hi! I'm LUFFY! Future King of the Pirates! ...Got any meat?"},
   {say:"NEXUS",text:"LUFFY joined! ...ECHO's NEXUS has completed its analysis. I hate that smug beep."},
   {say:"ECHO",text:"Done. Luffy's stretchy chaos? My NEXUS says NARUTO's wind blades and clone tactics dismantle it."},
   {say:"ECHO",text:"Meet my partner. My AI doesn't pick favorites — it picks winners. Battle!"},
   {battle:{trainer:"echo1"}},
   {say:"PROF. MAPLE",text:"What a first battle! Here — a Pokédex and some Balls. Route 1 is north of town!"},
   {give:{item:"poke-ball",n:5}},
   {heal:true},
   {set:"starter_chosen"},
   {set:"starter_luffy"},
   {set:"echo_lead_naruto"},
   {set:"echo1_done"}
 ]}
],

starter_c:[
 {if:"starter_chosen",then:[
   {say:"NEXUS",text:"The pod is empty. Your partner's already with you — no take-backs!"}
 ],else:[
   {say:"NEXUS",text:"The pod hisses open..."},
   {giveMon:{sp:"naruto",lvl:5}},
   {say:"NARUTO",text:"Believe it! I'm NARUTO — future Hokage! ...Whoa, this place is AMAZING!"},
   {say:"NEXUS",text:"NARUTO joined! ...And ECHO's NEXUS just locked in its counter-pick. Of course it did."},
   {say:"ECHO",text:"Done. Naruto's numbers game? My NEXUS says GOKU's area blasts and instant movement delete it."},
   {say:"ECHO",text:"This is the future, rival: battles decided before they begin. Now — begin!"},
   {battle:{trainer:"echo1"}},
   {say:"PROF. MAPLE",text:"What a first battle! Here — a Pokédex and some Balls. Route 1 is north of town!"},
   {give:{item:"poke-ball",n:5}},
   {heal:true},
   {set:"starter_chosen"},
   {set:"starter_naruto"},
   {set:"echo_lead_goku"},
   {set:"echo1_done"}
 ]}
],

npc_circuit_kid:[
 {say:"KID",text:"I saw ECHO run north to ROUTE 1! They were laughing! RUDE laughing!"}
],
npc_circuit_elder:[
 {say:"ELDER",text:"Back in my day, starters were sticks. We loved our sticks."}
],
npc_volt_kid:[
 {say:"KID",text:"VOLTA's the fastest leader ever! Her MANECTRIC once outran a rumor!"}
],
npc_volt_clerk:[
 {say:"CLERK",text:"Welcome to Volt City! We have everything! Especially static!"}
],

/* ================= GYMS ================= */
gym1_leader:[
 {if:"badge1",then:[
   {say:"VOLTA",text:"Yo! Current's still flowing strong? The League's waiting — don't keep it!"}
 ],else:[
   {say:"NEXUS",text:"SCOUT: VOLTA's ace is MANECTRIC (Lv16). Ground-types wall her entire team. Your Water-types should sit this one out."},
   {battle:{trainer:"gym1"}},
   {give:{item:"great-ball",n:3}},
   {fanfare:true},
   {set:"badge1"},
   {heal:true},
   {say:"NEXUS",text:"VOLT BADGE secured! ...Hold on. I'm picking up a scrambled signal near the city's east edge. UMBRA-ish. Stay sharp."}
 ]}
],
gym2_leader:[
 {if:"badge1",then:[
   {if:"badge2",then:[
     {say:"FERN",text:"Grow well, little sprout. The garden remembers you fondly."}
   ],else:[
     {say:"NEXUS",text:"SCOUT: FERN's ace is BRELOOM (Lv23) — Grass/Fighting. Flying-types feast here. Bring burn heals."},
     {battle:{trainer:"gym2"}},
     {give:{item:"great-ball",n:3}},
     {fanfare:true},
     {set:"badge2"},
     {heal:true},
     {say:"NEXUS",text:"FERN BADGE earned! ...Also: massive energy spike on ROUTE 3. Something just fell out of the sky. That's never good."}
   ]}
 ],else:[
   {say:"FERN",text:"Shhh... Come back with the VOLT BADGE, little sprout. The garden is patient. I am not."}
 ]}
],
gym3_leader:[
 {if:"badge2",then:[
   {if:"badge3",then:[
     {say:"MARINA",text:"Ahoy, captain! The tide still favors you, I see!"}
   ],else:[
     {say:"NEXUS",text:"SCOUT: MARINA's ace is BLASTOISE (Lv31). Electric and Grass rule these waters. Don't bring a Fire-type to a tsunami."},
     {battle:{trainer:"gym3"}},
     {give:{item:"ultra-ball",n:3}},
     {fanfare:true},
     {set:"badge3"},
     {heal:true},
     {say:"NEXUS",text:"HARBOR BADGE secured! The summit road is open — and my sensors say ROUTE 4 is crawling with anomalies."}
   ]}
 ],else:[
   {say:"MARINA",text:"Whoa there, sailor! Two badges first — the harbor doesn't open for landlubbers!"}
 ]}
],
gym4_leader:[
 {if:"badge3",then:[
   {if:"badge4",then:[
     {say:"DRAKE",text:"The League awaits, Champion-in-waiting. Make the dragons proud."}
   ],else:[
     {say:"NEXUS",text:"SCOUT: DRAKE's ace is SALAMENCE (Lv40). Ice shreds his whole team. This is the big one — heal up, believe."},
     {battle:{trainer:"gym4"}},
     {give:{item:"ultra-ball",n:5}},
     {give:{item:"dna-splicers",n:1}},
     {fanfare:true},
     {set:"badge4"},
     {set:"dna"},
     {heal:true},
     {say:"DRAKE",text:"...Take the DNA SPLICERS too. MAPLE's been waiting to give you those."},
     {say:"NEXUS",text:"DNA SPLICERS acquired! The Fusion Lab in Circuit Town is ONLINE. Also: Victory Road is north. The League. It's happening."}
   ]}
 ],else:[
   {say:"DRAKE",text:"Three badges? Come back with four — no, wait. Come back with THREE. You have... listen, just get the HARBOR BADGE."}
 ]}
],

/* ================= TEAM UMBRA ================= */
evt_umbra1:[
 {if:"umbra1_done",then:[
   {say:"NEXUS",text:"No UMBRA signals. For now. They'll be back — villains always monologue twice."}
 ],else:[
   {if:"badge1",then:[
     {say:"UMBRA Grunt",text:"Halt! That NEXUS data in the lab belongs to TEAM UMBRA now!"},
     {say:"NEXUS",text:"He's after my research! ...Flattering. Also rude. Battle him!"},
     {say:"DEKU",text:"Leave them alone! ...A rift dropped me in this city, but I know a bad guy when I see one!"},
     {say:"DEKU",text:"You have partners — I've got this power! Let's take him TOGETHER!"},
     {battle:{trainer:"grunt1"}},
     {give:{item:"umbral-shard",n:1}},
     {say:"DEKU",text:"We did it! ...That was amazing! Can I — can I come with you? I want to save everyone, with a smile!"},
     {giveMon:{sp:"deku",lvl:18}},
     {say:"NEXUS",text:"DEKU joined! Data recovered, plus this UMBRAL SHARD — it tracks their rift signals. We're hunting them now."},
     {set:"deku_joined"},
     {set:"umbra1_done"}
   ],else:[
     {say:"UMBRA Grunt",text:"...Not yet. The boss says wait for the badge-holder. (Come back after beating VOLTA.)"}
   ]}
 ]}
],
evt_umbra2:[
 {if:"umbra2_done",then:[
   {say:"NEXUS",text:"The survey equipment's abandoned. UMBRA's rift mapping just lost a field team."}
 ],else:[
   {say:"UMBRA Grunt",text:"You again?! This rift survey is CLASSIFIED! My promotion depends on shutting you up!"},
   {battle:{trainer:"grunt2"}},
   {give:{item:"seal-1",n:1}},
   {say:"NEXUS",text:"The survey team was carrying SEAL I! One of three Umbral Seals — and now it's OURS."},
   {say:"NEXUS",text:"Survey smashed, seal secured. Their map of the rifts just got a lot less accurate — you're welcome, reality."},
   {set:"umbra2_done"}
 ]}
],
evt_umbra4:[
 {if:"umbra4_done",then:[
   {say:"NEXUS",text:"Nothing but footprints. Big ones. VEX-sized ones. The League can't come soon enough."}
 ],else:[
   {say:"UMBRA Grunt",text:"The THIRD SEAL goes to the boss! You're NOT ruining this — I was promised a beach house!"},
   {battle:{trainer:"grunt4"}},
   {give:{item:"seal-3",n:1}},
   {say:"NEXUS",text:"SEAL III secured! All three seals are OURS. UMBRA's plan is dead. ...Right?"},
   {set:"umbra4_done"}
 ]}
],

/* ================= RIVAL ECHO (teams via G.AI.echoParty) ================= */
evt_echo2:[
 {if:"echo2_done",then:[
   {say:"ECHO",text:"NEXUS is still analyzing that last battle. ...Don't look so smug."}
 ],else:[
   {if:"badge1",then:[
     {battle:{trainer:"echo2"}},
     {heal:true},
     {set:"echo2_done"}
   ],else:[
     {say:"ECHO",text:"No badge? No battle. Come find me when you've beaten VOLTA, slowpoke."}
   ]}
 ]}
],
evt_echo3:[
 {if:"echo3_done",then:[
   {say:"ECHO",text:"Three badges each. The League's going to be interesting."}
 ],else:[
   {if:"badge2",then:[
     {battle:{trainer:"echo3"}},
     {heal:true},
     {set:"echo3_done"}
   ],else:[
     {say:"ECHO",text:"Still on two badges? The sea air will wait. Your training won't."}
   ]}
 ]}
],
evt_echo4:[
 {if:"echo4_done",then:[
   {say:"ECHO",text:"Victory Road. Then the League. Then... we'll see who's really the best."}
 ],else:[
   {if:"badge4",then:[
     {battle:{trainer:"echo4"}},
     {heal:true},
     {set:"echo4_done"}
   ],else:[
     {say:"ECHO",text:"Four badges to stand here. You're not ready yet — go earn them."}
   ]}
 ]}
],
evt_echo5:[
 {if:"echo5_done",then:[
   {say:"ECHO",text:"Go take the crown. I'll be right behind you. Someone has to keep you humble."}
 ],else:[
   {battle:{trainer:"echo5"}},
   {heal:true},
   {set:"echo5_done"}
 ]}
],

/* ================= ANIME ALLIES ================= */
evt_goku_crash:[
 {if:"goku_crash_done",then:[
   {say:"NEXUS",text:"Just the crater now. ...It still smells faintly of ozone and appetite."}
 ],else:[
   {if:"badge2",then:[
     {if:"starter_goku",then:[
       {say:"NEXUS",text:"Scanning the pod debris... wait. WAIT. These energy readings match YOUR pod, Goku!"},
       {say:"GOKU",text:"Huh? ...Oh! THAT's where I landed! Heheh, no wonder this crater felt familiar!"},
       {say:"NEXUS",text:"You really did fall out of the sky in this exact crater. The pod's been here all along."},
       {say:"GOKU",text:"Wow... Thanks for finding it, me! ...I mean, thanks!"},
       {give:{item:"rare-candy",n:2}},
       {say:"NEXUS",text:"Salvaged from your own pod: Rare Candies! ...And closure."},
       {set:"goku_crash_done"}
     ],else:[
       {say:"NEXUS",text:"This pod... Saiyan tech. Someone fell out of the sky here — a while ago."},
       {say:"NEXUS",text:"Long gone now. But they left something behind in the wreckage..."},
       {give:{item:"rare-candy",n:2}},
       {say:"NEXUS",text:"Rare Candies! ...And more questions. Classic."},
       {set:"goku_crash_done"}
     ]}
   ],else:[
     {say:"NEXUS",text:"A smoking crater. (This smells like plot. Come back after the FERN badge.)"}
   ]}
 ]}
],
evt_naruto:[
 {if:"naruto_victory_done",then:[
   {say:"NARUTO",text:"The League's right ahead! ...I'm not nervous. YOU'RE nervous. Believe it!"}
 ],else:[
   {say:"NARUTO",text:"Believe it! ...A rift opened mid-mission and dumped me HERE!"},
   {say:"NEXUS",text:"Distortion energy spiking — something's coming through the rift he chased!"},
   {say:"NARUTO",text:"A distortion spawn! ...You! With the partners! Let's take it TOGETHER!"},
   {wild:{sp:"gengar",lvl:42,catchable:true}},
   {say:"NARUTO",text:"Nice teamwork! ...You're heading INTO the League? Toward the trouble? Then I'm coming too!"},
   {if:"starter_naruto",then:[
     {say:"NARUTO",text:"Wait... you're ME?! From another timeline?! ...Are you cooler than me? ...Don't answer that."},
     {say:"NARUTO",text:"Two Narutos! The rift won't know what hit it! ...Good luck, me!"},
     {give:{item:"rare-candy",n:2}},
     {say:"NEXUS",text:"Parallel Naruto shadow-cloned away, laughing. ...I love this job."}
   ],else:[
     {giveMon:{sp:"naruto",lvl:38}},
     {say:"NARUTO",text:"Alright! I'll never give up — that's my ninja way!"},
     {say:"NEXUS",text:"NARUTO joined the team!"},
     {set:"naruto_joined"}
   ]},
   {set:"naruto_victory_done"}
 ]}
],
evt_luffy:[
 {if:"luffy_heist_done",then:[
   {say:"NEXUS",text:"The docks are quiet. ...Too quiet. I love it."}
 ],else:[
   {say:"UMBRA Grunt",text:"This port's shipments belong to UMBRA now! Starting with THAT seal!"},
   {say:"NEXUS",text:"A port heist! They're after an Umbral Seal in the cargo!"},
   {if:"starter_luffy",then:[
     {say:"LUFFY",text:"Huh? ...Is that ME?! Another me, washed up on another dock?!"},
     {say:"LUFFY",text:"SHISHISHI! Two Luffys! UMBRA doesn't stand a chance — let's smash 'em TOGETHER!"},
     {battle:{trainer:"grunt3"}},
     {give:{item:"seal-2",n:1}},
     {say:"NEXUS",text:"SEAL II secured from the heist loot!"},
     {say:"LUFFY",text:"Later, me! Be the King of the Pirates! ...Both of us!"},
     {give:{item:"rare-candy",n:2}},
     {say:"NEXUS",text:"Parallel Luffy vanished into the crowd, laughing. ...I love this job."},
     {set:"luffy_heist_done"}
   ],else:[
     {say:"LUFFY",text:"MEAT— ...I mean, HEY! You guys are stealing stuff! That's MY thing! ...No wait, that's bad!"},
     {say:"LUFFY",text:"You! With the monsters! Let's smash these guys TOGETHER!"},
     {battle:{trainer:"grunt3"}},
     {say:"LUFFY",text:"SHISHISHI! That was fun! ...Say — you're collecting strong friends, right? Take me with you!"},
     {giveMon:{sp:"luffy",lvl:28}},
     {give:{item:"seal-2",n:1}},
     {say:"NEXUS",text:"LUFFY joined! SEAL II secured from the heist loot! He joined for the snacks. Honestly? Valid."},
     {set:"luffy_joined"},
     {set:"luffy_heist_done"}
   ]}
 ]}
],
evt_gojo:[
 {if:"gojo_joined",then:[
   {say:"GOJO",text:"Nah, I'd win. ...What? I would."}
 ],else:[
   {if:"badge3",then:[
     {say:"NEXUS",text:"MASSIVE anomaly opening on Route 4! Something's coming through!"},
     {say:"GOJO",text:"...Huh. This isn't Shibuya."},
     {say:"NEXUS",text:"A blindfolded man just walked OUT of the rift. Power level: yes."},
     {say:"GOJO",text:"A distortion spawn too? Rude. ...You! With the partners! Hold it still — TOGETHER!"},
     {wild:{sp:"alakazam",lvl:36,catchable:true}},
     {say:"GOJO",text:"Unlimited Void."},
     {say:"NEXUS",text:"He just sealed the rift with his MIND. I'm going to pretend I understand."},
     {say:"GOJO",text:"Throughout heaven and earth... you look fun. I'll tag along — try to keep up."},
     {giveMon:{sp:"gojo",lvl:35}},
     {say:"NEXUS",text:"GOJO joined! The anomaly is sealed. My sensors have never been this calm. Or this smug."},
     {set:"gojo_joined"}
   ],else:[
     {say:"NEXUS",text:"The mountain air is still. ...Too still. (Something's coming after the HARBOR badge.)"}
   ]}
 ]}
],
evt_tanjiro:[
 {if:"tanjiro_joined",then:[
   {say:"TANJIRO",text:"The air is clear today. A good day to get stronger!"}
 ],else:[
   {if:"badge2",then:[
     {say:"TANJIRO",text:"The air smells wrong... like a demon. ...THERE! A distortion spawn!"},
     {say:"NEXUS",text:"A distortion-spawned Haunter — it's terrorizing Fern Town!"},
     {say:"TANJIRO",text:"Water Breathing! ...Stand with me — TOGETHER!"},
     {wild:{sp:"haunter",lvl:24,catchable:true}},
     {say:"TANJIRO",text:"We did it! ...You fight beautifully. Please — let me travel with you. There may be more 'demons'."},
     {giveMon:{sp:"tanjiro",lvl:22}},
     {say:"TANJIRO",text:"Thank you! I'll work hard! ...Is anyone hungry? I can cook!"},
     {say:"NEXUS",text:"TANJIRO joined! Polite, kind, smells like sunshine. His sword, however, smells like victory."},
     {set:"tanjiro_joined"}
   ],else:[
     {say:"TANJIRO",text:"...Sniff. Demons... no, not yet. Come back after the FERN badge — the scent is growing."}
   ]}
 ]}
],
evt_ichigo:[
 {if:"ichigo_joined",then:[
   {say:"ICHIGO",text:"VEX is ahead. Stay sharp. ...And stay beside me — you've earned it."}
 ],else:[
   {say:"ICHIGO",text:"Tch. Another lost soul? ...No. You're alive. Interesting."},
   {say:"ICHIGO",text:"I'm ICHIGO — substitute Soul Reaper. This place? It's where lost souls wash up. I patrol it."},
   {say:"NEXUS",text:"He's been fighting distortion spawns here alone. For who knows how long."},
   {say:"ICHIGO",text:"Heads up — spawns! ...Fight with me. TOGETHER!"},
   {wild:{sp:"houndoom",lvl:48,catchable:true}},
   {say:"ICHIGO",text:"...Not bad. VEX is distorting this world from the chamber ahead — I'll guide you to him."},
   {say:"ICHIGO",text:"You fight with partners instead of a zanpakuto. ...Not bad at all. Let's finish this."},
   {giveMon:{sp:"ichigo",lvl:42}},
   {say:"NEXUS",text:"ICHIGO joined! His spiritual pressure just made my circuits shiver."},
   {set:"ichigo_joined"}
 ]}
],

/* ================= TOWN NPCs ================= */
npc_fern_elder:[
 {say:"ELDER",text:"FERN's garden gym is quiet... violently quiet. Bring burn heals, dearie."}
],
npc_harbor_kid:[
 {say:"KID",text:"I saw a Gyarados do a backflip yesterday! The harbor's the BEST!"}
],
npc_harbor_elder:[
 {say:"ELDER",text:"MARINA once surfed a tsunami for fun. The tsunami apologized."}
],
npc_summit_elder:[
 {say:"ELDER",text:"DRAKE's dragons fear HIM, you know. Let that sink in before you climb."}
],

/* ================= ELITE FOUR ================= */
e4_kaia:[
 {if:"badge4",then:[
   {if:"e4_1_done",then:[
     {say:"KAIA",text:"My fists remember you. Go — the others won't go easy."}
   ],else:[
     {say:"NEXUS",text:"SCOUT: KAIA leads LUCARIO (Lv47). No tricks — pure offense. Hit first, hit hard."},
     {battle:{trainer:"e4-kaia"}},
     {set:"e4_1_done"},
     {heal:true},
     {say:"NEXUS",text:"ONE DOWN. Three to go. The League's heart is pounding — mine too, and I'm a chip."}
   ]}
 ],else:[
   {say:"KAIA",text:"Four badges to enter. The mountain does not move for the unproven."}
 ]}
],
e4_mortis:[
 {if:"e4_1_done",then:[
   {if:"e4_2_done",then:[
     {say:"MORTIS",text:"The dead still whisper your name. Fondly, now."}
   ],else:[
     {say:"NEXUS",text:"SCOUT: MORTIS leads GENGAR (Lv48). Dark-types feast on ghosts — bring crunch."},
     {battle:{trainer:"e4-mortis"}},
     {set:"e4_2_done"},
     {heal:true},
     {say:"NEXUS",text:"TWO DOWN. The whispers are cheering for you now. Creepy. Supportive, but creepy."}
   ]}
 ],else:[
   {say:"MORTIS",text:"KAIA first, little trainer. The dead insist on order."}
 ]}
],
e4_ferro:[
 {if:"e4_2_done",then:[
   {if:"e4_3_done",then:[
     {say:"FERRO",text:"The crack remains. A reminder. Proceed, breaker of steel."}
   ],else:[
     {say:"NEXUS",text:"SCOUT: FERRO leads METAGROSS (Lv49). Fire and Fighting melt steel. Bring both."},
     {battle:{trainer:"e4-ferro"}},
     {set:"e4_3_done"},
     {heal:true},
     {say:"NEXUS",text:"THREE DOWN. One elite left. Your hands are shaking — mine would be too, if I had hands."}
   ]}
 ],else:[
   {say:"FERRO",text:"MORTIS first. Steel respects the order of things."}
 ]}
],
e4_sage:[
 {if:"e4_3_done",then:[
   {if:"e4_4_done",then:[
     {say:"SAGE",text:"This timeline pleases me. Go — the Champion dreams of you."}
   ],else:[
     {say:"NEXUS",text:"SCOUT: SAGE leads ALAKAZAM (Lv49). Dark, Ghost, Bug — pick your poison. Literally, bring poison."},
     {battle:{trainer:"e4-sage"}},
     {set:"e4_4_done"},
     {heal:true},
     {say:"NEXUS",text:"ALL FOUR DOWN. Only SERAPHINA stands between you and the crown. Breathe. ...Okay, now go."}
   ]}
 ],else:[
   {say:"SAGE",text:"I have seen this conversation. It ends with you facing FERRO first."}
 ]}
],

/* ================= CHAMPION + THE TWIST ================= */
champ_seraphina:[
 {if:"e4_4_done",then:[
   {if:"champion",then:[
     {say:"SERAPHINA",text:"Champion. The crown looks good on you. ...Try not to break reality with it."}
   ],else:[
     {say:"NEXUS",text:"SCOUT: SERAPHINA's team is perfect coverage — Dragonite, Tyranitar, Metagross, Gengar, Salamence, Gardevoir. No safe switches. Play bold."},
     {battle:{trainer:"champ-seraphina"}},
     {heal:true},
     {say:"SERAPHINA",text:"...Take the crown, Champion. You've earned the sky itself."},
     {fanfare:true},
     {set:"champion"},
     {say:"NEXUS",text:"CHAMPION! Confetti! Tears! ...Wait. Why is the sky tearing open?!"},
     {say:"VEX",text:"Thank you, Champion. What a LOVELY ceremony. It'll make a fine funeral for reality."},
     {say:"VEX",text:"Three Umbral Seals — a survey team's prize, a port heist's loot, a courier's cargo."},
     {say:"VEX",text:"All 'liberated' by a meddling child. ...I'll be taking those BACK."},
     {say:"NEXUS",text:"He took the seals! The rift is opening — DISTORTION WORLD!"},
     {say:"VEX",text:"GIRATINA! TEAR IT ALL DOWN!"},
     {say:"SERAPHINA",text:"Go! Into the rift! We'll hold the League — finish this, Champion!"},
     {warp:{map:"distortion-1",x:11,y:16}},
     {set:"ceremony_done"}
   ]}
 ],else:[
   {say:"SERAPHINA",text:"Four elites, little one. Then we talk."}
 ]}
],

/* ================= FINALE ================= */
evt_vex:[
 {say:"VEX",text:"So. The Champion crawls into my world. How... expected."},
 {say:"VEX",text:"While you collected badges, I collected GODS. Giratina answers to ME now."},
 {say:"NEXUS",text:"The seals are already spent — the rift is self-sustaining! We have to beat him AND calm Giratina!"},
 {battle:{trainer:"vex"}},
 {say:"NEXUS",text:"VEX is down! But the rift's still open — and something MASSIVE is coming through!"},
 {wild:{sp:"giratina",lvl:60,catchable:true,noRun:true}},
 {say:"NEXUS",text:"...It's calming down. The Distortion World is stabilizing. You did it — you actually did it."},
 {say:"???",text:"...So. The child Arceus chose."},
 {say:"ARCEUS",text:"I am ARCEUS. You have proven your heart across every world that bled into yours."},
 {say:"ARCEUS",text:"Now prove your strength. FACE ME."},
 {wild:{sp:"arceus",lvl:70,catchable:false,noRun:true}},
 {say:"ARCEUS",text:"Enough. You are worthy, Champion. The rift is sealed. These worlds are yours to protect."},
 {say:"ARCEUS",text:"Goku. Luffy. Gojo. Naruto. Ichigo. Deku. Tanjiro. Saitama. Watch over this one — they bite off more than they can chew."},
 {say:"GOKU",text:"Heheh! Leave it to us!"},
 {set:"postgame"},
 {heal:true}
],

credits:[
 {say:"CREDITS",text:"POKéMON: DISTORTION RIFT"},
 {say:"CREDITS",text:"Starring: YOU, the new Champion."},
 {say:"CREDITS",text:"And: NEXUS, ECHO, PROF. MAPLE, VOLTA, FERN, MARINA, DRAKE."},
 {say:"CREDITS",text:"Special thanks: GOKU, LUFFY, GOJO, NARUTO, ICHIGO, DEKU, TANJIRO, SAITAMA."},
 {say:"CREDITS",text:"Box arts: GIRATINA & ARCEUS — the Renegade and the Original."},
 {say:"CREDITS",text:"Post-game: the RIFT DEN awaits. Legendaries converge. Saitama is there. Bring Ultra Balls."},
 {say:"NEXUS",text:"...THE END?"},
 {warp:{map:"circuit-town",x:10,y:2}}
],

/* ================= POST-GAME ================= */
evt_saitama_rift:[
 {if:"saitama_joined",then:[
   {say:"SAITAMA",text:"...Huh? Oh. Training's done. ...Want to spar? ...Actually, let's not."}
 ],else:[
   {say:"???",text:"Huh? A rift? ...Is this still Z-City?"},
   {say:"SAITAMA",text:"I'm SAITAMA. A hero for fun. ...You look like trouble finds you. I like trouble."},
   {say:"SAITAMA",text:"One punch should do it. ...Kidding. Mostly."},
   {giveMon:{sp:"saitama",lvl:60}},
   {say:"NEXUS",text:"Power level: yes. Ally acquired: the strongest. Try not to break the game."},
   {set:"saitama_joined"}
 ]}
],

npc_rift_terminal:[
 {say:"RIFT TERMINAL",text:"Six stable rifts detected. Each holds legendaries from a fallen timeline."},
 {say:"RIFT TERMINAL",text:"The north and south groves are CROSSOVER GROVES — rare starters wander the grass. Yes, even THOSE starters."},
 {say:"RIFT TERMINAL",text:"WARNING: each rift collapses after its guardians are faced. Bring Ultra Balls. Bring courage."}
],

rift_kanto:[
 {if:"rift_kanto_done",then:[
   {say:"NEXUS",text:"The Kanto rift has gone quiet."}
 ],else:[
   {say:"NEXUS",text:"A KANTO rift! Overwhelming psychic power... This is one-time — make it count!"},
   {wild:{sp:"mewtwo",lvl:70,catchable:true}},
   {set:"rift_kanto_done"}
 ]}
],
rift_johto:[
 {if:"rift_johto_done",then:[
   {say:"NEXUS",text:"The Johto rift has gone quiet."}
 ],else:[
   {say:"NEXUS",text:"A JOHTO rift! The guardians of sea and sky... two battles, one rift!"},
   {wild:{sp:"lugia",lvl:70,catchable:true}},
   {say:"NEXUS",text:"The rift surges again!"},
   {wild:{sp:"ho-oh",lvl:70,catchable:true}},
   {set:"rift_johto_done"}
 ]}
],
rift_hoenn:[
 {if:"rift_hoenn_done",then:[
   {say:"NEXUS",text:"The Hoenn rift has gone quiet."}
 ],else:[
   {say:"NEXUS",text:"A HOENN rift! Land, sea, and sky incarnate — THREE guardians!"},
   {wild:{sp:"kyogre",lvl:70,catchable:true}},
   {wild:{sp:"groudon",lvl:70,catchable:true}},
   {wild:{sp:"rayquaza",lvl:75,catchable:true}},
   {set:"rift_hoenn_done"}
 ]}
],
rift_sinnoh:[
 {if:"rift_sinnoh_done",then:[
   {say:"NEXUS",text:"The Sinnoh rift has gone quiet."}
 ],else:[
   {say:"NEXUS",text:"A SINNOH rift! Time and space themselves... be respectful. And bring Ultra Balls."},
   {wild:{sp:"dialga",lvl:72,catchable:true}},
   {wild:{sp:"palkia",lvl:72,catchable:true}},
   {set:"rift_sinnoh_done"}
 ]}
],
rift_unova:[
 {if:"rift_unova_done",then:[
   {say:"NEXUS",text:"The Unova rift has gone quiet."}
 ],else:[
   {say:"NEXUS",text:"A UNOVA rift! Truth and ideals, given dragon form!"},
   {wild:{sp:"zekrom",lvl:72,catchable:true}},
   {wild:{sp:"reshiram",lvl:72,catchable:true}},
   {set:"rift_unova_done"}
 ]}
],
rift_god:[
 {if:"rift_god_done",then:[
   {say:"NEXUS",text:"The god-rift has gone quiet. ...Mostly. I can still hear it humming."}
 ],else:[
   {say:"NEXUS",text:"A GOD-RIFT. Sun, moon, sword, past, future... and the Original One itself. This is the big one."},
   {wild:{sp:"solgaleo",lvl:72,catchable:true}},
   {wild:{sp:"lunala",lvl:72,catchable:true}},
   {wild:{sp:"zacian",lvl:72,catchable:true}},
   {wild:{sp:"koraidon",lvl:75,catchable:true}},
   {wild:{sp:"miraidon",lvl:75,catchable:true}},
   {say:"ARCEUS",text:"You return, Champion. Very well — face me again. This time, I will not hold back."},
   {wild:{sp:"arceus",lvl:80,catchable:true,noRun:true}},
   {set:"rift_god_done"}
 ]}
]
};

/* ---- story validation: every referenced id must exist ---- */
(function(){
var errs = [];
function ops(list, sid){
  (list||[]).forEach(function(op){
    if(op.say && !op.text) errs.push(sid+": say without text");
    if(op.give && !G.Data.ITEMS[op.give.item]) errs.push(sid+": item "+op.give.item);
    if(op.giveMon && !G.Data.SPECIES[op.giveMon.sp]) errs.push(sid+": mon "+op.giveMon.sp);
    if(op.battle && op.battle.trainer){
      var _treg = (G.Maps && G.Maps.TRAINERS && G.Maps.TRAINERS[op.battle.trainer]) ||
                  (G.Story.trainers && G.Story.trainers[op.battle.trainer]) ||
                  (G.Data.TRAINERS && G.Data.TRAINERS[op.battle.trainer]);
      if(!_treg) errs.push(sid+": trainer "+op.battle.trainer);
    }
    if(op.wild && !G.Data.SPECIES[op.wild.sp]) errs.push(sid+": wild "+op.wild.sp);
    if(op.warp && !G.Maps.LIST[op.warp.map]) errs.push(sid+": map "+op.warp.map);
    if(op.if){ ops(op.then, sid); ops(op.else, sid); }
  });
}
Object.keys(G.Story.SCRIPTS).forEach(function(sid){ ops(G.Story.SCRIPTS[sid], sid); });
/* every npc dialog id must have a script */
Object.values(G.Maps.LIST).forEach(function(m){
  (m.npcs||[]).forEach(function(n){
    if(!G.Story.SCRIPTS[n.dialog]) errs.push("map "+m.id+": no script for dialog "+n.dialog);
  });
});
G.Story._errors = errs;
})();

/* ================= G.Story.play — script interpreter =================
   Executes SCRIPTS op arrays sequentially via engine UI scenes.
   Ops: say, give, giveMon, battle, wild, warp, set, if, choice, heal, fanfare.
   Safe to call from NPC dialogs, map onEnter, or main.js flows. Never throws. */
(function(){
  function flagStore(){
    try {
      if (G.Save && G.Save.data) { G.Save.data.flags = G.Save.data.flags || {}; return G.Save.data.flags; }
    } catch(e){}
    G.Story.flags = G.Story.flags || {};
    return G.Story.flags;
  }
  function setFlag(k, v){ try { flagStore()[k] = (v === undefined ? true : v); } catch(e){} }
  function getFlag(k){ try { return flagStore()[k]; } catch(e){ return undefined; } }

  function dlg(items, cb){
    try { G.Engine.dialog(items && items.length ? items : [{name:"", text:"..."}], function(){ cb(); }); }
    catch(e){ cb(); }
  }

  function doGive(op, cb){
    var g = op.give || {}, item = g.item, n = g.n || 1;
    try {
      var d = G.Save && G.Save.data;
      if (d) { d.bag = d.bag || {}; d.bag[item] = (d.bag[item] || 0) + n; }
      var nm = (G.Data && G.Data.ITEMS && G.Data.ITEMS[item] && G.Data.ITEMS[item].name) || item;
      try { if (G.Audio) G.Audio.sfx("select"); } catch(e){}
      dlg([{name:"", text:"Obtained " + nm + (n > 1 ? " ×" + n : "") + "!"}], cb);
    } catch(e){ cb(); }
  }

  function doGiveMon(op, cb){
    var gm = op.giveMon || {}, sp = gm.sp || gm, lvl = gm.lvl || 5;
    try {
      var inst = G.Party.makeMon(sp, lvl), where = "box", nm = sp;
      if (inst) {
        where = G.Party.addToPartyOrBox(inst) || "box";
        nm = G.Party.monName(inst);
        try {
          var d = G.Save && G.Save.data;
          if (d) { d.dex.seen[sp] = true; d.dex.caught[sp] = true; }
        } catch(e){}
      }
      dlg([{name:"", text:nm + " joined your " + (where === "party" ? "party" : "PC Box") + "!"}], cb);
    } catch(e){ cb(); }
  }

  function whiteoutThenEnd(){
    // standard blackout: heal, warp to last heal point, script aborts (no cb)
    try {
      if (G.Party) G.Party.healAll();
      var lh = (G.Save && G.Save.data && G.Save.data.lastHeal) || {map:"circuit-town", x:10, y:10};
      dlg([{name:"", text:"You have no Pokémon able to battle!"},{name:"", text:"You blacked out!"}], function(){
        try { if (G.Overworld) G.Overworld.warpTo(lh.map, lh.x, lh.y); } catch(e){}
      });
    } catch(e){}
  }

  function doBattle(op, cb){
    var res = null;
    try { res = G.Battle.resolveTrainer(op.battle.trainer); } catch(e){}
    if (!res || !res.foes || !res.foes.length) { cb(); return; }
    var seq = [];
    try {
      if (G.AI && (res.trainer.ai === "boss" || res.trainer.ai === "echo")) {
        var sc = G.AI.nexusScout({name: res.trainer.name, team: res.foes, ai: res.trainer.ai});
        if (sc) seq.push({name:"NEXUS", text:sc});
      }
    } catch(e){}
    seq = seq.concat(res.intro || []);
    dlg(seq.length ? seq : [{name:res.trainer.name, text:"Battle!"}], function(){
      G.Battle.start({
        kind: res.kind || "trainer",
        foe: res.foes,
        trainer: res.trainer,
        canCatch: !!res.catchable,
        catchable: !!res.catchable,
        onEnd: function(r){
          if (r && r.won) {
            try {
              var d = G.Save && G.Save.data;
              if (d) d.money = (d.money || 0) + (res.trainer.reward || 0);
            } catch(e){}
            setFlag("beat_" + op.battle.trainer, true);
            var outro = (res.outro && res.outro.length) ? res.outro : [{name:res.trainer.name, text:"Not bad... not bad at all."}];
            dlg(outro, cb);
          } else if (r && r.won === false && !r.fled) {
            whiteoutThenEnd(); // script aborts
          } else { cb(); } // fled (shouldn't happen in trainer battles) — continue
        }
      });
    });
  }

  function doWild(op, cb){
    var w = op.wild || {}, sp = w.sp, lvl = w.lvl || 5;
    try {
      var inst = G.Party.makeMon(sp, lvl);
      if (!inst) { cb(); return; }
      G.Battle.start({
        kind: "wild", foe: inst,
        canCatch: w.catchable !== false,
        bossCatchBonus: w.bossCatchBonus || 1,
        noRun: w.noRun === true,
        onEnd: function(r){
          if (r && r.won === false && !r.fled) whiteoutThenEnd();
          else cb();
        }
      });
    } catch(e){ cb(); }
  }

  function runOps(ops, i, done){
    if (i >= ops.length) { done(); return; }
    var op = ops[i] || {};
    function next(){ runOps(ops, i + 1, done); }
    try {
      if (op.say !== undefined) { dlg([{name:op.say || "", text:op.text || ""}], next); return; }
      if (op.give) { doGive(op, next); return; }
      if (op.giveMon) { doGiveMon(op, next); return; }
      if (op.battle) { doBattle(op, next); return; }
      if (op.wild) { doWild(op, next); return; }
      if (op.warp) {
        try { if (G.Overworld) G.Overworld.warpTo(op.warp.map, op.warp.x, op.warp.y); } catch(e){}
        next(); return;
      }
      if (op.set !== undefined) {
        if (typeof op.set === "string") setFlag(op.set, true);
        else if (op.set && typeof op.set === "object") {
          Object.keys(op.set).forEach(function(k){ setFlag(k, op.set[k]); });
        }
        next(); return;
      }
      if (op.if !== undefined) {
        var branch = getFlag(op.if) ? (op.then || []) : (op.else || []);
        runOps(branch, 0, next); return;
      }
      if (op.choice) {
        var c = op.choice, opts = c.opts || ["..."];
        G.Engine.menuList(opts.map(function(o){ return {label:String(o)}; }), {title:c.q || "Choose"}, function(idx){
          if (idx === undefined || idx === null || idx < 0) idx = 0;
          if (c.set) { setFlag(c.set, idx); setFlag(c.set + "_text", opts[idx]); }
          next();
        });
        return;
      }
      if (op.heal) {
        try { if (G.Party) G.Party.healAll(); if (G.Audio) G.Audio.sfx("heal"); } catch(e){}
        next(); return;
      }
      if (op.fanfare) { try { if (G.Audio) G.Audio.sfx("fanfare"); } catch(e){} next(); return; }
      next(); // unknown op: skip
    } catch(e){ next(); }
  }

  G.Story.play = function(id, cb){
    var scr = G.Story.SCRIPTS[id];
    if (!scr) { if (cb) cb(); return; }
    try { runOps(scr, 0, function(){
      try { if (G.Save) G.Save.save(); } catch(e){}
      if (cb) cb();
    }); } catch(e){ if (cb) cb(); }
  };
  // lowercase alias (tests + any external callers)
  G.Story.scripts = G.Story.SCRIPTS;
})();
