import { useState, useEffect, useRef } from 'react';

/**
 * Drop-in replacement for useState that persists to localStorage.
 * - Reads the saved value on mount (if present).
 * - Writes on every subsequent state change (skips first render to avoid
 *   overwriting a just-loaded value with the default).
 * - Silently ignores quota errors (large base64 image payloads may exceed
 *   the ~5 MB limit; in that case the last successful save is kept).
 */
export function usePersistentState<T>(key: string, defaultValue: T) {
  const [state, setState] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw !== null) return JSON.parse(raw) as T;
    } catch {
      // corrupt data or unavailable — fall through to default
    }
    return defaultValue;
  });

  const isFirstRender = useRef(true);

  useEffect(() => {
    // Skip writing on the very first render; the value was just loaded from storage.
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    try {
      const serialised = JSON.stringify(state);
      localStorage.setItem(key, serialised);
    } catch (err) {
      // QuotaExceededError — payload too large (e.g. many base64 images).
      // Fail silently; the in-memory state is still correct.
      console.warn(`[usePersistentState] Could not save "${key}" to localStorage:`, err);
    }
  }, [key, state]);

  return [state, setState] as const;
}
