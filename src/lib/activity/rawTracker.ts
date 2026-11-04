'use client';

import { anonymousUidKey } from '@/lib/storage';
import { appendActivity } from './log';
import type { ActivityEvent, ActivityType } from './types';

/**
 * Raw mouse/keyboard capture layer (research-grade granularity). Buffered in
 * memory and flushed to `rp:v1:activity` every FLUSH_MS and on pagehide /
 * visibilitychange→hidden — one storage write per flush.
 *
 * Coverage complements the semantic DOM tracker (domTracker.ts): clicks are
 * already captured there with labels, so raw mouse covers mousedown/mouseup/
 * dblclick/mousemove; raw.key covers keydown/keyup (key+code only — NEVER
 * typed content); raw.field records input/change with value *length* only;
 * raw.scroll is the throttled continuous signal (scroll.depth thresholds live
 * in domTracker); raw.focus tracks element-level focus/blur.
 *
 * Identity: sessionId (per-tab, sessionStorage `rp:sid`) + userId
 * (persistent anonymous UUID, localStorage `rp:v1:uid`). No PII.
 */

const FLUSH_MS = 2000;
const MOUSEMOVE_MS = 250;
const SCROLL_MS = 250;
const SESSION_KEY = 'rp:sid';

let buffer: ActivityEvent[] = [];

let lastMousemove = 0;
let lastScroll = 0;
let lastRawKey = '';
let lastRawKeyAt = 0;

function sessionId(): string {
  try {
    let sid = window.sessionStorage.getItem(SESSION_KEY);
    if (!sid) {
      sid = crypto.randomUUID();
      window.sessionStorage.setItem(SESSION_KEY, sid);
    }
    return sid;
  } catch {
    return 'no-session';
  }
}

function userId(): string {
  try {
    let uid = window.localStorage.getItem(anonymousUidKey());
    if (!uid) {
      uid = crypto.randomUUID();
      window.localStorage.setItem(anonymousUidKey(), uid);
    }
    return uid;
  } catch {
    return 'no-uid';
  }
}

function targetInfo(el: Element | null): Record<string, unknown> {
  if (!el || !(el instanceof Element)) return {};
  const t: Record<string, unknown> = { tag: el.tagName.toLowerCase() };
  const id = (el as HTMLElement).id;
  if (id) t.id = id;
  const cls = typeof el.className === 'string' ? el.className.trim().slice(0, 80) : '';
  if (cls) t.cls = cls;
  const text = ((el as HTMLElement).innerText ?? '').trim().slice(0, 80);
  if (text) t.text = text;
  const data: Record<string, string> = {};
  for (const attr of Array.from(el.attributes)) {
    if (attr.name.startsWith('data-')) data[attr.name] = attr.value.slice(0, 60);
  }
  if (Object.keys(data).length) t.data = data;
  return t;
}

function push(type: ActivityType, data: Record<string, unknown>): void {
  buffer.push({
    id: crypto.randomUUID(),
    ts: new Date().toISOString(),
    type,
    data: {
      ...data,
      path: window.location.pathname,
      sid: sessionId(),
      uid: userId(),
    },
  });
}

function flush(): void {
  if (buffer.length === 0) return;
  const events = buffer;
  buffer = [];
  appendActivity(events);
}

function onMouse(e: MouseEvent): void {
  if (e.type === 'mousemove') {
    const now = Date.now();
    if (now - lastMousemove < MOUSEMOVE_MS) return;
    lastMousemove = now;
  }
  push('raw.mouse', {
    et: e.type,
    x: Math.round(e.clientX),
    y: Math.round(e.clientY),
    button: e.button,
    target: targetInfo(e.target as Element | null),
  });
}

const EDITABLE = 'input, textarea, select, [contenteditable="true"]';

function onKey(e: KeyboardEvent): void {
  const target = e.target as Element | null;
  const editable = Boolean(target?.closest?.(EDITABLE));
  // Dedup auto-repeat keydown bursts.
  const sig = `${e.type}:${e.code}`;
  const now = Date.now();
  if (sig === lastRawKey && now - lastRawKeyAt < 50) return;
  lastRawKey = sig;
  lastRawKeyAt = now;
  push('raw.key', {
    et: e.type,
    key: e.key.length <= 20 ? e.key : 'LongKey',
    code: e.code,
    editable,
    target: { tag: target?.tagName.toLowerCase(), id: (target as HTMLElement)?.id || undefined },
  });
}

function onField(e: Event): void {
  const el = e.target as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | null;
  if (!el) return;
  push('raw.field', {
    et: e.type,
    tag: el.tagName.toLowerCase(),
    id: el.id || undefined,
    name: (el as HTMLInputElement).name || undefined,
    inputType: (el as HTMLInputElement).type || undefined,
    valueLength: typeof el.value === 'string' ? el.value.length : 0,
  });
}

function onRawScroll(): void {
  const now = Date.now();
  if (now - lastScroll < SCROLL_MS) return;
  lastScroll = now;
  push('raw.scroll', { y: Math.round(window.scrollY) });
}

function onFocusChange(e: FocusEvent): void {
  push('raw.focus', {
    et: e.type,
    target: targetInfo(e.target as Element | null),
  });
}

function onPageHide(): void {
  flush();
}

function onVisibility(): void {
  if (document.visibilityState === 'hidden') flush();
}

let initialized = false;

/** Attach raw listeners once; call from the root layout's tracker component. */
export function initRawTracker(): void {
  if (initialized || typeof window === 'undefined') return;
  initialized = true;
  for (const t of ['mousedown', 'mouseup', 'dblclick', 'mousemove'] as const) {
    document.addEventListener(t, onMouse, { capture: true, passive: true });
  }
  for (const t of ['keydown', 'keyup'] as const) {
    document.addEventListener(t, onKey, { capture: true });
  }
  for (const t of ['input', 'change'] as const) {
    document.addEventListener(t, onField, { capture: true });
  }
  document.addEventListener('focusin', onFocusChange, { capture: true });
  document.addEventListener('focusout', onFocusChange, { capture: true });
  window.addEventListener('scroll', onRawScroll, { passive: true });
  window.addEventListener('pagehide', onPageHide);
  document.addEventListener('visibilitychange', onVisibility);
  setInterval(flush, FLUSH_MS);
}
