import type { ArticleDiagram } from './article-diagrams';

/** Wallet set: account abstraction, multi-chain keys, wallet SDK, game wallets, MEV, reusable identity checks. See article-diagrams.ts for the rules. */
export const articleDiagramsWallet: Record<string, ArticleDiagram> = {
  'account-abstraction-no-seed-phrases': {
    title: 'How a smart account signs in and pays the fee',
    caption:
      'The user signs in with a face scan or passkey. The account is a smart contract, so it enforces spending limits and approvals, and recovery is part of its design. The app pays the network fee, so the user holds no gas token. Hyper 0x records each action.',
    width: 592,
    height: 248,
    nodes: [
      { x: 0, y: 16, w: 128, h: 72, label: 'User', sub: ['Face scan or', 'passkey'], tone: 'input', step: 0 },
      { x: 176, y: 16, w: 176, h: 88, label: 'Smart account', sub: ['Enforces limits and', 'approvals', 'Recovery built in'], tone: 'focal', step: 1 },
      { x: 400, y: 16, w: 192, h: 72, label: 'Hyper 0x', sub: ['Records each action'], tone: 'store', step: 2 },
      { x: 400, y: 160, w: 192, h: 72, label: 'App', sub: ['Pays the network fee', 'User holds no gas token'], tone: 'external', step: 3 },
    ],
    arrows: [
      { points: [[128, 52], [176, 52]], step: 1 },
      { points: [[352, 52], [400, 52]], accent: true, step: 2 },
      { points: [[496, 160], [496, 88]], label: { text: 'fee', x: 496, y: 124 }, step: 3 },
    ],
  },
  'multi-chain-crypto-wallet-guide': {
    title: 'How one wallet derives a key and address for each chain',
    caption:
      'The wallet starts from one master secret and derives a separate key and address for each chain. Each chain has its own address format and its own way of tracking money. Swaps and bridges then move value between chains without leaving the app. One master secret is easy to back up, but if it leaks, every chain is exposed.',
    width: 640,
    height: 320,
    nodes: [
      { x: 0, y: 112, w: 144, h: 72, label: 'Master secret', sub: ['One root key,', 'one backup'], tone: 'store', step: 0 },
      { x: 192, y: 104, w: 176, h: 88, label: 'Wallet', sub: ['Derives a key and', 'an address for', 'each chain'], tone: 'focal', step: 1 },
      { x: 416, y: 16, w: 224, h: 72, label: 'Bitcoin', sub: ['Address starts 1, 3 or bc1', 'Tracks unspent outputs'], tone: 'external', step: 2 },
      { x: 416, y: 112, w: 224, h: 72, label: 'Ethereum and EVM chains', sub: ['0x plus 40 hex characters', 'Tracks account balances'], tone: 'external', step: 2 },
      { x: 416, y: 208, w: 224, h: 72, label: 'Solana', sub: ['32 to 44 base58 characters', 'Tracks account balances'], tone: 'external', step: 2 },
      { x: 192, y: 232, w: 176, h: 72, label: 'Swap or bridge', sub: ['Moves value across', 'chains in the app'], tone: 'ink', step: 3 },
    ],
    arrows: [
      { points: [[144, 148], [192, 148]], step: 1 },
      { points: [[368, 120], [392, 120], [392, 52], [416, 52]], step: 2 },
      { points: [[368, 148], [416, 148]], step: 2 },
      { points: [[368, 176], [392, 176], [392, 244], [416, 244]], step: 2 },
      { points: [[280, 192], [280, 232]], step: 3 },
    ],
  },
  'what-is-a-wallet-sdk': {
    title: 'How an app sends a payment through a wallet SDK',
    caption:
      'The app makes one call, such as send 50 USDC to this address. The SDK builds the transaction, signs it with a key held in secure hardware on the device, and tracks its status. Your own compliance hooks run before the transaction reaches the blockchain.',
    width: 624,
    height: 272,
    nodes: [
      { x: 0, y: 16, w: 144, h: 72, label: 'Your app', sub: ['Send 50 USDC', 'to this address'], tone: 'input', step: 0 },
      { x: 192, y: 16, w: 192, h: 88, label: 'Wallet SDK', sub: ['One interface', 'Builds the transaction', 'Tracks status'], tone: 'focal', step: 1 },
      { x: 192, y: 184, w: 192, h: 72, label: 'Keys on the device', sub: ['Secure hardware;', 'signs on the device'], tone: 'store', step: 2 },
      { x: 432, y: 184, w: 192, h: 72, label: 'Compliance hooks', sub: ['Your KYC, limits and', 'approval checks'], tone: 'ink', step: 3 },
      { x: 432, y: 16, w: 192, h: 88, label: 'Blockchains', sub: ['Bitcoin, Ethereum,', 'Solana and others'], tone: 'external', step: 4 },
    ],
    arrows: [
      { points: [[144, 52], [192, 52]], step: 1 },
      { points: [[288, 104], [288, 184]], step: 2 },
      { points: [[384, 92], [408, 92], [408, 220], [432, 220]], accent: true, step: 3 },
      { points: [[528, 184], [528, 104]], step: 4 },
    ],
  },
  'web3-gaming-wallets': {
    title: 'How a player gets a wallet without a seed phrase',
    caption:
      'The player signs in with a passkey, an email or a social account. The game SDK creates the wallet in the background, so there is no seed phrase. The studio pays the network fees through a paymaster. A session key with narrow limits signs routine play, and a blockchain records the items under the player account.',
    width: 592,
    height: 288,
    nodes: [
      { x: 0, y: 16, w: 144, h: 72, label: 'Player', sub: ['Passkey, email or', 'social sign-in'], tone: 'input', step: 0 },
      { x: 192, y: 16, w: 176, h: 88, label: 'Embedded wallet', sub: ['Created silently', 'in the background', 'No seed phrase'], tone: 'focal', step: 1 },
      { x: 416, y: 16, w: 176, h: 88, label: 'Blockchain', sub: ['Records items under', 'the player account'], tone: 'store', step: 3 },
      { x: 192, y: 184, w: 176, h: 88, label: 'Session key', sub: ['Narrow limits;', 'routine play signs', 'with no pop-ups'], tone: 'ink', step: 2 },
      { x: 416, y: 184, w: 176, h: 88, label: 'Game studio', sub: ['Pays network fees', 'Player holds no', 'gas token'], tone: 'external', step: 3 },
    ],
    arrows: [
      { points: [[144, 52], [192, 52]], step: 1 },
      { points: [[368, 52], [416, 52]], accent: true, step: 3 },
      { points: [[280, 104], [280, 184]], step: 2 },
      { points: [[504, 184], [504, 104]], label: { text: 'fees', x: 504, y: 144 }, step: 3 },
    ],
  },
  'mev-protection-explained': {
    title: 'How a sandwich attack works around a pending swap',
    caption:
      'Ana swaps $10,000 of stablecoin for a token. The swap waits in a public mempool, where a bot reads its size and slippage limit. The bot buys first and pushes the price up, then the swap of Ana fills. The bot sells at the higher price. Ana gets about $95 less than the quote.',
    width: 592,
    height: 248,
    nodes: [
      { x: 0, y: 16, w: 176, h: 72, label: 'Public mempool', sub: ['Swap of Ana waits', 'Anyone can read it'], tone: 'external', step: 0 },
      { x: 208, y: 16, w: 176, h: 72, label: 'Result for Ana', sub: ['About $95 less', 'than the quote'], tone: 'callout', step: 3 },
      { x: 0, y: 144, w: 176, h: 88, label: 'Bot buys first', sub: ['Pays a higher fee', 'Pushes the price up'], tone: 'ink', step: 1 },
      { x: 208, y: 144, w: 176, h: 88, label: 'Swap of Ana fills', sub: ['$10,000 to a token', 'At the worse price'], tone: 'focal', step: 2 },
      { x: 416, y: 144, w: 176, h: 88, label: 'Bot sells after', sub: ['Sells at the higher', 'price, keeps the gap'], tone: 'ink', step: 3 },
    ],
    arrows: [
      { points: [[88, 88], [88, 144]], label: { text: 'bot reads it', x: 88, y: 116 }, step: 1 },
      { points: [[176, 188], [208, 188]], step: 2 },
      { points: [[384, 188], [416, 188]], step: 3 },
      { points: [[296, 144], [296, 88]], leader: true, step: 3 },
    ],
  },
  'verify-customers-without-sharing-data': {
    title: 'How one signed check serves many providers',
    caption:
      'One trusted checker sees the passport once and signs the answers. The customer keeps the signed result in a wallet. The fintech checks the signature and the revocation status, and keeps no passport copy. A shared ledger lists approved checkers and revocations, as fingerprints only, with no documents.',
    width: 624,
    height: 272,
    nodes: [
      { x: 0, y: 16, w: 160, h: 88, label: 'Trusted checker', sub: ['Sees the passport', 'once, then signs', 'the answers'], tone: 'input', step: 0 },
      { x: 208, y: 16, w: 160, h: 88, label: 'Customer wallet', sub: ['Holds the signed', 'result under a key', 'only they control'], tone: 'store', step: 1 },
      { x: 416, y: 16, w: 208, h: 88, label: 'Fintech', sub: ['Checks the signature', 'Checks not revoked', 'Keeps no passport copy'], tone: 'focal', step: 2 },
      { x: 0, y: 184, w: 624, h: 72, label: 'Shared ledger', sub: ['Approved checkers and revocations', 'Fingerprints only, no documents'], tone: 'external', step: 3 },
    ],
    arrows: [
      { points: [[160, 60], [208, 60]], step: 1 },
      { points: [[368, 60], [416, 60]], accent: true, step: 2 },
      { points: [[80, 104], [80, 184]], label: { text: 'signer listed', x: 80, y: 144 }, step: 3 },
      { points: [[520, 184], [520, 104]], label: { text: 'status', x: 520, y: 144 }, step: 3 },
    ],
  },
};
