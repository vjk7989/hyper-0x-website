
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
function rect(cx, cy, len, wid, ang) {
  const c = Math.cos(ang);
  const s = Math.sin(ang);
  return [[-len / 2, -wid / 2], [len / 2, -wid / 2], [len / 2, wid / 2], [-len / 2, wid / 2]].map(([u, v]) => [cx + u * c - v * s, cy + u * s + v * c]);
}
const P = {"origin":[320,154.4540315704343],"scale":1.7240404933521365,"azimuth":45,"elevation":33};
const C = {"IN":225,"ROADS":[-12,45,102],"PIT":29,"END":70};
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
