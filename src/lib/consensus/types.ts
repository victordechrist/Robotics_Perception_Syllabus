// Consensus tree data model — the per-lab reasoning workspace.
//
// One task definition file per lab under src/lib/consensus/tasks/<slug>.ts,
// merged into the LAB_TASKS registry (index.ts) keyed by lab slug.
//
// Persistence contract (client-side, localStorage):
//   key   = `rp:v1:tree:{labSlug}`
//   value = ConsensusGraph
//
// Rules that keep the shape proven in the reference implementation:
//   - every error/failure creates its own `error`/`dead-end` child branch;
//     it never mutates the parent node;
//   - a "repair" is a new node with a `repairs` edge back to what it fixes;
//   - `goldMatchId` records which gold-tree node a committed node aligned to.

export type NodeKind =
  | 'goal'
  | 'subgoal'
  | 'operator'
  | 'evidence'
  | 'error'
  | 'hypothesis'
  | 'dead-end';

export type NodeStatus =
  | 'candidate'
  | 'active'
  | 'confirmed'
  | 'pruned'
  | 'dormant'
  | 'dead-end';

export type EdgeRelation =
  | 'elaborates'
  | 'depends-on'
  | 'revises'
  | 'contradicts'
  | 'repairs'
  | 'abandons';

/** Edge relations that shape the parent→child tree layout. */
export const STRUCTURAL_RELATIONS: readonly EdgeRelation[] = [
  'elaborates',
  'depends-on',
];

export interface ConsensusNode {
  id: string;
  label: string;
  content: string;
  kind: NodeKind;
  status: NodeStatus;
  parentId?: string | null;
  leftChildId?: string | null;
  rightChildId?: string | null;
  /** Set when this node aligns to a node in the lab's gold tree. */
  goldMatchId?: string | null;
  /** Scene the thought was committed under. */
  sceneId?: string;
  hintUsed?: boolean;
  /** How the node got committed — auto-committed by engagement, or manual. */
  source?: 'auto' | 'manual';
}

export interface ConsensusEdge {
  from: string;
  to: string;
  relation: EdgeRelation;
}

export interface ConsensusGraph {
  labSlug: string;
  nodes: ConsensusNode[];
  edges: ConsensusEdge[];
  /** Id of the root `goal` node. */
  rootId: string;
  /** Bumped on every committed mutation (guards stale writes). */
  version: number;
  prunedNodeIds: string[];
  /** Ordered node ids forming the current reasoning path. */
  activePath: string[];
}

/** One narrated step of a lab task. */
export interface Scene {
  id: string;
  order: number;
  title: string;
  /** Story framing for this step of the lab. */
  narration: string;
  /** What the student must figure out. */
  goal: string;
  /** Gold-tree node ids this scene expects the student to reach. */
  goldNodeIds: string[];
  elicitation: 'code-cell' | 'free-text' | 'choice';
  hints?: string[];
}

/** Instructor-authored consensus task for one lab. */
export interface LabTask {
  labSlug: string;
  title: string;
  brief: string;
  scenes: Scene[];
  /** Canonical reasoning path the student tree is scored against. */
  goldTree: ConsensusGraph;
}
