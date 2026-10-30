'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import type { LabTask, NodeKind } from '@/lib/consensus/types';
import { emitActivity } from '@/lib/activity';
import { autoCommitThought } from '@/lib/consensus/autoCommit';
import { scoreTree, scenesWithCommits } from '@/lib/consensus/tree';
import { useConsensusTree } from '@/lib/consensus/useConsensusTree';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { TreeVisualizer } from './TreeVisualizer';
import { Scoreboard } from './Scoreboard';
import {
  ChevronLeft,
  ChevronRight,
  GitCommitHorizontal,
  Lightbulb,
  Lock,
  Star,
} from 'lucide-react';

interface ConsensusWorkspaceProps {
  task: LabTask;
}

const KIND_OPTIONS: Array<{ kind: NodeKind; label: string; help: string }> = [
  { kind: 'hypothesis', label: 'Hypothesis', help: 'A new idea you want to test' },
  { kind: 'operator', label: 'Action', help: 'A concrete step or code you would run' },
  { kind: 'evidence', label: 'Evidence', help: 'An observation or measured result' },
  { kind: 'subgoal', label: 'Subgoal', help: 'A smaller goal this scene breaks into' },
  { kind: 'error', label: 'Error', help: 'Something you tried that failed' },
  { kind: 'dead-end', label: 'Dead end', help: 'An approach you are abandoning' },
];

type View = 'mine' | 'gold';

/** Scenes already auto-committed this session (max 1 evidence node each). */
const sceneViewCommitted = new Set<string>();

/**
 * Per-lab consensus workspace: narrated scenes, a "Commit thought" flow that
 * grows a tree persisted at rp:v1:tree:{labSlug}, a scoreboard against the
 * gold tree, and a gold view unlocked only after one commit per scene.
 */
export function ConsensusWorkspace({ task }: ConsensusWorkspaceProps) {
  const scenes = useMemo(() => [...task.scenes].sort((a, b) => a.order - b.order), [task.scenes]);
  const { graph, hydrated, commit } = useConsensusTree(task);

  const [sceneIndex, setSceneIndex] = useState(0);
  const [draft, setDraft] = useState('');
  const [kind, setKind] = useState<NodeKind>('hypothesis');
  const [repairTargetId, setRepairTargetId] = useState('');
  const [hintsShown, setHintsShown] = useState<Record<string, number>>({});
  const [lastResult, setLastResult] = useState<{ tone: 'gold' | 'plain' | 'error'; text: string } | null>(null);
  const [view, setView] = useState<View>('mine');


  const scene = scenes[sceneIndex];
  const score = useMemo(() => scoreTree(graph, task), [graph, task]);
  const committedScenes = useMemo(() => scenesWithCommits(graph), [graph]);
  const matchedGoldIds = useMemo(() => new Set(score.matchedGoldIds), [score.matchedGoldIds]);
  const hasCommits = graph.nodes.length > 1;

  const goldUnlocked = hydrated && scenes.every((s) => committedScenes.has(s.id));
  const scenesLeftForGold = scenes.filter((s) => !committedScenes.has(s.id)).length;
  const activeView: View = goldUnlocked ? view : 'mine';

  const openErrors = graph.nodes.filter(
    (n) => (n.kind === 'error' || n.kind === 'dead-end') && n.status !== 'pruned',
  );
  const isErrorKind = kind === 'error' || kind === 'dead-end';
  const repairTarget = openErrors.some((n) => n.id === repairTargetId) ? repairTargetId : '';

  const prevGoldUnlocked = useRef<boolean | null>(null);
  useEffect(() => {
    if (!hydrated) return;
    if (prevGoldUnlocked.current === false && goldUnlocked) {
      emitActivity('tree.gold.unlock', { labSlug: task.labSlug });
    }
    prevGoldUnlocked.current = goldUnlocked;
  }, [goldUnlocked, hydrated, task.labSlug]);

  useEffect(() => {
    if (!hydrated || !scene) return;
    const key = `${task.labSlug}:${scene.id}`;
    if (sceneViewCommitted.has(key)) return;
    sceneViewCommitted.add(key);
    autoCommitThought(task.labSlug, {
      content: `Read scene ${scene.order}: "${scene.title}"`,
      kind: 'evidence',
      sceneId: scene.id,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scene?.id, hydrated, task.labSlug]);

  if (!scene) return null;

  const shownHints = hintsShown[scene.id] ?? 0;
  const hints = scene.hints ?? [];

  const onCommit = () => {
    const content = draft.trim();
    if (!content || !hydrated) return;
    const result = commit({
      content,
      kind,
      sceneId: scene.id,
      hintUsed: shownHints > 0,
      repairTargetId: !isErrorKind && repairTarget ? repairTarget : null,
    });
    emitActivity('tree.thought.commit', {
      labSlug: task.labSlug,
      data: {
        nodeId: result.node.id,
        kind,
        sceneId: scene.id,
        source: 'manual',
        matchedGold: Boolean(result.matchedGoldId),
      },
    });
    if (isErrorKind) {
      emitActivity('tree.thought.error', {
        labSlug: task.labSlug,
        data: { nodeId: result.node.id, kind, sceneId: scene.id },
      });
    }
    if (result.node.status === 'dead-end') {
      setLastResult({ tone: 'error', text: 'Error branched off the tree — your path continues from where it was.' });
    } else if (result.matchedGoldId) {
      setLastResult({ tone: 'gold', text: 'Aligned with the canonical reasoning path.' });
    } else {
      setLastResult({ tone: 'plain', text: 'Thought committed — no gold match yet. Try naming the concrete step or evidence.' });
    }
    if (repairTarget) {
      emitActivity('tree.thought.repair', {
        labSlug: task.labSlug,
        data: { nodeId: result.node.id, repairs: repairTarget, sceneId: scene.id },
      });
    }
    setDraft('');
    setRepairTargetId('');
    setKind('hypothesis');
  };

  const goScene = (index: number) => {
    setSceneIndex(index);
    setLastResult(null);
  };

  const elicitationClass =
    scene.elicitation === 'code-cell'
      ? 'font-mono text-xs leading-relaxed'
      : 'text-sm';

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">{task.title}</h2>
        <p className="text-sm text-slate-600 dark:text-slate-300">{task.brief}</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        {/* Scene narration + elicitation */}
        <section aria-label="Scene" className="space-y-4">
          <nav aria-label="Scenes" className="flex flex-wrap gap-1.5">
            {scenes.map((s, i) => (
              <button
                key={s.id}
                type="button"
                onClick={() => goScene(i)}
                aria-current={i === sceneIndex ? 'step' : undefined}
                className={cn(
                  'rounded-lg border px-2.5 py-1 text-xs font-semibold transition-colors',
                  i === sceneIndex
                    ? 'border-indigo-500 bg-indigo-500/10 text-indigo-700 dark:text-indigo-300'
                    : 'border-slate-200 text-slate-500 hover:text-slate-800 dark:border-slate-800 dark:text-slate-400 dark:hover:text-slate-200',
                )}
              >
                Scene {s.order}
                {hydrated && committedScenes.has(s.id) && <span aria-hidden> ·</span>}
              </button>
            ))}
          </nav>

          <div className="space-y-2 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Scene {scene.order}: {scene.title}
            </h3>
            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">{scene.narration}</p>
            <p className="rounded-lg bg-indigo-500/5 p-2 text-xs font-medium text-indigo-700 dark:text-indigo-300">
              Goal: {scene.goal}
            </p>
          </div>

          <div className="space-y-3">
            <label htmlFor={`thought-${scene.id}`} className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              {scene.elicitation === 'code-cell' ? 'Code cell (not executed)' : 'Your thought'}
            </label>
            <textarea
              id={`thought-${scene.id}`}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              rows={scene.elicitation === 'code-cell' ? 6 : 4}
              spellCheck={scene.elicitation !== 'code-cell'}
              placeholder={
                scene.elicitation === 'code-cell'
                  ? '# Write code or pseudocode, plus a line on why…'
                  : 'Describe your reasoning…'
              }
              className={cn(
                'w-full rounded-lg border border-slate-200 bg-white p-3 text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/30 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100',
                elicitationClass,
              )}
            />

            <fieldset className="space-y-1.5">
              <legend className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Thought type
              </legend>
              <div className="flex flex-wrap gap-1.5">
                {KIND_OPTIONS.map((opt) => (
                  <label
                    key={opt.kind}
                    title={opt.help}
                    className={cn(
                      'cursor-pointer rounded-full border px-2.5 py-1 text-xs font-medium transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-indigo-500',
                      kind === opt.kind
                        ? opt.kind === 'error' || opt.kind === 'dead-end'
                          ? 'border-red-500 bg-red-500/10 text-red-700 dark:text-red-300'
                          : 'border-indigo-500 bg-indigo-500/10 text-indigo-700 dark:text-indigo-300'
                        : 'border-slate-200 text-slate-600 dark:border-slate-700 dark:text-slate-300',
                    )}
                  >
                    <input
                      type="radio"
                      name={`kind-${task.labSlug}`}
                      value={opt.kind}
                      checked={kind === opt.kind}
                      onChange={() => setKind(opt.kind)}
                      className="sr-only"
                    />
                    {opt.label}
                  </label>
                ))}
              </div>
            </fieldset>

            {!isErrorKind && hydrated && openErrors.length > 0 && (
              <div className="space-y-1">
                <label
                  htmlFor={`repair-${task.labSlug}`}
                  className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400"
                >
                  Repairs an earlier error? (optional)
                </label>
                <select
                  id={`repair-${task.labSlug}`}
                  value={repairTarget}
                  onChange={(e) => setRepairTargetId(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-white p-2 text-xs text-slate-800 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
                >
                  <option value="">No — a new thought</option>
                  {openErrors.map((n) => (
                    <option key={n.id} value={n.id}>
                      Repairs: {n.label}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant="default"
                size="sm"
                onClick={onCommit}
                disabled={!hydrated || draft.trim().length === 0}
                className="gap-2"
              >
                <GitCommitHorizontal className="h-4 w-4" /> Commit thought
              </Button>
              {hints.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    setHintsShown((h) => ({ ...h, [scene.id]: Math.min(hints.length, shownHints + 1) }))
                  }
                  disabled={shownHints >= hints.length}
                  className="gap-1.5"
                >
                  <Lightbulb className="h-4 w-4" />
                  {shownHints === 0 ? 'Hint' : shownHints < hints.length ? 'Another hint' : 'No more hints'}
                </Button>
              )}
              <div className="ml-auto flex gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => goScene(sceneIndex - 1)}
                  disabled={sceneIndex === 0}
                  aria-label="Previous scene"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => goScene(sceneIndex + 1)}
                  disabled={sceneIndex === scenes.length - 1}
                  aria-label="Next scene"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {shownHints > 0 && (
              <ul className="space-y-1 rounded-lg border border-amber-300/60 bg-amber-50 p-3 text-xs text-amber-800 dark:border-amber-800/60 dark:bg-amber-950/30 dark:text-amber-200">
                {hints.slice(0, shownHints).map((hint, i) => (
                  <li key={i} className="flex gap-1.5">
                    <Lightbulb className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden /> {hint}
                  </li>
                ))}
              </ul>
            )}

            <p aria-live="polite" className="min-h-[1.25rem] text-xs font-medium">
              {lastResult && (
                <span
                  className={cn(
                    lastResult.tone === 'gold' && 'text-amber-600 dark:text-amber-400',
                    lastResult.tone === 'error' && 'text-red-600 dark:text-red-400',
                    lastResult.tone === 'plain' && 'text-slate-500 dark:text-slate-400',
                  )}
                >
                  {lastResult.tone === 'gold' && '★ '}
                  {lastResult.text}
                </span>
              )}
            </p>
          </div>
        </section>

        {/* Tree + scoreboard */}
        <section aria-label="Consensus tree" className="min-w-0 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <div role="tablist" aria-label="Tree view" className="inline-flex rounded-lg border border-slate-200 bg-slate-50 p-0.5 dark:border-slate-800 dark:bg-slate-900">
              <button
                type="button"
                role="tab"
                aria-selected={activeView === 'mine'}
                onClick={() => setView('mine')}
                className={cn(
                  'rounded-md px-3 py-1 text-xs font-semibold',
                  activeView === 'mine'
                    ? 'bg-white text-indigo-700 shadow-xs dark:bg-slate-800 dark:text-indigo-300'
                    : 'text-slate-500 dark:text-slate-400',
                )}
              >
                My tree
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={activeView === 'gold'}
                aria-disabled={!goldUnlocked}
                onClick={() => goldUnlocked && setView('gold')}
                title={
                  goldUnlocked
                    ? 'Compare with the canonical tree'
                    : 'Commit at least one thought in every scene to unlock'
                }
                className={cn(
                  'inline-flex items-center gap-1 rounded-md px-3 py-1 text-xs font-semibold',
                  activeView === 'gold'
                    ? 'bg-white text-amber-700 shadow-xs dark:bg-slate-800 dark:text-amber-300'
                    : 'text-slate-500 dark:text-slate-400',
                  !goldUnlocked && 'cursor-not-allowed opacity-60',
                )}
              >
                {goldUnlocked ? <Star className="h-3.5 w-3.5" /> : <Lock className="h-3.5 w-3.5" />}
                Gold tree
              </button>
            </div>
            {!goldUnlocked && (
              <span className="text-xs text-slate-400 dark:text-slate-500">
                Unlocks after a thought in every scene ({hydrated ? scenes.length - scenesLeftForGold : 0}/{scenes.length})
              </span>
            )}

          </div>

          {activeView === 'gold' ? (
            <TreeVisualizer
              graph={task.goldTree}
              title="Canonical gold tree"
              variant="gold"
              matchedGoldIds={matchedGoldIds}
            />
          ) : (
            <TreeVisualizer graph={graph} title="Your consensus tree" />
          )}

          <Legend gold={activeView === 'gold'} />

          <Scoreboard
            score={score}
            scenes={scenes}
            committedSceneIds={committedScenes}
            hydrated={hydrated}
            hasCommits={hasCommits}
          />
        </section>
      </div>
    </div>
  );
}

function Legend({ gold }: { gold: boolean }) {
  const items = gold
    ? [
        { swatch: 'border-amber-500 bg-amber-50 dark:bg-amber-950/50', label: 'You matched this' },
        { swatch: 'border-slate-300 bg-white dark:border-slate-600 dark:bg-slate-900', label: 'Not reached yet' },
      ]
    : [
        { swatch: 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/50', label: 'Confirmed (gold ★)' },
        { swatch: 'border-sky-500 bg-sky-50 dark:bg-sky-950/40', label: 'Active' },
        { swatch: 'border-red-500 bg-red-50 dark:bg-red-950/50', label: 'Error' },
        { swatch: 'border-slate-400 bg-slate-100 dark:bg-slate-800', label: 'Dead end' },
        { swatch: 'border-dashed border-slate-300 dark:border-slate-700', label: 'Pruned / repaired' },
      ];
  return (
    <ul className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-slate-500 dark:text-slate-400">
      {items.map((i) => (
        <li key={i.label} className="flex items-center gap-1.5">
          <span className={cn('inline-block h-3 w-3 rounded border', i.swatch)} aria-hidden />
          {i.label}
        </li>
      ))}
      {!gold && (
        <li className="flex items-center gap-1.5">
          <span className="inline-block h-0.5 w-4 bg-indigo-500" aria-hidden /> Active path
        </li>
      )}
    </ul>
  );
}
