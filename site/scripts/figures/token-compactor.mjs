// Fig 8: the token compactor (Anatomy kit, MIT; see ./kit/LICENSE).
//
// A baling press. A loose bundle sits in the chamber against a die gate; the
// ram drives in and the bundle shrinks into a dense block, with the offcuts
// falling into the tray at the side. The die lifts, the ram pushes the block
// out onto the outfeed, and withdraws. With reduced motion the ram rests
// forward on the finished block, offcuts in the tray.
//
// Run: node scripts/figures/token-compactor.mjs
import { k, tools, basePlate, pinsHtml, playFigure, writeFigure } from './lib.mjs';

const WIDTH = 700;
const HEIGHT = 300;

const PLATE = { x: -156, y: -40, w: 308, d: 92, r: 8 };
const BED = { x: -104, y: -16, w: 204, d: 32, r: 2 };
const HOUSE = { x: -140, y: -19, w: 36, d: 38, r: 3 };
const TRAY = { x: -14, y: 22, w: 48, d: 20, r: 2 };
const WALL = { x: -34, w: 90 };
const DIE_X = 30;
const BZ = 5;
const HEAD_REST = -32;
const FLY = [HOUSE.x + 18, 0];

const P = k.fitProjection([...k.boxCorners(PLATE, -17, 0), [HOUSE.x, 0, 42], [100, 0, 30]], WIDTH, HEIGHT, { pad: 12, azimuth: 56, elevation: 33 });
const { at, S, L, D, col, box } = tools(P);

// ---- static parts ---------------------------------------------------------

function house() {
  const [lx, ly] = at([HOUSE.x + HOUSE.w, 8, 22]);
  return [
    box(HOUSE, 0, 34, { tone: 'mid' }, 2, 0.6),
    L(k.sideSeam(HOUSE, 24, P, 3), { tone: 'lo' }),
    L(k.sideSeam(HOUSE, 6, P, 3), { tone: 'lo' }),
    col(FLY[0], FLY[1], 10, 34, 38, { tone: 'hi', crease: 'faint' }, 28),
    L(k.ring(FLY[0], FLY[1], 6.4, 38, P, 20), { tone: 'lo' }),
    `<g data-part="wheel"></g>`,
    D([at([HOUSE.x + HOUSE.w, 12, 30]), at([HOUSE.x + HOUSE.w, -12, 30])], { size: 0.55, tone: 'hi' }),
    `<circle class="fig-led" data-led="on" cx="${lx.toFixed(1)}" cy="${ly.toFixed(1)}" r="1.8" opacity="0.25"/>`,
  ].join('');
}

function bed() {
  const out = [box(BED, 0, BZ, { tone: 'mid' }, 2, 0.5)];
  out.push(L(k.lineOnTop([BED.x + 8, 0], [BED.x + BED.w - 8, 0], BZ, P), { tone: 'faint', flow: true }));
  const t = k.topTicks(-90, 94, 6, 5, BED.y + BED.d, BZ, [1.6, 3], P);
  out.push(L(t.minor, { tone: 'lo' }), L(t.major, { tone: 'mid' }));
  out.push(D([-96, -60, 60, 94].map(x => at([x, BED.y + BED.d - 3, BZ])), { size: 0.45 }));
  return out.join('');
}

function tray() {
  return [
    box(TRAY, 0, 7, { tone: 'mid' }, 2, 0.5),
    S(k.slabOf(k.insetPlan(TRAY, 3), 6.6, 0.4, P, 3), { tone: 'lo', crease: 'none', flat: true }),
    L(k.lineOnTop([TRAY.x + 7, TRAY.y + 10], [TRAY.x + TRAY.w - 7, TRAY.y + 10], 7, P), { tone: 'faint', free: true }),
    D(k.corners(TRAY, 1.6).map(([x, y]) => at([x, y, 7])), { size: 0.4 }),
  ].join('');
}

const wallBack = () => [
  box({ x: WALL.x, y: -14, w: WALL.w, d: 4, r: 0.8 }, BZ, 22, { tone: 'mid' }, 2, 0.4),
  L(k.lineOnTop([WALL.x + 4, -12], [WALL.x + WALL.w - 4, -12], 22, P), { tone: 'lo', free: true }),
].join('');
const wallFront = () => [
  box({ x: WALL.x, y: 10, w: WALL.w, d: 4, r: 0.8 }, BZ, 15, { tone: 'mid' }, 2, 0.4),
  L(k.lineOnTop([WALL.x + 4, 12], [WALL.x + WALL.w - 4, 12], 15, P), { tone: 'lo', free: true }),
  D([0, 20, 40].map(x => at([x, 14, 10])), { size: 0.55, tone: 'hi' }),
  L(k.sideSeam({ x: WALL.x, y: 10, w: WALL.w, d: 4, r: 0.8 }, 10, P, 2), { tone: 'lo' }),
  // bridge over the throat holding the two walls apart
  box({ x: WALL.x, y: -14, w: 5, d: 28, r: 0.8 }, 22, 26, { tone: 'mid' }, 2, 0.4),
].join('');

const die = () => `<g data-part="die">${box({ x: DIE_X, y: -10, w: 3, d: 20, r: 0.6 }, BZ, 30, { tone: 'hi' }, 2, 0.4)}${D([at([DIE_X + 3, 6, 24])], { size: 0.5, tone: 'mid' })}</g>`;

const control = () => {
  const c = { x: 66, y: -36, w: 22, d: 12, r: 2 };
  return [box(c, 0, 14, { tone: 'mid' }, 2, 0.5), L(k.sideSeam(c, 9, P, 3), { tone: 'lo' }), D([at([c.x + 6, c.y + c.d, 7]), at([c.x + 14, c.y + c.d, 7])], { size: 0.8, tone: 'hi' })].join('');
};

// ---- paint back to front --------------------------------------------------

const body = [
  basePlate(P, PLATE, { lean: true, label: { x: -148, y: -35, w: 32, d: 12, r: 1.5 } }),
  bed(),
  control(),
  house(),
  `<g data-part="rod"></g>`,
  wallBack(),
  `<g data-part="bundle"></g>`,
  `<g data-part="head"></g>`,
  die(),
  tray(),
  wallFront(),
  `<g data-part="chips"></g>`,
];

const svg = k.figureSvg({
  width: WIDTH,
  height: HEIGHT,
  label:
    'A baling press drawn from above and to one side. A loose bundle sits in the chamber against a die gate. A ram drives in from the motor housing and the bundle shrinks into a dense block, while the offcuts fall into a tray beside the chamber. The die lifts, the ram pushes the block out onto the outfeed, and the ram withdraws.',
  body,
});

const pins = pinsHtml(P, WIDTH, HEIGHT, [
  { id: 'ram', n: 1, at: [-40, 0, 22], icon: 'arrows-in-line-horizontal', title: 'Press', sub: 'Compacts the loose context', lift: 26, expand: true, seek: 'press' },
  { id: 'cut', n: 2, at: [10, 32, 7], icon: 'funnel', title: 'Offcuts', sub: 'Left out of what the model reads', lift: 6, expand: true, seek: 'cut', side: 'down' },
  { id: 'out', n: 3, at: [76, 0, BZ], icon: 'stack', title: 'Block', sub: 'The model reads the dense block', lift: 26, expand: true, seek: 'out' },
]);

// ---- live -----------------------------------------------------------------

const live = `
${playFigure.toString()}
const P = ${JSON.stringify(P)};
const C = ${JSON.stringify({ HEAD_REST, DIE_X, BZ, HX: HOUSE.x + HOUSE.w, FLY })};
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
`;

const plate = k.plateHtml({
  title: 'The token compactor',
  hint: 'A loose bundle in, a dense block out',
  readout: 'a loose bundle in',
  body: `<div class="iso-stage" data-figure="token-compactor">${svg}${pins}</div>`,
});

writeFigure('token-compactor', { plate, live, title: 'Token compactor' });
