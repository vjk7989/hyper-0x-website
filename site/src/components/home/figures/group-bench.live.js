
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
const P = {"origin":[351.1054080453833,148.5878032558695],"scale":1.4194518040278559,"azimuth":52,"elevation":32};
const C = {"PX":55,"BZ":5,"STEP":56,"WHEEL":[-124,30,16,10]};
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
