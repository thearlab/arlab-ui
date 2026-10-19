import { useId, useState, type InputHTMLAttributes, type ReactNode } from 'react';
import { Input } from './BaseFields.js';
import { Chip } from './Chip.js';

export interface TagInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'defaultValue' | 'onChange' | 'size'> {
  value: string[];
  onChange: (values: string[]) => void;
  /** null embeds the control inside an externally labelled FormFieldGroup. */
  label?: ReactNode;
  hint?: ReactNode;
  /** Commit comma/newline-separated pasted values when focus leaves the input. */
  commitOnBlur?: boolean;
  normalize?: (value: string) => string;
  validate?: (value: string) => string | true;
}
export function TagInput({ value, onChange, label = 'Tags', hint = 'Press Enter to add. Use each tag’s remove button to delete it.', commitOnBlur = false, normalize = value => value, validate, disabled = false, id: suppliedId, placeholder = 'Add a tag', onBlur, onKeyDown, ...props }: TagInputProps) {
  const generated = useId(), id = suppliedId || generated;
  const [draft, setDraft] = useState('');
  const [error, setError] = useState('');
  const commit = () => {
    if (disabled) return;
    const additions = draft.split(/[,\n]/).map(item => normalize(item.trim())).filter(Boolean);
    const accepted: string[] = [], rejected: string[] = [];
    let message = '';
    for (const addition of additions) {
      const result = validate?.(addition) ?? true;
      if (result !== true) {rejected.push(addition); message ||= result; continue;}
      if (![...value,...accepted].some(item => normalize(item) === addition)) accepted.push(addition);
    }
    const next = [...value, ...accepted];
    if (next.length !== value.length) onChange(next);
    setDraft(rejected.join(', '));
    setError(message);
  };
  const field = <><div className="tag-input" data-disabled={disabled || undefined} data-invalid={!!error || undefined}>
    {value.map(tag => <Chip key={tag} onRemove={disabled ? undefined : () => onChange(value.filter(item => item !== tag))}>{tag}</Chip>)}
    <Input {...props} variant="embedded" id={id} disabled={disabled} placeholder={placeholder} value={draft}
      aria-label={props['aria-label'] || (label === null ? placeholder : undefined)}
      aria-invalid={error ? true : props['aria-invalid']}
      aria-describedby={[props['aria-describedby'], label !== null && hint ? `${id}-hint` : null, error ? `${id}-error` : null].filter(Boolean).join(' ') || undefined}
      onChange={event => {setDraft(event.target.value);if(error)setError('');}}
      onBlur={event => { if (commitOnBlur) commit(); onBlur?.(event); }}
      onKeyDown={event => {
        onKeyDown?.(event);
        if (disabled || event.defaultPrevented || event.nativeEvent.isComposing) return;
        if (event.key === 'Enter' || event.key === ',') { event.preventDefault(); commit(); }
        else if (event.key === 'Backspace' && !draft && value.length) onChange(value.slice(0, -1));
      }}/>
  </div>{error && <p id={`${id}-error`} className="field-error" role="alert">{error}</p>}</>;
  return label === null ? field : <div className="lib-field"><label htmlFor={id}>{label}</label>{field}{hint && <p id={`${id}-hint`}>{hint}</p>}</div>;
}
