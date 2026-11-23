# Hyper 0x

The website for [hyper0x.org](https://hyper0x.org).

Hyper 0x is a blockchain, and it exists so that teams can run AI agents safely. A gate
checks what an agent may do before it acts, custody holds its keys, and a receipt on the
chain records each action. It is model-agnostic.

Hyper 0x is built and operated by [Buckleson](https://buckleson.com), the parent company.
[PAVii](https://pavii.tech) is the AI layer.

## The site

Astro, TypeScript and Tailwind, built as a static site and served from GitHub Pages.
The app lives in [`site/`](site/).

```bash
cd site
pnpm install
pnpm run dev     # local development
pnpm run build   # static build to site/dist, and the full gate
```

`pnpm run build` is not only a build. It runs, in order: a simplified-English check, an
Astro type check, the build itself, an HTML post-process, a smoke test over every built
page, and 31 checks covering headings, structured data, search-query uniqueness, the
crawler allowlist and claim hygiene. All of them must pass for the build to succeed.

```bash
node --test scripts/product-checks.test.mjs   # 96 tests for those checks
```

## Deployment

Pushing to `main` builds `site/` and publishes `site/dist` to GitHub Pages, via
[`.github/workflows/deploy.yml`](.github/workflows/deploy.yml). The custom domain is set
by `site/public/CNAME`.
