// Fig 9: the trace recorder (Anatomy kit, MIT; see ./kit/LICENSE).
//
// A chart recorder. Paper unrolls from the housing at a steady pace under
// three pens on one bridge; each pen draws its own lane, so the paper becomes
// a record you can read back: a smooth trace, a log of events and a stepped
// evaluation. Sprocket dots and cross ticks scroll with the paper. With
// reduced motion the paper rests with all three lanes drawn.
//
// Run: node scripts/figures/trace-recorder.mjs
import { k, tools, basePlate, pinsHtml, playFigure, writeFigure } from './lib.mjs';

const WIDTH = 700;
const HEIGHT = 310;

const PLATE = { x: -152, y: -42, w: 300, d: 88, r: 8 };
const HOUSE = { x: -140, y: -34, w: 50, d: 68, r: 3 };
const PLATEN = { x: -92, y: -32, w: 196, d: 64, r: 2 };
const TRAY = { x: 106, y: -30, w: 34, d: 60, r: 2 };
const PEN_X = -50;
const LANES = [-16, 0, 16];
const PZ = 6.2;
const REEL = [-115, 0];

const P = k.fitProjection([...k.boxCorners(PLATE, -17, 0), [HOUSE.x, 0, 38], [PEN_X, 0, 34]], WIDTH, HEIGHT, { pad: 12, azimuth: 58, elevation: 32 });
const { at, S, L, D, col, box } = tools(P);

// ---- static parts ---------------------------------------------------------

function house() {
  const [lx, ly] = at([HOUSE.x + 12, 30, 28.6]);
  return [
    box(HOUSE, 0, 28, { tone: 'mid' }, 2, 0.6),
    L(k.sideSeam(HOUSE, 20, P, 2), { tone: 'lo' }),
    col(REEL[0], REEL[1], 16, 28, 34, { tone: 'hi', crease: 'faint' }, 20),
    L(k.ring(REEL[0], REEL[1], 11, 34, P, 24), { tone: 'lo' }),
    `<g data-part="reel"></g>`,
    D([at([HOUSE.x + 14, HOUSE.y + HOUSE.d, 10]), at([HOUSE.x + 24, HOUSE.y + HOUSE.d, 10]), at([HOUSE.x + 34, HOUSE.y + HOUSE.d, 10])], { size: 1.1, tone: 'hi' }),
    `<circle class="fig-led" data-led="rec" cx="${lx.toFixed(1)}" cy="${ly.toFixed(1)}" r="1.8" opacity="0.25"/>`,
  ].join('');
}

function platen() {
  const t = k.topTicks(-86, 98, 6, 5, PLATEN.y + PLATEN.d, 5, [1.6, 3], P);
  return [
    box(PLATEN, 0, 5, { tone: 'mid' }, 2, 0.5),
    L(t.minor, { tone: 'lo' }),
    L(t.major, { tone: 'mid' }),
    D([-86, 98].map(x => at([x, PLATEN.y + PLATEN.d - 3, 5])), { size: 0.45 }),
    box({ x: -92, y: -26, w: 194, d: 52, r: 1 }, 5, PZ, { tone: 'hi', crease: 'none' }, 2, 0.2),
    ...[-8, 8].map(y => L(k.lineOnTop([-90, y], [100, y], PZ, P), { tone: 'faint' })),
    `<g data-part="grid"></g>`,
    box({ x: 100, y: -30, w: 5, d: 60, r: 1 }, 5, 10, { tone: 'mid' }, 2, 0.4),
  ].join('');
}

const post = y => col(PEN_X, y, 2.6, 5, 32, { tone: 'mid', crease: 'none' }, 10);
const beam = () => [
  box({ x: PEN_X - 3, y: -37, w: 6, d: 74, r: 1.5 }, 26, 32, { tone: 'mid' }, 2, 0.5),
  L(k.lineOnTop([PEN_X, -33], [PEN_X, 33], 32, P), { tone: 'lo', free: true }),
  D([-30, 30].map(y => at([PEN_X, y, 32])), { size: 0.5, tone: 'hi' }),
].join('');

const pen = y => `<g data-part="pen">${box({ x: PEN_X - 2.5, y: y - 2.5, w: 5, d: 5, r: 1 }, 14, 26, { tone: 'hi' }, 2, 0.4)}${box({ x: PEN_X - 0.6, y: y - 0.6, w: 1.2, d: 1.2, r: 0.3 }, PZ, 14, { tone: 'mid', crease: 'none' }, 2, 0)}</g>`;

function tray() {
  return [
    box(TRAY, 0, 7, { tone: 'mid' }, 2, 0.5),
    L(k.planOutline(k.insetPlan(TRAY, 3), 7, P, 2), { tone: 'lo' }),
  ].join('');
}

// ---- paint back to front --------------------------------------------------

const body = [
  basePlate(P, PLATE, { lean: true, label: { x: -144, y: -37, w: 28, d: 11, r: 1.5 } }),
  house(),
  platen(),
  tray(),
  post(-34),
  beam(),
  `<g data-part="trace"></g>`,
  ...LANES.map(pen),
  post(34),
];

const svg = k.figureSvg({
  width: WIDTH,
  height: HEIGHT,
  label:
    'A chart recorder. Paper unrolls from a housing with a paper reel on top and passes under a bridge carrying three pens. Each pen draws its own lane on the moving paper: a smooth trace, a log of events as spikes, and a stepped line for evaluations. The paper keeps the record, so it can be read back.',
  body,
});

const pins = pinsHtml(P, WIDTH, HEIGHT, [
  { id: 'trace', n: 1, at: [20, LANES[0], PZ], icon: 'pulse', title: 'Traces', sub: 'What each call did, in order', lift: 44, expand: true, seek: 'trace' },
  { id: 'log', n: 2, at: [40, LANES[1], PZ], icon: 'receipt', title: 'Logs', sub: 'What was sent and what came back', lift: 10, expand: true, seek: 'log', side: 'down' },
  { id: 'eval', n: 3, at: [92, LANES[2], PZ], icon: 'list-checks', title: 'Evaluations', sub: 'Whether the result met the bar', lift: 52, expand: true, seek: 'eval', side: 'down' },
]);

// ---- live -----------------------------------------------------------------

const live = `
${playFigure.toString()}
const P = ${JSON.stringify(P)};
const C = ${JSON.stringify({ PEN_X, LANES, PZ, REEL })};
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
`;

const plate = k.plateHtml({
  title: 'The trace recorder',
  hint: 'Three pens, one record',
  readout: 'traces: what each call did',
  body: `<div class="iso-stage" data-figure="trace-recorder">${svg}${pins}</div>`,
});

writeFigure('trace-recorder', { plate, live, title: 'Trace recorder' });
