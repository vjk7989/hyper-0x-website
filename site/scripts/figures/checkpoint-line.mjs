// Fig 13: the checkpoint line (Anatomy kit, MIT; see ./kit/LICENSE).
//
// A conveyor with three gate frames over it. Mixed calls (cubes, posts, drums,
// flat plates, from any model) ride in from a hopper. Gate 1 trims each to the
// same small block (fewer tokens per call). Gate 2 reads each one; a flagged
// call is pushed off the belt into a reject tray by an arm. Gate 3 learns from
// the record. The checked blocks, now even and in order, reach a ledger stack
// at the end, which a lamp marks as written (the record on the chain).
// With reduced motion the line rests mid-refusal: one call in the tray.
//
// Run: node scripts/figures/checkpoint-line.mjs
import { k, tools, basePlate, pinsHtml, playFigure, writeFigure } from './lib.mjs';

const WIDTH = 720;
const HEIGHT = 380;

const PLATE = { x: -192, y: -60, w: 384, d: 120, r: 8 };
const BED = { x: -164, y: -12, w: 289, d: 24, r: 2 };
const BZ = 5;
const GATES = [-100, -20, 60];
const XR = -8; // where a refused call stops and is pushed
const BIN = { x: -22, y: 26, w: 30, d: 26, r: 2 };
const SP = 50;
const N = 6;
const V = 18;
const FROM = -170;
const REFUSED = [2, 5];

const P = k.fitProjection([...k.boxCorners(PLATE, -17, 0), ...GATES.map(x => [x, 0, 33]), [149, 0, 20], [-286, 0, 0], [268, 0, 0], [0, 130, -17]], WIDTH, HEIGHT, { pad: 10, headroom: 114, azimuth: 68, elevation: 30 });
const { at, L, D, box, path, faceCircle } = tools(P);

// ---- static parts ---------------------------------------------------------

function bed() {
  const t = k.topTicks(-160, 120, 8, 4, BED.y + BED.d, BZ, [1.6, 3], P);
  return [
    box(BED, 0, BZ, { tone: 'mid' }, 2, 0.5),
    L(k.lineOnTop([BED.x + 4, 0], [BED.x + BED.w - 4, 0], BZ, P), { tone: 'faint', flow: true }),
    L(t.minor, { tone: 'lo' }),
    L(t.major, { tone: 'mid' }),
  ].join('');
}

const hopper = () => [box({ x: -188, y: -20, w: 26, d: 40, r: 3 }, 0, 22, { tone: 'mid' }, 2, 0.6), L(path([[-162, -14, 5], [-162, 14, 5], [-162, 14, 15], [-162, -14, 15]], true), { tone: 'lo' })].join('');

const post = (x, y) => box({ x: x - 4, y, w: 8, d: 6, r: 1 }, 0, 32, { tone: 'mid' }, 2, 0.4);
const lintel = x => box({ x: x - 5, y: -22, w: 10, d: 44, r: 1 }, 24, 32, { tone: 'hi' }, 2, 0.4);
const sign = [
  x => L(path([[x - 3.5, 22, 28], [x - 1, 22, 28]]) + path([[x + 1, 22, 28], [x + 3.5, 22, 28]]) + path([[x - 3.5, 22, 25.8], [x - 1, 22, 28], [x - 3.5, 22, 30.2]]) + path([[x + 3.5, 22, 25.8], [x + 1, 22, 28], [x + 3.5, 22, 30.2]]), { tone: 'mid' }),
  x => L(faceCircle([x, 22, 28], 3, 'y', 14), { tone: 'mid' }) + D([at([x, 22, 28])], { size: 0.7, tone: 'hi' }),
  x => L(path([[x - 3, 22, 28], [x - 1, 22, 26], [x + 3, 22, 30.5]]), { tone: 'mid' }),
];

const gateBack = x => post(x, -22) + lintel(x);
const gateFront = (x, i) => post(x, 16) + sign[i](x);

function ledger() {
  const [lx, ly] = at([149, -6, 19]);
  return [
    box({ x: 128, y: -16, w: 42, d: 32, r: 2 }, 0, 6, { tone: 'mid' }, 2, 0.5),
    box({ x: 130, y: -14, w: 38, d: 28, r: 2 }, 6, 12, { tone: 'hi' }, 2, 0.5),
    box({ x: 133, y: -12, w: 32, d: 24, r: 2 }, 12, 18, { tone: 'hi' }, 2, 0.5),
    L(k.lineOnTop([138, 4], [160, 4], 18, P) + k.lineOnTop([138, -4], [154, -4], 18, P), { tone: 'lo' }),
    `<circle class="fig-led" data-led="rec" cx="${lx.toFixed(1)}" cy="${ly.toFixed(1)}" r="1.8" opacity="0.25"/>`,
  ].join('');
}

const bin = () => [box(BIN, 0, 4, { tone: 'lo' }, 2, 0.5), L(k.planOutline(k.insetPlan(BIN, 3), 4, P, 3), { tone: 'faint' })].join('');
const housing = () => box({ x: XR - 8, y: -30, w: 16, d: 12, r: 2 }, 0, 16, { tone: 'mid' }, 2, 0.5);

// ---- paint back to front --------------------------------------------------

const body = [
  basePlate(P, PLATE, { lean: true, label: { x: 134, y: 38, w: 40, d: 11, r: 1.5 } }),
  bed(),
  hopper(),
  bin(),
  housing(),
  ...GATES.map(gateBack),
  ledger(),
  `<g data-part="pusher"></g>`,
  `<g data-part="items"></g>`,
  ...GATES.map(gateFront),
];

const svg = k.figureSvg({
  width: WIDTH,
  height: HEIGHT,
  label:
    'A conveyor with three gate frames over it, seen from above and to one side. Mixed calls from any AI model ride in from a hopper at the left, in different shapes. The first gate trims each to the same small block, so each call uses fewer tokens. The second gate reads each one, and an arm pushes a flagged call off the belt into a reject tray. The third gate learns from what is recorded. The checked blocks leave in order and are added to a ledger at the end, which is the record on the chain.',
  body,
});

const pins = pinsHtml(P, WIDTH, HEIGHT, [
  { id: 'in', n: 1, at: [-150, 14, 5], icon: 'plugs-connected', title: 'Calls from any model', sub: 'Whatever you run', side: 'down', lift: 6, expand: true, seek: 'in' },
  { id: 'trim', n: 2, at: [GATES[0], 22, 32], icon: 'arrows-in-line-horizontal', title: 'Fewer tokens per call', sub: 'Each call is trimmed', lift: 14, expand: true, seek: 'trim' },
  { id: 'watch', n: 3, at: [GATES[1], 22, 32], icon: 'eye', title: 'Observability over every run', sub: 'Each call is traced', lift: 112, expand: true, seek: 'watch' },
  { id: 'learn', n: 4, at: [GATES[2], 22, 32], icon: 'trend-up', title: 'Agents that improve', sub: 'From what is recorded', lift: 14, expand: true, seek: 'learn' },
  { id: 'refuse', n: 5, at: [XR + 2, 40, 6], icon: 'prohibit', title: 'A call turned back', sub: 'Refused at a check', side: 'down', lift: 8, expand: true, seek: 'refuse' },
  { id: 'chain', n: 6, at: [149, 14, 18], icon: 'link', title: 'A record on the chain', sub: 'Each checked call', side: 'down', lift: 18, expand: true, seek: 'chain' },
]);

// ---- live -----------------------------------------------------------------

const live = `
${playFigure.toString()}
const P = ${JSON.stringify(P)};
const C = ${JSON.stringify({ GATES, XR, SP, N, V, FROM, REFUSED, BZ })};
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
`;

const plate = k.plateHtml({
  title: 'Between your agents and the world',
  hint: 'Calls in, checked calls out',
  readout: 'a flagged call is turned back',
  body: `<div class="iso-stage" data-figure="checkpoint-line">${svg}${pins}</div>`,
});

writeFigure('checkpoint-line', { plate, live, title: 'Checkpoint line' });
