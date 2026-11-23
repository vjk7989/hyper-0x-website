import faqs from '@data/faqs.json';

/**
 * English copy table. `Copy` (see `./index.ts`) is the shape of this table.
 *
 * Paths are site-relative (`/products`); callers run them through
 * `localePath()` from `@utils/locale`, which adds the deploy base path.
 */
const accent = (text: string) =>
  `<span class="text-orange-600 dark:text-orange-400">${text}</span>`;

export const en = {
  site: {
    /** Default `<meta name="description">` when a page sets none. */
    description:
      'Hyper 0x is a blockchain that checks what an AI agent may do before it acts and records each action on-chain. It works with any model.',
    /** schema.org `WebSite.description` in every page's `isPartOf`. */
    descriptionShort: 'A blockchain for teams that run AI agents: a gate checks each action, custody holds the keys and a receipt records it on-chain.',
    ogTitle: 'Hyper 0x: a blockchain for teams that run AI agents',
    ogDescription:
      'Hyper 0x is a blockchain built and operated by Buckleson. A gate checks each agent action before it runs, and a receipt records it on the chain.',
  },

  layout: {
    skipToContent: 'Skip to content',
    toggleNavigation: 'Toggle navigation',
    darkTheme: 'Dark Theme Toggle',
    lightTheme: 'Light Theme Toggle',
    toggleTheme: 'Toggle theme',
  },

  forms: {
    email: 'Email',
    emailAddress: 'Email address',
    emailPlaceholder: 'Enter your email',
    emailInvalid:
      'Write a valid email address so that we can reply to you',
    subscribe: 'Subscribe',
    phone: 'Phone Number',
  },

  share: {
    share: 'Share',
    shareOn: (platform: string) => `Share on ${platform}`,
    copied: 'Copied',
    copyLink: 'Copy link',
  },

  banner: {
    dismiss: 'Dismiss',
    region: 'Informational banner',
  },

  blog: {
    readMore: 'Read More',
    minRead: (minutes: number) => `${minutes} min read`,
    relatedArticles: 'Related articles',
    wasHelpful: 'Was this post helpful?',
    yes: 'Yes',
    no: 'No',
    ogSection: 'Blog',
  },

  products: {
    ogSection: 'Products',
    tabs: 'Tabs',
  },

  notFound: {
    title: 'Page Not Found',
    eyebrow: 'Error 404 · block not found',
    claim: 'This block',
    payoff: 'does not exist.',
    content:
      'We cannot find this page. The link may be old, or we moved the page. Select a block below to continue.',
    terminal: [
      { kind: 'cmd', text: 'hyper0x block get 404' },
      { kind: 'info', text: 'asking 7 validators…' },
      { kind: 'info', text: 'consensus reached in one pass' },
      { kind: 'bad', text: 'block #404: not found' },
      { kind: 'bad', text: 'status: never minted' },
      { kind: 'ok', text: 'suggestion: try a live block below' },
    ],
    chainLabel: 'Live blocks on this chain',
    mint: 'Mint #404',
    missing: 'empty slot',
    goHome: 'Back to home',
    goBack: 'Go back',
  },

  home: {
    metaTitle: 'Hyper 0x: a blockchain for teams that run AI agents',
    banner: 'Five products run on Hyper 0x: H0x-ADE, Hyper CLI, Hyper Wallet & SDKs, H0x Pay and HyperRun',
    hero: {
      badge: 'Model-agnostic · private L2 available',
      lead: 'You build the application.',
      // TODO(G2): the clone rotates several phrases here; our approved hero has exactly one line. Add more only if approved.
      phrases: ['Leave agent security to us.'],
      intro:
        'A gate checks what an AI agent may do before it acts, custody holds its keys, and a receipt on the chain records each action.',
      primaryBtn: 'Talk to an engineer',
      secondaryBtn: 'See our products',
      chips: ['A gate before each action', 'Custody holds the keys', 'A receipt on the chain', 'Any model'],
    },
    glanceIntro: {
      label: 'At a glance',
      statement:
        'Hyper 0x is a blockchain, built and operated by Buckleson. It is security infrastructure for AI agents, and it works with any AI model.',
      fact: {
        label: 'Your own chain',
        title: 'A private L2 is available',
        text: 'On it, you choose the validators and the privacy rules.',
      },
    },
    // TODO(G2): "Works with" is a logo strip label. We have no approved logos (R11.2). Needs: empty logo data, or approved text.
    logos: 'Works with',
    why: {
      label: 'The stack',
      claim: 'Four layers stand between an agent',
      payoff: 'and everything it can reach.',
      body:
        'The gate decides. Custody holds the keys. An action proceeds on the chain’s signature and leaves a receipt.',
      // TODO(G2): our stack has four layers (agents, gate, custody, chain). The clone has three cards, so the Agents layer has no card.
      cards: [
        {
          figure: 'chain-rack',
          tags: ['Hyper 0x', 'Private L2'],
          title: 'Chain',
          text: 'An action proceeds on the chain’s signature and leaves a receipt on the chain. On a private L2 you choose the validators and the privacy rules.',
          stat: '01',
          statLabel: 'the foundation layer',
          cta: { title: 'Explore the private L2', url: '/products/hyper-0x/' },
        },
        {
          figure: 'pavii-gates',
          tags: ['H0x-ADE', 'Gate'],
          title: 'Gate',
          text: 'Every call an agent makes to an outside service passes through the gate. H0x-ADE checks the call there, and the gate holds the credentials for it.',
          stat: '03',
          statLabel: 'every outside call passes here',
          cta: { title: 'Explore H0x-ADE', url: '/products/h0x-ade/' },
        },
        {
          figure: 'cipher-tower',
          tags: ['Custody', 'No key in the agent'],
          title: 'Custody',
          text: 'Signing goes through custody, the service that holds the keys, so an agent never holds a key and has none to leak.',
          stat: '02',
          statLabel: 'the keys stay out of the agent',
          cta: { title: 'How the layers work', url: '/#stack' },
        },
      ],
    },
    products: {
      label: 'Products',
      claim: 'One chain.',
      payoff: 'Five products on top.',
      body: 'Each product is a way of using Hyper 0x without writing consensus code yourself.',
      cta: { title: 'All products', url: '/products/' },
    },
    services: {
      label: 'Build with us',
      claim: 'Choose your application and your agent.',
      payoff: 'We design the architecture.',
      body: 'Built for enterprise teams. You pick the application and the agent, and we design the architecture that checks, records and limits that agent.',
      // TODO(G2): item ids are route slugs (/services/<id>/) and are kept from the clone. A follow-up should rename them to pick-your-stack, observability, token-optimisation and security.
      // TODO(G2): the ServiceMock visuals (chain, token, wallet, agent) are component files outside this task and may show Buckleson-era labels.
      items: [
        {
          id: 'custom-blockchains',
          title: 'Pick your stack',
          line: 'Choose the application you want to build and the agent that runs it.',
          included: ['Your application, your agent', 'Architecture designed for the pair', 'Controls on what the agent may do'],
          outcome: 'Designed around the pair',
          mock: 'chain',
        },
        {
          id: 'asset-tokenization',
          title: 'Observability engine',
          line: 'Observes every prompt, trace, log and evaluation your agents produce.',
          included: ['Prompts, traces, logs and evaluations in one place', 'Feeds back into your harness', 'A smaller in-house model can take the easy tasks'],
          outcome: 'Data that improves your harness',
          mock: 'token',
        },
        {
          id: 'wallets-exchanges',
          title: 'Token optimisation engine',
          line: 'The more you use, the more you save.',
          included: ['Heavier use is rewarded in the price you pay', 'Pricing rewards volume'],
          outcome: 'Pricing rewards volume',
          mock: 'wallet',
        },
        {
          id: 'ai-agent-security',
          title: 'Security engine',
          line: 'A gate decides what an agent may do before it acts.',
          included: ['Checks each action before it runs', 'Signs through custody; no key in the agent', 'A receipt on the chain for every action'],
          outcome: 'A receipt for every action',
          mock: 'agent',
        },
      ],
    },
    process: {
      label: 'How a private L2 starts',
      claim: 'From a first call',
      payoff: 'to your chain running.',
      body: 'Four steps, and what is decided at each one.',
      steps: [
        { title: 'Scope it', text: 'What goes on-chain, what stays off, and who needs to verify it.', stage: 'Scope', artifact: 'What goes on-chain' },
        { title: 'Choose validators', text: 'Who runs consensus for your chain, and under what policy.', stage: 'Choose', artifact: 'Who runs consensus' },
        { title: 'Integrate', text: 'Our engineers work alongside yours until your product writes to the chain.', stage: 'Integrate', artifact: 'Your product writes to the chain' },
        { title: 'Go live', text: 'Your layer 2 runs in production and we keep it running.', stage: 'Run', artifact: 'Your L2 in production' },
      ],
    },
    how: {
      label: 'See it run',
      claim: 'Watch a transaction',
      payoff: 'move through the system.',
      body: 'Select a flow. Each step lights up when it happens.',
      // TODO(G2): the tokenization tab has no approved copy, and the diagrams (@data/systems) are outside this task. Needs a Hyper 0x flow or removal.
      tabs: [
        { label: 'Chain transaction', icon: 'cube', system: 'hyper0x' },
        { label: 'Tokenization', icon: 'diamond', system: 'tokenization' },
        { label: 'Wallet swap', icon: 'wallet', system: 'wallet' },
        { label: 'Agent call', icon: 'robot', system: 'pavii' },
      ],
    },
    vision: {
      label: 'Our vision',
      statement: 'A record of what happened that nobody can quietly rewrite.',
      story: [],
      person: { name: 'Vijay Tadepalli', role: 'Founder' },
      cta: { title: 'Read our story', url: '/about/' },
    },
    glance: {
      title: 'Hyper 0x at a glance',
      facts: [
        { term: 'Who we are', detail: 'Hyper 0x is a blockchain, built and operated by Buckleson. It is security infrastructure for AI agents.' },
        { term: 'What it does', detail: 'A gate checks each agent action before it runs. Signing goes through custody, so the agent never holds a key. Each action leaves a receipt on the chain.' },
        { term: 'Who it is for', detail: 'Teams that run AI agents, on any model. Hyper 0x is tied to no AI provider.' },
        { term: 'Products', detail: 'H0x-ADE, Hyper CLI, Hyper Wallet & SDKs, H0x Pay and HyperRun.' },
        { term: 'The group', detail: 'Hyper 0x is the blockchain. Buckleson builds and operates it. PAVii is the AI layer that performs the checks.' },
        { term: 'How to start', detail: 'Book thirty minutes with an engineer. Most teams start with a single use case as a pilot.' },
      ],
    },
    faq: {
      label: 'FAQ',
      claim: 'Questions,',
      payoff: 'answered.',
      stillUnsure: 'Still unsure?',
      stillUnsureText: 'Talk to an engineer for thirty minutes. You talk to somebody who builds the chain, not a salesperson.',
    },
    latestPosts: {
      label: 'Insights',
      claim: 'What we learn',
      payoff: 'when we build on-chain.',
      cta: 'All articles',
    },
    finalCta: {
      claim: 'Put your next agent',
      payoff: 'on a chain you do not have to run.',
      text: 'Thirty minutes with an engineer who builds Hyper 0x.',
      btn: 'Talk to an engineer',
      // TODO(G2): no approved email address exists in our copy; our contact route is the cal.com link. Needs a decision on this line.
      email: 'Or email vijay@buckleson.com',
    },
    heroAlt: {
      btn: 'Talk to an engineer',
    },
  },

  services: {
    title: 'Services',
    seoTitle: 'Services for Teams Running AI Agents | Hyper 0x',
    metaDescription:
      'You pick the application and the agent. Hyper 0x designs the architecture that checks, records and limits that agent.',
    intro: {
      title: 'Choose your application and your agent',
      subTitle:
        'Built for enterprise teams. You pick the application and the agent, and we design the architecture that checks, records and limits that agent.',
      cta: 'Talk to an engineer',
    },
    stats: {
      title: 'The stack in counts',
      subTitle: 'These are counts of what the stack contains. They are not performance figures.',
      items: [
        { value: '4', label: 'layers between an agent and everything it can reach' },
        { value: '1', label: 'gate for every outside call an agent makes' },
        { value: '5', label: 'products on one chain' },
        { value: '1', label: 'receipt on the chain for every action' },
      ],
    },
    // TODO(G2): item ids are route slugs and are kept from the clone (see home.services). The diagram names are chosen from the existing set and may not match the new content.
    items: [
      {
        id: 'custom-blockchains',
        title: 'Pick your stack',
        content:
          'Choose the application and the agent that runs it. We design the architecture around that pair, including the controls on what the agent may do.',
        points: ['Your application, your agent', 'Architecture designed for the pair'],
        diagram: 'hyper0x',
      },
      {
        id: 'asset-tokenization',
        title: 'Observability engine',
        content:
          'Observes every prompt, trace, log and evaluation your agents produce. That data improves your harness and can train a smaller in-house model.',
        points: [
          'Prompts, traces, logs and evaluations in one place',
          'Feeds back into your harness',
          'A smaller in-house model can take the easy tasks while a larger agent handles the hard ones',
        ],
        diagram: 'pavii',
      },
      {
        id: 'wallets-exchanges',
        title: 'Token optimisation engine',
        content: 'The more you use, the more you save. Heavier use is rewarded in the price you pay.',
        points: ['Pricing rewards volume'],
        diagram: 'platform',
      },
      {
        id: 'ai-agent-security',
        title: 'Security engine',
        content:
          'A gate decides what an agent may do before it acts. Signing goes through custody, so the agent never holds a key, and each action leaves a receipt on the chain.',
        points: ['Checks each action before it runs', 'Signs through custody; no key in the agent', 'A receipt on the chain for every action'],
        diagram: 'pavii',
        link: { title: 'See H0x-ADE', url: '/products/h0x-ade/' },
      },
      {
        id: 'wallet-sdks',
        title: 'Hyper Wallet & SDKs',
        content: 'A wallet and exchange under your own brand, running on Hyper 0x. SDKs let you place them inside your own application.',
        points: ['Multi-chain wallet', 'Built-in exchange', 'SDKs for your own interface'],
        diagram: 'wallet',
        link: { title: 'See Hyper Wallet', url: '/products/hyper-wallet/' },
      },
      // TODO(G2): no approved copy exists for forward-deployed engineering as a service. The text below is the clone's, with banned wording removed. Needs: an approved line, or removal of this item and its route.
      {
        id: 'forward-deployed-engineering',
        title: 'Forward-deployed engineering',
        content:
          'Our engineers work inside your team, from pilot to production, and connect Hyper 0x to your systems, public chains, bank ledgers and APIs.',
        points: ['A small pilot first', 'Success measures agreed at the start', 'Support in production'],
        diagram: 'hyper0x',
      },
    ],
  },

  faqPage: {
    title: 'FAQ',
    seoTitle: 'FAQ: AI-Agent Security and the Private L2 | Hyper 0x',
    metaDescription:
      'Straight answers about agent security, the chain, the private layer 2, and how Hyper 0x, Buckleson and PAVii fit together.',
    label: 'FAQ',
    claim: 'Clear answers on',
    payoff: 'agents and the chain.',
    intro:
      'Straight answers about agent security, the chain, the private layer 2, and how the pieces fit together.',
    more: 'Is your question not here?',
    moreText: 'Ask an engineer. You talk to somebody who builds the chain, not a salesperson.',
  },
  about: {
    title: 'About',
    seoTitle: 'About Hyper 0x: Our Story, Mission, Vision and Founder',
    metaDescription:
      'Hyper 0x grew out of Hyper Wallet, and Buckleson builds and operates it. Read the story, the mission and the vision, and what we build next.',
    label: 'About Hyper 0x',
    claim: 'Blockchain is more than payments.',
    payoff: 'We build what else it can do.',
    lead: 'Hyper 0x is a blockchain, built and operated by Buckleson. A gate checks what an AI agent may do before it acts, and a receipt records each action.',
    story: {
      label: 'Our story',
      title: 'Our journey from crypto wallets to blockchain infrastructure',
      intro: 'We are not just another crypto company. We use blockchain to fix problems that existing systems cannot fix. Each fix showed us a bigger problem.',
      steps: [
        {
          label: 'The wallet',
          icon: 'wallet-4',
          title: 'It started with a wallet.',
          text: 'Our first product was a crypto wallet and exchange in one app. Today it is Hyper Wallet.',
        },
        {
          label: 'The hidden charges',
          icon: 'eye-2',
          title: 'We found the hidden charges.',
          text: 'Many wallets earn money from charges users do not see, such as a worse price on each swap. We wanted to remove these charges, not hide them better.',
        },
        {
          label: 'Our own blockchain',
          icon: 'cube-3d',
          title: 'So we built our own blockchain.',
          text: 'Hyper 0x runs an order book inside its consensus. The chain matches buy and sell orders itself, like an exchange that no single party runs. Users pay one fee, not two.',
        },
        {
          label: 'The trilemma',
          icon: 'sitemap',
          title: 'Then the trilemma.',
          text: 'Most blockchains give up decentralization, scalability or security. We took an idea from microservices. Each application gets its own L2, and one shared L1 does the final settlement and audit. L3 chains on top of an L2 are on the roadmap.',
        },
        {
          label: 'Beyond payments',
          icon: 'earth',
          title: 'Then we saw it was never only about payments.',
          text: 'A record that nobody can secretly change is useful far beyond money. We took Hyper 0x to tokenized assets, shared company processes and private identity checks.',
        },
        {
          label: 'AI-agent security',
          icon: 'safe-shield',
          title: 'Now: agents.',
          text: 'Agents read files, call tools and move money. Every call goes through a gate, and every action leaves a receipt on the chain.',
        },
      ],
      belief: 'We believe blockchain is one of the most underrated technologies. Payments are only the start.',
    },
    stats: [
      { value: '4', label: 'layers between an agent and everything it can reach' },
      { value: '1', label: 'gate for every outside call an agent makes' },
      { value: '5', label: 'products on one chain' },
      { value: '1', label: 'receipt on the chain for every action' },
    ],
    statsNote: 'These count how Hyper 0x is built. Published figures for throughput, fees and usage are not available yet.',
    group: {
      label: 'Inside the group',
      claim: 'Three names,',
      payoff: 'one system.',
      body: 'Hyper 0x is the blockchain. Buckleson builds and operates it. PAVii is the AI layer that performs the checks before an agent acts.',
      layers: [
        { term: 'Hyper 0x', detail: 'The blockchain. It settles each action and keeps the receipt that nobody can secretly change.' },
        { term: 'Buckleson', detail: 'The infrastructure company that builds and operates Hyper 0x, and ships Hyper Wallet.' },
        { term: 'PAVii', detail: 'The AI layer. Its gate checks what an agent may do before it acts.' },
      ],
    },
    now: {
      label: 'What we do now',
      claim: 'What are we now?',
      payoff: 'We check what agents do.',
      body: 'AI agents and people now share data and money online every day. Hyper 0x checks what an agent may do and records what it did.',
      items: [
        {
          tag: 'H0x-ADE',
          icon: 'safe-shield',
          title: 'Checking AI agents',
          text: 'H0x-ADE checks every call that an AI agent makes. Each action leaves a receipt on Hyper 0x.',
          url: '/products/h0x-ade/',
        },
        {
          tag: 'Hyper Wallet and H0X Pay',
          icon: 'currency-dollar',
          title: 'Stablecoin payments',
          text: 'H0x Pay brings settlement into the wallet and exchange we already run, so a payment costs less than moving the same money the traditional way.',
          url: '/products/h0x-pay/',
        },
        {
          tag: 'Hyper 0x',
          icon: 'cube-3d',
          title: 'Private L2 chains',
          text: 'Hyper 0x gives each organisation its own L2, settling to a shared base layer. You choose the validators and the privacy rules.',
          url: '/products/hyper-0x/',
        },
        {
          tag: 'SDKs and MCP',
          icon: 'terminal-box',
          title: 'Tools for builders and their AI agents',
          text: 'Our SDKs and MCP servers let developers and their AI agents build on Hyper 0x faster. You write smart contracts in Rust.',
          url: '/guides/getting-started/',
        },
      ],
    },
    pillars: {
      label: 'What drives us',
      claim: 'Why we exist,',
      payoff: 'and what makes us different.',
      items: [
        {
          label: 'Mission',
          title: 'Solve what a database cannot.',
          text: 'We use blockchain where a normal database is not enough: records that many companies share, privacy with proof, and ownership that everyone can check.',
        },
        {
          label: 'Vision',
          title: 'Records that nobody can secretly change.',
          text: 'We want critical systems to run on shared records that nobody can secretly edit, while each person keeps control of their own data.',
        },
        {
          label: 'Goal',
          title: 'A blockchain for every application.',
          text: 'We want any company to start its own chain as easily as a cloud server. Each application gets a private L2, with settlement and audit on one shared L1.',
        },
        {
          label: 'Moat',
          title: 'We own every layer.',
          text: 'We build every layer in-house rather than renting it: the L1, the L2s, the wallet and the agent gateway.',
        },
      ],
    },
    beyond: {
      label: 'Beyond payments',
      claim: 'Where blockchain does',
      payoff: 'what a database cannot.',
      body: 'A database works when one company owns the data and everyone trusts it. Many real problems have no such owner. That is where a blockchain helps.',
      items: [
        {
          icon: 'idcard',
          title: 'Prove a fact, keep the data private',
          text: 'Check that a customer passed identity checks, is old enough or has enough funds, without seeing their documents. The data stays with its owner.',
          url: '/blog/verify-customers-without-sharing-data/',
        },
        {
          icon: 'group-3',
          title: 'Run one process across many companies',
          text: 'A shipment, a loan or an insurance claim can involve five companies. On a shared ledger, each party sees the same steps and only its own private data.',
          url: '/services/custom-blockchains/',
        },
        {
          icon: 'coin',
          title: 'Own a part of a large asset',
          text: 'Split a building, a fund or a bar of gold into small units. Each owner can prove what they own, and units trade and settle in one step.',
          url: '/services/asset-tokenization/',
        },
        {
          icon: 'safe-lock',
          title: 'Audit without exposing everything',
          text: 'Each party keeps its records encrypted, and the ledger keeps a fingerprint of each one. An auditor confirms that nothing changed and reads only what its key opens.',
          url: '/blog/blockchain-data-encryption-four-layers/',
        },
        {
          icon: 'list-check',
          title: 'Rules that run before money moves',
          text: 'Limits, approvals and identity checks run before a transaction executes, not after it.',
          url: '/blog/compliance-as-code-blockchain/',
        },
        {
          icon: 'ai',
          title: 'AI agents that you can audit',
          text: 'Every action of an AI agent leaves a signed receipt on the chain. Nobody can secretly change it, so you can give agents real work.',
          url: '/products/h0x-ade/',
        },
      ],
      note: 'And payments too: they settle in one pass, with one fee.',
      more: { title: 'What blockchain can do beyond payments', url: '/blog/blockchain-use-cases-beyond-payments/' },
    },
    faq: {
      label: 'Questions about us',
      claim: 'About Hyper 0x,',
      payoff: 'in short answers.',
      items: [
        {
          question: 'Who founded Buckleson?',
          answer: 'Vijay Tadepalli founded Buckleson. The company started with a crypto wallet, Hyper Wallet, and then built its own blockchain, Hyper 0x.',
        },
        {
          question: 'Why did Buckleson build its own blockchain?',
          answer: 'Many wallets earn money from hidden charges. Buckleson built Hyper 0x with an order book inside its consensus, so users pay one fee, not two. It then made the chain modular: a private L2 for each application and one shared L1 for settlement and audit.',
        },
        {
          question: 'What can a blockchain do besides payments?',
          answer: 'A blockchain can prove a fact without showing private data. It lets many companies run one process on a shared record. It splits large assets into units that owners can verify. It also keeps a record of AI agent actions that nobody can secretly change.',
        },
        {
          question: 'How does Hyper 0x handle the blockchain trilemma?',
          answer: 'Hyper 0x splits the work, like microservices. Each application gets its own L2, so it can grow alone. The shared L1 does the final settlement and audit with leaderless consensus, so no single node sets the order of transactions.',
        },
      ],
    },
  },
  contact: {
    title: 'Contact',
    seoTitle: 'Contact Hyper 0x: Talk to an Engineer',
    metaDescription:
      'Book thirty minutes with an engineer who builds Hyper 0x. You leave with a view of what would go on-chain and what would not.',
    heading: 'Talk to an engineer',
    subTitle:
      'Tell us what you want to put on-chain. An engineer will reply.',
    bookTitle: 'Book thirty minutes with an engineer',
    bookContent: 'You talk to somebody who builds the chain, not a salesperson. You leave with a view of what would go on-chain and what would not.',
    bookBtn: 'Choose a time',
    formTitle: 'Or send us the details',
    // TODO(G2): the email address below is the clone's. Our approved contact is the cal.com link only. Needs a decision.
    formNote: 'The button below opens your email app with a message to vijay@buckleson.com, ready to send.',
    name: 'Your name',
    company: 'Company',
    email: 'Work email',
    topic: 'What do you want to build?',
    topics: ['A private L2', 'Agent security', 'H0x-ADE', 'Hyper Wallet & SDKs', 'Something else'],
    details: 'Details',
    send: 'Write the email',
    emailHeading: 'Email',
    docsHeading: 'Documentation',
    docsLink: 'Read the Hyper 0x docs',
  },

  blogIndex: {
    title: 'Articles',
    seoTitle: 'Articles on AI-Agent Security and Hyper 0x | Hyper 0x',
    metaDescription:
      'Articles from the engineers who build Hyper 0x: how the chain is built, and how agent actions are checked and recorded on it.',
    heading: 'Writing from the engineers',
    subTitle:
      'How the chain is built, and how agent actions are checked and recorded on it. Engineers who build Hyper 0x write the articles.',
    noPosts: 'No articles yet.',
  },

  productsIndex: {
    title: 'Products',
    seoTitle: 'Products: H0x-ADE, Hyper CLI, Hyper Wallet | Hyper 0x',
    metaDescription:
      'Five products on one chain: H0x-ADE, Hyper CLI, Hyper Wallet & SDKs, H0x Pay and HyperRun.',
    heading: 'One chain. Five products on top.',
    subTitle:
      'Each product is a way of using Hyper 0x without writing consensus code yourself.',
    why: {
      title: 'Why build on Hyper 0x?',
      subTitle:
        'A gate checks each agent action before it runs, and a receipt records it on the chain. A private layer 2 lets you choose the validators.',
      benefits: [
        'A gate checks each agent action before it runs.',
        'Signing goes through custody, so an agent never holds a key.',
        'Each action leaves a receipt on the chain.',
      ],
    },
    cta: {
      title: 'Not sure where to start?',
      subTitle: 'Book thirty minutes with an engineer. You leave with a view of what would go on-chain and what would not.',
      btn: 'Talk to an engineer',
    },
  },

  /** JSON data for FAQs. */
  data: { faqs },
};
