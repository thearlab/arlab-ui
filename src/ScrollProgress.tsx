import type { RefObject } from 'react';

export interface ScrollProgressProps {
  /** @deprecated Ignored. */
  target?: RefObject<HTMLElement | null>;
}

/** @deprecated Since 1.7.0 scrollbars are native and styled in styles.css. Renders nothing; safe to remove. */
export function ScrollProgress(_props: ScrollProgressProps) {
  return null;
}
