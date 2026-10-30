// Consensus-task registry — one typed definition file per lab lands under
// `src/lib/consensus/tasks/<slug>.ts` and is merged here.
//
// A lab with no task simply has no entry: lookup returns undefined and the
// Workspace tab is not rendered.

import type { LabTask } from './types';
import { week01Task } from './tasks/week01';
import { week02Task } from './tasks/week02';
import { week03Task } from './tasks/week03';
import { week04Task } from './tasks/week04';
import { week05Task } from './tasks/week05';
import { week06Task } from './tasks/week06';
import { week07Task } from './tasks/week07';
import { week08Task } from './tasks/week08';
import { week09Task } from './tasks/week09';
import { week10Task } from './tasks/week10';
import { week11Task } from './tasks/week11';
import { week12Task } from './tasks/week12';
import { week13Task } from './tasks/week13';
import { week14Task } from './tasks/week14';
import { week15Task } from './tasks/week15';

export const LAB_TASKS: Readonly<Record<string, LabTask>> = {
  [week01Task.labSlug]: week01Task,
  [week02Task.labSlug]: week02Task,
  [week03Task.labSlug]: week03Task,
  [week04Task.labSlug]: week04Task,
  [week05Task.labSlug]: week05Task,
  [week06Task.labSlug]: week06Task,
  [week07Task.labSlug]: week07Task,
  [week08Task.labSlug]: week08Task,
  [week09Task.labSlug]: week09Task,
  [week10Task.labSlug]: week10Task,
  [week11Task.labSlug]: week11Task,
  [week12Task.labSlug]: week12Task,
  [week13Task.labSlug]: week13Task,
  [week14Task.labSlug]: week14Task,
  [week15Task.labSlug]: week15Task,
};

/** The consensus task authored for a lab, or undefined when none exists. */
export function getLabTask(labSlug: string): LabTask | undefined {
  return LAB_TASKS[labSlug];
}

/** Whether a lab has a consensus task (controls the Workspace tab). */
export function hasLabTask(labSlug: string): boolean {
  return labSlug in LAB_TASKS;
}
