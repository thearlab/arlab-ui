import type { InputHTMLAttributes, ReactNode } from 'react';
import { CheckIcon } from './icons';

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: ReactNode;
}

export function Checkbox({ label, className = '', id, ...rest }: CheckboxProps) {
  return (
    <label className={['arlab-checkbox', className].filter(Boolean).join(' ')} htmlFor={id}>
      <input type="checkbox" id={id} {...rest} />
      <span className="arlab-checkbox-box">
        <CheckIcon size={13} strokeWidth={2.5} />
      </span>
      {label}
    </label>
  );
}
