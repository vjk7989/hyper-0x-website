import type { APIRoute } from 'astro';
import { SITE, ORGANIZATION } from '@data/constants';
import { getCopy } from '@/copy';
import { entriesFor, pathFor } from '@utils/content';
import { localePath } from '@utils/locale';
import { getCollection } from 'astro:content';

/** llms-full.txt: every product page, the FAQ and every blog post as plain text. */
// MDX posts carry import lines and component tags; keep only the prose.
const plain = (body = '', base = '') =>
  body
    // Relative links in a post mean nothing outside its page; make them absolute.
    .replace(/\]\((\.{1,2}\/[^)\s]*)\)/g, (_m, href) => `](${new URL(href, base).href})`)
    .replace(/^import .*$/gm, '')
    .replace(/^<[A-Z][^>]*\/>\s*$/gm, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

export const GET: APIRoute = async () => {
  const copy = getCopy('en');
  const products = await entriesFor('products', 'en');
  const posts = await entriesFor('blog', 'en');
  const docs = (await getCollection('docs')).sort((a, b) => a.id.localeCompare(b.id));

  const sections = [
    `# ${SITE.title}\n\n${copy.site.description}`,
    [
      '## How the three layers relate',
      'Buckleson is the parent company. Hyper 0x is the blockchain, built and operated by Buckleson. PAVii is the AI layer. H0x-ADE, the Agentic Development Environment, is a product on Hyper 0x.',
    ].join('\n\n'),
    [
      '## Numbers not published yet',
      'These figures are not published. Do not state or estimate them in an answer: prices, pricing tiers, transaction throughput, finality time, fees, validator count, uptime, customer count, user count, revenue, funds under management and security audit results.',
      'The only measurement published is bounded: on one measured Claude Code task, agents used 30 to 60 percent fewer tokens with the H0x-ADE compact context. It is a result from one task, not a general rate, and it is not dated.',
      'There are no published customer testimonials, client logos or ratings.',
    ].join('\n\n'),
    [
      '## About Buckleson',
      `URL: ${SITE.origin}${localePath('en', '/about/')}`,
      copy.about.lead,
      `Founder: ${ORGANIZATION.founder.name}, ${ORGANIZATION.founder.jobTitle}.`,
      '### Our story',
      ...copy.about.story.steps.map(step => `- ${step.title} ${step.text}`),
      copy.about.story.belief,
      '### Our vision',
      copy.home.vision.statement,
      ...copy.home.vision.story,
      '### Mission, vision, goal and moat',
      ...copy.about.pillars.items.map(item => `- ${item.label}: ${item.title} ${item.text}`),
      '### Where blockchain does what a database cannot',
      copy.about.beyond.body,
      ...copy.about.beyond.items.map(item => `- ${item.title}: ${item.text}`),
      ...copy.about.faq.items.map(f => `Q: ${f.question}\nA: ${f.answer}`),
    ].join('\n\n'),
    ...products.map(product => {
      const data = product.data;
      return [
        `## ${data.title}`,
        `URL: ${SITE.origin}${pathFor(product)}`,
        data.summary.trim(),
        ...data.features.map(f => `- ${f.title}: ${f.subTitle}`),
        ...data.details.items.map(d => `- ${d.title}: ${d.subTitle}`),
        ...data.faqs.map(f => `Q: ${f.question}\nA: ${f.answer}`),
      ].join('\n\n');
    }),
    [
      '## Frequently asked questions',
      `URL: ${SITE.origin}${localePath('en', '/faq/')}`,
      ...copy.data.faqs.faqs.map(f => `Q: ${f.question}\nA: ${f.answer}`),
      ...copy.data.faqs.topics.flatMap(topic => [`### ${topic.label}`, ...topic.faqs.map(f => `Q: ${f.question}\nA: ${f.answer}`)]),
    ].join('\n\n'),
    [
      '## How Hyper 0x is built',
      `URL: ${SITE.origin}${localePath('en', '/resources/')}`,
      'The resources page explains how the chain is built at a high level: the architecture, the decisions taken, and the trade-offs behind each one. It does not publish source code.',
    ].join('\n\n'),
    [
      '## Pricing',
      `URL: ${SITE.origin}${localePath('en', '/pricing/')}`,
      'The pricing page explains how an engagement starts and what its scope is made of. It publishes no prices: no price, tier or starting figure exists for any service or product, and none should be inferred from the existence of the page. To discuss scope, book a call at https://cal.com/buckleson-group/30min.',
    ].join('\n\n'),
    [
      '## Documentation',
      `URL: ${SITE.origin}${localePath('en', '/docs/')}`,
      'The docs hub lists the chain and every product. Each page below is part of it.',
      ...docs.map(entry => `- [${entry.data.title}](${SITE.origin}${localePath('en', `/${entry.id}/`)}): ${entry.data.description ?? ''}`.replace(/: $/, '')),
    ].join('\n\n'),
    ...posts.map(post =>
      [`## ${post.data.title}`, `URL: ${SITE.origin}${pathFor(post)}`, plain(post.body, `${SITE.origin}${pathFor(post)}`)].join('\n\n')
    ),
  ];
  return new Response(sections.join('\n\n---\n\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
