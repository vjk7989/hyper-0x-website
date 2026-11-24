// Fig 12: the group bench (Anatomy kit, MIT; see ./kit/LICENSE).
//
// One block line on one bench. The long bench and its rail carry every block
// (Hyper 0x, the chain). A housing at the head end builds each block and sets
// it on the rail; a flywheel indexes the line (Buckleson). A gauge head on a
// portal over the rail lowers its probe onto each block and reads it on a dial
// (PAVii, the checks). The line steps, the probe dips and reads, the line steps
// again. With reduced motion the line rests with the probe down and the needle
// near the end of its sweep.
//
// Run: node scripts/figures/group-bench.mjs
import { k, tools, basePlate, pinsHtml, playFigure, writeFigure } from './lib.mjs';

const WIDTH = 700;
const HEIGHT = 310;

const PLATE = { x: -152, y: -44, w: 304, d: 90, r: 8 };
const BED = { x: -100, y: -14, w: 240, d: 28, r: 2 };
const HOUSE = { x: -148, y: -30, w: 48, d: 60, r: 3 };
const WHEEL = [-124, 30, 16, 10];
const PX = 55;
const BZ = 5;
const STEP = 56;

const P = k.fitProjection([...k.boxCorners(PLATE, -17, 0), [-124, 0, 42], [PX, 0, 58]], WIDTH, HEIGHT, { pad: 12, azimuth: 52, elevation: 32 });
const { at, L, D, col, box, path, faceCircle } = tools(P);

// ---- static parts ---------------------------------------------------------

function bed() {
  const t = k.topTicks(-92, 132, 8, 4, BED.y + BED.d, BZ, [1.6, 3], P);
  return [
    box(BED, 0, BZ, { tone: 'mid' }, 2, 0.5),
    L(k.lineOnTop([BED.x + 6, 0], [BED.x + BED.w - 6, 0], BZ, P), { tone: 'faint', flow: true }),
    L(t.minor, { tone: 'lo' }),
    L(t.major, { tone: 'mid' }),
  ].join('');
}

function house() {
  const [lx, ly] = at([-112, 18, 30]);
  return [
    box(HOUSE, 0, 30, { tone: 'mid' }, 2, 0.6),
    L(k.sideSeam(HOUSE, 20, P, 3), { tone: 'lo' }),
    col(-136, -18, 6, 30, 40, { tone: 'hi', crease: 'faint' }, 14),
    L(path([[-100, -8, 6], [-100, 8, 6], [-100, 8, 14], [-100, -8, 14]], true), { tone: 'lo' }),
    L(faceCircle([WHEEL[0], WHEEL[1], WHEEL[2]], WHEEL[3], 'y', 24) + faceCircle([WHEEL[0], WHEEL[1], WHEEL[2]], 3, 'y', 12), { tone: 'mid' }),
    `<path class="iso-line" data-tone="hi" data-part="spoke" d=""/>`,
    `<circle class="fig-led" data-led="on" cx="${lx.toFixed(1)}" cy="${ly.toFixed(1)}" r="1.8" opacity="0.25"/>`,
  ].join('');
}

const post = y => box({ x: PX - 5, y, w: 10, d: 8, r: 1 }, 0, 28, { tone: 'mid' }, 2, 0.4);

function head() {
  const [lx, ly] = at([PX, 0, 56]);
  return [
    box({ x: PX - 7, y: -26, w: 14, d: 52, r: 1 }, 28, 38, { tone: 'mid' }, 2, 0.4),
    box({ x: PX - 9, y: -10, w: 18, d: 20, r: 3 }, 38, 56, { tone: 'hi' }, 2, 0.6),
    L(faceCircle([PX + 9, 0, 47], 7, 'x', 22), { tone: 'mid' }),
    D([-5, -2.5, 0, 2.5, 5].map(a => at([PX + 9, a, 53.5 - Math.abs(a) * 0.5])), { size: 0.4, tone: 'mid' }),
    `<path class="iso-line" data-tone="hi" data-part="needle" d=""/>`,
    `<circle class="fig-led" data-led="read" cx="${lx.toFixed(1)}" cy="${ly.toFixed(1)}" r="1.8" opacity="0.25"/>`,
  ].join('');
}

// ---- paint back to front --------------------------------------------------

const body = [
  basePlate(P, PLATE, { lean: true, label: { x: 96, y: 30, w: 36, d: 11, r: 1.5 } }),
  bed(),
  house(),
  post(-26),
  `<g data-part="blocks"></g>`,
  `<g data-part="probe"></g>`,
  post(18),
  head(),
];

const svg = k.figureSvg({
  width: WIDTH,
  height: HEIGHT,
  label:
    'A bench-mounted block line seen from above and to one side. A long bench carries a rail of blocks. A housing at one end builds each block and sets it on the rail. A gauge head on a portal over the rail lowers a probe onto each block and reads it on a dial. The bench is Hyper 0x, the blockchain. The housing is Buckleson, which builds and operates it. The gauge head is PAVii, the AI layer that performs the checks.',
  body,
});

const pins = pinsHtml(P, WIDTH, HEIGHT, [
  { id: 'chain', n: 1, at: [-14, 14, BZ], icon: 'link', title: 'Hyper 0x', sub: 'The blockchain', lift: 10, side: 'down', expand: true, seek: 'chain' },
  { id: 'build', n: 2, at: [-124, 0, 30], icon: 'hammer', title: 'Buckleson', sub: 'Builds and operates it', lift: 10, side: 'down', expand: true, seek: 'build' },
  { id: 'check', n: 3, at: [PX + 9, 0, 47], icon: 'gauge', title: 'PAVii', sub: 'The AI layer that performs the checks', lift: 22, expand: true, seek: 'check' },
]);

// ---- live -----------------------------------------------------------------

const live = `
${playFigure.toString()}
const P = ${JSON.stringify(P)};
const C = ${JSON.stringify({ PX, BZ, STEP, WHEEL })};
const lerp = (a, b, s) => a + (b - a) * s;
const sat = (v, a, b) => Math.min(1, Math.max(0, (v - a) / (b - a)));
const ease = (s) => s * s * (3 - 2 * s);
const LOOP = 3.6;
for (const stage of document.querySelectorAll('[data-figure="group-bench"]')) {
  const svg = stage.querySelector('svg');
  const q = (name) => svg.querySelector('[data-part="' + name + '"]');
  const blocks = q('blocks'), probe = q('probe'), spoke = q('spoke'), needle = q('needle');
  const led = (name) => svg.querySelector('[data-led="' + name + '"]');
  const readout = stage.closest('.iso-figure').querySelector('[data-readout]');
  const pins = [...stage.querySelectorAll('[data-pin]')];
  const SAY = ['Hyper 0x is the blockchain', 'Buckleson builds and operates it', 'PAVii performs the checks'];
  const one = '<g>' + solidSvg(slabOf({ x: -11, y: -8, w: 22, d: 16, r: 2 }, C.BZ, 11, P, 2, 0.4), { tone: 'hi' }) + lineSvg(lineOnTop([-6, 0], [6, 0], C.BZ + 11, P), { tone: 'mid' }) + '</g>';
  blocks.innerHTML = one.repeat(6);
  const cell = [...blocks.children];
  probe.innerHTML = solidSvg(slabOf({ x: C.PX - 1.5, y: -1.5, w: 3, d: 3, r: 0.5 }, 21, 7, P, 2), { tone: 'hi', crease: 'none' });
  let on = -1;
  function draw(t) {
    const adv = ease(sat(t, 0, 1.2));
    cell.forEach((el, i) => {
      const c = -169 + C.STEP * i + C.STEP * adv;
      el.setAttribute('transform', translateAlong(P, [c, 0, 0]));
      el.setAttribute('opacity', String(Math.min(sat(c, -108, -80), 1 - sat(c, 116, 136))));
    });
    probe.setAttribute('transform', translateAlong(P, [0, 0, -4 * ease(sat(t, 1.5, 1.9)) * (1 - ease(sat(t, 2.5, 2.9)))]));
    const w = adv * 6.283;
    spoke.setAttribute('d', pathOf([iso([C.WHEEL[0], C.WHEEL[1], C.WHEEL[2]], P), iso([C.WHEEL[0] + C.WHEEL[3] * Math.cos(w), C.WHEEL[1], C.WHEEL[2] + C.WHEEL[3] * Math.sin(w)], P)]));
    const a = lerp(2.4, 0.7, ease(sat(t, 1.6, 2.4)) * (1 - ease(sat(t, 3, 3.5))));
    needle.setAttribute('d', pathOf([iso([C.PX + 9, 0, 47], P), iso([C.PX + 9, -6 * Math.cos(a), 47 + 6 * Math.sin(a)], P)]));
    led('on').setAttribute('opacity', t < 1.3 ? '1' : '0.25');
    led('read').setAttribute('opacity', t > 1.5 && t < 2.8 ? '1' : '0.25');
    const now = t < 1.4 ? 1 : t < 2.9 ? 2 : 0;
    if (now !== on) {
      on = now;
      pins.forEach((pin, i) => { pin.toggleAttribute('data-on', i === now); pin.toggleAttribute('data-dim', i !== now); });
      if (readout) readout.textContent = SAY[now];
    }
  }
  playFigure(stage, draw, { loop: LOOP, stillAt: 2.2, seek: { chain: 3.1, build: 0.4, check: 2 } });
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) pins.forEach((pin) => pin.removeAttribute('data-dim'));
}
`;

const plate = k.plateHtml({
  title: 'One system, three names',
  hint: 'Bench, housing and gauge head',
  readout: 'PAVii performs the checks',
  body: `<div class="iso-stage" data-figure="group-bench">${svg}${pins}</div>`,
});

writeFigure('group-bench', { plate, live, title: 'Group bench' });
