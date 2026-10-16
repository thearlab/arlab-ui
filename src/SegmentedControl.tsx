'use client';

import { Tabs, type TabOption } from './Tabs';

export interface SegmentOption extends Omit<TabOption, 'label'> {
  label: string;
}

export interface SegmentedControlProps {
  options: SegmentOption[];
  value: string;
  onChange: (value: string) => void;
  /** 2.0: `segments` (default, pressed buttons) for a filter or view switch, `tabs` for page tabs. */
  kind?: 'tabs' | 'segments';
  'aria-label'?: string;
  className?: string;
}

/** 1.x name for the Contour Tabs in their segments role. Prefer `Tabs` in new code. */
export function SegmentedControl({ kind = 'segments', ...props }: SegmentedControlProps) {
  return <Tabs kind={kind} {...props} />;
}
