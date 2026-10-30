'use client';

import { useState, type ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { BookOpen, Puzzle, GitBranch } from 'lucide-react';

interface LabTabsProps {
  guide: ReactNode;
  /** Rendered Exercise tab content, or null when the lab has no exercise. */
  exercise?: ReactNode;
  /** Rendered Workspace tab content, or null when the lab has no task. */
  workspace?: ReactNode;
}

type TabId = 'guide' | 'exercise' | 'workspace';

/**
 * Guide | Exercise | Workspace switcher for lab detail pages. Tabs whose
 * content does not exist are not rendered; when only the guide exists the
 * tab bar collapses to just the guide content.
 */
export function LabTabs({ guide, exercise = null, workspace = null }: LabTabsProps) {
  const tabs: Array<{ id: TabId; label: string; icon: ReactNode; content: ReactNode }> = [
    { id: 'guide', label: 'Guide', icon: <BookOpen className="h-4 w-4" />, content: guide },
  ];
  if (exercise) {
    tabs.push({ id: 'exercise', label: 'Exercise', icon: <Puzzle className="h-4 w-4" />, content: exercise });
  }
  if (workspace) {
    tabs.push({ id: 'workspace', label: 'Workspace', icon: <GitBranch className="h-4 w-4" />, content: workspace });
  }

  const [active, setActive] = useState<TabId>('guide');

  if (tabs.length === 1) return <>{guide}</>;

  return (
    <div className="space-y-6">
      <div
        role="tablist"
        aria-label="Lab sections"
        className="inline-flex rounded-xl border border-slate-200 bg-slate-50 p-1 dark:border-slate-800 dark:bg-slate-900"
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={active === tab.id}
            onClick={() => setActive(tab.id)}
            className={cn(
              'inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors',
              active === tab.id
                ? 'bg-white text-indigo-700 shadow-xs dark:bg-slate-800 dark:text-indigo-300'
                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200',
            )}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {tabs.map((tab) => (
        <div key={tab.id} role="tabpanel" hidden={active !== tab.id}>
          {tab.content}
        </div>
      ))}
    </div>
  );
}
