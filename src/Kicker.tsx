'use client';

import type { HTMLAttributes } from 'react';

/** A restrained eyebrow label — sentence case, not uppercase. Use rarely,
 * for a genuine section eyebrow; not as the default label style (that's
 * `Label`). See the comment on `.arlab-kicker` in styles.css for why. */
export function Kicker({ className = '', ...rest }: HTMLAttributes<HTMLSpanElement>) {
  return <span className={['arlab-kicker', className].filter(Boolean).join(' ')} {...rest} />;
}