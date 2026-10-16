import type { InputHTMLAttributes, TextareaHTMLAttributes, Ref } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  /** Composite fields own the outside border; the same native input handles their value. */
  variant?: 'default' | 'embedded';
  inputRef?: Ref<HTMLInputElement>;
}
/** The single text/number input primitive. Callback and native validity behavior remain native. */
export function Input({ variant = 'default', inputRef, className = '', ...props }: InputProps) {
  return <input {...props} ref={inputRef} className={`lib-input ct-input ${variant === 'embedded' ? 'ct-input-embedded' : ''} ${className}`} />;
}
export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  variant?: 'default' | 'code';
  size?: 'default' | 'short';
  textareaRef?: Ref<HTMLTextAreaElement>;
}
export function Textarea({ variant = 'default', size = 'default', textareaRef, className = '', ...props }: TextareaProps) {
  return <textarea rows={3} {...props} ref={textareaRef} className={`lib-input ct-textarea ${variant === 'code' ? 'ct-textarea-code' : ''} ${size === 'short' ? 'ct-textarea-short' : ''} ${className}`} />;
}
