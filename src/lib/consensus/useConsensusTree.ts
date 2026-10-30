'use client';

import { useCallback, useMemo } from 'react';
import { useLocalStorage } from '@/lib/useLocalStorage';
import { consensusTreeKey } from '@/lib/storage';
import { commitThought, freshTree, type CommitInput, type CommitResult } from './tree';
import type { ConsensusGraph, LabTask } from './types';

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

/**
 * The student's consensus tree for a lab, persisted at rp:v1:tree:{labSlug}.
 * During SSR / first paint `graph` is a fresh root-only tree and
 * `hydrated === false`; corrupt or foreign stored data falls back to fresh.
 */
export function useConsensusTree(task: LabTask) {
  const { labSlug } = task;
  const initial = useMemo(() => freshTree(labSlug), [labSlug]);
  const { value, hydrated, setValue, remove } = useLocalStorage<ConsensusGraph>(
    consensusTreeKey(labSlug),
    initial,
  );

  const graph = isGraph(value, labSlug) ? value : initial;

  const commit = useCallback(
    (input: CommitInput): CommitResult => {
      const result = commitThought(graph, task, input);
      setValue((prev) => {
        const base = isGraph(prev, labSlug) ? prev : freshTree(labSlug);
        // Re-apply on the latest stored graph so another tab's commit is kept.
        return base.version === graph.version ? result.graph : commitThought(base, task, input).graph;
      });
      return result;
    },
    [graph, labSlug, setValue, task],
  );

  const reset = useCallback(() => remove(), [remove]);

  return { graph, hydrated, commit, reset };
}
