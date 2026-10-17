import { useId, useState, type InputHTMLAttributes, type ReactNode } from 'react';
import { Input } from './BaseFields.js';
import { Chip } from './library.js';

export interface TagInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'defaultValue' | 'onChange' | 'size'> {
  value: string[];
  onChange: (values: string[]) => void;
  /** null embeds the control inside an externally labelled FormFieldGroup. */
  label?: ReactNode;
  hint?: ReactNode;
  /** Commit comma/newline-separated pasted values when focus leaves the input. */
  commitOnBlur?: boolean;
}
export function TagInput({ value, onChange, label = 'Tags', hint = 'Press Enter to add. Use each tag’s remove button to delete it.', commitOnBlur = false, disabled = false, id: suppliedId, placeholder = 'Add a tag', onBlur, onKeyDown, ...props }: TagInputProps) {
  const generated = useId(), id = suppliedId || generated;
  const [draft, setDraft] = useState('');
  const commit = () => {
    if (disabled) return;
    const additions = draft.split(/[,\n]/).map(item => item.trim()).filter(Boolean);
    const next = [...new Set([...value, ...additions])];
    if (next.length !== value.length) onChange(next);
    setDraft('');
  };
  const field = <div className="tag-input" data-disabled={disabled || undefined}>
    {value.map(tag => <Chip key={tag} onRemove={disabled ? undefined : () => onChange(value.filter(item => item !== tag))}>{tag}</Chip>)}
    <Input {...props} variant="embedded" id={id} disabled={disabled} placeholder={placeholder} value={draft}
      aria-label={props['aria-label'] || (label === null ? placeholder : undefined)}
      aria-describedby={[props['aria-describedby'], label !== null && hint ? `${id}-hint` : null].filter(Boolean).join(' ') || undefined}
      onChange={event => setDraft(event.target.value)}
      onBlur={event => { if (commitOnBlur) commit(); onBlur?.(event); }}
      onKeyDown={event => {
        onKeyDown?.(event);
        if (disabled || event.defaultPrevented || event.nativeEvent.isComposing) return;
        if (event.key === 'Enter' || event.key === ',') { event.preventDefault(); commit(); }
        else if (event.key === 'Backspace' && !draft && value.length) onChange(value.slice(0, -1));
      }}/>
  </div>;
  return label === null ? field : <div className="lib-field"><label htmlFor={id}>{label}</label>{field}{hint && <p id={`${id}-hint`}>{hint}</p>}</div>;
}
