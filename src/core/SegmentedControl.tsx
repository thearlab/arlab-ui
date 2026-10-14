'use client';
import { useRef, type ReactNode } from 'react';
import { useControllable } from '../hooks';
import { cx } from '../lib/cx';
import { nextIndex } from '../lib/keys';

export interface SegmentOption<T extends string = string> {
  value: T;
  label: ReactNode;
  icon?: ReactNode;
  /** A count shown after the label. */
  count?: number;
  disabled?: boolean;
  /** The accessible name when the label is an icon only. */
  'aria-label'?: string;
}

export interface SegmentedControlProps<T extends string = string> {
  options: SegmentOption<T>[];
  value?: T;
  defaultValue?: T;
  onChange?: (value: T) => void;
  /** Names the group for screen readers ("Layout", "Theme"). Required. */
  label: string;
  size?: 'sm' | 'md';
  block?: boolean;
  className?: string;
}

/** 2 to 6 closely related choices that change one view or setting (HIG segmented control).
 * A radio group: arrow keys move and choose, Tab leaves. For page sections use Tabs. */
export function SegmentedControl<T extends string = string>({ options, value, defaultValue, onChange, label, size = 'md', block, className }: SegmentedControlProps<T>) {
  const [v, setV] = useControllable<T>(value, defaultValue ?? options[0]?.value, onChange);
  const refs = useRef<Array<HTMLButtonElement | null>>([]);
  const cur = Math.max(0, options.findIndex((o) => o.value === v));
  const onKey = (e: React.KeyboardEvent) => {
    const rtl = getComputedStyle(e.currentTarget).direction === 'rtl';
    const i = nextIndex(cur, e.key, options.length, { orientation: 'both', rtl, disabled: (n) => !!options[n].disabled });
    if (i === null) return;
    e.preventDefault(); setV(options[i].value); refs.current[i]?.focus();
  };
  return (
    <div role="radiogroup" aria-label={label} className={cx('ar-seg', size === 'sm' && 'ar-seg--sm', block && 'ar-seg--block', className)} onKeyDown={onKey}>
      <div className="ar-seg-in">
      {options.map((o, i) => (
        <button key={o.value} ref={(el) => { refs.current[i] = el; }} type="button" role="radio" aria-checked={i === cur}
          aria-label={o['aria-label']} tabIndex={i === cur ? 0 : -1} disabled={o.disabled} className="ar-seg-item"
          onClick={() => setV(o.value)}>
          {o.icon && <span className="ar-seg-icon" aria-hidden="true">{o.icon}</span>}
          {o.label != null && o.label !== '' && <span className="ar-seg-label">{o.label}</span>}
          {o.count !== undefined && <span className="ar-seg-count">{o.count}</span>}
        </button>
      ))}
      </div>
    </div>
  );
}
