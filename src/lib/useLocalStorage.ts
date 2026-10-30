'use client';

import { useCallback, useMemo, useRef, useSyncExternalStore } from 'react';

/**
 * SSR-safe localStorage state backed by useSyncExternalStore.
 *
 * During SSR and the hydration render `value === null` and
 * `hydrated === false`, so persisted data can never cause a hydration
 * mismatch; the real stored JSON fills in immediately after hydration.
 *
 * - Reads/writes never throw on storage failures (private mode, quota).
 * - Writes and `storage` events (other tabs) update all subscribers —
 *   same-tab updates use a custom window event since `storage` does not
 *   fire in the writing tab.
 * - `remove()` deletes the key; `value` goes back to `null` and
 *   `initialValue` applies again as the updater's prev fallback.
 */

const STORAGE_EVENT = 'iml:localstorage';

function subscribeToKey(key: string, onChange: () => void) {
  const onStorage = (event: StorageEvent) => {
    if (event.storageArea === window.localStorage && event.key === key) onChange();
  };
  const onLocal = (event: Event) => {
    if ((event as CustomEvent<string>).detail === key) onChange();
  };
  window.addEventListener('storage', onStorage);
  window.addEventListener(STORAGE_EVENT, onLocal);
  return () => {
    window.removeEventListener('storage', onStorage);
    window.removeEventListener(STORAGE_EVENT, onLocal);
  };
}

const subscribeNever = () => () => {};
const clientTrue = () => true;
const serverFalse = () => false;
const serverNull = (): string | null => null;

function readRaw(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function useLocalStorage<T>(
  key: string,
  initialValue: T,
): {
  value: T | null;
  hydrated: boolean;
  setValue: (next: T | ((prev: T | null) => T)) => void;
  remove: () => void;
} {
  const subscribe = useCallback((onChange: () => void) => subscribeToKey(key, onChange), [key]);
  const getSnapshot = useCallback(() => readRaw(key), [key]);

  const raw = useSyncExternalStore(subscribe, getSnapshot, serverNull);
  const hydrated = useSyncExternalStore(subscribeNever, clientTrue, serverFalse);

  const initialRef = useRef(initialValue);

  const value = useMemo<T | null>(() => {
    if (raw === null) return null;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  }, [raw]);

  const setValue = useCallback(
    (next: T | ((prev: T | null) => T)) => {
      try {
        const rawPrev = readRaw(key);
        const prev = rawPrev === null ? null : (JSON.parse(rawPrev) as T);
        const resolved =
          typeof next === 'function'
            ? (next as (p: T | null) => T)(prev ?? initialRef.current)
            : next;
        window.localStorage.setItem(key, JSON.stringify(resolved));
        window.dispatchEvent(new CustomEvent<string>(STORAGE_EVENT, { detail: key }));
      } catch {
        // Storage unavailable or full — silently drop persistence.
      }
    },
    [key],
  );

  const remove = useCallback(() => {
    try {
      window.localStorage.removeItem(key);
      window.dispatchEvent(new CustomEvent<string>(STORAGE_EVENT, { detail: key }));
    } catch {
      // ignore
    }
  }, [key]);

  return { value, hydrated, setValue, remove };
}
