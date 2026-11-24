// Static checks over dist/ for the two product pages built in P6 (/ade/
// and /wallet/), what their arrival could break elsewhere, and (runSeo, at the end) the search checks.
// Contract matches scripts/gate/checks.mjs: run(ctx) -> Check[];
// Check = { id, label, pass, detail }. Run after `astro build`:
//   node scripts/product-checks.mjs
// cheerio is not a dependency of this package (CLAUDE.md R6.4), so, like
// scripts/smoke.mjs, this reads the HTML with regexes rather than a parser.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.join(HERE, '..', 'dist');
const DATA = path.join(HERE, '..', 'src', 'data_files');

// The four product routes (the product name at the root, not under /products/) the product pages must serve.
export const PRODUCT_SLUGS = ['h0x-ade', 'hyper-wallet', 'hyper-0x', 'h0x-pay'];
// Where each product is served, by content id (mirrors PRODUCT_ROUTES in src/utils/content.ts).
export const PRODUCT_ROUTE = { 'h0x-ade': 'ade', 'hyper-wallet': 'wallet', 'hyper-0x': 'blockchain', 'h0x-pay': 'pay' };
// The two pages this sub-task built, with the id their single <h1> must carry.
export const NEW_PAGES = { 'h0x-ade': 'h0x-ade', 'hyper-wallet': 'hyper-wallet' };
// The routes the FAQ extraction was not meant to change.
export const UNCHANGED_SLUGS = ['hyper-0x', 'h0x-pay'];

// A string from each new page's own body copy that must survive into the static HTML
// (CLAUDE.md 5.5: if a crawler needs JavaScript to read it, it fails).
export const NEEDLES = {
  'h0x-ade': ['Fewer tokens per task.', 'Context compactor', 'What H0x-ADE does not cover'],
  'hyper-wallet': ['Hold, swap and trade.', 'Markets beyond coins', 'Non-custodial'],
};

// CLAUDE.md 1: name the mechanism, never promise immunity.
export const BANNED_WORDS = [
  /\bstops?\b/i, /\bstopped\b/i, /\bstopping\b/i,
  /\bprevents?\b/i, /\bprevented\b/i, /\bpreventing\b/i, /\bprevention\b/i,
  /\beliminates?\b/i, /\beliminated\b/i, /\beliminating\b/i,
  /\bprotects?\s+against\b/i, /\bprotected\s+against\b/i, /\bprotecting\s+against\b/i,
  /\bimmune\b/i, /\bimmunity\b/i,
  /\bsafe\b/i, /\bsecure\b/i, /\bsecured\b/i, /\bsecurely\b/i,
];

// CLAUDE.md R11.3 / R11.4: a capability may be described, a measurement may not be invented.
// Prices and amounts in an illustrated interface are not measurements, so plain money
// and step numbers are deliberately not matched.
export const MEASUREMENT_PATTERNS = [
  [/\d+(?:\.\d+)?\s*%/, 'percentage'],
  [/\b\d+(?:\.\d+)?\s*(?:per\s?cent|percent)\b/i, 'percentage'],
  [/\b\d+(?:\.\d+)?\s*[x×]\b(?!\s*\d)/i, 'multiplier'],
  [/\b\d+(?:\.\d+)?\s*(?:times)\s+(?:faster|cheaper|more|less|fewer|smaller)\b/i, 'multiplier'],
  [/\b\d(?:\.\d)?\s*(?:\/|out of)\s*5\b/i, 'rating'],
  [/\b\d+(?:\.\d+)?\s*stars?\b/i, 'rating'],
  [/\b\d[\d,.]*\s*[km]?\+/i, 'user count'],
  [/\b\d[\d,.]*\s*(?:users|customers|clients|teams|companies|developers|installs|downloads|agents\s+run)\b/i, 'user count'],
  [/\b\d+(?:\.\d+)?\s*(?:ms|tps|rps|req\/s|requests per second|transactions per second)\b/i, 'benchmark'],
  [/\bup to\s+\d/i, 'benchmark'],
  [/\b(?:saves?|saved|cuts?|cut|reduces?|reduced)\s+(?:you\s+)?\d/i, 'benchmark'],
];

const readText = (f) => { try { return fs.readFileSync(f, 'utf8'); } catch { return null; } };

export function walkHtml(dir) {
  const out = [];
  const go = (d) => {
    let ents = [];
    try { ents = fs.readdirSync(d, { withFileTypes: true }); } catch { return; }
    for (const e of ents) {
      const p = path.join(d, e.name);
      if (e.isDirectory()) go(p); else if (e.name.endsWith('.html')) out.push(p);
    }
  };
  go(dir);
  return out;
}

const stripTags = (s) => s
  .replace(/<script[\s\S]*?<\/script>/gi, ' ')
  .replace(/<style[\s\S]*?<\/style>/gi, ' ')
  .replace(/<!--[\s\S]*?-->/g, ' ')
  .replace(/<[^>]*>/g, ' ');

const decode = (s) => s
  .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&#39;/g, "'")
  .replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>');

/**
 * The page's own body copy: what is inside <main>, with <script> and <style> gone.
 * Scoping to <main> is what keeps the shared mega-menu and footer — which carry blog
 * titles such as "how to stop them" — and the inlined `--tw-gradient-stops` out of
 * the banned-word scan.
 */
export function mainText(html) {
  const m = /<main[\s>][\s\S]*?<\/main>/i.exec(html || '');
  return decode(stripTags(m ? m[0] : '')).replace(/\s+/g, ' ').trim();
}

/** "Hyper 0x", "H0x-ADE" and "0x" are the brand, not a number times x. */
export const deBrand = (text) => text
  .replace(/\bh0x[-\s]?(?:ade|pay)\b/gi, 'BRAND')
  .replace(/\bhyper\s*0x\b/gi, 'BRAND')
  .replace(/\bh0x\b/gi, 'BRAND')
  .replace(/\b0x\b/gi, 'BRAND');

const quote = (text, index, len) => text.slice(Math.max(0, index - 40), index + len + 40).trim();

function loadPage(distDir, slug) {
  const file = path.join(distDir, PRODUCT_ROUTE[slug], 'index.html');
  const rel = `dist/${PRODUCT_ROUTE[slug]}/index.html`;
  const html = readText(file);
  return { slug, rel, file, html };
}

const headings = (html) => [...(html || '').matchAll(/<(h[1-6])\b([^>]*)>([\s\S]*?)<\/\1>/gi)]
  .map((m) => ({
    level: Number(m[1][1]),
    attrs: m[2],
    id: (/\sid="([^"]*)"/.exec(m[2]) || [, ''])[1].trim(),
    text: decode(stripTags(m[3])).replace(/\s+/g, ' ').trim(),
  }));

// Each rule returns '' when OK, or the reason it failed.
const PAGE_RULES = [
  ['product.h1.single', 'exactly one h1', (pg) => {
    const n = headings(pg.html).filter((h) => h.level === 1).length;
    return n === 1 ? '' : `${n} <h1> elements`;
  }],
  ['product.h1.id', 'h1 carries the route id', (pg) => {
    const h1 = headings(pg.html).find((h) => h.level === 1);
    if (!h1) return 'no <h1>';
    const want = NEW_PAGES[pg.slug];
    return h1.id === want ? '' : `<h1> id is "${h1.id}", expected "${want}"`;
  }],
  ['product.heading.outline', 'no skipped heading level', (pg) => {
    let prev = 0;
    for (const h of headings(pg.html)) {
      if (h.level > prev + 1) return `h${h.level} "${h.text.slice(0, 30)}" follows ${prev ? 'h' + prev : 'nothing'}`;
      prev = h.level;
    }
    return '';
  }],
  ['product.heading.anchors', 'every h2 and h3 has a unique id', (pg) => {
    const seen = new Set();
    for (const h of headings(pg.html).filter((x) => x.level === 2 || x.level === 3)) {
      if (!h.id) return `<h${h.level}> "${h.text.slice(0, 40)}" has no id`;
      if (seen.has(h.id)) return `duplicate id "${h.id}"`;
      seen.add(h.id);
    }
    return '';
  }],
  ['product.banned.words', 'no banned security word in the body copy', (pg) => {
    const text = mainText(pg.html);
    if (!text) return 'no <main> content to scan';
    for (const re of BANNED_WORDS) {
      const m = new RegExp(re.source, re.flags.includes('i') ? 'gi' : 'g').exec(text);
      if (m) return `<main> contains "${m[0]}": "${quote(text, m.index, m[0].length)}"`;
    }
    return '';
  }],
  ['product.no.measurement', 'no invented measurement in the body copy', (pg) => {
    const text = deBrand(mainText(pg.html));
    if (!text) return 'no <main> content to scan';
    for (const [re, kind] of MEASUREMENT_PATTERNS) {
      const m = new RegExp(re.source, re.flags.includes('i') ? 'gi' : 'g').exec(text);
      if (m) return `<main> contains a ${kind} "${m[0].trim()}": "${quote(text, m.index, m[0].length)}"`;
    }
    return '';
  }],
  ['product.proof.empty', 'no empty proof strip rendered', (pg) => {
    const html = pg.html || '';
    const empties = [...html.matchAll(/<(dl|ul|ol|table)\b[^>]*>\s*(?:<!--[\s\S]*?-->\s*)*<\/\1>/gi)];
    if (empties.length) return `${empties.length} empty list/table wrapper(s), e.g. ${empties[0][0].slice(0, 80)}`;
    const dls = [...html.matchAll(/<dl\b[^>]*>([\s\S]*?)<\/dl>/gi)]
      .filter((m) => !decode(stripTags(m[1])).replace(/\s+/g, ' ').trim());
    return dls.length ? `${dls.length} <dl> with no text content` : '';
  }],
  ['product.static.content', 'body copy is in the static HTML', (pg) => {
    const text = mainText(pg.html);
    const missing = (NEEDLES[pg.slug] || []).filter((n) => !text.includes(n));
    return missing.length ? `<main> is missing ${missing.map((n) => JSON.stringify(n)).join(', ')}` : '';
  }],
];

function tableChecks(pg, add) {
  const html = pg.html || '';
  const tbl = /<table\b[^>]*>[\s\S]*?<\/table>/i.exec(html);
  const errs = [];
  if (!tbl) {
    errs.push('no <table> on the page');
  } else {
    const t = tbl[0];
    const cap = /<caption\b[^>]*>([\s\S]*?)<\/caption>/i.exec(t);
    if (!cap || !decode(stripTags(cap[1])).trim()) errs.push('<table> has no non-empty <caption>');
    const ths = [...t.matchAll(/<th\b([^>]*)>/gi)];
    if (!ths.length) errs.push('<table> has no <th>');
    const noScope = ths.filter((m) => !/\bscope="(col|row|rowgroup|colgroup)"/i.test(m[1]));
    if (noScope.length) errs.push(`${noScope.length} <th> without a scope attribute`);
    if (!ths.some((m) => /scope="col"/i.test(m[1]))) errs.push('no <th scope="col"> header row');
    if (!ths.some((m) => /scope="row"/i.test(m[1]))) errs.push('no <th scope="row"> row header');
  }
  // A div grid standing in for the comparison is the fault 5.4 names by name.
  const grid = [...html.matchAll(/<div\b[^>]*(?:id|class)="[^"]*\b(?:security|threat|comparison)[-\w]*grid[^"]*"[^>]*>/gi)];
  if (grid.length) errs.push(`${grid.length} div grid(s) standing in for the table`);
  add('product.security.table', 'security table is a real table', pg.rel, errs.join('; '));
}

function dataChecks(threats, adePage, add) {
  const titles = threats.map((t) => t.title);
  const rows = adePage.security.rows;
  const errs = [];
  const missing = titles.filter((t) => !rows[t]);
  if (missing.length) errs.push(`threats with no security row key: ${missing.join(' | ')}`);
  const orphan = Object.keys(rows).filter((k) => !titles.includes(k));
  if (orphan.length) errs.push(`security row keys matching no threat: ${orphan.join(' | ')}`);
  const empty = titles.filter((t) => rows[t] && (!String(rows[t].condition || '').trim() || !String(rows[t].mechanism || '').trim()));
  if (empty.length) errs.push(`security rows with an empty condition or mechanism: ${empty.join(' | ')}`);
  add('product.security.rows.keyed', 'every threat has a security row', 'src/data_files/product-pages/h0x-ade.ts', errs.join('; '));

  // The three groups must partition the threat list: nothing dropped, nothing shown twice.
  const groups = adePage.security.groups.map((g) => g.chain);
  const dup = groups.filter((g, i) => groups.indexOf(g) !== i);
  const counted = new Map();
  for (const t of threats) counted.set(t.title, groups.filter((g) => g === t.chain).length);
  const dropped = [...counted].filter(([, n]) => n === 0).map(([t]) => t);
  const twice = [...counted].filter(([, n]) => n > 1).map(([t]) => t);
  const partErrs = [];
  if (dup.length) partErrs.push(`duplicate group chain value(s): ${[...new Set(dup)].join(', ')}`);
  if (dropped.length) partErrs.push(`threats in no group: ${dropped.join(' | ')}`);
  if (twice.length) partErrs.push(`threats in more than one group: ${twice.join(' | ')}`);
  add('product.security.groups.partition', 'the chain groups cover every threat once',
    'src/data_files/product-pages/h0x-ade.ts', partErrs.join('; '));
}

function siteChecks(distDir, threats, pages, add) {
  // Every product route the slug dispatch has to serve.
  const missing = PRODUCT_SLUGS.filter((s) => readText(path.join(distDir, PRODUCT_ROUTE[s], 'index.html')) === null);
  add('product.routes.exist', 'every product route is built', 'dist/',
    missing.length ? `not built: ${missing.join(', ')}` : '');

  // The FAQ extraction was a pure move: the house markup must be unchanged everywhere.
  const faqErrs = [];
  for (const slug of PRODUCT_SLUGS) {
    const html = readText(path.join(distDir, PRODUCT_ROUTE[slug], 'index.html'));
    if (html === null) continue;
    const hasHead = /questions<\/h2>/i.test(html);
    const blocks = [...html.matchAll(/<details class="group py-5"[^>]*>([\s\S]*?)<\/details>/gi)];
    if (!hasHead && blocks.length) faqErrs.push(`${slug}: ${blocks.length} FAQ item(s) with no "… questions" heading`);
    for (const b of blocks) {
      if (!/<summary\b[^>]*>[\s\S]*?\S[\s\S]*?<\/summary>/i.test(b[1])) faqErrs.push(`${slug}: a FAQ item has no <summary> text`);
      if (!/<p\b[^>]*>\s*\S/i.test(b[1])) faqErrs.push(`${slug}: a FAQ item has no answer <p>`);
    }
  }
  add('product.faq.structure', 'FAQ markup unchanged on every product route', 'dist/', faqErrs.slice(0, 5).join('; '));

  // The three routes the dispatch leaves on the house layout still render it.
  const houseErrs = [];
  for (const slug of UNCHANGED_SLUGS) {
    const html = readText(path.join(distDir, PRODUCT_ROUTE[slug], 'index.html'));
    if (html === null) { houseErrs.push(`${slug}: not built`); continue; }
    if (!/<main[\s>]/i.test(html)) houseErrs.push(`${slug}: no <main>`);
    if (headings(html).filter((h) => h.level === 1).length !== 1) houseErrs.push(`${slug}: not exactly one <h1>`);
    if (mainText(html).length < 300) houseErrs.push(`${slug}: only ${mainText(html).length} chars of body copy`);
  }
  add('product.house.layout', 'the unchanged product routes still render', 'dist/', houseErrs.join('; '));

  // CLAUDE.md R10.3, checked across all of dist. Redirect and noindex pages are not routes.
  const byH1 = new Map();
  const byTitle = new Map();
  const uniqErrs = [];
  for (const file of walkHtml(distDir)) {
    const html = readText(file) || '';
    if (/http-equiv="refresh"/i.test(html)) continue;
    if (/<meta name="robots" content="noindex/i.test(html)) continue;
    const rel = 'dist/' + path.relative(distDir, file).split(path.sep).join('/');
    const h1 = headings(html).find((h) => h.level === 1);
    const title = decode((/<title>([\s\S]*?)<\/title>/i.exec(html) || [, ''])[1]).replace(/\s+/g, ' ').trim();
    if (h1 && h1.text) byH1.set(h1.text.toLowerCase(), [...(byH1.get(h1.text.toLowerCase()) || []), rel]);
    if (title) byTitle.set(title.toLowerCase(), [...(byTitle.get(title.toLowerCase()) || []), rel]);
  }
  for (const [t, v] of byH1) if (v.length > 1) uniqErrs.push(`<h1> "${t.slice(0, 40)}" shared by ${v.join(', ')}`);
  add('product.h1.unique', 'no two routes share an h1', 'dist/', uniqErrs.slice(0, 5).join('; '));
  const titleErrs = [];
  for (const [t, v] of byTitle) if (v.length > 1) titleErrs.push(`title "${t.slice(0, 40)}" shared by ${v.join(', ')}`);
  add('product.title.unique', 'no two routes share a title', 'dist/', titleErrs.slice(0, 5).join('; '));

  // The renamed route keeps serving a redirect, and never competes in the sitemap.
  const redirect = readText(path.join(distDir, 'products', 'pavii', 'index.html'));
  const rErrs = [];
  if (redirect === null) rErrs.push('dist/products/pavii/index.html is not built');
  else {
    if (!/http-equiv="refresh"/i.test(redirect)) rErrs.push('no http-equiv="refresh"');
    else if (!/content="0;\s*url=\/ade\/"/i.test(redirect)) rErrs.push(`refresh does not target /ade/: ${(/content="([^"]*)"/i.exec(redirect) || [, '?'])[1]}`);
    if (!/<meta name="robots" content="noindex/i.test(redirect)) rErrs.push('redirect page is not noindex');
    if (!/<link rel="canonical" href="[^"]*\/ade\/"/i.test(redirect)) rErrs.push('canonical does not point at /ade/');
    if (headings(redirect).some((h) => h.level === 1)) rErrs.push('redirect page carries an <h1> and so competes as a route');
  }
  add('product.redirect.pavii', '/products/pavii/ redirects to /ade/', 'dist/products/pavii/index.html', rErrs.join('; '));

  const sitemap = readText(path.join(distDir, 'sitemap-0.xml'));
  const sErrs = [];
  if (sitemap === null) sErrs.push('dist/sitemap-0.xml is missing');
  else {
    const locs = [...sitemap.matchAll(/<loc>([\s\S]*?)<\/loc>/g)].map((m) => m[1].trim());
    const pavii = locs.filter((l) => /\/products\/pavii\/?$/.test(l));
    const ade = locs.filter((l) => /\/ade\/?$/.test(l));
    if (pavii.length) sErrs.push(`products/pavii is in the sitemap ${pavii.length} time(s): ${pavii.join(', ')}`);
    if (ade.length !== 1) sErrs.push(`ade appears ${ade.length} time(s), expected exactly 1`);
  }
  add('product.sitemap.pavii', 'the redirect is out of the sitemap, the new route is in once', 'dist/sitemap-0.xml', sErrs.join('; '));

  // Every row the table should have actually rendered.
  const adeHtml = pages['h0x-ade'] && pages['h0x-ade'].html;
  if (adeHtml) {
    const rowHeads = [...adeHtml.matchAll(/<th\b[^>]*scope="row"[^>]*>/gi)].length;
    add('product.security.rows.rendered', 'the table renders one row per threat',
      'dist/ade/index.html',
      rowHeads === threats.length ? '' : `${rowHeads} <th scope="row"> rows for ${threats.length} threats`);
  }
}

export async function run(ctx = {}) {
  const checks = [];
  const add = (id, label, where, err) => checks.push({ id, label, pass: !err, detail: `${where}: ${err || 'ok'}` });
  try {
    const distDir = path.resolve(ctx.distDir || DIST);
    const load = async (name) => (await import(pathToFileURL(path.join(ctx.dataDir || DATA, name)).href));
    const threats = ctx.threats || (await load('threats.ts')).threats;
    const adePage = ctx.adePage || (await load(path.join('product-pages', 'h0x-ade.ts'))).adePage;

    const pages = {};
    for (const slug of Object.keys(NEW_PAGES)) {
      const pg = loadPage(distDir, slug);
      pages[slug] = pg;
      for (const [id, label, fn] of PAGE_RULES) {
        let err = '';
        if (pg.html === null) err = 'file not found';
        else try { err = fn(pg); } catch (e) { err = `check crashed: ${e.message}`; }
        add(id, label, pg.rel, err);
      }
    }
    try { tableChecks(pages['h0x-ade'], add); } catch (e) { add('product.security.table', 'security table is a real table', 'dist/ade/index.html', `check crashed: ${e.message}`); }
    try { dataChecks(threats, adePage, add); } catch (e) { add('product.data.crash', 'product data checks', 'src/data_files/', e.message); }
    try { siteChecks(distDir, threats, pages, add); } catch (e) { add('product.site.crash', 'site-wide product checks', 'dist/', e.message); }
  } catch (e) {
    checks.push({ id: 'product.checks.crash', label: 'product checks runner', pass: false, detail: String(e && e.message) });
  }
  return checks;
}

// ---------------------------------------------------------------------------
// Search checks over dist/ and src/lib/seo-map.json (CLAUDE.md R10.1-R10.3, 5.5).
// Ported from scripts/gate/checks.mjs, which reads the retired Next build's out/.
// Kept apart from run() so the product checks above stay about the product pages;
// the CLI below and `npm run build` run both.
const SEO_MAP = path.join(HERE, '..', '..', 'src', 'lib', 'seo-map.json');

// CLAUDE.md 5.5: robots.txt must explicitly allow all sixteen.
export const AI_CRAWLERS = [
  'GPTBot', 'OAI-SearchBot', 'ChatGPT-User', 'ClaudeBot', 'Claude-User', 'Claude-SearchBot',
  'anthropic-ai', 'PerplexityBot', 'Perplexity-User', 'Google-Extended', 'CCBot',
  'Applebot-Extended', 'meta-externalagent', 'Bytespider', 'Amazonbot', 'cohere-ai',
];

/** Lower-case, punctuation out, whitespace collapsed, trailing-s plurals folded per word. */
export const normQuery = (s) => String(s).toLowerCase()
  .replace(/[^\p{L}\p{N}\s]+/gu, ' ').trim().split(/\s+/).filter(Boolean)
  .map((w) => (w.length > 3 && w.endsWith('s') && !w.endsWith('ss') ? w.slice(0, -1) : w))
  .join(' ');

/** "/a/b/" -> "/a/b"; "/" stays "/". */
const normRoute = (r) => '/' + String(r).trim().replace(/^\/+|\/+$/g, '');

/** Indexable pages of dist: route, rel path and html. Redirects and noindex pages are not routes. */
function indexablePages(distDir) {
  const out = [];
  for (const file of walkHtml(distDir)) {
    const html = readText(file) || '';
    if (/http-equiv="refresh"/i.test(html)) continue;
    if (/<meta name="robots" content="noindex/i.test(html)) continue;
    const parts = path.relative(distDir, file).split(path.sep);
    const rel = 'dist/' + parts.join('/');
    const last = parts.pop();
    if (last !== 'index.html') parts.push(last.replace(/\.html$/, ''));
    out.push({ route: normRoute(parts.join('/')), rel, html });
  }
  return out;
}

function loadMap(ctx) {
  if (ctx.seoMap) return { entries: ctx.seoMap, err: '' };
  const text = readText(ctx.seoMapFile || SEO_MAP);
  if (text === null) return { entries: null, err: 'src/lib/seo-map.json missing or unreadable' };
  try {
    const j = JSON.parse(text);
    if (!j || !Array.isArray(j.routes)) return { entries: null, err: 'src/lib/seo-map.json has no "routes" array' };
    if (!j.routes.every((e) => e && typeof e.route === 'string' && typeof e.primary === 'string' && e.primary.trim()
      && (e.supporting === undefined || (Array.isArray(e.supporting) && e.supporting.every((q) => typeof q === 'string'))))) {
      return { entries: null, err: 'src/lib/seo-map.json has an entry without string route/primary or with malformed supporting' };
    }
    return { entries: j.routes, err: '' };
  } catch (e) { return { entries: null, err: `src/lib/seo-map.json is not valid JSON: ${e.message}` }; }
}

/** The User-agent groups of a robots.txt: { agents: [lower-cased], allowsAll }. */
function robotsGroups(text) {
  const groups = [];
  let cur = null;
  let inRules = false;
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.replace(/#.*$/, '').trim();
    const m = /^([A-Za-z-]+)\s*:\s*(.*)$/.exec(line);
    if (!m) continue;
    const key = m[1].toLowerCase();
    if (key === 'user-agent') {
      if (!cur || inRules) { cur = { agents: [], allowsAll: false }; groups.push(cur); inRules = false; }
      cur.agents.push(m[2].trim().toLowerCase());
    } else if (cur) {
      inRules = true;
      if (key === 'allow' && m[2].trim() === '/') cur.allowsAll = true;
    }
  }
  return groups;
}

export async function runSeo(ctx = {}) {
  const checks = [];
  const add = (id, label, where, err) => checks.push({ id, label, pass: !err, detail: `${where}: ${err || 'ok'}` });
  const MAP = 'src/lib/seo-map.json';
  try {
    const distDir = path.resolve(ctx.distDir || DIST);
    const pages = indexablePages(distDir);
    const { entries, err: mapErr } = loadMap(ctx);

    // R10.1: every route in dist has a map entry.
    if (!entries) add('seo.keyword.declared', 'every route declares a primary query', MAP, mapErr);
    else {
      const mapped = new Set(entries.map((e) => normRoute(e.route)));
      const missing = pages.filter((p) => !mapped.has(p.route)).map((p) => p.route).sort();
      add('seo.keyword.declared', 'every route declares a primary query', MAP,
        missing.length ? `${missing.length} route(s) in dist with no ${MAP} entry: ${missing.join(', ')}` : '');
    }

    // R10.2: no primary shared, no supporting query equal to another route's primary (normalised).
    if (!entries) add('seo.keyword.unique', 'primary queries unique across routes', MAP, mapErr);
    else {
      const errs = [];
      const owner = new Map();
      for (const e of entries) {
        const k = normQuery(e.primary);
        const r = normRoute(e.route);
        if (owner.has(k)) errs.push(`${owner.get(k)} and ${r} share primary query "${k}"`);
        else owner.set(k, r);
      }
      for (const e of entries) {
        for (const s of e.supporting || []) {
          const o = owner.get(normQuery(s));
          if (o && o !== normRoute(e.route)) errs.push(`${normRoute(e.route)} supporting query "${s}" is the primary of ${o}`);
        }
      }
      add('seo.keyword.unique', 'primary queries unique across routes', MAP,
        errs.slice(0, 5).join('; ') + (errs.length > 5 ? `; and ${errs.length - 5} more` : ''));
    }

    // R10.3: no two indexable routes share an h1.
    const byH1 = new Map();
    for (const p of pages) {
      const h1 = headings(p.html).find((h) => h.level === 1);
      if (!h1 || !h1.text) continue;
      const k = h1.text.toLowerCase();
      byH1.set(k, [...(byH1.get(k) || []), p.rel]);
    }
    const h1Errs = [...byH1].filter(([, v]) => v.length > 1).map(([t, v]) => `<h1> "${t.slice(0, 40)}" shared by ${v.join(', ')}`);
    add('seo.h1.unique', 'no two indexable routes share an h1', 'dist/', h1Errs.slice(0, 5).join('; '));

    // 5.4 and 9.5: every h1, h2 and h3 on every indexable route has an id, and no two on one page share one.
    // (product.heading.anchors above does the same for the two product pages' h2 and h3; this one has no route list.)
    const anchorErrs = [];
    for (const p of pages) {
      const seen = new Set();
      for (const h of headings(p.html).filter((x) => x.level <= 3)) {
        if (!h.id) anchorErrs.push(`${p.rel} <h${h.level}> "${h.text.slice(0, 40)}" has no id`);
        else if (seen.has(h.id)) anchorErrs.push(`${p.rel} <h${h.level}> "${h.text.slice(0, 40)}" repeats id "${h.id}"`);
        else seen.add(h.id);
      }
    }
    add('seo.heading.anchors', 'every h1, h2 and h3 on an indexable route has a unique id', 'dist/',
      anchorErrs.length ? `${anchorErrs.length} heading(s): ${anchorErrs.slice(0, 5).join('; ')}` : '');

    // 5.5: every AI crawler is named and allowed.
    const robots = readText(path.join(distDir, 'robots.txt'));
    if (robots === null) add('seo.robots.aiCrawlers', 'robots.txt allows every AI crawler', 'dist/robots.txt', 'file not found');
    else {
      const groups = robotsGroups(robots);
      const bad = AI_CRAWLERS.filter((a) => !groups.some((g) => g.allowsAll && g.agents.includes(a.toLowerCase())));
      add('seo.robots.aiCrawlers', 'robots.txt allows every AI crawler', 'dist/robots.txt',
        bad.length ? `no "Allow: /" for: ${bad.join(', ')}` : '');
    }
  } catch (e) {
    checks.push({ id: 'seo.checks.crash', label: 'search checks runner', pass: false, detail: String(e && e.message) });
  }
  return checks;
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  const cs = [...await run({}), ...await runSeo({})];
  for (const c of cs) console.log(`${c.pass ? 'ok  ' : 'FAIL'} ${c.id}  ${c.detail}`);
  const bad = cs.filter((c) => !c.pass);
  console.log(bad.length ? `\n${bad.length} of ${cs.length} checks failed.` : `\nOK   ${cs.length} checks passed.`);
  if (bad.length) process.exit(1);
}
