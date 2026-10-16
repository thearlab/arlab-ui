'use client';

import { Icon } from './icons';

export interface SearchFieldProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  /** The accessible name; defaults to "Search". */
  label?: string;
  className?: string;
}

/** A search input: the search icon, the input, and a clear button once something is typed. */
export function SearchField({ value, onChange, placeholder, label = 'Search', className = '' }: SearchFieldProps) {
  return (
    <div className={['arlab-search-field', className].filter(Boolean).join(' ')}>
      <Icon name="Search" size={16} />
      <input type="search" value={value} aria-label={label} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
      {value && <button type="button" onClick={() => onChange('')} aria-label="Clear the search"><Icon name="X" size={14} /></button>}
    </div>
  );
}
