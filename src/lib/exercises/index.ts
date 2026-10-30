// Guided-exercise registry — one typed definition file per lab lands under
// `src/lib/exercises/labs/<slug>.ts` and is merged here.

import type { LabExercise } from './types';
import { week01Exercise } from './labs/week01';
import { week02Exercise } from './labs/week02';
import { week03Exercise } from './labs/week03';
import { week04Exercise } from './labs/week04';
import { week05Exercise } from './labs/week05';
import { week06Exercise } from './labs/week06';
import { week07Exercise } from './labs/week07';
import { week08Exercise } from './labs/week08';
import { week09Exercise } from './labs/week09';
import { week10Exercise } from './labs/week10';
import { week11Exercise } from './labs/week11';
import { week12Exercise } from './labs/week12';
import { week13Exercise } from './labs/week13';
import { week14Exercise } from './labs/week14';
import { week15Exercise } from './labs/week15';

export const LAB_EXERCISES: Readonly<Record<string, LabExercise>> = {
  [week01Exercise.labSlug]: week01Exercise,
  [week02Exercise.labSlug]: week02Exercise,
  [week03Exercise.labSlug]: week03Exercise,
  [week04Exercise.labSlug]: week04Exercise,
  [week05Exercise.labSlug]: week05Exercise,
  [week06Exercise.labSlug]: week06Exercise,
  [week07Exercise.labSlug]: week07Exercise,
  [week08Exercise.labSlug]: week08Exercise,
  [week09Exercise.labSlug]: week09Exercise,
  [week10Exercise.labSlug]: week10Exercise,
  [week11Exercise.labSlug]: week11Exercise,
  [week12Exercise.labSlug]: week12Exercise,
  [week13Exercise.labSlug]: week13Exercise,
  [week14Exercise.labSlug]: week14Exercise,
  [week15Exercise.labSlug]: week15Exercise,
};

/** The guided exercise authored for a lab, or undefined when none exists. */
export function getExercise(labSlug: string): LabExercise | undefined {
  return LAB_EXERCISES[labSlug];
}
