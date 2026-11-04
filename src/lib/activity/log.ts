'use client';

import { activityLogKey } from '@/lib/storage';
import type { ActivityEvent, ActivityType } from './types';

/** Cross-component channel: same-tab listeners see every emitted event. */
export const ACTIVITY_EVENT = 'rp:activity';

const MAX_EVENTS = 5000;

function isActivityEvent(value: unknown): value is ActivityEvent {
  if (typeof value !== 'object' || value === null) return false;
  const e = value as Record<string, unknown>;
  return typeof e.id === 'string' && typeof e.ts === 'string' && typeof e.type === 'string';
}

export function readActivity(): ActivityEvent[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(activityLogKey());
    if (raw === null) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isActivityEvent);
  } catch {
    return [];
  }
}

/** Append already-formed events in one storage write (raw-event flushes). */
export function appendActivity(events: ActivityEvent[]): void {
  if (typeof window === 'undefined' || events.length === 0) return;
  try {
    const existing = readActivity();
    const merged = existing.concat(events);
    const trimmed = merged.length > MAX_EVENTS ? merged.slice(merged.length - MAX_EVENTS) : merged;
    window.localStorage.setItem(activityLogKey(), JSON.stringify(trimmed));
    for (const event of events) {
      window.dispatchEvent(new CustomEvent<ActivityEvent>(ACTIVITY_EVENT, { detail: event }));
    }
  } catch {
    // Log must never break the page.
  }
}

export interface EmitActivityOptions {
  labSlug?: string;
  data?: Record<string, unknown>;
}

export function emitActivity(type: ActivityType, opts: EmitActivityOptions = {}): ActivityEvent | null {
  if (typeof window === 'undefined') return null;
  const event: ActivityEvent = {
    id: typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`,
    ts: new Date().toISOString(),
    type,
    ...(opts.labSlug ? { labSlug: opts.labSlug } : {}),
    ...(opts.data ? { data: opts.data } : {}),
  };
  try {
    const events = readActivity();
    events.push(event);
    const trimmed = events.length > MAX_EVENTS ? events.slice(events.length - MAX_EVENTS) : events;
    window.localStorage.setItem(activityLogKey(), JSON.stringify(trimmed));
  } catch {
    // Log must never break the exercise flow.
  }
  window.dispatchEvent(new CustomEvent<ActivityEvent>(ACTIVITY_EVENT, { detail: event }));
  return event;
}
