// Pure consensus-tree engine: fresh trees, thought commits (structural
// branching + repairs), keyword-overlap gold matching, and scoring.
// Client-side only — no persistence happens here.

import { STRUCTURAL_RELATIONS } from './types';
import type {
  ConsensusEdge,
  ConsensusGraph,
  ConsensusNode,
  LabTask,
  NodeKind,
} from './types';

const ROOT_ID = 'root';

/** A pristine tree: a single `goal` root the student's thoughts grow under. */
export function freshTree(labSlug: string): ConsensusGraph {
  const root: ConsensusNode = {
    id: ROOT_ID,
    label: 'Task goal',
    content: 'Work through the lab scenes and grow a reasoning tree.',
    kind: 'goal',
    status: 'active',
    parentId: null,
    leftChildId: null,
    rightChildId: null,
  };
  return {
    labSlug,
    nodes: [root],
    edges: [],
    rootId: ROOT_ID,
    version: 1,
    prunedNodeIds: [],
    activePath: [ROOT_ID],
  };
}

// ---------------------------------------------------------------------------
// Structure helpers
// ---------------------------------------------------------------------------

function isStructural(relation: string): boolean {
  return (STRUCTURAL_RELATIONS as readonly string[]).includes(relation);
}

/** Recompute parentId/leftChildId/rightChildId from structural edges. */
export function syncChildSlots(graph: ConsensusGraph): ConsensusGraph {
  const parentMap = new Map<string, string>();
  const childrenMap = new Map<string, string[]>();
  for (const node of graph.nodes) childrenMap.set(node.id, []);
  for (const edge of graph.edges) {
    if (!isStructural(edge.relation)) continue;
    if (!parentMap.has(edge.to)) parentMap.set(edge.to, edge.from);
    childrenMap.get(edge.from)?.push(edge.to);
  }
  const nodes = graph.nodes.map((node) => {
    const children = childrenMap.get(node.id) ?? [];
    return {
      ...node,
      parentId: parentMap.get(node.id) ?? null,
      leftChildId: children[0] ?? null,
      rightChildId: children[1] ?? null,
    };
  });
  return { ...graph, nodes };
}

// ---------------------------------------------------------------------------
// Gold matching — token overlap (pedagogical alignment, not NLP)
// ---------------------------------------------------------------------------

const STOPWORDS = new Set([
  'the', 'and', 'for', 'with', 'that', 'this', 'from', 'into', 'are', 'was',
  'you', 'your', 'each', 'then', 'than', 'out', 'its', 'use', 'using', 'via',
  'not', 'all', 'can', 'has', 'how', 'why', 'when', 'what', 'new', 'set',
  'over', 'will', 'also', 'our', 'their', 'they', 'them', 'any', 'both',
  'shows', 'show', 'should', 'which', 'before', 'after', 'under', 'same',
]);

function stem(token: string): string {
  return token.length > 4 && token.endsWith('s') && !token.endsWith('ss')
    ? token.slice(0, -1)
    : token;
}

export function tokenize(text: string): string[] {
  const tokens = text
    .toLowerCase()
    .replace(/[^a-z0-9_]+/g, ' ')
    .split(' ')
    .filter((t) => t.length > 2 && !STOPWORDS.has(t))
    .map(stem);
  return [...new Set(tokens)];
}

// Overlap normalised by the shorter side, so a terse but precise thought can
// still align with a verbose gold node.
function overlapScore(studentTokens: Set<string>, goldTokens: string[]): number {
  const denom = Math.min(goldTokens.length, studentTokens.size);
  if (denom === 0) return 0;
  let hits = 0;
  for (const t of goldTokens) if (studentTokens.has(t)) hits += 1;
  return hits / denom;
}

const MATCH_THRESHOLD = 0.4;
const MIN_TOKEN_HITS = 2;

/**
 * Best unmatched gold node for a committed thought. The current scene's
 * goldNodeIds are tried first, then the rest of the gold tree.
 */
export function findGoldMatch(
  content: string,
  task: LabTask,
  usedGoldIds: ReadonlySet<string>,
  preferredGoldIds: readonly string[],
): string | null {
  const studentTokens = new Set(tokenize(content));
  const goldById = new Map(task.goldTree.nodes.map((n) => [n.id, n]));

  const rank = (ids: readonly string[]): string | null => {
    let bestId: string | null = null;
    let bestScore = 0;
    let bestHits = 0;
    for (const id of ids) {
      if (usedGoldIds.has(id)) continue;
      const gold = goldById.get(id);
      if (!gold) continue;
      const goldTokens = tokenize(`${gold.label} ${gold.content}`);
      const score = overlapScore(studentTokens, goldTokens);
      const hits = goldTokens.filter((t) => studentTokens.has(t)).length;
      if (hits >= MIN_TOKEN_HITS && score > bestScore) {
        bestScore = score;
        bestHits = hits;
        bestId = id;
      }
    }
    return bestScore >= MATCH_THRESHOLD && bestHits >= MIN_TOKEN_HITS ? bestId : null;
  };

  const preferred = preferredGoldIds.filter((id) => !usedGoldIds.has(id));
  const inScene = rank(preferred);
  if (inScene) return inScene;
  return rank(task.goldTree.nodes.map((n) => n.id));
}

// ---------------------------------------------------------------------------
// Commit
// ---------------------------------------------------------------------------

export interface CommitInput {
  /** Student-written thought (code cell text, free text, or chosen option). */
  content: string;
  kind: NodeKind;
  sceneId: string;
  hintUsed?: boolean;
  /** Error node id this commit repairs (repair flow). */
  repairTargetId?: string | null;
  /** 'auto' marks nodes the app commits on the student's behalf. */
  source?: 'auto' | 'manual';
}

export interface CommitResult {
  graph: ConsensusGraph;
  node: ConsensusNode;
  /** Gold node id the commit aligned to, if any. */
  matchedGoldId: string | null;
}

function nextNodeId(graph: ConsensusGraph): string {
  const taken = new Set(graph.nodes.map((n) => n.id));
  for (let i = graph.nodes.length; i < graph.nodes.length + 1000; i++) {
    const id = `n${i}`;
    if (!taken.has(id)) return id;
  }
  return `n${Math.random().toString(36).slice(2, 8)}`;
}

function makeLabel(content: string): string {
  const first = content.split('\n').find((l) => l.trim().length > 0) ?? 'thought';
  const cleaned = first.trim().replace(/^#+\s*/, '');
  return cleaned.length > 60 ? `${cleaned.slice(0, 57)}…` : cleaned;
}

const ERROR_KINDS: ReadonlySet<NodeKind> = new Set(['error', 'dead-end']);

/**
 * Commit a thought onto the tree. The node attaches under the activePath tip
 * via an 'elaborates' structural edge; error kinds branch as dead-ends and do
 * not extend the active path. A repair additionally draws a 'repairs' edge to
 * the fixed node and prunes it.
 */
export function commitThought(
  graph: ConsensusGraph,
  task: LabTask,
  input: CommitInput,
): CommitResult {
  const isError = ERROR_KINDS.has(input.kind);
  const usedGoldIds = new Set(
    graph.nodes.map((n) => n.goldMatchId).filter((id): id is string => !!id),
  );
  const scene = task.scenes.find((s) => s.id === input.sceneId);
  const matchedGoldId = isError
    ? null
    : findGoldMatch(input.content, task, usedGoldIds, scene?.goldNodeIds ?? []);

  const parentId = graph.activePath[graph.activePath.length - 1] ?? graph.rootId;

  const node: ConsensusNode = {
    id: nextNodeId(graph),
    label: makeLabel(input.content),
    content: input.content,
    kind: input.kind,
    status: isError ? 'dead-end' : matchedGoldId ? 'confirmed' : 'active',
    parentId,
    leftChildId: null,
    rightChildId: null,
    goldMatchId: matchedGoldId,
    sceneId: input.sceneId,
    hintUsed: input.hintUsed ?? false,
    source: input.source ?? 'manual',
  };

  const edges: ConsensusEdge[] = [
    ...graph.edges,
    { from: parentId, to: node.id, relation: 'elaborates' },
  ];

  let nodes = graph.nodes;
  let prunedNodeIds = graph.prunedNodeIds;
  if (input.repairTargetId) {
    edges.push({ from: node.id, to: input.repairTargetId, relation: 'repairs' });
    nodes = nodes.map((n) =>
      n.id === input.repairTargetId ? { ...n, status: 'pruned' } : n,
    );
    if (!prunedNodeIds.includes(input.repairTargetId)) {
      prunedNodeIds = [...prunedNodeIds, input.repairTargetId];
    }
  }

  const next: ConsensusGraph = {
    ...graph,
    nodes: [...nodes, node],
    edges,
    version: graph.version + 1,
    prunedNodeIds,
    activePath: isError ? graph.activePath : [...graph.activePath, node.id],
  };

  return { graph: syncChildSlots(next), node, matchedGoldId };
}

// ---------------------------------------------------------------------------
// Scoring
// ---------------------------------------------------------------------------

export interface TreeScore {
  matchedGoldIds: string[];
  goldMatchedCount: number;
  goldTotal: number;
  goldMatchPct: number;
  confirmedCount: number;
  prunedCount: number;
  errorCount: number;
  /** Scene ids whose goldNodeIds are all matched. */
  reachedSceneIds: string[];
  /** First unreached scene id (task order), or null when all reached. */
  nextUnreachedSceneId: string | null;
  feedback: string;
}

export function scoreTree(graph: ConsensusGraph, task: LabTask): TreeScore {
  const matchedGoldIds = [
    ...new Set(
      graph.nodes.map((n) => n.goldMatchId).filter((id): id is string => !!id),
    ),
  ];
  const matched = new Set(matchedGoldIds);
  const goldTotal = task.goldTree.nodes.length;
  const goldMatchPct =
    goldTotal === 0 ? 0 : Math.round((matchedGoldIds.length / goldTotal) * 100);

  const orderedScenes = [...task.scenes].sort((a, b) => a.order - b.order);
  const reachedSceneIds = orderedScenes
    .filter((s) => s.goldNodeIds.every((id) => matched.has(id)))
    .map((s) => s.id);
  const nextUnreached = orderedScenes.find((s) => !reachedSceneIds.includes(s.id));

  const confirmedCount = graph.nodes.filter((n) => n.status === 'confirmed').length;
  const prunedCount = graph.prunedNodeIds.length;
  const errorCount = graph.nodes.filter(
    (n) => n.status === 'dead-end' || n.kind === 'error' || n.kind === 'dead-end',
  ).length;

  const feedback = nextUnreached
    ? `${reachedSceneIds.length} of ${orderedScenes.length} scene goals reached — revisit scene ${nextUnreached.order}.`
    : 'Great alignment! All scene goals match canonical expectations.';

  return {
    matchedGoldIds,
    goldMatchedCount: matchedGoldIds.length,
    goldTotal,
    goldMatchPct,
    confirmedCount,
    prunedCount,
    errorCount,
    reachedSceneIds,
    nextUnreachedSceneId: nextUnreached?.id ?? null,
    feedback,
  };
}

/** Scenes the student has committed at least one thought under. */
export function scenesWithCommits(graph: ConsensusGraph): Set<string> {
  return new Set(
    graph.nodes.map((n) => n.sceneId).filter((id): id is string => !!id),
  );
}
