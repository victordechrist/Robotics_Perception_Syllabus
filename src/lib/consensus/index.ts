// Consensus-task registry — one typed definition file per lab lands under
// `src/lib/consensus/tasks/<slug>.ts` and is merged here.
//
// A lab with no task simply has no entry: lookup returns undefined and the
// Workspace tab is not rendered.

import type { LabTask } from './types';
import { week01Task } from './tasks/week01';

export const LAB_TASKS: Readonly<Record<string, LabTask>> = {
  [week01Task.labSlug]: week01Task,
};

/** The consensus task authored for a lab, or undefined when none exists. */
export function getLabTask(labSlug: string): LabTask | undefined {
  return LAB_TASKS[labSlug];
}

/** Whether a lab has a consensus task (controls the Workspace tab). */
export function hasLabTask(labSlug: string): boolean {
  return labSlug in LAB_TASKS;
}
