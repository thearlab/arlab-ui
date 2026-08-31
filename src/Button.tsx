import type { ButtonHTMLAttributes } from 'react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost' | 'danger';
  size?: 'md' | 'sm';
}

export function Button({ variant = 'ghost', size = 'md', className = '', children, ...rest }: ButtonProps) {
  const cls = ['arlab-btn', variant, size === 'sm' ? 'sm' : '', className].filter(Boolean).join(' ');
  return (
    <button className={cls} {...rest}>
      <span className="arlab-btn-label">{children}</span>
    </button>
  );
}
