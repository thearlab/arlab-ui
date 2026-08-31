import type { TextareaHTMLAttributes } from 'react';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

export function Textarea({ error = false, className = '', ...rest }: TextareaProps) {
  const cls = ['arlab-textarea', error ? 'error' : '', className].filter(Boolean).join(' ');
  return <textarea className={cls} {...rest} />;
}
