/* G.Engine — canvas renderer, input (keyboard + touch), fixed-timestep loop,
   scene stack with fades, and UI widgets (dialog, menus, toasts, hp bars).
   Canvas is 480x320, CSS-scaled with pixelated rendering. */
window.G = window.G || {};
(function () {
  "use strict";
  var U = G.Util;

  var W = 480, H = 320, TILE = 16, STEP = 1 / 60;

  var canvas = null, ctx = null;
  var scenes = [];
  var held = {}, pressedEdge = {};
  var lastTap = null; // {x,y} consumed by scenes
  var toasts = [];
  var fade = null; // {t,dur,phase:"out"|"in",next}
  var acc = 0, lastT = 0, rafId = 0;
  var textSpeed = 2; // 1 slow, 2 normal, 3 fast (mirrors save options)

  var TYPE_COLORS = {
    Normal: "#A8A878", Fire: "#F08030", Water: "#6890F0", Electric: "#F8D030",
    Grass: "#78C850", Ice: "#98D8D8", Fighting: "#C03028", Poison: "#A040A0",
    Ground: "#E0C068", Flying: "#A890F0", Psychic: "#F85888", Bug: "#A8B820",
    Rock: "#B8A038", Ghost: "#705898", Dragon: "#7038F8", Dark: "#705848",
    Steel: "#B8B8D0", Fairy: "#EE99AC"
  };

  function typeColor(t) { return TYPE_COLORS[t] || "#A8A878"; }

  /* ---------------- input ---------------- */
  var KEYMAP = {
    ArrowUp: "up", KeyW: "up", ArrowDown: "down", KeyS: "down",
    ArrowLeft: "left", KeyA: "left", ArrowRight: "right", KeyD: "right",
    KeyZ: "a", KeyX: "b", Enter: "start", ShiftLeft: "select", ShiftRight: "select",
    Space: "a"
  };

  function press(name) {
    if (!held[name]) pressedEdge[name] = true;
    held[name] = true;
  }
  function release(name) { held[name] = false; }
  function pressed(name) { return !!pressedEdge[name]; }
  function isHeld(name) { return !!held[name]; }
  function clearEdges() { pressedEdge = {}; }

  function onKeyDown(e) {
    var name = KEYMAP[e.code];
    if (!name) return;
    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Space"].indexOf(e.code) >= 0) e.preventDefault();
    if (e.repeat) return;
    press(name);
    try { if (G.Audio) G.Audio.init(); } catch (err) {}
  }
  function onKeyUp(e) {
    var name = KEYMAP[e.code];
    if (name) release(name);
  }

  function canvasPos(ev) {
    var r = canvas.getBoundingClientRect();
    var cx = (ev.clientX - r.left) * (W / r.width);
    var cy = (ev.clientY - r.top) * (H / r.height);
    return { x: U.clamp(cx, 0, W), y: U.clamp(cy, 0, H) };
  }
  function onCanvasTap(ev) {
    try { if (G.Audio) G.Audio.init(); } catch (err) {}
    if (ev.cancelable) ev.preventDefault();
    var p = canvasPos(ev.touches && ev.touches[0] ? ev.touches[0] : ev);
    lastTap = p;
  }
  function consumeTap() {
    var t = lastTap;
    lastTap = null;
    return t;
  }

  function bindTouchButton(elm, name) {
    if (!elm) return;
    var start = function (e) {
      if (e.cancelable) e.preventDefault();
      try { if (G.Audio) G.Audio.init(); } catch (err) {}
      press(name);
    };
    var end = function (e) { if (e.cancelable) e.preventDefault(); release(name); };
    elm.addEventListener("touchstart", start, { passive: false });
    elm.addEventListener("touchend", end, { passive: false });
    elm.addEventListener("touchcancel", end, { passive: false });
    elm.addEventListener("mousedown", start);
    elm.addEventListener("mouseup", end);
    elm.addEventListener("mouseleave", function () { release(name); });
  }

  function buildTouchOverlay() {
    var root = U.$("#touch");
    if (!root) return;
    root.innerHTML = "";
    var dpad = U.el("div", "dpad");
    var mk = function (cls, name, label) {
      var b = U.el("div", "tbtn " + cls, label);
      b.dataset.name = name;
      bindTouchButton(b, name);
      return b;
    };
    dpad.appendChild(mk("tup", "up", "▲"));
    dpad.appendChild(mk("tleft", "left", "◀"));
    dpad.appendChild(mk("tright", "right", "▶"));
    dpad.appendChild(mk("tdown", "down", "▼"));
    var ab = U.el("div", "abtns");
    var bb = mk("bbtn", "b", "B");
    var ab2 = mk("abtn", "a", "A");
    ab.appendChild(bb); ab.appendChild(ab2);
    var sys = U.el("div", "sysbtns");
    sys.appendChild(mk("selectbtn", "select", "SELECT"));
    sys.appendChild(mk("startbtn", "start", "START"));
    root.appendChild(dpad); root.appendChild(ab); root.appendChild(sys);
  }

  function setTouchVisible(v) {
    var root = U.$("#touch");
    if (root) root.classList.toggle("hidden", !v);
  }

  /* ---------------- scenes ---------------- */
  function pushScene(s) {
    s.engine = Engine;
    scenes.push(s);
    if (s.enter) { try { s.enter(); } catch (e) {} }
  }
  function popScene() {
    var s = scenes.pop();
    if (s && s.exit) { try { s.exit(); } catch (e) {} }
    return s;
  }
  function replaceScene(s) { popScene(); pushScene(s); }
  function current() { return scenes.length ? scenes[scenes.length - 1] : null; }
  function clearTo(s) { while (scenes.length) popScene(); if (s) pushScene(s); }

  function fadeTo(scene, ms) {
    fade = { t: 0, dur: (ms || 350) / 1000, phase: "out", next: scene };
  }

  /* ---------------- loop ---------------- */
  function frame(t) {
    rafId = requestAnimationFrame(frame);
    if (!lastT) lastT = t;
    var dt = Math.min(0.25, (t - lastT) / 1000);
    lastT = t;
    acc += dt;
    var n = 0;
    while (acc >= STEP && n < 5) {
      update(STEP);
      acc -= STEP; n++;
    }
    render();
    clearEdges();
  }

  function update(dt) {
    // playtime + toasts
    try {
      if (G.Save && G.Save.data) G.Save.data.playtime = (G.Save.data.playtime || 0) + dt;
    } catch (e) {}
    var nowMs = Date.now();
    for (var i = toasts.length - 1; i >= 0; i--) {
      if (nowMs > toasts[i].until) toasts.splice(i, 1);
    }
    if (fade) {
      fade.t += dt;
      if (fade.t >= fade.dur) {
        if (fade.phase === "out") {
          clearTo(fade.next);
          fade.phase = "in"; fade.t = 0;
        } else { fade = null; }
      }
    } else {
      var s = current();
      if (s && s.update) { try { s.update(dt); } catch (e) {} }
    }
    // AI-Sync anomaly director ticks with playtime (only when a save is active)
    try {
      if (G.AI && G.Save && G.Save.data && G.Save.data.started) G.AI.anomalyTick(dt);
    } catch (e) {}
  }

  function render() {
    ctx.imageSmoothingEnabled = false;
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, W, H);
    var s = current();
    if (s && s.draw) { try { s.draw(ctx); } catch (e) {} }
    drawToasts(ctx);
    if (fade) {
      var a = fade.phase === "out" ? fade.t / fade.dur : 1 - fade.t / fade.dur;
      ctx.fillStyle = "rgba(0,0,0," + U.clamp(a, 0, 1).toFixed(3) + ")";
      ctx.fillRect(0, 0, W, H);
    }
  }

  function drawToasts(c) {
    var nowMs = Date.now();
    var y = 10;
    toasts.forEach(function (t) {
      var lines = wrap(c, t.text, W - 40, 8);
      var h = lines.length * 11 + 10;
      var w = Math.min(W - 20, 420);
      drawPanel(c, (W - w) / 2, y, w, h);
      c.fillStyle = "#ffe95a";
      c.font = "bold 8px 'Courier New',monospace";
      c.textAlign = "center"; c.textBaseline = "top";
      lines.forEach(function (ln, i) { c.fillText(ln, W / 2, y + 6 + i * 11); });
      y += h + 4;
    });
    void nowMs;
  }

  function toast(text, ms) {
    toasts.push({ text: text, until: Date.now() + (ms || 2500) });
    if (toasts.length > 3) toasts.shift();
  }

  /* ---------------- drawing helpers ---------------- */
  function drawPanel(c, x, y, w, h, opts) {
    opts = opts || {};
    c.fillStyle = opts.bg || "#f8f8f0";
    c.fillRect(x, y, w, h);
    c.fillStyle = "#202028";
    c.fillRect(x, y, w, 2); c.fillRect(x, y + h - 2, w, 2);
    c.fillRect(x, y, 2, h); c.fillRect(x + w - 2, y, 2, h);
    c.fillStyle = opts.border2 || "#808088";
    c.fillRect(x + 3, y + 3, w - 6, 1); c.fillRect(x + 3, y + h - 4, w - 6, 1);
    c.fillRect(x + 3, y + 3, 1, h - 6); c.fillRect(x + w - 4, y + 3, 1, h - 6);
  }

  function text(c, str, x, y, opts) {
    opts = opts || {};
    var size = opts.size || 8;
    c.font = (opts.bold ? "bold " : "") + size + "px 'Courier New',monospace";
    c.textAlign = opts.align || "left";
    c.textBaseline = opts.baseline || "top";
    if (opts.shadow !== false) {
      c.fillStyle = opts.shadowColor || "rgba(0,0,0,0.35)";
      c.fillText(str, x + 1, y + 1);
    }
    c.fillStyle = opts.color || "#202028";
    c.fillText(str, x, y);
  }

  function wrap(c, str, maxW, size) {
    c.font = (size || 8) + "px 'Courier New',monospace";
    var words = String(str).split(" ");
    var lines = [], line = "";
    words.forEach(function (wd) {
      var test = line ? line + " " + wd : wd;
      if (c.measureText(test).width > maxW && line) { lines.push(line); line = wd; }
      else line = test;
    });
    if (line) lines.push(line);
    return lines.length ? lines : [""];
  }

  function hpBar(c, x, y, w, frac) {
    frac = U.clamp(frac, 0, 1);
    var h = 6;
    c.fillStyle = "#202028"; c.fillRect(x - 1, y - 1, w + 2, h + 2);
    c.fillStyle = "#585858"; c.fillRect(x, y, w, h);
    var col = frac > 0.5 ? "#58d858" : (frac > 0.2 ? "#f0c020" : "#f03838");
    c.fillStyle = col;
    c.fillRect(x, y, Math.round(w * frac), h);
  }

  function drawSprite(c, img, x, y, w, h, flip) {
    if (!img) return;
    c.save();
    if (flip) { c.translate(x + w, y); c.scale(-1, 1); c.drawImage(img, 0, 0, w, h); }
    else c.drawImage(img, x, y, w, h);
    c.restore();
  }

  /* ---------------- widgets ---------------- */
  // dialog(items, cb, opts): items = [{name,text}] or ["text"] or "text"
  function dialog(items, cb, opts) {
    if (typeof items === "string") items = [{ name: "", text: items }];
    if (Array.isArray(items) && items.length && typeof items[0] === "string") {
      items = items.map(function (t) { return { name: "", text: t }; });
    }
    pushScene(new DialogScene(items || [], cb, opts || {}));
  }
  function textBox(t, cb) { dialog([{ name: "", text: t }], cb, { instant: true }); }

  function DialogScene(items, cb, opts) {
    this.items = items; this.cb = cb; this.opts = opts;
    this.idx = 0; this.chars = 0; this.done = false;
  }
  DialogScene.prototype.update = function (dt) {
    var item = this.items[this.idx];
    if (!item) { this.finish(); return; }
    var speed = this.opts.instant ? 9999 : [0, 25, 55, 110][textSpeed] || 55;
    if (this.chars < item.text.length) {
      this.chars = Math.min(item.text.length, this.chars + speed * dt);
      if (pressed("a") || pressed("b")) { this.chars = item.text.length; clearTapOnly(); }
    } else if (pressed("a") || consumeTap()) {
      try { if (G.Audio) G.Audio.sfx("select"); } catch (e) {}
      this.idx++; this.chars = 0;
      if (this.idx >= this.items.length) this.finish();
    } else { consumeTap(); }
  };
  function clearTapOnly() { lastTap = null; }
  DialogScene.prototype.finish = function () {
    if (this.done) return;
    this.done = true;
    popScene();
    if (this.cb) { try { this.cb(); } catch (e) {} }
  };
  DialogScene.prototype.draw = function (c) {
    var item = this.items[Math.min(this.idx, this.items.length - 1)] || { name: "", text: "" };
    var bx = 8, bw = W - 16, bh = 84, by = H - bh - 8;
    drawPanel(c, bx, by, bw, bh);
    var shown = item.text.slice(0, Math.floor(this.chars));
    var tx = bx + 10, ty = by + 8;
    if (item.name) {
      text(c, item.name + ":", tx, ty, { bold: true, color: "#2850c8", size: 9 });
      ty += 14;
    }
    var lines = wrap(c, shown, bw - 20, 8);
    lines.slice(0, 4).forEach(function (ln, i) { text(c, ln, tx, ty + i * 12, { size: 8 }); });
    if (this.chars >= item.text.length) {
      text(c, "▼", bx + bw - 16, by + bh - 14, { size: 8, color: "#c02020" });
    }
  };

  // menuList(items, opts, cb): item = string | {label,desc,disabled,value}
  function menuList(items, opts, cb) {
    pushScene(new MenuScene(items, opts || {}, cb));
  }
  function yesNo(q, cb) {
    menuList([{ label: "Yes" }, { label: "No" }], { title: q }, function (i) {
      cb(i === 0);
    });
  }
  function choiceBox(q, options, cb) {
    menuList(options.map(function (o) { return { label: o }; }), { title: q }, cb);
  }

  function MenuScene(items, opts, cb) {
    this.items = (items || []).map(function (it) {
      return typeof it === "string" ? { label: it } : it;
    });
    this.opts = opts; this.cb = cb;
    this.cursor = 0;
    for (var i = 0; i < this.items.length; i++) {
      if (!this.items[i].disabled) { this.cursor = i; break; }
    }
  }
  MenuScene.prototype.layout = function () {
    var o = this.opts;
    var w = o.w || 220, rowH = o.rowH || 20;
    var titleH = o.title ? 26 : 0;
    var maxRows = o.maxRows || 10;
    var vis = Math.min(this.items.length, maxRows);
    if (o.h) vis = Math.max(1, Math.floor((o.h - titleH - 14) / rowH));
    var h = o.h || (titleH + vis * rowH + 14);
    var x = o.x !== undefined ? o.x : W - w - 12;
    var y = o.y !== undefined ? o.y : 12;
    var start = Math.max(0, Math.min(this.cursor - 4, this.items.length - vis));
    return { x: x, y: y, w: w, h: h, rowH: rowH, titleH: titleH, start: start, vis: vis };
  };
  MenuScene.prototype.move = function (d) {
    var n = this.items.length;
    if (!n) return;
    for (var k = 0; k < n; k++) {
      this.cursor = (this.cursor + d + n) % n;
      if (!this.items[this.cursor].disabled) break;
    }
    try { if (G.Audio) G.Audio.sfx("select"); } catch (e) {}
  };
  MenuScene.prototype.choose = function (i) {
    var it = this.items[i];
    if (!it || it.disabled) return;
    try { if (G.Audio) G.Audio.sfx("select"); } catch (e) {}
    var cb = this.cb;
    popScene();
    if (cb) { try { cb(i, it); } catch (e) {} }
  };
  MenuScene.prototype.cancel = function () {
    var cb = this.cb;
    try { if (G.Audio) G.Audio.sfx("bump"); } catch (e) {}
    popScene();
    if (cb) { try { cb(-1, null); } catch (e) {} }
  };
  MenuScene.prototype.update = function () {
    if (pressed("up")) this.move(-1);
    else if (pressed("down")) this.move(1);
    else if (pressed("a")) this.choose(this.cursor);
    else if (pressed("b")) {
      if (this.opts.noCancel) return;
      this.cancel();
    }
    var t = consumeTap();
    if (t) {
      var L = this.layout();
      var relY = t.y - (L.y + 7 + L.titleH);
      var i = L.start + Math.floor(relY / L.rowH);
      if (t.x >= L.x && t.x <= L.x + L.w && i >= 0 && i < this.items.length) {
        if (i === this.cursor) this.choose(i);
        else {
          if (!this.items[i].disabled) { this.cursor = i; }
          else this.choose(i); // choose() guards disabled
        }
      } else if (this.opts.tapOutsideCancel !== false) {
        this.cancel();
      }
    }
  };
  MenuScene.prototype.draw = function (c) {
    var L = this.layout();
    drawPanel(c, L.x, L.y, L.w, L.h);
    var y = L.y + 7;
    if (this.opts.title) {
      var tl = wrap(c, this.opts.title, L.w - 20, 8);
      tl.slice(0, 2).forEach(function (ln, i) { text(c, ln, L.x + 10, y + i * 11, { bold: true, size: 8 }); });
      y += L.titleH;
    }
    for (var r = 0; r < L.vis; r++) {
      var i = L.start + r;
      if (i >= this.items.length) break;
      var it = this.items[i];
      var iy = y + r * L.rowH;
      if (i === this.cursor) text(c, "▶", L.x + 8, iy + 3, { color: "#c02020", size: 9, bold: true });
      text(c, it.label, L.x + 24, iy + 3, {
        size: 9, color: it.disabled ? "#909090" : "#202028",
        bold: i === this.cursor
      });
      if (it.desc) text(c, it.desc, L.x + 24, iy + 13, { size: 7, color: "#606060" });
    }
    if (L.start > 0) text(c, "▲", L.x + L.w - 14, y + 2, { size: 8, color: "#c02020" });
    if (L.start + L.vis < this.items.length) text(c, "▼", L.x + L.w - 14, y + L.vis * L.rowH - 10, { size: 8, color: "#c02020" });
  };

  // Naming screen: on-screen keyboard, dpad/tap. cb(name)
  function namingScreen(def, maxLen, cb) {
    pushScene(new NamingScene(def || "", maxLen || 10, cb));
  }
  var NAME_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!?- ";
  function NamingScene(def, maxLen, cb) {
    this.name = (def || "").slice(0, maxLen);
    this.maxLen = maxLen; this.cb = cb;
    this.ci = 0;
    this.inputEl = null;
  }
  NamingScene.prototype.enter = function () {
    // On touch devices, use native keyboard via a real input field
    if (window.matchMedia && window.matchMedia("(pointer: coarse)").matches) {
      var input = document.createElement("input");
      input.type = "text";
      input.maxLength = this.maxLen;
      input.value = this.name;
      input.placeholder = "Enter name";
      input.autocapitalize = "words";
      input.autocorrect = "off";
      // Position over the name display area; canvas may be scaled so use viewport units
      input.style.cssText = [
        "position:fixed", "z-index:50",
        "left:50%", "top:calc(env(safe-area-inset-top) + 52px)",
        "transform:translateX(-50%)",
        "width:min(260px,70vw)", "height:38px",
        "font-family:'Courier New',monospace", "font-size:18px", "font-weight:bold",
        "text-align:center", "color:#fff",
        "background:#181822", "border:2px solid #7fff7f", "border-radius:8px",
        "outline:none", "-webkit-user-select:text", "user-select:text"
      ].join(";");
      var self = this;
      input.addEventListener("input", function () { self.name = input.value.slice(0, self.maxLen); });
      document.body.appendChild(input);
      this.inputEl = input;
      // Focus after a tick so the keyboard opens
      setTimeout(function () { try { input.focus(); } catch (e) {} }, 300);
    }
  };
  NamingScene.prototype.exit = function () {
    if (this.inputEl && this.inputEl.parentNode) {
      this.inputEl.parentNode.removeChild(this.inputEl);
      this.inputEl = null;
    }
  };
  NamingScene.prototype.update = function () {
    var isTouch = window.matchMedia && window.matchMedia("(pointer: coarse)").matches;
    // Sync name from native input if present
    if (this.inputEl) this.name = this.inputEl.value.slice(0, this.maxLen);
    if (!isTouch) {
      var cols = 10;
      var n = NAME_CHARS.length + 2; // + BACK + DONE
      if (pressed("left")) this.ci = (this.ci - 1 + n) % n;
      else if (pressed("right")) this.ci = (this.ci + 1) % n;
      else if (pressed("up")) this.ci = (this.ci - cols + n) % n;
      else if (pressed("down")) this.ci = (this.ci + cols) % n;
      else if (pressed("a")) this.pick(this.ci);
      else if (pressed("b")) {
        if (this.name.length) {
          this.name = this.name.slice(0, -1);
          if (this.inputEl) this.inputEl.value = this.name;
        }
        try { if (G.Audio) G.Audio.sfx("bump"); } catch (e) {}
      }
    }
    var t = consumeTap();
    if (t) {
      var hit = this.hitTest(t.x, t.y);
      if (hit >= 0) this.pick(hit);
    }
  };
  NamingScene.prototype.hitTest = function (x, y) {
    // Big DONE button first
    if (x >= W/2 - 80 && x <= W/2 + 80 && y >= H - 52 && y <= H - 16) return 999;
    var cols = 10, cw = 40, chh = 26, ox = (W - cols * cw) / 2, oy = 120;
    var n = NAME_CHARS.length + 2;
    for (var i = 0; i < n; i++) {
      var cx = ox + (i % cols) * cw, cy = oy + Math.floor(i / cols) * chh;
      if (x >= cx && x <= cx + cw && y >= cy && y <= cy + chh) return i;
    }
    return -1;
  };
  NamingScene.prototype.pick = function (i) {
    var n = NAME_CHARS.length;
    try { if (G.Audio) G.Audio.sfx("select"); } catch (e) {}
    if (i === 999) { i = n + 1; } // big DONE button = OK
    if (i < n) {
      if (this.name.length < this.maxLen) this.name += NAME_CHARS[i];
    } else if (i === n) {
      this.name = this.name.slice(0, -1);
    } else {
      var cb = this.cb, nm = this.name || "RIFT";
      popScene();
      if (cb) { try { cb(nm); } catch (e) {} }
    }
  };
  NamingScene.prototype.draw = function (c) {
    var isTouch = window.matchMedia && window.matchMedia("(pointer: coarse)").matches;
    c.fillStyle = "#181822"; c.fillRect(0, 0, W, H);
    text(c, "Enter name:", W / 2, 30, { align: "center", color: "#fff", size: 10, bold: true });
    if (isTouch) {
      // Native keyboard handles input; just show the name and DONE
      drawPanel(c, W / 2 - 130, 52, 260, 34);
      text(c, this.name + "_", W / 2, 60, { align: "center", size: 12, bold: true });
      text(c, "Type using your keyboard, then tap DONE", W / 2, 100,
           { align: "center", color: "#888", size: 8 });
    } else {
      drawPanel(c, W / 2 - 130, 52, 260, 34);
      text(c, this.name + "_", W / 2, 60, { align: "center", size: 12, bold: true });
      var cols = 10, cw = 40, chh = 26, ox = (W - cols * cw) / 2, oy = 120;
      var nc = NAME_CHARS.length, n = nc + 2;
      for (var i = 0; i < n; i++) {
        var cx = ox + (i % cols) * cw, cy = oy + Math.floor(i / cols) * chh;
        var label = i < nc ? NAME_CHARS[i] : (i === nc ? "⌫" : "OK");
        if (i === this.ci) { c.fillStyle = "#c02020"; c.fillRect(cx + 2, cy + 2, cw - 4, chh - 4); }
        c.fillStyle = i === this.ci ? "#fff" : "#c8c8d0";
        c.font = "bold 12px 'Courier New',monospace";
        c.textAlign = "center"; c.textBaseline = "top";
        c.fillText(label, cx + cw / 2, cy + 6);
      }
    }
    // Big DONE button
    var doneY = H - 52;
    c.fillStyle = "#2a6e2a"; c.fillRect(W/2 - 80, doneY, 160, 36);
    c.strokeStyle = "#7fff7f"; c.lineWidth = 2; c.strokeRect(W/2 - 80, doneY, 160, 36);
    text(c, "DONE ✓", W / 2, doneY + 10, { align: "center", color: "#fff", size: 14, bold: true });
    if (!isTouch) text(c, "A: pick   B: delete", W / 2, H - 60, { align: "center", color: "#888", size: 8 });
  };

  /* ---------------- boot ---------------- */
  function resize() {
    if (!canvas) return;
    // In portrait on touch devices, CSS handles sizing (width:100%, aspect-ratio).
    // Skip manual sizing so we don't fight the stylesheet.
    var isPortraitTouch = window.matchMedia &&
      window.matchMedia("(orientation: portrait) and (pointer: coarse)").matches;
    if (isPortraitTouch) {
      canvas.style.width = "";
      canvas.style.height = "";
      return;
    }
    var vw = window.innerWidth, vh = window.innerHeight;
    var s = Math.min(vw / W, vh / H);
    // On desktop allow upscale beyond 2x; on small screens fit exactly.
    canvas.style.width = Math.floor(W * s) + "px";
    canvas.style.height = Math.floor(H * s) + "px";
  }

  function init(canvasId) {
    canvas = document.getElementById(canvasId || "game");
    if (!canvas) return false;
    canvas.width = W; canvas.height = H;
    ctx = canvas.getContext("2d");
    ctx.imageSmoothingEnabled = false;
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    canvas.addEventListener("touchstart", onCanvasTap, { passive: false });
    canvas.addEventListener("mousedown", onCanvasTap);
    window.addEventListener("resize", resize);
    window.addEventListener("orientationchange", function () { setTimeout(resize, 100); });
    // First-gesture audio unlock
    var unlock = function () { try { if (G.Audio) G.Audio.init(); } catch (e) {} };
    window.addEventListener("pointerdown", unlock, { once: true });
    window.addEventListener("keydown", unlock, { once: true });
    buildTouchOverlay();
    resize();
    lastT = 0;
    rafId = requestAnimationFrame(frame);
    return true;
  }

  function setTextSpeed(v) { textSpeed = U.clamp(v || 2, 1, 3); }

  var Engine = {
    W: W, H: H, TILE: TILE,
    init: init, resize: resize,
    pressed: pressed, isHeld: isHeld, _press: press, _release: release,
    consumeTap: consumeTap, setTouchVisible: setTouchVisible,
    pushScene: pushScene, popScene: popScene, replaceScene: replaceScene,
    current: current, clearTo: clearTo, fadeTo: fadeTo,
    dialog: dialog, textBox: textBox, menuList: menuList, yesNo: yesNo,
    choiceBox: choiceBox, namingScreen: namingScreen, toast: toast,
    drawPanel: drawPanel, text: text, wrap: wrap, hpBar: hpBar,
    drawSprite: drawSprite, typeColor: typeColor,
    setTextSpeed: setTextSpeed,
    _MenuScene: MenuScene, _DialogScene: DialogScene
  };
  G.Engine = Engine;
})();
