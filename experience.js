/* =====================================================================
   experience.js — Dream Bracket immersive layer
   - Scroll-scrubbed cinematic video
   - Generative ambient "dream" music (Web Audio API, no external files)
   - Floating particles, cursor aura, reveal-on-scroll, header state
   This file is intentionally independent of app.js (bracket logic).
   ===================================================================== */
(function () {
  "use strict";

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const lerp = (a, b, t) => a + (b - a) * t;
  const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

  /* ------------------------------------------------------------------ *
   * 1. Loading veil
   * ------------------------------------------------------------------ */
  const veil = document.getElementById("dream-veil");
  function hideVeil() {
    if (veil && !veil.classList.contains("hidden")) {
      veil.classList.add("hidden");
      setTimeout(() => veil && veil.remove(), 1300);
    }
  }
  window.addEventListener("load", () => setTimeout(hideVeil, 600));
  // Safety net so the veil never gets stuck
  setTimeout(hideVeil, 4000);

  /* ------------------------------------------------------------------ *
   * 2. Scroll-scrubbed cinematic video
   * ------------------------------------------------------------------ */
  const section = document.getElementById("cinema-section");
  const video = document.getElementById("cinema-video");
  const progressFill = document.getElementById("cinema-progress-fill");
  const scrollHint = document.getElementById("scroll-hint");
  const caps = Array.prototype.slice.call(document.querySelectorAll(".cine-cap"));

  let duration = 0;
  let targetTime = 0;   // where the scroll wants the video
  let shownTime = 0;    // smoothed current time
  let videoReady = false;

  if (video) {
    video.pause();
    const onMeta = () => {
      duration = video.duration || 0;
      videoReady = true;
      // nudge so the first frame paints before any scroll
      try { video.currentTime = 0.001; } catch (e) {}
    };
    if (video.readyState >= 1) onMeta();
    video.addEventListener("loadedmetadata", onMeta);
    video.addEventListener("error", () => { videoReady = false; });
  }

  function sectionProgress() {
    if (!section) return 0;
    const rect = section.getBoundingClientRect();
    const scrollable = section.offsetHeight - window.innerHeight;
    if (scrollable <= 0) return 0;
    // rect.top goes from 0 (section pinned at top) to -scrollable
    return clamp(-rect.top / scrollable, 0, 1);
  }

  function updateCaptions(p) {
    for (const cap of caps) {
      const from = parseFloat(cap.dataset.from);
      const to = parseFloat(cap.dataset.to);
      const span = to - from;
      let o = 0;
      if (p >= from && p <= to) {
        const local = (p - from) / span;            // 0..1 within window
        // ease in for first 25%, hold, ease out last 25%.
        // The opening caption (from === 0) starts fully visible so the
        // page greets the viewer immediately, before any scroll.
        o = (local < 0.25 && from > 0) ? local / 0.25
          : local > 0.75 ? (1 - local) / 0.25
          : 1;
        o = clamp(o, 0, 1);
      }
      cap.style.opacity = o.toFixed(3);
      cap.style.transform = `translateY(${(1 - o) * 26}px)`;
      cap.style.filter = `blur(${(1 - o) * 6}px)`;
    }
  }

  let rafPending = false;
  function onScroll() {
    if (rafPending) return;
    rafPending = true;
    requestAnimationFrame(() => {
      rafPending = false;
      const p = sectionProgress();
      if (videoReady && duration) targetTime = clamp(p * duration, 0, duration - 0.05);
      if (progressFill) progressFill.style.width = (p * 100).toFixed(2) + "%";
      updateCaptions(p);
      if (scrollHint) scrollHint.classList.toggle("gone", p > 0.04);
    });
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);

  // Smoothing loop: glide the displayed frame toward the scroll target
  function tick() {
    if (videoReady && duration) {
      shownTime = lerp(shownTime, targetTime, 0.12);
      if (Math.abs(shownTime - video.currentTime) > 0.02 &&
          (video.seeking === false)) {
        try { video.currentTime = shownTime; } catch (e) {}
      }
      // very slow living zoom tied to progress for extra depth
      const z = 1.06 + (targetTime / (duration || 1)) * 0.10;
      video.style.transform = "scale(" + z.toFixed(3) + ")";
    }
    requestAnimationFrame(tick);
  }
  if (!prefersReduced) requestAnimationFrame(tick);
  onScroll();
  // Recompute once everything (layout, video metadata) has settled so the
  // opening caption is visible immediately, without requiring a scroll.
  window.addEventListener("load", () => setTimeout(onScroll, 50));

  /* ------------------------------------------------------------------ *
   * 3. Reveal-on-scroll
   * ------------------------------------------------------------------ */
  const revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
      });
    }, { threshold: 0.12 });
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("in"));
  }

  /* ------------------------------------------------------------------ *
   * 4. Header state on scroll
   * ------------------------------------------------------------------ */
  const header = document.getElementById("site-header");
  function headerState() {
    if (header) header.classList.toggle("scrolled", window.scrollY > 60);
  }
  window.addEventListener("scroll", headerState, { passive: true });
  headerState();

  /* ------------------------------------------------------------------ *
   * 5. Floating dream particles
   * ------------------------------------------------------------------ */
  const pc = document.getElementById("dream-particles");
  if (pc && !prefersReduced) {
    const N = window.innerWidth < 700 ? 14 : 26;
    for (let i = 0; i < N; i++) {
      const s = document.createElement("span");
      const size = 3 + Math.random() * 9;
      s.style.width = s.style.height = size + "px";
      s.style.left = (Math.random() * 100) + "vw";
      s.style.setProperty("--drift", (Math.random() * 120 - 60) + "px");
      const dur = 16 + Math.random() * 20;
      s.style.animationDuration = dur + "s";
      s.style.animationDelay = (-Math.random() * dur) + "s";
      pc.appendChild(s);
    }
  }

  /* ------------------------------------------------------------------ *
   * 6. Cursor aura (desktop only)
   * ------------------------------------------------------------------ */
  const aura = document.getElementById("cursor-aura");
  if (aura && matchMedia("(pointer:fine)").matches && !prefersReduced) {
    let ax = window.innerWidth / 2, ay = window.innerHeight / 2, tx = ax, ty = ay;
    window.addEventListener("mousemove", (e) => {
      tx = e.clientX; ty = e.clientY; aura.style.opacity = "1";
    });
    window.addEventListener("mouseleave", () => { aura.style.opacity = "0"; });
    (function move() {
      ax = lerp(ax, tx, 0.12); ay = lerp(ay, ty, 0.12);
      aura.style.transform = `translate(${ax}px, ${ay}px)`;
      requestAnimationFrame(move);
    })();
  }

  /* ------------------------------------------------------------------ *
   * 7. Generative ambient "dream" music (Web Audio API)
   *    Soft evolving pad + occasional pentatonic bells through reverb.
   *    Starts only after a user gesture (browser autoplay policy).
   * ------------------------------------------------------------------ */
  const toggleBtn = document.getElementById("audio-toggle");
  let actx = null, master = null, padGain = null, reverb = null, started = false, playing = false;
  let bellTimer = null;

  function makeReverb(ctx, seconds) {
    const len = ctx.sampleRate * seconds;
    const buf = ctx.createBuffer(2, len, ctx.sampleRate);
    for (let ch = 0; ch < 2; ch++) {
      const data = buf.getChannelData(ch);
      for (let i = 0; i < len; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.6);
      }
    }
    const conv = ctx.createConvolver();
    conv.buffer = buf;
    return conv;
  }

  function buildAudio() {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return false;
    actx = new AC();

    master = actx.createGain();
    master.gain.value = 0.0001;
    master.connect(actx.destination);

    reverb = makeReverb(actx, 3.4);
    const revGain = actx.createGain(); revGain.gain.value = 0.85;
    reverb.connect(revGain); revGain.connect(master);

    // Pad: detuned chord through a gently sweeping lowpass
    padGain = actx.createGain(); padGain.gain.value = 0.5;
    const filter = actx.createBiquadFilter();
    filter.type = "lowpass"; filter.frequency.value = 900; filter.Q.value = 0.6;
    padGain.connect(filter);
    filter.connect(master);
    filter.connect(reverb);

    // slow filter LFO (breathing)
    const lfo = actx.createOscillator(); lfo.frequency.value = 0.05;
    const lfoGain = actx.createGain(); lfoGain.gain.value = 420;
    lfo.connect(lfoGain); lfoGain.connect(filter.frequency); lfo.start();

    // gentle amplitude LFO
    const aLfo = actx.createOscillator(); aLfo.frequency.value = 0.08;
    const aLfoGain = actx.createGain(); aLfoGain.gain.value = 0.12;
    aLfo.connect(aLfoGain); aLfoGain.connect(padGain.gain); aLfo.start();

    // Chord (A major add9-ish, airy)
    const chord = [110.0, 164.81, 220.0, 277.18, 329.63, 493.88];
    chord.forEach((f, i) => {
      const o1 = actx.createOscillator(); o1.type = "sine"; o1.frequency.value = f; o1.detune.value = -5;
      const o2 = actx.createOscillator(); o2.type = "triangle"; o2.frequency.value = f; o2.detune.value = +6;
      const g = actx.createGain();
      g.gain.value = (i >= 4 ? 0.05 : 0.12) / chord.length; // upper notes softer
      o1.connect(g); o2.connect(g); g.connect(padGain);
      o1.start(); o2.start();
    });

    // Occasional dreamy bells (A major pentatonic)
    const bells = [440, 493.88, 554.37, 659.25, 739.99, 880];
    function ping() {
      if (!playing) return;
      const f = bells[Math.floor(Math.random() * bells.length)];
      const o = actx.createOscillator(); o.type = "sine"; o.frequency.value = f;
      const g = actx.createGain(); g.gain.value = 0.0001;
      const pan = actx.createStereoPanner ? actx.createStereoPanner() : null;
      if (pan) { pan.pan.value = Math.random() * 1.6 - 0.8; o.connect(g); g.connect(pan); pan.connect(reverb); pan.connect(master); }
      else { o.connect(g); g.connect(reverb); g.connect(master); }
      const t = actx.currentTime;
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.06, t + 0.04);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 3.2);
      o.start(t); o.stop(t + 3.4);
      bellTimer = setTimeout(ping, 2600 + Math.random() * 5200);
    }
    bellTimer = setTimeout(ping, 1800);

    return true;
  }

  function setPlaying(on) {
    if (!actx) return;
    const t = actx.currentTime;
    master.gain.cancelScheduledValues(t);
    master.gain.setValueAtTime(Math.max(master.gain.value, 0.0001), t);
    master.gain.exponentialRampToValueAtTime(on ? 0.16 : 0.0001, t + (on ? 1.6 : 0.8));
    playing = on;
    toggleBtn.classList.toggle("playing", on);
    toggleBtn.setAttribute("aria-pressed", on ? "true" : "false");
  }

  if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
      if (!started) { started = buildAudio(); if (!started) { toggleBtn.title = "Audio not supported"; return; } }
      if (actx.state === "suspended") actx.resume();
      setPlaying(!playing);
    });
  }
})();
