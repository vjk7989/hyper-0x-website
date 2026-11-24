import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import starlight from '@astrojs/starlight';

import mdx from '@astrojs/mdx';

// https://astro.build/config
export default defineConfig({
  // GitHub Pages with the custom domain hyper0x.org (public/CNAME), served
  // from the domain root, so there is no `base` path.
  site: 'https://hyper0x.org',
  image: {
    domains: ['images.unsplash.com'],
  },
  prefetch: true,
  // Old URLs from the first site version; Astro emits a redirect page for each.
  redirects: {
    '/blog/post-1': '/blog/post-quantum-resistant-blockchain/',
    '/blog/post-2': '/blog/how-to-secure-ai-agents/',
    '/blog/post-3': '/blog/atomic-settlement/',
    '/insights/insight-1': '/blog/dynamic-blocks/',
    '/insights/insight-2': '/blog/proof-of-execution-ai/',
    '/insights/insight-3': '/blog/account-abstraction-no-seed-phrases/',
    // Product pages moved from /products/<id>/ to the product name at the root.
    '/products/hyper-0x': '/blockchain/',
    '/products/h0x-ade': '/ade/',
    '/products/hyper-wallet': '/wallet/',
    '/products/h0x-pay': '/pay/',
    '/products/pavii': '/ade/',
    // HyperRun and the pricing page were removed.
    '/products/hyperrun': '/products/',
    '/hyperrun/overview': '/products/',
    '/hyperrun/features': '/products/',
    '/pricing': '/contact/',
    '/pavii/overview': '/h0x-ade/overview/',
    '/pavii/features': '/h0x-ade/features/',
    '/welcome-to-docs': '/guides/intro/',
  },
  integrations: [
    sitemap({
      // Keep error, redirect and link-only pages (pitch deck) out of the sitemap.
      filter: page => !/\/(404|pitch-deck|blog\/post-\d|insights|products\/pavii|pavii\/(overview|features)|welcome-to-docs)/.test(page),
      changefreq: 'weekly',
      lastmod: new Date(),
    }),
    starlight({
      title: 'Hyper 0x Docs',
      sidebar: [
        { label: 'Start here', items: [{ autogenerate: { directory: 'guides' } }] },
        { label: 'Hyper 0x', items: [{ autogenerate: { directory: 'hyper-0x' } }] },
        { label: 'AI Agent Security', items: [{ autogenerate: { directory: 'h0x-ade' } }] },
        { label: 'Hyper Wallet & SDKs', items: [{ autogenerate: { directory: 'hyper-wallet' } }] },
        { label: 'H0X Pay', items: [{ autogenerate: { directory: 'h0x-pay' } }] },
      ],
      disable404Route: true,
      customCss: ['./src/assets/styles/starlight.css'],
      favicon: '/favicon.ico',
      components: {
        SiteTitle: './src/components/ui/starlight/SiteTitle.astro',
        Head: './src/components/ui/starlight/Head.astro',
        MobileMenuFooter:
          './src/components/ui/starlight/MobileMenuFooter.astro',
        ThemeSelect: './src/components/ui/starlight/ThemeSelect.astro',
        ThemeProvider: './src/components/ui/starlight/ThemeProvider.astro',
        PageTitle: './src/components/ui/starlight/PageTitle.astro',
      },
    }),
    mdx(),
  ],
  // Inline each page's CSS: no render-blocking stylesheet requests.
  build: {
    inlineStylesheets: 'always',
  },
  experimental: {
    clientPrerender: true,
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
