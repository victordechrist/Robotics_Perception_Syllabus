'use client';

import { emitActivity, readActivity } from './log';
import type { ActivityEvent } from './types';

function timestampForFilename(): string {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}-${pad(d.getHours())}${pad(d.getMinutes())}`;
}

function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function csvCell(value: string): string {
  return `"${value.replace(/"/g, '""')}"`;
}

function toCSV(events: ActivityEvent[]): string {
  const rows = events.map((e) =>
    [
      csvCell(e.ts),
      csvCell(e.type),
      csvCell(e.labSlug ?? ''),
      csvCell(e.data ? JSON.stringify(e.data) : ''),
    ].join(','),
  );
  return ['ts,type,labSlug,detail', ...rows].join('\n');
}

export function exportActivityJSON(): void {
  const events = readActivity();
  emitActivity('activity.export', { data: { format: 'json', events: events.length } });
  const blob = new Blob([JSON.stringify(events, null, 2)], { type: 'application/json' });
  downloadBlob(blob, `rp-activity-${timestampForFilename()}.json`);
}

export function exportActivityCSV(): void {
  const events = readActivity();
  emitActivity('activity.export', { data: { format: 'csv', events: events.length } });
  const blob = new Blob([toCSV(events)], { type: 'text/csv' });
  downloadBlob(blob, `rp-activity-${timestampForFilename()}.csv`);
}

export function exportTreeJSON(labSlug: string, graph: unknown): void {
  emitActivity('activity.export', { labSlug, data: { format: 'tree-json' } });
  const blob = new Blob([JSON.stringify(graph, null, 2)], { type: 'application/json' });
  downloadBlob(blob, `rp-tree-${labSlug}-${timestampForFilename()}.json`);
}

/**
 * One JSON containing every stored student tree, keyed by lab slug.
 * Used for the final download once all tasks are finished, so nothing is
 * lost when the trees auto-reset afterwards.
 */
export function exportTreesBundle(trees: Record<string, unknown>): void {
  const labs = Object.keys(trees);
  emitActivity('activity.export', { data: { format: 'trees-bundle', labs: labs.length } });
  const payload = { exportedAt: new Date().toISOString(), labs, trees };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  downloadBlob(blob, `rp-trees-all-${timestampForFilename()}.json`);
}
