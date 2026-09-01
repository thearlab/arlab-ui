'use client';

import type { HTMLAttributes } from 'react';

export interface AvatarProps extends HTMLAttributes<HTMLSpanElement> {
  src?: string;
  name: string;
  size?: number;
}

function initials(name: string) {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? '';
  const last = parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? '') : '';
  return (first + last).toUpperCase() || '?';
}

export function Avatar({ src, name, size = 28, className = '', style, ...rest }: AvatarProps) {
  return (
    <span
      className={['arlab-avatar', className].filter(Boolean).join(' ')}
      style={{ width: size, height: size, fontSize: Math.max(10, size * 0.4), ...style }}
      title={name}
      {...rest}
    >
      {src ? <img src={src} alt="" referrerPolicy="no-referrer" /> : initials(name)}
    </span>
  );
}