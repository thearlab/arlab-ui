'use client';
// Internal: the floating list every dropdown in this folder uses (Select, Combobox, MultiSelect,
// TagInput suggestions, TimePicker). It positions itself by room (up or down), never leaves the
// window, keeps the active option in view and closes on an outside press.
import { forwardRef, useEffect, useRef, type CSSProperties, type ReactNode, type RefObject } from 'react';
import { useAnchored, useDismiss } from '../hooks';
import { createPortal } from 'react-dom';
import { CheckIcon } from '../core/icons';
import { cx } from '../lib/cx';

export interface ListOption<V extends string = string> {
  value: V;
  label: string;
  /** How many items this choice holds, shown on the right ("Never used 6"). */
  count?: number;
  /** A second, quieter line. */
  description?: string;
  icon?: ReactNode;
  disabled?: boolean;
}

export interface PopupProps {
  open: boolean;
  anchor: RefObject<HTMLElement | null>;
  onDismiss: () => void;
  children: ReactNode;
  /** Match the anchor's width at least (default true). */
  matchWidth?: boolean;
  className?: string;
  /** Extra elements that count as inside (the trigger is always inside). */
  inside?: Array<RefObject<HTMLElement | null>>;
}

export const Popup = forwardRef<HTMLDivElement, PopupProps>(function Popup({ open, anchor, onDismiss, children, matchWidth = true, className, inside = [] }, ref) {
  const box = useRef<HTMLDivElement | null>(null);
  const pos = useAnchored(anchor, box, open, 'bottom-start', 6);
  useDismiss(open, onDismiss, [anchor, box, ...inside]);
  if (!open) return null;
  const w = anchor.current?.getBoundingClientRect().width;
  const style: CSSProperties = {
    top: pos?.top ?? -9999, left: pos?.left ?? -9999,
    minWidth: matchWidth && w ? Math.min(w, pos?.maxWidth ?? w) : undefined,
    maxWidth: pos?.maxWidth, maxHeight: pos ? Math.min(pos.maxHeight, 360) : 360,
    opacity: pos ? undefined : 0, // not visibility: a hidden box cannot take focus
  };
  // createPortal directly (not Portal): the box must exist in the same commit so it can be measured.
  return createPortal(
      <div ref={(el) => { box.current = el; if (typeof ref === 'function') ref(el); else if (ref) ref.current = el; }} className={cx('ar-popup', className)} data-side={pos?.side} style={style}>
        {children}
      </div>,
    document.body,
  );
});

/** Keep the active option visible inside its scrolling list. */
export function useScrollActive(listRef: RefObject<HTMLElement | null>, activeId: string | undefined) {
  useEffect(() => {
    if (!activeId) return;
    const el = listRef.current?.querySelector<HTMLElement>(`[id="${CSS.escape(activeId)}"]`);
    el?.scrollIntoView({ block: 'nearest' });
  }, [activeId, listRef]);
}

export interface OptionRowProps {
  id: string;
  option: ListOption;
  selected: boolean;
  active: boolean;
  /** Checkbox look (multi select) instead of the checkmark column. */
  multi?: boolean;
  onPick: () => void;
  onHover: () => void;
}
export function OptionRow({ id, option: o, selected, active, multi, onPick, onHover }: OptionRowProps) {
  return (
    <li
      id={id}
      role="option"
      aria-selected={selected}
      aria-disabled={o.disabled || undefined}
      className={cx('ar-option', active && 'is-active', selected && 'is-selected', o.disabled && 'is-disabled')}
      onPointerMove={() => { if (!o.disabled && !active) onHover(); }}
      onMouseDown={(e) => e.preventDefault() /* keep focus where it is */}
      onClick={() => { if (!o.disabled) onPick(); }}
    >
      <span className={cx('ar-option-check', multi && 'is-box')} aria-hidden="true">{selected && <CheckIcon size={multi ? 12 : 16} />}</span>
      {o.icon && <span className="ar-option-icon" aria-hidden="true">{o.icon}</span>}
      <span className="ar-option-text">
        <span className="ar-option-label">{o.label}</span>
        {o.description && <span className="ar-option-desc">{o.description}</span>}
      </span>
      {o.count !== undefined && <span className="ar-option-count">{o.count.toLocaleString('en-US')}</span>}
    </li>
  );
}

/** Next enabled index from i in direction d (no wrap: stops at the ends, like a native list). */
export function stepEnabled(options: ListOption[], i: number, d: 1 | -1): number {
  for (let j = i + d; j >= 0 && j < options.length; j += d) if (!options[j].disabled) return j;
  return i;
}
export const firstEnabled = (options: ListOption[]) => options.findIndex((o) => !o.disabled);
export const lastEnabled = (options: ListOption[]) => { for (let j = options.length - 1; j >= 0; j--) if (!options[j].disabled) return j; return -1; };
