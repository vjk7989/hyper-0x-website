
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
const P = {"origin":[422.58186913793185,318.1425479440916],"scale":1.3360382606114107,"azimuth":68,"elevation":30};
const C = {"XS":[-219,-185,-151,-117],"YR":-27,"YA":5,"XG":-78,"XP":-58,"BZ":4,"EX":42,"LX1":90,"LY":-14,"DIAL":{"x":-8,"z":24,"r":9},"WIN":{"x0":8,"x1":28,"z0":18,"z1":26},"FY":14,"V":35,"VA":90,"DEP":[0.32,0.84,1.36,1.89],"BAD":3,"ANS":[{"to":0,"at":8.3},{"to":1,"at":8.85},{"to":2,"at":9.4}],"REC":[8.3,8.8,9.3,9.8],"BEAT":2.75,"LOOP":11};
const sat = (v, a, b) => Math.min(1, Math.max(0, (v - a) / (b - a)));
const ease = (s) => s * s * (3 - 2 * s);
const SAY = ['agents send requests', 'the gate decides', 'every run is traced', 'the answer comes back'];
const IDS = ['ask', 'gate', 'run', 'back'];
const XO = C.XS.map((x) => x - 7);
const TP = C.DEP[C.BAD] + (13 + C.XP - XO[C.BAD]) / C.V; // when the refused call reaches the pusher
const TR = TP + 1.05; // and when it starts home
const level = (t) => Math.sin(Math.PI * sat(t, 5.3, 8.3));
for (const stage of document.querySelectorAll('[data-figure="agent-line"]')) {
  const svg = stage.querySelector('svg');
  const q = (name) => svg.querySelector('[data-part="' + name + '"]');
  const calls = q('calls'), plates = q('plates'), pusher = q('pusher'), needle = q('needle'), bars = q('bars');
  const led = (name) => svg.querySelector('[data-led="' + name + '"]');
  const figure = stage.closest('.iso-figure');
  const readout = figure.querySelector('[data-readout]');
  const pins = [...stage.querySelectorAll('[data-pin]')];
  const cards = [...figure.querySelectorAll('[data-step]')];
  const B = C.BZ;
  const flat = { tone: 'hi', crease: 'none' };
  const shapes = [
    solidSvg(slabOf({ x: -5, y: -5, w: 10, d: 10, r: 0 }, B, 10, P, 1), flat),
    solidSvg(cylinder(0, 0, 5, B, 9, P, 10), flat),
    solidSvg(slabOf({ x: -3.5, y: -3.5, w: 7, d: 7, r: 0 }, B, 18, P, 1), flat),
    solidSvg(slabOf({ x: -7, y: -4.5, w: 14, d: 9, r: 0 }, B, 5, P, 1), flat)
  ];
  const small = solidSvg(slabOf({ x: -4.5, y: -3.5, w: 9, d: 7, r: 0 }, B, 6, P, 1), flat) + lineSvg(lineOnTop([-2.5, 0], [2.5, 0], B + 6, P), { tone: 'mid' });
  const cross = lineSvg(pathOf([iso([-3, -3, B + 8], P), iso([3, 3, B + 8], P)]) + pathOf([iso([-3, 3, B + 8], P), iso([3, -3, B + 8], P)]), { tone: 'hi' });
  const answer = solidSvg(cylinder(0, 0, 5, B, 3, P, 10), flat) + lineSvg(pathOf([iso([-2.5, 0.2, B + 3], P), iso([-0.8, 2, B + 3], P), iso([2.6, -2.2, B + 3], P)]), { tone: 'mid' });
  const plate = solidSvg(slabOf({ x: -6, y: -4, w: 12, d: 8, r: 0 }, B, 2.2, P, 1), flat);
  const cell = (inner) => '<g>' + inner + '</g>';
  calls.innerHTML = C.XS.map((_, i) => cell('<g>' + shapes[i] + '</g><g display="none">' + small + '</g><g display="none">' + cross + '</g>')).join('') + C.ANS.map(() => cell(answer)).join('');
  plates.innerHTML = C.REC.map(() => cell(plate)).join('');
  const req = [...calls.children].slice(0, 4), ans = [...calls.children].slice(4), rec = [...plates.children];
  const shown = req.map(() => [1, 0, 0]);
  const put = (el, x, y, z, a) => { el.setAttribute('transform', translateAlong(P, [x, y, z])); el.setAttribute('opacity', String(a)); };
  let on = -1;
  function draw(t) {
    let push = 0;
    req.forEach((el, i) => {
      const d = C.V * (t - C.DEP[i]);
      const bad = i === C.BAD;
      let x = XO[i], y = -40 + Math.min(d, 13), z = 0, a = sat(d, 0, 6);
      if (d > 13) { x = XO[i] + d - 13; y = C.YR; }
      if (bad && x > C.XP) {
        const s = ease(sat(t, TP, TP + 0.85));
        x = C.XP; y = C.YR + 32 * s; push = s;
        if (t > TR) {
          const run = Math.min(C.XP - C.XS[i] - 7, 60 * (t - TR));
          x = C.XP - run; y = C.YA;
          const h = sat(t, TR + (C.XP - C.XS[i] - 7) / 60, TR + (C.XP - C.XS[i] - 7) / 60 + 0.55);
          if (h > 0) { y = C.YA - 39 * ease(h); z = 22 * Math.sin(Math.PI * h) + 8 * h; a = 1 - sat(h, 0.8, 1); }
          push = 1 - sat(t, TR - 0.2, TR);
        }
      } else if (x > C.EX - 10) a = 0;
      put(el, x, y, z, a);
      const want = [x < C.XG ? 1 : 0, x < C.XG ? 0 : 1, bad && x > C.XG + 10 ? 1 : 0];
      want.forEach((v, j) => { if (shown[i][j] !== v) { shown[i][j] = v; el.children[j].setAttribute('display', v ? 'inline' : 'none'); } });
    });
    ans.forEach((el, j) => {
      const A = C.ANS[j], to = C.XS[A.to] + 7;
      const run = (C.EX - 12 - to) / C.VA;
      const u = t - A.at;
      let x = C.EX - 12 - C.VA * Math.max(0, u), y = C.YA, z = 0, a = u > 0 ? 1 : 0;
      if (u > run) {
        const h = sat(u, run, run + 0.55);
        x = to; y = C.YA - 39 * ease(h); z = 22 * Math.sin(Math.PI * h) + 8 * h; a = 1 - sat(h, 0.8, 1);
      }
      put(el, x, y, z, a);
    });
    let lamp = 0;
    rec.forEach((el, j) => {
      const u = t - C.REC[j], x = C.EX + 2 + 60 * Math.max(0, u);
      put(el, Math.min(x, C.LX1 - 6), C.LY, 0, u > 0 && x < C.LX1 + 4 ? sat(x, C.EX + 2, C.EX + 10) : 0);
      if (x > C.LX1 - 22 && x < C.LX1 + 8) lamp = 1;
    });
    pusher.innerHTML = push > 0.01 ? solidSvg(slabOf({ x: C.XP - 5, y: -36 + 32 * push - 1, w: 10, d: 4, r: 0 }, B + 1, 8, P, 1), flat) + (push > 0.05 ? solidSvg(slabOf({ x: C.XP - 1.5, y: -36, w: 3, d: 32 * push - 1, r: 0 }, B + 3, 4, P, 1), flat) : '') : solidSvg(slabOf({ x: C.XP - 5, y: -36, w: 10, d: 4, r: 0 }, B + 1, 8, P, 1), flat);
    const lv = level(t);
    const ang = ((225 - 270 * (0.06 + 0.66 * lv)) * Math.PI) / 180;
    const { x, z, r } = C.DIAL;
    const pt = (rr) => iso([x + rr * Math.cos(ang), C.FY, z + rr * Math.sin(ang)], P);
    needle.setAttribute('d', pathOf([pt(-2), pt(r - 1.4)]));
    let bd = '';
    for (let j = 0; j < 8; j++) {
      const h = 0.8 + 6.2 * Math.max(0, level(t - 0.3 * (7 - j)));
      const x0 = C.WIN.x0 + 1.3 + j * 2.3, z0 = C.WIN.z0 + 0.7;
      bd += pathOf([iso([x0, C.FY, z0], P), iso([x0 + 1.4, C.FY, z0], P), iso([x0 + 1.4, C.FY, z0 + h], P), iso([x0, C.FY, z0 + h], P)], true);
    }
    bars.setAttribute('d', bd);
    const lit = [t > 3.8 && t < 6.6, t > 5.5 && t < 7.6, t > 7.3 && t < 9.4];
    ['in', 'chk', 'rec'].forEach((n, i) => led(n).setAttribute('opacity', lit[i] ? '1' : '0.25'));
    led('led').setAttribute('opacity', lamp ? '1' : '0.25');
    const now = Math.min(3, Math.floor(t / C.BEAT));
    if (now !== on) {
      on = now;
      pins.forEach((pin, i) => { pin.toggleAttribute('data-on', i === on); pin.toggleAttribute('data-dim', i !== on); });
      cards.forEach((card) => card.toggleAttribute('data-on', card.dataset.step === IDS[on]));
      if (readout) readout.textContent = SAY[on];
    }
  }
  playFigure(stage, draw, { loop: C.LOOP, stillAt: 4.3, seek: { ask: 0.4, gate: 3.1, run: 5.8, back: 8.55 } });
}
