import type { ButtonHTMLAttributes } from 'react';
import { SearchIcon } from './icons';

export interface SearchButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  placeholder?: string;
  shortcut?: string;
}

/** An input-shaped button that opens something else (a CommandPalette,
 * usually) — arlab-docs' SearchTrigger pattern. Not a real input: it never
 * takes text itself. */
export function SearchButton({ placeholder = 'Search…', shortcut = '⌘K', className = '', ...rest }: SearchButtonProps) {
  return (
    <button type="button" className={['arlab-search-btn', className].filter(Boolean).join(' ')} {...rest}>
      <SearchIcon size={16} />
      <span className="placeholder">{placeholder}</span>
      <span className="arlab-cmdk-kbd">{shortcut}</span>
    </button>
  );
}
