'use client';

import { useRef, type KeyboardEvent, type ReactNode } from 'react';

export interface TabOption {
  value: string;
  label: ReactNode;
  /** A 16px registry icon before the label. */
  icon?: ReactNode;
  /** A small boxed count after the label. */
  count?: number;
  disabled?: boolean;
}

export interface TabsProps {
  options: TabOption[];
  value: string;
  onChange: (value: string) => void;
  /** `tabs`: page or section tabs (tablist, arrow keys). `segments`: a filter or view switch (pressed buttons). */
  kind?: 'tabs' | 'segments';
  'aria-label'?: string;
  /** With `kind="tabs"`, each tab controls `${panelId}-${value}` when given. */
  panelId?: string;
  className?: string;
}

/** The Contour tab strip (the reference's app switcher): a ground-filled frame, the chosen item raised in white
 * with the link colour. One look for page tabs and for filter segments; it scrolls sideways when it does not fit. */
export function Tabs({ options, value, onChange, kind = 'tabs', panelId, className = '', 'aria-label': label }: TabsProps) {
  const ref = useRef<HTMLDivElement>(null);
  const tabs = kind === 'tabs';
  const keys = (e: KeyboardEvent) => {
    if (!tabs || !['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) return;
    e.preventDefault();
    const live = options.filter((o) => !o.disabled);
    const at = live.findIndex((o) => o.value === value);
    const next = e.key === 'Home' ? live[0] : e.key === 'End' ? live[live.length - 1] : live[(at + (e.key === 'ArrowRight' ? 1 : live.length - 1)) % live.length];
    if (!next) return;
    onChange(next.value);
    requestAnimationFrame(() => ref.current?.querySelector<HTMLButtonElement>(`[data-value="${CSS.escape(next.value)}"]`)?.focus());
  };
  return (
    <div ref={ref} className={['arlab-tabs', className].filter(Boolean).join(' ')} role={tabs ? 'tablist' : 'group'} aria-label={label} onKeyDown={keys}>
      {options.map((o) => {
        const on = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            data-value={o.value}
            disabled={o.disabled}
            onClick={() => onChange(o.value)}
            {...(tabs
              ? { role: 'tab', 'aria-selected': on, tabIndex: on ? 0 : -1, ...(panelId ? { 'aria-controls': `${panelId}-${o.value}` } : {}) }
              : { 'aria-pressed': on })}
          >
            {o.icon}
            <span>{o.label}</span>
            {o.count !== undefined && <span className="arlab-tabs-count">{o.count}</span>}
          </button>
        );
      })}
    </div>
  );
}
