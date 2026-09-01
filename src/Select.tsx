'use client';

import type { SelectHTMLAttributes } from 'react';
import { ChevronDownIcon } from './icons';

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean;
}

export function Select({ error = false, className = '', children, ...rest }: SelectProps) {
  const cls = ['arlab-select', error ? 'error' : '', className].filter(Boolean).join(' ');
  return (
    <div className="arlab-select-wrap">
      <select className={cls} {...rest}>
        {children}
      </select>
      <ChevronDownIcon size={14} className="arlab-select-chevron" />
    </div>
  );
}