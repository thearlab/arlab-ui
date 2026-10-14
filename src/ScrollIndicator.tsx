'use client';

import type { ReactNode } from 'react';

export interface ScrollIndicatorProps {
  /** @deprecated Ignored. */
  idle?: number;
  children?: ReactNode;
}

/** @deprecated Since 1.7.0 scrollbars are native and styled in styles.css. Renders its children (if any) and nothing else;
 *  remove it and the `arlab-scroll-native-none` class from <html> when convenient. */
export function ScrollIndicator({ children }: ScrollIndicatorProps) {
  return <>{children}</>;
}
