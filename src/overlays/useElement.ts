'use client';
import { useCallback, useRef, useState } from 'react';

/** A ref that also re-renders when the element mounts. Floating panels live in a Portal that mounts a
 * render later, so positioning and focus must wait for the element itself, not for `open`. */
export function useElement<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [el, setEl] = useState<T | null>(null);
  const cb = useCallback((n: T | null) => { ref.current = n; setEl(n); }, []);
  return [cb, ref, el] as const;
}
