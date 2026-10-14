'use client';
import { createContext, useContext, useId, type HTMLAttributes, type ReactNode } from 'react';
import { cx } from '../lib/cx';
import { AlertTriangleIcon } from '../core/icons';

/** What a Field tells the control inside it. Every form control in this folder reads it. */
export interface FieldContextValue {
  id: string;
  labelId: string;
  describedBy?: string;
  invalid: boolean;
  required: boolean;
  disabled: boolean;
}
const FieldContext = createContext<FieldContextValue | null>(null);
export const useFieldContext = () => useContext(FieldContext);

/** Merge the surrounding Field's id, description, invalid and required state into a control's props. */
export function useFieldProps<P extends { id?: string; 'aria-describedby'?: string; 'aria-invalid'?: any; required?: boolean; disabled?: boolean }>(p: P, invalid?: boolean) {
  const f = useFieldContext();
  const own = useId();
  const bad = !!(invalid ?? f?.invalid);
  return {
    id: p.id ?? f?.id ?? own,
    'aria-describedby': [p['aria-describedby'], f?.describedBy].filter(Boolean).join(' ') || undefined,
    'aria-invalid': bad || p['aria-invalid'] || undefined,
    required: p.required ?? f?.required,
    disabled: p.disabled ?? f?.disabled,
    labelId: f?.labelId,
    invalid: bad,
  };
}

export interface FieldProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** The visible label, sentence case. */
  label: ReactNode;
  /** One line of help under the control. */
  help?: ReactNode;
  /** What is wrong and how to fix it. Sets aria-invalid on the control. */
  error?: ReactNode;
  required?: boolean;
  /** Shows "Optional" next to the label (use when most fields are required). */
  optional?: boolean;
  disabled?: boolean;
  /** Reuse an id for the control (otherwise one is made). */
  id?: string;
  /** Label beside the control (settings rows), not above it. */
  inline?: boolean;
  /** Hide the label visually (a search box with a clear placeholder). Still read by screen readers. */
  hideLabel?: boolean;
  children: ReactNode;
}

/** A label, the control, help and error, wired together for screen readers. */
export function Field({ label, help, error, required = false, optional, disabled = false, id, inline, hideLabel, className, children, ...rest }: FieldProps) {
  const auto = useId();
  const cid = id ?? `f${auto}`;
  const helpId = help ? `${cid}-help` : undefined;
  const errId = error ? `${cid}-err` : undefined;
  const value: FieldContextValue = { id: cid, labelId: `${cid}-label`, describedBy: [errId, helpId].filter(Boolean).join(' ') || undefined, invalid: !!error, required, disabled };
  return (
    <FieldContext.Provider value={value}>
      <div className={cx('ar-field', inline && 'ar-field--inline', disabled && 'is-disabled', className)} {...rest}>
        <label className={cx('ar-field-label', hideLabel && 'ar-visually-hidden')} htmlFor={cid} id={value.labelId}>
          {label}
          {required && <span className="ar-field-req" aria-hidden="true"> *</span>}
          {optional && !required && <span className="ar-field-opt">Optional</span>}
        </label>
        <div className="ar-field-control">{children}</div>
        {error && <p className="ar-field-error" id={errId}><AlertTriangleIcon size={14} />{error}</p>}
        {help && <p className="ar-field-help" id={helpId}>{help}</p>}
      </div>
    </FieldContext.Provider>
  );
}
