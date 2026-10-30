// Guided-exercise registry — one typed definition file per lab lands under
// `src/lib/exercises/labs/<slug>.ts` and is merged here.

import type { LabExercise } from './types';
import { week01Exercise } from './labs/week01';

export const LAB_EXERCISES: Readonly<Record<string, LabExercise>> = {
  [week01Exercise.labSlug]: week01Exercise,
};

/** The guided exercise authored for a lab, or undefined when none exists. */
export function getExercise(labSlug: string): LabExercise | undefined {
  return LAB_EXERCISES[labSlug];
}
