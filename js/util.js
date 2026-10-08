/* G.Util — shared helpers. DOM-free, node-safe. */
window.G = window.G || {};
(function () {
  "use strict";

  // Seeded RNG (mulberry32). Returns a function producing [0,1).
  function RNG(seed) {
    var s = (seed >>> 0) || 1;
    return function () {
      s |= 0; s = (s + 0x6D2B79F5) | 0;
      var t = Math.imul(s ^ (s >>> 15), 1 | s);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  // rand(max) -> [0,max); rand(min,max) -> [min,max)
  function rand(a, b) {
    if (b === undefined) { b = a; a = 0; }
    return a + Math.random() * (b - a);
  }

  // randi(max) -> int [0,max]; randi(min,max) -> int [min,max]
  function randi(a, b) {
    if (b === undefined) { b = a; a = 0; }
    return Math.floor(a + Math.random() * (b - a + 1));
  }

  function choice(arr, rng) {
    if (!arr || !arr.length) return undefined;
    var r = rng ? rng() : Math.random();
    return arr[Math.floor(r * arr.length) % arr.length];
  }

  function clamp(v, lo, hi) {
    return v < lo ? lo : (v > hi ? hi : v);
  }

  function lerp(a, b, t) { return a + (b - a) * t; }

  // Minimal DOM helpers (only used where DOM exists).
  function $(sel, root) {
    try { return (root || document).querySelector(sel); } catch (e) { return null; }
  }
  function el(tag, cls, text) {
    var d = document.createElement(tag || "div");
    if (cls) d.className = cls;
    if (text !== undefined && text !== null) d.textContent = text;
    return d;
  }

  function deepClone(o) {
    if (o === null || typeof o !== "object") return o;
    if (Array.isArray(o)) return o.map(deepClone);
    var out = {};
    for (var k in o) {
      if (Object.prototype.hasOwnProperty.call(o, k)) out[k] = deepClone(o[k]);
    }
    return out;
  }

  function titleCase(s) {
    if (!s) return "";
    return String(s).replace(/[-_]+/g, " ").replace(/\b\w/g, function (c) { return c.toUpperCase(); });
  }

  function pad(n, w) {
    var s = String(n);
    while (s.length < (w || 2)) s = "0" + s;
    return s;
  }

  function fmtTime(sec) {
    sec = Math.floor(sec || 0);
    var h = Math.floor(sec / 3600), m = Math.floor((sec % 3600) / 60), s = sec % 60;
    return pad(h) + ":" + pad(m) + ":" + pad(s);
  }

  // Simple string hash -> uint32 (for seeding sprites/cries from ids).
  function hashStr(s) {
    var h = 2166136261;
    s = String(s);
    for (var i = 0; i < s.length; i++) {
      h ^= s.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return h >>> 0;
  }

  G.Util = {
    RNG: RNG, rand: rand, randi: randi, choice: choice, clamp: clamp, lerp: lerp,
    $: $, el: el, deepClone: deepClone, titleCase: titleCase, pad: pad,
    fmtTime: fmtTime, hashStr: hashStr
  };
})();
