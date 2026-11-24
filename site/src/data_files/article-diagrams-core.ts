import type { ArticleDiagram } from './article-diagrams';

/** Core set: the first three article diagrams. See article-diagrams.ts for the rules. */
export const articleDiagramsCore: Record<string, ArticleDiagram> = {
  'what-is-prompt-injection': {
    title: 'How a hidden instruction reaches an AI agent',
    caption:
      'An instruction hidden in text reaches an agent in two ways. A person types it, or the agent reads it inside a file, page or email. The agent cannot reliably tell it from your request, so it acts with its own tool permissions.',
    width: 704,
    height: 312,
    nodes: [
      { x: 384, y: 112, w: 144, h: 88, label: 'AI agent', sub: ['Instructions and', 'data share one', 'text stream'], tone: 'focal', step: 0 },
      { x: 0, y: 16, w: 144, h: 72, label: 'Person typing', sub: ['Chat box or', 'API request'], tone: 'input', step: 1 },
      { x: 0, y: 124, w: 144, h: 64, label: 'User', sub: ['Asks for a summary'], tone: 'ink', step: 2 },
      { x: 0, y: 228, w: 144, h: 64, label: 'Third party', sub: ['Plants text early'], tone: 'input', step: 3 },
      { x: 184, y: 224, w: 152, h: 72, label: 'Fetched content', sub: ['PDF, web page,', 'email, tool output'], tone: 'external', step: 3 },
      { x: 576, y: 120, w: 128, h: 72, label: 'Tools', sub: ['Files, APIs,', 'email, payments'], tone: 'ink', step: 4 },
    ],
    arrows: [
      { points: [[144, 52], [456, 52], [456, 112]], label: { text: 'direct', x: 300, y: 52 }, step: 1 },
      { points: [[144, 156], [384, 156]], label: { text: 'asks', x: 264, y: 156 }, step: 2 },
      { points: [[144, 260], [184, 260]], step: 3 },
      { points: [[336, 260], [456, 260], [456, 200]], accent: true, label: { text: 'indirect', x: 396, y: 260 }, step: 3 },
      { points: [[528, 156], [576, 156]], step: 4 },
    ],
  },
  'layer-1-vs-layer-2-blockchain': {
    title: 'One layer 1 settles many layer 2s',
    caption:
      'Each layer 2 runs its own transactions and posts a state root to the one layer 1. The layer 1 settles each result and keeps one shared record. You can add or retire one layer 2 and leave the others as they are.',
    width: 640,
    height: 272,
    nodes: [
      { x: 0, y: 16, w: 176, h: 72, label: 'Payroll L2', sub: ['Larger blocks', 'on salary day'], tone: 'ink', step: 0 },
      { x: 232, y: 16, w: 176, h: 72, label: 'Fund L2', sub: ['Investor limits and', 'KYC checks as code'], tone: 'ink', step: 0 },
      { x: 464, y: 16, w: 176, h: 72, label: 'Agent audit L2', sub: ['A signed receipt for', 'every agent action'], tone: 'ink', step: 0 },
      { x: 0, y: 184, w: 640, h: 72, label: 'Hyper 0x L1', sub: ['Known validators, leaderless aBFT consensus', 'Every L2 posts its state root here'], tone: 'focal', step: 2 },
    ],
    arrows: [
      { points: [[88, 88], [88, 184]], label: { text: 'state root', x: 88, y: 136 }, step: 1 },
      { points: [[320, 88], [320, 184]], label: { text: 'state root', x: 320, y: 136 }, step: 1 },
      { points: [[552, 88], [552, 184]], label: { text: 'state root', x: 552, y: 136 }, step: 1 },
    ],
  },
  'stop-llm-data-leaks-pii-redaction': {
    title: 'Where the privacy gate masks data in an LLM call',
    caption:
      'The privacy gate swaps personal data and secrets for placeholders before the call leaves. The outside model and the logs see only placeholders. The output gate checks the reply. Personal values return only to an authorised recipient, and secrets never return.',
    width: 744,
    height: 272,
    nodes: [
      { x: 0, y: 16, w: 120, h: 88, label: 'Agent or app', sub: ['Prompt holds', 'a real name', 'and IBAN'], tone: 'input', step: 0 },
      { x: 152, y: 16, w: 136, h: 88, label: 'Privacy gate', sub: ['Swaps names,', 'IBANs and keys', 'for placeholders'], tone: 'focal', step: 1 },
      { x: 152, y: 168, w: 136, h: 72, label: 'Logs', sub: ['Placeholders', 'only'], tone: 'store', step: 1 },
      { x: 320, y: 24, w: 120, h: 72, label: 'Outside model', sub: ['Sees only', 'placeholders'], tone: 'external', step: 2 },
      { x: 304, y: 168, w: 184, h: 88, label: 'What the model reads', sub: ['Dear [CUSTOMER_NAME_1],', 'your refund to [IBAN_1]', 'is on its way'], tone: 'callout', step: 2 },
      { x: 472, y: 16, w: 120, h: 88, label: 'Output gate', sub: ['Scans the reply', 'and checks the', 'recipient'], tone: 'ink', step: 3 },
      { x: 624, y: 16, w: 120, h: 88, label: 'Recipient', sub: ['Authorised;', 'real values', 'put back'], tone: 'ink', step: 4 },
    ],
    arrows: [
      { points: [[120, 60], [152, 60]], step: 1 },
      { points: [[220, 104], [220, 168]], step: 1 },
      { points: [[288, 60], [320, 60]], step: 2 },
      { points: [[380, 96], [380, 168]], leader: true, step: 2 },
      { points: [[440, 60], [472, 60]], step: 3 },
      { points: [[592, 60], [624, 60]], step: 4 },
    ],
  },
};
