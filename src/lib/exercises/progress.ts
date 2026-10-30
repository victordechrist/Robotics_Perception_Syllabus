'use client';

import { useCallback, useMemo, useSyncExternalStore } from 'react';
import { exerciseProgressKey } from '@/lib/storage';
import type { ExerciseStep, ExerciseStepProgress } from './types';

export const EMPTY_PROGRESS: ExerciseStepProgress = {
  placed: [],
  attempts: 0,
  completedAt: null,
};

export const STORAGE_EVENT = 'rp:localstorage';

function readRaw(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function readStepProgress(labSlug: string, stepId: string): ExerciseStepProgress {
  if (typeof window === 'undefined') return EMPTY_PROGRESS;
  const raw = readRaw(exerciseProgressKey(labSlug, stepId));
  if (raw === null) return EMPTY_PROGRESS;
  try {
    const parsed = JSON.parse(raw) as Partial<ExerciseStepProgress>;
    return {
      placed: Array.isArray(parsed.placed) ? parsed.placed : [],
      attempts: typeof parsed.attempts === 'number' ? parsed.attempts : 0,
      completedAt: typeof parsed.completedAt === 'string' ? parsed.completedAt : null,
    };
  } catch {
    return EMPTY_PROGRESS;
  }
}

function notify(key: string) {
  window.dispatchEvent(new CustomEvent<string>(STORAGE_EVENT, { detail: key }));
}

export function writeStepProgress(
  labSlug: string,
  stepId: string,
  progress: ExerciseStepProgress,
): void {
  const key = exerciseProgressKey(labSlug, stepId);
  try {
    window.localStorage.setItem(key, JSON.stringify(progress));
  } catch {
    // Storage unavailable — progress is lost but play continues in-memory.
  }
  notify(key);
}

export function resetStepProgress(labSlug: string, stepId: string): void {
  // Reset clears the placed sequence but keeps completedAt — a completed
  // step never un-completes.
  const current = readStepProgress(labSlug, stepId);
  writeStepProgress(labSlug, stepId, {
    placed: [],
    attempts: current.attempts,
    completedAt: current.completedAt,
  });
}

/**
 * Client-side progress map for every step of an exercise.
 *
 * Subscribe to `storage` events plus the same-tab custom event emitted by
 * `writeStepProgress`; the snapshot is the serialized raw values of all
 * step keys, so React only re-renders when one actually changes.
 *
 * `hydrated` is false during SSR and the hydration render — progress UI
 * must render its empty state then fill in, never the other way.
 */
export function useExerciseProgress(
  labSlug: string,
  steps: ExerciseStep[],
): { progress: Record<string, ExerciseStepProgress>; hydrated: boolean } {
  const stepIds = useMemo(() => steps.map((s) => s.id), [steps]);
  const prefix = `${`rp:v1`}:exercise:${labSlug}:`;

  const subscribe = useCallback(
    (onChange: () => void) => {
      const onStorage = (event: StorageEvent) => {
        if (event.storageArea === window.localStorage && event.key?.startsWith(prefix)) {
          onChange();
        }
      };
      const onLocal = (event: Event) => {
        const key = (event as CustomEvent<string>).detail;
        if (typeof key === 'string' && key.startsWith(prefix)) onChange();
      };
      window.addEventListener('storage', onStorage);
      window.addEventListener(STORAGE_EVENT, onLocal);
      return () => {
        window.removeEventListener('storage', onStorage);
        window.removeEventListener(STORAGE_EVENT, onLocal);
      };
    },
    [prefix],
  );

  const getSnapshot = useCallback(
    () =>
      JSON.stringify(
        stepIds.map((id) => {
          try {
            return window.localStorage.getItem(exerciseProgressKey(labSlug, id));
          } catch {
            return null;
          }
        }),
      ),
    [labSlug, stepIds],
  );
  const getServerSnapshot = useCallback(
    () => JSON.stringify(stepIds.map(() => null)),
    [stepIds],
  );

  const raw = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const hydrated = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  const progress = useMemo(() => {
    const raws = JSON.parse(raw) as (string | null)[];
    const map: Record<string, ExerciseStepProgress> = {};
    stepIds.forEach((id, i) => {
      const item = raws[i];
      if (item === null) {
        map[id] = EMPTY_PROGRESS;
        return;
      }
      try {
        const parsed = JSON.parse(item) as Partial<ExerciseStepProgress>;
        map[id] = {
          placed: Array.isArray(parsed.placed) ? parsed.placed : [],
          attempts: typeof parsed.attempts === 'number' ? parsed.attempts : 0,
          completedAt: typeof parsed.completedAt === 'string' ? parsed.completedAt : null,
        };
      } catch {
        map[id] = EMPTY_PROGRESS;
      }
    });
    return map;
  }, [raw, stepIds]);

  return { progress, hydrated };
}

/** How many steps of the exercise are complete — for index badges. */
export function countCompletedSteps(progress: Record<string, ExerciseStepProgress>): number {
  return Object.values(progress).filter((p) => p.completedAt !== null).length;
}
