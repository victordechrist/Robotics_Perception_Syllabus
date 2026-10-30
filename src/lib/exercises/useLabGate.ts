'use client';

import { useCallback, useSyncExternalStore } from 'react';
import { RP_STORAGE_PREFIX } from '@/lib/storage';
import { getExercise } from './index';
import { readStepProgress, STORAGE_EVENT } from './progress';

const EXERCISE_KEY_PREFIX = `${RP_STORAGE_PREFIX}:exercise:`;

export function isLabExerciseComplete(labSlug: string): boolean {
  const exercise = getExercise(labSlug);
  if (!exercise) return true; // no exercise → nothing to gate on
  return exercise.steps.every(
    (step) => readStepProgress(labSlug, step.id).completedAt != null,
  );
}

/**
 * Lab unlock rule: unlocked when the previous visible lab's exercise is
 * complete. `previousLabSlug` is computed server-side (`previousVisibleLab`)
 * because the lab registry reads MDX from disk — it cannot be imported here.
 */
export function isLabUnlocked(previousLabSlug: string | undefined): boolean {
  if (!previousLabSlug) return true;
  return isLabExerciseComplete(previousLabSlug);
}

/**
 * Reactive unlock state for one lab. `hydrated` is false during SSR and the
 * first client render — callers must show a neutral placeholder then, never
 * a flash of either state.
 */
export function useLabGate(labSlug: string, previousLabSlug: string | undefined): {
  unlocked: boolean;
  hydrated: boolean;
} {
  const subscribe = useCallback((onChange: () => void) => {
    const onStorage = (event: StorageEvent) => {
      if (event.storageArea === window.localStorage && event.key?.startsWith(EXERCISE_KEY_PREFIX)) {
        onChange();
      }
    };
    const onLocal = (event: Event) => {
      const key = (event as CustomEvent<string>).detail;
      if (typeof key === 'string' && key.startsWith(EXERCISE_KEY_PREFIX)) onChange();
    };
    window.addEventListener('storage', onStorage);
    window.addEventListener(STORAGE_EVENT, onLocal);
    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener(STORAGE_EVENT, onLocal);
    };
  }, []);

  const getSnapshot = useCallback(
    () => String(isLabUnlocked(previousLabSlug)),
    [previousLabSlug],
  );
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, () => 'pending');

  return {
    unlocked: snapshot === 'true',
    hydrated: snapshot !== 'pending',
  };
}
