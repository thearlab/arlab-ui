'use client';
import type { FormHTMLAttributes, HTMLAttributes, ReactNode } from 'react';
import { cx } from '../lib/cx';
import { Button } from '../core/Button';
import { AlertTriangleIcon, CheckCircleIcon } from '../core/icons';
import { plural } from '../lib/format';

export interface FormSectionProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  title: ReactNode;
  /** One or two sentences: what this group is for. */
  description?: ReactNode;
  /** Title and description beside the fields (settings pages) instead of above them. */
  aside?: boolean;
  children: ReactNode;
}
/** A titled group of fields. Sections are visibly separated; small ones may sit side by side in a PageGrid. */
export function FormSection({ title, description, aside, className, children, ...rest }: FormSectionProps) {
  return (
    <section className={cx('ar-fsection', aside && 'ar-fsection--aside', className)} {...rest}>
      <div className="ar-fsection-in">
        <header className="ar-fsection-head">
          <h3 className="ar-fsection-title">{title}</h3>
          {description && <p className="ar-fsection-desc">{description}</p>}
        </header>
        <div className="ar-fsection-body">{children}</div>
      </div>
    </section>
  );
}

export interface FormGridProps extends HTMLAttributes<HTMLDivElement> {
  /** 1 or 2 columns. Two columns stack under 560px of its own width. */
  cols?: 1 | 2;
}
/** Fields in one or two even columns. A child with data-span="full" takes the whole row. */
export function FormGrid({ cols = 2, className, children, ...rest }: FormGridProps) {
  return <div className={cx('ar-fgrid', className)} data-cols={cols} {...rest}><div className="ar-fgrid-in">{children}</div></div>;
}

export interface FormActionsProps extends HTMLAttributes<HTMLDivElement> {
  /** Stays at the bottom of the scrolling area (long forms, sheets). */
  sticky?: boolean;
  /** Something on the start side: "All changes saved", a secondary link. */
  start?: ReactNode;
}
/** The form's buttons: the primary action last, at the end of the row. */
export function FormActions({ sticky, start, className, children, ...rest }: FormActionsProps) {
  return (
    <div className={cx('ar-factions', sticky && 'is-sticky', className)} {...rest}>
      {start && <div className="ar-factions-start">{start}</div>}
      <div className="ar-factions-end">{children}</div>
    </div>
  );
}

/** A <form> that never reloads the page: onSubmit gets the event already prevented. */
export function Form({ onSubmit, className, ...rest }: FormHTMLAttributes<HTMLFormElement>) {
  return <form noValidate className={cx('ar-form', className)} onSubmit={(e) => { e.preventDefault(); onSubmit?.(e); }} {...rest} />;
}

export interface SaveBarProps {
  /** Names of what changed; the count drives the bar. */
  changed: string[] | number;
  onSave: () => void;
  onDiscard: () => void;
  saving?: boolean;
  /** Why the last save failed, in plain words. */
  error?: ReactNode;
  /** What saving does: "Nothing changes on the site until you save." */
  note?: ReactNode;
  /** Shown when nothing is unsaved. */
  savedNote?: ReactNode;
  saveLabel?: string;
  /** Pin to the bottom of the scrolling area (default true). */
  sticky?: boolean;
  className?: string;
}
/** The unsaved-changes bar: "3 unsaved changes", Discard and Save, then "All changes saved". */
export function SaveBar({ changed, onSave, onDiscard, saving, error, note = 'Nothing changes until you save.', savedNote = 'All changes saved.', saveLabel = 'Save changes', sticky = true, className }: SaveBarProps) {
  const n = typeof changed === 'number' ? changed : changed.length;
  return (
    <div className={cx('ar-savebar', n > 0 && 'is-dirty', error && 'is-error', sticky && 'is-sticky', className)} role="status" aria-live="polite">
      <span className="ar-savebar-msg">
        {error ? <><AlertTriangleIcon size={16} className="ar-savebar-icon" /><b>{error}</b></>
          : n ? <><span className="ar-savebar-dot" aria-hidden="true" /><b>{plural(n, 'unsaved change')}.</b><span className="ar-savebar-note">{note}</span></>
          : <><CheckCircleIcon size={16} className="ar-savebar-icon is-ok" /><span className="ar-savebar-note">{savedNote}</span></>}
      </span>
      <span className="ar-savebar-actions">
        <Button variant="ghost" onClick={onDiscard} disabled={!n || saving}>Discard</Button>
        <Button variant="primary" onClick={onSave} disabled={!n && !error} loading={saving} loadingLabel="Saving">{error ? 'Try again' : saveLabel}</Button>
      </span>
    </div>
  );
}
