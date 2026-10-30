'use client';

import { useMemo } from 'react';
import type { ExerciseStep } from '@/lib/exercises/types';
import { useExerciseProgress, countCompletedSteps } from '@/lib/exercises/progress';
import { Badge } from '@/components/ui/badge';
import { Puzzle } from 'lucide-react';

interface ExerciseProgressBadgeProps {
  labSlug: string;
  steps: ExerciseStep[];
}

/**
 * "Interactive" pill + "x/y steps" counter for lab index cards. Renders an
 * empty placeholder during SSR/first paint so progress can never cause a
 * hydration mismatch.
 */
export function ExerciseProgressBadge({ labSlug, steps }: ExerciseProgressBadgeProps) {
  const { progress, hydrated } = useExerciseProgress(labSlug, steps);
  const done = useMemo(() => countCompletedSteps(progress), [progress]);

  return (
    <span className="inline-flex items-center gap-2">
      <Badge variant="secondary" className="gap-1">
        <Puzzle className="h-3 w-3" /> Interactive
      </Badge>
      {hydrated && done > 0 && (
        <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
          {done}/{steps.length} steps
        </span>
      )}
    </span>
  );
}
