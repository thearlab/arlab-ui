import { cx } from '../lib/cx';

export interface SpinnerProps { size?: number; /** When set, announced to screen readers (role=status). */ label?: string; className?: string }

/** An indeterminate spinner. Decorative unless it has a label. Reduced motion: a slow pulse. */
export function Spinner({ size = 16, label, className }: SpinnerProps) {
  const svg = (
    <svg className={cx('ar-spinner', className)} width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity=".22" strokeWidth="2.6" />
      <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
    </svg>
  );
  return label ? <span role="status" className="ar-spinner-wrap">{svg}<span className="ar-visually-hidden">{label}</span></span> : svg;
}
