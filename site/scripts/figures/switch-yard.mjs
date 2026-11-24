// Fig 11: the switch yard (Anatomy kit, MIT; see ./kit/LICENSE).
//
// A railway turntable. One incoming track ends at the pit; a bridge turns on
// its hub to line up with one of three outgoing roads, each ending in its own
// shed. A car rolls in, the bridge turns under it, and the car leaves down
// the road the bridge chose. Three calls in a loop, three different roads.
// With reduced motion the bridge rests aligned with the middle road, car on it.
//
// Run: node scripts/figures/switch-yard.mjs
import { k, tools, basePlate, pinsHtml, playFigure, writeFigure } from './lib.mjs';

const WIDTH = 640;
const HEIGHT = 340;

const PLATE = { x: -86, y: -86, w: 172, d: 172, r: 8 };
const IN = 225;
const ROADS = [-12, 45, 102];
const PIT = 29;
const END = 70;

const P = k.fitProjection([...k.boxCorners(PLATE, -17, 0), [0, 0, 30]], WIDTH, HEIGHT, { pad: 10, azimuth: 45, elevation: 33 });
const { at, S, L, D, col } = tools(P);

// A rectangle len long and wid wide, centred on (cx, cy), turned by ang.
function rect(cx, cy, len, wid, ang) {
  const c = Math.cos(ang);
  const s = Math.sin(ang);
  return [[-len / 2, -wid / 2], [len / 2, -wid / 2], [len / 2, wid / 2], [-len / 2, wid / 2]].map(([u, v]) => [cx + u * c - v * s, cy + u * s + v * c]);
}

// ---- static parts ---------------------------------------------------------

function road(deg, shed) {
  const a = (deg * Math.PI) / 180;
  const c = Math.cos(a);
  const s = Math.sin(a);
  const pt = (r, o) => [r * c - o * s, r * s + o * c];
  const sleepers = [];
  for (let r = 34; r <= 66; r += 6) sleepers.push(k.lineOnTop(pt(r, -4.6), pt(r, 4.6), 1.4, P));
  const mid = (END + PIT) / 2;
  const out = [
    S(k.extrude(rect(c * mid, s * mid, END - PIT, 12, a), 0, 1.4, P, { convex: true }), { tone: 'lo', crease: 'none' }),
    L(sleepers.join(''), { tone: 'faint' }),
    L(k.lineOnTop(pt(PIT, -3.2), pt(END - 4, -3.2), 1.4, P) + k.lineOnTop(pt(PIT, 3.2), pt(END - 4, 3.2), 1.4, P), { tone: 'mid' }),
  ];
  if (shed) {
    const [sx, sy] = pt(END + 8, 0);
    out.push(S(k.extrude(rect(sx, sy, 14, 16, a), 0, 13, P, { convex: true, bevel: 0.5 }), { tone: 'mid' }));
    out.push(L(k.onTop(rect(sx, sy, 8, 10, a), 13, P, true), { tone: 'lo' }));
    out.push(D([at([sx - c * 7 + s * 3, sy - s * 7 - c * 3, 6])], { size: 0.6, tone: 'hi' }));
  }
  return out.join('');
}

function pit() {
  return [
    col(0, 0, PIT, 0, 4, { tone: 'mid', crease: 'faint' }, 40),
    S(k.cylinder(0, 0, PIT - 4, 3.6, 0.4, P, 36), { tone: 'lo', crease: 'none', flat: true }),
    L(k.radialTicks(0, 0, PIT - 6, 48, 4, 4, [1.2, 2.4], P).minor, { tone: 'lo' }),
    D(Array.from({ length: 12 }, (_, i) => at([(PIT - 2) * Math.cos((i / 12) * 6.283), (PIT - 2) * Math.sin((i / 12) * 6.283), 4])), { size: 0.45, tone: 'mid' }),
  ].join('');
}

function lamp() {
  const [lx, ly] = at([-34, 30, 30]);
  return [col(-34, 30, 2.4, 0, 28, { tone: 'mid', crease: 'none' }, 12), box0(-34, 30), `<circle class="fig-led" data-led="sw" cx="${lx.toFixed(1)}" cy="${ly.toFixed(1)}" r="1.8" opacity="0.25"/>`].join('');
}
const box0 = (x, y) => S(k.slabOf({ x: x - 3.5, y: y - 3.5, w: 7, d: 7, r: 1.5 }, 25, 5, P, 2, 0.4), { tone: 'hi' });

const hub = () => col(0, 0, 4, 4, 9, { tone: 'hi', crease: 'faint' }, 16);

// ---- paint back to front --------------------------------------------------

const body = [
  basePlate(P, PLATE, { lean: true, label: { x: -78, y: 60, w: 28, d: 11, r: 1.5 } }),
  road(IN, true),
  pit(),
  road(ROADS[0], false),
  road(ROADS[2], false),
  road(ROADS[1], false),
  `<g data-part="bridge"></g>`,
  hub(),
  `<g data-part="car"></g>`,
  lamp(),
  ...[ROADS[0], ROADS[2], ROADS[1]].map(deg => {
    const a = (deg * Math.PI) / 180;
    const sx = (END + 8) * Math.cos(a);
    const sy = (END + 8) * Math.sin(a);
    return S(k.extrude(rect(sx, sy, 14, 16, a), 0, 13, P, { convex: true, bevel: 0.5 }), { tone: 'mid' }) + L(k.onTop(rect(sx, sy, 8, 10, a), 13, P, true), { tone: 'lo' });
  }),
];

const svg = k.figureSvg({
  width: WIDTH,
  height: HEIGHT,
  label:
    'A railway turntable seen from above and to one side. One incoming track ends at a round pit. A bridge on a hub turns to line up with one of three outgoing roads, each ending in its own shed. A car rolls in, the bridge turns under it, and the car leaves down the road the bridge chose. The choice of road is made by the turn of the bridge.',
  body,
});

const place = (deg, r, z) => [r * Math.cos((deg * Math.PI) / 180), r * Math.sin((deg * Math.PI) / 180), z];
const pins = pinsHtml(P, WIDTH, HEIGHT, [
  { id: 'router', n: 1, at: [0, 0, 9], icon: 'arrows-split', title: 'Router', sub: 'Turns to the road each call needs', lift: 26, expand: true, seek: 'router' },
  { id: 'small', n: 2, at: place(ROADS[0], END + 8, 13), icon: 'lightning', title: 'Small model', sub: 'Quick, simple calls', side: 'right', lift: 20, expand: true, seek: 'small' },
  { id: 'large', n: 3, at: place(ROADS[2], END + 8, 13), icon: 'brain', title: 'Large model', sub: 'Hard, open-ended calls', side: 'left', lift: 20, expand: true, seek: 'large' },
  { id: 'spec', n: 4, at: place(ROADS[1], END + 8, 13), icon: 'wrench', title: 'Specialist', sub: 'One narrow job done well', side: 'down', lift: 8, expand: true, seek: 'spec' },
]);

// ---- live -----------------------------------------------------------------

const live = `
${playFigure.toString()}
${rect.toString()}
const P = ${JSON.stringify(P)};
const C = ${JSON.stringify({ IN, ROADS, PIT, END })};
const LOOP = 12, PASS = 4;
const RAD = Math.PI / 180;
const lerp = (a, b, s) => a + (b - a) * s;
const sat = (v, a, b) => Math.min(1, Math.max(0, (v - a) / (b - a)));
const ease = (s) => s * s * (3 - 2 * s);
// passes go to the middle road, then the right one, then the left, so the still frame shows the middle
const ORDER = [1, 0, 2];
for (const stage of document.querySelectorAll('[data-figure="switch-yard"]')) {
  const svg = stage.querySelector('svg');
  const q = (name) => svg.querySelector('[data-part="' + name + '"]');
  const bridge = q('bridge'), car = q('car');
  const led = svg.querySelector('[data-led="sw"]');
  const readout = stage.closest('.iso-figure').querySelector('[data-readout]');
  const pins = [...stage.querySelectorAll('[data-pin]')];
  const SAY = ['a call goes to a specialist', 'a call goes to the small model', 'a call goes to the large model'];
  let on = -1;
  function draw(t) {
    const pass = Math.floor(t / PASS) % 3, s = t % PASS, k0 = ORDER[pass];
    const target = C.ROADS[k0] * RAD, rest = (C.IN - 180) * RAD;
    const turn = ease(sat(s, 1, 2));
    const back = ease(sat(s, 3.1, 3.9));
    const phi = rest + (target - rest) * turn * (1 - back);
    bridge.innerHTML = solidSvg(extrude(rect(0, 0, 2 * C.PIT - 4, 9, phi), 4, 4, P, { convex: true, bevel: 0.4 }), { tone: 'mid' })
      + lineSvg(lineOnTop([-(C.PIT - 4) * Math.cos(phi) - 2.8 * Math.sin(phi), -(C.PIT - 4) * Math.sin(phi) + 2.8 * Math.cos(phi)], [(C.PIT - 4) * Math.cos(phi) - 2.8 * Math.sin(phi), (C.PIT - 4) * Math.sin(phi) + 2.8 * Math.cos(phi)], 8, P), { tone: 'lo' })
      + lineSvg(lineOnTop([-(C.PIT - 4) * Math.cos(phi) + 2.8 * Math.sin(phi), -(C.PIT - 4) * Math.sin(phi) - 2.8 * Math.cos(phi)], [(C.PIT - 4) * Math.cos(phi) + 2.8 * Math.sin(phi), (C.PIT - 4) * Math.sin(phi) - 2.8 * Math.cos(phi)], 8, P), { tone: 'lo' });
    let x, y, h;
    if (s < 1) { const r = lerp(C.END - 8, 0, ease(sat(s, 0, 1))); x = r * Math.cos(C.IN * RAD); y = r * Math.sin(C.IN * RAD); h = rest; }
    else if (s < 2) { x = 0; y = 0; h = phi; }
    else { const r = lerp(0, C.END - 10, ease(sat(s, 2, 3.2))); x = r * Math.cos(target); y = r * Math.sin(target); h = target; }
    car.innerHTML = solidSvg(extrude(rect(x, y, 16, 7, h), 8, 5, P, { convex: true, bevel: 0.5 }), { tone: 'hi' })
      + lineSvg(lineOnTop([x - 5 * Math.cos(h), y - 5 * Math.sin(h)], [x + 5 * Math.cos(h), y + 5 * Math.sin(h)], 13, P), { tone: 'mid' });
    car.setAttribute('opacity', String(Math.min(sat(s, 0, 0.3), 1 - sat(s, 3.4, 3.9))));
    led.setAttribute('opacity', s > 1 && s < 2 ? '1' : '0.25');
    const now = k0 === 1 ? 3 : k0 === 0 ? 1 : 2;
    if (now !== on) {
      on = now;
      pins.forEach((pin, i) => { pin.toggleAttribute('data-on', i === now); pin.toggleAttribute('data-dim', i !== now && i !== 0); });
      if (readout) readout.textContent = SAY[pass];
    }
  }
  playFigure(stage, draw, { loop: LOOP, stillAt: 2.6, seek: { router: 1.5, small: 5.5, large: 9.5, spec: 1.5 } });
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) pins.forEach((pin) => pin.removeAttribute('data-dim'));
}
`;

const plate = k.plateHtml({
  title: 'The switch yard',
  hint: 'One road in, three roads out',
  readout: 'a call goes to a specialist',
  body: `<div class="iso-stage" data-figure="switch-yard">${svg}${pins}</div>`,
});

writeFigure('switch-yard', { plate, live, title: 'Switch yard' });
