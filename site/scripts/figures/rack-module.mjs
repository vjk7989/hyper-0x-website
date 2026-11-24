// Fig 14: the rack module (Anatomy kit, MIT; see ./kit/LICENSE).
//
// A rack row in the customer's own room. The middle rack is open: their
// servers and a switch sit in it, dim, and one module is bolted in among them.
// Four cables, each from a different kind of connector (any model), run along
// the floor, rise beside the rack and meet the module at a cable gland. A
// fifth socket on the panel is crossed out. A dial gauge and a small bar
// window show the traffic as it passes. A second gland leaves the module and
// feeds a drawer that slides out of the rack, where written plates stack up
// (the record on the chain).
// Four calls loop: each rides its cable and reaches the panel. Three go in,
// move the needle and come out as a written plate on the stack. One is
// refused at the crossed socket, held there, and sent back along its cable.
// With reduced motion the line rests mid-refusal.
//
// Run: node scripts/figures/rack-module.mjs
import { k, tools, pinsHtml, playFigure, writeFigure } from './lib.mjs';

const WIDTH = 720;
const HEIGHT = 500;

const PLATE = { x: -106, y: -30, w: 212, d: 100, r: 8 };
const RULER = { x: -50, y: 56, w: 100, d: 7, r: 1 };
const FY = 22; // the rack front plane
const MZ = [35, 65]; // the module
const TOP = 109;

// Reserve room for the pins: 110 units of headroom above the cap, and one point past the front
// edge of the floor so the lowest tag (calls from any model) stays inside the frame at 375px.
const P = k.fitProjection([...k.boxCorners(PLATE, -17, 0), [-60, 0, TOP], [60, 0, TOP], [60, 165, -17]], WIDTH, HEIGHT, { pad: 10, headroom: 110, azimuth: 66, elevation: 30 });
const { at, S, L, D, path, faceCircle } = tools(P);

// ---- face helpers ----------------------------------------------------------
// y-plane (front faces), x-plane (end faces of plugs)
const rectY = (y, x0, z0, x1, z1) => path([[x0, y, z0], [x1, y, z0], [x1, y, z1], [x0, y, z1]], true);
const lineY = (y, x0, x1, z) => path([[x0, y, z], [x1, y, z]]);
const sideX = (x, y0, z0, y1, z1) => path([[x, y0, z0], [x, y1, z0], [x, y1, z1], [x, y0, z1]], true);
const dotsY = (y, list, tone = 'mid') => D(list.map(([x, z]) => at([x, y, z])), { size: 0.45, tone });
const join = (...parts) => parts.join('');
// A slab. Plain by default (square corners, no bevel: fewer paths); soft keeps the plan's rounding.
const bx = (plan, z0, z1, tone = 'mid', soft = false, lit = false, bevel = 0.5) =>
  S(k.slabOf(soft ? plan : { ...plan, r: 0 }, z0, z1 - z0, P, soft ? 2 : 1, soft ? bevel : 0), { tone, crease: soft && bevel ? 'faint' : 'none', lit });
// A thin plate lying on a front face: a filled rectangle with its outline.
const plateY = (y, x0, z0, x1, z1, tone = 'lo') => `<path class="iso-top" d="${rectY(y, x0, z0, x1, z1)}"/>` + L(rectY(y, x0, z0, x1, z1), { tone });

// ---- the floor ---------------------------------------------------------------

function floor() {
  const feet = [...k.corners(PLATE, 16)].sort((a, b) => k.depthOf([a[0], a[1], 0], P) - k.depthOf([b[0], b[1], 0], P));
  const screws = k.corners(PLATE, 9);
  const t = k.topTicks(RULER.x + 4, RULER.x + RULER.w - 4, 5, 5, RULER.y + 0.8, 0.6, [2, 3.6], P);
  return join(
    `<path class="iso-halo" d="${k.slabOf(PLATE, -17, 12, P, 2).fill}"/>`,
    ...feet.map(([x, y]) => S(k.cylinder(x, y, 6, -17, 5, P, 6), { tone: 'lo', crease: 'none' })),
    S(k.slabOf(PLATE, -12, 12, P, 2, 0), { tone: 'mid', crease: 'none' }),
    L(k.planOutline(k.insetPlan(PLATE, 4), 0, P, 2), { tone: 'lo' }),
    L(screws.map(([x, y]) => k.ring(x, y, 2, 0, P, 10)).join(''), { tone: 'lo' }),
    D(screws.map(([x, y]) => at([x, y, 0])), { size: 0.5 }),
    S(k.slabOf(RULER, 0, 0.6, P, 1), { tone: 'lo', crease: 'none' }),
    L(t.minor, { tone: 'lo' }),
    L(t.major, { tone: 'mid' })
  );
}

// ---- the rack row ------------------------------------------------------------

function cabinet(cx, kind) {
  const X = cx - 22;
  const plan = { x: X, y: -22, w: 44, d: 44, r: 0 };
  const out = [
    bx(plan, 0, TOP, 'lo'),
    L(k.sideSeam(plan, TOP - 5, P, 1) + k.planOutline(k.insetPlan(plan, 4), TOP, P, 1) + k.ring(cx, 0, 9, TOP, P, 12), { tone: 'faint' }),
    L(rectY(FY, X + 3, 8, X + 41, TOP - 9), { tone: 'faint' })
  ];
  if (kind === 'louvre') {
    const ls = [];
    for (let z = 24; z <= 96; z += 18) ls.push(lineY(FY, X + 3, X + 41, z));
    out.push(L(ls.join(''), { tone: 'faint' }));
  } else {
    out.push(L(rectY(FY, X + 7, 50, X + 37, 96) + rectY(FY, X + 9.5, 52.5, X + 34.5, 93.5) + lineY(FY, X + 3, X + 41, 36), { tone: 'faint' }));
  }
  if (kind !== 'louvre') out.push(L(sideX(X + 44, -18, 8, 18, 100), { tone: 'faint' }));
  const hx = kind === 'louvre' ? X + 38 : X + 6;
  out.push(plateY(FY, hx - 0.8, 44, hx + 0.8, 62, 'faint'), dotsY(FY, [[hx, 48], [hx, 58]]));
  return join(...out);
}

const post = (x, y) => bx({ x, y, w: 3, d: 4 }, 5, 105, 'mid');
// every unit is screwed to both posts: one dot group for all of them, drawn after the posts
const ears = [];
const earAt = (z0, z1) => ears.push([-27.5, (z0 + z1) / 2], [27.5, (z0 + z1) / 2]);
const unit = (z0, z1, tone, extra = '') => (earAt(z0, z1), bx({ x: -25, y: -19, w: 50, d: 41 }, z0, z1, tone) + extra);
// a blanking plate is a thin sheet on the front, with its own screws
const blank = (z0, z1) => (earAt(z0, z1), plateY(FY, -25, z0 + 0.6, 25, z1 - 0.6, 'lo'));

const server = (z0, z1) => {
  const z = (z0 + z1) / 2;
  const bays = [];
  for (let i = 0; i < 3; i++) bays.push(rectY(FY, -22 + i * 7, z0 + 2, -16 + i * 7, z1 - 2));
  const vents = [];
  for (let i = 0; i < 5; i++) vents.push([6 + i * 3.6, z]);
  return unit(z0, z1, 'lo', L(bays.join(''), { tone: 'faint' }) + dotsY(FY, vents));
};

const switchUnit = (z0, z1) => {
  const ports = [];
  for (let i = 0; i < 8; i++) ports.push(rectY(FY, -22 + i * 5.4, z0 + 3, -19 + i * 5.4, z0 + 5.6));
  return unit(z0, z1, 'lo', L(ports.join(''), { tone: 'faint' }));
};

// post ticks: one per U (5 units), a major every 5th, hung across the post faces
function postTicks() {
  const minor = [];
  const major = [];
  for (let z = 10; z < 105; z += 5) (z % 25 === 0 ? major : minor).push(z);
  const draw = list => list.map(z => lineY(FY, -29, -26, z) + lineY(FY, 26, 29, z)).join('');
  return L(draw(minor), { tone: 'lo' }) + L(draw(major), { tone: 'hi' });
}

// the module ----------------------------------------------------------------
const DIAL = { x: 9, z: 52, r: 7.6 };
const WIN = { x0: 2, x1: 16, z0: 38.8, z1: 42.6 };
const GLAND = [-17, FY + 5, 49.5];
const PORT = [-19.8, FY + 1.2, 58.5];
const OUT = [20.5, FY + 3.5, 40];

function dialFace() {
  const { x, z, r } = DIAL;
  const pt = (rr, a) => [x + rr * Math.cos(a), FY, z + rr * Math.sin(a)];
  const minor = [];
  const major = [];
  for (let i = 0; i <= 10; i++) {
    const a = ((225 - 27 * i) * Math.PI) / 180;
    (i % 5 === 0 ? major : minor).push(path([pt(r - 0.5, a), pt(r - (i % 5 === 0 ? 2.8 : 1.9), a)]));
  }
  return join(
    `<path class="iso-top" d="${faceCircle([x, FY, z], r + 0.9, 'y', 18)}"/>`,
    L(faceCircle([x, FY, z], r + 0.9, 'y', 18), { tone: 'mid' }),
    L(faceCircle([x, FY, z], r - 0.1, 'y', 18), { tone: 'lo' }),
    L(minor.join(''), { tone: 'lo' }),
    L(major.join(''), { tone: 'mid' }),
    L(faceCircle([x, FY, z], 1.1, 'y', 8), { tone: 'hi' }),
    `<path class="iso-line" data-tone="hi" data-free data-part="needle" style="stroke-width:1.2px" d=""/>`
  );
}

function modulePanel() {
  const slots = [];
  for (let i = 0; i < 4; i++) slots.push(rectY(FY, -9 + i * 2.4, 40, -7.6 + i * 2.4, 58));
  const screws = [[-22, 38.5], [22, 38.5], [-22, 61.5], [22, 61.5]];
  const [lx, ly] = at([20.5, FY, 56]);
  const [mx, my] = at([20.5, FY, 51.5]);
  const [nx, ny] = at([20.5, FY, 47]);
  return join(
    L(rectY(FY, -23, 37, 23, 63), { tone: 'faint' }),
    L(screws.map(([x, z]) => faceCircle([x, FY, z], 1.1, 'y', 8)).join(''), { tone: 'lo' }),
    dotsY(FY, screws),
    // label plate, lower left: three rule lines and two screws
    plateY(FY, -22, 38.8, -11, 43.8, 'mid'),
    L(lineY(FY, -20, -13, 42.2) + lineY(FY, -20, -15, 41.2) + lineY(FY, -20, -17, 40.2), { tone: 'faint', free: true }),
    dotsY(FY, [[-12.2, 42.8], [-12.2, 39.8]]),
    // vents: closed slots
    L(slots.join(''), { tone: 'lo' }),
    // cable gland: flange, body, ring
    bx({ x: -21, y: FY, w: 8, d: 1 }, 45.5, 53.5, 'mid'),
    bx({ x: -19.5, y: FY + 1, w: 5, d: 4 }, 47, 52, 'hi'),
    L(faceCircle([-17, FY + 5, 49.5], 1.7, 'y', 8), { tone: 'mid' }),
    // the crossed-out socket: a plate, a ring and a slash
    bx({ x: -20.6, y: FY, w: 7.2, d: 1.2 }, 54.9, 62.1, 'mid'),
    L(faceCircle([-17, FY + 1.2, 58.5], 2.6, 'y', 12) + path([[-18.8, FY + 1.2, 56.7], [-15.2, FY + 1.2, 60.3]]), { tone: 'hi' }),
    // output gland, lower right
    bx({ x: 17.5, y: FY, w: 6, d: 1 }, 37.5, 42.5, 'mid'),
    bx({ x: 18.5, y: FY + 1, w: 4, d: 2.5 }, 38.5, 41.5, 'hi'),
    L(faceCircle([20.5, FY + 3.5, 40], 1.1, 'y', 8), { tone: 'mid' }),
    // status lamps, each in its own ring
    L([56, 51.5, 47].map(z => faceCircle([20.5, FY, z], 2.1, 'y', 8)).join(''), { tone: 'lo' }),
    `<circle class="fig-led" data-led="in" cx="${lx.toFixed(1)}" cy="${ly.toFixed(1)}" r="1.5" opacity="0.25"/>`,
    `<circle class="fig-led" data-led="chk" cx="${mx.toFixed(1)}" cy="${my.toFixed(1)}" r="1.5" opacity="0.25"/>`,
    `<circle class="fig-led" data-led="rec" cx="${nx.toFixed(1)}" cy="${ny.toFixed(1)}" r="1.5" opacity="0.25"/>`,
    // dial and bar window
    dialFace(),
    L(rectY(FY, WIN.x0, WIN.z0, WIN.x1, WIN.z1), { tone: 'mid' }),
    `<path class="iso-line" data-tone="hi" data-part="bars" d=""/>`
  );
}

const MODULE = { x: -25, y: -19, w: 50, d: 41, r: 1 };
const moduleBody = () =>
  join(
    bx(MODULE, MZ[0], MZ[1], 'hi', true, true),
    // ear screws on the rack posts
    dotsY(FY, [[-27.5, 37.5], [-27.5, 62.5], [27.5, 37.5], [27.5, 62.5]], 'hi'),
    L(k.sideSeam(MODULE, 60, P, 2), { tone: 'lo' }),
    modulePanel()
  );

// the drawer that slides out under the module: a shelf with plates stacked
const STACK_Z = 25;
const PLATE_H = 2.6;
const stack = [
  { x: -15, y: 30, w: 29, d: 18 },
  { x: -13.5, y: 30.5, w: 28, d: 17.5 },
  { x: -14.5, y: 29.5, w: 28.5, d: 18.5 }
];
const STACK_TOP = STACK_Z + PLATE_H * 3;

function drawer() {
  const top = stack[2];
  return join(
    L(rectY(FY, -23, 21.2, 23, 28.8), { tone: 'faint' }),
    bx({ x: -22, y: FY, w: 44, d: 28.5 }, 22.5, STACK_Z, 'mid'),
    ...stack.map((plan, i) => bx(plan, STACK_Z + i * PLATE_H, STACK_Z + (i + 1) * PLATE_H, 'hi')),
    L([4, 9, 13].map((o, i) => k.lineOnTop([top.x + 4, top.y + o], [top.x + (i === 0 ? 22 : i === 1 ? 17 : 20), top.y + o], STACK_TOP, P)).join(''), { tone: 'lo', free: true }),
    // a strap round the stack, ending on the plate edges
    L(path([[-8, 48, STACK_Z + 0.4], [-8, 48, STACK_TOP - 0.4]]) + path([[8, 48, STACK_Z + 0.4], [8, 48, STACK_TOP - 0.4]]), { tone: 'mid' }),
    dotsY(48, [[-8, 29], [8, 29]])
  );
}

// ---- floor: the customer's patch bay, and the cables -------------------------
const BAY = { x: -102, y: 29, w: 14, d: 37, r: 1.5 };
const PLUGS = [
  { yc: 35, plan: { x: -88, y: 31.5, w: 6, d: 7, r: 3.5 }, z: [3, 10], face: y => faceCircle([-82, y, 6.5], 2.8, 'x', 12) },
  { yc: 43, plan: { x: -88, y: 40.5, w: 5, d: 5, r: 0.5 }, z: [4, 9], face: y => sideX(-83, y - 1.6, 5.2, y + 1.6, 7.8) },
  { yc: 52, plan: { x: -88, y: 47, w: 7, d: 10, r: 0.5 }, z: [5, 8], face: y => sideX(-81, y - 3.8, 5.8, y + 3.8, 7.2) },
  { yc: 61, plan: { x: -88, y: 57.5, w: 6, d: 7, r: 1.2 }, z: [3, 10], face: y => faceCircle([-82, y, 6.5], 3, 'x', 6) }
];
const ENDS = PLUGS.map(p => [p.plan.x + p.plan.w, p.yc, 6.5]);
const LANE_Y = [31, 32.8, 34.6, 36.4];
const RISE_X = -33;
const r1 = v => v.map(n => Math.round(n * 10) / 10);
const routes = PLUGS.map((p, i) => {
  const top = i === 3 ? PORT[2] : GLAND[2];
  const end = i === 3 ? PORT : GLAND;
  return [ENDS[i], [ENDS[i][0] + 6, p.yc, 1.2], [-68, LANE_Y[i], 1.2], [RISE_X, LANE_Y[i], 1.2], [RISE_X, LANE_Y[i], top], [-24, i === 3 ? 29 : 28.5, top], end].map(r1);
});
const RECORD = [OUT, [OUT[0], 36, OUT[2]], [8, 40, STACK_TOP]].map(r1);

const bay = () =>
  join(
    bx(BAY, 0, 12, 'mid'),
    D(k.corners(BAY, 3).map(([x, y]) => at([x, y, 12])), { size: 0.45 }),
    L(rectY(BAY.y + BAY.d, BAY.x + 3, 3, BAY.x + BAY.w - 3, 9) + sideX(BAY.x + BAY.w, BAY.y + 1.5, 1.5, BAY.y + BAY.d - 1.5, 10.5), { tone: 'faint' }),
    ...PLUGS.map(p => bx(p.plan, p.z[0], p.z[1], 'hi', p.plan.r > 3, false, 0) + L(p.face(p.yc), { tone: 'mid' })),
    D(ENDS.map(e => at(e)), { size: 0.9, tone: 'hi' })
  );

function cables() {
  const lines = routes.map(r => L(path(r), { tone: 'hi' })).join('') + L(path(RECORD), { tone: 'hi' });
  return `<g style="--anatomy-weight:1.3px">${lines}</g>` + D([at(GLAND), at(PORT), at(OUT), at(RECORD.at(-1))], { size: 1, tone: 'hi' });
}

// ---- paint back to front -----------------------------------------------------

const RACK = { x: -29, y: -22, w: 58, d: 44, r: 1 };
const row = [
  bx(RACK, 0, 5, 'mid'),
  L(k.sideSeam(RACK, 2.5, P, 1) + rectY(FY, -25, 1.2, 25, 3.8), { tone: 'faint' }),
  bx({ x: -26, y: -22, w: 52, d: 3 }, 5, 105, 'lo'),
  server(5, 15),
  blank(15, 20),
  unit(20, 30, 'mid'),
  blank(30, 35),
  moduleBody(),
  blank(65, 70),
  switchUnit(70, 80),
  server(80, 90),
  blank(90, 95),
  server(95, 105),
  post(-29, FY - 4),
  post(26, FY - 4),
  postTicks(),
  dotsY(FY, ears),
  bx(RACK, 105, TOP, 'mid'),
  L(k.sideSeam(RACK, 107, P, 1) + k.planOutline(k.insetPlan(RACK, 4), TOP, P, 1) + k.ring(-12, 0, 4, TOP, P, 10) + k.ring(12, 0, 4, TOP, P, 10), { tone: 'faint' })
];

const body = [
  floor(),
  bay(),
  cabinet(-58, 'louvre'),
  ...row,
  cabinet(58, 'window'),
  drawer(),
  `<g data-part="plates"></g>`,
  cables(),
  `<g data-part="calls"></g>`
];

const svg = k.figureSvg({
  width: WIDTH,
  height: HEIGHT,
  label:
    "A row of three equipment racks seen from the front. The two outer racks are the customer's own, dim and closed. The middle rack is open and holds the customer's servers and one lit module. Cables from four different connectors reach a gland on the module panel. A crossed-out socket marks a call that is turned back. A dial and a bar window show the traffic. A drawer under the module stacks written plates: the record on the blockchain.",
  body
});

const pins = pinsHtml(P, WIDTH, HEIGHT, [
  { id: 'in', n: 1, at: [-50, LANE_Y[2], 1.2], icon: 'plugs-connected', title: 'Calls from any model', sub: 'Each cable, a different agent', side: 'down', lift: 38, expand: true, seek: 'in' },
  { id: 'rack', n: 2, at: [-58, FY, TOP], icon: 'hard-drives', title: 'Runs in your own rack', sub: 'Installed in your infrastructure', side: 'down', lift: 14, expand: true, seek: 'rack' },
  { id: 'gate', n: 3, at: [-19, FY + 1.2, 61.5], icon: 'shield-check', title: 'Agentic security gate', sub: 'Egress policy and PII checked. Wrong calls turned back.', lift: 14, expand: true, seek: 'gate' },
  { id: 'watch', n: 4, at: [DIAL.x, FY, DIAL.z + DIAL.r], icon: 'gauge', title: 'Agentic observability', sub: 'Every call shown live', lift: 150, expand: true, seek: 'watch' },
  { id: 'chain', n: 5, at: [14, 48, STACK_Z + PLATE_H * 1.5], icon: 'link', title: 'Blockchain', sub: 'Each call kept', side: 'right', lift: 36, expand: true, seek: 'chain' }
]);

// ---- live --------------------------------------------------------------------

const CALLS = [
  { lane: 0, start: 0 },
  { lane: 1, start: 2.2 },
  { lane: 3, start: 4.4, bad: 1 },
  { lane: 2, start: 6.6 }
];
const LOOP = 9;
const STILL = 7.5;

const live = `
${playFigure.toString()}
const P = ${JSON.stringify(P)};
const C = ${JSON.stringify({ routes, RECORD, CALLS, LOOP, DIAL, WIN, STACK_TOP, FY })};
const sat = (v, a, b) => Math.min(1, Math.max(0, (v - a) / (b - a)));
const ease = (s) => s * s * (3 - 2 * s);
const PIN = [0, 1, 2, 2, 3, 4];
const SAY = ['calls arrive from any model', 'installed in your own rack', 'every call is checked', 'a wrong call is turned back', 'every call is shown live', 'each call is written down'];
const lens = (R) => R.reduce((a, p, i) => (i ? [...a, a[i - 1] + Math.hypot(p[0] - R[i - 1][0], p[1] - R[i - 1][1], p[2] - R[i - 1][2])] : [0]), []);
const along = (R, cum, d) => {
  let i = 1;
  while (i < R.length - 1 && cum[i] < d) i++;
  const s = sat(d, cum[i - 1], cum[i]);
  return R[i].map((v, j) => R[i - 1][j] + (v - R[i - 1][j]) * s);
};
const CUM = C.routes.map(lens);
const RC = lens(C.RECORD);
const bump = (u, a, b) => Math.sin(Math.PI * sat(u, a, b));
const level = (t) => Math.min(1, C.CALLS.reduce((s, c) => { const u = (t - c.start + 4 * C.LOOP) % C.LOOP; return s + (c.bad ? 0.5 : 1) * bump(u, 2.8, c.bad ? 4.4 : 4.2); }, 0));
for (const stage of document.querySelectorAll('[data-figure="rack-module"]')) {
  const svg = stage.querySelector('svg');
  const q = (name) => svg.querySelector('[data-part="' + name + '"]');
  const calls = q('calls'), plates = q('plates'), needle = q('needle'), bars = q('bars');
  const led = (name) => svg.querySelector('[data-led="' + name + '"]');
  const readout = stage.closest('.iso-figure').querySelector('[data-readout]');
  const pins = [...stage.querySelectorAll('[data-pin]')];
  const Z = 2;
  const flat = { tone: 'hi', crease: 'none' };
  const shapes = [
    solidSvg(slabOf({ x: -2.6, y: -2.6, w: 5.2, d: 5.2, r: 0 }, -Z, 4.4, P, 1), flat),
    solidSvg(cylinder(0, 0, 3, -Z, 4.4, P, 10), flat),
    solidSvg(slabOf({ x: -5, y: -2.4, w: 10, d: 4.8, r: 0 }, -Z + 0.8, 2.8, P, 1), flat),
    solidSvg(extrude(circleRing(0, 0, 3.3, 6), -Z, 4.4, P, { convex: true }), flat)
  ];
  const cross = lineSvg(pathOf([iso([1.65, 2.86, 2.4], P), iso([-1.65, -2.86, 2.4], P)]) + pathOf([iso([-1.65, 2.86, 2.4], P), iso([1.65, -2.86, 2.4], P)]), { tone: 'hi' });
  const plate = solidSvg(slabOf({ x: -6, y: -4, w: 12, d: 8, r: 0 }, 0, 2.2, P, 1), flat);
  calls.innerHTML = C.CALLS.map((c) => '<g><g>' + shapes[c.lane] + '</g>' + (c.bad ? '<g data-x>' + cross + '</g>' : '') + '</g>').join('');
  plates.innerHTML = C.CALLS.map(() => '<g>' + plate + '</g>').join('');
  const cell = [...calls.children], slab = [...plates.children];
  const place = (el, p, a) => { el.setAttribute('transform', translateAlong(P, p)); el.setAttribute('opacity', String(a)); };
  let on = -1;
  function draw(t) {
    let stageNow = 1, lamp = [0, 0, 0];
    C.CALLS.forEach((c, i) => {
      const u = (t - c.start + C.LOOP) % C.LOOP;
      const R = C.routes[c.lane], cum = CUM[c.lane], L = cum[cum.length - 1];
      let a = 0, p = R[0];
      const x = cell[i].querySelector('[data-x]');
      if (u < 3) {
        p = along(R, cum, (u / 3) * L);
        a = sat(u, 0, 0.3) * (c.bad ? 1 : 1 - sat(u, 2.7, 3));
        if (!c.bad && u > 1.9) lamp[0] = 1;
        if (u < 1.2 && stageNow === 1) stageNow = 0;
      } else if (c.bad) {
        const back = ease(sat(u, 3.8, 5.8));
        p = along(R, cum, L * (1 - 0.55 * back));
        a = 1 - sat(u, 4.8, 5.8);
        if (u < 5.2) stageNow = 3;
        if (u < 3.8) lamp[1] = 1;
      } else if (u < 3.6) {
        lamp[1] = 1;
        if (stageNow !== 3) stageNow = 2;
      }
      cell[i].setAttribute('transform', translateAlong(P, [p[0], p[1], p[2] + Z]));
      cell[i].setAttribute('opacity', String(a));
      if (x) x.setAttribute('display', c.bad && u > 3 && u < 5.4 ? 'inline' : 'none');
      // the written plate: leaves the second gland, lands on the stack
      let pa = 0, q = C.RECORD[0];
      if (!c.bad && u >= 3.6 && u < 6.2) {
        q = along(C.RECORD, RC, sat(u, 3.6, 4.9) * RC[RC.length - 1]);
        pa = sat(u, 3.6, 3.9) * (1 - sat(u, 5.4, 6.2));
        if (u > 4.6 && u < 5.6) { lamp[2] = 1; if (stageNow !== 3) stageNow = 5; }
      }
      place(slab[i], q, pa);
    });
    const lv = level(t);
    const a = ((225 - 270 * (0.06 + 0.66 * lv)) * Math.PI) / 180;
    const { x, z, r } = C.DIAL;
    const pt = (rr) => iso([x + rr * Math.cos(a), C.FY, z + rr * Math.sin(a)], P);
    needle.setAttribute('d', pathOf([pt(-2), pt(r - 1.1)]));
    let bd = '';
    for (let j = 0; j < 6; j++) {
      const h = 0.7 + 2.5 * level(t - 0.4 * (5 - j));
      const x0 = C.WIN.x0 + 0.9 + j * 2.2, z0 = C.WIN.z0 + 0.5;
      bd += pathOf([iso([x0, C.FY, z0], P), iso([x0 + 1.3, C.FY, z0], P), iso([x0 + 1.3, C.FY, z0 + h], P), iso([x0, C.FY, z0 + h], P)], true);
    }
    bars.setAttribute('d', bd);
    ['in', 'chk', 'rec'].forEach((n, i) => led(n).setAttribute('opacity', lamp[i] ? '1' : '0.25'));
    if (stageNow === 2 && lv > 0.5) stageNow = 4;
    if (stageNow !== on) {
      on = stageNow;
      pins.forEach((pin, i) => { pin.toggleAttribute('data-on', i === PIN[on]); pin.toggleAttribute('data-dim', i !== PIN[on]); });
      if (readout) readout.textContent = SAY[on];
    }
  }
  playFigure(stage, draw, { loop: C.LOOP, stillAt: ${STILL}, seek: { in: 0.9, rack: 8.4, gate: 7.8, watch: 3.6, chain: 5 } });
}
`;

const plate = k.plateHtml({
  title: 'Inside your own rack',
  hint: 'Calls in, checked calls out',
  readout: 'a wrong call is turned back',
  body: `<div class="iso-stage" data-figure="rack-module">${svg}${pins}</div>`
});

writeFigure('rack-module', { plate, live, title: 'Rack module' });
