import type { SystemNode } from './systems';

/**
 * Hyper 0x architecture, drawn by `components/ui/ArchitectureDiagram.astro`.
 * Same node and edge shape as `systems.ts`, but static: no steps, no packets.
 * Every label is sourced from research/product-facts.md or the published
 * /chain and /blockchain copy. Nothing here states a figure, and nothing
 * states how receipts are written (product-facts open item 1).
 */
export const architecture = {
  title: 'Hyper 0x architecture: any AI agent goes through the H0x-ADE gate and custody, a private layer 2 settles to the Hyper 0x layer 1, and every action leaves a receipt on the chain',
  nodes: [
    { id: 'agents', col: 0, row: 0, icon: 'user-round', label: 'AI agents', sub: 'any model' },
    { id: 'gate', col: 1, row: 0, icon: 'shield-check', label: 'H0x-ADE gate', sub: 'checks each action', tone: 'guard' },
    { id: 'custody', col: 2, row: 0, icon: 'vault', label: 'Custody', sub: 'agents hold no key', tone: 'guard' },
    { id: 'l2', col: 0, row: 1, icon: 'layers', label: 'Your private L2', sub: 'you choose validators', tone: 'chain' },
    { id: 'l1', col: 1, row: 1, icon: 'blocks', label: 'Hyper 0x layer 1', sub: 'aBFT · run by Buckleson', tone: 'chain' },
    { id: 'receipt', col: 2, row: 1, icon: 'file-check', label: 'Receipt', sub: 'for every action', tone: 'chain' },
  ],
  edges: [
    ['a1', 'agents', 'gate'],
    ['a2', 'gate', 'custody'],
    ['a3', 'l2', 'l1'],
    ['a4', 'l1', 'receipt'],
  ],
} satisfies { title: string; nodes: SystemNode[]; edges: [string, string, string][] };
