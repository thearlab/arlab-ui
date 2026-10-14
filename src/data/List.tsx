'use client';
import { createContext, useContext, useRef, type HTMLAttributes, type KeyboardEvent, type ReactNode } from 'react';
import { useControllable, useIsoLayoutEffect } from '../hooks';
import { cx } from '../lib/cx';
import { nextIndex, typeahead } from '../lib/keys';
import type { Tone } from './Bits';

interface Ctx { selectable: boolean; value: string | null; select: (v: string) => void }
const ListCtx = createContext<Ctx>({ selectable: false, value: null, select: () => {} });

export interface ListProps extends Omit<HTMLAttributes<HTMLElement>, 'onChange' | 'defaultValue'> {
  /** Names the list for screen readers ("Every agent"). */
  label: string;
  /** A listbox: one row is chosen (the Inspector's left list). Arrows move, the choice follows focus. */
  selectable?: boolean;
  value?: string | null;
  defaultValue?: string | null;
  onChange?: (value: string) => void;
  /** Rows separated by hairlines (default) or spaced cards. */
  variant?: 'lines' | 'plain';
  children: ReactNode;
}

/** A list of rows. Plain (role=list) or selectable (role=listbox, one tab stop, arrow keys, type to find). */
export function List({ label, selectable = false, value, defaultValue = null, onChange, variant = 'lines', className, children, ...rest }: ListProps) {
  const [v, setV] = useControllable<string | null>(value, defaultValue, onChange as (v: string | null) => void);
  const ref = useRef<HTMLElement>(null);
  const typed = useRef({ s: '', t: 0 });
  const options = () => Array.from(ref.current?.querySelectorAll<HTMLElement>('[role="option"]') ?? []);
  // Roving tab stop: the chosen row, else the first.
  useIsoLayoutEffect(() => {
    if (!selectable) return;
    const opts = options(); const sel = opts.findIndex((o) => o.getAttribute('aria-selected') === 'true');
    opts.forEach((o, i) => { o.tabIndex = i === (sel < 0 ? 0 : sel) ? 0 : -1; });
  });
  const onKey = (e: KeyboardEvent) => {
    if (!selectable) return;
    const opts = options(); const cur = opts.indexOf(document.activeElement as HTMLElement);
    let i = nextIndex(cur, e.key, opts.length, { loop: false });
    if (i === null && e.key.length === 1 && !e.metaKey && !e.ctrlKey) {
      const now = Date.now(); typed.current = { s: now - typed.current.t > 700 ? e.key : typed.current.s + e.key, t: now };
      const j = typeahead(opts.map((o) => o.dataset.label || o.textContent || ''), typed.current.s, cur); i = j < 0 ? null : j;
    }
    if (i === null) return;
    e.preventDefault(); opts[i].focus(); opts[i].scrollIntoView?.({ block: 'nearest' }); setV(opts[i].dataset.value!);
  };
  const As: any = selectable ? 'div' : 'ul';
  return (
    <ListCtx.Provider value={{ selectable, value: v, select: (x) => setV(x) }}>
      <As ref={ref} role={selectable ? 'listbox' : 'list'} aria-label={label} className={cx('ar-list', variant === 'plain' && 'ar-list--plain', className)} onKeyDown={onKey} {...rest}>
        {children}
      </As>
    </ListCtx.Provider>
  );
}

export interface ListRowProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  /** Required in a selectable list: the row's id. */
  value?: string;
  title: ReactNode;
  /** A quiet second line ("241 runs", "used 3 days ago"). */
  meta?: ReactNode;
  /** Before the text: an avatar, an icon, a status dot. */
  leading?: ReactNode;
  /** After the text: one number, a pill, a mini chart. */
  trailing?: ReactNode;
  /** A dot before the title when the row needs a look; say it in words too (`toneLabel`). */
  tone?: Tone;
  toneLabel?: string;
  /** Plain lists: the row opens something. */
  onOpen?: () => void;
  href?: string;
  /** Plain text label for type-ahead when the title is not a string. */
  textLabel?: string;
}

export function ListRow({ value, title, meta, leading, trailing, tone, toneLabel, onOpen, href, textLabel, className, ...rest }: ListRowProps) {
  const ctx = useContext(ListCtx);
  const body = (
    <>
      {tone && <span className={`ar-row-dot ar-row-dot--${tone}`} aria-hidden="true" />}
      {leading && <span className="ar-row-lead">{leading}</span>}
      <span className="ar-row-text">
        {toneLabel && <span className="ar-visually-hidden">{toneLabel}: </span>}
        <span className="ar-row-title">{title}</span>
        {meta && <span className="ar-row-meta">{meta}</span>}
      </span>
      {trailing && <span className="ar-row-trail">{trailing}</span>}
    </>
  );
  if (ctx.selectable) {
    const sel = ctx.value === value;
    return (
      <div role="option" aria-selected={sel} data-value={value} data-label={textLabel ?? (typeof title === 'string' ? title : undefined)}
        className={cx('ar-row', 'ar-row--option', sel && 'ar-row--selected', className)} onClick={() => value && ctx.select(value)}
        onKeyDown={(e) => { if ((e.key === 'Enter' || e.key === ' ') && value) { e.preventDefault(); ctx.select(value); } }} {...rest}>
        {body}
      </div>
    );
  }
  return (
    <li className={cx('ar-row', (onOpen || href) && 'ar-row--interactive', className)} {...rest}>
      {href ? <a className="ar-row-hit" href={href}>{body}</a> : onOpen ? <button type="button" className="ar-row-hit" onClick={onOpen}>{body}</button> : body}
    </li>
  );
}
