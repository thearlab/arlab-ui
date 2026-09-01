'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';

export interface PopoverProps {
  trigger: (props: { onClick: () => void; 'aria-expanded': boolean }) => ReactNode;
  children: ReactNode;
  align?: 'start' | 'end';
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

/** A trigger + a floating panel, closing on outside click or Escape.
 * ponytail: absolute-in-relative positioning, no collision/flip detection
 * or portal — fine as long as the panel has room below it and isn't
 * inside a clipping/scrolling ancestor. Upgrade to a floating-position
 * engine if that stops being true. */
export function Popover({ trigger, children, align = 'start', open: openProp, onOpenChange }: PopoverProps) {
  const [openState, setOpenState] = useState(false);
  const open = openProp ?? openState;
  const wrapRef = useRef<HTMLDivElement>(null);

  function setOpen(next: boolean) {
    setOpenState(next);
    onOpenChange?.(next);
  }

  useEffect(() => {
    if (!open) return;
    function onDocClick(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('mousedown', onDocClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDocClick);
      document.removeEventListener('keydown', onKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  return (
    <div className="arlab-popover-wrap" ref={wrapRef}>
      {trigger({ onClick: () => setOpen(!open), 'aria-expanded': open })}
      {open ? <div className={['arlab-popover-panel', align].join(' ')}>{children}</div> : null}
    </div>
  );
}