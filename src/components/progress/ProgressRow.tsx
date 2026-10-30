'use client';

import Link from 'next/link';
import { useLocalStorage } from '@/lib/useLocalStorage';
import { consensusTreeKey } from '@/lib/storage';
import { useExerciseProgress, countCompletedSteps } from '@/lib/exercises/progress';
import { getExercise } from '@/lib/exercises';
import { getLabTask } from '@/lib/consensus';
import type { ConsensusGraph } from '@/lib/consensus/types';
import type { LabMeta } from '@/lib/types';
import { ThoughtTreeButton } from '@/components/labs/ThoughtTreeButton';
import { cn } from '@/lib/utils';
import { CheckCircle2, Circle } from 'lucide-react';

interface ProgressRowProps {
  lab: LabMeta;
}

/**
 * One lab's aggregate line on /progress: exercise step completion + consensus
 * tree gold alignment. Renders neutral zeros before hydration so SSR output
 * matches the first client render.
 */
export function ProgressRow({ lab }: ProgressRowProps) {
  const exercise = getExercise(lab.slug);
  const task = getLabTask(lab.slug);
  const { progress, hydrated } = useExerciseProgress(lab.slug, exercise?.steps ?? []);
  const { value: tree } = useLocalStorage<ConsensusGraph | null>(consensusTreeKey(lab.slug), null);

  const totalSteps = exercise?.steps.length ?? 0;
  const doneSteps = hydrated ? countCompletedSteps(progress) : 0;
  const goldTotal = task?.goldTree.nodes.length ?? 0;
  const nodes = Array.isArray(tree?.nodes) ? tree.nodes : [];
  const matched = new Set(nodes.map((n) => n?.goldMatchId).filter(Boolean)).size;
  const alignPct = goldTotal > 0 ? Math.round((matched / goldTotal) * 100) : 0;
  const complete = totalSteps > 0 && doneSteps === totalSteps && alignPct >= 80;

  return (
    <li
      className={cn(
        'flex flex-wrap items-center gap-x-4 gap-y-2 rounded-xl border px-4 py-3',
        complete
          ? 'border-emerald-300 bg-emerald-50/50 dark:border-emerald-800 dark:bg-emerald-950/30'
          : 'border-slate-200 dark:border-slate-800',
      )}
    >
      {complete ? (
        <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" aria-hidden />
      ) : (
        <Circle className="h-4 w-4 shrink-0 text-slate-300 dark:text-slate-600" aria-hidden />
      )}
      <Link
        href={`/labs/${lab.slug}`}
        className="min-w-0 flex-1 text-sm font-medium text-slate-800 hover:text-indigo-600 dark:text-slate-200 dark:hover:text-indigo-400"
      >
        <span className="mr-2 text-xs text-slate-400">W{lab.week}</span>
        {lab.title}
      </Link>
      <span className="text-xs text-slate-500 dark:text-slate-400" aria-label="Exercise progress">
        {exercise ? `${doneSteps}/${totalSteps} steps` : '—'}
      </span>
      <span className="text-xs text-indigo-600 dark:text-indigo-400" aria-label="Tree alignment">
        {task ? `${alignPct}% aligned` : '—'}
      </span>
      {task && <ThoughtTreeButton labSlug={lab.slug} />}
    </li>
  );
}
