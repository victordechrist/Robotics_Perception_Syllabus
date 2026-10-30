'use client';

import { useLocalStorage } from '@/lib/useLocalStorage';
import { consensusTreeKey } from '@/lib/storage';
import type { ConsensusGraph } from '@/lib/consensus/types';
import { Badge } from '@/components/ui/badge';
import { GitBranch } from 'lucide-react';

interface WorkspaceProgressBadgeProps {
  labSlug: string;
  goldTotal: number;
}

/** "Reasoning tree" pill + gold-alignment % for lab index cards (empty during SSR). */
export function WorkspaceProgressBadge({ labSlug, goldTotal }: WorkspaceProgressBadgeProps) {
  const { value, hydrated } = useLocalStorage<ConsensusGraph | null>(consensusTreeKey(labSlug), null);
  const nodes = Array.isArray(value?.nodes) ? value.nodes : [];
  const matched = new Set(nodes.map((n) => n?.goldMatchId).filter(Boolean)).size;
  const pct = goldTotal > 0 ? Math.round((matched / goldTotal) * 100) : 0;

  return (
    <span className="inline-flex items-center gap-2">
      <Badge variant="default" className="gap-1">
        <GitBranch className="h-3 w-3" /> Reasoning tree
      </Badge>
      {hydrated && nodes.length > 1 && (
        <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400">{pct}% aligned</span>
      )}
    </span>
  );
}
