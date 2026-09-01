'use client';

import type { InputHTMLAttributes, ReactNode } from 'react';

export interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: ReactNode;
}

export function Radio({ label, className = '', id, ...rest }: RadioProps) {
  return (
    <label className={['arlab-radio', className].filter(Boolean).join(' ')} htmlFor={id}>
      <input type="radio" id={id} {...rest} />
      <span className="arlab-radio-dot" />
      {label}
    </label>
  );
}