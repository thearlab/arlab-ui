'use client';

import type { ButtonHTMLAttributes } from 'react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Left out, a button is the ordinary secondary action, which in this system is a bordered pill.
   * `ghost` is the borderless one: right for a small action inside a panel heading, a "more" menu
   * or a pane toggle, wrong for anything a person has to find. Ghost used to be the default, which
   * is why "Register an app" and "Add a person" read as bare text wherever nobody said otherwise.
   */
  variant?: 'primary' | 'ghost' | 'danger';
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