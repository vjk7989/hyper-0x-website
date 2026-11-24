import type { ArticleDiagram } from './article-diagrams';

/** Operations set: observability, token cost, the improvement loop, cost caps and shadow agents. See article-diagrams.ts for the rules. */
export const articleDiagramsOps: Record<string, ArticleDiagram> = {
  'ai-agent-observability': {
    title: 'Where traces, logs and evaluations come from',
    caption:
      'An agent task produces three records. A trace follows one task from the first prompt to the last tool call. A log holds one event with a time. An evaluation scores a result against a standard you choose. The observability engine keeps all three, and a person or a rule reads them.',
    width: 704,
    height: 296,
    nodes: [
      { x: 0, y: 112, w: 144, h: 72, label: 'Agent task', sub: ['Prompts, tool calls', 'and results'], tone: 'input', step: 0 },
      { x: 208, y: 16, w: 176, h: 72, label: 'Trace', sub: ['One task, prompt', 'to last tool call'], tone: 'ink', step: 1 },
      { x: 208, y: 112, w: 176, h: 72, label: 'Log', sub: ['A single event', 'with a time'], tone: 'ink', step: 1 },
      { x: 208, y: 208, w: 176, h: 72, label: 'Evaluation', sub: ['Scores a result against', 'a standard you set'], tone: 'ink', step: 1 },
      { x: 440, y: 100, w: 136, h: 96, label: 'Observability engine', sub: ['Keeps each step', 'of a task'], tone: 'focal', step: 2 },
      { x: 608, y: 112, w: 96, h: 72, label: 'Reader', sub: ['Person or', 'a rule'], tone: 'ink', step: 3 },
    ],
    arrows: [
      { points: [[144, 148], [176, 148], [176, 52], [208, 52]], step: 1 },
      { points: [[144, 148], [208, 148]], step: 1 },
      { points: [[144, 148], [176, 148], [176, 244], [208, 244]], step: 1 },
      { points: [[384, 52], [412, 52], [412, 148], [440, 148]], step: 2 },
      { points: [[384, 148], [440, 148]], step: 2 },
      { points: [[384, 244], [412, 244], [412, 148], [440, 148]], step: 2 },
      { points: [[576, 148], [608, 148]], step: 3 },
    ],
  },
  'reduce-ai-agent-token-costs': {
    title: 'How a model call is made smaller',
    caption:
      'A full call carries whole files, long tool results and old messages. Compact context replaces files with search hits, cached results and small notes. Summarised history replaces settled steps with a short summary. A budget gate then limits spend, and it refuses further calls from an agent whose budget is empty.',
    width: 704,
    height: 320,
    nodes: [
      { x: 0, y: 52, w: 152, h: 88, label: 'Full call', sub: ['Whole files, long', 'tool results and', 'old messages'], tone: 'input', step: 0 },
      { x: 200, y: 16, w: 168, h: 72, label: 'Compact context', sub: ['Search hits, cache', 'and small notes'], tone: 'ink', step: 1 },
      { x: 200, y: 112, w: 168, h: 72, label: 'Summarised history', sub: ['Settled steps become', 'a short summary'], tone: 'ink', step: 1 },
      { x: 416, y: 52, w: 152, h: 88, label: 'Smaller call', sub: ['Only the text the', 'task needs'], tone: 'focal', step: 2 },
      { x: 416, y: 232, w: 152, h: 72, label: 'Budget gate', sub: ['Limit per agent', 'or per task'], tone: 'ink', step: 3 },
      { x: 600, y: 232, w: 104, h: 72, label: 'Model call', sub: ['Receives the', 'smaller call'], tone: 'external', step: 4 },
      { x: 200, y: 232, w: 168, h: 72, label: 'Call refused', sub: ['Budget is empty', 'for this agent'], tone: 'callout', step: 4 },
    ],
    arrows: [
      { points: [[152, 96], [176, 96], [176, 52], [200, 52]], step: 1 },
      { points: [[152, 96], [176, 96], [176, 148], [200, 148]], step: 1 },
      { points: [[368, 52], [392, 52], [392, 96], [416, 96]], step: 2 },
      { points: [[368, 148], [392, 148], [392, 96], [416, 96]], step: 2 },
      { points: [[492, 140], [492, 232]], step: 3 },
      { points: [[568, 268], [600, 268]], step: 4 },
      { points: [[416, 268], [368, 268]], accent: true, step: 4 },
    ],
  },
  'self-improving-ai-agents': {
    title: 'The loop from the record back into the agent',
    caption:
      'The agent works and the observability engine records each step. You read the record and find what fails or wastes tokens. You then change the harness, and later you can train a model of your own. A person approves each change, and the next run adds a new record.',
    width: 640,
    height: 280,
    nodes: [
      { x: 0, y: 16, w: 176, h: 72, label: 'Agent works', sub: ['Runs the task with', 'its prompts and tools'], tone: 'ink', step: 0 },
      { x: 464, y: 16, w: 176, h: 72, label: 'Record', sub: ['Observability engine', 'logs each step'], tone: 'focal', step: 1 },
      { x: 464, y: 192, w: 176, h: 72, label: 'Read the record', sub: ['Find what fails or', 'wastes tokens'], tone: 'ink', step: 2 },
      { x: 0, y: 192, w: 176, h: 72, label: 'Change the setup', sub: ['Fix the harness;', 'own model later'], tone: 'ink', step: 3 },
    ],
    arrows: [
      { points: [[176, 52], [464, 52]], label: { text: 'recorded', x: 320, y: 52 }, step: 1 },
      { points: [[552, 88], [552, 192]], step: 2 },
      { points: [[464, 228], [176, 228]], label: { text: 'person approves', x: 320, y: 228 }, step: 3 },
      { points: [[88, 192], [88, 88]], accent: true, label: { text: 'next run', x: 88, y: 140 }, step: 4 },
    ],
  },
  'denial-of-wallet-ai': {
    title: 'The layers that bound what one agent task can spend',
    caption:
      'Every agent call passes the gateway layers in order. Compact context sends less text. Token limits cap tokens, not only requests. The loop detector checks steps and repeated calls. The spend cap ends the work at its limit. The task then leaves a signed usage record.',
    width: 640,
    height: 264,
    nodes: [
      { x: 0, y: 16, w: 176, h: 72, label: 'Agent task', sub: ['Each call carries its', 'agent, task and cost'], tone: 'input', step: 0 },
      { x: 232, y: 16, w: 176, h: 72, label: 'Compact context', sub: ['Search hits, cache', 'and notes, not files'], tone: 'ink', step: 1 },
      { x: 464, y: 16, w: 176, h: 72, label: 'Token limits', sub: ['Caps per call, minute', 'and day on tokens'], tone: 'ink', step: 2 },
      { x: 464, y: 160, w: 176, h: 88, label: 'Loop detector', sub: ['Step limits and', 'repeated call checks'], tone: 'ink', step: 3 },
      { x: 232, y: 160, w: 176, h: 88, label: 'Spend cap', sub: ['Hard cap per key,', 'team and agent.', 'Ends the work.'], tone: 'focal', step: 4 },
      { x: 0, y: 160, w: 176, h: 88, label: 'Usage record', sub: ['Signed on Hyper 0x,', 'so billing can check', 'the numbers'], tone: 'store', step: 5 },
    ],
    arrows: [
      { points: [[176, 52], [232, 52]], step: 1 },
      { points: [[408, 52], [464, 52]], step: 2 },
      { points: [[552, 88], [552, 160]], step: 3 },
      { points: [[464, 204], [408, 204]], step: 4 },
      { points: [[232, 204], [176, 204]], step: 5 },
    ],
  },
  'shadow-ai-agents': {
    title: 'From finding a shadow agent to one gateway',
    caption:
      'Shadow agents leave traces in network logs, code, app permissions, expense records and developer machines, so you search those places and ask people. You list each agent with an owner and decide to keep, replace or retire it. Kept agents get their own credentials and send every call through one gateway.',
    width: 640,
    height: 264,
    nodes: [
      { x: 0, y: 16, w: 176, h: 88, label: 'Search six places', sub: ['Network, code, apps,', 'expenses, machines', 'and people'], tone: 'input', step: 0 },
      { x: 232, y: 16, w: 176, h: 88, label: 'Inventory', sub: ['Every agent, with', 'owner, data and keys,', 'sorted by risk'], tone: 'store', step: 1 },
      { x: 464, y: 16, w: 176, h: 88, label: 'Decide each one', sub: ['Keep, replace', 'or retire'], tone: 'ink', step: 2 },
      { x: 464, y: 160, w: 176, h: 88, label: 'Kept agent', sub: ['Own scoped', 'credentials, no', 'personal key'], tone: 'ink', step: 3 },
      { x: 232, y: 160, w: 176, h: 88, label: 'One gateway', sub: ['One checkpoint for', 'every prompt and', 'tool call'], tone: 'focal', step: 4 },
      { x: 0, y: 160, w: 176, h: 88, label: 'AI services', sub: ['Reached only', 'through the gateway'], tone: 'external', step: 5 },
    ],
    arrows: [
      { points: [[176, 60], [232, 60]], step: 1 },
      { points: [[408, 60], [464, 60]], step: 2 },
      { points: [[552, 104], [552, 160]], step: 3 },
      { points: [[464, 204], [408, 204]], step: 4 },
      { points: [[232, 204], [176, 204]], step: 5 },
    ],
  },
};
