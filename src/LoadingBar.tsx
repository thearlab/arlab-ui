export interface LoadingBarProps {
  active: boolean;
}

/** A thin, fixed top-of-page indeterminate progress bar — for a route
 * transition or a long-running fetch, distinct from Skeleton (which
 * shapes itself to the content that's loading). Ported from theARLab's
 * site loader; neither internal app had an equivalent. */
export function LoadingBar({ active }: LoadingBarProps) {
  if (!active) return null;
  return (
    <div className="arlab-loadingbar" role="progressbar" aria-label="Loading">
      <div className="arlab-loadingbar-fill" />
    </div>
  );
}
