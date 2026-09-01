'use client';

import type { HTMLAttributes } from 'react';

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  width?: number | string;
  height?: number | string;
}

/** A shimmer placeholder. Size it to mirror the real content's layout,
 * never a single bare "Loading..." string. */
export function Skeleton({ width = '100%', height = 14, style, className = '', ...rest }: SkeletonProps) {
  return (
    <div
      className={['arlab-skeleton', className].filter(Boolean).join(' ')}
      style={{ width, height, ...style }}
      {...rest}
    />
  );
}