// Fig 10: the feedback wheel (Anatomy kit, MIT; see ./kit/LICENSE).
//
// A band-saw style blade loop lying flat on a table, teeth standing up along
// it. A press foot works the band; a flat grinding wheel above the band
// hones the teeth as they pass under it, so the edge that comes round to the
// work again is the one the last pass made. Tooth height is the edge: tall
// after the wheel, worn after the foot. With reduced motion the band rests
// with the wheel and foot both over teeth.
//
// Run: node scripts/figures/feedback-wheel.mjs
import { k, tools, basePlate, pinsHtml, playFigure, writeFigure } from './lib.mjs';

const WIDTH = 700;
const HEIGHT = 340;

const PLATE = { x: -98, y: -50, w: 196, d: 100, r: 8 };
const TABLE = { x: -76, y: -16, w: 152, d: 32, r: 16 };
const R = 13;
const BZ = 10;
const HONE = [-20, -R];
const WORK = [35, R];

const P = k.fitProjection([...k.boxCorners(PLATE, -17, 0), [HONE[0], -34, 30], [WORK[0], 34, 30]], WIDTH, HEIGHT, { pad: 8, azimuth: 40, elevation: 32 });
const { at, S, L, D, col, box } = tools(P);

// ---- static parts ---------------------------------------------------------

function table() {
  return [
    S(k.slabOf(TABLE, 0, BZ, P, 8, 0.8), { tone: 'mid' }),
    L(k.planOutline(k.insetPlan(TABLE, 5), BZ, P), { tone: 'lo' }),
    ...[-60, 60].map(x => [col(x, 0, 11, BZ, BZ + 3, { tone: 'hi', crease: 'faint' }, 20), L(k.ring(x, 0, 6, BZ + 3, P, 16), { tone: 'lo' }), D([at([x, 0, BZ + 3])], { size: 0.9, tone: 'hi' })].join('')),
  ].join('');
}

const honeStand = () => [
  col(HONE[0], -36, 3.2, 0, 26, { tone: 'mid', crease: 'none' }, 12),
  box({ x: HONE[0] - 3, y: -39, w: 6, d: 29, r: 1.5 }, 22, 27, { tone: 'mid' }, 2, 0.4),
].join('');

const wheel = () => [
  col(HONE[0], HONE[1], 1.6, 20, 22.4, { tone: 'mid', crease: 'none' }, 8),
  col(HONE[0], HONE[1], 9, 16.5, 20, { tone: 'hi', crease: 'faint' }, 24),
  L(k.ring(HONE[0], HONE[1], 5.5, 20, P, 16), { tone: 'lo' }),
  `<g data-part="wheel"></g>`,
].join('');

const workStand = () => [
  `<g data-part="foot">${col(WORK[0], WORK[1], 1.8, 22, 27.5, { tone: 'mid', crease: 'none' }, 8)}${box({ x: WORK[0] - 6, y: WORK[1] - 5, w: 12, d: 10, r: 1.5 }, 16.5, 22, { tone: 'hi' }, 2, 0.4)}</g>`,
  box({ x: WORK[0] - 3, y: WORK[1], w: 6, d: 29, r: 1.5 }, 24, 29, { tone: 'mid' }, 2, 0.4),
  col(WORK[0], 36, 3.2, 0, 29, { tone: 'mid', crease: 'none' }, 12),
].join('');

// ---- paint back to front --------------------------------------------------

const body = [
  basePlate(P, PLATE, { lean: true, label: { x: -90, y: -45, w: 28, d: 11, r: 1.5 } }),
  honeStand(),
  table(),
  `<g data-part="teeth"></g>`,
  wheel(),
  workStand(),
];

const svg = k.figureSvg({
  width: WIDTH,
  height: HEIGHT,
  label:
    'A saw band loops flat around two pulleys on a table, with teeth standing up along it. A press foot works the band on the front side. A flat grinding wheel above the back side hones the teeth as they pass under it, so the teeth come back to the foot sharp again. Tooth height shows the edge: tall after the wheel, worn after the foot.',
  body,
});

const pins = pinsHtml(P, WIDTH, HEIGHT, [
  { id: 'work', n: 1, at: [WORK[0], WORK[1], 28], icon: 'hammer', title: 'Work', sub: 'Each run uses the edge it has', lift: 26, expand: true, seek: 'work', side: 'down' },
  { id: 'hone', n: 2, at: [HONE[0], -36, 27], icon: 'knife', title: 'Hone', sub: 'Results sharpen the next run', lift: 14, expand: true, seek: 'hone' },
  { id: 'loop', n: 3, at: [60, 0, BZ + 3], icon: 'arrows-clockwise', title: 'Loop', sub: 'The edge comes round again', lift: 14, expand: true, seek: 'loop', side: 'right' },
]);

// ---- live -----------------------------------------------------------------

const live = `
${playFigure.toString()}
const P = ${JSON.stringify(P)};
const C = ${JSON.stringify({ R, BZ, HONE, WORK })};
const LOOP = 8, N = 32, ARC = Math.PI * C.R, LEN = 240 + 2 * ARC, STEP = LEN / N;
const sat = (v, a, b) => Math.min(1, Math.max(0, (v - a) / (b - a)));
const mod = (v, m) => ((v % m) + m) % m;
// arclength u -> point on the band centre line
function onBand(u) {
  u = mod(u, LEN);
  if (u < 120) return [-60 + u, C.R];
  if (u < 120 + ARC) { const f = (u - 120) / C.R; return [60 + C.R * Math.sin(f), C.R * Math.cos(f)]; }
  if (u < 240 + ARC) return [60 - (u - 120 - ARC), -C.R];
  const f = (u - 240 - ARC) / C.R;
  return [-60 - C.R * Math.sin(f), -C.R * Math.cos(f)];
}
const UH = 240 + ARC + (60 - C.HONE[0]), UW = C.WORK[0] + 60;
const DW = mod(UW - UH, LEN);
// edge of the tooth at distance d past the start of the wheel: sharpened under the wheel, worn under the foot
function edge(d) {
  d = mod(d + 8, LEN);
  if (d < 16) return 0.3 + 0.7 * (d / 16);
  if (d < DW) return 1;
  return d < DW + 24 ? 1 - 0.7 * ((d - DW) / 24) : 0.3;
}
for (const stage of document.querySelectorAll('[data-figure="feedback-wheel"]')) {
  const svg = stage.querySelector('svg');
  const q = (name) => svg.querySelector('[data-part="' + name + '"]');
  const teeth = q('teeth'), wheel = q('wheel'), foot = q('foot');
  const readout = stage.closest('.iso-figure').querySelector('[data-readout]');
  const pins = [...stage.querySelectorAll('[data-pin]')];
  const SAY = ['worn: each run uses the edge it has', 'honed: the results sharpen the next run', 'the edge comes round again'];
  wheel.innerHTML = '<path class="iso-line" data-tone="hi" d=""/><g></g>';
  const spoke = wheel.firstChild, sparks = wheel.lastChild;
  let on = -1;
  function draw(t) {
    const shift = (t / LOOP) * 8 * STEP;
    let d = '';
    for (let i = 0; i < N; i++) {
      const u = i * STEP + shift;
      const [x, y] = onBand(u);
      d += rise([x, y], C.BZ, C.BZ + 1 + 7 * edge(mod(u - UH, LEN)), P);
    }
    teeth.innerHTML = lineSvg(d, { tone: 'hi' });
    const a = t * 2.2;
    spoke.setAttribute('d', pathOf([iso([C.HONE[0], C.HONE[1], 20], P), iso([C.HONE[0] + 9 * Math.cos(a), C.HONE[1] + 9 * Math.sin(a), 20], P)]));
    const f = Math.floor(t * 6) % 3;
    sparks.innerHTML = dotsSvg([0, 1, 2].map((i) => iso([C.HONE[0] + 11 + ((i + f) % 3) * 2.5, C.HONE[1] + 4 - i * 4, 15 - ((i + f) % 3) * 1.4], P)), { size: 0.7, tone: 'hi' });
    foot.setAttribute('transform', translateAlong(P, [0, 0, -3 * Math.pow(Math.sin(Math.PI * mod(t / 2, 1)), 4)]));
    const now = Math.floor(t / (LOOP / 3)) % 3;
    if (now !== on) {
      on = now;
      pins.forEach((pin, i) => { pin.toggleAttribute('data-on', i === now); pin.toggleAttribute('data-dim', i !== now); });
      if (readout) readout.textContent = SAY[now];
    }
  }
  playFigure(stage, draw, { loop: LOOP, stillAt: 3, seek: { work: 0.3, hone: 3, loop: 5.5 } });
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) pins.forEach((pin) => pin.removeAttribute('data-dim'));
}
`;

const plate = k.plateHtml({
  title: 'The feedback wheel',
  hint: 'What a run teaches, the next run uses',
  readout: 'worn: each run uses the edge it has',
  body: `<div class="iso-stage" data-figure="feedback-wheel">${svg}${pins}</div>`,
});

writeFigure('feedback-wheel', { plate, live, title: 'Feedback wheel' });
