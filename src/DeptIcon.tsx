import type { ReactNode } from 'react';

/** One line icon per ARLAB department, drawn white for the colour tiles (SidebarShell `tile.icon`,
 * PageBar `tile.icon`). A department the engine adds later has no icon yet and falls back to its
 * letter, so add a line here when a department joins. */
const PATHS: Record<string, ReactNode> = {
  // A building: the company everyone belongs to.
  company: <path d="M5 21V5a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v16M15 9h3a1 1 0 0 1 1 1v11M3 21h18M8.5 8h3M8.5 12h3M8.5 16h3" />,
  // Code brackets.
  engineering: <path d="M8 7l-5 5 5 5M16 7l5 5-5 5M13.5 4.5l-3 15" />,
  // A palette.
  creative: <><path d="M12 3a9 9 0 1 0 0 18c1.1 0 1.6-.8 1.6-1.6 0-.9-.7-1.4-.7-2.3 0-.9.7-1.5 1.6-1.5H17a4 4 0 0 0 4-4C21 6.9 17 3 12 3z" /><circle cx="7.5" cy="11.5" r="1" /><circle cx="10" cy="7.5" r="1" /><circle cx="15" cy="7.5" r="1" /></>,
  // A person and a tick: the client looked after.
  'clients-servicing': <><circle cx="9" cy="8" r="3.5" /><path d="M2.5 20a6.5 6.5 0 0 1 13 0M16 11.5l2 2 4-4" /></>,
  // A rising line.
  'strategy-growth': <path d="M3 17l6-6 4 4 8-8M15 7h6v6" />,
};

export function deptIcon(id: string, size = 13): ReactNode | undefined {
  const d = PATHS[id];
  return d ? <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{d}</svg> : undefined;
}
