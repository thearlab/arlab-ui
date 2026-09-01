'use client';

export interface LegendDotProps {
  color: string;
  label: string;
}

/** A colored dot + label pairing — arlab-docs' GraphView legend key. */
export function LegendDot({ color, label }: LegendDotProps) {
  return (
    <span className="arlab-legend-dot">
      <span className="dot" style={{ background: color }} />
      {label}
    </span>
  );
}