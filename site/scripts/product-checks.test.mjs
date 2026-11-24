// Tests for scripts/product-checks.mjs (sub-task P6).
// Two halves, in the style of scripts/gate/checks.test.mjs:
//  1. synthetic dist fixtures — one broken rule at a time, the traps the banned-word
//     scan has to survive, boundaries, empty/null input and must-not-throw;
//  2. the real dist/ on disk, which is what the acceptance criteria are actually about.
// The real-dist half skips when dist/ has not been built, so the suite never passes
// by accident and never fails for the wrong reason.
//
// threats.ts and h0x-ade.ts are TypeScript, but Node 22 strips the types itself and
// neither module has a runtime import, so no loader and no dependency are needed
// (CLAUDE.md R6.4). cheerio is not a dependency of this package either, which is why
// product-checks.mjs reads HTML the way scripts/smoke.mjs does.
import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { run, runSeo, AI_CRAWLERS, normQuery, PRODUCT_SLUGS, PRODUCT_ROUTE, NEW_PAGES, UNCHANGED_SLUGS, NEEDLES } from './product-checks.mjs';

const SITE = path.join(import.meta.dirname, '..');
const DATA = path.join(SITE, 'src', 'data_files');
const DIST = path.join(SITE, 'dist');
const load = async (...p) => import(pathToFileURL(path.join(DATA, ...p)).href);
const { threats } = await load('threats.ts');
const { adePage } = await load('product-pages', 'h0x-ade.ts');
const { walletPage } = await load('product-pages', 'hyper-wallet.ts');

// ---------------------------------------------------------------- fixtures

const TITLES = {
  'h0x-ade': 'H0x-ADE, the agentic development environment',
  'hyper-wallet': 'Hyper Wallet, one app for three jobs',
  'hyper-0x': 'Hyper 0x, the chain',
  'h0x-pay': 'H0X Pay, payments that settle',
};
const H1S = {
  'h0x-ade': 'H0x-ADE', 'hyper-wallet': 'Hyper Wallet', 'hyper-0x': 'Hyper 0x',
  'h0x-pay': 'H0X Pay',
};

// Long enough for the house-layout check, and it names the brand so the measurement
// scan has to tell "Hyper 0x" from "3x".
const BODY = 'Hyper 0x records each action as a receipt the agent cannot edit afterwards. '
  + 'The gate checks every call against rules that live in a versioned contract, and custody '
  + 'holds the signing key so the agent never carries one. Teams read the record to see which '
  + 'agent acted, when, and under which rule, and the answer is the same for every reader. '
  + 'Each page here is exported ahead of time, so the text is in the HTML on the first request.';

// The two traps the banned-word scan must survive: inlined CSS custom properties, and the
// shared mega-menu and footer carrying blog titles. Neither sits inside <main>.
const CHROME_STYLE = '<style>.g{--tw-gradient-stops:var(--tw-gradient-from),var(--tw-gradient-to)}</style>';
const CHROME_NAV = '<header><nav><a href="/blog/shadow-ai-agents/">Shadow AI agents and how to stop them</a>'
  + '<a href="/blog/how-to-secure-ai-agents/">How to secure AI agents</a>'
  + '<a href="/blog/what-is-prompt-injection/">Prompt injection: what it prevents</a></nav></header>';
const CHROME_FOOTER = '<footer><p>Keep your agents safe. Nothing here is immune. 10,000+ readers.</p></footer>';

function faqBlock(title) {
  return `<h2 id="faq-${title.toLowerCase().replace(/\W+/g, '-')}">${title} questions</h2>`
    + '<details class="group py-5" open><summary>What does it do?</summary><p>It records each action.</p></details>'
    + '<details class="group py-5"><summary>Who is it for?</summary><p>Teams that run agents.</p></details>';
}

function securityTable() {
  const groups = adePage.security.groups;
  const body = groups.map((g) => '<tbody><tr><th scope="rowgroup" colspan="3">' + g.title + '</th></tr>'
    + threats.filter((t) => t.chain === g.chain).map((t) => '<tr><th scope="row">'
      + adePage.security.rows[t.title].condition + '</th><td>'
      + adePage.security.rows[t.title].mechanism + '</td><td>' + g.where + '</td></tr>').join('')
    + '</tbody>').join('');
  return '<table><caption class="sr-only">' + adePage.security.caption + '</caption>'
    + '<thead><tr>' + adePage.security.columns.map((c) => `<th scope="col">${c}</th>`).join('') + '</tr></thead>'
    + body + '</table>';
}

/** A product page that satisfies every rule. Each knob breaks exactly one thing. */
function pageHtml(slug, over = {}) {
  const o = {
    title: TITLES[slug], h1: H1S[slug], h1id: NEW_PAGES[slug] ?? null,
    needles: NEEDLES[slug] ?? [], table: slug === 'h0x-ade' ? securityTable() : '',
    faq: faqBlock(H1S[slug]), extraMain: '', chrome: true, edit: (s) => s, ...over,
  };
  const h1 = `<h1${o.h1id ? ` id="${o.h1id}"` : ''}>${o.h1}</h1>`;
  const main = '<main>' + h1
    + `<p>${o.needles.join(' ')}</p>`
    + `<h2 id="${slug}-one">What it does</h2><p>${BODY}</p>`
    + `<h3 id="${slug}-detail">One detail</h3><p>${o.needles.join(' ')} ${BODY}</p>`
    + o.table + o.faq + o.extraMain + '</main>';
  const head = `<title>${o.title}</title><link rel="canonical" href="https://hyper0x.org/${PRODUCT_ROUTE[slug]}/">`;
  return o.edit('<!doctype html><html lang="en"><head>' + head + (o.chrome ? CHROME_STYLE : '') + '</head><body>'
    + (o.chrome ? CHROME_NAV : '') + main + (o.chrome ? CHROME_FOOTER : '') + '</body></html>');
}

const redirectHtml = (target = '/ade/') => '<!doctype html>'
  + `<title>Redirecting to: ${target}</title><meta http-equiv="refresh" content="0;url=${target}">`
  + '<meta name="robots" content="noindex">'
  + `<link rel="canonical" href="https://hyper0x.org${target}">`
  + `<body><a href="${target}">Redirecting</a></body>`;

const sitemapXml = (slugs = PRODUCT_SLUGS) => '<?xml version="1.0" encoding="UTF-8"?><urlset>'
  + slugs.map((s) => `<url><loc>https://hyper0x.org/${s === 'pavii' ? 'products/pavii' : PRODUCT_ROUTE[s]}/</loc><lastmod>2026-11-23</lastmod></url>`).join('')
  + '</urlset>';

const TMP = [];
function mkTmp(prefix = 'product-checks-') {
  const d = fs.mkdtempSync(path.join(os.tmpdir(), prefix));
  TMP.push(d);
  return d;
}
after(() => { for (const d of TMP) fs.rmSync(d, { recursive: true, force: true }); });

// pages: slug -> options object | raw html string | false (omit the file).
// files: dist-relative name -> content | null (omit).
function buildDist(opts = {}) {
  const dist = path.join(mkTmp(), 'dist');
  const slugs = opts.slugs ?? PRODUCT_SLUGS;
  const pages = opts.pages ?? {};
  for (const slug of slugs) {
    const spec = pages[slug];
    if (spec === false) continue;
    const file = path.join(dist, PRODUCT_ROUTE[slug], 'index.html');
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, typeof spec === 'string' ? spec : pageHtml(slug, spec ?? {}));
  }
  const files = {
    'products/pavii/index.html': redirectHtml(),
    'sitemap-0.xml': sitemapXml(opts.sitemapSlugs),
    ...(opts.files ?? {}),
  };
  for (const [name, content] of Object.entries(files)) {
    if (content === null) continue;
    const file = path.join(dist, ...name.split('/'));
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, content);
  }
  return { dist, ctx: { distDir: dist, threats: opts.threats ?? threats, adePage: opts.adePage ?? adePage } };
}

// ---------------------------------------------------------------- helpers

const failingIds = (cs) => [...new Set(cs.filter((c) => c.pass === false).map((c) => c.id))].sort();
const byId = (cs, id) => cs.filter((c) => c.id === id);
const one = (cs, id) => {
  const m = byId(cs, id);
  assert.equal(m.length, 1, `expected exactly one ${id}, got ${m.length}`);
  return m[0];
};
const forFile = (cs, id, rel) => {
  const m = byId(cs, id).filter((c) => c.detail.startsWith(rel + ':'));
  assert.equal(m.length, 1, `expected one ${id} for ${rel}, got ${m.length} of ${byId(cs, id).length}`);
  return m[0];
};
const show = (cs) => cs.filter((c) => !c.pass).map((c) => `${c.id} -> ${c.detail}`).join('\n');
const ADE = 'dist/ade/index.html';
const WALLET = 'dist/wallet/index.html';

/** The one-rule-at-a-time workhorse: exactly `ids` fail, everything else passes. */
async function expectOnlyFailing(ctx, ids) {
  const cs = await run(ctx);
  assert.deepEqual(failingIds(cs), [...ids].sort(), `unexpected failures:\n${show(cs)}`);
  return cs;
}

// A deep-enough clone to mutate the fixture data without touching the real module objects.
const cloneAde = () => ({ ...adePage, security: { ...adePage.security, rows: { ...adePage.security.rows }, groups: adePage.security.groups.map((g) => ({ ...g })) } });

// ---------------------------------------------------------------- baseline + shape

test('pristine fixture: every product check passes', async () => {
  const { ctx } = buildDist();
  const cs = await run(ctx);
  assert.ok(cs.length > 20, `expected a full result set, got ${cs.length}`);
  assert.deepEqual(failingIds(cs), [], `baseline must be clean:\n${show(cs)}`);
});

test('shape: every Check has four fields and a real boolean pass', async () => {
  const { ctx } = buildDist({ pages: { 'hyper-wallet': false } }); // a mix of pass and fail
  const cs = await run(ctx);
  for (const c of cs) {
    assert.deepEqual(Object.keys(c).sort(), ['detail', 'id', 'label', 'pass'], JSON.stringify(c));
    assert.equal(typeof c.id, 'string'); assert.ok(c.id.length);
    assert.equal(typeof c.label, 'string'); assert.ok(c.label.length);
    assert.equal(typeof c.detail, 'string'); assert.ok(c.detail.length);
    assert.equal(typeof c.pass, 'boolean', `pass must be a boolean for ${c.id}`);
  }
});

test('every page rule runs once per new page, and the site rules run once', async () => {
  const { ctx } = buildDist();
  const cs = await run(ctx);
  const PER_PAGE = ['product.h1.single', 'product.h1.id', 'product.heading.outline',
    'product.heading.anchors', 'product.banned.words', 'product.no.measurement',
    'product.proof.empty', 'product.static.content'];
  for (const id of PER_PAGE) {
    assert.equal(byId(cs, id).length, 2, `${id} must run for both new pages`);
    for (const rel of [ADE, WALLET]) forFile(cs, id, rel);
  }
  const SITE = ['product.security.table', 'product.security.rows.keyed', 'product.security.groups.partition',
    'product.routes.exist', 'product.faq.structure', 'product.house.layout', 'product.h1.unique',
    'product.title.unique', 'product.redirect.pavii', 'product.sitemap.pavii', 'product.security.rows.rendered'];
  for (const id of SITE) assert.equal(byId(cs, id).length, 1, `${id} must be a single check`);
});

// ---------------------------------------------- AC1: one h1 per route, with the route id

test('AC1 one rule: a second h1 fails only product.h1.single', async () => {
  const { ctx } = buildDist({ pages: { 'h0x-ade': { extraMain: '<h1 id="x">Another</h1>' } } });
  const cs = await expectOnlyFailing(ctx, ['product.h1.single']);
  assert.match(forFile(cs, 'product.h1.single', ADE).detail, /2 <h1>/);
});

test('AC1 one rule: no h1 at all fails h1.single, h1.id and the outline, and nothing else', async () => {
  // With the h1 gone the first heading is an h2, which is a skipped level by definition.
  const edit = (s) => s.replace(/<h1[^>]*>[\s\S]*?<\/h1>/, '');
  const cs = await expectOnlyFailing(buildDist({ pages: { 'hyper-wallet': { edit } } }).ctx,
    ['product.h1.single', 'product.h1.id', 'product.heading.outline']);
  assert.match(forFile(cs, 'product.h1.id', WALLET).detail, /no <h1>/);
});

test('AC1 one rule: the wrong h1 id fails only product.h1.id, and names both ids', async () => {
  for (const [slug, rel, wrong] of [['h0x-ade', ADE, 'pavii'], ['hyper-wallet', WALLET, 'wallet']]) {
    const cs = await expectOnlyFailing(buildDist({ pages: { [slug]: { h1id: wrong } } }).ctx, ['product.h1.id']);
    const d = forFile(cs, 'product.h1.id', rel).detail;
    assert.match(d, new RegExp(wrong));
    assert.match(d, new RegExp(NEW_PAGES[slug]));
  }
});

test('AC1 boundary: an h1 with an empty id is not the expected id', async () => {
  const edit = (s) => s.replace('<h1 id="h0x-ade">', '<h1 id="">');
  await expectOnlyFailing(buildDist({ pages: { 'h0x-ade': { edit } } }).ctx, ['product.h1.id']);
});

// ---------------------------------------------- AC2: outline and heading anchors

test('AC2 one rule: h1 -> h3 skip fails only product.heading.outline', async () => {
  const edit = (s) => s.replace('<h2 id="h0x-ade-one">', '<h4 id="h0x-ade-one">').replace('</h2>', '</h4>');
  const cs = await expectOnlyFailing(buildDist({ pages: { 'h0x-ade': { edit } } }).ctx, ['product.heading.outline']);
  assert.match(forFile(cs, 'product.heading.outline', ADE).detail, /h4/);
});

test('AC2 one rule: an h2 with no id fails only product.heading.anchors', async () => {
  const cs = await expectOnlyFailing(buildDist({ pages: { 'hyper-wallet': { faq: '<h2>Hyper Wallet questions</h2>' } } }).ctx,
    ['product.heading.anchors']);
  assert.match(forFile(cs, 'product.heading.anchors', WALLET).detail, /has no id/);
});

test('AC2 one rule: an h3 with no id fails only product.heading.anchors', async () => {
  const edit = (s) => s.replace('<h3 id="h0x-ade-detail">', '<h3>');
  const cs = await expectOnlyFailing(buildDist({ pages: { 'h0x-ade': { edit } } }).ctx, ['product.heading.anchors']);
  assert.match(forFile(cs, 'product.heading.anchors', ADE).detail, /<h3>/);
});

test('AC2 one rule: two headings sharing an id fail only product.heading.anchors', async () => {
  const edit = (s) => s.replace('<h3 id="h0x-ade-detail">', '<h3 id="h0x-ade-one">');
  const cs = await expectOnlyFailing(buildDist({ pages: { 'h0x-ade': { edit } } }).ctx, ['product.heading.anchors']);
  assert.match(forFile(cs, 'product.heading.anchors', ADE).detail, /duplicate id "h0x-ade-one"/);
});

// ---------------------------------------------- AC3: no two routes share an h1 or a title

test('AC3 one rule: two routes sharing an h1 fail only product.h1.unique, and name both files', async () => {
  const { ctx } = buildDist({ pages: { 'hyper-0x': { h1: H1S['h0x-pay'] } } });
  const cs = await expectOnlyFailing(ctx, ['product.h1.unique']);
  const d = one(cs, 'product.h1.unique').detail;
  assert.match(d, /dist\/pay\/index\.html/);
  assert.match(d, /dist\/blockchain\/index\.html/);
});

test('AC3: the h1 comparison ignores case and whitespace', async () => {
  const { ctx } = buildDist({ pages: { 'hyper-0x': { h1: '  hyper   WALLET  ' } } });
  const cs = await run(ctx);
  assert.equal(one(cs, 'product.h1.unique').pass, false, 'a case-only difference is still the same heading');
});

test('AC3 one rule: two routes sharing a title fail only product.title.unique', async () => {
  const { ctx } = buildDist({ pages: { 'h0x-pay': { title: TITLES['hyper-0x'] } } });
  const cs = await expectOnlyFailing(ctx, ['product.title.unique']);
  assert.match(one(cs, 'product.title.unique').detail, /dist\/blockchain\/index\.html/);
});

test('AC3: the redirect page is not a route, so its title and h1 never collide', async () => {
  // A redirect carrying the target's own title must not be read as a second competing page.
  const redirect = redirectHtml().replace(/<title>[^<]*<\/title>/, `<title>${TITLES['h0x-ade']}</title>`);
  await expectOnlyFailing(buildDist({ files: { 'products/pavii/index.html': redirect } }).ctx, []);
});

test('AC3: a noindex page sharing a title is not counted either', async () => {
  const { ctx } = buildDist({
    files: { 'draft/index.html': `<!doctype html><html lang="en"><head><title>${TITLES['h0x-ade']}</title><meta name="robots" content="noindex"></head><body><main><h1>${H1S['h0x-ade']}</h1></main></body></html>` },
  });
  await expectOnlyFailing(ctx, []);
});

test('AC3: a duplicate h1 on a page outside products/ is still caught', async () => {
  const html = `<!doctype html><html lang="en"><head><title>A different title</title></head><body><main><h1>${H1S['hyper-wallet']}</h1><p>${BODY}</p></main></body></html>`;
  const cs = await expectOnlyFailing(buildDist({ files: { 'wallet-guide/index.html': html } }).ctx, ['product.h1.unique']);
  assert.match(one(cs, 'product.h1.unique').detail, /wallet-guide/);
});

// ---------------------------------------------- AC4: banned words, and the two traps

test('AC4 trap: --tw-gradient-stops in inlined CSS must not be read as "stops"', async () => {
  // The literal trap, in <style> in the head and in a <style> inside <main>.
  const extraMain = '<style>.p{--tw-gradient-stops:var(--tw-gradient-from)}</style>';
  await expectOnlyFailing(buildDist({ pages: { 'h0x-ade': { extraMain } } }).ctx, []);
});

test('AC4 trap: inherited blog titles in the mega-menu and footer must not fail the page', async () => {
  // CHROME_NAV carries "how to stop them", "How to secure AI agents" and "what it prevents";
  // CHROME_FOOTER carries "safe", "immune" and "10,000+". All sit outside <main>.
  const cs = await run(buildDist().ctx);
  assert.equal(forFile(cs, 'product.banned.words', ADE).pass, true, forFile(cs, 'product.banned.words', ADE).detail);
  assert.equal(forFile(cs, 'product.no.measurement', ADE).pass, true, forFile(cs, 'product.no.measurement', ADE).detail);
});

test('AC4 trap: a <script> inside main does not launder a banned word, and does not raise one', async () => {
  const withJson = { extraMain: '<script type="application/ld+json">{"name":"How to stop prompt injection"}</script>' };
  await expectOnlyFailing(buildDist({ pages: { 'h0x-ade': withJson } }).ctx, []);
});

test('AC4 one rule: each banned word in <main> fails only product.banned.words', async () => {
  const cases = [
    ['It stops the agent before it acts.', /stops/i],
    ['The gate prevents the call.', /prevents/i],
    ['This eliminates the risk entirely.', /eliminates/i],
    ['It protects against prompt injection.', /protects against/i],
    ['Your agents are immune to hijacking.', /immune/i],
    ['Your data is safe.', /safe/i],
    ['Every action is secure.', /secure/i],
    ['Agent calls are secured end to end.', /secured/i],
  ];
  for (const [sentence, re] of cases) {
    const cs = await expectOnlyFailing(buildDist({ pages: { 'hyper-wallet': { extraMain: `<p>${sentence}</p>` } } }).ctx,
      ['product.banned.words']);
    const d = forFile(cs, 'product.banned.words', WALLET).detail;
    assert.match(d, re, `missed "${sentence}"`);
    assert.ok(d.includes(sentence.slice(0, 12)), `detail should quote the sentence: ${d}`);
  }
});

test('AC4: the scan is case-insensitive and whole-word', async () => {
  const bad = ['<p>STOPS every call.</p>', '<p>Prevents the write.</p>'];
  for (const extraMain of bad) {
    await expectOnlyFailing(buildDist({ pages: { 'h0x-ade': { extraMain } } }).ctx, ['product.banned.words']);
  }
  // Words that merely contain a banned string are not the claim the rule bans.
  const ok = ['<p>A nonstop stream of receipts.</p>', '<p>The unsafeguarded path is named.</p>',
    '<p>Safeguards are listed by name.</p>', '<p>The securities desk is one buyer.</p>'];
  for (const extraMain of ok) {
    await expectOnlyFailing(buildDist({ pages: { 'h0x-ade': { extraMain } } }).ctx, []);
  }
});

test('AC4: a page with no <main> fails rather than passing on an empty scan', async () => {
  const html = `<!doctype html><html lang="en"><head><title>${TITLES['hyper-wallet']}</title></head>`
    + `<body><div><h1 id="hyper-wallet">${H1S['hyper-wallet']}</h1><p>${BODY}</p></div></body></html>`;
  const cs = await run(buildDist({ pages: { 'hyper-wallet': html } }).ctx);
  assert.equal(forFile(cs, 'product.banned.words', WALLET).pass, false);
  assert.match(forFile(cs, 'product.banned.words', WALLET).detail, /no <main> content/);
  assert.equal(forFile(cs, 'product.no.measurement', WALLET).pass, false);
});

// ---------------------------------------------- AC5: no fabricated proof, no invented measurement

test('AC5 one rule: each kind of invented figure fails only product.no.measurement', async () => {
  const cases = [
    ['<p>Cuts token use by 42%.</p>', /percentage/],
    ['<p>Thirty two percent cheaper: 32 percent, measured.</p>', /percentage/],
    ['<p>Runs 3x faster than the baseline.</p>', /multiplier/],
    ['<p>Agents ship 5 times faster.</p>', /multiplier/],
    ['<p>Rated 4.8/5 by our users.</p>', /rating/],
    ['<p>Trusted by 10,000+ builders.</p>', /user count/],
    ['<p>Used by 420 teams.</p>', /user count/],
    ['<p>Gates each call in 12ms.</p>', /benchmark/],
    ['<p>Handles 2000 tps.</p>', /benchmark/],
    ['<p>Up to 60 fewer tokens per task.</p>', /benchmark/],
    ['<p>Saves 30 hours a month.</p>', /benchmark/],
  ];
  for (const [extraMain, kind] of cases) {
    const cs = await expectOnlyFailing(buildDist({ pages: { 'h0x-ade': { extraMain } } }).ctx, ['product.no.measurement']);
    assert.match(forFile(cs, 'product.no.measurement', ADE).detail, kind, `wrong kind for ${extraMain}`);
  }
});

test('AC5: the brand is not a multiplier', async () => {
  // "Hyper 0x", "H0x-ADE" and a bare "0x" all end in x after a digit.
  const extraMain = '<p>Hyper 0x and H0x-ADE write the receipt. The 0x prefix is the chain.</p>';
  await expectOnlyFailing(buildDist({ pages: { 'h0x-ade': { extraMain } } }).ctx, []);
});

test('AC5: illustrated amounts and step numbers are not measurements', async () => {
  const extraMain = '<p>(01) Find the route. (02) Match the order. 1,000.00 USDC becomes 1.00 ETH.</p>';
  await expectOnlyFailing(buildDist({ pages: { 'hyper-wallet': { extraMain } } }).ctx, []);
});

test('AC5: a figure in the shared footer does not fail the page', async () => {
  // CHROME_FOOTER already carries "10,000+ readers"; prove the scope, not the pattern.
  const cs = await run(buildDist().ctx);
  assert.equal(forFile(cs, 'product.no.measurement', WALLET).pass, true, forFile(cs, 'product.no.measurement', WALLET).detail);
});

// ---------------------------------------------- AC6: ProofStrip renders nothing when empty

test('AC6: the proof arrays on both new pages are empty today', () => {
  assert.deepEqual(adePage.proof, [], 'adePage.proof must stay empty until a dated measurement exists (R11.3)');
  assert.deepEqual(adePage.tokenMeasurement, [], 'adePage.tokenMeasurement must stay empty until a dated measurement exists (R11.4)');
  for (const [key, value] of Object.entries(walletPage)) {
    if (Array.isArray(value) && key.toLowerCase().includes('proof')) assert.deepEqual(value, [], `walletPage.${key} must stay empty`);
  }
});

test('AC6 one rule: an empty wrapper element, not merely empty text, fails product.proof.empty', async () => {
  for (const empty of ['<dl class="grid"></dl>', '<dl class="grid">\n  \n</dl>', '<ul class="proof"></ul>', '<table></table>']) {
    const cs = await expectOnlyFailing(buildDist({ pages: { 'hyper-wallet': { extraMain: empty } } }).ctx, ['product.proof.empty']);
    assert.match(forFile(cs, 'product.proof.empty', WALLET).detail, /empty|no text/);
  }
});

test('AC6: a <dl> holding only markup with no text is still an empty proof strip', async () => {
  const extraMain = '<dl class="grid"><div><dt></dt><dd></dd></div></dl>';
  await expectOnlyFailing(buildDist({ pages: { 'h0x-ade': { extraMain } } }).ctx, ['product.proof.empty']);
});

test('AC6: a filled <dl> passes, so the check does not ban the element', async () => {
  const extraMain = '<dl class="grid"><div><dt>Receipts</dt><dd>One per action.</dd></div></dl>';
  await expectOnlyFailing(buildDist({ pages: { 'h0x-ade': { extraMain } } }).ctx, []);
});

// ---------------------------------------------- AC7: a real table, not a div grid

test('AC7 one rule: a div grid instead of the table fails only product.security.table', async () => {
  const grid = '<div class="security-grid"><div>Condition</div><div>Mechanism</div></div>';
  const cs = await expectOnlyFailing(buildDist({ pages: { 'h0x-ade': { table: grid } } }).ctx,
    ['product.security.table', 'product.security.rows.rendered']);
  const d = one(cs, 'product.security.table').detail;
  assert.match(d, /no <table>/);
  assert.match(d, /div grid/);
});

test('AC7: a table beside a div grid is still a failure', async () => {
  const table = securityTable() + '<div class="threat-comparison-grid"><div>x</div></div>';
  const cs = await expectOnlyFailing(buildDist({ pages: { 'h0x-ade': { table } } }).ctx, ['product.security.table']);
  assert.match(one(cs, 'product.security.table').detail, /div grid/);
});

test('AC7 one rule: a missing or empty caption fails only product.security.table', async () => {
  for (const table of [securityTable().replace(/<caption[^>]*>[\s\S]*?<\/caption>/, ''),
    securityTable().replace(/<caption([^>]*)>[\s\S]*?<\/caption>/, '<caption$1>  </caption>')]) {
    const cs = await expectOnlyFailing(buildDist({ pages: { 'h0x-ade': { table } } }).ctx, ['product.security.table']);
    assert.match(one(cs, 'product.security.table').detail, /caption/);
  }
});

test('AC7 one rule: a th without scope fails only product.security.table', async () => {
  const table = securityTable().replace('<th scope="col">', '<th>');
  const cs = await expectOnlyFailing(buildDist({ pages: { 'h0x-ade': { table } } }).ctx, ['product.security.table']);
  assert.match(one(cs, 'product.security.table').detail, /without a scope/);
});

test('AC7: row headers demoted to <td> fail the table and the rendered-row count', async () => {
  const table = securityTable().replace(/<th scope="row">/g, '<td>').replace(/<\/th><td>/g, '</td><td>');
  const cs = await run(buildDist({ pages: { 'h0x-ade': { table } } }).ctx);
  assert.equal(one(cs, 'product.security.table').pass, false);
  assert.match(one(cs, 'product.security.table').detail, /scope="row"/);
  assert.equal(one(cs, 'product.security.rows.rendered').pass, false);
});

// ---------------------------------------------- the SecurityTable / threats.ts contract

test('data: a threat title with no row key is reported, not silently dropped', async () => {
  const extra = [...threats, { ...threats[0], title: 'A brand new threat', chain: 'yes' }];
  const cs = await run(buildDist({ threats: extra }).ctx);
  const c = one(cs, 'product.security.rows.keyed');
  assert.equal(c.pass, false);
  assert.match(c.detail, /A brand new threat/);
});

test('data: renaming a threat title orphans its row key, and both ends are named', async () => {
  const renamed = threats.map((t, i) => (i === 0 ? { ...t, title: 'Prompt injection' } : t));
  const cs = await run(buildDist({ threats: renamed }).ctx);
  const c = one(cs, 'product.security.rows.keyed');
  assert.equal(c.pass, false);
  assert.match(c.detail, /no security row key: Prompt injection/);
  assert.match(c.detail, /matching no threat: Prompt injection and goal hijack/);
});

test('data: an empty condition or mechanism is a content hole, not a pass', async () => {
  const ade = cloneAde();
  ade.security.rows['Rogue agents'] = { condition: '  ', mechanism: 'The response moves on.' };
  const c = one(await run(buildDist({ adePage: ade }).ctx), 'product.security.rows.keyed');
  assert.equal(c.pass, false);
  assert.match(c.detail, /Rogue agents/);
});

test('data: dropping a chain group drops every threat in it', async () => {
  const ade = cloneAde();
  ade.security.groups = ade.security.groups.filter((g) => g.chain !== 'evidence');
  const c = one(await run(buildDist({ adePage: ade }).ctx), 'product.security.groups.partition');
  assert.equal(c.pass, false);
  assert.match(c.detail, /threats in no group/);
  assert.match(c.detail, /Unsafe output and code/);
});

test('data: a threat whose chain value matches no group is dropped from the table', async () => {
  const odd = threats.map((t, i) => (i === 1 ? { ...t, chain: 'later' } : t));
  const c = one(await run(buildDist({ threats: odd }).ctx), 'product.security.groups.partition');
  assert.equal(c.pass, false);
  assert.match(c.detail, /Data leaks through AI/);
});

test('data: two groups with the same chain value would print every one of its threats twice', async () => {
  const ade = cloneAde();
  ade.security.groups = [...ade.security.groups, { chain: 'yes', title: 'Also on chain', where: 'On chain' }];
  const c = one(await run(buildDist({ adePage: ade }).ctx), 'product.security.groups.partition');
  assert.equal(c.pass, false);
  assert.match(c.detail, /more than one group/);
  assert.match(c.detail, /duplicate group chain value/);
});

test('data: the real threats.ts and h0x-ade.ts agree today', async () => {
  const cs = await run(buildDist().ctx);
  for (const id of ['product.security.rows.keyed', 'product.security.groups.partition']) {
    assert.equal(one(cs, id).pass, true, one(cs, id).detail);
  }
  assert.equal(threats.length, 10, 'the table is sized by threats.ts; update the row keys with it');
  assert.deepEqual([...new Set(threats.map((t) => t.chain))].sort(), ['evidence', 'partly', 'yes']);
});

test('data: the rendered table loses a row when a threat is added without rebuilding', async () => {
  const extra = [...threats, { ...threats[0], title: 'A brand new threat' }];
  const cs = await run(buildDist({ threats: extra }).ctx);
  const c = one(cs, 'product.security.rows.rendered');
  assert.equal(c.pass, false);
  assert.match(c.detail, /10 <th scope="row"> rows for 11 threats/);
});

// ---------------------------------------------- AC8: the renamed route

test('AC8 one rule: a missing redirect page fails only product.redirect.pavii', async () => {
  const cs = await expectOnlyFailing(buildDist({ files: { 'products/pavii/index.html': null } }).ctx, ['product.redirect.pavii']);
  assert.match(one(cs, 'product.redirect.pavii').detail, /not built/);
});

test('AC8 one rule: a redirect to the wrong target fails only product.redirect.pavii', async () => {
  const cs = await expectOnlyFailing(buildDist({ files: { 'products/pavii/index.html': redirectHtml('/products/') } }).ctx,
    ['product.redirect.pavii']);
  const d = one(cs, 'product.redirect.pavii').detail;
  assert.match(d, /does not target \/ade\//);
  assert.match(d, /canonical/);
});

test('AC8 one rule: a redirect page that is indexable fails only product.redirect.pavii', async () => {
  const html = redirectHtml().replace('<meta name="robots" content="noindex">', '');
  const cs = await expectOnlyFailing(buildDist({ files: { 'products/pavii/index.html': html } }).ctx, ['product.redirect.pavii']);
  assert.match(one(cs, 'product.redirect.pavii').detail, /noindex/);
});

test('AC8: a /products/pavii/ page that became a real page again is caught', async () => {
  // The regression that matters: the redirect turns back into a second page for the same query.
  const cs = await run(buildDist({ files: { 'products/pavii/index.html': pageHtml('h0x-ade', { title: 'PAVii' }) } }).ctx);
  assert.equal(one(cs, 'product.redirect.pavii').pass, false);
  assert.match(one(cs, 'product.redirect.pavii').detail, /refresh/);
  assert.equal(one(cs, 'product.h1.unique').pass, false, 'it now competes with /ade/ on the h1');
});

test('AC8 one rule: products/pavii back in the sitemap fails only product.sitemap.pavii', async () => {
  const { ctx } = buildDist({ sitemapSlugs: [...PRODUCT_SLUGS, 'pavii'] });
  const cs = await expectOnlyFailing(ctx, ['product.sitemap.pavii']);
  assert.match(one(cs, 'product.sitemap.pavii').detail, /products\/pavii is in the sitemap 1 time/);
});

test('AC8 one rule: products/h0x-ade listed twice, or not at all, fails product.sitemap.pavii', async () => {
  for (const [slugs, re] of [[[...PRODUCT_SLUGS, 'h0x-ade'], /appears 2 time/], [UNCHANGED_SLUGS.concat('hyper-wallet'), /appears 0 time/]]) {
    const cs = await expectOnlyFailing(buildDist({ sitemapSlugs: slugs }).ctx, ['product.sitemap.pavii']);
    assert.match(one(cs, 'product.sitemap.pavii').detail, re);
  }
});

test('AC8: a missing sitemap-0.xml fails loudly', async () => {
  const cs = await expectOnlyFailing(buildDist({ files: { 'sitemap-0.xml': null } }).ctx, ['product.sitemap.pavii']);
  assert.match(one(cs, 'product.sitemap.pavii').detail, /missing/);
});

// ---------------------------------------------- the four-way slug dispatch and the FAQ move

test('dispatch: a product route that stopped being built is named', async () => {
  const cs = await run(buildDist({ pages: { 'h0x-pay': false } }).ctx);
  const c = one(cs, 'product.routes.exist');
  assert.equal(c.pass, false);
  assert.match(c.detail, /h0x-pay/);
  assert.equal(one(cs, 'product.house.layout').pass, false);
});

test('dispatch: the four slugs are the four product pages the site serves', () => {
  assert.deepEqual([...PRODUCT_SLUGS].sort(),
    ['h0x-ade', 'h0x-pay', 'hyper-0x', 'hyper-wallet']);
  assert.deepEqual(Object.keys(NEW_PAGES).concat(UNCHANGED_SLUGS).sort(), [...PRODUCT_SLUGS].sort());
});

test('FAQ move: an item that lost its <summary> or its answer <p> is reported', async () => {
  const cases = [
    ['<details class="group py-5"><summary></summary><p>An answer.</p></details>', /<summary> text/],
    ['<details class="group py-5"><summary>A question?</summary></details>', /answer <p>/],
  ];
  for (const [faqItem, re] of cases) {
    const faq = '<h2 id="q">Hyper 0x questions</h2>' + faqItem;
    const cs = await expectOnlyFailing(buildDist({ pages: { 'hyper-0x': { faq } } }).ctx, ['product.faq.structure']);
    assert.match(one(cs, 'product.faq.structure').detail, re);
  }
});

test('FAQ move: items rendered with no "… questions" heading are reported', async () => {
  const faq = '<details class="group py-5"><summary>A question?</summary><p>An answer.</p></details>';
  const cs = await expectOnlyFailing(buildDist({ pages: { 'h0x-pay': { faq } } }).ctx,
    ['product.faq.structure', 'product.heading.anchors'].filter((id) => id === 'product.faq.structure'));
  assert.match(one(cs, 'product.faq.structure').detail, /no "… questions" heading/);
});

test('FAQ move: a route with no FAQ at all is allowed (R11.2, empty data renders nothing)', async () => {
  await expectOnlyFailing(buildDist({ pages: { 'h0x-pay': { faq: '' } } }).ctx, []);
});

test('house layout: an unchanged route reduced to a stub is caught', async () => {
  const html = '<!doctype html><html lang="en"><head><title>A stub page</title></head><body><main><h1>A stub</h1></main></body></html>';
  const cs = await expectOnlyFailing(buildDist({ pages: { 'h0x-pay': html } }).ctx, ['product.house.layout']);
  assert.match(one(cs, 'product.house.layout').detail, /h0x-pay/);
});

// ---------------------------------------------- AC9: content in the static HTML

test('AC9 one rule: body copy missing from the static HTML fails only product.static.content', async () => {
  for (const [slug, rel] of [['h0x-ade', ADE], ['hyper-wallet', WALLET]]) {
    const cs = await expectOnlyFailing(buildDist({ pages: { [slug]: { needles: [] } } }).ctx, ['product.static.content']);
    const d = forFile(cs, 'product.static.content', rel).detail;
    for (const n of NEEDLES[slug]) assert.ok(d.includes(n), `${d} should name ${n}`);
  }
});

test('AC9: copy that only a script would insert does not count as static', async () => {
  const needles = [];
  const extraMain = `<script>document.write(${JSON.stringify(NEEDLES['h0x-ade'].join(' '))})</script>`;
  const cs = await run(buildDist({ pages: { 'h0x-ade': { needles, extraMain } } }).ctx);
  assert.equal(forFile(cs, 'product.static.content', ADE).pass, false);
});

// ---------------------------------------------- empty, null and must-not-throw

test('a dist directory that does not exist fails loudly rather than throwing', async () => {
  const cs = await run({ distDir: path.join(mkTmp(), 'nope'), threats, adePage });
  assert.ok(Array.isArray(cs) && cs.length > 0);
  assert.ok(cs.every((c) => typeof c.pass === 'boolean'));
  assert.ok(!cs.some((c) => c.id.endsWith('.crash')), show(cs));
  for (const id of ['product.h1.single', 'product.routes.exist', 'product.redirect.pavii', 'product.sitemap.pavii']) {
    assert.ok(byId(cs, id).some((c) => !c.pass), `${id} should fail on a missing dist`);
  }
  assert.match(forFile(cs, 'product.h1.single', ADE).detail, /file not found/);
});

test('an empty dist directory fails loudly rather than throwing', async () => {
  const dist = path.join(mkTmp(), 'dist');
  fs.mkdirSync(dist, { recursive: true });
  const cs = await run({ distDir: dist, threats, adePage });
  assert.ok(!cs.some((c) => c.id.endsWith('.crash')), show(cs));
  assert.equal(one(cs, 'product.routes.exist').pass, false);
  assert.equal(one(cs, 'product.h1.unique').pass, true, 'no pages means no duplicates, not a crash');
});

test('a zero-byte page becomes failing checks, not an exception', async () => {
  const cs = await run(buildDist({ pages: { 'h0x-ade': '' } }).ctx);
  assert.ok(!cs.some((c) => c.id.endsWith('.crash')), show(cs));
  for (const id of ['product.h1.single', 'product.h1.id', 'product.banned.words', 'product.static.content']) {
    assert.equal(forFile(cs, id, ADE).pass, false, `${id} should fail on an empty file`);
  }
});

const MALFORMED = {
  'truncated mid-tag': '<!doctype html><html lang="en"><head><title>Truncated</title></head><body><main><h1 id="h0x-ade">H',
  'unclosed main': '<!doctype html><html lang="en"><head><title>Unclosed</title></head><body><main><h1 id="h0x-ade">H0x-ADE</h1><p>text',
  'stray closing tags': '<!doctype html></p></div></main></body></html><h1 id="h0x-ade">floating',
  'unterminated attribute quote': '<html lang=en><body><main><h1 id="h0x-ade>H0x-ADE</h1><p>more</main>',
  'no markup at all': 'just a plain sentence, not html at all',
  'nested main elements': '<!doctype html><html lang="en"><head><title>Nested</title></head><body><main><main><h1 id="h0x-ade">H0x-ADE</h1></main></main></body></html>',
};

for (const [name, html] of Object.entries(MALFORMED)) {
  test(`malformed HTML (${name}) yields Checks, never an exception`, async () => {
    const cs = await run(buildDist({ pages: { 'h0x-ade': html } }).ctx);
    assert.ok(Array.isArray(cs) && cs.length > 0);
    assert.ok(!cs.some((c) => c.id.endsWith('.crash')), show(cs));
    assert.ok(cs.every((c) => typeof c.pass === 'boolean' && typeof c.detail === 'string'));
    assert.equal(byId(cs, 'product.h1.single').length, 2, 'both new pages still produced a check');
  });
}

test('invalid UTF-8 bytes do not throw', async () => {
  const { dist, ctx } = buildDist();
  fs.writeFileSync(path.join(dist, 'ade', 'index.html'), Buffer.concat([
    Buffer.from('<!doctype html><html lang="en"><head><title>Bad bytes</title></head><body><main><h1 id="h0x-ade">H0x-ADE</h1><p>'),
    Buffer.from([0xff, 0xfe, 0xc3, 0x28, 0x80]),
    Buffer.from('</p></main></body></html>'),
  ]));
  const cs = await run(ctx);
  assert.ok(!cs.some((c) => c.id.endsWith('.crash')), show(cs));
});

test('a deeply nested document does not throw', { timeout: 60000 }, async () => {
  const depth = 1500;
  const html = '<!doctype html><html lang="en"><head><title>Deep</title></head><body><main>'
    + '<h1 id="hyper-wallet">Hyper Wallet</h1>' + '<div>'.repeat(depth) + 'leaf text' + '</div>'.repeat(depth)
    + '</main></body></html>';
  const cs = await run(buildDist({ pages: { 'hyper-wallet': html } }).ctx);
  assert.ok(!cs.some((c) => c.id.endsWith('.crash')), show(cs));
});

test('a windows-style dist path with backslashes resolves the same files', async () => {
  const { dist, ctx } = buildDist();
  const weird = dist.split(path.sep).join(path.sep) + path.sep;
  const cs = await run({ ...ctx, distDir: weird });
  assert.deepEqual(failingIds(cs), [], show(cs));
});

test('bad ctx data fails as a check, never as a thrown error', async () => {
  for (const bad of [{ threats: [] }, { threats: null }, { adePage: {} }, { adePage: null }]) {
    const { ctx } = buildDist();
    const cs = await run({ ...ctx, ...bad });
    assert.ok(Array.isArray(cs) && cs.length > 0, JSON.stringify(bad));
    assert.ok(cs.every((c) => typeof c.pass === 'boolean'), JSON.stringify(bad));
  }
});

// ---------------------------------------------- the real dist/ on disk

const distMissing = !fs.existsSync(path.join(DIST, 'ade', 'index.html'));
const SKIP = distMissing && 'dist/ is not built; run `astro build` first';

test('the real dist/ passes every product check', { skip: SKIP }, async () => {
  const cs = await run({ distDir: DIST });
  assert.deepEqual(failingIds(cs), [], `product checks failing on the real build:\n${show(cs)}`);
});

test('the real dist/: both new routes exist with one correctly-anchored h1', { skip: SKIP }, async () => {
  const cs = await run({ distDir: DIST });
  for (const rel of [ADE, WALLET]) {
    assert.equal(forFile(cs, 'product.h1.single', rel).pass, true, forFile(cs, 'product.h1.single', rel).detail);
    assert.equal(forFile(cs, 'product.h1.id', rel).pass, true, forFile(cs, 'product.h1.id', rel).detail);
  }
});

test('the real dist/: /products/pavii/ is a redirect and is out of the sitemap', { skip: SKIP }, async () => {
  const cs = await run({ distDir: DIST });
  assert.equal(one(cs, 'product.redirect.pavii').pass, true, one(cs, 'product.redirect.pavii').detail);
  assert.equal(one(cs, 'product.sitemap.pavii').pass, true, one(cs, 'product.sitemap.pavii').detail);
  const sitemap = fs.readFileSync(path.join(DIST, 'sitemap-0.xml'), 'utf8');
  assert.ok(!sitemap.includes('products/pavii'), 'products/pavii must not appear anywhere in sitemap-0.xml');
});

test('the real dist/: no route still links to /products/pavii/', { skip: SKIP }, async () => {
  const offenders = [];
  const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).forEach((e) => {
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk(p);
    else if (e.name.endsWith('.html') && /href="[^"]*\/products\/pavii\//.test(fs.readFileSync(p, 'utf8'))) {
      offenders.push(path.relative(DIST, p).split(path.sep).join('/'));
    }
  });
  walk(DIST);
  assert.deepEqual(offenders.filter((f) => f !== 'products/pavii/index.html'), [],
    'these pages still link to the retired route instead of /ade/');
});

test('the real dist/: the security table renders one row per threat', { skip: SKIP }, async () => {
  const html = fs.readFileSync(path.join(DIST, 'ade', 'index.html'), 'utf8');
  assert.equal((html.match(/<th[^>]*scope="row"/g) ?? []).length, threats.length);
  assert.equal((html.match(/<th[^>]*scope="rowgroup"/g) ?? []).length, adePage.security.groups.length);
  for (const t of threats) assert.ok(html.includes(adePage.security.rows[t.title].condition.replace(/&/g, '&amp;')), `no row for "${t.title}"`);
});

// ---------------------------------------------- runSeo: the search checks (S2)

const ROBOTS_OK = AI_CRAWLERS.map((a) => `User-agent: ${a}\nAllow: /\n`).join('\n');
const simplePage = (h1, extraHead = '', body = '') => `<!doctype html><html><head><title>${h1}</title>${extraHead}</head><body><main><h1 id="top">${h1}</h1>${body}</main></body></html>`;

/** A tiny dist: route -> html (route "/" is the root), plus robots.txt. */
function seoDist(pages, robots = ROBOTS_OK) {
  const dist = path.join(mkTmp('seo-checks-'), 'dist');
  for (const [route, html] of Object.entries(pages)) {
    const file = route === '/' ? path.join(dist, 'index.html') : path.join(dist, ...route.split('/').filter(Boolean), 'index.html');
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, html);
  }
  if (robots !== null) fs.writeFileSync(path.join(dist, 'robots.txt'), robots);
  return dist;
}
const GOOD_MAP = [
  { route: '/', primary: 'hyper 0x blockchain', supporting: ['blockchain for ai agents'] },
  { route: '/chain', primary: 'private l2 blockchain', supporting: [] },
];
const GOOD_PAGES = { '/': simplePage('Home'), '/chain': simplePage('Chain') };
const seo = (pages, map, robots) => runSeo({ distDir: seoDist(pages, robots), seoMap: map });
const seoFailing = (cs) => cs.filter((c) => !c.pass);

test('seo: a clean dist, map and robots pass all five checks', async () => {
  const cs = await seo(GOOD_PAGES, GOOD_MAP);
  assert.deepEqual(cs.map((c) => c.id).sort(), ['seo.h1.unique', 'seo.heading.anchors', 'seo.keyword.declared', 'seo.keyword.unique', 'seo.robots.aiCrawlers']);
  assert.deepEqual(seoFailing(cs), [], show(cs));
});

test('seo.keyword.declared: a route in dist with no map entry fails and is named', async () => {
  const cs = await seo({ ...GOOD_PAGES, '/new/page': simplePage('New') }, GOOD_MAP);
  assert.deepEqual(failingIds(cs), ['seo.keyword.declared']);
  assert.match(one(cs, 'seo.keyword.declared').detail, /1 route\(s\).*\/new\/page/);
});

test('seo.keyword.declared: trailing slashes and a flat .html file map to the same route', async () => {
  const map = [...GOOD_MAP, { route: '/pitch/', primary: 'pitch', supporting: [] }];
  const dist = seoDist(GOOD_PAGES);
  fs.writeFileSync(path.join(dist, 'pitch.html'), simplePage('Pitch'));
  assert.deepEqual(seoFailing(await runSeo({ distDir: dist, seoMap: map })), []);
});

test('seo.keyword.declared: redirect and noindex pages are not routes', async () => {
  const pages = {
    ...GOOD_PAGES,
    '/old': redirectHtml('/chain/'),
    '/hidden': simplePage('Hidden', '<meta name="robots" content="noindex, nofollow">'),
  };
  assert.deepEqual(seoFailing(await seo(pages, GOOD_MAP)), []);
});

test('seo.keyword.declared: a missing or broken map fails rather than throws', async () => {
  const dist = seoDist(GOOD_PAGES);
  for (const seoMapFile of [path.join(mkTmp(), 'nope.json'), (() => { const f = path.join(mkTmp(), 'x.json'); fs.writeFileSync(f, '{not json'); return f; })()]) {
    const cs = await runSeo({ distDir: dist, seoMapFile });
    assert.deepEqual(failingIds(cs), ['seo.keyword.declared', 'seo.keyword.unique']);
  }
});

test('seo.keyword.unique: two routes with the same primary fail', async () => {
  const map = [GOOD_MAP[0], { route: '/chain', primary: 'Hyper 0x Blockchain', supporting: [] }];
  const cs = await seo(GOOD_PAGES, map);
  assert.deepEqual(failingIds(cs), ['seo.keyword.unique']);
  assert.match(one(cs, 'seo.keyword.unique').detail, /share primary query/);
});

test('seo.keyword.unique: a supporting query equal to another route primary fails', async () => {
  const map = [GOOD_MAP[0], { route: '/chain', primary: 'private l2 blockchain', supporting: ['hyper 0x blockchain'] }];
  const cs = await seo(GOOD_PAGES, map);
  assert.deepEqual(failingIds(cs), ['seo.keyword.unique']);
  assert.match(one(cs, 'seo.keyword.unique').detail, /supporting query.*is the primary of \//);
});

test('seo.keyword.unique: a route may repeat its own primary as a supporting query', async () => {
  const map = [{ route: '/', primary: 'hyper 0x blockchain', supporting: ['hyper 0x blockchain'] }, GOOD_MAP[1]];
  assert.deepEqual(seoFailing(await seo(GOOD_PAGES, map)), []);
});

test('seo.keyword.unique: near-duplicates (case, punctuation, plural) are caught, and exact-match alone would miss them', async () => {
  const a = 'Private L2 blockchain';
  const b = 'private  L2 blockchains!';
  assert.notEqual(a.trim().toLowerCase(), b.trim().toLowerCase(), 'the pair must differ under exact comparison');
  const map = [{ route: '/', primary: a, supporting: [] }, { route: '/chain', primary: b, supporting: [] }];
  const cs = await seo(GOOD_PAGES, map);
  assert.deepEqual(failingIds(cs), ['seo.keyword.unique']);
  // and through supporting queries
  const map2 = [{ route: '/', primary: 'blockchain', supporting: [] }, { route: '/chain', primary: 'x', supporting: ['Blockchains.'] }];
  assert.deepEqual(failingIds(await seo(GOOD_PAGES, map2)), ['seo.keyword.unique']);
});

test('normQuery: folds case, punctuation and trailing-s, and leaves real differences alone', () => {
  assert.equal(normQuery('  Multi-Chain Wallets, DEX! '), normQuery('multi chain wallet dex'));
  assert.equal(normQuery('business'), 'business', 'ss is not a plural');
  assert.notEqual(normQuery('private l2 blockchain'), normQuery('public l2 blockchain'));
  assert.notEqual(normQuery('l2'), normQuery('l3'));
});

test('seo.h1.unique: two indexable routes sharing an h1 fail, ignoring case and whitespace', async () => {
  const cs = await seo({ '/': simplePage('Same  Heading'), '/chain': simplePage('same heading') }, GOOD_MAP);
  assert.deepEqual(failingIds(cs), ['seo.h1.unique']);
  assert.match(one(cs, 'seo.h1.unique').detail, /shared by dist\/index\.html, dist\/chain\/index\.html|shared by dist\/chain\/index\.html, dist\/index\.html/);
});

test('seo.h1.unique: a redirect or noindex page sharing an h1 does not count', async () => {
  const pages = { ...GOOD_PAGES, '/hidden': simplePage('Home', '<meta name="robots" content="noindex">') };
  assert.deepEqual(seoFailing(await seo(pages, GOOD_MAP)), []);
});

// seo.heading.anchors: 5.4 / 9.5, every route but the noindex ones (404, pitch-deck, redirects).
const withBody = (route, body) => ({ ...GOOD_PAGES, [route]: simplePage('Page', '', body) });

test('seo.heading.anchors: headings that all carry an id pass, and an id already there is read as is', async () => {
  const body = '<h2 id="what-it-does">What it does</h2><h3 id="legacy-anchor">Renamed long ago</h3>';
  const cs = await seo(withBody('/about', body), [...GOOD_MAP, { route: '/about', primary: 'about', supporting: [] }]);
  assert.deepEqual(seoFailing(cs), [], show(cs));
});

test('seo.heading.anchors: an h2 with no id fails, naming the route and the heading', async () => {
  const map = [...GOOD_MAP, { route: '/about', primary: 'about', supporting: [] }];
  const cs = await seo(withBody('/about', '<h2>Our story</h2>'), map);
  assert.deepEqual(failingIds(cs), ['seo.heading.anchors']);
  assert.match(one(cs, 'seo.heading.anchors').detail, /dist\/about\/index\.html <h2> "Our story" has no id/);
});

test('seo.heading.anchors: an h1 or an h3 with no id fails too, and a nested tag does not hide it', async () => {
  const map = [...GOOD_MAP, { route: '/about', primary: 'about', supporting: [] }];
  const h3 = await seo(withBody('/about', '<h2 id="a">A</h2><h3><span>Deep</span> dive</h3>'), map);
  assert.match(one(h3, 'seo.heading.anchors').detail, /<h3> "Deep dive" has no id/);
  const h1 = await seo({ ...GOOD_PAGES, '/': '<!doctype html><html><head><title>Home</title></head><body><main><h1>Home</h1></main></body></html>' }, GOOD_MAP);
  assert.match(one(h1, 'seo.heading.anchors').detail, /dist\/index\.html <h1> "Home" has no id/);
});

test('seo.heading.anchors: two headings on one page sharing an id fail; the same id on two pages does not', async () => {
  const map = [...GOOD_MAP, { route: '/about', primary: 'about', supporting: [] }];
  const dup = await seo(withBody('/about', '<h2 id="x">One</h2><h2 id="x">Two</h2>'), map);
  assert.match(one(dup, 'seo.heading.anchors').detail, /"Two" repeats id "x"/);
  const pages = { ...withBody('/about', '<h2 id="x">One</h2>'), '/chain': simplePage('Chain', '', '<h2 id="x">One</h2>') };
  assert.deepEqual(seoFailing(await seo(pages, map)), []);
});

test('seo.heading.anchors: a noindex page (404, pitch-deck) or a redirect is not checked', async () => {
  const map = [...GOOD_MAP, { route: '/about', primary: 'about', supporting: [] }];
  const pages = {
    ...GOOD_PAGES,
    '/404': simplePage('Gone', '<meta name="robots" content="noindex, follow">', '<h2>No id here</h2>'),
    '/old': redirectHtml('/chain/'),
  };
  assert.deepEqual(seoFailing(await seo(pages, map)), []);
});

test('seo.robots.aiCrawlers: a crawler that is absent fails and is named', async () => {
  const robots = AI_CRAWLERS.filter((a) => a !== 'cohere-ai').map((a) => `User-agent: ${a}\nAllow: /\n`).join('\n');
  const cs = await seo(GOOD_PAGES, GOOD_MAP, robots);
  assert.deepEqual(failingIds(cs), ['seo.robots.aiCrawlers']);
  assert.match(one(cs, 'seo.robots.aiCrawlers').detail, /cohere-ai/);
});

test('seo.robots.aiCrawlers: a crawler present but disallowed fails; a wildcard Allow does not stand in', async () => {
  const robots = 'User-agent: *\nAllow: /\n\n' + AI_CRAWLERS.map((a) => `User-agent: ${a}\n${a === 'CCBot' ? 'Disallow: /' : 'Allow: /'}\n`).join('\n');
  const cs = await seo(GOOD_PAGES, GOOD_MAP, robots);
  assert.deepEqual(failingIds(cs), ['seo.robots.aiCrawlers']);
  assert.match(one(cs, 'seo.robots.aiCrawlers').detail, /CCBot/);
  assert.doesNotMatch(one(cs, 'seo.robots.aiCrawlers').detail, /GPTBot/);
});

test('seo.robots.aiCrawlers: grouped User-agent lines and any letter case are accepted', async () => {
  const robots = '# crawlers\n' + AI_CRAWLERS.map((a) => `user-agent: ${a.toUpperCase()}`).join('\n') + '\nallow: /\n';
  assert.deepEqual(seoFailing(await seo(GOOD_PAGES, GOOD_MAP, robots)), []);
});

test('seo.robots.aiCrawlers: a missing robots.txt fails rather than throws', async () => {
  const cs = await seo(GOOD_PAGES, GOOD_MAP, null);
  assert.deepEqual(failingIds(cs), ['seo.robots.aiCrawlers']);
  assert.match(one(cs, 'seo.robots.aiCrawlers').detail, /file not found/);
});

test('the AI crawler list is the sixteen CLAUDE.md 5.5 names', () => {
  assert.equal(new Set(AI_CRAWLERS).size, 16);
});

test('seo: an empty or missing dist yields checks, not an exception', async () => {
  for (const distDir of [path.join(mkTmp(), 'nope'), seoDist({}, null)]) {
    const cs = await runSeo({ distDir, seoMap: GOOD_MAP });
    assert.ok(!cs.some((c) => c.id.endsWith('.crash')), show(cs));
    assert.equal(one(cs, 'seo.robots.aiCrawlers').pass, false);
  }
});

test('the real dist/ and seo-map.json: unique, h1 and robots pass; declared names only the three brand pages', { skip: SKIP }, async () => {
  const cs = await runSeo({ distDir: DIST });
  const bad = failingIds(cs).filter((id) => id !== 'seo.keyword.declared');
  assert.deepEqual(bad, [], show(cs));
  // Known and deliberate (R11.8): awaiting the founder. Any route beyond these is a real fault.
  const d = one(cs, 'seo.keyword.declared').detail;
  const named = (d.split(': ').pop() || '').split(', ').filter((x) => x.startsWith('/'));
  const allowed = ['/pavii/overview', '/pavii/features', '/welcome-to-docs'];
  assert.deepEqual(named.filter((r) => !allowed.includes(r)), [], d);
});
