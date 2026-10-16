'use client';

import type { ButtonHTMLAttributes } from 'react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Left out, a button is the ordinary secondary action: bordered, 5px corners. `quiet` is the
   * visible-but-calm one (Cancel, Keep it): outline on the ground colour, never bare text. `ghost` is
   * borderless, for small actions inside a panel heading or a pane toggle. `danger` is tinted red.
   */
  variant?: 'primary' | 'quiet' | 'ghost' | 'danger';
  size?: 'md' | 'sm';
}

export function Button({ variant, size = 'md', className = '', children, ...rest }: ButtonProps) {
  const cls = ['arlab-btn', variant, size === 'sm' ? 'sm' : '', className].filter(Boolean).join(' ');
  return (
    <button className={cls} {...rest}>
      <span className="arlab-btn-label">{children}</span>
    </button>
  );
}