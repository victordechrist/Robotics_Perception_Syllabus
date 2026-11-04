'use client';

import { emitActivity, readActivity } from './log';

/**
 * Passive DOM engagement tracker. Captures page-level activity no component
 * emits explicitly — raw clicks on interactive elements, route views, scroll
 * depth, time-on-page, window focus — into the same `rp:v1:activity` log.
 * These events never touch the consensus trees; they exist for research
 * export alongside the trees.
 *
 * Noise control (per spec): identical clicks on the same element within
 * 500 ms are dropped; max one dom.click per element per 300 ms; max 60 DOM
 * events/minute globally (a `dom.throttle` marker records the dropped count);
 * clicks that resolve to no interactive ancestor are ignored; DOM events stop
 * being appended once the log is >90% full.
 */

const MAX_EVENTS = 5000;
const DOM_CAP_FRACTION = 0.9;
const CLICK_DEDUP_MS = 500;
const CLICK_PER_ELEMENT_MS = 300;
const DOM_RATE_WINDOW_MS = 60_000;
const DOM_RATE_MAX = 60;
const SCROLL_THRESHOLDS = [25, 50, 75, 100];
const SCROLL_PATH_PATTERN = /^\/(labs|lectures|syllabus)/;

interface DomState {
  lastClickKey: string;
  lastClickAt: number;
  perElementClickAt: WeakMap<Element, number>;
  domEventTimes: number[];
  throttleDropped: number;
  throttleMarkerPending: boolean;
  currentPath: string | null;
  pageViewAt: number;
  scrollSeen: Set<number>;
  scrollHandler: (() => void) | null;
}

const state: DomState = {
  lastClickKey: '',
  lastClickAt: 0,
  perElementClickAt: new WeakMap(),
  domEventTimes: [],
  throttleDropped: 0,
  throttleMarkerPending: false,
  currentPath: null,
  pageViewAt: 0,
  scrollSeen: new Set(),
  scrollHandler: null,
};

function logNearlyFull(): boolean {
  return readActivity().length >= MAX_EVENTS * DOM_CAP_FRACTION;
}

/** Rate-limit + cap-guard DOM emissions. Returns false when the event is dropped. */
function gateDomEvent(type: 'dom.click' | 'scroll.depth' | 'page.dwell' | 'window.focus' | 'window.blur' | 'page.view'): boolean {
  const now = Date.now();
  state.domEventTimes = state.domEventTimes.filter((t) => now - t < DOM_RATE_WINDOW_MS);
  if (state.domEventTimes.length >= DOM_RATE_MAX) {
    state.throttleDropped += 1;
    if (!state.throttleMarkerPending) {
      state.throttleMarkerPending = true;
      queueMicrotask(() => {
        emitActivity('dom.throttle', {
          data: { dropped: state.throttleDropped, windowMs: DOM_RATE_WINDOW_MS },
        });
        state.throttleDropped = 0;
        state.throttleMarkerPending = false;
      });
    }
    return false;
  }
  if (logNearlyFull() && type !== 'page.view' && type !== 'page.dwell') return false;
  state.domEventTimes.push(now);
  return true;
}

function emitDom(type: Parameters<typeof gateDomEvent>[0], data: Record<string, unknown>): void {
  if (gateDomEvent(type)) emitActivity(type, { data });
}

const INTERACTIVE_SELECTOR = 'a, button, [role="button"], [role="tab"], [role="switch"], input, select, textarea, summary, [tabindex]';

function describeClickTarget(el: Element): { key: string; data: Record<string, unknown> } {
  const tag = el.tagName.toLowerCase();
  const id = (el as HTMLElement).id || undefined;
  const label = (
    el.getAttribute('aria-label') ??
    (el as HTMLElement).innerText ??
    (el as HTMLInputElement).value ??
    ''
  ).trim().slice(0, 80);
  const href = tag === 'a' ? (el as HTMLAnchorElement).getAttribute('href') ?? undefined : undefined;
  return {
    key: `${tag}#${id ?? ''}:${label}`,
    data: { path: state.currentPath, tag, ...(id ? { id } : {}), label, ...(href ? { href } : {}) },
  };
}

function onDocumentClick(e: MouseEvent): void {
  const target = e.target as Element | null;
  if (!target || !(target instanceof Element)) return;
  const interactive = target.closest(INTERACTIVE_SELECTOR);
  if (!interactive) return;
  const now = Date.now();
  const lastAt = state.perElementClickAt.get(interactive) ?? 0;
  if (now - lastAt < CLICK_PER_ELEMENT_MS) return;
  const { key, data } = describeClickTarget(interactive);
  if (key === state.lastClickKey && now - state.lastClickAt < CLICK_DEDUP_MS) return;
  state.perElementClickAt.set(interactive, now);
  state.lastClickKey = key;
  state.lastClickAt = now;
  emitDom('dom.click', { ...data, x: Math.round(e.clientX), y: Math.round(e.clientY) });
}

function onScroll(): void {
  if (!state.currentPath || !SCROLL_PATH_PATTERN.test(state.currentPath)) return;
  const doc = document.documentElement;
  const max = doc.scrollHeight - doc.clientHeight;
  if (max <= 0) return;
  const pct = Math.min(100, Math.round((window.scrollY / max) * 100));
  for (const t of SCROLL_THRESHOLDS) {
    if (pct >= t && !state.scrollSeen.has(t)) {
      state.scrollSeen.add(t);
      emitDom('scroll.depth', { path: state.currentPath, pct: t });
    }
  }
}

function emitDwell(): void {
  if (!state.currentPath || state.pageViewAt === 0) return;
  const ms = Date.now() - state.pageViewAt;
  if (ms < 1000) return;
  emitDom('page.dwell', { path: state.currentPath, ms: Math.round(ms / 1000) * 1000 });
}

function onVisibilityChange(): void {
  if (document.visibilityState === 'hidden') emitDwell();
}

function onFocus(): void {
  emitDom('window.focus', { path: state.currentPath });
}

function onBlur(): void {
  emitDom('window.blur', { path: state.currentPath });
}

let initialized = false;

/**
 * Attach all listeners once. Safe to call repeatedly. Call from a client
 * component mounted in the root layout.
 */
export function initDomTracker(): void {
  if (initialized || typeof window === 'undefined') return;
  initialized = true;
  document.addEventListener('click', onDocumentClick, { capture: true });
  document.addEventListener('visibilitychange', onVisibilityChange);
  window.addEventListener('focus', onFocus);
  window.addEventListener('blur', onBlur);
  state.scrollHandler = onScroll;
  window.addEventListener('scroll', onScroll, { passive: true });
}

/**
 * Notify the tracker of a route change (from usePathname). Emits page.dwell
 * for the outgoing path, then page.view for the new one and resets scroll
 * thresholds.
 */
export function notifyRouteChange(path: string): void {
  if (path === state.currentPath) return;
  emitDwell();
  state.currentPath = path;
  state.pageViewAt = Date.now();
  state.scrollSeen = new Set();
  emitDom('page.view', { path });
}
