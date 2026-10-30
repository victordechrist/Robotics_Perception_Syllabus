import { labs } from '@/data/labs';
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
  const i = visible.findIndex((l) => l.slug === labSlug);
  return i > 0 ? visible[i - 1] : undefined;
}
