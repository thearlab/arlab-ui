'use client';

import { useEffect, useRef, useState } from 'react';

export interface TabOption {
  value: string;
  label: string;
}

export interface TabsProps {
  options: TabOption[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

/** Replaces arlab-studio's two divergent tab systems with one: an
 * underline that slides to the active tab instead of just recoloring it,
 * and a horizontally-scrolling track instead of wrapping (the Detail
 * view's 8 tabs wrapped awkwardly on narrow viewports before this). Full
 * keyboard support: arrow keys move focus and selection together. */
export function Tabs({ options, value, onChange, className = '' }: TabsProps) {
  const listRef = useRef<HTMLDivElement>(null);
  const [indicator, setIndicator] = useState({ left: 0, width: 0 });

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const active = list.querySelector<HTMLElement>('[aria-selected="true"]');
    if (active) setIndicator({ left: active.offsetLeft, width: active.offsetWidth });
  }, [value, options]);

  function onKeyDown(e: React.KeyboardEvent) {
    const idx = options.findIndex((o) => o.value === value);
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      onChange(options[(idx + 1) % options.length].value);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      onChange(options[(idx - 1 + options.length) % options.length].value);
    } else if (e.key === 'Home') {
      e.preventDefault();
      onChange(options[0].value);
    } else if (e.key === 'End') {
      e.preventDefault();
      onChange(options[options.length - 1].value);
    }
  }

  return (
    <div className={['arlab-tabs', className].filter(Boolean).join(' ')} role="tablist" ref={listRef} onKeyDown={onKeyDown}>
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          role="tab"
          aria-selected={opt.value === value}
          tabIndex={opt.value === value ? 0 : -1}
          className="arlab-tab"
          onClick={() => onChange(opt.value)}
        >
          {opt.label}
        </button>
      ))}
      <span className="arlab-tabs-indicator" style={{ transform: `translateX(${indicator.left}px)`, width: indicator.width }} />
    </div>
  );
}