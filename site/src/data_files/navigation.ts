/**
 * Navigation: the header mega menus (Cloudflare-style: icon, title and a short
 * benefit line per item) and the footer columns. Paths are site-relative;
 * components run them through `localePath()`.
 */

export interface MenuItem {
  title: string;
  desc: string;
  href: string;
  /** MingCute UI icon name (see uiSymbol in utils/glyphs.ts). */
  icon: string;
  badge?: string;
}

export interface MegaMenu {
  id: string;
  label: string;
  columns: { heading: string; items: MenuItem[] }[];
  footer: { primary: { label: string; href: string }; links: { label: string; href: string }[] };
}

export const megaMenus: MegaMenu[] = [
  {
    id: 'products',
    label: 'Products',
    columns: [
      {
        heading: 'Platform',
        items: [
          { title: 'Hyper 0x', desc: 'Our blockchain, with a private L2 for you', href: '/products/hyper-0x/', icon: 'link-2' },
        ],
      },
      {
        heading: 'Products',
        items: [
          { title: 'H0x-ADE', desc: 'Checks every call your AI agents make', href: '/products/h0x-ade/', icon: 'safe-shield' },
          { title: 'Hyper Wallet & SDKs', desc: 'Wallet, exchange and SDKs for your brand', href: '/products/hyper-wallet/', icon: 'laptop' },
        ],
      },
      {
        heading: 'Pay and play',
        items: [
          { title: 'H0X Pay', desc: 'Invest part of every payment', href: '/products/h0x-pay/', icon: 'coin' },
          { title: 'HyperRun', desc: 'Play, predict and earn', href: '/products/hyperrun/', icon: 'trophy' },
        ],
      },
    ],
    footer: {
      primary: { label: 'See all products', href: '/products/' },
      links: [
        { label: 'Docs', href: '/docs/' },
        { label: 'How it works', href: '/#how-it-works' },
      ],
    },
  },
  {
    id: 'services',
    label: 'Solutions',
    columns: [
      {
        heading: 'Build',
        items: [
          { title: 'Custom blockchains', desc: 'Your own private L2', href: '/services/custom-blockchains/', icon: 'sitemap' },
          { title: 'Asset tokenization', desc: 'Real assets, on-chain', href: '/services/asset-tokenization/', icon: 'safe-box' },
          { title: 'Wallets & exchanges', desc: 'With your brand, on our technology', href: '/services/wallets-exchanges/', icon: 'transfer-3' },
        ],
      },
      {
        heading: 'Protect & connect',
        items: [
          { title: 'Wallet SDKs', desc: 'Wallets inside your own apps', href: '/services/wallet-sdks/', icon: 'terminal-box' },
          { title: 'AI-agent security', desc: 'Security gates and receipts for agents', href: '/services/ai-agent-security/', icon: 'ai' },
          { title: 'Forward-deployed engineering', desc: 'Our engineers in your team', href: '/services/forward-deployed-engineering/', icon: 'group-3' },
        ],
      },
    ],
    footer: {
      primary: { label: 'All services', href: '/services/' },
      links: [{ label: 'Start with a pilot', href: '/contact/' }],
    },
  },
  {
    id: 'resources',
    label: 'Resources',
    columns: [
      {
        heading: 'Learn',
        items: [
          { title: 'How it is built', desc: 'The architecture and six decisions, with their costs', href: '/resources/', icon: 'sitemap' },
          { title: 'Blog', desc: 'Guides from our engineers', href: '/blog/', icon: 'news' },
          { title: 'FAQ', desc: 'Answers on blockchain and AI security', href: '/faq/', icon: 'question' },
          { title: 'Docs', desc: 'Pick a product, then open its docs', href: '/docs/', icon: 'book-2' },
          { title: 'RSS feed', desc: 'Every new article', href: '/rss.xml', icon: 'announcement' },
        ],
      },
      {
        heading: 'Popular guides',
        items: [
          { title: 'Asset tokenization', desc: 'How to launch tokenized assets', href: '/blog/asset-tokenization-guide/', icon: 'coin' },
          { title: 'AI agent security', desc: '8 attacks and their defences', href: '/blog/how-to-secure-ai-agents/', icon: 'safe-lock' },
          { title: 'Prompt injection', desc: 'How it works, with examples and defences', href: '/blog/what-is-prompt-injection/', icon: 'warning' },
          { title: 'Layer 1 or layer 2?', desc: 'One L1, many L2s', href: '/blog/layer-1-vs-layer-2-blockchain/', icon: 'server' },
        ],
      },
    ],
    footer: {
      primary: { label: 'All resources', href: '/resources/' },
      links: [
        { label: 'All articles', href: '/blog/' },
        { label: 'What is Hyper 0x?', href: '/guides/intro/' },
      ],
    },
  },
  {
    id: 'pricing',
    label: 'Pricing',
    columns: [
      {
        heading: 'Pricing',
        items: [
          { title: 'Pricing', desc: 'How an engagement starts, and what we publish', href: '/pricing/', icon: 'coin' },
          { title: 'Build with us', desc: 'Call, pilot on your own L2, production', href: '/#services', icon: 'sitemap' },
        ],
      },
    ],
    footer: {
      primary: { label: 'Book a call', href: 'https://cal.com/buckleson-group/30min' },
      links: [{ label: 'All solutions', href: '/services/' }],
    },
  },
  {
    id: 'about',
    label: 'About',
    columns: [
      {
        heading: 'About',
        items: [
          { title: 'Company', desc: 'Our story and what we build', href: '/about/#story-title', icon: 'building-2' },
          { title: 'Mission', desc: 'What drives us', href: '/about/#pillars-title', icon: 'trophy' },
          { title: 'Founder', desc: 'The founder and the note', href: '/about/#founder', icon: 'user-3' },
        ],
      },
    ],
    footer: {
      primary: { label: 'About Hyper 0x', href: '/about/' },
      links: [],
    },
  },
  {
    id: 'contact',
    label: 'Contact',
    columns: [
      {
        heading: 'Talk to us',
        items: [
          { title: 'Contact', desc: 'Talk to an engineer', href: '/contact/', icon: 'mail' },
          { title: 'Book a call', desc: '30 minutes about your use case', href: 'https://cal.com/buckleson-group/30min', icon: 'calendar-month' },
        ],
      },
    ],
    footer: {
      primary: { label: 'Contact', href: '/contact/' },
      links: [{ label: 'vijay@buckleson.com', href: 'mailto:vijay@buckleson.com' }],
    },
  },
];

/** Sibling sites the footer backlinks to (R11.8), with the three-layer relationship as text (§5.5). */
export const siblingSites = {
  statement: 'Buckleson is the parent company and builds the infrastructure. Hyper 0x is the blockchain, and PAVii is the AI layer.',
  links: [
    { label: 'Buckleson, the parent company', href: 'https://buckleson.com' },
    { label: 'PAVii, the AI layer', href: 'https://pavii.tech' },
  ],
};

export const footerColumns: { title: string; links: { label: string; path: string }[] }[] = [
  {
    title: 'Products',
    links: [
      { label: 'Hyper 0x', path: '/products/hyper-0x/' },
      { label: 'H0x-ADE', path: '/products/h0x-ade/' },
      { label: 'Hyper Wallet & SDKs', path: '/products/hyper-wallet/' },
      { label: 'H0X Pay', path: '/products/h0x-pay/' },
      { label: 'HyperRun', path: '/products/hyperrun/' },
    ],
  },
  {
    title: 'Services',
    links: [
      { label: 'Custom blockchains', path: '/services/custom-blockchains/' },
      { label: 'Asset tokenization', path: '/services/asset-tokenization/' },
      { label: 'Wallets & exchanges', path: '/services/wallets-exchanges/' },
      { label: 'AI-agent security', path: '/services/ai-agent-security/' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About us', path: '/about/' },
      { label: 'Resources', path: '/resources/' },
      { label: 'Pricing', path: '/pricing/' },
      { label: 'Blog', path: '/blog/' },
      { label: 'FAQ', path: '/faq/' },
      { label: 'Docs', path: '/docs/' },
      { label: 'Contact', path: '/contact/' },
    ],
  },
];
