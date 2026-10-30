'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import Link from 'next/link';
import { Lock } from 'lucide-react';
import { useLabGate } from '@/lib/exercises/useLabGate';
import { emitActivity } from '@/lib/activity';
import { Button } from '@/components/ui/button';
import type { LabMeta } from '@/lib/types';

interface GatedLabTabProps {
  labSlug: string;
  previousLab: LabMeta | undefined;
  /** Which interactive tab this is — recorded in the blocked event. */
  tab: 'exercise' | 'workspace';
  children: ReactNode;
}

const reportedBlocked = new Set<string>();

/**
 * Lock gate for a lab's interactive tabs. Before hydration it renders a
 * neutral placeholder; once the gate resolves it either renders the locked
 * panel (logging `lab.locked.blocked` once per tab per session) or the
 * children. The Guide tab is never wrapped — it stays readable while locked.
 */
export function GatedLabTab({ labSlug, previousLab, tab, children }: GatedLabTabProps) {
  const { unlocked, hydrated } = useLabGate(labSlug, previousLab?.slug);
  const logged = useRef(false);

  useEffect(() => {
    const key = `${labSlug}:${tab}`;
    if (!hydrated || unlocked || logged.current || reportedBlocked.has(key)) return;
    reportedBlocked.add(key);
    logged.current = true;
    emitActivity('lab.locked.blocked', {
      labSlug,
      data: { tab, blockedBy: previousLab?.slug },
    });
  }, [hydrated, unlocked, labSlug, tab, previousLab]);

  if (!hydrated) {
    return (
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-8 text-center dark:border-slate-800 dark:bg-slate-900/60">
        <p className="text-sm text-slate-400 dark:text-slate-500">Checking your progress…</p>
      </div>
    );
  }

  if (!unlocked) {
    return (
      <div className="rounded-xl border border-amber-300/60 bg-amber-50 p-8 text-center dark:border-amber-800/60 dark:bg-amber-950/30">
        <Lock className="mx-auto h-8 w-8 text-amber-600 dark:text-amber-400" />
        <h3 className="mt-3 text-lg font-bold text-slate-900 dark:text-slate-100">
          This lab is locked
        </h3>
        <p className="mx-auto mt-1 max-w-md text-sm text-slate-600 dark:text-slate-300">
          Complete <span className="font-semibold">{previousLab?.title ?? 'the previous lab'}</span>{' '}
          first — the guide above stays readable, and your place here will be waiting.
        </p>
        {previousLab && (
          <Link href={`/labs/${previousLab.slug}`} className="mt-4 inline-block">
            <Button variant="default" size="sm">
              Go to {previousLab.title}
            </Button>
          </Link>
        )}
      </div>
    );
  }

  return <>{children}</>;
}
