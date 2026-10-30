'use client';

import { consensusTreeKey } from '@/lib/storage';
import { emitActivity } from '@/lib/activity';
import { commitThought, freshTree, type CommitInput, type CommitResult } from './tree';
import { getLabTask } from './index';
import type { ConsensusGraph, LabTask } from './types';

const STORAGE_EVENT = 'rp:localstorage';

function isGraph(value: unknown, labSlug: string): value is ConsensusGraph {
  if (!value || typeof value !== 'object') return false;
  const g = value as Partial<ConsensusGraph>;
  return (
    g.labSlug === labSlug &&
    Array.isArray(g.nodes) &&
    Array.isArray(g.edges) &&
    Array.isArray(g.activePath) &&
    Array.isArray(g.prunedNodeIds) &&
    typeof g.rootId === 'string' &&
    g.nodes.some((n) => n?.id === g.rootId)
  );
}

function readStoredGraph(labSlug: string): ConsensusGraph | null {
  try {
    const raw = window.localStorage.getItem(consensusTreeKey(labSlug));
    if (raw === null) return null;
    const parsed = JSON.parse(raw);
    return isGraph(parsed, labSlug) ? parsed : null;
  } catch {
    return null;
  }
}

/**
 * Auto-commits a thought node into the lab's consensus tree on the student's
 * behalf (`source: 'auto'`). Used by engagement events — exercise progress
 * and workspace activity — so the tree evolves without a manual commit.
 * Writes through the same localStorage key + custom event the tree hook
 * uses, so an open workspace or tree modal reflects it immediately.
 */
export function autoCommitThought(
  labSlug: string,
  input: Omit<CommitInput, 'source'>,
): CommitResult | null {
  if (typeof window === 'undefined') return null;
  const task = getLabTask(labSlug);
  if (!task) return null;
  const graph = readStoredGraph(labSlug) ?? freshTree(labSlug);
  const result = commitThought(graph, task, { ...input, source: 'auto' });
  try {
    const key = consensusTreeKey(labSlug);
    window.localStorage.setItem(key, JSON.stringify(result.graph));
    window.dispatchEvent(new CustomEvent<string>(STORAGE_EVENT, { detail: key }));
  } catch {
    // Persistence failure must not break the engagement flow.
  }
  emitActivity('tree.thought.commit', {
    labSlug,
    data: {
      nodeId: result.node.id,
      kind: input.kind,
      sceneId: input.sceneId,
      source: 'auto',
      matchedGold: Boolean(result.matchedGoldId),
    },
  });
  return result;
}

/** Default scene anchor for nodes committed outside the workspace. */
export function autoSceneId(task: LabTask): string {
  return task.scenes[0]?.id ?? '';
}
