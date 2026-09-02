'use client';

export interface ScoreBarProps {
  /** 0-1 fraction. */
  value: number;
  /** Renders the percentage in mono next to the bar (an instrument readout, not a stat tile). */
  showValue?: boolean;
  tone?: 'accent' | 'live' | 'warn' | 'crit';
  className?: string;
}

/** A thin, precise fill meter for any AI-scored value across the platform
 * (classification confidence, eval scores, trend-detect ranking, ...) — the
 * bar itself is the signal, not an icon-plus-big-number stat tile. */
export function ScoreBar({ value, showValue = true, tone = 'accent', className = '' }: ScoreBarProps) {
  const pct = Math.round(Math.max(0, Math.min(1, value)) * 100);
  return (
    <span className={['arlab-scorebar-wrap', className].filter(Boolean).join(' ')}>
      <span className="arlab-scorebar" role="img" aria-label={`${pct}% confidence`}>
        <span className={['arlab-scorebar-fill', tone].filter(Boolean).join(' ')} style={{ width: `${pct}%` }} />
      </span>
      {showValue ? <span className="arlab-scorebar-value">{pct}%</span> : null}
    </span>
  );
}
