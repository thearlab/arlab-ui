import type { ReactNode } from 'react';
import { Icon } from './icons';

/** One registry icon per ARLAB department, drawn in the tile's ink (SidebarShell `tile.icon`, PageBar
 * `tile.icon`). A department the engine adds later has no icon yet and falls back to its letter. */
const NAMES: Record<string, string> = {
  company: 'Building2',
  engineering: 'Code2',
  creative: 'Palette',
  'clients-servicing': 'Contact',
  'strategy-growth': 'TrendingUp',
};

export function deptIcon(id: string, size = 14): ReactNode | undefined {
  return NAMES[id] ? <Icon name={NAMES[id]} size={size} /> : undefined;
}

/** One colour per department, from the department tokens (never a status colour). */
const TOKENS: Record<string, string> = { company: 'dept-company', creative: 'dept-creative', engineering: 'dept-engineering', 'clients-servicing': 'dept-client', 'strategy-growth': 'dept-strategy' };
export const deptColor = (id: string) => `var(--${TOKENS[id] || 'strong'})`;
