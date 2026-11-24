import type { ArticleDiagram } from './article-diagrams';

/** Asset set: tokenization, proof of reserve, bonds, gold, merchant payments, micro-investing. See article-diagrams.ts for the rules. */
export const articleDiagramsAssets: Record<string, ArticleDiagram> = {
  'asset-tokenization-guide': {
    title: 'How an asset becomes a token investors can trade',
    caption:
      'A custodian holds the real asset under a legal wrapper. The issuer mints tokens one to one on a private L2. Compliance rules run before every transfer. Investors buy through a wallet or app, and trades settle with both legs together or not at all. Bridges can move tokens to other chains when the rules allow.',
    width: 592,
    height: 288,
    nodes: [
      { x: 0, y: 16, w: 160, h: 88, label: 'Structure, custody', sub: ['Legal wrapper, then', 'a custodian holds', 'the real asset'], tone: 'store', step: 0 },
      { x: 208, y: 16, w: 144, h: 88, label: 'Issue the token', sub: ['Mint one to one', 'on your private', 'L2'], tone: 'focal', step: 1 },
      { x: 400, y: 16, w: 192, h: 88, label: 'Compliance rules', sub: ['KYC, limits, country', 'checked before a', 'transfer executes'], tone: 'ink', step: 2 },
      { x: 400, y: 184, w: 192, h: 88, label: 'Distribute', sub: ['Investors buy in a', 'wallet or a branded', 'app'], tone: 'input', step: 3 },
      { x: 208, y: 184, w: 144, h: 88, label: 'Trade and settle', sub: ['Both legs complete,', 'or neither does'], tone: 'ink', step: 4 },
      { x: 0, y: 184, w: 160, h: 88, label: 'Other chains', sub: ['Bridges move tokens', 'when rules allow'], tone: 'external', step: 5 },
    ],
    arrows: [
      { points: [[160, 60], [208, 60]], step: 1 },
      { points: [[352, 60], [400, 60]], accent: true, step: 2 },
      { points: [[496, 104], [496, 184]], step: 3 },
      { points: [[400, 228], [352, 228]], step: 4 },
      { points: [[208, 228], [160, 228]], step: 5 },
    ],
  },
  'proof-of-reserve-explained': {
    title: 'How a mint rule checks the reserve before new tokens exist',
    caption:
      'A custodian holds the real asset and signs each reserve update. The reserve figure sits on the chain next to the live token supply. A mint rule rejects any mint that would put the supply above the reserve. An independent firm still checks the custodian, because the feed only repeats what the custodian reports.',
    width: 592,
    height: 288,
    nodes: [
      { x: 0, y: 16, w: 144, h: 88, label: 'Custodian', sub: ['Holds the real', 'asset, signs each', 'reserve update'], tone: 'store', step: 0 },
      { x: 192, y: 16, w: 160, h: 88, label: 'Reserve figure', sub: ['On the chain, next', 'to the live supply'], tone: 'ink', step: 1 },
      { x: 400, y: 16, w: 192, h: 88, label: 'Mint rule', sub: ['Rejects any mint that', 'puts supply above', 'the reserve'], tone: 'focal', step: 2 },
      { x: 400, y: 184, w: 192, h: 72, label: 'Token supply', sub: ['Counted live on', 'the chain'], tone: 'input', step: 3 },
      { x: 0, y: 184, w: 144, h: 72, label: 'Attestation', sub: ['Firm checks the', 'custodian records'], tone: 'external', step: 4 },
    ],
    arrows: [
      { points: [[144, 60], [192, 60]], step: 1 },
      { points: [[352, 60], [400, 60]], accent: true, step: 2 },
      { points: [[496, 184], [496, 104]], step: 3 },
      { points: [[72, 184], [72, 104]], label: { text: 'checks', x: 72, y: 144 }, step: 4 },
    ],
  },
  'tokenized-bonds-explained': {
    title: 'How one holder record drives a tokenized bond',
    caption:
      'The issuer mints one token for each unit of face value. Transfer rules check each buyer before a token moves, so the chain keeps one current list of holders. On the record date, a coupon rule reads that list and pays each holder. At maturity the issuer repays the principal and the tokens are burned.',
    width: 592,
    height: 288,
    nodes: [
      { x: 0, y: 16, w: 128, h: 88, label: 'Issuer', sub: ['Mints one token', 'per unit of', 'face value'], tone: 'input', step: 0 },
      { x: 176, y: 16, w: 176, h: 88, label: 'Transfer rules', sub: ['Eligibility, country,', 'lock-ups, limits', 'checked per trade'], tone: 'ink', step: 1 },
      { x: 400, y: 16, w: 192, h: 88, label: 'Holder record', sub: ['One current list', 'of holders on', 'the chain'], tone: 'focal', step: 2 },
      { x: 400, y: 184, w: 192, h: 88, label: 'Coupon rule', sub: ['On the record date,', 'reads the holders,', 'pays each one'], tone: 'ink', step: 3 },
      { x: 176, y: 184, w: 176, h: 72, label: 'Redemption', sub: ['Issuer pays principal', 'and tokens are burned'], tone: 'store', step: 4 },
    ],
    arrows: [
      { points: [[128, 60], [176, 60]], step: 1 },
      { points: [[352, 60], [400, 60]], accent: true, step: 2 },
      { points: [[496, 104], [496, 184]], step: 3 },
      { points: [[424, 104], [424, 144], [264, 144], [264, 184]], step: 4 },
    ],
  },
  'tokenized-gold-explained': {
    title: 'How vaulted gold backs a token, and how it is audited',
    caption:
      'A vault holds allocated, numbered bars apart from the issuer. The issuer mints tokens only for gold in custody and burns them when gold leaves. Anyone can read the token supply from the chain. An independent firm checks the bar list and the vault against that supply, on a set date.',
    width: 624,
    height: 288,
    nodes: [
      { x: 0, y: 16, w: 176, h: 88, label: 'Vault', sub: ['Allocated, numbered', 'bars, held apart from', 'the issuer'], tone: 'store', step: 0 },
      { x: 224, y: 16, w: 192, h: 88, label: 'Mint and burn', sub: ['Mint only for gold', 'in custody; burn when', 'gold leaves'], tone: 'focal', step: 1 },
      { x: 464, y: 16, w: 160, h: 88, label: 'Token holders', sub: ['One token per gram', 'or per ounce'], tone: 'external', step: 2 },
      { x: 224, y: 184, w: 192, h: 72, label: 'Token supply', sub: ['Read live from', 'the chain'], tone: 'input', step: 3 },
      { x: 0, y: 184, w: 176, h: 88, label: 'Independent audit', sub: ['Bar list and', 'attestation on a', 'set date'], tone: 'ink', step: 4 },
    ],
    arrows: [
      { points: [[176, 60], [224, 60]], step: 1 },
      { points: [[416, 60], [464, 60]], accent: true, step: 2 },
      { points: [[320, 104], [320, 184]], step: 3 },
      { points: [[224, 220], [176, 220]], step: 4 },
      { points: [[88, 184], [88, 104]], label: { text: 'checks gold', x: 88, y: 144 }, step: 5 },
    ],
  },
  'blockchain-payments-for-merchants': {
    title: 'How a blockchain payment goes from checkout to settlement',
    caption:
      'The merchant shows a payment request with the amount, asset, network and address. The customer pays from their own wallet. A gateway or node sees the payment and matches it to the invoice. The merchant releases the goods once the payment is final, then keeps the funds, pays suppliers or converts them.',
    width: 592,
    height: 288,
    nodes: [
      { x: 0, y: 16, w: 160, h: 88, label: 'Payment request', sub: ['Amount, asset,', 'network, address,', 'reference, expiry'], tone: 'input', step: 0 },
      { x: 208, y: 16, w: 144, h: 88, label: 'Customer wallet', sub: ['Customer scans,', 'checks, approves'], tone: 'external', step: 1 },
      { x: 400, y: 16, w: 192, h: 88, label: 'Network', sub: ['Finality: the payment', 'can no longer be undone'], tone: 'ink', step: 2 },
      { x: 400, y: 184, w: 192, h: 88, label: 'Gateway or node', sub: ['Sees the payment and', 'matches it to the', 'invoice'], tone: 'ink', step: 3 },
      { x: 208, y: 184, w: 144, h: 88, label: 'Order paid', sub: ['Release the goods', 'after finality'], tone: 'focal', step: 4 },
      { x: 0, y: 184, w: 160, h: 88, label: 'Merchant funds', sub: ['Hold, pay suppliers', 'or convert'], tone: 'store', step: 5 },
    ],
    arrows: [
      { points: [[160, 60], [208, 60]], step: 1 },
      { points: [[352, 60], [400, 60]], step: 2 },
      { points: [[496, 104], [496, 184]], step: 3 },
      { points: [[400, 228], [352, 228]], accent: true, step: 4 },
      { points: [[208, 228], [160, 228]], step: 5 },
    ],
  },
  'what-is-micro-investing': {
    title: 'How a round-up or a slice of a payment becomes an investment',
    caption:
      'A card payment triggers a rule you set once. A round-up sets aside the spare change, and a percentage plan sets aside a share of the payment. The money collects until it reaches a threshold. The app then buys fractional units of the portfolio you chose. Investments can lose value.',
    width: 592,
    height: 288,
    nodes: [
      { x: 0, y: 16, w: 144, h: 88, label: 'Card payment', sub: ['A $4.60 coffee'], tone: 'input', step: 0 },
      { x: 192, y: 16, w: 208, h: 88, label: 'Your plan rule', sub: ['Round-up: $4.60 to $5.00', 'Slice: a set share'], tone: 'focal', step: 1 },
      { x: 448, y: 16, w: 144, h: 88, label: 'Set aside', sub: ['$0.40 collects', 'until a threshold'], tone: 'store', step: 2 },
      { x: 448, y: 184, w: 144, h: 88, label: 'Buy fractions', sub: ['Buys fractional', 'units of your', 'chosen portfolio'], tone: 'ink', step: 3 },
      { x: 192, y: 184, w: 208, h: 88, label: 'Your portfolio', sub: ['Fractions of shares,', 'fund units or tokens'], tone: 'external', step: 4 },
    ],
    arrows: [
      { points: [[144, 60], [192, 60]], step: 1 },
      { points: [[400, 60], [448, 60]], accent: true, step: 2 },
      { points: [[520, 104], [520, 184]], step: 3 },
      { points: [[448, 228], [400, 228]], step: 4 },
    ],
  },
};
