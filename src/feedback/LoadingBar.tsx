import { cx } from '../lib/cx';

export interface LoadingBarProps {
  active: boolean;
  /** What is loading, for screen readers (default "Loading"). */
  label?: string;
  /** inline: sits at the top of its positioned parent (a card, a panel) instead of the window. */
  inline?: boolean;
  className?: string;
}

/** A thin bar at the top while work is in flight. Render once per screen with `active`. Never a
 * "Loading..." sentence. Reduced motion: a still bar. */
export function LoadingBar({ active, label = 'Loading', inline, className }: LoadingBarProps) {
  if (!active) return null;
  return (
    <div role="progressbar" aria-label={label} aria-busy="true" className={cx('ar-loadingbar', inline && 'ar-loadingbar--inline', className)}>
      <span className="ar-loadingbar-fill" />
    </div>
  );
}
