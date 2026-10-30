'use client';

import { useCallback, useEffect, useState } from 'react';
import { getLabTask } from '@/lib/consensus';
import { useConsensusTree } from '@/lib/consensus/useConsensusTree';
import { TreeVisualizer } from '@/components/consensus/TreeVisualizer';
import { exportTreeJSON, exportTreesBundle } from '@/lib/activity/export';
import { allTasksFinished, collectAllTrees, resetAllTrees } from '@/lib/consensus/treeLifecycle';
import { Button } from '@/components/ui/button';
import { Download, GitBranch, X } from 'lucide-react';

interface ThoughtTreeButtonProps {
  labSlug: string;
  variant?: 'outline' | 'default';
}

/**
 * "Thought tree" button — opens a modal showing the lab's consensus tree as
 * it currently stands (root-only is fine; auto-committed nodes included).
 * The underlying hook subscribes to localStorage writes, so the modal shows
 * new commits live — including auto-commits landing while it is open.
 */
export function ThoughtTreeButton({ labSlug, variant = 'outline' }: ThoughtTreeButtonProps) {
  const task = getLabTask(labSlug);
  if (!task) return null;
  return <ThoughtTreeButtonInner labSlug={labSlug} variant={variant} task={task} />;
}

function ThoughtTreeButtonInner({
  labSlug,
  variant,
  task,
}: {
  labSlug: string;
  variant: 'outline' | 'default';
  task: NonNullable<ReturnType<typeof getLabTask>>;
}) {
  const [open, setOpen] = useState(false);
  const { graph, hydrated } = useConsensusTree(task);

  const close = useCallback(() => setOpen(false), []);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, close]);

  const autoCount = graph.nodes.filter((n) => n.source === 'auto').length;

  return (
    <>
      <Button variant={variant} size="sm" onClick={() => setOpen(true)}>
        <GitBranch className="mr-1.5 h-4 w-4" />
        Thought tree
      </Button>
      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Thought tree for ${task.title ?? labSlug}`}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          <button
            aria-label="Close thought tree"
            onClick={close}
            className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
          />
          <div className="relative w-full max-w-4xl max-h-[85vh] overflow-auto rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl dark:border-slate-700 dark:bg-slate-900">
            <div className="mb-3 flex items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-slate-50">
                  Thought tree
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {hydrated
                    ? `${graph.nodes.length} node${graph.nodes.length === 1 ? '' : 's'} · ${autoCount} auto-committed · updates live`
                    : 'Loading…'}
                </p>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => {
                    if (allTasksFinished()) {
                      exportTreesBundle(collectAllTrees());
                      resetAllTrees();
                    } else {
                      exportTreeJSON(labSlug, graph);
                    }
                  }}
                  aria-label="Download tree as JSON"
                  title="Download tree as JSON"
                  className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-300"
                >
                  <Download className="h-5 w-5" />
                </button>
                <button
                  onClick={close}
                  aria-label="Close"
                  className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-300"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            <TreeVisualizer graph={graph} title={`${task.title ?? labSlug} — your thought tree`} />
          </div>
        </div>
      )}
    </>
  );
}
