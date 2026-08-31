import { useState, type KeyboardEvent } from 'react';
import { Chip } from './Chip';

export interface TagInputProps {
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
}

/** Generalizes arlab-studio's ChipsInput: Enter or comma adds a tag,
 * Backspace on an empty field removes the last one. */
export function TagInput({ value, onChange, placeholder }: TagInputProps) {
  const [draft, setDraft] = useState('');

  function commit() {
    const tag = draft.trim();
    if (tag && !value.includes(tag)) onChange([...value, tag]);
    setDraft('');
  }

  function onKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      commit();
    } else if (e.key === 'Backspace' && draft === '' && value.length > 0) {
      onChange(value.slice(0, -1));
    }
  }

  return (
    <div className="arlab-taginput">
      {value.map((tag) => (
        <Chip key={tag} onRemove={() => onChange(value.filter((t) => t !== tag))} removeLabel={`Remove ${tag}`}>
          {tag}
        </Chip>
      ))}
      <input
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={onKeyDown}
        onBlur={commit}
        placeholder={value.length === 0 ? placeholder : undefined}
      />
    </div>
  );
}
