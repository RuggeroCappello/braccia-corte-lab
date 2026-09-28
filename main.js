/* Browser shell only: input, fixed timestep, procedural audio and accessibility.
   The deterministic simulation lives in game.js; all Canvas artwork in render.js. */
(function () {
  'use strict';
  const canvas = document.getElementById('game');
  const ctx = canvas.getContext('2d');
  const error = document.getElementById('error');
  if (!ctx || !window.BracciaGame || !window.BracciaRenderer) {
    error.hidden = false;
    error.textContent = 'Non riesco ad avviare il gioco. Tieni index.html, style.css, level.js, game.js, render.js e main.js nella stessa cartella e riapri index.html.';
    return;
  }
  const Game = window.BracciaGame;
  const Renderer = window.BracciaRenderer;
  const DT = 1 / 60;
  const keys = new Set();
  const pending = { jump: false, ability: false };
  const pauseButton = document.getElementById('pause');
  const audioButton = document.getElementById('audio');
  const fullscreenButton = document.getElementById('fullscreen');
  const status = document.getElementById('status');
  let state = Game.create({ mode: 'title' });
  state.mode = 'title';
  let accumulator = 0;
  let previousTime = null;
  let visualTime = 0;
  let modeBeforePause = 'playing';
  let lastAnnouncement = '';

  /* A small original synthesizer. Nothing loads from the network, and creating
     the AudioContext is deferred until the player's first intentional gesture. */
  const Sound = (() => {
    let context = null;
    let master = null;
    let enabled = true;
    let unlocked = false;
    let lastLand = -1;
    let noiseBuffer = null;
    const available = !!(window.AudioContext || window.webkitAudioContext);
    function updateButton() {
      audioButton.innerHTML = !available ? 'Audio non disponibile' :
        `${enabled ? (unlocked ? 'Audio attivo' : 'Audio pronto') : 'Audio spento'} <kbd>M</kbd>`;
      audioButton.setAttribute('aria-pressed', String(enabled && unlocked));
      audioButton.disabled = !available;
    }
    function wake() {
      if (!available || !enabled) return;
      try {
        if (!context) {
          const Audio = window.AudioContext || window.webkitAudioContext;
          context = new Audio();
          master = context.createGain();
          master.gain.value = .2;
          master.connect(context.destination);
        }
        if (context.state === 'suspended') context.resume().catch(() => {});
        unlocked = true;
      } catch (_) { enabled = false; }
      updateButton();
    }
    function toggle() {
      enabled = !enabled;
      if (master) master.gain.setTargetAtTime(enabled ? .2 : 0, context.currentTime, .025);
      if (enabled) wake();
      updateButton();
    }
    function tone(hz, duration = .12, type = 'sine', volume = .35, offset = 0, endHz = hz) {
      if (!context || !enabled || context.state !== 'running') return;
      const t = context.currentTime + offset;
      const oscillator = context.createOscillator();
      const envelope = context.createGain();
      oscillator.type = type;
      oscillator.frequency.setValueAtTime(Math.max(1, hz), t);
      oscillator.frequency.exponentialRampToValueAtTime(Math.max(1, endHz), t + duration);
      envelope.gain.setValueAtTime(.0001, t);
      envelope.gain.exponentialRampToValueAtTime(Math.max(.001, volume), t + .008);
      envelope.gain.exponentialRampToValueAtTime(.0001, t + duration);
      oscillator.connect(envelope); envelope.connect(master);
      oscillator.start(t); oscillator.stop(t + duration + .015);
      oscillator.onended = () => { oscillator.disconnect(); envelope.disconnect(); };
    }
    function noise(duration, volume, frequency) {
      if (!context || !enabled || context.state !== 'running') return;
      if (!noiseBuffer) {
        noiseBuffer = context.createBuffer(1, Math.ceil(context.sampleRate * .6), context.sampleRate);
        const data = noiseBuffer.getChannelData(0);
        let seed = 481;
        for (let n = 0; n < data.length; n++) {
          seed = (seed * 16807) % 2147483647;
          data[n] = seed / 1073741823.5 - 1;
        }
      }
      const t = context.currentTime;
      const source = context.createBufferSource();
      const filter = context.createBiquadFilter();
      const envelope = context.createGain();
      source.buffer = noiseBuffer;
      filter.type = 'lowpass'; filter.frequency.value = frequency;
      envelope.gain.setValueAtTime(volume, t);
      envelope.gain.exponentialRampToValueAtTime(.0001, t + duration);
      source.connect(filter); filter.connect(envelope); envelope.connect(master);
      source.start(t); source.stop(t + duration);
      source.onended = () => { source.disconnect(); filter.disconnect(); envelope.disconnect(); };
    }
    function play(event) {
      if (!enabled || !context) return;
      switch (event.type) {
        case 'jump': tone(190, .13, 'triangle', .42, 0, 430); break;
        case 'land':
          if (context.currentTime - lastLand > .1) { noise(.055, .15, 430); lastLand = context.currentTime; }
          break;
        case 'coin': tone(780, .08, 'sine', .45); tone(1170, .14, 'sine', .35, .06); break;
        case 'pass': tone(440, .09, 'triangle'); tone(660, .12, 'triangle', .4, .07); break;
        case 'stomp': tone(130, .11, 'square', .2, 0, 65); tone(420, .1, 'triangle', .3, .07); break;
        case 'dash': noise(.18, .35, 1600); tone(120, .17, 'sawtooth', .16, 0, 580); break;
        case 'gate': tone(440, .12, 'triangle'); tone(554, .15, 'triangle', .35, .07); tone(880, .18, 'triangle', .35, .14); break;
        case 'checkpoint': [523, 659, 784, 1046].forEach((f, n) => tone(f, .2, 'sine', .35, n * .09)); break;
        case 'hurt': noise(.23, .55, 900); tone(220, .3, 'sawtooth', .2, 0, 60); break;
        case 'respawn': tone(220, .2, 'triangle', .3, 0, 440); tone(660, .22, 'sine', .25, .13); break;
        case 'bossWindup': tone(95, .2, 'square', .15); tone(95, .2, 'square', .15, .25); break;
        case 'coconut': tone(82, .16, 'triangle', .65, 0, 44); noise(.09, .3, 320); break;
        case 'cigar': tone(440, .24, 'sawtooth', .12, 0, 110); break;
        case 'explosion': noise(.42, .65, 850); tone(68, .32, 'triangle', .55, 0, 26); break;
        case 'reflect': tone(650, .12, 'square', .2, 0, 1100); tone(1400, .16, 'sine', .4, .04); break;
        case 'bossHit': noise(.2, .5, 1100); tone(180, .3, 'sawtooth', .22, 0, 42); break;
        case 'victory': [523, 659, 784, 1046, 784, 1046].forEach((f, n) => tone(f, .26, 'triangle', .38, n * .14)); break;
        case 'gameover': [330, 294, 220, 110].forEach((f, n) => tone(f, .3, 'triangle', .35, n * .17)); break;
      }
    }
    updateButton();
    return { wake, toggle, play, get enabled() { return enabled; } };
  })();

  function clearInput() {
    keys.clear(); pending.jump = false; pending.ability = false;
    accumulator = 0; previousTime = null;
  }
  function focusCanvas() { canvas.focus({ preventScroll: true }); }
  function start() {
    clearInput();
    if (Game.start) state = Game.start(state) || state;
    else state.mode = 'playing';
    Sound.wake(); focusCanvas(); announce(); draw();
  }
  function restart() {
    clearInput();
    if (Game.restart) state = Game.restart(state) || state;
    else state = Game.create({ mode: 'playing' });
    Sound.wake(); focusCanvas(); announce(); draw();
  }
  function pause() {
    if (state.mode !== 'playing') return;
    modeBeforePause = state.mode;
    state.mode = 'paused'; clearInput(); announce(); draw();
  }
  function resume() {
    if (state.mode !== 'paused') return;
    state.mode = modeBeforePause; clearInput(); Sound.wake(); focusCanvas(); announce(); draw();
  }
  function togglePause() { if (state.mode === 'paused') resume(); else pause(); }
  function teleport(section) {
    if (!Number.isInteger(section) || section < 0 || section > 2) return;
    clearInput();
    if (Game.teleportSection) state = Game.teleportSection(state, section) || state;
    Sound.wake(); focusCanvas(); announce(); draw();
  }
  async function fullscreen() {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else if (document.documentElement.requestFullscreen) await document.documentElement.requestFullscreen();
    } catch (_) {
      status.textContent = 'Il browser non consente lo schermo intero. Puoi usare il comando Schermo intero dal menu del browser.';
    }
    focusCanvas();
  }
  function announce() {
    pauseButton.disabled = !['playing', 'paused'].includes(state.mode);
    pauseButton.innerHTML = `${state.mode === 'paused' ? 'Riprendi' : 'Pausa'} <kbd>Esc</kbd>`;
    pauseButton.setAttribute('aria-label', `${state.mode === 'paused' ? 'Riprendi' : 'Pausa'}, tasto Escape`);
    const id = `${state.mode}:${state.checkpoint}:${state.lives}`;
    if (id === lastAnnouncement) return;
    lastAnnouncement = id;
    const messages = {
      title: 'Schermata iniziale. Premi Invio, Spazio o fai clic per giocare.',
      playing: `${state.lives} vite. ${state.checkpoint ? `Checkpoint ${state.checkpoint} attivo.` : 'Partenza dai caruggi.'}`,
      paused: 'Gioco in pausa. Premi Escape o fai clic sul gioco per riprendere.',
      gameover: `Partita terminata. Punteggio ${state.score}. Premi Invio o fai clic per riprovare.`,
      victory: `Vittoria! Punteggio ${state.score}. Tempo ${Math.floor(state.time)} secondi. Premi Invio o fai clic per rigiocare.`
    };
    status.textContent = messages[state.mode] || '';
  }
  const consumedKeys = new Set(['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Space', 'KeyA', 'KeyD', 'KeyW', 'KeyS', 'ShiftLeft', 'ShiftRight', 'KeyE', 'Escape', 'Enter', 'KeyH', 'KeyI', 'Digit1', 'Digit2', 'Digit3', 'KeyM', 'KeyF']);
  const jumpKeys = new Set(['Space', 'ArrowUp', 'KeyW']);
  window.addEventListener('keydown', event => {
    if (event.ctrlKey || event.metaKey || event.altKey) return;
    if (event.target instanceof HTMLButtonElement && ['Space', 'Enter'].includes(event.code)) return;
    if (consumedKeys.has(event.code)) event.preventDefault();
    const fresh = !keys.has(event.code) && !event.repeat;
    keys.add(event.code);
    if (!fresh) return;
    if (event.code === 'KeyM') { Sound.toggle(); return; }
    if (event.code === 'KeyF') { fullscreen(); return; }
    if (event.code === 'KeyH' || event.code === 'KeyI') {
      if (Game.toggleDebug) Game.toggleDebug(state, event.code === 'KeyH' ? 'hitboxes' : 'invincible');
      draw(); return;
    }
    if (['Digit1', 'Digit2', 'Digit3'].includes(event.code)) { teleport(Number(event.code.slice(-1)) - 1); return; }
    if (event.code === 'Escape') { togglePause(); return; }
    if (['Enter', 'Space'].includes(event.code)) {
      if (state.mode === 'title') { start(); return; }
      if (state.mode === 'gameover' || state.mode === 'victory') { restart(); return; }
      if (state.mode === 'paused') { resume(); return; }
    }
    if (state.mode === 'playing') {
      Sound.wake();
      if (jumpKeys.has(event.code)) pending.jump = true;
      if (event.code === 'KeyE') pending.ability = true;
    }
  });
  window.addEventListener('keyup', event => { keys.delete(event.code); });
  window.addEventListener('blur', () => { pause(); clearInput(); });
  document.addEventListener('visibilitychange', () => { if (document.hidden) { pause(); clearInput(); } });
  canvas.addEventListener('pointerdown', () => {
    Sound.wake(); focusCanvas();
    if (state.mode === 'title') start();
    else if (state.mode === 'paused') resume();
    else if (state.mode === 'gameover' || state.mode === 'victory') restart();
  });
  pauseButton.addEventListener('click', () => { Sound.wake(); togglePause(); });
  audioButton.addEventListener('click', () => { Sound.toggle(); focusCanvas(); });
  fullscreenButton.addEventListener('click', fullscreen);
  document.addEventListener('fullscreenchange', () => {
    fullscreenButton.innerHTML = `${document.fullscreenElement ? 'Esci da schermo intero' : 'Schermo intero'} <kbd>F</kbd>`;
    previousTime = null; accumulator = 0;
  });
  function input() {
    return {
      left: keys.has('ArrowLeft') || keys.has('KeyA'),
      right: keys.has('ArrowRight') || keys.has('KeyD'),
      run: keys.has('ShiftLeft') || keys.has('ShiftRight'),
      jump: [...jumpKeys].some(key => keys.has(key)),
      jumpPressed: pending.jump,
      abilityPressed: pending.ability
    };
  }
  function tick(value) {
    Game.step(state, value);
    // Raccoglie gli eventi a ogni tick, anche quando un frame ne esegue più di uno.
    if (Renderer.consume) Renderer.consume(state, visualTime);
    for (const event of state.events || []) Sound.play(event);
    announce();
  }
  function draw() { Renderer.draw(ctx, state, accumulator / DT, visualTime); }
  function frame(timestamp) {
    const elapsed = previousTime === null ? 0 : Math.min(Math.max((timestamp - previousTime) / 1000, 0), .1);
    previousTime = timestamp;
    visualTime += elapsed;
    if (state.mode === 'playing') {
      accumulator += elapsed;
      while (accumulator + 1e-10 >= DT && state.mode === 'playing') {
        tick(input());
        pending.jump = false; pending.ability = false;
        accumulator -= DT;
      }
    } else accumulator = 0;
    draw();
    window.requestAnimationFrame(frame);
  }
  /* QA can pause browser-driven simulation and advance exact 1/60 s steps.
     A paused state is temporarily marked playing during manual steps, then
     remains paused unless a terminal game state (victory/gameover) is reached. */
  window.braccia = {
    get state() { return state; },
    get audioEnabled() { return Sound.enabled; },
    start, restart, teleport, pause, resume,
    step(value = {}, count = 1) {
      const wasPaused = state.mode === 'paused';
      if (wasPaused) state.mode = 'playing';
      const limit = Math.max(0, Math.min(36000, Math.floor(count)));
      for (let n = 0; n < limit && state.mode === 'playing'; n++) {
        tick(n === 0 ? value : { ...value, jumpPressed: false, abilityPressed: false });
      }
      if (wasPaused && state.mode === 'playing') state.mode = 'paused';
      accumulator = 0; previousTime = null; announce(); draw();
      return state;
    },
    frame: draw
  };
  announce(); draw();
  window.requestAnimationFrame(frame);
})();
