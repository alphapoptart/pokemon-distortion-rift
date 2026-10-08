# SPEC — Pokémon: Distortion Rift (fan game)

A complete, playable, GBA-style monster-taming RPG as a mobile-first HTML5 web app.
Target: iPhone Safari (touch controls, Add to Home Screen), also keyboard on desktop.
Stack: vanilla JS, NO modules, NO build step. Plain `<script>` tags in dependency order.
One global namespace: `window.G`. No external assets except `assets/boxart.png` (title art).
Everything must run from `file://` and from the artifact host. No network calls.

## Directory layout (all under ~/workspace/pokemon-game/)
```
index.html
css/style.css
assets/boxart.png            (generated separately — title screen art)
js/util.js
js/data.js                   (types chart, moves, items, species: starters/regulars/legendaries/mythicals)
js/anime.js                  (anime ally species + evolutions + signature moves live here)
js/fusions.js                (curated signature fusions + fusion generator logic data)
js/maps.js                   (tile maps, NPCs, warps, encounters, trainers)
js/story.js                  (story scripts, chapters, gym/elite/finale events)
js/audio.js                  (WebAudio chiptune songs + sfx)
js/sprites.js                (procedural pixel sprites for mons/trainers, fusion blending)
js/ai.js                     (NEXUS companion, ECHO adaptive rival, ANOMALY director, Overclock autopilot)
js/engine.js                 (input incl. touch, game loop, renderer, UI widgets, scene manager, dialog)
js/overworld.js              (player movement, NPCs, grass, interactions, warps)
js/battle.js                 (battle engine + battle UI + animations)
js/party.js                  (party/box/PC menus, fusion lab UI, shop, heal)
js/main.js                   (boot, title screen, new game/continue, save/load, wiring)
```
Script order in index.html: util, data, anime, fusions, maps, story, audio, sprites,
ai, engine, overworld, battle, party, main.

## Global style rules for all code
- ES2019-compatible JS only (no optional chaining excess — it IS allowed, keep moderate).
- Every file guards with `window.G = window.G || {}` and attaches its API, e.g. `G.Battle = {...}`.
- No `console.log` spam; no `alert/confirm/prompt`.
- All user-facing text goes through UI widgets (no raw DOM text dumps).
- Fail-safe: any module must tolerate missing optional data (e.g. unknown species id ->
  fallback "MissingNo"-style blob sprite, never crash).
- Pure logic (damage calc, type chart, fusion combine, xp) must be DOM-free functions so
  `node --check` and node unit tests can load data files standalone.

## Core data schemas

### G.Data.TYPES — array of 18 type names + G.Data.CHART: {attacking: {defending: mult}}
Use the standard Pokémon type chart (Gen 6+, incl. Fairy; no Inverse). Include 0, 0.5, 1, 2.

### Moves — G.Data.MOVES = { id: move }
```js
{ id:"kamehameha", name:"Kamehameha", type:"Fighting", cat:"spec", pow:95, acc:100, pp:10,
  eff:{}, // optional: {stat:{atk:-1}, foeStat:{def:-1}, status:"par", statusChance:10,
          //  heal:0.5 (of max), recoil:0.25, drain:0.5, flinch:10, priority:1, hits:[2,5]}
  desc:"..." }
```
- ~110 moves: all standard staples (Tackle, Ember, Water Gun, Thunder Shock, Vine Whip,
  Quick Attack, Swift, Bite, ... full coverage of every type, status moves: Growl, Tail Whip,
  Thunder Wave, Sleep Powder, Swords Dance, Recover, Protect, etc.) PLUS signature moves:
  Spacial Rend, Roar of Time, Shadow Force, Judgment, Aura Sphere, Precipice Blades,
  Oblivion Wing, Genesis Supernova, Searing Sunraze Smash, Light That Burns the Sky, etc.,
  PLUS anime signatures: Kamehameha, Spirit Bomb, Rasengan, Chidori, Hollow Purple,
  Domain Expansion, Gear Fifth: Bajrang Gun, Getsuga Tensho, One Punch, Detroit Smash,
  Hinokami Kagura, Infinity Guard.
- cat is "phys" | "spec" | "status". Status moves have pow 0.

### Species — G.Data.SPECIES = { id: species }
```js
{ id:"giratina", name:"Giratina", dex:487, cat:"legendary", types:["Ghost","Dragon"],
  base:{hp:150,atk:100,def:120,spa:100,spd:120,spe:90},
  abilities:["Pressure"], catchRate:3,
  levelMoves:[[1,"shadow-force"],[1,"dragon-claw"],...],
  evo:[], // or [{to:"x", by:"level", at:16}] / [{to:"x", by:"stone", item:"fire-stone"}]
  sprite:{ shape:"serpent", seed:487, pal:["#3a3a4a","#c9a227","#8a8a9a"] },
  flavor:"...", fuseable:false, anime:false }
```
- `cat`: "starter" | "regular" | "legendary" | "mythical" | "anime" | "fusion".
- `shape`: one of quad, biped, serpent, winged, bird, fish, blob, humanoid, insect, ghostly.
- `pal`: 3-5 hex colors (dark outline auto-derived).
- `fuseable`: false for ALL anime allies, Arceus, Giratina, and a few others; true otherwise.
- Stat totals: use REAL base stats for all real Pokémon (legendaries/mythicals included).
- `levelMoves`: learnset as [level, moveId] pairs, ~8-14 entries, must reference real move ids.
- Every species needs flavor text (1 line).

Content quotas (content agent):
- 3 custom synthetic starters (AI-region theme): SPARKIT (Electric), AQUIL (Water), TERRAFEN (Grass/Ground). Each 3-stage evolution line with real-feeling names.
- ~55 regular Pokémon (Gen 1-3 favorites with real stats/moves: Pikachu, Charizard line, Gengar line, Dragonite line, Tyranitar line, Gardevoir line, Aggron, Flygon, etc.)
- ALL legendary + mythical Pokémon Gen 1-9 as data (birds, Mewtwo, Mew, beasts, Ho-Oh, Lugia, Celebi, Regis, Lati@s, Groudon, Kyogre, Rayquaza, Jirachi, Deoxys, lake trio, Dialga, Palkia, Giratina, Heatran, Regigigas, Cresselia, Darkrai, Shaymin, Arceus, swords of justice, kami trio, Tao trio, Victini, Keldeo, Meloetta, Genesect, Xerneas, Yveltal, Zygarde, Diancie, Hoopa, Volcanion, Tapus, Cosmog line, Necrozma, Magearna, Marshadow, Zeraora, Meltan, Melmetal, Zacian, Zamazenta, Eternatus, Kubfu, Urshifu, Regieleki, Regidrago, Glastrier, Spectrier, Calyrex, Enamorus, Koraidon, Miraidon, ruin quartet, Ogerpon, Terapagos, Pecharunt). Every one catchable in-game (static encounters / rifts / post-game).
- Anime allies (js/anime.js), each with evolution line, NOT fuseable:
  Goku: Goku → Super Saiyan Goku (32) → SSJ2 Goku (40) → SSJ3 Goku (48) → SSG Goku (56) → SSB Goku (64) → Ultra Instinct Goku (72). Fighting primary.
  Luffy: Luffy → Gear 2 (28) → Gear 3 (36) → Gear 4 (44) → Gear 5: Nika (56). Fighting/Fire at Nika.
  Gojo: Gojo → Gojo: Sorcerer (32) → Gojo: The Honored One (52). Psychic.
  Naruto: Naruto → Sage Naruto (30) → KCM Naruto (42) → Six Paths Naruto (58). Fighting/Wind→Fighting/Flying? Use Fighting then Fighting/Fairy? Keep Fighting primary, secondary varies sanely.
  Ichigo: Ichigo → Bankai Ichigo (34) → Horn of Salvation (52). Ghost/Fighting.
  Deku: Deku → Full Cowling (30) → 100% Deku (48). Fighting/Electric.
  Tanjiro: Tanjiro → Hinokami (35) → Sun Hashira (52). Fire/Fighting.
  Saitama: Caped Baldy → Serious Saitama (40). Fighting/Normal. (Joke: absurdly high Attack.)
- Fusions (js/fusions.js): 24 curated signature fusions (e.g. Charizard+Mewtwo, Gengar+Alakazam, Dragonite+Tyranitar, Lucario+Zoroark...) as real species entries with blended names/stats, PLUS the fusion engine: fuse ANY two fuseable mons → generated species id `fuse_<a>_<b>`, name = bodyName.slice(0,~half) + headName.slice(~half) (Infinite Fusion convention), types = [body primary, head primary] (dedupe), stats = avg with +5% boost, movepool = union of both learnsets, sprite = blended procedural sprite, dex # = 10000+ counter. Generated fusions must be storable in party/box/save and usable in battle.

### Items — G.Data.ITEMS = { id: {id,name,desc,price,kind} }
kind: "ball" (poke-ball, great-ball, ultra-ball, master-ball), "heal" (potion, super-potion,
hyper-potion, max-potion, revive, full-heal, antidote, paralyze-heal, awakening, burn-heal, ice-heal),
"evo" (fire/water/thunder/leaf/moon/sun stone), "key" (dna-splicers, umbral-shard, bike? no—keep: dna-splicers, seal-1..3, rift-key), "battle" (x-attack...). ~30 items.

## Maps — G.Maps.LIST = { id: map }
```js
{ id:"circuit-town", name:"Circuit Town", w:20, h:16, music:"town",
  tiles:[ "####################", ... ],   // strings, see legend
  encounters:null, // towns: none
  npcs:[ {x:5,y:6,sprite:"prof", dir:"down", dialog:"intro_prof", wander:false} ],
  trainers:[], warps:[ {x:10,y:0,to:"route-1",tx:10,ty:15} ],
  signs:[ {x:3,y:3,text:"..."} ], heal:{x:14,y:4}, shop:{x:4,y:10}, pc:{x:14,y:4} }
```
Tile legend (single chars): `#` wall/tree/building-block, `.` path, `,` tall grass,
`~` water (surf not needed — block), `D` door mat (stand → warp), `=` road, `*` flower,
`s` sand, `T` tree deco (blocked), `o` rock (blocked), ` ` void (blocked).
Buildings drawn as # blocks with D doors; interiors are separate maps.
- ~14 maps: circuit-town (+player house, lab interiors), route-1, volt-city (+gym, center, mart, houses), route-2, fern-town (+gym), route-3 (+goku crash site), harbor-town (+gym), route-4, summit-town (+gym), victory-road (dungeon), pokemon-league, distortion-world (final dungeon, 2 floors), rift-den (post-game legendary hub).
- Routes have encounters: [{sp, min, max, w}] weighted + level ranges; grassRate ~12%.
- Trainers placed on routes/gyms with teams, sight lines optional (talk-to-battle is fine + a few "spot" trainers).

## Story — G.Story
- Flags object; scripts keyed by id. Script = array of ops:
  `{say:"Name", text:"..."}` `{give:{item:"potion",n:3}}` `{giveMon:{sp:"sparkit",lvl:5}}`
  `{battle:{trainer:"gym1"}}` `{wild:{sp:"mewtwo",lvl:50,catchable:true}}`
  `{warp:{map:"x",x,y}}` `{set:"flag"}` `{if:"flag", then:[...], else:[...]}` `{choice:{q:"..",opts:["a","b"],set:"flag"}}`
  `{heal}` `{evoScene:{slot:0}}` `{sfx/fanfare}` `{end}`
- Chapters: intro → starter choice (3 starters, rival ECHO picks advantage) → gym1 (Volt City, Electric, leader VOLTA) → Team UMBRA intro (grunts steal NEXUS data) → gym2 (Fern Town, Grass, leader FERN) → Goku rift event → gym3 (Harbor, Water, leader MARINA) + Luffy joins → Gojo anomaly → gym4 (Summit, Dragon, leader DRAKE) → Victory Road → Elite Four (4) → Champion SERAPHINA → twist: UMBRA opens Rift during ceremony → Distortion World → Admin battles → VEX boss → GIRATINA battle (catchable) → ARCEUS descends (test battle, catchable post-credits) → credits → post-game: rift-den with remaining legendaries, Saitama rift, fusion lab repeatables.
- UMBRA motive: collect 3 Umbral Seals to force Giratina to tear reality; Arceus chose the player via NEXUS.
- All gym leaders / elite four / champion / VEX / admins have full teams (4-6 mons, sensible movesets, held logic simple).
- Rival ECHO: 5 encounters across story; team built by G.AI.echoParty(stage) adapting to player.

## Battle — G.Battle
- `G.Battle.start({kind:"wild"|"trainer"|"boss", foe: instance|[instances], trainer:{name,sprite,reward,ai:"basic"|"echo"|"boss"}, canCatch:true, bossCatchBonus, onEnd(result)})`
- result: {won, caught:[], fled}
- Turn loop UI: Fight (4 move buttons w/ PP + type color) / Pokémon (switch) / Bag (balls/heals) / Run.
- Mechanics: STAB 1.5, type chart, crit 1/16 ×1.5, random 0.85–1.0, accuracy check, priority, status (par 25% no-move + spe/4; brn atk/2 + 1/16 dmg; psn 1/8; slp 1-3 turns; frz 20% thaw), stat stages ±6 (×1.5^n-ish standard multipliers), flinch, recoil, drain, multi-hit, protect (blocks once), switch on faint (no free switch after KO for player? standard: prompt switch, foe gets no free hit — keep simple & fair).
- Catch formula: gen3-ish: a = ((3*maxHP - 2*hp) * catchRate * ballBonus) / (3*maxHP); shake prob; 4 shakes.
- XP: medium-fast curve; EV-free; IVs random 0-31; shiny 1/512.
- Animations: sprite lunge, hit flash, HP bar tween, particles (type-colored), shake on catch, evolution scene with fanfare.
- Boss battles: no run, no catch except flagged (Giratina/Arceus catchable).
- Trainer AI: basic = random super-effective-ish; echo = G.AI.overclock-style smart; boss = smart + occasional heal <30%.

## Overworld — G.Overworld
- Tile movement (GBA smooth step), 4-dir, collision, camera follows, NPC wander/face, talk (A), grass encounters, warps with fade, signs, ledges? (skip ledges).
- Party menu (START): Pokémon / Bag / NEXUS (AI tips+objectives) / Save / Options (text speed, battle anims, difficulty AI-Sync, Overclock toggle) / Pokédex (seen/caught counts).

## Party/Box/PC — G.Party
- party[6], box[30×? simple list], deposit/withdraw, heal at center, nickname, release.
- Fusion Lab UI (key item dna-splicers, lab in Circuit Town): pick body + head → preview (name/types/stats/sprite) → confirm → consumes? (Infinite Fusion: both consumed into fusion; do that, warn first). Anime allies + Arceus/Giratina blocked with message.

## AI twist — G.AI  (this is a headline feature — make it feel alive)
1. NEXUS companion: `G.AI.nexusTip()` — context-aware (location, badges, party weaknesses, next objective, recent losses). Personality: witty AI chip. Also pre-battle scout for gym/boss: reveals foe ace + type tips. Post-battle: 1-line analysis.
2. ECHO adaptive rival: `G.AI.notePlayerBattle(leadTypes, moveCats, won)` after every battle; `G.AI.echoParty(stage)` builds counters from a pool (e.g. player spams Water → ECHO brings Grass/Electric). Taunts reference actual habits.
3. ANOMALY director: every few minutes of play may spawn: Distortion Rift (a legendary appears on current route, 5-min window), Shiny Surge (shiny rate up 5 min), Umbra Ambush (trainer battle), Anime Distress (side quest to recruit ally), NEXUS Gift (rare item). Toast + map marker.
4. Overclock autopilot: Options toggle; in battle an "AI" button lets NEXUS pick the move/switch (smart heuristic: best effective STAB, switch on 4x weakness or <25% hp, heal if safe).
5. AI-Sync difficulty: foes scale ±2 levels toward party average; toggleable.

## Audio — G.Audio
- WebAudio, square/triangle waves. Songs: title, town, route, gym, battle-wild, battle-trainer, battle-boss, distortion, evolution, credits. Simple looping note sequences (define as compact arrays). SFX: select, bump, heal, catch-click, shake, fanfare, cry (procedural per species seed: 2-3 descending blips), hit, super-effective, faint.

## Sprites — G.Sprites
- Procedural pixel art on offscreen canvas, cached. `G.Sprites.mon(id, {shiny, back, size})` → canvas.
- Shapes: quad/biped/serpent/winged/bird/fish/blob/humanoid/insect/ghostly — draw body, head, eyes, limbs/wings/tail per shape with palette; anime humanoids get distinct look (hair spikes for Goku etc. via seed traits).
- `G.Sprites.fuse(aId,bId)` → blended canvas (mix shapes: body shape of a, head/features of b, palette mix).
- Trainers: `G.Sprites.trainer(kind)` — kinds: prof, rival, grunt, admin, leader, elite, champ, vex, nurse, clerk, kid, elder, scientist.
- Player sprite: customizable? Keep one hero sprite (cap kid) + rival sprite.

## Engine — G.Engine
- Canvas 480×320 (scale ×2 = 960×640 logical? No — render at 480×320, CSS scale to fit, image-rendering: pixelated).
- Input: keyboard (arrows/WASD, Z=A, X=B, Enter=Start) + touch: D-pad (left), A/B (right), START/SELECT pills. Buttons sized for thumbs; menus also tappable.
- Scene stack with transitions (fade). UI widgets: dialog box (typewriter, tap/A to advance), menu list, yes/no, toast, HP bars.
- Fixed timestep update (60fps), requestAnimationFrame.

## Save — G.Save
- localStorage key `distortion_rift_save`. Save: player pos/map, party, box, items, flags, dex, badges, playtime, echo profile, options. Autosave on map change + manual.

## Title screen
- Show assets/boxart.png full-bleed with title "POKÉMON: DISTORTION RIFT", menu: New Game / Continue / Options. Press A/tap.

## Acceptance criteria
- `node --check` passes on every js file.
- New game → starter → route-1 wild battle → catch → gym1 → ... → credits is scriptable; provide `test/smoke.js` (node) exercising: damage calc, type chart spot checks, fusion generation, xp/evolution, save/load roundtrip, story script op validation (all script ids referenced exist, all species/move/map ids referenced exist).
- No placeholder text ("TODO", "lorem") anywhere in player-facing content.
- 60fps on iPhone Safari; total JS < ~1.2MB unminified fine.

Write clean, complete, working code. This is the fun part — make battles feel punchy,
dialogue genuinely funny/epic, and the AI systems actually noticeable in play.
