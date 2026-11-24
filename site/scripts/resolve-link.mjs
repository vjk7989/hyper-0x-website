// Resolve an href found on a built page to the file it must point at in dist/.
// Returns null for links that are not routes (external, fragment-only, mailto:
// and other schemes), { outside: true } for a relative link that climbs above
// the site root, otherwise { path } = the dist-relative file the link needs.
export function resolveLink(href, route, base = '') {
  const clean = href.split('#')[0].split('?')[0];
  if (!clean || clean.startsWith('//') || /^[a-z][a-z0-9+.-]*:/i.test(clean)) return null;

  let path;
  if (clean.startsWith('/')) {
    path = clean.slice(base.length) || '/';
  } else {
    // Relative: resolve against the directory of the page's own route.
    const stack = route.slice(0, route.lastIndexOf('/') + 1).split('/').filter(Boolean);
    const parts = clean.split('/');
    for (const [i, part] of parts.entries()) {
      if (part === '..') {
        if (!stack.length) return { outside: true };
        stack.pop();
      } else if (part !== '.' && !(part === '' && i === parts.length - 1)) {
        if (part !== '') stack.push(part);
      }
    }
    path = '/' + stack.join('/') + (clean.endsWith('/') || /(^|\/)\.\.?$/.test(clean) ? '/' : '');
  }
  if (path.endsWith('/')) path += 'index.html';
  else if (!/\.[a-z0-9]+$/i.test(path)) path += '/index.html';
  return { path };
}
