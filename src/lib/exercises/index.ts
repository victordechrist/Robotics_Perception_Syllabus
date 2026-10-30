// Guided-exercise registry — one typed definition file per lab lands under
// `src/lib/exercises/labs/<slug>.ts` and is merged here.

import type { LabExercise } from './types';

export const LAB_EXERCISES: Readonly<Record<string, LabExercise>> = {};

/** The guided exercise authored for a lab, or undefined when none exists. */
export function getExercise(labSlug: string): LabExercise | undefined {
  return LAB_EXERCISES[labSlug];
}
