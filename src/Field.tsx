'use client';

import type { InputHTMLAttributes, LabelHTMLAttributes, ReactNode } from 'react';

export function Label({ className = '', ...rest }: LabelHTMLAttributes<HTMLLabelElement>) {
  return <label className={['arlab-label', className].filter(Boolean).join(' ')} {...rest} />;
}

export function Input({ className = '', ...rest }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={['arlab-input', className].filter(Boolean).join(' ')} {...rest} />;
}

export interface FieldProps {
  label: ReactNode;
  htmlFor?: string;
  children: ReactNode;
}

export function Field({ label, htmlFor, children }: FieldProps) {
  return (
    <div className="arlab-field">
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
    </div>
  );
}