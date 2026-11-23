/**
 * Copy for the H0x-ADE product page (/products/h0x-ade/). Every claim here is a
 * capability, not a measurement (CLAUDE.md R11.4). The proof lists stay empty
 * until a real, dated measurement exists (R11.3).
 */
import type { Threat } from '@data/threats';

export interface Proof { value: string; label: string; basis: string; date: string }

export const adePage = {
  hero: {
    kicker: 'H0x-ADE, the agentic development environment',
    line1: 'Fewer tokens per task.',
    line2: 'A receipt for every action.',
    sub: 'H0x-ADE is the agentic development environment that compacts context, gates each agent call, and records every action on the Hyper 0x blockchain.',
    docs: 'Read the docs',
    models: ['Claude Code', 'Codex', 'ChatGPT', 'Grok', 'OpenCode', 'Custom agents'],
  },
  nav: {
    label: 'H0x-ADE capabilities',
    links: [
      { label: 'Token saving', href: '#send-the-model-less' },
      { label: 'Observability', href: '#see-every-call' },
      { label: 'Security', href: '#what-the-chain-decides' },
      { label: 'Blockchain', href: '#why-a-blockchain' },
    ],
  },
  parts: {
    id: 'four-parts',
    label: 'Anatomy',
    claim: 'Four parts.',
    payoff: 'One path for every call.',
    body: 'Every agent call travels the same four stations, left to right, and none of them is optional.',
    cards: [
      { id: 'context-compactor', title: 'Context compactor', text: 'Trims tool definitions and history before the model reads them.', href: '#send-the-model-less' },
      { id: 'trace', title: 'Trace', text: 'Shows each call, its tools and its token spend as it runs.', href: '#see-every-call' },
      { id: 'gate', title: 'Gate', text: 'Checks the call against your rules before the agent acts.', href: '#what-the-chain-decides' },
      { id: 'receipt', title: 'Receipt', text: 'Writes a signed record of the action on the chain.', href: '#why-a-blockchain' },
    ],
  },
  tokens: {
    id: 'send-the-model-less',
    label: 'Token saving',
    claim: 'Send the model less.',
    payoff: 'Keep what the task needs.',
    body: 'H0x-ADE compacts the context before each call, so the model reads only what the task needs. Whatever it drops stays in the record and can be recalled.',
    rows: [
      { title: 'Tool definitions compacted', text: 'MCP tool definitions shrink to the fields the model uses.' },
      { title: 'Budgets per task', text: 'Each agent and each task gets a token budget the gate enforces.' },
      { title: 'History summarised', text: 'Repeated turns collapse into a short summary the model can read.' },
    ],
    transcript: {
      title: 'agent session',
      caption: 'A sample session: one instruction, four tool results tagged kept, summarised or dropped, and a result.',
      instruction: 'Fix the failing date parser in the billing service',
      lines: [
        { tool: 'read_file billing/dates.ts', tag: 'kept' },
        { tool: 'run_tests billing', tag: 'kept' },
        { tool: 'search_repo parseDate', tag: 'summarised' },
        { tool: 'list_tools (full catalogue)', tag: 'dropped' },
      ],
      result: 'Patch ready for review. Receipt written.',
    },
  },
  see: {
    id: 'see-every-call',
    label: 'Observability',
    claim: 'See every call.',
    payoff: 'Then put the record to work.',
    console: {
      caption: 'A console with three lanes: logs, threat detections and token spend by agent.',
      lanes: ['Logs', 'Threat detections', 'Token spend'],
      logs: ['agent-a  read_file  allowed', 'agent-b  http_post  masked', 'agent-a  shell_exec  denied'],
      detections: ['Instruction found in tool output', 'Secret pattern in prompt'],
      spend: [{ agent: 'agent-a', w: 72 }, { agent: 'agent-b', w: 46 }, { agent: 'agent-c', w: 28 }],
    },
    a: {
      id: 'what-you-can-see',
      title: 'What you can see',
      bullets: [
        'Logs of every call, with its tools and arguments.',
        'Threat detections, shown beside the call that raised them.',
        'Where token spend goes, by agent and by tool.',
      ],
    },
    b: {
      id: 'train-a-smaller-model',
      title: 'Train a smaller model',
      text: 'Each record is a clean example of a task done well. Your team can use those examples to train a smaller model for work the large one does today.',
      caption: 'A large circle labelled finds feeding a small circle labelled does.',
    },
    c: {
      id: 'agents-that-improve-themselves',
      title: 'Agents that improve themselves',
      text: 'An agent reviews its own receipts and proposes a new rule. A person approves it, the gate applies it, and the next run starts from the better rule.',
      caption: 'A loop of four steps: run, receipt, review, rule.',
    },
  },
  security: {
    id: 'what-the-chain-decides',
    label: 'Security',
    claim: 'What the chain decides.',
    payoff: 'What runs without it.',
    caption: 'How each condition is handled, and whether the rule or the receipt sits on the Hyper 0x chain.',
    columns: ['Condition', 'Mechanism', 'Where it runs'],
    groups: [
      { chain: 'yes' as Threat['chain'], title: 'Decided on the chain', where: 'On chain' },
      { chain: 'partly' as Threat['chain'], title: 'Checked off the chain, rule kept on the chain', where: 'Off chain, rule on chain' },
      { chain: 'evidence' as Threat['chain'], title: 'Handled off the chain, receipt on the chain', where: 'Off chain, receipt on chain' },
    ],
    rows: {
      'Prompt injection and goal hijack': { condition: 'When text in a page carries instructions', mechanism: 'The injection gate treats outside text as data and checks each resulting action.' },
      'Data leaks through AI': { condition: 'When an agent handles customer data', mechanism: 'The privacy gate masks personal data and secrets before any model reads them.' },
      'Agents with too much power': { condition: 'When an agent holds more tools than needed', mechanism: 'The egress contract decides what each agent can send, and budgets limit its calls.' },
      'Borrowed identity and privilege abuse': { condition: 'When an agent runs on a shared key', mechanism: 'One gateway gives each call a known sender, and rules apply per agent.' },
      'Poisoned AI supply chain': { condition: 'When an agent adds a new package', mechanism: 'The supply-chain gate checks an allow-list or a pinned hash before install.' },
      'Poisoned agent memory': { condition: 'When an agent saves a note to memory', mechanism: 'The injection gate checks what is written, and each write leaves a receipt.' },
      'Unsafe output and code': { condition: 'When an agent returns code or links', mechanism: 'The output gate removes scripts and secrets, and the receipt shows what changed.' },
      'Uncontrolled cost': { condition: 'When an agent loops on paid calls', mechanism: 'The budget gate limits spend per task, and the kill switch ends the run.' },
      'Rogue agents': { condition: 'When an agent breaks its rules', mechanism: 'The response moves from observed to restricted, and a person can end the run.' },
      'Cascading agent failures': { condition: 'When one agent hands bad work onward', mechanism: 'The gateway checks each handoff, and receipts show where the chain broke.' },
    } as Record<string, { condition: string; mechanism: string }>,
    limits: {
      id: 'what-h0x-ade-does-not-cover',
      title: 'What H0x-ADE does not cover',
      text: 'H0x-ADE does not cover these four areas. They stay with you, and the gate is not a substitute for them.',
      items: ['Application code', 'Infrastructure', 'The model itself', 'Session credentials'],
    },
  },
  chain: {
    id: 'why-a-blockchain',
    label: 'Blockchain',
    claim: 'Why a blockchain.',
    payoff: 'Three jobs on every call.',
    jobs: [
      { step: 'Before the call', id: 'rules', title: 'Rules', text: 'Your rules live in a versioned contract on the chain. Nobody, including an admin, can widen them without a visible new version.', caption: 'A rule sheet.' },
      { step: 'During the call', id: 'custody', title: 'Custody', text: 'Custody means a service holds the signing key, not the agent. The agent asks for a signature, and the key never leaves its box.', caption: 'A key held inside a box.' },
      { step: 'After the call', id: 'receipts', title: 'Receipts', text: 'Each action produces a signed slip linked to the slip before it. A deleted entry leaves a gap that anyone can see.', caption: 'A slip linked to the previous slip.' },
    ],
  },
  cta: {
    claim: 'Run your agents',
    payoff: 'on H0x-ADE.',
    text: 'Thirty minutes with an engineer who builds it. Bring one agent and one rule you want it to follow.',
  },
  proof: [] as Proof[],
  tokenMeasurement: [] as Proof[],
};
