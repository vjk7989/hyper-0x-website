/**
 * Inline diagrams for blog articles (drawn by ArticleDiagram under the
 * article body). The 45 posts that are .md cannot hold components, so each
 * diagram is registered here by post slug, as compare.ts does for CompareFlow.
 * A slug with no entry renders nothing.
 *
 * Rules, from the diagram-design skill (skinned in
 * .agents/skills/diagram-design/references/style-guide.md):
 * - At most 9 nodes, 12 arrows and 2 accent elements (a focal or callout
 *   node, or an accent arrow). Orthogonal arrows only: the component
 *   throws on a diagonal.
 * - Every coordinate and size is a multiple of 4. The viewBox is also the
 *   minimum rendered width, so no text falls under 11px on a narrow screen
 *   (the figure scrolls sideways instead of shrinking).
 * - sub is one string per line. Fit it to the box: a 11px mono character is
 *   about 6.8 wide, a 13px label character about 7.4.
 * - step is the order of the calm reveal (0 first). The static drawing
 *   shows everything at once, and so does reduced motion.
 * Text is technical description. It follows WRITING.md and makes only the
 * claims that the post itself makes.
 */
export type NodeTone = 'focal' | 'ink' | 'input' | 'store' | 'external' | 'callout';

export interface DiagramNode {
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
  sub?: string[];
  tone: NodeTone;
  step: number;
}
export interface DiagramArrow {
  /** Corner points, each segment horizontal or vertical. */
  points: [number, number][];
  accent?: boolean;
  /** A dashed line with no arrowhead: a leader to a callout. */
  leader?: boolean;
  label?: { text: string; x: number; y: number };
  step: number;
}
export interface ArticleDiagram {
  title: string;
  /** Answers the heading in a few short sentences, before the drawing. */
  caption: string;
  width: number;
  height: number;
  nodes: DiagramNode[];
  arrows: DiagramArrow[];
}

/**
 * Every `article-diagrams-*.ts` part is merged here, as compare.ts merges its
 * parts, so a new batch of diagrams is a new file and never an edit to this one.
 */
const parts = import.meta.glob<Record<string, Record<string, ArticleDiagram>>>('./article-diagrams-*.ts', { eager: true });

export const articleDiagrams: Record<string, ArticleDiagram> = Object.assign(
  {},
  ...Object.values(parts).flatMap(mod => Object.values(mod)),
);
