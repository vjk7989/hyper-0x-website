
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
const P = {"origin":[374.40872322748385,308.8142629775675],"scale":1.400303622426819,"azimuth":66,"elevation":30};
const C = {"routes":[[[-82,35,6.5],[-76,35,1.2],[-68,31,1.2],[-33,31,1.2],[-33,31,49.5],[-24,28.5,49.5],[-17,27,49.5]],[[-83,43,6.5],[-77,43,1.2],[-68,32.8,1.2],[-33,32.8,1.2],[-33,32.8,49.5],[-24,28.5,49.5],[-17,27,49.5]],[[-81,52,6.5],[-75,52,1.2],[-68,34.6,1.2],[-33,34.6,1.2],[-33,34.6,49.5],[-24,28.5,49.5],[-17,27,49.5]],[[-82,61,6.5],[-76,61,1.2],[-68,36.4,1.2],[-33,36.4,1.2],[-33,36.4,58.5],[-24,29,58.5],[-19.8,23.2,58.5]]],"RECORD":[[20.5,25.5,40],[20.5,36,40],[8,40,32.8]],"CALLS":[{"lane":0,"start":0},{"lane":1,"start":2.2},{"lane":3,"start":4.4,"bad":1},{"lane":2,"start":6.6}],"LOOP":9,"DIAL":{"x":9,"z":52,"r":7.6},"WIN":{"x0":2,"x1":16,"z0":38.8,"z1":42.6},"STACK_TOP":32.8,"FY":22};
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
  playFigure(stage, draw, { loop: C.LOOP, stillAt: 7.5, seek: { in: 0.9, rack: 8.4, gate: 7.8, watch: 3.6, chain: 5 } });
}
