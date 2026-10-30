// Drag-and-drop guided exercise data model.
//
// One exercise definition file per lab under src/lib/exercises/labs/<slug>.ts,
// merged into the LAB_EXERCISES registry (index.ts) keyed by lab slug.
//
// Persistence contract (client-side, localStorage):
//   key   = `rp:v1:exercise:{labSlug}:{stepId}`
//   value = ExerciseStepProgress
//
// Security note: this site is fully static and answer keys ship in the bundle.
// Keep `solution`/`isDistractor` out of the rendered DOM and out of ids, and
// never pretend checking is server-verified.

/** One draggable/clickable block shown in a step's palette. */
export interface ExerciseBlock {
  /** Stable opaque id ('b1', 'b2'…). No semantic hints about correctness. */
  id: string;
  /** The block's content (code line, formula, concept). */
  code: string;
  /** Short human label shown on the block. */
  caption: string;
  /** Plausible-but-wrong decoy; never part of the solution. 1–2 per step max. */
  isDistractor?: boolean;
}

/** One ordered step of a guided exercise. */
export interface ExerciseStep {
  /** Stable id, e.g. 'lab01-s1'. Used in the persistence key. */
  id: string;
  /** 1-based ordering within the exercise. */
  order: number;
  title: string;
  /** What to build and why. */
  instruction: string;
  /** Shown as "input" context. */
  expectedInput: string;
  /** Shown as "goal output". */
  expectedOutput: string;
  /** Ordered block ids forming the correct sequence. Never render into the DOM. */
  solution: string[];
  blocks: ExerciseBlock[];
}

/** A complete guided exercise for one lab. */
export interface LabExercise {
  labSlug: string;
  title: string;
  intro: string;
  steps: ExerciseStep[];
}

/** Per-step progress record stored under `rp:v1:exercise:{labSlug}:{stepId}`. */
export interface ExerciseStepProgress {
  /** Block ids the student has placed, in order. */
  placed: string[];
  /** Number of failed checks (resets do not increment). */
  attempts: number;
  /** ISO timestamp when the step was completed; stays set forever after. */
  completedAt: string | null;
}
