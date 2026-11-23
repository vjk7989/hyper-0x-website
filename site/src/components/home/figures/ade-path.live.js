
function capsuleSvg(K, P, len) {
  const r = 4.5;
  return K.solidSvg(K.slabOf({ x: -len / 2, y: -r, w: len, d: r * 2, r }, 0, 6, P, 5, 0.4), { tone: 'hi', crease: 'lo' }) + K.lineSvg(K.pathOf([K.iso([-len / 2 + 4, 0, 6], P), K.iso([len / 2 - 4, 0, 6], P)]), { tone: 'mid' });
}
function slipSvg(K, P) {
  return K.solidSvg(K.slabOf({ x: -3, y: -4, w: 6, d: 8, r: 0.4 }, 0, 0.6, P, 2), { tone: 'hi', crease: 'none', flat: true });
}
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
const P = {"origin":[385.41493607294495,175.79938789912148],"scale":1.7212259071624503,"azimuth":56,"elevation":30};
const C = {"X":[-98,-38,22,82],"START_X":-142,"GATE_STOP":12,"RZ":6,"RACK":{"x":132,"h":14}};
const K = { solidSvg, slabOf, lineSvg, pathOf, iso };
// Capsule path: [seconds, x]; it dwells at each station.
const PATH = [[0, C.START_X], [1, C.X[0]], [2.4, C.X[0]], [3.4, C.X[1]], [4.6, C.X[1]], [5.5, C.GATE_STOP], [6.8, C.GATE_STOP], [7.7, C.X[3]], [9, C.X[3]], [9.6, C.X[3]]];
const LOOP = 10, STILL = 5.8;
const lerp = (a, b, s) => a + (b - a) * s;
const ease = (s) => s * s * (3 - 2 * s);
const sat = (v, a, b) => Math.min(1, Math.max(0, (v - a) / (b - a)));
for (const stage of document.querySelectorAll('[data-figure="ade-path"]')) {
  const svg = stage.querySelector('svg');
  const q = (name) => svg.querySelector('[data-part="' + name + '"]');
  const capsule = q('capsule'), plunger = q('plunger'), arm = q('arm'), slip = q('slip');
  const leds = { rec: svg.querySelector('[data-led="rec"]'), key: svg.querySelector('[data-led="key"]') };
  const readout = stage.closest('.iso-figure').querySelector('[data-readout]');
  const pins = [...stage.querySelectorAll('[data-pin]')];
  const SAY = ['1 · context compacted', '2 · call traced', '3 · call checked at the gate', '4 · receipt written'];
  const svgNS = 'http://www.w3.org/2000/svg';
  const slipEl = document.createElementNS(svgNS, 'g');
  slipEl.innerHTML = slipSvg(K, P);
  slip.appendChild(slipEl);
  const body = document.createElementNS(svgNS, 'g');
  capsule.appendChild(body);
  let len = 0, on = -1;
  function draw(t) {
    let x = C.START_X;
    for (let i = 1; i < PATH.length; i++) if (t >= PATH[i - 1][0]) x = t < PATH[i][0] ? lerp(PATH[i - 1][1], PATH[i][1], ease(sat(t, PATH[i - 1][0], PATH[i][0]))) : PATH[i][1];
    const press = Math.sin(Math.PI * sat(t, 1.1, 2.3));
    const next = t > 1.7 ? 9 : 16;
    if (next !== len) { len = next; body.innerHTML = capsuleSvg(K, P, len); }
    capsule.setAttribute('transform', translateAlong(P, [x, 0, C.RZ]));
    capsule.setAttribute('opacity', String(Math.min(sat(t, 0, 0.5), 1 - sat(t, 9, 9.8))));
    plunger.setAttribute('transform', translateAlong(P, [0, 0, -3.4 * press]));
    arm.setAttribute('transform', translateAlong(P, [0, 0, 16 * ease(sat(t, 5.9, 6.5)) * (1 - ease(sat(t, 7, 7.6)))]));
    const s = sat(t, 8.3, 9.4);
    slipEl.setAttribute('transform', translateAlong(P, [C.X[3] + 12 + (C.RACK.x - C.X[3] - 12) * ease(s), 0, 30 - (30 - C.RACK.h) * s * s]));
    slipEl.setAttribute('opacity', s > 0 && s < 1 ? '1' : '0');
    leds.rec.setAttribute('opacity', t > 3.6 && t < 4.5 ? '1' : '0.25');
    leds.key.setAttribute('opacity', t > 5.7 && t < 7 ? '1' : '0.25');
    const now = t < 3 ? 0 : t < 5 ? 1 : t < 7.5 ? 2 : 3;
    if (now !== on) {
      on = now;
      pins.forEach((pin, i) => { pin.toggleAttribute('data-on', i === now); pin.toggleAttribute('data-dim', i !== now); });
      if (readout) readout.textContent = SAY[now];
    }
  }
  playFigure(stage, draw, { loop: LOOP, stillAt: STILL, seek: { s1: 1.6, s2: 4, s3: 5.3, s4: 8.4 } });
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) pins.forEach((pin) => pin.removeAttribute('data-dim'));
}
