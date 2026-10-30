'use client';

import { Lock } from 'lucide-react';
import { useLabGate } from '@/lib/exercises/useLabGate';
import { Badge } from '@/components/ui/badge';

interface LabLockBadgeProps {
  labSlug: string;
  /** Slug of the gating lab (server-computed), for the unlock check. */
  previousSlug?: string;
  /** Title of the gating lab, for the "finish X to unlock" hint. */
  previousTitle?: string;
}

/**
 * "Locked" pill on lab index cards. Renders nothing until hydration, and
 * nothing at all once the lab is unlocked.
 */
export function LabLockBadge({ labSlug, previousSlug, previousTitle }: LabLockBadgeProps) {
  const { unlocked, hydrated } = useLabGate(labSlug, previousSlug);
  if (!hydrated || unlocked) return null;
  return (
    <Badge
      variant="secondary"
      className="gap-1 border-amber-500/40 text-amber-700 dark:text-amber-300"
      title={previousTitle ? `Finish ${previousTitle} to unlock` : 'Finish the previous lab to unlock'}
    >
      <Lock className="h-3 w-3" /> Locked
    </Badge>
  );
}
