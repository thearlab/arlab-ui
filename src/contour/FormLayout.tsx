import { Children, cloneElement, isValidElement, useId, type HTMLAttributes, type ReactNode } from "react";

export interface FormGridProps extends HTMLAttributes<HTMLDivElement> {
  /** Two equally sized columns collapse to one on narrow screens. */
  columns?: 1 | 2;
}
/** Layout only. Fields retain their own values, event handlers and validation. */
export function FormGrid({
  columns = 2,
  className = "",
  children,
  ...props
}: FormGridProps) {
  return (
    <div
      {...props}
      className={`ct-form-grid ct-form-grid-${columns} ${className}`}
    >
      {children}
    </div>
  );
}

export interface FormFieldGroupProps extends HTMLAttributes<HTMLDivElement> {
  label: ReactNode;
  /** Supply the actual control id to make the label focus that control. */
  htmlFor?: string;
  hint?: ReactNode;
  error?: ReactNode;
  required?: boolean;
}
/** One labelled field or related group. A directly associated control inherits aria-required; values and form state remain host-owned. */
export function FormFieldGroup({
  label,
  htmlFor,
  hint,
  error,
  required = false,
  className = "",
  children,
  ...props
}: FormFieldGroupProps) {
  const id = useId();
  const labelId = `${id}-label`,
    hintId = `${id}-hint`,
    errorId = `${id}-error`;
  const describedBy =
    [props["aria-describedby"], hint ? hintId : null, error ? errorId : null]
      .filter(Boolean)
      .join(" ") || undefined;
  return (
    <div
      {...props}
      className={`ct-form-field-group ${className}`}
      role={props.role || "group"}
      aria-labelledby={props["aria-labelledby"] || labelId}
      aria-describedby={describedBy}
    >
      {htmlFor ? (
        <label id={labelId} htmlFor={htmlFor} className="ct-form-field-label">
          {label}
          {required && <span className="ct-form-field-required" aria-hidden="true">*</span>}
        </label>
      ) : (
        <span id={labelId} className="ct-form-field-label">
          {label}
          {required && <span className="ct-form-field-required" aria-hidden="true">*</span>}
        </span>
      )}
      <div className="ct-form-field-control">{Children.map(children, child=>{
        if(!required || !isValidElement<{id?:string;'aria-required'?:boolean}>(child))return child;
        return (htmlFor && child.props.id===htmlFor) || ['input','select','textarea'].includes(String(child.type)) ? cloneElement(child,{'aria-required':true}) : child;
      })}</div>
      {hint && (
        <p id={hintId} className="ct-form-field-hint">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} className="ct-form-field-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
