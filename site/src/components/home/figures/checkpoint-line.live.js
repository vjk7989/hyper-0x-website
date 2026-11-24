
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
const P = {"origin":[371.3718411552346,236.96835922051218],"scale":1.0773639105321937,"azimuth":68,"elevation":30};
const C = {"GATES":[-100,-20,60],"XR":-8,"SP":50,"N":6,"V":18,"FROM":-170,"REFUSED":[2,5],"BZ":5};
const sat = (v, a, b) => Math.min(1, Math.max(0, (v - a) / (b - a)));
const TOT = C.SP * C.N;
const LOOP = TOT / C.V;
const JIT = [3, -4, 2, -3, 4, -2];
const SAY = ['calls arrive from any model', 'each call is trimmed', 'every run is observed', 'agents improve from what is recorded', 'a flagged call is turned back', 'checked calls are recorded'];
// call 2 rests in the reject tray
const STILL = 71 / C.V;
for (const stage of document.querySelectorAll('[data-figure="checkpoint-line"]')) {
  const svg = stage.querySelector('svg');
  const q = (name) => svg.querySelector('[data-part="' + name + '"]');
  const items = q('items'), pusher = q('pusher');
  const lamp = svg.querySelector('[data-led="rec"]');
  const readout = stage.closest('.iso-figure').querySelector('[data-readout]');
  const pins = [...stage.querySelectorAll('[data-pin]')];
  const shapes = [
    solidSvg(slabOf({ x: -6, y: -6, w: 12, d: 12, r: 1 }, C.BZ, 12, P, 2, 0.4), { tone: 'hi' }),
    solidSvg(slabOf({ x: -4, y: -4, w: 8, d: 8, r: 1 }, C.BZ, 20, P, 2, 0.4), { tone: 'mid' }),
    solidSvg(cylinder(0, 0, 6, C.BZ, 9, P, 14), { tone: 'hi' }),
    solidSvg(slabOf({ x: -9, y: -5.5, w: 18, d: 11, r: 1 }, C.BZ, 6, P, 2, 0.4), { tone: 'mid' }),
  ];
  const small = solidSvg(slabOf({ x: -5, y: -4, w: 10, d: 8, r: 1 }, C.BZ, 7, P, 2, 0.4), { tone: 'hi' }) + lineSvg(lineOnTop([-3, 0], [3, 0], C.BZ + 7, P), { tone: 'mid' });
  const cross = lineSvg(pathOf([iso([-3, -3, C.BZ + 22], P), iso([3, 3, C.BZ + 22], P)]) + pathOf([iso([-3, 3, C.BZ + 22], P), iso([3, -3, C.BZ + 22], P)]), { tone: 'hi' });
  items.innerHTML = Array.from({ length: C.N }, (_, i) => '<g><g>' + shapes[i % 4] + '</g><g display="none">' + small + '</g><g display="none">' + cross + '</g></g>').join('');
  pusher.innerHTML = solidSvg(slabOf({ x: C.XR - 6, y: -3, w: 12, d: 6, r: 1 }, 6, 7, P, 2, 0.4), { tone: 'hi' });
  const cell = [...items.children];
  const kids = cell.map((el) => [...el.children]);
  const shown = cell.map(() => [1, 0, 0]);
  let on = -1;
  function draw(t) {
    let near = -1, lit = false, push = 0;
    cell.forEach((el, i) => {
      const bad = C.REFUSED.includes(i);
      const p = C.FROM + ((i * C.SP + C.V * t) % TOT);
      let x = p, y = JIT[i] * (1 - sat(p, C.GATES[0] - 40, C.GATES[0] - 8)), z = 0, a = Math.min(sat(p, -168, -150), 1 - sat(p, 108, 124));
      if (bad && p > C.XR) {
        const s = sat(p, C.XR, C.XR + 14);
        x = C.XR; y = 34 * s; z = -s;
        a = 1 - sat(p, C.XR + 50, C.XR + 80);
        push = Math.max(push, y * (1 - sat(p, C.XR + 16, C.XR + 34)));
        if (p < C.XR + 40) near = 4;
      }
      el.setAttribute('transform', translateAlong(P, [x, y, z]));
      el.setAttribute('opacity', String(a));
      const want = [p < C.GATES[0] ? 1 : 0, p < C.GATES[0] ? 0 : 1, bad && p > C.GATES[1] - 18 ? 1 : 0];
      want.forEach((v, j) => { if (shown[i][j] !== v) { shown[i][j] = v; kids[i][j].setAttribute('display', v ? 'inline' : 'none'); } });
      if (p > 100 && p < 126) lit = true;
      if (near < 0) {
        const g = C.GATES.findIndex((gx) => Math.abs(p - gx) < 12);
        if (g >= 0 && !(bad && g === 1)) near = g + 1; else if (p < -142) near = 0; else if (lit) near = 5;
      }
    });
    pusher.setAttribute('transform', translateAlong(P, [0, Math.max(-16, push - 9), 0]));
    lamp.setAttribute('opacity', lit ? '1' : '0.25');
    if (near >= 0 && near !== on) {
      on = near;
      pins.forEach((pin, i) => { pin.toggleAttribute('data-on', i === on); pin.toggleAttribute('data-dim', i !== on); });
      if (readout) readout.textContent = SAY[on];
    }
  }
  playFigure(stage, draw, { loop: LOOP, stillAt: STILL, seek: { in: 0.5, trim: 3.9, watch: 8.3, learn: 12.8, refuse: 3.9, chain: 15.5 } });
}
