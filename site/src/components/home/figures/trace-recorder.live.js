
function playFigure(stage, draw, opts) {
  const { loop = 0, seek = {}, onSeek, stillAt = 0 } = opts || {};
  const figure = stage.closest('.iso-figure') || stage;
  const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let frame = 0, prev = 0, clock = 0, visible = false, failed = false;
  // Phones and tablets draw at 30 frames a second: the motion stays smooth
  // and the main thread gets half the work.
  const minStep = matchMedia('(pointer: coarse)').matches ? 1000 / 30 - 2 : 0;
  const run = (dt) => {
    try { draw(clock, dt); } catch (err) { if (!failed) { failed = true; console.warn('figure frame', err); } }
  };
  function tick(now) {
    frame = visible ? requestAnimationFrame(tick) : 0;
    if (minStep && prev && now - prev < minStep) return;
    const dt = prev ? Math.min(0.05, (now - prev) / 1000) : 0;
    prev = now;
    clock = loop ? (clock + dt) % loop : clock + dt;
    run(dt);
  }
  const jump = (id) => {
    if (seek[id] != null) { clock = seek[id]; prev = 0; run(0); }
    if (onSeek) onSeek(id);
    if (!still && visible && !frame) frame = requestAnimationFrame(tick);
  };
  for (const el of figure.querySelectorAll('[data-step]')) el.addEventListener('click', () => jump(el.dataset.step));
  for (const el of stage.querySelectorAll('[data-pin][data-seek]')) el.addEventListener('click', () => jump(el.dataset.seek));
  clock = still ? stillAt : 0;
  run(0);
  if (still) return;
  new IntersectionObserver((entries) => {
    visible = entries[entries.length - 1].isIntersecting;
    prev = 0;
    if (visible && !frame) frame = requestAnimationFrame(tick);
  }, { rootMargin: '120px 0px' }).observe(stage);
}
const P = {"origin":[355.3188486754606,150.0691710888209],"scale":1.5257687543728469,"azimuth":58,"elevation":32};
const C = {"PEN_X":-50,"LANES":[-16,0,16],"PZ":6.2,"REEL":[-115,0]};
const LOOP = 12, V = 20, AGE = 7.5, N = 44, TAU = Math.PI * 2;
const EV = [[0.8, 1], [2.6, 0.6], [3.3, -0.8], [5.9, 1], [7.7, -0.5], [9.2, 0.8], [10.6, -1]];
const sig = [
  (u) => 0.6 * Math.sin(TAU * 3 * u / LOOP) + 0.4 * Math.sin(TAU * 5 * u / LOOP + 1),
  (u) => EV.reduce((a, [e, h]) => { const d = Math.min(Math.abs(u - e), LOOP - Math.abs(u - e)); return d < 0.4 ? a + h * (1 - d / 0.4) : a; }, 0),
  (u) => (Math.sin(TAU * 2 * u / LOOP) + 0.5 * Math.sin(TAU * 3 * u / LOOP + 2) > 0 ? 0.9 : -0.9),
];
const TONE = ['hi', 'mid', 'hi'];
for (const stage of document.querySelectorAll('[data-figure="trace-recorder"]')) {
  const svg = stage.querySelector('svg');
  const q = (name) => svg.querySelector('[data-part="' + name + '"]');
  const trace = q('trace'), grid = q('grid'), reel = q('reel');
  const pens = [...svg.querySelectorAll('[data-part="pen"]')];
  const led = svg.querySelector('[data-led="rec"]');
  const readout = stage.closest('.iso-figure').querySelector('[data-readout]');
  const pins = [...stage.querySelectorAll('[data-pin]')];
  const SAY = ['traces: what each call did', 'logs: what came back', 'evaluations: did it meet the bar'];
  reel.innerHTML = '<path class="iso-line" data-tone="hi" d=""/>';
  const spoke = reel.firstChild;
  let on = -1;
  function draw(t) {
    let lines = '';
    for (let l = 0; l < 3; l++) {
      const pts = [];
      for (let i = 0; i <= N; i++) {
        const a = (i / N) * AGE;
        pts.push(iso([C.PEN_X + V * a, C.LANES[l] + 6.5 * sig[l](((t - a) % LOOP + LOOP) % LOOP), C.PZ], P));
      }
      lines += lineSvg(pathOf(pts), { tone: TONE[l] });
      pens[l].setAttribute('transform', translateAlong(P, [0, 6.5 * sig[l](t), 0]));
    }
    trace.innerHTML = lines;
    const s = (V * t) % 10;
    let ticks = '', dots = [];
    for (let x = -90 + s; x < 100; x += 10) {
      ticks += lineOnTop([x, -26], [x, -23], C.PZ, P) + lineOnTop([x, 23], [x, 26], C.PZ, P);
      dots.push(iso([x + 5, -24.5, C.PZ], P), iso([x + 5, 24.5, C.PZ], P));
    }
    grid.innerHTML = lineSvg(ticks, { tone: 'lo' }) + dotsSvg(dots, { size: 0.45, tone: 'mid' });
    const a = -t * 0.9;
    spoke.setAttribute('d', pathOf([iso([C.REEL[0], C.REEL[1], 34], P), iso([C.REEL[0] + 11 * Math.cos(a), C.REEL[1] + 11 * Math.sin(a), 34], P)]));
    led.setAttribute('opacity', String(0.4 + 0.6 * Math.abs(Math.sin(t * 2))));
    const now = Math.floor(t / 4) % 3;
    if (now !== on) {
      on = now;
      pins.forEach((pin, i) => { pin.toggleAttribute('data-on', i === now); pin.toggleAttribute('data-dim', i !== now); });
      if (readout) readout.textContent = SAY[now];
    }
  }
  playFigure(stage, draw, { loop: LOOP, stillAt: 9, seek: { trace: 1, log: 5, eval: 9 } });
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) pins.forEach((pin) => pin.removeAttribute('data-dim'));
}
