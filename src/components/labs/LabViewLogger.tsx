'use client';

import { useEffect } from 'react';
import { emitActivity } from '@/lib/activity';

/** Emits `lab.view` once per mount — rendered inside the lab detail page. */
export function LabViewLogger({ labSlug }: { labSlug: string }) {
  useEffect(() => {
    emitActivity('lab.view', { labSlug });
  }, [labSlug]);
  return null;
}
