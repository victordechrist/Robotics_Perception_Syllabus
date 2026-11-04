'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { initDomTracker, notifyRouteChange } from '@/lib/activity/domTracker';
import { initRawTracker } from '@/lib/activity/rawTracker';

/**
 * Mounts the passive DOM activity tracker once and forwards route changes.
 * Rendered in the root layout; produces no UI.
 */
export function ActivityTracker() {
  const pathname = usePathname();

  useEffect(() => {
    initDomTracker();
    initRawTracker();
  }, []);

  useEffect(() => {
    notifyRouteChange(pathname);
  }, [pathname]);

  return null;
}
