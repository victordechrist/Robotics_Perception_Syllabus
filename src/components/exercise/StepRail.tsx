'use client';

import type { ExerciseStep, ExerciseStepProgress } from '@/lib/exercises/types';
import { cn } from '@/lib/utils';
import { Check, Lock } from 'lucide-react';

interface StepRailProps {
  steps: ExerciseStep[];
  progress: Record<string, ExerciseStepProgress>;
  activeStepId: string;
  isUnlocked: (index: number) => boolean;
  onSelect: (stepId: string) => void;
}

/** Vertical step list: checkmarks for done, lock for gated, dot for current. */
export function StepRail({ steps, progress, activeStepId, isUnlocked, onSelect }: StepRailProps) {
  return (
    <ol className="flex flex-col gap-1" aria-label="Exercise steps">
      {steps.map((step, i) => {
        const done = progress[step.id]?.completedAt != null;
        const unlocked = isUnlocked(i);
        const active = step.id === activeStepId;
        return (
          <li key={step.id}>
            <button
              type="button"
              disabled={!unlocked}
              onClick={() => onSelect(step.id)}
              className={cn(
                'flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm transition-colors',
                active
                  ? 'bg-indigo-100 font-semibold text-indigo-900 dark:bg-indigo-500/20 dark:text-indigo-100'
                  : unlocked
                    ? 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                    : 'cursor-not-allowed text-slate-400 dark:text-slate-600',
              )}
            >
              <span
                className={cn(
                  'flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[10px] font-bold',
                  done
                    ? 'border-emerald-500 bg-emerald-500 text-white'
                    : active
                      ? 'border-indigo-500 text-indigo-600 dark:text-indigo-300'
                      : 'border-slate-300 text-slate-400 dark:border-slate-600',
                )}
              >
                {done ? <Check className="h-3 w-3" /> : unlocked ? i + 1 : <Lock className="h-3 w-3" />}
              </span>
              <span className="min-w-0 flex-1 truncate">{step.title}</span>
              {done && <span className="sr-only">(completed)</span>}
            </button>
          </li>
        );
      })}
    </ol>
  );
}
