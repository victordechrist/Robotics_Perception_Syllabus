'use client';

import type { ExerciseBlock } from '@/lib/exercises/types';
import { cn } from '@/lib/utils';
import { CheckCircle2 } from 'lucide-react';
import { DRAG_MIME, type DragPayload } from './BlockPalette';

interface SequenceZoneProps {
  /** Placed blocks, in order. */
  placed: ExerciseBlock[];
  locked: boolean;
  /** Insert a block before position `index` (index === placed.length appends). */
  onInsert: (blockId: string, index: number) => void;
  /** Move a sequence item to position `index`. */
  onReorder: (from: number, to: number) => void;
  /** Return the item at `index` to the palette. */
  onRemove: (index: number) => void;
}

/**
 * The student's ordered sequence. Supports drop-to-append, drop-on-item to
 * insert, drag within to reorder, and click-to-return for keyboard users.
 */
export function SequenceZone({ placed, locked, onInsert, onReorder, onRemove }: SequenceZoneProps) {
  const handleDropAt = (e: React.DragEvent, index: number) => {
    if (locked) return;
    const raw = e.dataTransfer.getData(DRAG_MIME);
    if (!raw) return;
    e.preventDefault();
    e.stopPropagation();
    const payload = JSON.parse(raw) as DragPayload;
    if (payload.from === 'palette') {
      onInsert(payload.blockId, index);
    } else if (payload.from === 'sequence' && typeof payload.index === 'number') {
      const to = payload.index < index ? index - 1 : index;
      if (to !== payload.index) onReorder(payload.index, to);
    }
  };

  if (locked) {
    return (
      <div
        className="space-y-2 rounded-xl border border-emerald-300 bg-emerald-50/50 p-3 dark:border-emerald-800/60 dark:bg-emerald-950/20"
        aria-label="Completed sequence"
      >
        <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-emerald-600 dark:text-emerald-400">
          <CheckCircle2 className="h-3.5 w-3.5" /> Correct Sequence
        </p>
        <div className="flex flex-col gap-2">
          {placed.map((block, i) => (
            <div
              key={`${block.id}-${i}`}
              title={block.caption}
              className="w-full rounded-lg border border-emerald-200 bg-emerald-100/60 px-3 py-2 font-mono text-xs text-emerald-900 sm:text-sm dark:border-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-100"
            >
              {block.code}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'space-y-2 rounded-xl border border-dashed p-3',
        'border-indigo-300 dark:border-indigo-700 bg-indigo-50/40 dark:bg-indigo-950/20',
      )}
      onDragOver={(e) => {
        if (e.dataTransfer.types.includes(DRAG_MIME)) e.preventDefault();
      }}
      onDrop={(e) => handleDropAt(e, placed.length)}
      aria-label="Your sequence"
    >
      <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600 dark:text-indigo-400">
        Your Sequence
      </p>
      {placed.length === 0 ? (
        <p className="py-6 text-center text-xs italic text-slate-400 dark:text-slate-500">
          Drag blocks here, or click a block to append it.
        </p>
      ) : (
        <ol className="flex flex-col gap-2">
          {placed.map((block, i) => (
            <li key={`${block.id}-${i}`}>
              <button
                type="button"
                draggable
                onClick={() => onRemove(i)}
                onDragStart={(e) => {
                  e.dataTransfer.setData(
                    DRAG_MIME,
                    JSON.stringify({ blockId: block.id, from: 'sequence', index: i } satisfies DragPayload),
                  );
                  e.dataTransfer.effectAllowed = 'move';
                }}
                onDragOver={(e) => {
                  if (e.dataTransfer.types.includes(DRAG_MIME)) e.preventDefault();
                }}
                onDrop={(e) => handleDropAt(e, i)}
                onKeyDown={(e) => {
                  // ArrowUp/ArrowDown = keyboard reorder (drag is enhancement).
                  if (e.key === 'ArrowUp' && i > 0) {
                    e.preventDefault();
                    onReorder(i, i - 1);
                  } else if (e.key === 'ArrowDown' && i < placed.length - 1) {
                    e.preventDefault();
                    onReorder(i, i + 1);
                  }
                }}
                title={`${block.caption} — click to return to palette, arrows to reorder`}
                className={cn(
                  'w-full rounded-lg border px-3 py-2 text-left font-mono text-xs sm:text-sm',
                  'border-indigo-200 bg-white text-slate-800 shadow-xs',
                  'dark:border-indigo-800 dark:bg-slate-800 dark:text-slate-200',
                  'cursor-grab hover:border-indigo-400 active:cursor-grabbing dark:hover:border-indigo-500',
                )}
              >
                <span className="mr-2 inline-block select-none text-slate-400 dark:text-slate-500">
                  {i + 1}.
                </span>
                {block.code}
              </button>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
