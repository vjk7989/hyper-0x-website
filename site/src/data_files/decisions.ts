/**
 * The engineering decisions /resources explains (CLAUDE.md R11.7): what was
 * chosen, what it was chosen over, what it cost and what it bought. Each one
 * is sourced from research/product-facts.md, the founder-confirmed ADR-27 and
 * ADR-43 in architecture-record-document.md, or the published encryption doc.
 * No figure appears; the costs are stated qualitatively because none are
 * measured and published (R10.8, R11.4).
 */
export interface Decision {
  id: string;
  title: string;
  chose: string;
  instead: string;
  cost: string;
  bought: string;
}

export const decisions: Decision[] = [
  {
    id: 'consensus',
    title: 'Hashgraph-style aBFT consensus',
    chose: 'Validators gossip about what they have heard and work out how the others would vote, so the voting round of a classical protocol is never sent. Ordering is fair and finality is asynchronous.',
    instead: 'A classical leader-and-vote protocol, where one proposer suggests an order and the rest vote on it.',
    cost: 'Every validator holds the full communication graph, so storage and bandwidth per node are higher and the validator set cannot grow without bound.',
    bought: 'Finality that assumes nothing about message timing. The order comes from what the network saw, so no single proposer picks it.',
  },
  {
    id: 'validators',
    title: 'A permissioned validator set on the public layer 1',
    chose: 'Buckleson operates the validator set of the Hyper 0x layer 1, and the set is permissioned.',
    instead: 'An open validator set that anyone can join.',
    cost: 'On the public layer 1 you cannot choose who validates, and you rely on a named operator. A private L2 exists so that you can choose yours.',
    bought: 'A known validator set that suits the consensus above, and one accountable operator for the base layer.',
  },
  {
    id: 'private-l2',
    title: 'A private L2 rather than a standalone private chain',
    chose: 'An organisation gets its own layer 2 with its own validators and privacy rules, settling to the Hyper 0x layer 1.',
    instead: 'A standalone private chain for each organisation, which is the usual enterprise answer.',
    cost: 'There is a base layer to settle to, so your chain is not fully independent of it, and settlement adds a step a standalone chain does not have.',
    bought: 'A record that is not kept only by whoever runs your chain, and no need to run a full blockchain yourself.',
  },
  {
    id: 'key-exchange',
    title: 'Post-quantum-resistant key exchange from the start',
    chose: 'Every connection uses a hybrid key exchange: ML-KEM-768 always paired with X25519.',
    instead: 'A conventional key exchange alone, with a migration later.',
    cost: 'Each handshake does the work of two key exchanges instead of one.',
    bought: 'Data that must stay private for decades is not exposed to harvest now, decrypt later: an attacker has to break both the lattice problem and the elliptic curve, and the encryption resists the quantum attacks known today.',
  },
  {
    id: 'receipts',
    title: 'Receipts on the chain, linked to each other',
    chose: 'Every action leaves a receipt on the chain, and the gate’s judgement on a refused call leaves one too. Each receipt links to the one before it.',
    instead: 'Logging in the application, which costs less and is what most systems do.',
    cost: 'Receipts use chain capacity, and a written receipt cannot be quietly tidied up afterwards.',
    bought: 'A deleted entry shows as a gap. An application log can be edited by whoever owns the application, which is the party an auditor is checking.',
  },
  {
    id: 'egress-policy',
    title: 'You write the egress policy, not a model',
    chose: 'Customers write their own egress policies, which say what an agent may reach and do, and we recommend an audit of the policy.',
    instead: 'Letting an AI draft the policy, which is faster.',
    cost: 'It takes your team’s time, and it costs us a convenience we could sell.',
    bought: 'If the model that drafted a policy were itself compromised, the compromise would sit inside the control meant to contain it, and that is very hard to recover from.',
  },
];
