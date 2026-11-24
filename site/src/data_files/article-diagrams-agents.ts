import type { ArticleDiagram } from './article-diagrams';

/** Agent-security set: kill switch, memory, tool calls, MCP and multi-agent diagrams. See article-diagrams.ts for the rules. */
export const articleDiagramsAgents: Record<string, ArticleDiagram> = {
  'ai-agent-kill-switch': {
    title: 'Where the kill switch sits, outside the agent',
    caption:
      'Every action of the agent passes one gateway. The gateway scores the risk, then watches, restricts or ends the agent. A person sends the stop command through a separate channel, so the agent cannot block it. Each decision goes into a hash-chained record, and the latest hash is anchored on Hyper 0x.',
    width: 744,
    height: 304,
    nodes: [
      { x: 0, y: 16, w: 128, h: 72, label: 'AI agent', sub: ['Runs inside its', 'own runtime'], tone: 'input', step: 0 },
      { x: 216, y: 16, w: 184, h: 96, label: 'Gateway', sub: ['Scores risk, then', 'watches, restricts', 'or ends the agent'], tone: 'focal', step: 1 },
      { x: 488, y: 16, w: 144, h: 72, label: 'Your systems', sub: ['Files, databases,', 'cloud accounts'], tone: 'external', step: 2 },
      { x: 0, y: 200, w: 184, h: 88, label: 'Console', sub: ['A person presses', 'stop, outside', 'the agent'], tone: 'ink', step: 3 },
      { x: 432, y: 200, w: 152, h: 88, label: 'Receipt chain', sub: ['Each entry holds', 'the hash of the', 'one before it'], tone: 'store', step: 4 },
      { x: 624, y: 200, w: 120, h: 88, label: 'Hyper 0x', sub: ['Anchors the', 'latest hash'], tone: 'store', step: 5 },
    ],
    arrows: [
      { points: [[128, 52], [216, 52]], label: { text: 'actions', x: 172, y: 52 }, step: 1 },
      { points: [[400, 52], [488, 52]], label: { text: 'allowed', x: 444, y: 52 }, step: 2 },
      { points: [[184, 244], [260, 244], [260, 112]], accent: true, label: { text: 'out of band', x: 260, y: 168 }, step: 3 },
      { points: [[356, 112], [356, 244], [432, 244]], label: { text: 'receipts', x: 356, y: 168 }, step: 4 },
      { points: [[584, 244], [624, 244]], step: 5 },
    ],
  },
  'ai-agent-memory-poisoning': {
    title: 'How a memory write is checked before the agent trusts it',
    caption:
      'Treat every memory write as a privileged action. A request to remember passes an injection check, gets a source tag and meets a conflict check. A fact that clashes with a trusted record waits for a person. Checked entries become versions with a hash on Hyper 0x, and later sessions read only those.',
    width: 696,
    height: 280,
    nodes: [
      { x: 0, y: 16, w: 144, h: 88, label: 'Write request', sub: ['Email, page or', 'tool result', 'asks to save'], tone: 'input', step: 0 },
      { x: 184, y: 16, w: 144, h: 88, label: 'Injection check', sub: ['Hidden orders', 'count as data,', 'not as facts'], tone: 'ink', step: 1 },
      { x: 368, y: 16, w: 144, h: 88, label: 'Source tag', sub: ['Source, writer', 'and time, then', 'locked'], tone: 'ink', step: 2 },
      { x: 552, y: 16, w: 144, h: 88, label: 'Conflict check', sub: ['Compares with a', 'trusted record.', 'A clash waits'], tone: 'focal', step: 3 },
      { x: 552, y: 176, w: 144, h: 88, label: 'Versioned store', sub: ['Hash of each', 'version on', 'Hyper 0x'], tone: 'store', step: 4 },
      { x: 368, y: 176, w: 144, h: 88, label: 'Verified recall', sub: ['Later sessions', 'read only entries', 'that passed'], tone: 'ink', step: 5 },
    ],
    arrows: [
      { points: [[144, 60], [184, 60]], step: 1 },
      { points: [[328, 60], [368, 60]], step: 2 },
      { points: [[512, 60], [552, 60]], step: 3 },
      { points: [[624, 104], [624, 176]], step: 4 },
      { points: [[552, 220], [512, 220]], step: 5 },
    ],
  },
  'ai-agent-tool-calling-security': {
    title: 'How a gateway checks a tool call before it runs',
    caption:
      'The model only proposes a call. The gateway checks the tool against an allow-list, the arguments against a schema, then egress rules and budgets. A call above the limit is held for a person. Every call, passed or blocked, leaves a signed receipt.',
    width: 664,
    height: 384,
    nodes: [
      { x: 224, y: 0, w: 152, h: 64, label: 'Reviewer', sub: ['Sees the exact call', 'and its arguments'], tone: 'ink', step: 3 },
      { x: 0, y: 128, w: 136, h: 88, label: 'Model', sub: ['Proposes a call:', 'function name and', 'arguments'], tone: 'input', step: 0 },
      { x: 184, y: 112, w: 216, h: 120, label: 'Gateway', sub: ['Allow-list, strict schema,', 'egress rules, budget cap;', 'refuses the rest'], tone: 'focal', step: 1 },
      { x: 488, y: 128, w: 176, h: 88, label: 'Tool', sub: ['Runs with least', 'privilege; keys stay', 'in the gateway'], tone: 'external', step: 2 },
      { x: 184, y: 296, w: 216, h: 72, label: 'Receipts', sub: ['Signed, hash-chained;', 'passed or blocked'], tone: 'store', step: 4 },
    ],
    arrows: [
      { points: [[136, 172], [184, 172]], step: 1 },
      { points: [[400, 172], [488, 172]], label: { text: 'passes', x: 444, y: 172 }, step: 2 },
      { points: [[300, 112], [300, 64]], label: { text: 'held', x: 300, y: 88 }, step: 3 },
      { points: [[376, 32], [576, 32], [576, 128]], label: { text: 'approved', x: 476, y: 32 }, step: 3 },
      { points: [[292, 232], [292, 296]], label: { text: 'every call', x: 292, y: 264 }, step: 4 },
    ],
  },
  'mcp-server-security-risks': {
    title: 'How a gateway gates an MCP server at runtime',
    caption:
      'An MCP server can hide instructions in its tool description or output, and the model reads that text as guidance. A gateway between the agent and the server allow-lists servers, checks arguments, scans output and applies egress rules. A pinned hash holds a changed tool definition for review.',
    width: 720,
    height: 392,
    nodes: [
      { x: 0, y: 96, w: 144, h: 96, label: 'AI agent', sub: ['The model reads', 'the tool text as', 'guidance'], tone: 'input', step: 0 },
      { x: 208, y: 80, w: 232, h: 128, label: 'Gateway', sub: ['Allow-lists servers,', 'checks arguments,', 'scans output and', 'applies egress rules'], tone: 'focal', step: 1 },
      { x: 520, y: 96, w: 200, h: 96, label: 'MCP server', sub: ['May hide orders in', 'a tool description', 'or in its output'], tone: 'external', step: 2 },
      { x: 208, y: 288, w: 152, h: 88, label: 'Pinned hashes', sub: ['Hash recorded at', 'approval; a change', 'is held for review'], tone: 'store', step: 3 },
      { x: 488, y: 288, w: 232, h: 88, label: 'Receipts', sub: ['Hash-chained receipt', 'of every call,', 'anchored on Hyper 0x'], tone: 'store', step: 4 },
    ],
    arrows: [
      { points: [[144, 128], [208, 128]], label: { text: 'call', x: 176, y: 128 }, step: 1 },
      { points: [[208, 160], [144, 160]], label: { text: 'result', x: 176, y: 160 }, step: 1 },
      { points: [[440, 128], [520, 128]], label: { text: 'call', x: 480, y: 128 }, step: 2 },
      { points: [[520, 160], [440, 160]], accent: true, label: { text: 'tool text', x: 480, y: 160 }, step: 2 },
      { points: [[284, 288], [284, 208]], step: 3 },
      { points: [[404, 208], [404, 332], [488, 332]], step: 4 },
    ],
  },
  'multi-agent-cascading-failures': {
    title: 'Where the checks sit between agents in a workflow',
    caption:
      'One wrong fact can travel from agent to agent, and each hop makes it look more certain. Signed hand-offs set the sender and the format. The credit agent checks key facts at the source system, not against a flag. Circuit breakers limit the spread, and a receipt for each hop traces a bad fact to its first step.',
    width: 656,
    height: 392,
    nodes: [
      { x: 0, y: 16, w: 128, h: 88, label: 'Intake agent', sub: ['Reads the scan', 'of an ID'], tone: 'input', step: 0 },
      { x: 176, y: 16, w: 128, h: 88, label: 'Credit agent', sub: ['Checks key facts', 'at the source,', 'not the flag'], tone: 'focal', step: 2 },
      { x: 352, y: 16, w: 128, h: 88, label: 'Pricing agent', sub: ['Makes the offer', 'after every hop', 'has passed'], tone: 'ink', step: 4 },
      { x: 528, y: 16, w: 128, h: 88, label: 'Payout agent', sub: ['Sends the money', 'after every check'], tone: 'ink', step: 4 },
      { x: 176, y: 184, w: 128, h: 72, label: 'ID service', sub: ['Owns the fact;', 'answers directly'], tone: 'external', step: 3 },
      { x: 352, y: 184, w: 208, h: 72, label: 'Circuit breaker', sub: ['Step limit, budget,', 'timeout between agents'], tone: 'callout', step: 5 },
      { x: 0, y: 304, w: 656, h: 72, label: 'Receipts on Hyper 0x', sub: ['A signed receipt for each hop', 'A bad fact traces back to its first step'], tone: 'store', step: 6 },
    ],
    arrows: [
      { points: [[128, 60], [176, 60]], label: { text: 'signed', x: 152, y: 60 }, step: 1 },
      { points: [[304, 60], [352, 60]], step: 4 },
      { points: [[480, 60], [528, 60]], step: 4 },
      { points: [[240, 184], [240, 104]], label: { text: 'facts', x: 240, y: 144 }, step: 3 },
      { points: [[504, 184], [504, 60]], leader: true, step: 5 },
      { points: [[64, 104], [64, 304]], step: 6 },
      { points: [[592, 104], [592, 304]], step: 6 },
    ],
  },
};
