'use client';

import type { ExerciseBlock } from '@/lib/exercises/types';
import { cn } from '@/lib/utils';

export const DRAG_MIME = 'application/x-rp-exercise-block';

export interface DragPayload {
  blockId: string;
  from: 'palette' | 'sequence';
  /** Index in the placed sequence, when dragging out of it. */
  index?: number;
}

interface BlockPaletteProps {
  blocks: ExerciseBlock[];
  locked: boolean;
  onAppend: (blockId: string) => void;
  onReturn: (index: number) => void;
}

/**
 * The shuffled pool of blocks for one step. Blocks move by HTML5 drag AND by
 * click-to-append (keyboard path — the drag is progressive enhancement).
 *
 * The palette never renders block position, correctness, or solution data.
 */
export function BlockPalette({ blocks, locked, onAppend, onReturn }: BlockPaletteProps) {
  return (
    <div
      className={cn(
        'space-y-2 rounded-xl border border-dashed p-3',
        'border-slate-300 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-900/40',
      )}
      onDragOver={(e) => {
        if (!locked && e.dataTransfer.types.includes(DRAG_MIME)) e.preventDefault();
      }}
      onDrop={(e) => {
        if (locked) return;
        const raw = e.dataTransfer.getData(DRAG_MIME);
        if (!raw) return;
        e.preventDefault();
        const payload = JSON.parse(raw) as DragPayload;
        if (payload.from === 'sequence' && typeof payload.index === 'number') {
          onReturn(payload.index);
        }
      }}
      aria-label="Block palette"
    >
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
        Available Blocks
      </p>
      {blocks.length === 0 ? (
        <p className="py-3 text-center text-xs italic text-slate-400 dark:text-slate-500">
          All blocks placed — drag back or click a placed block to change the order.
        </p>
      ) : (
        <div className="flex flex-col gap-2">
          {blocks.map((block) => (
            <button
              key={block.id}
              type="button"
              disabled={locked}
              draggable={!locked}
              onClick={() => onAppend(block.id)}
              onDragStart={(e) => {
                e.dataTransfer.setData(
                  DRAG_MIME,
                  JSON.stringify({ blockId: block.id, from: 'palette' } satisfies DragPayload),
                );
                e.dataTransfer.effectAllowed = 'move';
              }}
              title={block.caption}
              className={cn(
                'w-full rounded-lg border px-3 py-2 text-left font-mono text-xs sm:text-sm',
                'border-slate-200 bg-white text-slate-800 shadow-xs',
                'dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200',
                !locked &&
                  'cursor-grab hover:border-indigo-400 hover:shadow-sm active:cursor-grabbing dark:hover:border-indigo-500',
                locked && 'cursor-default opacity-60',
              )}
            >
              {block.code}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
