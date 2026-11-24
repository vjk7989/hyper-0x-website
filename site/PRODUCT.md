# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users
- **Banks, neobanks and fintechs** (CTOs, heads of digital): want a private chain, wallet, exchange or payment rails without inheriting a public chain's limits.
- **Asset issuers** (funds, gold/commodities, real estate, invoices): want to launch and settle tokenized real-world assets.
- **AI and enterprise security teams**: run AI agents (Claude, Codex, ChatGPT, Grok, custom) and need security gates and tamper-proof audit trails.

Retail crypto users reach Hyper Wallet, but they are not the primary visitor of this site.

## Product Purpose
Buckleson is a blockchain infrastructure company. It builds its own blockchain, Hyper 0X, plus products and custom services on top of it. A visitor should understand within 3 seconds: blockchain company, these domains (custom blockchains, asset tokenization, wallets and exchanges, AI-agent security), and Hyper 0X is the hero product. Success means a booked call: https://cal.com/buckleson-group/30min

## Positioning
Buckleson owns its L1, Hyper 0X: post-quantum-resistant, with aBFT finality and a dedicated L2 for every customer. Because of that, it controls fees, roadmap and security model, and ships products (Pavii, Hyper Wallet & SDKs) that all settle on the same chain. The pitch is blockchain used as a security layer, in the way air.security positions itself for AI security.

## Capabilities and Constraints
- **Products:**
  - Hyper 0X (L1 + per-customer L2)
  - Pavii (AI-agent security, receipts on Hyper 0X)
  - Hyper Wallet & SDKs (one product)
  - H0X Pay
  - HyperRun
- **Services:** custom blockchains and asset tokenization, custom wallets/exchanges/compliance, wallet SDKs, agentic security, forward-deployed engineering.
- **Terminology:** always "Hyper 0X"; "post-quantum-resistant", never "quantum-proof"; no TPS or latency numbers; never mention Hyper Tern.
- **Hosting:** static site on GitHub Pages at the custom domain buckleson.com (public/CNAME). There is no backend.

## Brand Commitments
- Name: Buckleson. Logo marks are in `src/images/brand/`.
- Accent: violet in light theme, the original orange in dark theme.
- Voice: clear, simple, short sentences. A non-expert should get the point in seconds.

## Evidence on Hand
- No traction numbers on the website: no users, transactions, portfolios, savings, revenue, pilots or customers. The investor deck is separate and keeps its own traction slide.
- Use technology facts instead (all true):
  - 6 security gates on every agent call
  - 1 pass to finality, never reordered
  - 4 layers of encryption: in transit, in computation, on the ledger, at rest
  - 3 ecosystems: EVM, Solana and Sui
  - ML-KEM-768 + X25519 hybrid post-quantum-resistant key exchange
  - 1 private L2 per customer, settled on one shared L1
  - 1 gateway for every AI agent and model
- One product benchmark may stay: "30 to 60 percent fewer tokens on one measured Claude Code task".
- No product carries a status label (no "coming soon", no "soon" badge). Describe each product in present tense (CLAUDE.md R11.1). No traction numbers. No 'live', 'launched' or 'in production' wording.
- The Pavii product page links to pavii.tech ("Visit pavii.tech"). pavii.tech is the Pavii brand site.
- `scripts/smoke.mjs` fails the build if known traction numbers come back.
- Architecture diagrams (archify) in `src/images/diagrams/`; sources in `E:\Bson-Website\.archify`.
- No customers, logos, testimonials or certifications on the website. Do not fabricate any.

## Product Principles
1. Say what we are first: a blockchain infrastructure company. Product names come second.
2. Show the mechanism with diagrams, not stock photos.
3. One page, one topic: no two pages compete for the same search intent.
4. Every claim must be true. Describe what a product does; never invent evidence of use (R11.3, R11.4).
