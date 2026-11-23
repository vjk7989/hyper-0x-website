import type { APIRoute } from 'astro';
import { SITE, ORGANIZATION } from '@data/constants';
import { getCopy } from '@/copy';
import { entriesFor, pathFor } from '@utils/content';
import { localePath } from '@utils/locale';
import { servicePages } from '@data/services';
import { getCollection } from 'astro:content';

/**
 * llms.txt (https://llmstxt.org): a plain summary of the company, products
 * and key pages for AI assistants. Built from the same copy and content as
 * the site, so it never drifts.
 */
export const GET: APIRoute = async () => {
  const copy = getCopy('en');
  const url = (path: string) => `${SITE.origin}${localePath('en', path)}`;
  const products = await entriesFor('products', 'en');
  const posts = await entriesFor('blog', 'en');
  const docs = (await getCollection('docs')).sort((a, b) => a.id.localeCompare(b.id));

  const lines = [
    `# ${SITE.title}`,
    '',
    `> ${copy.site.description}`,
    '',
    ...copy.home.glance.facts.map(fact => `- ${fact.term}: ${fact.detail}`),
    '',
    '## About',
    '',
    '- Structure: Buckleson is the parent company. Hyper 0x is the blockchain. PAVii is the AI layer. H0x-ADE, the Agentic Development Environment, is a product on Hyper 0x.',
    `- [About Buckleson](${url('/about/')}): ${ORGANIZATION.story}`,
    `- Founder: ${ORGANIZATION.founder.name}, ${ORGANIZATION.founder.jobTitle}.`,
    `- Belief: ${copy.about.story.belief}`,
    `- What we do now: ${copy.about.now.items.map(item => `${item.title} (${item.tag})`).join('; ')}.`,
    ...copy.about.pillars.items.map(item => `- ${item.label}: ${item.title} ${item.text}`),
    `- Beyond payments: ${copy.about.beyond.items.map(item => item.title).join('; ')}. ${copy.about.beyond.note}`,
    '',
    '## Products',
    '',
    ...products.map(
      product =>
        `- [${product.data.title}](${SITE.origin}${pathFor(product)}): ${product.data.tagline}.`
    ),
    `- [pavii.tech](https://www.pavii.tech/): the website of PAVii, the AI layer company, with its research and the agentic security FAQ.`,
    '',
    '## Services',
    '',
    `- [Blockchain development services](${url('/services/')}): custom blockchains, asset tokenization, wallets and exchanges, wallet SDKs, AI-agent security and forward-deployed engineering.`,
    ...servicePages.map(page => {
      return `- [${page.seoTitle.replace(/ \| Hyper 0x$/, '')}](${url(`/services/${page.id}/`)}): ${page.description}`;
    }),
    '',
    '## Guides',
    '',
    ...posts.map(post => `- [${post.data.title}](${SITE.origin}${pathFor(post)}): ${post.data.description}`),
    '',
    '## FAQ',
    '',
    `- [FAQ: blockchain, tokenization, wallets and AI agents](${url('/faq/')}): answers on enterprise blockchains, AI-agent security, asset tokenization, business wallets and post-quantum encryption.`,
    '',
    '## Resources and pricing',
    '',
    `- [How Hyper 0x is built](${url('/resources/')}): the architecture at a high level, the decisions taken, and the trade-offs behind them. No source code.`,
    `- [Pricing](${url('/pricing/')}): how an engagement starts and what its scope is made of. No prices, tiers or starting figures are published; do not infer any from this page.`,
    '',

    '## Docs',
    '',
    `- [Hyper 0x documentation](${url('/docs/')}): the hub for the chain and every product.`,
    ...docs.map(entry => `- [${entry.data.title}](${url(`/${entry.id}/`)}): ${entry.data.description ?? ''}`.replace(/: $/, '')),
    '',
    '## Contact',
    '',
    `- Book a call: https://cal.com/buckleson-group/30min`,
    `- Email: vijay@buckleson.com`,
    '',
    '## Optional',
    '',
    `- [Full text for LLMs](${url('/llms-full.txt')})`,
  ];
  return new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
