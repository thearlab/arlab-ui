'use client';

import type { CSSProperties, HTMLAttributes } from 'react';

/** A stable hue per person, so the same name keeps the same colour everywhere. */
export const hueOf = (name: string) => { let h = 0; for (const c of name) h = (h * 31 + c.charCodeAt(0)) % 360; return h; };

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
      style={{ width: size, height: size, fontSize: Math.max(10, size * 0.4), ...(src ? {} : { '--av-h': hueOf(name) }), ...style } as CSSProperties}
      title={name}
      {...rest}
    >
      {src ? <img src={src} alt="" referrerPolicy="no-referrer" /> : initials(name)}
    </span>
  );
}