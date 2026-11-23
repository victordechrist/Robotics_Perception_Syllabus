import { labs } from '@/data/labs';
import { getExercise } from '@/lib/exercises';
import type { LabMeta } from '@/lib/types';

/**
 * Lab i in week order is unlocked when lab i−1's exercise is complete.
 * The first lab is always unlocked.
 */
export function visibleLabs(): LabMeta[] {
  return [...labs].sort((a, b) => a.week - b.week);
}

export function previousVisibleLab(labSlug: string): LabMeta | undefined {
  const visible = visibleLabs();
  const index = visible.findIndex((l) => l.slug === labSlug);
  // Skip labs without exercises (e.g. checkpoint tests) so the sequential
  // gating chain still points at the previous real exercise.
  for (let i = index - 1; i >= 0; i--) {
    if (getExercise(visible[i].slug)) return visible[i];
  }
  return undefined;
}
