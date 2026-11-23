
/**
 * Google Analytics 4 measurement ID. Empty: the Hyper 0x property id is not
 * yet issued, so analytics is off until the founder supplies one. (The old
 * value belonged to Buckleson's property and must not receive hyper0x.org traffic.)
 */
export const ANALYTICS_ID = '';

/** Every "book a call" button links here. */
export const BOOKING_URL = 'https://cal.com/buckleson-group/30min';

export const SITE = {
  title: 'Hyper 0x',
  tagline: 'Hyper 0x · AI agent infrastructure on a blockchain',
  description:
    'Hyper 0x is AI agent infrastructure built on a blockchain. A gate checks each agent action before it runs and a receipt records it on-chain. Any model.',
  description_short: 'Custom blockchain solutions, powered by Hyper 0x.',
  /** Scheme + host the site is served from (no path). */
  origin: 'https://hyper0x.org',
  /** Home page URL, including the deploy base path (none on the custom domain). */
  url: 'https://hyper0x.org',
  author: 'Hyper 0x',
};

/** Social profiles shown in the footer (shared with pavii.tech, LinkedIn is Buckleson's own). */
export const SOCIAL = [
  { key: 'linkedin', label: 'LinkedIn', url: 'https://www.linkedin.com/company/buckleson-group/' },
  { key: 'x', label: 'X', url: 'https://x.com/Bucklesongroup' },
  { key: 'github', label: 'GitHub', url: 'https://github.com/buckleson' },
  { key: 'instagram', label: 'Instagram', url: 'https://www.instagram.com/pavii.ai/' },
  { key: 'medium', label: 'Medium', url: 'https://medium.com/@pavii.ai' },
  { key: 'substack', label: 'Substack', url: 'https://substack.com/@paviiai' },
] as const;

/** schema.org Organization facts. `sameAs` lists profiles that are Buckleson itself. */
export const ORGANIZATION = {
  email: 'vijay@buckleson.com',
  sameAs: ['https://www.linkedin.com/company/buckleson-group/', 'https://x.com/Bucklesongroup', 'https://github.com/buckleson'] as string[],
  /** Pavii, the AI-agent security brand, with its own site. */
  brand: { name: 'Pavii', url: 'https://www.pavii.tech/' },
  /** The founder, as a schema.org Person (photo is a public file). */
  founder: { name: 'Vijay Tadepalli', givenName: 'Vijay', familyName: 'Tadepalli', jobTitle: 'Founder', image: '/team/vijay.jpg', linkedin: 'https://www.linkedin.com/in/vijay-tadepalli-279746226/' },
  /** One-line company origin, used in structured data and llms.txt. */
  story:
    'Buckleson started with a crypto wallet, Hyper Wallet. To remove the hidden charges that many wallets add, it built its own blockchain, Hyper 0x, with an order book inside its consensus. Hyper 0x is modular, like microservices: a private L2 for each application and one shared L1 for settlement and audit. L3s run on top of an L2. Buckleson is the parent company, Hyper 0x is the blockchain, and PAVii is the AI layer. H0x-ADE, built with PAVii, checks every agent call and keeps a receipt of each action on Hyper 0x.',
  knowsAbout: [
    'Blockchain development',
    'Custom blockchain networks',
    'Enterprise blockchain',
    'Layer 2 blockchains',
    'Asset tokenization',
    'Real-world asset tokenization',
    'Crypto wallets',
    'Crypto exchanges',
    'Wallet SDKs',
    'Post-quantum cryptography',
    'AI agent security',
    'Smart contracts',
    'Privacy-preserving verification',
    'Fractional ownership',
    'Multi-party business processes',
    'Order book exchanges',
  ],
};


