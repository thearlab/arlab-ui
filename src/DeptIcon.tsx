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
