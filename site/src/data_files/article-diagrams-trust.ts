import type { ArticleDiagram } from './article-diagrams';

/** Trust set: agent identity, AI-BOM, system prompt, claim-check-act, baseline and dynamic-block diagrams. See article-diagrams.ts for the rules. */
export const articleDiagramsTrust: Record<string, ArticleDiagram> = {
  'ai-agent-identity': {
    title: 'How a request is checked as it passes down a chain of agents',
    caption:
      'An analyst asks for a report, and the analyst\'s rights travel with the request. The report agent holds a short-lived token for one task and one scope. A rights check reads the token, the agent\'s status in the registry on Hyper 0x and the analyst\'s rights. The request can never do more than the analyst can.',
    width: 536,
    height: 280,
    nodes: [
      { x: 0, y: 16, w: 152, h: 88, label: 'Analyst', sub: ['Asks for a report;', 'their rights travel', 'with the request'], tone: 'input', step: 0 },
      { x: 192, y: 16, w: 152, h: 88, label: 'Orchestrator A1', sub: ['Splits the task and', 'hands one narrow', 'job to agent A2'], tone: 'ink', step: 1 },
      { x: 384, y: 16, w: 152, h: 88, label: 'Report agent A2', sub: ['Gets a token for', 'one task and scope,', 'valid 15 minutes'], tone: 'ink', step: 2 },
      { x: 192, y: 176, w: 152, h: 88, label: 'Rights check', sub: ['Checks token, agent', 'status, and the', 'asker\'s rights'], tone: 'focal', step: 3 },
      { x: 384, y: 176, w: 152, h: 88, label: 'Hyper 0x registry', sub: ['Each agent\'s owner,', 'public key and', 'status'], tone: 'store', step: 4 },
      { x: 0, y: 176, w: 152, h: 88, label: 'Data warehouse', sub: ['Runs with least', 'rights; receipt', 'shows who signed'], tone: 'external', step: 5 },
    ],
    arrows: [
      { points: [[152, 60], [192, 60]], step: 1 },
      { points: [[344, 60], [384, 60]], step: 2 },
      { points: [[460, 104], [460, 140], [268, 140], [268, 176]], label: { text: 'token', x: 364, y: 140 }, step: 3 },
      { points: [[344, 220], [384, 220]], step: 4 },
      { points: [[192, 220], [152, 220]], step: 5 },
    ],
  },
  'ai-bill-of-materials': {
    title: 'How a dependency gate checks a new part before an agent uses it',
    caption:
      'An agent asks for a package, model, adapter, MCP server or skill. The gate checks the approved list, then look-alike names, then the pinned hash and signature, then a sandbox install. A part that fails a layer is refused or held for a person. A part that passes is recorded in the AI-BOM on Hyper 0x.',
    width: 536,
    height: 280,
    nodes: [
      { x: 0, y: 16, w: 152, h: 88, label: 'Agent request', sub: ['Package, model,', 'adapter, MCP server', 'or skill'], tone: 'input', step: 0 },
      { x: 192, y: 16, w: 152, h: 88, label: 'Allow-list', sub: ['Checks the approved', 'list; a new part', 'waits for review'], tone: 'ink', step: 1 },
      { x: 384, y: 16, w: 152, h: 88, label: 'Look-alike names', sub: ['Refuses a name that', 'copies a popular', 'part'], tone: 'ink', step: 2 },
      { x: 384, y: 176, w: 152, h: 88, label: 'Hash and signature', sub: ['Must match the', 'pinned hash and', 'carry a signature'], tone: 'focal', step: 3 },
      { x: 192, y: 176, w: 152, h: 88, label: 'Sandbox install', sub: ['Install scripts and', 'network calls run', 'in isolation'], tone: 'ink', step: 4 },
      { x: 0, y: 176, w: 152, h: 88, label: 'AI-BOM record', sub: ['Part, hash and', 'decision, added', 'on Hyper 0x'], tone: 'store', step: 5 },
    ],
    arrows: [
      { points: [[152, 60], [192, 60]], step: 1 },
      { points: [[344, 60], [384, 60]], step: 2 },
      { points: [[460, 104], [460, 176]], step: 3 },
      { points: [[384, 220], [344, 220]], step: 4 },
      { points: [[192, 220], [152, 220]], step: 5 },
    ],
  },
  'system-prompt-leakage': {
    title: 'How a system prompt leaks, and where the rules sit instead',
    caption:
      'The system prompt sits in the same context window as the user\'s message. So a user can ask the model to repeat it, and it can come back out. Keys and rules therefore live outside the model. A gateway checks each call, and a tool layer adds the key and makes the call.',
    width: 656,
    height: 312,
    nodes: [
      { x: 0, y: 16, w: 112, h: 96, label: 'User', sub: ['Anyone with', 'a chat box'], tone: 'input', step: 0 },
      { x: 192, y: 16, w: 184, h: 96, label: 'Model', sub: ['Hidden prompt and', 'user message share', 'one context window'], tone: 'ink', step: 1 },
      { x: 456, y: 16, w: 200, h: 96, label: 'Gateway', sub: ['Rules run in code:', 'tool, access, output'], tone: 'focal', step: 3 },
      { x: 456, y: 208, w: 200, h: 88, label: 'Tool layer', sub: ['Holds the keys in a', 'secrets manager and', 'makes the call'], tone: 'store', step: 4 },
      { x: 192, y: 208, w: 184, h: 88, label: 'Your systems', sub: ['Data and services', 'the agent acts on'], tone: 'external', step: 5 },
    ],
    arrows: [
      { points: [[112, 48], [192, 48]], label: { text: 'asks', x: 152, y: 48 }, step: 1 },
      { points: [[192, 80], [112, 80]], accent: true, label: { text: 'leak', x: 152, y: 80 }, step: 2 },
      { points: [[376, 64], [456, 64]], label: { text: 'calls', x: 416, y: 64 }, step: 3 },
      { points: [[556, 112], [556, 208]], step: 4 },
      { points: [[456, 252], [376, 252]], label: { text: 'call', x: 416, y: 252 }, step: 5 },
    ],
  },
  'ai-agent-hallucination-risk': {
    title: 'Claim, check, act: how a claim is tested before an action runs',
    caption:
      'An agent reports a claim, such as a finished backup. The claim must fill fixed fields. Your system then asks the source system, not the agent, and looks up the receipt on Hyper 0x. Preconditions are checked last. Only a checked claim can start the action.',
    width: 536,
    height: 280,
    nodes: [
      { x: 0, y: 16, w: 152, h: 88, label: 'Agent claim', sub: ['"Backup done at', '02:00", as text'], tone: 'input', step: 0 },
      { x: 192, y: 16, w: 152, h: 88, label: 'Required fields', sub: ['Fixed fields: job', 'ID, time, size.', 'An empty one halts'], tone: 'ink', step: 1 },
      { x: 384, y: 16, w: 152, h: 88, label: 'Source system', sub: ['Ask the backup or', 'KYC service, not', 'the agent'], tone: 'focal', step: 2 },
      { x: 384, y: 176, w: 152, h: 88, label: 'Receipt check', sub: ['Find the job', 'receipt on', 'Hyper 0x'], tone: 'store', step: 3 },
      { x: 192, y: 176, w: 152, h: 88, label: 'Preconditions', sub: ['Arguments, rights', 'and current state'], tone: 'ink', step: 4 },
      { x: 0, y: 176, w: 152, h: 88, label: 'Act', sub: ['Runs only after', 'every check passes'], tone: 'ink', step: 5 },
    ],
    arrows: [
      { points: [[152, 60], [192, 60]], step: 1 },
      { points: [[344, 60], [384, 60]], step: 2 },
      { points: [[460, 104], [460, 176]], step: 3 },
      { points: [[384, 220], [344, 220]], step: 4 },
      { points: [[192, 220], [152, 220]], accent: true, step: 5 },
    ],
  },
  'prove-llm-got-worse-without-baseline': {
    title: 'The paired test you can run once a baseline exists',
    caption:
      'A decline is a comparison, so it needs two sets of results. Save real inputs, the outputs you accepted, the exact model name, the prompt and the settings. Rerun the same inputs on a schedule and date each result. A paired test then compares the pairs, and your change log shows which edits you made.',
    width: 632,
    height: 264,
    nodes: [
      { x: 0, y: 16, w: 168, h: 88, label: 'Reference set', sub: ['Real inputs and the', 'outputs you accepted,', 'with model and prompt'], tone: 'store', step: 0 },
      { x: 232, y: 16, w: 168, h: 88, label: 'Scheduled rerun', sub: ['Same inputs on the', 'current model, with', 'a date on each result'], tone: 'ink', step: 1 },
      { x: 464, y: 16, w: 168, h: 88, label: 'Paired test', sub: ['Compares the pairs', 'by a rule written', 'before the results'], tone: 'focal', step: 2 },
      { x: 464, y: 176, w: 168, h: 72, label: 'Verdict', sub: ['Whether a decline is', 'real, and how large'], tone: 'ink', step: 3 },
      { x: 232, y: 176, w: 168, h: 72, label: 'Change log', sub: ['Edits to prompts,', 'tools and retrieval'], tone: 'store', step: 4 },
    ],
    arrows: [
      { points: [[168, 60], [232, 60]], step: 1 },
      { points: [[400, 60], [464, 60]], step: 2 },
      { points: [[548, 104], [548, 176]], step: 3 },
      { points: [[400, 212], [464, 212]], step: 4 },
    ],
  },
  'dynamic-blocks': {
    title: 'How a dynamic block decides when to seal',
    caption:
      'Each L2 sets a minimum block size, a maximum block size and a time limit. In a quiet period the time limit runs out first, so a small block seals quickly. In a busy period the block grows toward the maximum, so no backlog builds. Every L2 settles to one shared record on Hyper 0x.',
    width: 592,
    height: 304,
    nodes: [
      { x: 0, y: 16, w: 136, h: 88, label: 'Transactions', sub: ['Arrive in a quiet', 'or a busy spell'], tone: 'input', step: 0 },
      { x: 192, y: 16, w: 200, h: 88, label: 'Open block', sub: ['Min size, max size', 'and a time limit,', 'set by each L2'], tone: 'focal', step: 1 },
      { x: 448, y: 16, w: 144, h: 88, label: 'Sealed block', sub: ['Closed and added', 'to the chain'], tone: 'ink', step: 4 },
      { x: 0, y: 200, w: 168, h: 88, label: 'Quiet period', sub: ['Time limit runs out;', 'a small block seals', 'quickly'], tone: 'ink', step: 2 },
      { x: 192, y: 200, w: 200, h: 88, label: 'Busy period', sub: ['Block grows toward', 'the maximum, so no', 'backlog builds'], tone: 'ink', step: 3 },
      { x: 448, y: 200, w: 144, h: 88, label: 'Hyper 0x record', sub: ['All L2s settle', 'to one shared', 'record'], tone: 'store', step: 5 },
    ],
    arrows: [
      { points: [[136, 60], [192, 60]], step: 1 },
      { points: [[392, 60], [448, 60]], step: 4 },
      { points: [[216, 104], [216, 152], [84, 152], [84, 200]], leader: true, step: 2 },
      { points: [[344, 104], [344, 200]], leader: true, step: 3 },
      { points: [[520, 104], [520, 200]], step: 5 },
    ],
  },
};
