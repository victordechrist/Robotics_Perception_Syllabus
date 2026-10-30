'use client';

import { consensusTreeKey } from '@/lib/storage';
import { emitActivity } from '@/lib/activity';
import { LAB_TASKS } from './index';
import { scenesWithCommits } from './tree';
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

/** The stored student tree for a lab, or null when absent/corrupt. */
export function readStoredTree(labSlug: string): ConsensusGraph | null {
  if (typeof window === 'undefined') return null;
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
 * True once every lab with a consensus task is "finished": every scene of
 * every task has at least one committed thought (the same condition that
 * unlocks the gold tree). Student trees are preserved until this point so
 * per-lab progress can't be wiped mid-course.
 */
export function allTasksFinished(): boolean {
  if (typeof window === 'undefined') return false;
  return Object.values(LAB_TASKS).every((task: LabTask) => {
    const graph = readStoredTree(task.labSlug);
    if (!graph) return false;
    const committed = scenesWithCommits(graph);
    return task.scenes.every((s) => committed.has(s.id));
  });
}

/** Every stored student tree, keyed by lab slug (tasks with no tree omitted). */
export function collectAllTrees(): Record<string, ConsensusGraph> {
  const trees: Record<string, ConsensusGraph> = {};
  for (const slug of Object.keys(LAB_TASKS)) {
    const graph = readStoredTree(slug);
    if (graph) trees[slug] = graph;
  }
  return trees;
}

/**
 * Wipe every student tree. Dispatches the same custom event the hooks use
 * so mounted views (workspace, thought-tree modal, /progress) reset live.
 */
export function resetAllTrees(): void {
  if (typeof window === 'undefined') return;
  for (const slug of Object.keys(LAB_TASKS)) {
    const key = consensusTreeKey(slug);
    if (window.localStorage.getItem(key) === null) continue;
    window.localStorage.removeItem(key);
    window.dispatchEvent(new CustomEvent<string>(STORAGE_EVENT, { detail: key }));
    emitActivity('tree.reset', { labSlug: slug, data: { auto: true, reason: 'all-tasks-downloaded' } });
  }
}
