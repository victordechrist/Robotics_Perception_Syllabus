'use client';

import { useEffect, useMemo, useState } from 'react';
import type { LabExercise } from '@/lib/exercises/types';
import { emitActivity } from '@/lib/activity';
import { autoCommitThought, autoSceneId } from '@/lib/consensus/autoCommit';
import { getLabTask } from '@/lib/consensus';
import {
  useExerciseProgress,
  writeStepProgress,
  resetStepProgress,
  EMPTY_PROGRESS,
} from '@/lib/exercises/progress';
import { shuffledById } from '@/lib/exercises/shuffle';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { BlockPalette } from './BlockPalette';
import { SequenceZone } from './SequenceZone';
import { StepRail } from './StepRail';
import { CheckCircle2, RotateCcw, ArrowDownToLine, ArrowUpFromLine } from 'lucide-react';

interface ExercisePlayerProps {
  exercise: LabExercise;
}

/** One auto-committed error node per step per session — repeated failed
 * checks must not flood the tree. */
const autoErrorCommitted = new Set<string>();

/**
 * Drag-and-drop guided exercise. Steps unlock sequentially; progress persists
 * per step in localStorage under rp:v1:exercise:{labSlug}:{stepId}.
 *
 * Checking compares the placed sequence to the step solution exactly.
 * Failure reports only HOW MANY blocks sit in the right place — never which
 * positions — and costs an attempt. Reset restores the palette for free.
 * During SSR and first paint all steps render as unplayed (hydrated=false).
 */
export function ExercisePlayer({ exercise }: ExercisePlayerProps) {
  const { steps } = exercise;
  const { progress, hydrated } = useExerciseProgress(exercise.labSlug, steps);
  const [activeStepId, setActiveStepId] = useState(steps[0]?.id ?? '');
  const [feedback, setFeedback] = useState<Record<string, string>>({});

  useEffect(() => {
    const viewed = steps.find((s) => s.id === activeStepId);
    if (!viewed) return;
    emitActivity('exercise.step.view', {
      labSlug: exercise.labSlug,
      data: { stepId: viewed.id, order: viewed.order },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeStepId, exercise.labSlug]);

  const activeIndex = Math.max(
    0,
    steps.findIndex((s) => s.id === activeStepId),
  );
  const step = steps[activeIndex];
  const stepProgress = progress[step?.id ?? ''] ?? EMPTY_PROGRESS;
  const completed = stepProgress.completedAt != null;

  const isUnlocked = (index: number) => {
    if (index === 0) return true;
    return progress[steps[index - 1].id]?.completedAt != null;
  };

  // Palette = blocks not yet placed, in the step's deterministic shuffle.
  const paletteBlocks = useMemo(() => {
    if (!step) return [];
    const placedSet = new Set(stepProgress.placed);
    return shuffledById(
      step.blocks.filter((b) => !placedSet.has(b.id)),
      step.id,
    );
  }, [step, stepProgress.placed]);

  const placedBlocks = useMemo(() => {
    if (!step) return [];
    const byId = new Map(step.blocks.map((b) => [b.id, b]));
    return stepProgress.placed
      .map((id) => byId.get(id))
      .filter((b): b is NonNullable<typeof b> => b != null);
  }, [step, stepProgress.placed]);

  if (!step) return null;

  const placed = stepProgress.placed;

  const mutate = (nextPlaced: string[]) => {
    writeStepProgress(exercise.labSlug, step.id, {
      placed: nextPlaced,
      attempts: stepProgress.attempts,
      completedAt: stepProgress.completedAt,
    });
    setFeedback((f) => ({ ...f, [step.id]: '' }));
  };

  const append = (blockId: string) => {
    emitActivity('exercise.block.place', {
      labSlug: exercise.labSlug,
      data: { stepId: step.id, blockId, index: placed.length },
    });
    mutate([...placed, blockId]);
  };
  const removeAt = (index: number) => {
    emitActivity('exercise.block.remove', {
      labSlug: exercise.labSlug,
      data: { stepId: step.id, blockId: placed[index], index },
    });
    mutate(placed.filter((_, i) => i !== index));
  };
  const insert = (blockId: string, index: number) => {
    const next = [...placed];
    next.splice(index, 0, blockId);
    emitActivity('exercise.block.place', {
      labSlug: exercise.labSlug,
      data: { stepId: step.id, blockId, index },
    });
    mutate(next);
  };
  const reorder = (from: number, to: number) => {
    const next = [...placed];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    emitActivity('exercise.block.place', {
      labSlug: exercise.labSlug,
      data: { stepId: step.id, blockId: item, from, to, reorder: true },
    });
    mutate(next);
  };

  const check = () => {
    emitActivity('exercise.check.attempt', {
      labSlug: exercise.labSlug,
      data: { stepId: step.id, placed: placed.length },
    });
    const isCorrect =
      placed.length === step.solution.length &&
      placed.every((id, i) => id === step.solution[i]);
    if (isCorrect) {
      emitActivity('exercise.check.result', {
        labSlug: exercise.labSlug,
        data: { stepId: step.id, passed: true, correctCount: step.solution.length, totalBlocks: step.solution.length },
      });
      emitActivity('exercise.step.complete', {
        labSlug: exercise.labSlug,
        data: { stepId: step.id, attempts: stepProgress.attempts },
      });
      writeStepProgress(exercise.labSlug, step.id, {
        placed,
        attempts: stepProgress.attempts,
        completedAt: new Date().toISOString(),
      });
      const task = getLabTask(exercise.labSlug);
      if (task) {
        autoCommitThought(exercise.labSlug, {
          content: `Solved step ${step.order}: "${step.title}" (${stepProgress.attempts} attempt${stepProgress.attempts === 1 ? '' : 's'})`,
          kind: 'evidence',
          sceneId: autoSceneId(task),
        });
      }
      const allDone = steps.every(
        (s) => s.id === step.id || progress[s.id]?.completedAt != null,
      );
      if (allDone) {
        emitActivity('exercise.lab.complete', { labSlug: exercise.labSlug });
        if (task) {
          autoCommitThought(exercise.labSlug, {
            content: `Completed lab exercise: ${exercise.title ?? exercise.labSlug}`,
            kind: 'subgoal',
            sceneId: autoSceneId(task),
          });
        }
      }
      const next = steps[activeIndex + 1];
      if (next) setActiveStepId(next.id);
      return;
    }
    const right = placed.filter((id, i) => id === step.solution[i]).length;
    emitActivity('exercise.check.result', {
      labSlug: exercise.labSlug,
      data: { stepId: step.id, passed: false, correctCount: right, totalBlocks: step.solution.length },
    });
    const errKey = `${exercise.labSlug}:${step.id}`;
    const task = getLabTask(exercise.labSlug);
    if (task && !autoErrorCommitted.has(errKey)) {
      autoErrorCommitted.add(errKey);
      autoCommitThought(exercise.labSlug, {
        content: `Attempt failed on step ${step.order} — ${right} of ${step.solution.length} blocks in the right place`,
        kind: 'error',
        sceneId: autoSceneId(task),
      });
    }
    writeStepProgress(exercise.labSlug, step.id, {
      placed,
      attempts: stepProgress.attempts + 1,
      completedAt: null,
    });
    setFeedback((f) => ({
      ...f,
      [step.id]: `${right} of ${step.solution.length} blocks in the right place`,
    }));
  };

  const reset = () => {
    emitActivity('exercise.reset', {
      labSlug: exercise.labSlug,
      data: { stepId: step.id },
    });
    resetStepProgress(exercise.labSlug, step.id);
    setFeedback((f) => ({ ...f, [step.id]: '' }));
  };

  const message = feedback[step.id];
  const doneCount = steps.filter((s) => progress[s.id]?.completedAt != null).length;

  return (
    <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
      {/* Step rail */}
      <aside className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          {doneCount}/{steps.length} steps complete
        </p>
        <StepRail
          steps={steps}
          progress={progress}
          activeStepId={step.id}
          isUnlocked={isUnlocked}
          onSelect={setActiveStepId}
        />
        <p className="text-xs text-slate-400 dark:text-slate-500">
          Progress saves automatically in this browser.
        </p>
      </aside>

      {/* Active step */}
      <section className="space-y-4" aria-live="polite">
        <div className="space-y-1">
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
            Step {step.order}: {step.title}
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-300">{step.instruction}</p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-900/60">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Input
            </p>
            <p className="mt-1 font-mono text-xs text-slate-700 dark:text-slate-300">
              {step.expectedInput}
            </p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-900/60">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Goal output
            </p>
            <p className="mt-1 font-mono text-xs text-slate-700 dark:text-slate-300">
              {step.expectedOutput}
            </p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <BlockPalette
            blocks={paletteBlocks}
            locked={!hydrated || completed}
            onAppend={append}
            onReturn={removeAt}
          />
          <SequenceZone
            placed={placedBlocks}
            locked={completed}
            onInsert={insert}
            onReorder={reorder}
            onRemove={removeAt}
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {completed ? (
            <p className="flex items-center gap-2 rounded-lg bg-emerald-500/10 px-3 py-2 text-sm font-semibold text-emerald-700 dark:text-emerald-300">
              <CheckCircle2 className="h-4 w-4" /> Step complete — great work.
            </p>
          ) : (
            <>
              <Button variant="default" size="sm" onClick={check} className="gap-2">
                <ArrowDownToLine className="h-4 w-4" /> Check
              </Button>
              <Button variant="outline" size="sm" onClick={reset} className="gap-2">
                <RotateCcw className="h-4 w-4" /> Reset
              </Button>
              {placed.length > 0 && (
                <span className="text-xs text-slate-400 dark:text-slate-500">
                  {placed.length}/{step.solution.length} placed
                </span>
              )}
            </>
          )}
          {message && !completed && (
            <p
              className={cn(
                'text-sm font-medium',
                message.startsWith('0')
                  ? 'text-red-600 dark:text-red-400'
                  : 'text-amber-600 dark:text-amber-400',
              )}
            >
              {message}
            </p>
          )}
          {stepProgress.attempts > 0 && !completed && (
            <span className="ml-auto text-xs text-slate-400 dark:text-slate-500">
              {stepProgress.attempts} {stepProgress.attempts === 1 ? 'attempt' : 'attempts'}
            </span>
          )}
        </div>

        {!completed && placed.length === 0 && (
          <p className="flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500">
            <ArrowUpFromLine className="h-3.5 w-3.5" />
            Tip: drag blocks into place or click them to append — click a placed block to return it.
          </p>
        )}
      </section>
    </div>
  );
}
