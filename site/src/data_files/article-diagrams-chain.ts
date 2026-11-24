import type { ArticleDiagram } from './article-diagrams';

/** Chain set: bridge, atomic settlement, finality, compliance as code, proof of execution. See article-diagrams.ts for the rules. */
export const articleDiagramsChain: Record<string, ArticleDiagram> = {
  'what-is-a-blockchain-bridge': {
    title: 'How lock and mint moves a token to a second chain',
    caption:
      'A bridge locks the tokens in a vault on the source chain. It waits until the lock is final, then mints the same amount of wrapped tokens on the destination chain. A supply check compares the wrapped tokens with the locked ones. A well-built bridge also checks rules and caps before it mints.',
    width: 720,
    height: 272,
    nodes: [
      { x: 0, y: 16, w: 128, h: 72, label: 'User', sub: ['Sends tokens to', 'the vault'], tone: 'input', step: 0 },
      { x: 176, y: 16, w: 144, h: 72, label: 'Vault', sub: ['Locks the tokens', 'on source chain'], tone: 'store', step: 1 },
      { x: 368, y: 16, w: 176, h: 88, label: 'Bridge', sub: ['Waits for finality', 'Checks rules, caps', 'Verifier confirms lock'], tone: 'focal', step: 2 },
      { x: 592, y: 16, w: 128, h: 72, label: 'Wrapped tokens', sub: ['Minted on the', 'other chain'], tone: 'external', step: 3 },
      { x: 368, y: 184, w: 176, h: 72, label: 'Supply check', sub: ['Wrapped supply must', 'not exceed locked'], tone: 'ink', step: 4 },
    ],
    arrows: [
      { points: [[128, 52], [176, 52]], step: 1 },
      { points: [[320, 52], [368, 52]], step: 2 },
      { points: [[544, 52], [592, 52]], accent: true, step: 3 },
      { points: [[248, 88], [248, 220], [368, 220]], label: { text: 'locked', x: 248, y: 152 }, step: 4 },
      { points: [[656, 88], [656, 220], [544, 220]], label: { text: 'wrapped', x: 656, y: 152 }, step: 4 },
    ],
  },
  'atomic-settlement': {
    title: 'How both legs of a trade settle in one step',
    caption:
      'A buyer and a seller each place an order. The order book runs inside consensus, so every validator computes the same fill. The fill and both balance updates land in one ledger event. Both legs settle together, or neither does.',
    width: 728,
    height: 216,
    nodes: [
      { x: 0, y: 16, w: 120, h: 64, label: 'Sell order', sub: ['0.5 ETH'], tone: 'input', step: 0 },
      { x: 0, y: 136, w: 120, h: 64, label: 'Buy order', sub: ['1,250 USDC'], tone: 'input', step: 0 },
      { x: 160, y: 64, w: 176, h: 88, label: 'Order book', sub: ['Runs inside consensus', 'Same fills on every', 'validator'], tone: 'ink', step: 1 },
      { x: 376, y: 48, w: 184, h: 120, label: 'Single ledger event', sub: ['Fill, asset leg and', 'payment leg land', 'together or not at all'], tone: 'focal', step: 2 },
      { x: 600, y: 16, w: 128, h: 64, label: 'Buyer receives', sub: ['0.5 ETH'], tone: 'store', step: 3 },
      { x: 600, y: 136, w: 128, h: 64, label: 'Seller paid', sub: ['1,250 USDC'], tone: 'store', step: 3 },
    ],
    arrows: [
      { points: [[120, 48], [140, 48], [140, 100], [160, 100]], step: 1 },
      { points: [[120, 168], [140, 168], [140, 116], [160, 116]], step: 1 },
      { points: [[336, 108], [376, 108]], accent: true, step: 2 },
      { points: [[560, 84], [580, 84], [580, 48], [600, 48]], step: 3 },
      { points: [[560, 132], [580, 132], [580, 168], [600, 168]], step: 3 },
    ],
  },
  'blockchain-finality-explained': {
    title: 'How a transaction becomes final in one pass',
    caption:
      'A known set of validators each receive the transaction and vote. When more than two thirds agree, the transaction is final in one pass. There are no competing chains, so there is nothing to reorganise. If more than a third go offline, the network pauses and does not split.',
    width: 704,
    height: 280,
    nodes: [
      { x: 0, y: 28, w: 120, h: 64, label: 'Transaction', sub: ['Sent to the', 'validators'], tone: 'input', step: 0 },
      { x: 152, y: 16, w: 176, h: 88, label: 'Validators', sub: ['Known set, no leader', 'Order from median', 'receive time'], tone: 'ink', step: 1 },
      { x: 360, y: 16, w: 176, h: 88, label: 'Agreement', sub: ['More than two thirds', 'of validators agree'], tone: 'focal', step: 2 },
      { x: 568, y: 28, w: 136, h: 64, label: 'Final record', sub: ['No reorg, no', 'second stage'], tone: 'store', step: 3 },
      { x: 360, y: 176, w: 176, h: 88, label: 'Validators offline', sub: ['More than a third:', 'the network pauses', 'and does not fork'], tone: 'callout', step: 4 },
    ],
    arrows: [
      { points: [[120, 60], [152, 60]], step: 1 },
      { points: [[328, 60], [360, 60]], step: 2 },
      { points: [[536, 60], [568, 60]], step: 3 },
      { points: [[448, 104], [448, 176]], leader: true, step: 4 },
    ],
  },
  'compliance-as-code-blockchain': {
    title: 'How a transaction passes the rules before it executes',
    caption:
      'A client signs a transfer and sends it to the network. The chain finds the rules for the sender, the receiver and the asset, and checks each one before the transfer executes. If one check fails, the chain rejects the transfer and no balance changes. If all pass, the transfer executes and the validators make it final.',
    width: 592,
    height: 296,
    nodes: [
      { x: 0, y: 128, w: 128, h: 72, label: 'Transfer', sub: ['Signed by', 'the client'], tone: 'input', step: 0 },
      { x: 176, y: 16, w: 192, h: 72, label: 'Rules', sub: ['Set for sender,', 'receiver and asset'], tone: 'store', step: 1 },
      { x: 176, y: 120, w: 192, h: 88, label: 'Rule checks', sub: ['Identity, country,', 'limits, lock-ups,', 'approvals'], tone: 'focal', step: 2 },
      { x: 416, y: 16, w: 176, h: 72, label: 'Executes', sub: ['All checks pass;', 'validators finalise'], tone: 'ink', step: 3 },
      { x: 416, y: 208, w: 176, h: 72, label: 'Rejected', sub: ['One check fails;', 'no balance changes'], tone: 'ink', step: 3 },
    ],
    arrows: [
      { points: [[128, 164], [176, 164]], step: 1 },
      { points: [[272, 88], [272, 120]], step: 1 },
      { points: [[368, 148], [392, 148], [392, 52], [416, 52]], step: 3 },
      { points: [[368, 180], [392, 180], [392, 244], [416, 244]], accent: true, step: 3 },
    ],
  },
  'proof-of-execution-ai': {
    title: 'How signed, chained receipts record what an AI did',
    caption:
      'An AI agent acts, and each decision or action becomes a transaction on Hyper 0x. Each receipt is signed and carries a link to the receipt before it. The blockchain anchors the chain. An edited or deleted receipt breaks the link, and anyone can see the gap.',
    width: 672,
    height: 272,
    nodes: [
      { x: 0, y: 16, w: 128, h: 88, label: 'Receipt 1', sub: ['Who, what, when,', 'signed'], tone: 'store', step: 2 },
      { x: 176, y: 16, w: 128, h: 88, label: 'Receipt 2', sub: ['Signed, linked to', 'the one before'], tone: 'store', step: 2 },
      { x: 352, y: 16, w: 128, h: 88, label: 'Receipt 3', sub: ['Signed, linked to', 'the one before'], tone: 'store', step: 1 },
      { x: 528, y: 16, w: 144, h: 88, label: 'AI agent', sub: ['Each decision and', 'action'], tone: 'input', step: 0 },
      { x: 0, y: 184, w: 672, h: 72, label: 'Hyper 0x blockchain', sub: ['Anchors the receipt chain', 'An edited or deleted receipt shows as a break'], tone: 'focal', step: 3 },
    ],
    arrows: [
      { points: [[528, 60], [480, 60]], accent: true, step: 1 },
      { points: [[352, 60], [304, 60]], step: 2 },
      { points: [[176, 60], [128, 60]], step: 2 },
      { points: [[64, 104], [64, 184]], step: 3 },
      { points: [[240, 104], [240, 184]], step: 3 },
      { points: [[416, 104], [416, 184]], step: 3 },
    ],
  },
};
