'use client';

import type { ReactNode } from 'react';

export interface ChipGroupProps {
  label: string;
  children: ReactNode;
}

/** A labeled cluster of Chips — arlab-docs' RelatedRail pattern (related
 * entities grouped by type), generalized. */
export function ChipGroup({ label, children }: ChipGroupProps) {
  return (
    <div className="arlab-chip-group">
      <div className="arlab-chip-group-label">{label}</div>
      <div className="arlab-chip-group-items">{children}</div>
    </div>
  );
}