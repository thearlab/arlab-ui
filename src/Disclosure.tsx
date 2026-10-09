'use client';

import { useId, useState, type ReactNode } from 'react';
import { ChevronDownIcon } from './icons';

export interface DisclosureProps {
  /** The section's name, always visible. */
  title: ReactNode;
  /** Quiet text or a pill on the right of the title row: a count, "2 custom", a status. */
  meta?: ReactNode;
  children: ReactNode;
  /** Uncontrolled: open on first render. */
  defaultOpen?: boolean;
  /** Controlled: the caller decides (pair with onOpenChange). */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
}

/** A titled section that opens and closes: a bordered panel, the title row as one button, a small round chevron on
 *  the right that turns, and the body sliding open (grid-rows, no height measuring). Replaces raw <details>/<summary>
 *  and its browser triangle. Stack several and they read as one list. */
export function Disclosure({ title, meta, children, defaultOpen = false, open, onOpenChange, className }: DisclosureProps) {
  const [own, setOwn] = useState(defaultOpen);
  const isOpen = open ?? own;
  const id = useId();
  const toggle = () => { const next = !isOpen; if (open === undefined) setOwn(next); onOpenChange?.(next); };
  return (
    <section className={['arlab-disclosure', isOpen ? 'open' : '', className].filter(Boolean).join(' ')}>
      {/* A role="button" div, not a <button>: a section often sits inside a read-only <fieldset disabled> (a settings
          page someone may only look at), which would disable a real button and lock the section shut. */}
      <div role="button" tabIndex={0} className="arlab-disclosure-head" aria-expanded={isOpen} aria-controls={id} onClick={toggle}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); } }}>
        <span className="arlab-disclosure-title">{title}</span>
        {meta != null && <span className="arlab-disclosure-meta">{meta}</span>}
        <span className="arlab-disclosure-chev" aria-hidden="true"><ChevronDownIcon size={14} /></span>
      </div>
      <div id={id} className="arlab-disclosure-body" role="region" aria-hidden={!isOpen}>
        <div><div className="arlab-disclosure-inner">{children}</div></div>
      </div>
    </section>
  );
}
