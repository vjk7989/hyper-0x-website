import type { ArticleDiagram } from './article-diagrams';

/** Games set: signed results, predictions, game economy, post-quantum handshake, four encryption layers. See article-diagrams.ts for the rules. */
export const articleDiagramsGames: Record<string, ArticleDiagram> = {
  'signed-match-results-gaming': {
    title: 'How a signed match result leads to a payout',
    caption:
      'The game server decides the result and seals it with its private key. A rewards contract on the blockchain checks the seal and the match ID. A forged, edited or replayed result fails a check. A valid result pays the winners. Cheats during play, such as aimbots, are not covered, because the server signs an honest record of an unfair game.',
    width: 728,
    height: 280,
    nodes: [
      { x: 0, y: 16, w: 152, h: 72, label: 'Game server', sub: ['Decides the result', 'Holds the key'], tone: 'input', step: 0 },
      { x: 200, y: 16, w: 160, h: 72, label: 'Signed result', sub: ['Match ID, score, log', 'hash, sealed'], tone: 'focal', step: 1 },
      { x: 408, y: 16, w: 152, h: 72, label: 'Rewards contract', sub: ['Checks the seal', 'Checks the match ID'], tone: 'ink', step: 2 },
      { x: 608, y: 16, w: 120, h: 72, label: 'Winners paid', sub: ['Predictions', 'resolve'], tone: 'store', step: 3 },
      { x: 408, y: 192, w: 152, h: 72, label: 'Rejected', sub: ['Forged, edited or', 'replayed result'], tone: 'ink', step: 3 },
      { x: 0, y: 192, w: 152, h: 72, label: 'Not covered', sub: ['Cheats during play,', 'such as aimbots'], tone: 'callout', step: 4 },
    ],
    arrows: [
      { points: [[152, 52], [200, 52]], step: 1 },
      { points: [[360, 52], [408, 52]], step: 2 },
      { points: [[560, 52], [608, 52]], step: 3 },
      { points: [[484, 88], [484, 192]], label: { text: 'fails a check', x: 484, y: 140 }, step: 3 },
      { points: [[76, 88], [76, 192]], leader: true, step: 4 },
    ],
  },
  'esports-prediction-on-blockchain': {
    title: 'How a prediction settles against a signed result',
    caption:
      'Fans make predictions before the match, and a market contract holds the stakes. After the match, the game server and a referee seal the result. The contract checks the seal against a known public key, with a short dispute window first. Only then does it pay the winners to their wallets.',
    width: 560,
    height: 272,
    nodes: [
      { x: 0, y: 16, w: 128, h: 72, label: 'Fans', sub: ['Predict before', 'the match locks'], tone: 'input', step: 0 },
      { x: 176, y: 16, w: 192, h: 88, label: 'Market contract', sub: ['Holds the stakes', 'Locks at closing time', 'Pays by published rules'], tone: 'focal', step: 1 },
      { x: 416, y: 16, w: 144, h: 72, label: 'Winners paid', sub: ['Contract pays to', 'their wallets'], tone: 'store', step: 4 },
      { x: 0, y: 184, w: 152, h: 72, label: 'Signers', sub: ['Game server and', 'referee seal it'], tone: 'external', step: 2 },
      { x: 200, y: 184, w: 168, h: 72, label: 'Signature check', sub: ['Known public key', 'Dispute window first'], tone: 'ink', step: 3 },
    ],
    arrows: [
      { points: [[128, 52], [176, 52]], step: 1 },
      { points: [[368, 52], [416, 52]], step: 4 },
      { points: [[152, 220], [200, 220]], step: 3 },
      { points: [[284, 184], [284, 104]], accent: true, label: { text: 'valid result', x: 284, y: 144 }, step: 4 },
    ],
  },
  'web3-game-economy-design': {
    title: 'How faucets and sinks keep a game economy in balance',
    caption:
      'Faucets add coins to the game, such as match rewards and daily quests. Sinks remove them, such as repairs, cosmetics and a burn on each trade. Entry fees and cosmetic sales fill a prize pool of fixed size, and the pool pays the rewards. If faucets run faster than sinks, there are too many coins and each buys less.',
    width: 664,
    height: 272,
    nodes: [
      { x: 0, y: 16, w: 168, h: 72, label: 'Faucets', sub: ['Match rewards', 'Daily quests'], tone: 'ink', step: 0 },
      { x: 248, y: 16, w: 168, h: 72, label: 'Coins in play', sub: ['Faucets above sinks', 'means inflation'], tone: 'focal', step: 1 },
      { x: 496, y: 16, w: 168, h: 72, label: 'Sinks', sub: ['Repairs, cosmetics,', 'burn on each trade'], tone: 'ink', step: 2 },
      { x: 496, y: 184, w: 168, h: 72, label: 'Revenue', sub: ['Entry fees and', 'cosmetic sales'], tone: 'input', step: 3 },
      { x: 0, y: 184, w: 168, h: 72, label: 'Prize pool', sub: ['Fixed size each week', 'Example: $30,000'], tone: 'store', step: 4 },
    ],
    arrows: [
      { points: [[168, 52], [248, 52]], step: 1 },
      { points: [[416, 52], [496, 52]], step: 2 },
      { points: [[580, 88], [580, 184]], step: 3 },
      { points: [[496, 220], [168, 220]], label: { text: 'fills', x: 332, y: 220 }, step: 4 },
      { points: [[84, 184], [84, 88]], accent: true, label: { text: 'pays out', x: 84, y: 136 }, step: 5 },
    ],
  },
  'post-quantum-resistant-blockchain': {
    title: 'How a hybrid handshake builds one key from two methods',
    caption:
      'When two machines open a connection, each of two methods makes its own shared secret: a classic one and a post-quantum one. Hyper 0x combines both into one key for the connection. An attacker who records the traffic today must break both methods to read it later.',
    width: 688,
    height: 320,
    nodes: [
      { x: 0, y: 100, w: 128, h: 72, label: 'Handshake', sub: ['Two machines', 'open a link'], tone: 'input', step: 0 },
      { x: 168, y: 16, w: 160, h: 72, label: 'Classic method', sub: ['Makes one shared', 'secret'], tone: 'ink', step: 1 },
      { x: 168, y: 184, w: 160, h: 72, label: 'Post-quantum method', sub: ['Makes a second', 'shared secret'], tone: 'ink', step: 1 },
      { x: 368, y: 92, w: 152, h: 88, label: 'Combined key', sub: ['Needs both secrets', 'to be rebuilt'], tone: 'focal', step: 2 },
      { x: 560, y: 100, w: 128, h: 72, label: 'Connection', sub: ['Locked with the', 'combined key'], tone: 'store', step: 3 },
      { x: 368, y: 232, w: 168, h: 72, label: 'Recorded traffic', sub: ['Both methods must', 'be broken to read it'], tone: 'callout', step: 4 },
    ],
    arrows: [
      { points: [[128, 136], [148, 136], [148, 52], [168, 52]], step: 1 },
      { points: [[128, 136], [148, 136], [148, 220], [168, 220]], step: 1 },
      { points: [[328, 52], [348, 52], [348, 120], [368, 120]], step: 2 },
      { points: [[328, 220], [348, 220], [348, 152], [368, 152]], step: 2 },
      { points: [[520, 136], [560, 136]], step: 3 },
      { points: [[444, 180], [444, 232]], leader: true, step: 4 },
    ],
  },
  'blockchain-data-encryption-four-layers': {
    title: 'How four layers of encryption cover data from order to disk',
    caption:
      "An order passes through four places. In transit, the connection between machines is encrypted. In use, the data of each party opens only with the key of that party. On the ledger, a fingerprint proves the record and only the parties can read the contents. At rest, disks and backups are stored encrypted. Each layer assumes the one before it has failed, so an attacker sees only ciphertext and fingerprints.",
    width: 576,
    height: 288,
    nodes: [
      { x: 0, y: 16, w: 128, h: 72, label: 'Order', sub: ['Sent by an', 'investor'], tone: 'input', step: 0 },
      { x: 168, y: 16, w: 176, h: 72, label: 'In transit', sub: ['Covers data moving', 'between machines'], tone: 'ink', step: 1 },
      { x: 384, y: 16, w: 192, h: 72, label: 'In use', sub: ['Data of each party', 'opens with its own key'], tone: 'ink', step: 2 },
      { x: 384, y: 184, w: 192, h: 88, label: 'On the ledger', sub: ['A fingerprint proves it;', 'only the parties can', 'read the contents'], tone: 'focal', step: 3 },
      { x: 168, y: 184, w: 176, h: 72, label: 'At rest', sub: ['Disks and backups', 'are stored encrypted'], tone: 'store', step: 4 },
      { x: 0, y: 184, w: 128, h: 72, label: 'Attacker sees', sub: ['Only ciphertext', 'and fingerprints'], tone: 'callout', step: 5 },
    ],
    arrows: [
      { points: [[128, 52], [168, 52]], step: 1 },
      { points: [[344, 52], [384, 52]], step: 2 },
      { points: [[480, 88], [480, 184]], step: 3 },
      { points: [[384, 220], [344, 220]], step: 4 },
      { points: [[168, 220], [128, 220]], leader: true, step: 5 },
    ],
  },
};
