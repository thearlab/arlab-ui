import type { HTMLAttributes, ReactNode } from 'react';
import { CloseIcon } from './icons';

export interface ChipProps extends HTMLAttributes<HTMLSpanElement> {
  /** A dashed, quiet rendering for "no value set" rather than hiding the row. */
  empty?: boolean;
  onRemove?: () => void;
  removeLabel?: string;
  children: ReactNode;
}

export function Chip({ empty = false, onRemove, removeLabel = 'Remove', className = '', children, ...rest }: ChipProps) {
  const cls = ['arlab-chip', empty ? 'empty' : '', className].filter(Boolean).join(' ');
  return (
    <span className={cls} {...rest}>
      {children}
      {onRemove ? (
        <button type="button" className="arlab-chip-remove" onClick={onRemove} aria-label={removeLabel}>
          <CloseIcon size={10} strokeWidth={2.2} />
        </button>
      ) : null}
    </span>
  );
}
