// Fig 7: the path of one H0x-ADE call (Anatomy kit, MIT; see ./kit/LICENSE).
//
// A call capsule rides a rail left to right through four numbered stations:
// 1 a press compacts the capsule, 2 a glass window shows the call (a tap line
// runs to a recorder), 3 a gate arm holds the capsule until the call is
// checked (a key cabinet stands beside it), 4 a printer drops a slip into a
// ledger rack. The same four stations are the page's four numbered cards.
// With reduced motion the capsule rests at the gate, arm down.
//
// Run: node scripts/figures/ade-path.mjs
import { k, tools, basePlate, pinsHtml, playFigure, writeFigure } from './lib.mjs';

const WIDTH = 760;
const HEIGHT = 380;

const PLATE = { x: -168, y: -56, w: 330, d: 112, r: 8 };
const RAIL = { x: -152, y: -9, w: 268, d: 18, r: 3 };
const RZ = 6;
const X = [-98, -38, 22, 82];
const RACK = { x: 118, y: -11, w: 28, d: 22, h: 14 };
const REC = { x: X[1] - 12, y: -46, w: 24, d: 14, h: 12 };
const CAB = { x: X[2] - 9, y: 20, w: 18, d: 12, h: 26 };
const START_X = -142;
const GATE_STOP = X[2] - 10;

const P = k.fitProjection(
  [...k.boxCorners(PLATE, -17, 0), [X[0], 0, 44], [X[3], 0, 44], [RACK.x + RACK.w, 0, 14]],
  WIDTH,
  HEIGHT,
  { pad: 14, azimuth: 56 },
);
const { at, S, L, D, col, box, path } = tools(P);

// ---- live builders (pure; embedded with toString()) ----------------------

function capsuleSvg(K, P, len) {
  const r = 4.5;
  return K.solidSvg(K.slabOf({ x: -len / 2, y: -r, w: len, d: r * 2, r }, 0, 6, P, 5, 0.4), { tone: 'hi', crease: 'lo' }) + K.lineSvg(K.pathOf([K.iso([-len / 2 + 4, 0, 6], P), K.iso([len / 2 - 4, 0, 6], P)]), { tone: 'mid' });
}
function slipSvg(K, P) {
  return K.solidSvg(K.slabOf({ x: -3, y: -4, w: 6, d: 8, r: 0.4 }, 0, 0.6, P, 2), { tone: 'hi', crease: 'none', flat: true });
}

// ---- static parts ---------------------------------------------------------

const post = (x, y, z1) => col(x, y, 2.6, 0, z1, { tone: 'mid', crease: 'none' }, 14);

function rail() {
  const out = [box(RAIL, 0, RZ, { tone: 'mid' }, 4, 0.5)];
  out.push(L(k.sideSeam(RAIL, 2.4, P, 3), { tone: 'lo' }));
  out.push(L(k.lineOnTop([RAIL.x + 8, 0], [RAIL.x + RAIL.w - 8, 0], RZ, P), { tone: 'lo', flow: true }));
  out.push(D([-130, -50, 30, 100].map(x => at([x, RAIL.y + RAIL.d, 3.4])), { size: 0.4 }));
  return out.join('');
}

function recorder() {
  const plan = { x: REC.x, y: REC.y, w: REC.w, d: REC.d, r: 2 };
  const [lx, ly] = at([REC.x + REC.w - 5, REC.y + REC.d, REC.h + 0.6]);
  return [
    box(plan, 0, REC.h, { tone: 'mid' }, 3, 0.5),
    L(k.sideSeam(plan, 4, P, 3), { tone: 'lo' }),
    S(k.slabOf({ x: REC.x + 4, y: REC.y + 3, w: 12, d: 8, r: 0.8 }, REC.h, 0.4, P, 2), { tone: 'lo', crease: 'none', flat: true }),
    L(k.lineOnTop([REC.x + 6, REC.y + 7], [REC.x + 14, REC.y + 7], REC.h + 0.4, P), { tone: 'hi', free: true }),
    `<circle class="fig-led" data-led="rec" cx="${lx.toFixed(1)}" cy="${ly.toFixed(1)}" r="1.8" opacity="0.25"/>`,
  ].join('');
}

const pressBack = () => post(X[0], -13, 34);
function pressFront() {
  return [
    post(X[0], 13, 34),
    box({ x: X[0] - 9, y: -17, w: 18, d: 34, r: 2 }, 34, 40, { tone: 'mid' }, 3, 0.5),
    D([at([X[0] + 9, 0, 37])], { size: 0.5, tone: 'hi' }),
    `<g data-part="plunger">${col(X[0], 0, 2.6, 21, 34, { tone: 'mid', crease: 'none' }, 14)}${box({ x: X[0] - 7, y: -7, w: 14, d: 14, r: 2 }, 16, 21, { tone: 'mid' }, 3, 0.4)}</g>`,
  ].join('');
}

const windowBack = () => post(X[1], -13, 30);
function windowFront() {
  const g = { x: X[1] - 1.2, y: -13, w: 2.4, d: 26, r: 0.6 };
  return [
    post(X[1], 13, 30),
    S(k.slabOf(g, RZ + 1, 22, P, 2, 0.3), { tone: 'lo', crease: 'faint', flat: true }),
    L(k.sideSeam(g, RZ + 12, P, 2), { tone: 'faint' }),
    k.wireSvg(at([X[1], -13, 29]), at([REC.x + 6, REC.y + REC.d, REC.h - 3]), { via: [at([X[1], -30, 29])], tone: 'lo', flow: true }),
  ].join('');
}

const gateBack = () => post(X[2], -13, 36);
function gateFront() {
  const [lx, ly] = at([CAB.x + CAB.w / 2, CAB.y + CAB.d, CAB.h + 0.6]);
  return [
    `<g data-part="arm">${box({ x: X[2] - 2, y: -14, w: 4, d: 25, r: 1.5 }, 14, 18, { tone: 'mid' }, 2, 0.4)}${D([at([X[2] + 2, 9, 16])], { size: 0.45, tone: 'hi' })}</g>`,
    post(X[2], 13, 36),
    box({ x: CAB.x, y: CAB.y, w: CAB.w, d: CAB.d, r: 1.5 }, 0, CAB.h, { tone: 'mid' }, 3, 0.5),
    L(path([[CAB.x + 3, CAB.y + CAB.d, 4], [CAB.x + CAB.w - 3, CAB.y + CAB.d, 4], [CAB.x + CAB.w - 3, CAB.y + CAB.d, CAB.h - 4], [CAB.x + 3, CAB.y + CAB.d, CAB.h - 4]], true), { tone: 'lo', free: true }),
    D([at([CAB.x + CAB.w - 6, CAB.y + CAB.d, CAB.h / 2])], { size: 0.7, tone: 'hi' }),
    `<circle class="fig-led" data-led="key" cx="${lx.toFixed(1)}" cy="${ly.toFixed(1)}" r="1.8" opacity="0.25"/>`,
  ].join('');
}

const printerBack = () => post(X[3], -13, 26);
function printerFront() {
  const head = { x: X[3] - 11, y: -16, w: 22, d: 32, r: 2 };
  return [
    post(X[3], 13, 26),
    box(head, 26, 40, { tone: 'mid' }, 3, 0.5),
    L(k.sideSeam(head, 30, P, 3), { tone: 'lo' }),
    S(k.slabOf({ x: X[3] + 11, y: -6, w: 1.6, d: 12, r: 0.4 }, 29, 1.4, P, 2), { tone: 'lo', crease: 'none', flat: true }),
    D([at([X[3] + 11, -10, 35]), at([X[3] + 11, -13, 35])], { size: 0.55, tone: 'hi' }),
  ].join('');
}

function rack() {
  const plan = { x: RACK.x, y: RACK.y, w: RACK.w, d: RACK.d, r: 2 };
  const slots = [0.25, 0.5, 0.75].map(s => L(k.lineOnTop([RACK.x + 4, RACK.y + RACK.d * s], [RACK.x + RACK.w - 4, RACK.y + RACK.d * s], RACK.h, P), { tone: 'lo', free: true }));
  return [box(plan, 0, RACK.h, { tone: 'mid' }, 3, 0.5), L(k.sideSeam(plan, 4, P, 3), { tone: 'lo' }), ...slots].join('');
}

// ---- paint back to front (x grows toward the viewer) ----------------------

const body = [
  basePlate(P, PLATE, { label: { x: -160, y: -50, w: 30, d: 14, r: 1.5 } }),
  recorder(),
  pressBack() + windowBack() + gateBack() + printerBack(),
  rail(),
  `<g data-part="capsule"></g>`,
  pressFront(),
  windowFront(),
  gateFront(),
  printerFront(),
  rack(),
  `<g data-part="slip"></g>`,
];

const svg = k.figureSvg({
  width: WIDTH,
  height: HEIGHT,
  label:
    'A call capsule rides a rail from left to right through four numbered stations. At station 1 a press compacts the capsule. At station 2 a glass window shows the call, with a tap line to a recorder. At station 3 a gate arm holds the capsule until the call is checked against the rules, and a key cabinet beside it holds the key, so the agent never does. At station 4 a printer drops a receipt slip into a ledger rack.',
  body,
});

const pins = pinsHtml(P, WIDTH, HEIGHT, [
  { id: 's1', n: 1, at: [X[0], 0, 40], icon: 'arrows-in-line-horizontal', title: 'Context compactor', sub: 'Trims the call before the model reads it', lift: 4, expand: true, seek: 's1' },
  { id: 's2', n: 2, at: [X[1], 0, 29], icon: 'eye', title: 'Trace', sub: 'Records each call as it runs', lift: 24, expand: true, seek: 's2' },
  { id: 's3', n: 3, at: [X[2], 0, 36], icon: 'lock-key', title: 'Gate', sub: 'Checks the call before the agent acts', lift: 4, expand: true, seek: 's3' },
  { id: 's4', n: 4, at: [X[3], 0, 40], icon: 'receipt', title: 'Receipt', sub: 'Written to the chain', lift: 24, expand: true, seek: 's4' },
]);

const live = `
${capsuleSvg.toString()}
${slipSvg.toString()}
${playFigure.toString()}
const P = ${JSON.stringify(P)};
const C = ${JSON.stringify({ X, START_X, GATE_STOP, RZ, RACK: { x: RACK.x + RACK.w / 2, h: RACK.h } })};
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
`;

const plate = k.plateHtml({
  title: 'The path of one H0x-ADE call',
  hint: 'Four stations, left to right',
  readout: 'a call enters the path',
  body: `<div class="iso-stage" data-figure="ade-path">${svg}${pins}</div>`,
});

writeFigure('ade-path', { plate, live, title: 'H0x-ADE path' });
