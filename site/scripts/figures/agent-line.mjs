// Fig 15: the agent line (Anatomy kit, MIT; see ./kit/LICENSE).
//
// The checkpoint line, grown. Four agents stand on a shelf at the left, each
// with a screen that carries its mark (Claude, OpenAI, Gemini, and a plain
// prompt for your own). Each one sends calls onto the request belt. The belt
// runs under a gate arch, where each call is trimmed to the same small block,
// into the engine (the lit part). A call that breaks a rule is pushed off the
// request belt onto the answer belt and rides home marked refused. The
// engine's dial and bars show the traffic; its answers leave on the answer
// belt, run back past the gate and hop into their agent's slot. A short belt
// on the right takes a written plate for every call to a ledger: the record
// on the chain.
// Four beats of 2.75 s: send, decide, run, answer. Each lights its pin and its
// card in the step list under the drawing. With reduced motion it rests on
// the refusal.
//
// Marks: Claude, OpenAI and Gemini come from src/data_files/brand-icons.json,
// the same file the site's logo strips use. The fourth mark is a drawn prompt.
//
// Run: node scripts/figures/agent-line.mjs
import { readFileSync } from 'node:fs';
import { k, tools, pinsHtml, stepsHtml, playFigure, writeFigure } from './lib.mjs';

const WIDTH = 720;
const HEIGHT = 510;

const PLATE = { x: -246, y: -76, w: 400, d: 122, r: 8 };
const RULER = { x: -60, y: 33, w: 120, d: 7, r: 1 };
const BZ = 4; // belt top
const XS = [-219, -185, -151, -117]; // agent centres
const YR = -27; // request belt centre
const YA = 5; // answer belt centre
const XG = -78; // gate
const XP = -58; // pusher
const ENG = { x: -30, y: -42, w: 72, d: 56, r: 0 };
const EH = 46;
const FY = 14; // engine front face
const EX = 42; // engine right face
const PZ = 42; // plaque top

const P = k.fitProjection(
  [...k.boxCorners(PLATE, -17, 0), ...XS.map(x => [x, -57, PZ]), [6, -14, EH], [XG, 0, 36], [112, -14, 18], [0, 128, -17]],
  WIDTH, HEIGHT, { pad: 8, headroom: 76, azimuth: 68, elevation: 30 }
);
const { at, S, L, D, path, faceCircle } = tools(P);

// ---- helpers ---------------------------------------------------------------
const rectY = (y, x0, z0, x1, z1) => path([[x0, y, z0], [x1, y, z0], [x1, y, z1], [x0, y, z1]], true);
const lineY = (y, x0, x1, z) => path([[x0, y, z], [x1, y, z]]);
const sideX = (x, y0, z0, y1, z1) => path([[x, y0, z0], [x, y1, z0], [x, y1, z1], [x, y0, z1]], true);
const dotsY = (y, list, tone = 'mid') => D(list.map(([x, z]) => at([x, y, z])), { size: 0.45, tone });
const join = (...parts) => parts.join('');
// A plain slab: square corners, no bevel (fewer paths).
const bx = (plan, z0, z1, tone = 'mid', lit = false, crease = 'none') => S(k.slabOf({ ...plan, r: 0 }, z0, z1 - z0, P, 1, 0), { tone, crease, lit });
const plateY = (y, x0, z0, x1, z1, tone = 'lo') => `<path class="iso-top" d="${rectY(y, x0, z0, x1, z1)}"/>` + L(rectY(y, x0, z0, x1, z1), { tone });

// A brand path at two decimals, no leading zeros: marks this small need no more.
function compact(d) {
  const fmt = n => (Math.round(n * 100) / 100).toString().replace(/^(-?)0\./, '$1.');
  let out = '';
  let prev = '';
  let cmd = '';
  let n = 0;
  for (const [token] of d.matchAll(/[a-zA-Z]|-?(?:\d+\.?\d*|\.\d+)/g)) {
    if (/[a-zA-Z]/.test(token)) { out += token; prev = ''; cmd = token.toLowerCase(); n = 0; continue; }
    // arc flags are single digits and may be written without a gap before the next number
    const v = cmd === 'a' && (n % 7 === 3 || n % 7 === 4) ? token : fmt(Number(token));
    out += (prev && !/^-/.test(v) && !(v[0] === '.' && prev.includes('.')) ? ' ' : '') + v;
    prev = v;
    n++;
  }
  return out;
}
const MARKS = JSON.parse(readFileSync(new URL('../../src/data_files/brand-icons.json', import.meta.url), 'utf8'));

// ---- the floor -------------------------------------------------------------
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

// ---- the agents --------------------------------------------------------------
const PQ = { w: 24, d: 3, y: -60 }; // the screen's plan: it stands on the shelf
const GLYPH = 18;

function mark(i) {
  const x0 = XS[i] - GLYPH / 2;
  const z0 = PZ - 3;
  if (i === 3) {
    // your own agent: a prompt, drawn
    const p = (u, v) => [x0 + u, -57, z0 - v];
    return `<g style="--anatomy-weight:1.4px">${L(path([p(3, 5), p(9, 9), p(3, 13)]) + path([p(11, 14), p(16, 14)]), { tone: 'hi', free: true })}</g>`;
  }
  const key = ['claude', 'openai', 'gemini'][i];
  const rule = key === 'claude' ? '' : ' fill-rule="evenodd"';
  return `<path${rule} style="fill:var(--anatomy-hi)" transform="${k.sideMatrix([x0, -57], z0, P, 'left')} scale(${GLYPH / 24})" d="${compact(MARKS[key].path)}"/>`;
}

function agent(i) {
  const x = XS[i];
  const extra = [
    // a vented lid, a round fan, a short mast, an antenna: each console is its own
    L(k.planOutline(k.insetPlan({ x: x - 13, y: -66, w: 26, d: 32, r: 0 }, 4), 16, P, 1), { tone: 'faint' }),
    S(k.cylinder(x + 3, -42, 5, 16, 2, P, 8), { tone: 'lo', crease: 'none' }) + L(k.ring(x + 3, -42, 3, 18, P, 8), { tone: 'faint' }),
    bx({ x: x + 6, y: -46, w: 4, d: 4 }, 16, 25, 'lo') + D([at([x + 8, -44, 25])], { size: 0.6, tone: 'hi' }),
    S(k.cylinder(x + 8, -40, 1.2, 16, 14, P, 6), { tone: 'lo', crease: 'none' }) + D([at([x + 8, -40, 30])], { size: 0.7, tone: 'hi' })
  ][i];
  return join(
    bx({ x: x - 13, y: -66, w: 26, d: 32 }, 0, 16, 'mid'),
    // the out slot (left) and the in slot (right) on the front face
    L(rectY(-34, x - 11, 3, x - 3, 8) + rectY(-34, x + 3, 8, x + 11, 13), { tone: 'faint' }),
    dotsY(-34, [[x - 11, 13], [x + 11, 3]]),
    extra,
    bx({ x: x - PQ.w / 2, y: PQ.y, w: PQ.w, d: PQ.d }, 16, PZ, 'lo'),
    L(rectY(-57, x - 10, 18.5, x + 10, PZ - 1.5), { tone: 'faint' }),
    mark(i)
  );
}

// ---- belts -----------------------------------------------------------------
const BX0 = -238;
const BX1 = -24;
function belts() {
  const t = k.topTicks(BX0 + 6, BX1 - 8, 8, 4, -20, 2, [1.6, 3], P);
  const rollers = (y0, y1) => L(Array.from({ length: 7 }, (_, i) => k.lineOnTop([BX0 + 14 + i * 29, y0], [BX0 + 14 + i * 29, y1], BZ, P)).join(''), { tone: 'lo' });
  // chevrons print the direction: right on the request belt, left on the answer belt
  const chev = (y, dir) => L(Array.from({ length: 6 }, (_, i) => {
    const x = BX0 + 30 + i * 32;
    return k.pathOf([[x - 2 * dir, y - 3.5], [x + 2 * dir, y], [x - 2 * dir, y + 3.5]].map(([a, b]) => at([a, b, BZ])));
  }).join(''), { tone: 'mid', free: true });
  return join(
    bx({ x: BX0, y: -34, w: BX1 - BX0, d: 14 }, 0, BZ, 'mid', false, 'faint'),
    rollers(-34, -20),
    chev(YR, 1),
    bx({ x: BX0, y: -20, w: BX1 - BX0, d: 18 }, 0, 2, 'lo'),
    L(t.minor, { tone: 'lo' }),
    L(t.major, { tone: 'mid' }),
    bx({ x: BX0, y: -2, w: BX1 - BX0, d: 14 }, 0, BZ, 'mid', false, 'faint'),
    rollers(-2, 12),
    chev(YA, -1)
  );
}

// ---- the gate and the pusher -------------------------------------------------
const gateBack = () => join(bx({ x: XG - 4, y: -40, w: 8, d: 6 }, 0, 34, 'mid'), bx({ x: XG - 5, y: -40, w: 10, d: 62 }, 28, 36, 'hi'),
  L(faceCircle([XG, 22, 32], 2.6, 'y', 12), { tone: 'mid' }) + D([at([XG, 22, 32])], { size: 0.7, tone: 'hi' }));
const gateFront = () => bx({ x: XG - 4, y: 16, w: 8, d: 6 }, 0, 34, 'mid');
const housing = () => join(bx({ x: XP - 8, y: -50, w: 16, d: 14 }, 0, 14, 'mid'), L(rectY(-36, XP - 5, 3, XP + 5, 11), { tone: 'faint' }));

// ---- the engine --------------------------------------------------------------
const DIAL = { x: -8, z: 24, r: 9 };
const WIN = { x0: 8, x1: 28, z0: 18, z1: 26 };
function dialFace() {
  const { x, z, r } = DIAL;
  const pt = (rr, a) => [x + rr * Math.cos(a), FY, z + rr * Math.sin(a)];
  const minor = [];
  const major = [];
  for (let i = 0; i <= 10; i++) {
    const a = ((225 - 27 * i) * Math.PI) / 180;
    (i % 5 === 0 ? major : minor).push(path([pt(r - 0.5, a), pt(r - (i % 5 === 0 ? 3 : 2), a)]));
  }
  return join(
    `<path class="iso-top" d="${faceCircle([x, FY, z], r + 1, 'y', 18)}"/>`,
    L(faceCircle([x, FY, z], r + 1, 'y', 18), { tone: 'mid' }),
    L(faceCircle([x, FY, z], r - 0.1, 'y', 18), { tone: 'lo' }),
    L(minor.join(''), { tone: 'lo' }),
    L(major.join(''), { tone: 'mid' }),
    L(faceCircle([x, FY, z], 1.2, 'y', 8), { tone: 'hi' }),
    `<path class="iso-line" data-tone="hi" data-free data-part="needle" style="stroke-width:1.2px" d=""/>`
  );
}
function engine() {
  const slots = [];
  for (let i = 0; i < 4; i++) slots.push(rectY(FY, 12 + i * 3, 34, 13.6 + i * 3, 41));
  const lamps = [37, 31.5, 26];
  const led = (name, z) => { const [cx, cy] = at([33, FY, z]); return `<circle class="fig-led" data-led="${name}" cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="1.5" opacity="0.25"/>`; };
  const screws = [[-26, 6], [38, 6], [-26, 42], [38, 42]];
  return join(
    bx(ENG, 0, EH, 'hi', true),
    L(k.sideSeam(ENG, EH - 5, P, 1) + k.planOutline(k.insetPlan(ENG, 4), EH, P, 1) + k.ring(-8, -14, 9, EH, P, 12) + k.ring(22, -14, 9, EH, P, 12), { tone: 'lo' }),
    L(rectY(FY, -27, 5, 39, 43), { tone: 'faint' }),
    dotsY(FY, screws, 'hi'),
    L(slots.join(''), { tone: 'lo' }),
    L(lamps.map(z => faceCircle([33, FY, z], 2.1, 'y', 8)).join(''), { tone: 'lo' }),
    led('in', 37), led('chk', 31.5), led('rec', 26),
    dialFace(),
    L(rectY(FY, WIN.x0, WIN.z0, WIN.x1, WIN.z1), { tone: 'mid' }),
    `<path class="iso-line" data-tone="hi" data-part="bars" d=""/>`,
    plateY(FY, -26, 7, -4, 14, 'mid'),
    L(lineY(FY, -24, -10, 12) + lineY(FY, -24, -14, 10.5) + lineY(FY, -24, -17, 9), { tone: 'faint', free: true }),
    // the outlet on the right face feeds the record belt
    L(sideX(EX, -20, BZ, -8, 16), { tone: 'mid' })
  );
}

// ---- the record: a short belt and the ledger -----------------------------------
const LX0 = EX;
const LX1 = 90;
const LY = -14;
function record() {
  const [lx, ly] = at([124, -10, 18]);
  return join(
    bx({ x: LX0, y: -20, w: LX1 - LX0, d: 12 }, 0, BZ, 'mid', false, 'faint'),
    L(Array.from({ length: 3 }, (_, i) => k.lineOnTop([LX0 + 10 + i * 14, -20], [LX0 + 10 + i * 14, -8], BZ, P)).join(''), { tone: 'lo' }),
    L(k.pathOf([[LX0 + 20, LY - 3], [LX0 + 24, LY], [LX0 + 20, LY + 3]].map(([a, b]) => at([a, b, BZ]))) + k.pathOf([[LX0 + 34, LY - 3], [LX0 + 38, LY], [LX0 + 34, LY + 3]].map(([a, b]) => at([a, b, BZ]))), { tone: 'mid', free: true })
  );
}
const ledger = () => join(
  bx({ x: 88, y: -32, w: 48, d: 34 }, 0, 6, 'mid'),
  bx({ x: 90, y: -30, w: 44, d: 30 }, 6, 12, 'hi'),
  bx({ x: 93, y: -28, w: 38, d: 26 }, 12, 18, 'hi'),
  L(k.lineOnTop([98, -6], [124, -6], 18, P) + k.lineOnTop([98, -14], [116, -14], 18, P) + k.lineOnTop([98, -22], [120, -22], 18, P), { tone: 'lo', free: true }),
  `<circle class="fig-led" data-led="led" cx="${at([124, -10, 18])[0].toFixed(1)}" cy="${at([124, -10, 18])[1].toFixed(1)}" r="1.8" opacity="0.25"/>`
);

// ---- paint back to front -----------------------------------------------------
const body = [
  floor(),
  ...XS.map((_, i) => agent(i)),
  belts(),
  gateBack(),
  housing(),
  `<g data-part="calls"></g>`,
  `<g data-part="pusher"></g>`,
  engine(),
  record(),
  `<g data-part="plates"></g>`,
  ledger(),
  gateFront()
];

const svg = k.figureSvg({
  width: WIDTH,
  height: HEIGHT,
  label:
    'A conveyor line seen from above and to one side. Four agents stand on a shelf at the left, with the marks of Claude, OpenAI and Gemini and a prompt for your own. Each sends calls onto a request belt that runs under a gate and into a lit engine. The gate trims each call to the same small block. A call that breaks a rule is pushed onto the answer belt and returns marked refused. The engine shows a dial and a bar window for the traffic, and its answers ride the answer belt back to each agent. A short belt carries a written plate for every call to a ledger, which is the record on the blockchain.',
  body
});

// A tag that hangs below the plate: its stem ends `gap` units under the plate's front edge.
// (A stem is lift / 9.6 cqw long, which is 0.75 of a viewBox unit per lift.)
const below = (x, anchor, gap) => Math.round((at([x, 46, -12])[1] + gap - at(anchor)[1]) / 0.75);
const pins = pinsHtml(P, WIDTH, HEIGHT, [
  { id: 'ask', at: [XS[1] - 9, -57, PZ], icon: 'paper-plane-tilt', title: 'Your agents', lift: 40, seek: 'ask' },
  { id: 'gate', at: [XG, 22, 0], icon: 'shield-check', title: 'Agentic gate', side: 'down', lift: below(XG, [XG, 22, 0], 18), seek: 'gate' },
  { id: 'run', at: [20, -14, EH], icon: 'gauge', title: 'Observability', lift: 82, seek: 'run' },
  { id: 'back', at: [112, 2, 0], icon: 'link', title: 'Blockchain', side: 'down', lift: below(112, [112, 2, 0], 9), seek: 'back' }
]);

const steps = stepsHtml([
  { id: 'ask', icon: 'paper-plane-tilt', title: 'Agents send requests', sub: 'Claude, OpenAI, Gemini or your own agent sends a call to the engine.' },
  { id: 'gate', icon: 'shield-check', title: 'The gate decides', sub: 'Egress policy and PII rules run first. A wrong call comes back refused.' },
  { id: 'run', icon: 'gauge', title: 'Fewer tokens, full view', sub: 'Each call is trimmed. Traces, logs and evals show what ran.' },
  { id: 'back', icon: 'link', title: 'Answer back, record kept', sub: 'The answer returns to the agent. The call is written to the chain.' }
]);

// ---- live --------------------------------------------------------------------
const BEAT = 2.75;
const LOOP = BEAT * 4;
const V = 35; // request belt speed
const VA = 90; // answer belt speed
const DEP = [0.32, 0.84, 1.36, 1.89]; // when each call leaves its agent
const BAD = 3; // the call the gate turns back
const ANS = [{ to: 0, at: 8.3 }, { to: 1, at: 8.85 }, { to: 2, at: 9.4 }]; // answers, by agent
const REC = [8.3, 8.8, 9.3, 9.8]; // plates, one per call
const STILL = 4.3;

const live = `
${playFigure.toString()}
const P = ${JSON.stringify(P)};
const C = ${JSON.stringify({ XS, YR, YA, XG, XP, BZ, EX, LX1, LY, DIAL, WIN, FY, V, VA, DEP, BAD, ANS, REC, BEAT, LOOP })};
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
  playFigure(stage, draw, { loop: C.LOOP, stillAt: ${STILL}, seek: { ask: 0.4, gate: 3.1, run: 5.8, back: 8.55 } });
}
`;

const plate = k
  .plateHtml({
    title: 'Your agents, one engine',
    hint: 'Requests out, answers back',
    readout: 'the gate decides',
    body: `<div class="iso-stage" data-figure="agent-line">${svg}${pins}</div>`
  })
  .replace('</figure>', `${steps}</figure>`);

writeFigure('agent-line', { plate, live, title: 'Agent line' });
