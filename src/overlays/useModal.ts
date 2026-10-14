'use client';
// The shared modal behaviour of Dialog and Sheet: presence for the exit transition, scroll lock,
// focus trap with focus returned on close, Escape through the one overlay stack.
import { useRef, type RefObject } from 'react';
import { useDismiss, useFocusTrap, usePresence, useScrollLock } from '../hooks';
import { DURATIONS } from '../tokens/tokens';

export function useModal(open: boolean, onDismiss: () => void, opts: { dismissible?: boolean; initialFocus?: RefObject<HTMLElement | null> } = {}) {
  const ref = useRef<HTMLDivElement>(null);
  const { mounted, state } = usePresence(open, DURATIONS.sheet);
  useScrollLock(open);
  useFocusTrap(ref, open && mounted, opts.initialFocus);
  // The scrim's own click closes; outside-press is off so a portalled child (a menu, a nested
  // confirm) never counts as outside.
  useDismiss(open, onDismiss, [ref], { outside: false, escape: opts.dismissible !== false });
  return { ref, mounted, state };
}
