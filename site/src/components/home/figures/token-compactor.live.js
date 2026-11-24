
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
const P = {"origin":[358.54676358856915,144.74286856499336],"scale":1.3477950208477059,"azimuth":56,"elevation":33};
const C = {"HEAD_REST":-32,"DIE_X":30,"BZ":5,"HX":-104,"FLY":[-122,0]};
const lerp = (a, b, s) => a + (b - a) * s;
const sat = (v, a, b) => Math.min(1, Math.max(0, (v - a) / (b - a)));
const ease = (s) => s * s * (3 - 2 * s);
const LOOP = 10, STILL = 3.9;
const JIT = [0.6, -0.4, 1, 0, -1, 0.5, -0.6];
const CHIPS = [[2.2, -4, 28], [2.7, 6, 34], [3.2, 18, 30]];
for (const stage of document.querySelectorAll('[data-figure="token-compactor"]')) {
  const svg = stage.querySelector('svg');
  const q = (name) => svg.querySelector('[data-part="' + name + '"]');
  const rod = q('rod'), bundle = q('bundle'), head = q('head'), die = q('die'), chips = q('chips'), wheel = q('wheel');
  const led = svg.querySelector('[data-led="on"]');
  const readout = stage.closest('.iso-figure').querySelector('[data-readout]');
  const pins = [...stage.querySelectorAll('[data-pin]')];
  const SAY = ['a loose bundle in', 'pressed into a dense block', 'the block goes out'];
  head.innerHTML = solidSvg(slabOf({ x: -4, y: -9.5, w: 4, d: 19, r: 0.8 }, C.BZ, 14, P, 2, 0.4), { tone: 'hi' });
  chips.innerHTML = CHIPS.map(() => '<g>' + solidSvg(slabOf({ x: -1.6, y: -1.6, w: 3.2, d: 3.2, r: 0.5 }, 0, 1.4, P, 2), { tone: 'hi', crease: 'none' }) + '</g>').join('');
  const chip = [...chips.children];
  wheel.innerHTML = '<path class="iso-line" data-tone="hi" d=""/>';
  const spoke = wheel.firstChild;
  let on = -1;
  function draw(t) {
    const hx = t < 4.4 ? lerp(C.HEAD_REST, C.DIE_X - 24, ease(sat(t, 0.8, 3.6))) : t < 6.8 ? lerp(C.DIE_X - 24, C.DIE_X + 24, ease(sat(t, 5, 6.6))) : lerp(C.DIE_X + 24, C.HEAD_REST, ease(sat(t, 7, 8.8)));
    const right = t < 5 ? C.DIE_X : t < 6.8 ? hx + 24 : C.DIE_X + 48;
    const len = t < 5 ? Math.max(24, C.DIE_X - hx) : 24;
    const loose = sat(len, 26, 60);
    let rods = '';
    for (let i = 0; i < 7; i++) {
      const x = right - len + (i * (len - 24 / 7)) / 6;
      rods += solidSvg(slabOf({ x, y: -8.5, w: 24 / 7, d: 17, r: 0.6 }, C.BZ, 13 + JIT[i] * 3 * loose, P, 2, 0.3), { tone: 'hi', crease: 'faint' });
    }
    bundle.innerHTML = rods;
    bundle.setAttribute('opacity', String(Math.min(sat(t, 0, 0.6), 1 - sat(t, 8.6, 9.6))));
    bundle.setAttribute('transform', translateAlong(P, [0, 0, 8 * (1 - ease(sat(t, 0, 0.7)))]));
    head.setAttribute('transform', translateAlong(P, [hx, 0, 0]));
    rod.innerHTML = solidSvg(slabOf({ x: C.HX, y: -3, w: Math.max(1, hx - 4 - C.HX), d: 6, r: 1 }, 8, 4, P, 2, 0.3), { tone: 'mid', crease: 'none' });
    die.setAttribute('transform', translateAlong(P, [0, 0, 22 * ease(sat(t, 4.4, 5)) * (1 - ease(sat(t, 7.2, 7.9)))]));
    chip.forEach((el, i) => {
      const [from, x, y] = CHIPS[i];
      const s = sat(t, from, from + 1.1);
      el.setAttribute('transform', translateAlong(P, [x, lerp(14, y, ease(s)), 22 - 15 * s * s]));
      el.setAttribute('opacity', String(Math.min(sat(t, from, from + 0.1), 1 - sat(t, 8.6, 9.4))));
    });
    const a = hx * 0.12;
    spoke.setAttribute('d', pathOf([iso([C.FLY[0], C.FLY[1], 38], P), iso([C.FLY[0] + 6.4 * Math.cos(a), C.FLY[1] + 6.4 * Math.sin(a), 38], P)]));
    led.setAttribute('opacity', t > 0.8 && t < 5 ? '1' : '0.25');
    const now = t < 0.8 ? 0 : t < 4.6 ? 1 : 2;
    if (now !== on) {
      on = now;
      pins.forEach((pin, i) => { pin.toggleAttribute('data-on', i === now); pin.toggleAttribute('data-dim', i !== now); });
      if (readout) readout.textContent = SAY[now];
    }
  }
  playFigure(stage, draw, { loop: LOOP, stillAt: STILL, seek: { press: 2.2, cut: 3, out: 5.8 } });
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) pins.forEach((pin) => pin.removeAttribute('data-dim'));
}
