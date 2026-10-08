/* G.Sprites — hybrid sprite system.
   REAL Pokémon: Gen 5 B/W sprites from assets/sprites/{dex}.png
     ({dex}-shiny.png, {dex}-back.png, {dex}-back-shiny.png), loaded async with
     in-memory cache. mon() returns a live canvas immediately: a placeholder
     silhouette is drawn until the PNG arrives, then the canvas updates in place
     (callers draw every frame, so art pops in without any code changes).
   FUSIONS: priority order —
     1. real community-made custom sprite from assets/fusions-custom/{body}_{head}.png
        (when present per assets/fusions-custom.json manifest, else optimistic try-load),
     2. Infinite-Fusion style composite — body sprite full-size, head sprite scaled
        ~0.75 anchored top-center, unified drop-shadow + outline pass. Cached per pair.
   PROCEDURAL pixel art is kept ONLY for: anime allies (cat "anime", with
     signature accessories), the 3 synthetic starter lines (cat "starter",
     digital/glitch aesthetic), trainers/NPCs, and the MissingNo fallback.
   Pure helpers (spriteKind, spriteFile, dexOf) are DOM-free and node-safe. */
window.G = window.G || {};
(function () {
  "use strict";
  var U = G.Util;

  var SPRITE_DIR = "assets/sprites/";
  var FUSION_CUSTOM_DIR = "assets/fusions-custom/";
  var FUSION_CUSTOM_MANIFEST = "assets/fusions-custom.json";
  var REAL_PX = 96;

  var imgCache = {};    // "dex|variant" -> {img, loaded, failed, cbs[]}
  var canvasCache = {}; // "dex|variant@size" -> canvas (live-updating)
  var procCache = {};   // procedural canvases
  var fuseCache = {};   // "fuse:a+b@size" -> {canvas, done}

  /* ---- custom fusion sprite manifest: { "body_head": true } ----
     Loaded once from assets/fusions-custom.json (works on the hosted build).
     fusionCustomLoaded flips true once the fetch settles OR definitively fails,
     so the composite path never waits on it. Missing file = composite fallback. */
  var fusionCustom = {};        // pairKey -> true
  var fusionCustomLoaded = false;
  (function loadCustomManifest() {
    try {
      if (typeof fetch === "undefined") return;
      fetch(FUSION_CUSTOM_MANIFEST).then(function (r) {
        return (r && r.ok) ? r.json() : [];
      }).then(function (arr) {
        (arr || []).forEach(function (k) { if (k) fusionCustom[String(k)] = true; });
        fusionCustomLoaded = true;
      }).catch(function () { fusionCustomLoaded = true; });
    } catch (e) { fusionCustomLoaded = true; }
  })();
  function customPairKey(bodyId, headId) { return bodyId + "_" + headId; }
  function customFusionURL(bodyId, headId) { return FUSION_CUSTOM_DIR + customPairKey(bodyId, headId) + ".png"; }

  /* ---------------- dom-safe canvas ---------------- */
  function safeCanvas(w, h) {
    try {
      if (typeof document === "undefined") return null;
      var c = document.createElement("canvas");
      c.width = w; c.height = h;
      var x = c.getContext("2d");
      if (!x) return null;
      x.imageSmoothingEnabled = false;
      return { c: c, x: x };
    } catch (e) { return null; }
  }

  function shade(hex, amt) {
    var n = parseInt(String(hex).replace("#", ""), 16);
    if (isNaN(n)) return "#888888";
    var r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
    if (amt >= 0) { r += (255 - r) * amt / 100; g += (255 - g) * amt / 100; b += (255 - b) * amt / 100; }
    else { r *= (1 + amt / 100); g *= (1 + amt / 100); b *= (1 + amt / 100); }
    r = Math.max(0, Math.min(255, Math.round(r)));
    g = Math.max(0, Math.min(255, Math.round(g)));
    b = Math.max(0, Math.min(255, Math.round(b)));
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  }

  /* ---------------- data helpers (DOM-free) ---------------- */
  function getSpecies(id) {
    var S = (G.Data && G.Data.SPECIES) || {};
    return S[id] || null;
  }
  function dexOf(id) {
    var sp = getSpecies(id);
    return (sp && sp.dex) || 0;
  }
  // "real" | "anime" | "starter" | "fusion" | "missingno"
  function spriteKind(id) {
    var sp = getSpecies(id);
    if (!sp) return "missingno";
    if (sp.cat === "anime" || sp.anime) return "anime";
    if (sp.cat === "starter") return "starter";
    if (sp.cat === "fusion" || (id && id.indexOf("fuse_") === 0)) return "fusion";
    if (sp.dex && sp.dex > 0) return "real";
    return "missingno";
  }
  function spriteFile(dex, opts) {
    opts = opts || {};
    return dex + (opts.back ? "-back" : "") + (opts.shiny ? "-shiny" : "") + ".png";
  }
  function animePrefix(id) {
    var m = /^(goku|luffy|gojo|naruto|ichigo|deku|tanjiro|saitama)/.exec(id || "");
    return m ? m[1] : null;
  }

  /* ---------------- real sprite loading ---------------- */
  function imgEntry(dex, variant) {
    var key = dex + "|" + variant;
    var e = imgCache[key];
    if (e) return e;
    e = { key: key, img: null, loaded: false, failed: false, cbs: [] };
    imgCache[key] = e;
    if (typeof Image !== "undefined") {
      try {
        var img = new Image();
        e.img = img;
        img.onload = function () { e.loaded = true; fire(e); };
        img.onerror = function () { e.failed = true; fire(e); };
        img.src = SPRITE_DIR + dex + variant + ".png";
      } catch (err) { e.failed = true; }
    } else { e.failed = true; }
    return e;
  }
  function fire(e) {
    var cbs = e.cbs; e.cbs = [];
    cbs.forEach(function (fn) { try { fn(); } catch (err) {} });
  }
  function onRealReady(key, fn) {
    var e = imgCache[key];
    if (!e || e.loaded || e.failed) { setTimeout(fn, 0); return; }
    e.cbs.push(fn);
  }

  function drawPlaceholder(x, size) {
    var s = size / REAL_PX;
    x.clearRect(0, 0, size, size);
    x.fillStyle = "#23232e";
    x.beginPath(); x.ellipse(48 * s, 60 * s, 26 * s, 28 * s, 0, 0, Math.PI * 2); x.fill();
    x.beginPath(); x.arc(48 * s, 30 * s, 16 * s, 0, Math.PI * 2); x.fill();
    x.fillStyle = "#8a8a9a";
    x.font = "bold " + Math.round(30 * s) + "px 'Courier New',monospace";
    x.textAlign = "center"; x.textBaseline = "middle";
    x.fillText("?", 48 * s, 52 * s);
  }

  // Live canvas for a real dex sprite. Never null in browser; null in node.
  function realCanvas(dex, opts, size) {
    var variant = (opts.back ? "-back" : "") + (opts.shiny ? "-shiny" : "");
    var key = dex + "|" + variant + "@" + size;
    if (canvasCache[key]) return canvasCache[key];
    var sc = safeCanvas(size, size);
    if (!sc) return null;
    drawPlaceholder(sc.x, size);
    canvasCache[key] = sc.c;
    var ie = imgEntry(dex, variant);
    var paint = function () {
      if (ie.loaded && ie.img) {
        sc.x.clearRect(0, 0, size, size);
        try { sc.x.drawImage(ie.img, 0, 0, size, size); } catch (err) {}
      }
    };
    if (ie.loaded || ie.failed) paint();
    else ie.cbs.push(paint);
    return sc.c;
  }

  // Promise: preload front/back/shiny variants for a list of dex numbers.
  function preload(dexList) {
    var jobs = [];
    (dexList || []).forEach(function (dex) {
      if (!(dex > 0)) return;
      ["", "-shiny", "-back", "-back-shiny"].forEach(function (v) {
        var ie = imgEntry(dex, v);
        jobs.push(new Promise(function (res) {
          if (ie.loaded || ie.failed) res();
          else ie.cbs.push(res);
        }));
      });
    });
    return Promise.all(jobs).then(function () { return true; });
  }

  /* ================= public: mon / inst ================= */
  function mon(id, opts) {
    opts = opts || {};
    var size = opts.size || REAL_PX;
    var kind = spriteKind(id);
    if (kind === "real") {
      return realCanvas(dexOf(id), opts, size);
    }
    if (kind === "fusion") {
      var fsp = getSpecies(id);
      var fo = fsp && fsp.sprite && fsp.sprite.fusionOf;
      if (fo && fo[0] && fo[1]) return fuse(fo[0], fo[1], opts);
    }
    return procedural(id, opts); // anime, starter, missingno, unknown
  }

  function inst(instObj, opts) {
    if (instObj && instObj.fusion && instObj.fusion.body && instObj.fusion.head) {
      return fuse(instObj.fusion.body, instObj.fusion.head, opts);
    }
    return mon(instObj ? instObj.sp : "missingno", opts);
  }

  /* ================= fusions: Infinite-Fusion style ================= */
  function silhouette(srcCanvas, color) {
    var sc = safeCanvas(REAL_PX, REAL_PX);
    if (!sc) return null;
    sc.x.clearRect(0, 0, REAL_PX, REAL_PX);
    sc.x.drawImage(srcCanvas, 0, 0);
    sc.x.globalCompositeOperation = "source-in";
    sc.x.fillStyle = color;
    sc.x.fillRect(0, 0, REAL_PX, REAL_PX);
    sc.x.globalCompositeOperation = "source-over";
    return sc.c;
  }

  // Source canvas for a fusion parent: real (async) or procedural (sync).
  function parentSource(id) {
    var kind = spriteKind(id);
    if (kind === "real") {
      var ie = imgEntry(dexOf(id), "");
      return { canvas: realCanvas(dexOf(id), {}, REAL_PX), ready: ie.loaded, key: ie.key, failed: ie.failed };
    }
    if (kind === "fusion") {
      var fsp = getSpecies(id);
      var fo = fsp && fsp.sprite && fsp.sprite.fusionOf;
      if (fo && fo[0] && fo[1]) {
        var sub = fuse(fo[0], fo[1], { size: REAL_PX });
        return { canvas: sub, ready: !!sub, key: null };
      }
    }
    return { canvas: procedural(id, { size: REAL_PX }), ready: true, key: null };
  }

  function fuse(bodyId, headId, opts) {
    opts = opts || {};
    var size = opts.size || REAL_PX;
    var key = "fuse:" + bodyId + "+" + headId + "@" + size;
    var rec = fuseCache[key];
    if (rec) return rec.canvas;
    var sc = safeCanvas(size, size);
    rec = { canvas: sc ? sc.c : null, ctx: sc ? sc.x : null, done: false };
    fuseCache[key] = rec;
    if (sc) drawPlaceholder(sc.x, size);
    attemptCustomFirst(rec, bodyId, headId, size);
    return rec.canvas;
  }

  /* Priority 1: community-made custom sprite. Priority 2: composite.
     - Manifest hit            -> try the PNG (onerror -> composite).
     - Manifest loaded, no hit  -> straight to composite (no 404 spam).
     - Manifest unknown yet (file://, fetch pending/failed) -> optimistic
       try-load; files that land after the manifest was generated still work. */
  function attemptCustomFirst(rec, bodyId, headId, size) {
    if (!rec.ctx || rec.done) return;
    var key = customPairKey(bodyId, headId);
    if (fusionCustom[key]) { tryCustomLoad(rec, bodyId, headId, size); return; }
    if (fusionCustomLoaded) { attemptFuse(rec, bodyId, headId, size); return; }
    tryCustomLoad(rec, bodyId, headId, size);
  }

  function tryCustomLoad(rec, bodyId, headId, size) {
    if (typeof Image === "undefined") { attemptFuse(rec, bodyId, headId, size); return; }
    var settled = false;
    var img;
    try { img = new Image(); } catch (e) { attemptFuse(rec, bodyId, headId, size); return; }
    img.onload = function () {
      if (settled || !rec.ctx || rec.done) return;
      settled = true;
      paintCustomImage(rec, img, size);
    };
    img.onerror = function () {
      if (settled || !rec.ctx || rec.done) return;
      settled = true;
      attemptFuse(rec, bodyId, headId, size);   // missing file -> composite fallback
    };
    try { img.src = customFusionURL(bodyId, headId); }
    catch (e) {
      if (!settled) { settled = true; attemptFuse(rec, bodyId, headId, size); }
    }
  }

  function paintCustomImage(rec, img, size) {
    rec.done = true;
    var x = rec.ctx;
    try {
      x.clearRect(0, 0, size, size);
      x.imageSmoothingEnabled = false;
      x.drawImage(img, 0, 0, size, size);
    } catch (err) { /* keep placeholder on draw failure */ }
  }

  // Warm the browser cache for every known custom pair (optional boot call).
  function preloadCustom() {
    var keys = Object.keys(fusionCustom);
    if (typeof Image === "undefined" || !keys.length) return Promise.resolve(false);
    var jobs = keys.map(function (k) {
      return new Promise(function (res) {
        var img = new Image();
        img.onload = function () { res(); };
        img.onerror = function () { res(); };
        try { img.src = FUSION_CUSTOM_DIR + k + ".png"; } catch (e) { res(); }
      });
    });
    return Promise.all(jobs).then(function () { return true; });
  }

  function attemptFuse(rec, bodyId, headId, size) {
    if (!rec.ctx || rec.done) return;
    var b = parentSource(bodyId), h = parentSource(headId);
    // A parent whose PNG failed to load falls back to procedural art.
    if (b.failed) b = { canvas: procedural(bodyId, { size: REAL_PX }), ready: true, key: null };
    if (h.failed) h = { canvas: procedural(headId, { size: REAL_PX }), ready: true, key: null };
    var bOk = b.ready && b.canvas, hOk = h.ready && h.canvas;
    if (!bOk || !hOk) {
      // retry when the PNGs arrive (onRealReady fires on load AND on error)
      if (b.key) onRealReady(b.key, function () { attemptFuse(rec, bodyId, headId, size); });
      if (h.key && h.key !== b.key) onRealReady(h.key, function () { attemptFuse(rec, bodyId, headId, size); });
      return;
    }
    rec.done = true;
    var S = REAL_PX;
    var tmp = safeCanvas(S, S);
    if (!tmp) return;
    var t = tmp.x;
    t.clearRect(0, 0, S, S);
    try {
      t.drawImage(b.canvas, 0, 0, S, S);          // BODY full-size
      t.drawImage(h.canvas, 12, 0, 72, 72);       // HEAD ~0.75, anchored top-center
    } catch (err) { return; }
    var x = rec.ctx;
    x.clearRect(0, 0, size, size);
    x.save();
    var k = size / S;
    x.scale(k, k);
    try {
      var sh = silhouette(tmp.c, "#000000");
      var ol = silhouette(tmp.c, "#14141f");
      x.globalAlpha = 0.35;
      if (sh) x.drawImage(sh, 2, 3);              // drop shadow
      x.globalAlpha = 1;
      if (ol) {
        for (var ox = -1; ox <= 1; ox++) for (var oy = -1; oy <= 1; oy++) {
          if (ox === 0 && oy === 0) continue;
          x.drawImage(ol, ox, oy);                // unified 1px outline
        }
      }
      x.drawImage(tmp.c, 0, 0);
    } catch (err) {}
    x.restore();
  }

  /* ================= procedural (anime / starters / trainers / MissingNo) ================= */
  function Painter(ctx, size) {
    this.ctx = ctx;
    this.s = size / 32;
  }
  Painter.prototype.px = function (x, y, w, h, color) {
    if (!color) return;
    this.ctx.fillStyle = color;
    this.ctx.fillRect(Math.round(x * this.s), Math.round(y * this.s), Math.ceil(w * this.s), Math.ceil(h * this.s));
  };
  Painter.prototype.eyes = function (x, y, w, rng) {
    var ew = Math.max(2, Math.floor(w / 3));
    this.px(x, y, ew, 3, "#ffffff"); this.px(x + w - ew, y, ew, 3, "#ffffff");
    var off = rng ? (rng() > 0.5 ? 1 : 0) : 1;
    this.px(x + off, y + 1, 1.6, 2, "#101018"); this.px(x + w - ew + off, y + 1, 1.6, 2, "#101018");
  };

  function getPal(sp) {
    var pal = (sp && sp.sprite && sp.sprite.pal) || null;
    if (!pal || !pal.length) pal = ["#8899aa", "#aabbcc", "#ddeeff"];
    while (pal.length < 3) pal.push(pal[pal.length - 1]);
    return pal.slice(0, 5);
  }
  function shinyPal(pal) {
    var out = pal.map(function (c) { return shade(c, 35); });
    if (out.length > 1) { var t = out[0]; out[0] = out[1]; out[1] = t; }
    return out;
  }

  var SHAPES = {
    blob: function (g, P) {
      var b = P.pal[0], d = P.pal[1], o = P.outline;
      g.px(10, 14, 12, 12, o); g.px(11, 15, 10, 10, b);
      g.px(13, 12, 6, 4, o); g.px(14, 13, 4, 2, b);
      g.eyes(12, 17, 8, P.rng);
      g.px(14, 22, 4, 1.6, o);
      g.px(11, 15, 3, 3, d);
    },
    biped: function (g, P) {
      var b = P.pal[0], d = P.pal[1], hp = P.headPal || b, o = P.outline;
      g.px(11, 4, 10, 9, o); g.px(12, 5, 8, 7, hp);
      g.eyes(12.5, 7, 7, P.rng);
      g.px(13, 13, 6, 9, o); g.px(14, 14, 4, 7, b);
      g.px(14, 14, 4, 3, d);
      g.px(8, 14, 3, 7, o); g.px(9, 15, 1.6, 5, b);
      g.px(21, 14, 3, 7, o); g.px(21.4, 15, 1.6, 5, b);
      g.px(13, 22, 2.6, 6, o); g.px(13.4, 23, 1.8, 4.6, d);
      g.px(16.4, 22, 2.6, 6, o); g.px(16.8, 23, 1.8, 4.6, d);
      g.px(22, 18, 5, 3, o); g.px(23, 18.6, 3.4, 1.8, d);
    },
    quad: function (g, P) {
      var b = P.pal[0], d = P.pal[1], hp = P.headPal || b, o = P.outline;
      g.px(6, 15, 16, 8, o); g.px(7, 16, 14, 6, b);
      g.px(8, 16, 6, 2, d);
      g.px(20, 8, 9, 9, o); g.px(21, 9, 7, 7, hp);
      g.eyes(22, 11, 5, P.rng);
      g.px(21, 8, 3, 3, o); g.px(21.6, 8.6, 1.8, 1.8, hp);
      g.px(7, 23, 3, 5, o); g.px(7.6, 24, 1.8, 3.6, d);
      g.px(12, 23, 3, 5, o); g.px(12.6, 24, 1.8, 3.6, d);
      g.px(17, 23, 3, 5, o); g.px(17.6, 24, 1.8, 3.6, d);
      g.px(2, 13, 5, 3, o); g.px(2.6, 13.6, 3.6, 1.8, d);
    },
    serpent: function (g, P) {
      var b = P.pal[0], d = P.pal[1], hp = P.headPal || b, o = P.outline;
      var segs = [[16, 24, 7], [13, 20, 6.4], [17, 16, 6], [14, 12, 5.6], [16, 8, 6.4]];
      for (var i = 0; i < segs.length; i++) {
        var s = segs[i];
        g.px(s[0] - s[2] / 2 - 1, s[1] - s[2] / 2 - 1, s[2] + 2, s[2] + 2, o);
        g.px(s[0] - s[2] / 2, s[1] - s[2] / 2, s[2], s[2], i === segs.length - 1 ? hp : b);
      }
      g.eyes(13.5, 6.5, 5, P.rng);
      g.px(15, 10.5, 2, 1.4, "#c02020");
      g.px(9, 3, 2, 3, o); g.px(20, 3, 2, 3, o);
      g.px(9.5, 3.5, 1, 2, d); g.px(20.5, 3.5, 1, 2, d);
    },
    winged: function (g, P) {
      var b = P.pal[0], d = P.pal[1], w = P.pal[2] || d, hp = P.headPal || b, o = P.outline;
      g.px(4, 6, 10, 14, o); g.px(5, 7, 8, 12, w);
      g.px(18, 6, 10, 14, o); g.px(19, 7, 8, 12, w);
      g.px(5, 7, 8, 3, d); g.px(19, 7, 8, 3, d);
      g.px(12, 6, 8, 7, o); g.px(13, 7, 6, 5, hp);
      g.eyes(13.5, 8, 5, P.rng);
      g.px(13, 13, 6, 9, o); g.px(14, 14, 4, 7, b);
      g.px(13, 22, 2.6, 6, o); g.px(16.4, 22, 2.6, 6, o);
      g.px(13.4, 23, 1.8, 4.6, d); g.px(16.8, 23, 1.8, 4.6, d);
      g.px(14, 26, 4, 3, o); g.px(14.6, 26.6, 2.8, 1.8, d);
    },
    bird: function (g, P) {
      var b = P.pal[0], d = P.pal[1], hp = P.headPal || b, o = P.outline;
      g.px(10, 10, 12, 12, o); g.px(11, 11, 10, 10, b);
      g.px(12, 12, 4, 4, d);
      g.px(11, 4, 10, 8, o); g.px(12, 5, 8, 6, hp);
      g.eyes(12.5, 6, 7, P.rng);
      g.px(14, 9, 4, 3, o); g.px(14.6, 9.6, 2.8, 1.8, "#f0a020");
      g.px(4, 12, 7, 8, o); g.px(5, 13, 5, 6, d);
      g.px(21, 12, 7, 8, o); g.px(22, 13, 5, 6, d);
      g.px(12, 22, 2, 5, o); g.px(18, 22, 2, 5, o);
      g.px(10, 20, 12, 4, o); g.px(11, 20.6, 10, 2.8, d);
    },
    fish: function (g, P) {
      var b = P.pal[0], d = P.pal[1], hp = P.headPal || b, o = P.outline;
      g.px(24, 11, 6, 10, o); g.px(25, 12.6, 4, 6.8, d);
      g.px(8, 10, 18, 12, o); g.px(9, 11, 16, 10, b);
      g.px(10, 12, 6, 3, d);
      g.px(8, 12, 6, 8, o); g.px(9, 13, 4, 6, hp);
      g.px(10, 14, 3, 4, "#ffffff"); g.px(10.8, 15, 1.6, 2.4, "#101018");
      g.px(13, 6, 6, 5, o); g.px(14, 7, 4, 3, d);
      g.px(14, 21, 5, 4, o); g.px(15, 21.6, 3, 2.8, d);
    },
    humanoid: function (g, P) {
      var b = P.pal[0], d = P.pal[1], hp = P.headPal || b, o = P.outline;
      var skin = "#f0c8a0";
      g.px(11, 3, 10, 9, o); g.px(12, 4, 8, 7, skin);
      g.px(10, 2, 12, 4, o); g.px(11, 3, 10, 2, hp);
      g.eyes(12.5, 6.5, 7, P.rng);
      g.px(12, 12, 8, 10, o); g.px(13, 13, 6, 8, b);
      g.px(13, 13, 6, 2.4, d);
      g.px(8, 13, 3, 8, o); g.px(9, 14, 1.8, 6, skin);
      g.px(21, 13, 3, 8, o); g.px(21.2, 14, 1.8, 6, skin);
      g.px(13, 22, 3, 7, o); g.px(13.6, 23, 1.8, 5.4, d);
      g.px(16, 22, 3, 7, o); g.px(16.6, 23, 1.8, 5.4, d);
    },
    insect: function (g, P) {
      var b = P.pal[0], d = P.pal[1], hp = P.headPal || b, o = P.outline;
      g.px(11, 18, 10, 8, o); g.px(12, 19, 8, 6, b);
      g.px(12, 19, 8, 1.6, d); g.px(12, 22, 8, 1.6, d);
      g.px(12, 12, 8, 7, o); g.px(13, 13, 6, 5, b);
      g.px(11, 5, 10, 8, o); g.px(12, 6, 8, 6, hp);
      g.px(12.5, 7.5, 7, 4, "#c02040");
      g.px(12, 2, 2, 4, o); g.px(18, 2, 2, 4, o);
      for (var i = 0; i < 3; i++) {
        g.px(6, 14 + i * 3, 6, 1.8, o); g.px(20, 14 + i * 3, 6, 1.8, o);
      }
      g.px(4, 8, 6, 10, o); g.px(5, 9, 4, 8, d);
      g.px(22, 8, 6, 10, o); g.px(23, 9, 4, 8, d);
    },
    ghostly: function (g, P) {
      var b = P.pal[0], d = P.pal[1], hp = P.headPal || b, o = P.outline;
      g.px(10, 6, 12, 14, o); g.px(11, 7, 10, 12, b);
      g.px(12, 8, 8, 6, hp);
      g.eyes(12.5, 10, 7, P.rng);
      g.px(14, 15, 4, 2.4, "#201028");
      for (var i = 0; i < 4; i++) {
        var w = 10 - i * 1.6;
        g.px(16 - w / 2 + (i % 2 ? 1.4 : -1.4), 20 + i * 2.6, w, 3, i % 2 ? b : d);
      }
      g.px(4, 12, 6, 3, o); g.px(5, 12.6, 4, 1.8, d);
      g.px(22, 12, 6, 3, o); g.px(23, 12.6, 4, 1.8, d);
    }
  };

  function drawMonInto(ctx, size, sp, opts) {
    opts = opts || {};
    var pal = getPal(sp);
    if (opts.shiny) pal = shinyPal(pal);
    var seed = (sp && sp.sprite && sp.sprite.seed) || U.hashStr((sp && sp.id) || "missingno");
    var rng = U.RNG(seed + (opts.back ? 999 : 0));
    var shape = (sp && sp.sprite && sp.sprite.shape) || "blob";
    if (!SHAPES[shape]) shape = "blob";
    var g = new Painter(ctx, size);
    var P = {
      pal: pal, headPal: opts.headPal || null, outline: shade(pal[0], -45),
      rng: rng, seed: seed
    };
    if (opts.back) {
      ctx.save();
      ctx.translate(size, 0);
      ctx.scale(-1, 1);
      SHAPES[shape](g, P);
      ctx.restore();
    } else {
      SHAPES[shape](g, P);
    }
    if (opts.shiny) {
      g.px(4, 4, 2, 2, "#ffffff"); g.px(26, 8, 2, 2, "#ffffff"); g.px(24, 24, 2, 2, "#fff8c0");
    }
  }

  /* ---------- anime allies: signature accessories ---------- */
  function drawAnimeAlly(ctx, size, sp, opts) {
    var g = new Painter(ctx, size);
    var pal = getPal(sp);
    var o = "#101018", skin = "#f2cf9f";
    var id = sp.id || "";
    var prefix = animePrefix(id) || "goku";

    // energy aura behind (higher forms)
    var aura = null;
    if (/goku-(ssb|ui)/.test(id)) aura = "rgba(90,160,255,0.35)";
    else if (/goku-ssg/.test(id)) aura = "rgba(255,90,90,0.35)";
    else if (/goku-ssj/.test(id)) aura = "rgba(255,215,60,0.30)";
    else if (/naruto-(kcm|sixpaths)/.test(id)) aura = "rgba(255,200,60,0.35)";
    else if (/deku-100/.test(id)) aura = "rgba(120,255,120,0.30)";
    else if (/luffy-g5/.test(id)) aura = "rgba(255,255,255,0.30)";
    if (aura) { g.ctx.fillStyle = aura; g.ctx.fillRect(4 * g.s, 0, 24 * g.s, 32 * g.s); }

    // cape behind (saitama, ichigo)
    if (prefix === "saitama") { g.px(7, 12, 4, 15, o); g.px(7.6, 13, 2.8, 13, "#f0f0f0"); }

    // legs
    var legC = prefix === "saitama" ? "#f5d742" : (prefix === "gojo" ? "#23232e" : "#2b2b33");
    g.px(13, 22, 3, 7, o); g.px(13.6, 23, 1.8, 5.4, legC);
    g.px(16, 22, 3, 7, o); g.px(16.6, 23, 1.8, 5.4, legC);
    // torso (gi / outfit)
    var giC = pal[0] || "#e2703a";
    if (prefix === "luffy") giC = "#c03030";
    if (prefix === "ichigo") giC = "#1c1c22";
    if (prefix === "gojo") giC = "#23232e";
    if (prefix === "deku") giC = "#2e7d4f";
    if (prefix === "tanjiro") giC = "#2e7d4f";
    if (prefix === "saitama") giC = "#f5d742";
    if (prefix === "naruto") giC = "#e2703a";
    g.px(12, 12, 8, 10, o); g.px(13, 13, 6, 8, giC);
    // tanjiro checkered haori
    if (prefix === "tanjiro") {
      g.px(13, 13, 2, 2, "#101018"); g.px(17, 15, 2, 2, "#101018"); g.px(13, 17, 2, 2, "#101018");
      if (/hinokami|hashira/.test(id)) { g.px(13, 13, 6, 2, "#e2703a"); g.px(13, 19, 6, 2, "#c03030"); }
    }
    // belt / sash
    var beltC = prefix === "goku" ? "#2b4fd8" : (prefix === "luffy-g5" ? "#7a2a9a" : "#101018");
    g.px(12, 18, 8, 2, o); g.px(13, 18.4, 6, 1.2, beltC);
    // arms (skin; saitama red gloves)
    var glove = prefix === "saitama" ? "#c03030" : skin;
    g.px(8, 13, 3, 8, o); g.px(9, 14, 1.8, 6, glove);
    g.px(21, 13, 3, 8, o); g.px(21.2, 14, 1.8, 6, glove);
    // head
    g.px(11, 3, 10, 9, o); g.px(12, 4, 8, 7, skin);

    /* ----- per-ally accessories ----- */
    if (prefix === "goku") {
      var hc = "#1c1c22";
      if (/ssj3|ssj2|ssj(?!-)/.test(id) || id === "goku-ssj") hc = "#ffd93a";
      if (/ssg/.test(id) && !/ssb/.test(id)) hc = "#e33e5a";
      if (/ssb/.test(id)) hc = "#4fa8ff";
      if (/ui/.test(id)) hc = "#dfe6f2";
      var tall = /ssj3/.test(id) ? 8 : 5;
      g.px(10, 4 - tall, 12, tall + 2, o);
      for (var i = 0; i < 6; i++) g.px(10 + i * 2, 2 - tall + (i % 2) * 2, 2.4, tall + 2, hc);
      g.px(11, 3, 10, 2, o);
      g.eyes(12.5, 6.5, 7, null);
    } else if (prefix === "luffy") {
      // straw hat
      g.px(8, 0, 16, 3, o); g.px(9, 1, 14, 1.6, "#d9b36a");
      g.px(11, -2, 10, 4, o); g.px(12, -1, 8, 2.6, "#d9b36a");
      g.px(11, 1.4, 10, 1.4, "#c03030");
      if (/g5/.test(id)) { // white cloudy hair
        g.px(9, 2, 14, 3, o); g.px(10, 3, 12, 1.6, "#ffffff");
        g.px(6, 10, 3, 6, "#ffffff"); g.px(23, 10, 3, 6, "#ffffff");
      } else {
        g.px(10, 3, 3, 3, o); g.px(19, 3, 3, 3, o); // black tufts
        g.px(10.6, 3.6, 1.8, 1.8, "#1c1c22"); g.px(19.6, 3.6, 1.8, 1.8, "#1c1c22");
      }
      g.eyes(12.5, 6.5, 7, null);
      g.px(13, 9.4, 2.4, 1, "#a02020"); // scar under eye
    } else if (prefix === "gojo") {
      g.px(10, 1, 12, 5, o);
      for (var j = 0; j < 6; j++) g.px(10 + j * 2, 0 + (j % 2), 2.4, 5, "#eef2f8"); // white spikes
      if (/honored/.test(id)) {
        g.eyes(12.5, 6.5, 7, null);
        g.px(12.5, 6.5, 7, 1.6, "#4fa8ff"); // bright blue eyes
      } else {
        g.px(11, 5.6, 10, 3, o); g.px(12, 6.2, 8, 1.8, "#14141c"); // blindfold
      }
      g.px(13, 11, 6, 2, o); g.px(14, 11.4, 4, 1.2, "#101018"); // high collar
    } else if (prefix === "naruto") {
      g.px(10, 1, 12, 5, o);
      for (var k = 0; k < 6; k++) g.px(10 + k * 2, 0 + (k % 2), 2.4, 5, /kcm|sixpaths/.test(id) ? "#ffd93a" : "#f5d742");
      g.px(10, 4, 12, 3, o); g.px(11, 4.6, 10, 1.8, "#2b4fd8"); // headband
      g.px(14, 4.6, 4, 1.8, "#b9c2cc"); // metal plate
      // whiskers
      for (var wI = 0; wI < 3; wI++) {
        g.px(12, 8 + wI * 1.4, 2.4, 0.8, "#a07050");
        g.px(17.6, 8 + wI * 1.4, 2.4, 0.8, "#a07050");
      }
      if (/sage/.test(id)) { g.px(12, 6, 2.6, 1.4, "#c03030"); g.px(17.4, 6, 2.6, 1.4, "#c03030"); }
      else g.eyes(12.5, 6.5, 7, null);
      if (/kcm|sixpaths/.test(id)) { // chakra cloak flames
        g.px(9, 12, 2, 10, "#ffd93a"); g.px(21, 12, 2, 10, "#ffd93a");
        if (/sixpaths/.test(id)) { g.px(14, 14, 1.6, 1.6, "#101018"); g.px(16.4, 15.4, 1.6, 1.6, "#101018"); g.px(14, 17, 1.6, 1.6, "#101018"); }
      }
    } else if (prefix === "ichigo") {
      g.px(10, 1, 12, 5, o);
      for (var mI = 0; mI < 6; mI++) g.px(10 + mI * 2, 0 + (mI % 2), 2.4, 5, "#e2703a"); // orange spikes
      g.eyes(12.5, 6.5, 7, null);
      if (/hos/.test(id)) { g.px(11, 4, 4, 6, "#f0f0f0"); g.px(11.6, 6, 2.8, 1.4, "#c03030"); } // hollow mask
      // big sword on back
      var blade = /bankai|hos/.test(id) ? "#1c1c22" : "#b9c2cc";
      g.px(24, 0, 3, 20, o); g.px(24.6, 1, 1.8, 18, blade);
      g.px(23, 19, 5, 2.4, o); g.px(23.6, 19.6, 3.8, 1.2, "#6b4423"); // hilt
    } else if (prefix === "deku") {
      g.px(10, 1, 12, 6, o); g.px(11, 2, 10, 4, "#2e7d4f"); // messy green hair
      g.px(11, 5, 2, 2, "#245f3c"); g.px(19, 5, 2, 2, "#245f3c");
      if (/cowling|100/.test(id)) { // full cowling mask: lightning lines
        g.px(11, 6, 10, 2.6, o);
        g.px(12, 6.6, 2, 1.4, "#a8e05f"); g.px(15, 6.6, 2, 1.4, "#a8e05f"); g.px(18, 6.6, 2, 1.4, "#a8e05f");
      } else {
        g.eyes(12.5, 6.5, 7, null);
      }
      // freckles
      g.px(12.6, 8.6, 1, 1, "#a07050"); g.px(14.4, 9.2, 1, 1, "#a07050");
      g.px(18.4, 8.6, 1, 1, "#a07050"); g.px(16.6, 9.2, 1, 1, "#a07050");
    } else if (prefix === "tanjiro") {
      g.px(10, 1, 12, 5, o); g.px(11, 2, 10, 3, "#7a2a2a"); // burgundy hair
      g.px(14.6, 4, 2.8, 2.4, "#a03030"); g.px(15.2, 4.6, 1.6, 1.2, "#7a1a1a"); // scar
      g.eyes(12.5, 6.5, 7, null);
      // hanafuda earrings
      g.px(9.4, 8, 2.4, 4, o); g.px(10, 8.6, 1.2, 2.8, "#c03030");
      g.px(20.6, 8, 2.4, 4, o); g.px(21.2, 8.6, 1.2, 2.8, "#c03030");
      g.px(10, 9.4, 1.2, 1.2, "#ffffff"); g.px(21.2, 9.4, 1.2, 1.2, "#ffffff");
    } else if (prefix === "saitama") {
      g.px(20, 6, 2.6, 2, "#ffffff"); // bald shine
      g.eyes(12.5, 6.5, 7, null);
      g.px(12.5, 9.6, 7, 1, "#101018"); // deadpan mouth
      if (/serious/.test(id)) { // motion lines
        g.px(4, 4, 1.4, 24, "#ffffff"); g.px(26.6, 4, 1.4, 24, "#ffffff");
      }
    } else {
      g.eyes(12.5, 6.5, 7, null);
    }

    if (opts.shiny) {
      g.px(4, 4, 2, 2, "#ffffff"); g.px(26, 8, 2, 2, "#ffffff");
    }
  }

  /* ---------- synthetic starters: digital/glitch aesthetic ---------- */
  function glitchPass(ctx, size, rng) {
    var s = size;
    for (var i = 0; i < 5; i++) {
      var y = Math.floor(rng() * Math.max(1, s - 8));
      var h = 2 + Math.floor(rng() * 6);
      var dx = Math.floor((rng() - 0.5) * 12);
      try {
        var strip = ctx.getImageData(0, y, s, h);
        ctx.clearRect(0, y, s, h);
        ctx.putImageData(strip, dx, y);
      } catch (e) {}
    }
    var cols = ["#00f0ff", "#ff00e0", "#ffffff"];
    for (var k = 0; k < 36; k++) {
      ctx.fillStyle = cols[Math.floor(rng() * 3)];
      ctx.fillRect(Math.floor(rng() * s), Math.floor(rng() * s), 2, 2);
    }
    ctx.fillStyle = "rgba(0,0,0,0.12)";
    for (var yy = 0; yy < s; yy += 4) ctx.fillRect(0, yy, s, 1);
  }

  function procedural(id, opts) {
    opts = opts || {};
    var size = opts.size || REAL_PX;
    var kind = spriteKind(id);
    var key = "proc:" + id + ":" + (opts.shiny ? 1 : 0) + ":" + (opts.back ? 1 : 0) + ":" + size;
    if (procCache[key]) return procCache[key];
    var sc = safeCanvas(size, size);
    if (!sc) return null;
    var sp = getSpecies(id) || missingNo();
    if (kind === "anime") {
      if (opts.back) {
        // back view: mirror horizontally
        sc.x.save();
        sc.x.translate(size, 0);
        sc.x.scale(-1, 1);
        drawAnimeAlly(sc.x, size, sp, opts);
        sc.x.restore();
      } else {
        drawAnimeAlly(sc.x, size, sp, opts);
      }
    } else {
      drawMonInto(sc.x, size, sp, opts);
      if (kind === "starter") {
        var seed = (sp.sprite && sp.sprite.seed) || U.hashStr(sp.id);
        glitchPass(sc.x, size, U.RNG(seed + 5));
      }
    }
    procCache[key] = sc.c;
    return sc.c;
  }

  /* ---------------- trainers (procedural, kept) ---------------- */
  var TRAINER_PALS = {
    hero:       { skin: "#f0c8a0", hair: "#c02020", top: "#2850c8", bot: "#203050", acc: "#f0f0f0" },
    rival:      { skin: "#f0c8a0", hair: "#7020a0", top: "#e07820", bot: "#303030", acc: "#ffffff" },
    prof:       { skin: "#e8b890", hair: "#c0c0c0", top: "#f0f0f0", bot: "#505050", acc: "#2050a0" },
    grunt:      { skin: "#d8a880", hair: "#202020", top: "#282038", bot: "#181018", acc: "#a020a0" },
    admin:      { skin: "#e8b890", hair: "#801020", top: "#601018", bot: "#280808", acc: "#d0d0d0" },
    leader:     { skin: "#f0c8a0", hair: "#202020", top: "#2080c0", bot: "#102040", acc: "#f0c020" },
    elite:      { skin: "#e8b890", hair: "#f0f0f0", top: "#181818", bot: "#181818", acc: "#c0a020" },
    champ:      { skin: "#f0c8a0", hair: "#e8a020", top: "#f0f0f0", bot: "#304080", acc: "#f0c020" },
    vex:        { skin: "#c8a080", hair: "#300840", top: "#38104c", bot: "#180824", acc: "#c020f0" },
    "umbra-boss": { skin: "#b89070", hair: "#101010", top: "#241430", bot: "#100a18", acc: "#ff2040" },
    nurse:      { skin: "#f0c8a0", hair: "#e06080", top: "#f0f0f0", bot: "#e08090", acc: "#ff6070" },
    clerk:      { skin: "#e8b890", hair: "#402810", top: "#20a060", bot: "#304050", acc: "#ffffff" },
    kid:        { skin: "#f0c8a0", hair: "#803010", top: "#e8c020", bot: "#4060c0", acc: "#ffffff" },
    elder:      { skin: "#d8a880", hair: "#e0e0e0", top: "#604030", bot: "#403020", acc: "#c0a060" },
    scientist:  { skin: "#e8b890", hair: "#302018", top: "#f0f0f0", bot: "#404040", acc: "#20c0c0" }
  };

  function drawTrainer(g, kind) {
    var P = TRAINER_PALS[kind] || TRAINER_PALS.grunt;
    var o = "#101018";
    var y0 = (kind === "kid") ? 8 : 2;
    g.px(11, y0 + 2, 10, 9, o); g.px(12, y0 + 3, 8, 7, P.skin);
    if (kind === "hero") {
      g.px(10, y0 + 0, 12, 4, o); g.px(11, y0 + 1, 10, 2, P.hair);
      g.px(19, y0 + 3, 4, 1.6, P.hair);
    } else if (kind === "nurse") {
      g.px(11, y0 + 0, 10, 3, o); g.px(12, y0 + 1, 8, 1.4, "#ffffff");
      g.px(15, y0 - 1, 3, 2, "#ff6070");
    } else if (kind === "vex" || kind === "umbra-boss") {
      g.px(11, y0 + 1, 10, 4, o); g.px(12, y0 + 2, 8, 2, P.acc);
    } else {
      g.px(10, y0 + 1, 12, 3, o); g.px(11, y0 + 2, 10, 1.6, P.hair);
    }
    g.px(13, y0 + 5, 2, 2, "#ffffff"); g.px(17, y0 + 5, 2, 2, "#ffffff");
    g.px(13.4, y0 + 5.6, 1.2, 1.2, "#101018"); g.px(17.4, y0 + 5.6, 1.2, 1.2, "#101018");
    var ty = y0 + 11;
    g.px(11, ty, 10, 10, o); g.px(12, ty + 1, 8, 8, P.top);
    if (kind === "prof" || kind === "scientist") { g.px(15, ty + 1, 2, 8, "#ffffff"); }
    if (kind === "champ" || kind === "elite") { g.px(9, ty + 1, 2, 12, P.acc); g.px(21, ty + 1, 2, 12, P.acc); }
    g.px(7, ty + 1, 3, 8, o); g.px(8, ty + 2, 1.8, 6, P.skin);
    g.px(22, ty + 1, 3, 8, o); g.px(22.2, ty + 2, 1.8, 6, P.skin);
    var ly = ty + 10;
    g.px(12, ly, 3.4, 8, o); g.px(12.6, ly + 1, 2.2, 6, P.bot);
    g.px(16.6, ly, 3.4, 8, o); g.px(17.2, ly + 1, 2.2, 6, P.bot);
  }

  function trainer(kind, opts) {
    opts = opts || {};
    var size = opts.size || 64;
    var key = "tr:" + kind + ":" + size;
    if (procCache[key]) return procCache[key];
    var sc = safeCanvas(size, size);
    if (!sc) return null;
    drawTrainer(new Painter(sc.x, size), kind || "grunt");
    procCache[key] = sc.c;
    return sc.c;
  }

  function missingNo() {
    return {
      id: "missingno", name: "MissingNo", dex: 0, cat: "glitch",
      types: ["Normal"],
      base: { hp: 33, atk: 136, def: 0, spa: 6, spd: 6, spe: 29 },
      abilities: ["Glitch"], catchRate: 45,
      levelMoves: [[1, "tackle"]],
      evo: [],
      sprite: { shape: "blob", seed: 0, pal: ["#ff00ff", "#00ffff", "#ffff00"] },
      flavor: "A glitch in reality. It should not exist.",
      fuseable: false, anime: false
    };
  }

  function clearCache() {
    imgCache = {}; canvasCache = {}; procCache = {}; fuseCache = {};
  }

  G.Sprites = {
    mon: mon, inst: inst, fuse: fuse,
    trainer: trainer, npc: trainer,
    missingNo: missingNo, clearCache: clearCache,
    preload: preload, preloadCustom: preloadCustom,
    customFusions: function () { return Object.keys(fusionCustom); },
    spriteKind: spriteKind, spriteFile: spriteFile, dexOf: dexOf,
    _parentSource: parentSource
  };
})();
