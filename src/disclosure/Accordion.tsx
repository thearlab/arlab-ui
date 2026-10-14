'use client';
import { useId, useRef, type KeyboardEvent, type ReactNode } from 'react';
import { useControllable } from '../hooks';
import { cx } from '../lib/cx';
import { nextIndex } from '../lib/keys';
import { ChevronDownIcon } from '../core/icons';

export interface AccordionItem { id: string; title: ReactNode; content: ReactNode; meta?: ReactNode; disabled?: boolean }

export interface AccordionProps {
  items: AccordionItem[];
  /** single: one open at a time (opening one closes the others). multiple: any number. */
  type?: 'single' | 'multiple';
  value?: string[];
  defaultValue?: string[];
  onChange?: (open: string[]) => void;
  /** The heading level of each title (default 3). */
  headingLevel?: 2 | 3 | 4 | 5;
  className?: string;
}

/** Stacked sections that open and close (APG accordion): each title is a button in a heading;
 * Up and Down move between titles, Home and End jump. */
export function Accordion({ items, type = 'multiple', value, defaultValue = [], onChange, headingLevel = 3, className }: AccordionProps) {
  const [open, setOpen] = useControllable(value, defaultValue, onChange);
  const id = useId();
  const refs = useRef<Array<HTMLButtonElement | null>>([]);
  const H = `h${headingLevel}` as 'h3';
  const toggle = (k: string) => setOpen(open.includes(k) ? open.filter((x) => x !== k) : type === 'single' ? [k] : [...open, k]);
  const onKey = (e: KeyboardEvent, i: number) => {
    const n = nextIndex(i, e.key, items.length, { disabled: (x) => !!items[x].disabled });
    if (n !== null) { e.preventDefault(); refs.current[n]?.focus(); }
  };
  return (
    <div className={cx('ar-accordion', className)}>
      {items.map((it, i) => {
        const on = open.includes(it.id);
        return (
          <div key={it.id} className="ar-acc-item" data-state={on ? 'open' : 'closed'}>
            <H className="ar-acc-heading">
              <button ref={(el) => { refs.current[i] = el; }} type="button" id={`${id}-${it.id}-b`} aria-expanded={on} aria-controls={`${id}-${it.id}-p`}
                disabled={it.disabled} className="ar-acc-trigger" onClick={() => toggle(it.id)} onKeyDown={(e) => onKey(e, i)}>
                <span className="ar-acc-title">{it.title}</span>
                {it.meta && <span className="ar-acc-meta">{it.meta}</span>}
                <span className="ar-chevron" aria-hidden="true"><ChevronDownIcon size={16} /></span>
              </button>
            </H>
            <div id={`${id}-${it.id}-p`} role="region" aria-labelledby={`${id}-${it.id}-b`} className="ar-acc-panel" data-state={on ? 'open' : 'closed'}>
              <div className="ar-acc-clip"><div className="ar-acc-body">{it.content}</div></div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export interface DisclosureProps {
  title: ReactNode;
  /** Facts beside the title (a count, a pill). */
  meta?: ReactNode;
  /** Buttons at the right of the title row (they do not toggle it). */
  actions?: ReactNode;
  children?: ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** panel: a bordered card section (default). plain: just the title row and the content (Collapsible). */
  variant?: 'panel' | 'plain';
  className?: string;
}

/** One titled section that shows and hides its details. The title row is a role=button element
 * (not a <button>) so a read-only <fieldset disabled> around a form cannot lock it. */
export function Disclosure({ title, meta, actions, children, open, defaultOpen = false, onOpenChange, variant = 'panel', className }: DisclosureProps) {
  const [on, setOn] = useControllable(open, defaultOpen, onOpenChange);
  const id = useId();
  return (
    <section className={cx('ar-disclosure', `ar-disclosure--${variant}`, className)} data-state={on ? 'open' : 'closed'}>
      <div className="ar-disclosure-row">
        <div role="button" tabIndex={0} aria-expanded={on} aria-controls={id} className="ar-disclosure-trigger"
          onClick={() => setOn(!on)} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setOn(!on); } }}>
          <span className="ar-chevron" aria-hidden="true"><ChevronDownIcon size={16} /></span>
          <span className="ar-disclosure-title">{title}</span>
          {meta && <span className="ar-disclosure-meta">{meta}</span>}
        </div>
        {actions && <div className="ar-disclosure-actions">{actions}</div>}
      </div>
      <div id={id} className="ar-acc-panel" data-state={on ? 'open' : 'closed'}>
        <div className="ar-acc-clip"><div className="ar-disclosure-body">{children}</div></div>
      </div>
    </section>
  );
}
