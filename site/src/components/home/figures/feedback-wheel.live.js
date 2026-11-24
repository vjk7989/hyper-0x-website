
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
const P = {"origin":[350,151.75997750181432],"scale":2.000442022943873,"azimuth":40,"elevation":32};
const C = {"R":13,"BZ":10,"HONE":[-20,-13],"WORK":[35,13]};
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
