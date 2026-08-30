import type { HTMLAttributes } from 'react';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: 'default' | 'accent' | 'warn' | 'crit' | 'live';
}

export function Badge({ tone = 'default', className = '', ...rest }: BadgeProps) {
  const cls = ['arlab-badge', tone !== 'default' ? tone : '', className].filter(Boolean).join(' ');
  return <span className={cls} {...rest} />;
}
