'use client';

import type { ReactNode } from 'react';
import { ArlabMark } from '../ArlabMark';
import { Avatar } from '../Avatar';
import { Badge } from '../Badge';
import { DropdownMenu, type MenuEntry } from '../DropdownMenu';

export interface ShellBrand {
  name: string;
  /** Click on the lockup; usually "go home". Without it the brand is a plain lockup. */
  onHome?: () => void;
}

/** ARLAB mark, the live pulse dot and the product name. Shared by both shells. */
export function Brand({ name, onHome }: ShellBrand) {
  const inner = (
    <>
      <ArlabMark height={20} />
      <span className="arlab-shell-pulse" aria-hidden="true" />
      <b>{name}</b>
    </>
  );
  return onHome
    ? <button type="button" className="arlab-shell-brand" onClick={onHome} aria-label={`${name} home`}>{inner}</button>
    : <div className="arlab-shell-brand">{inner}</div>;
}

export interface ShellAccount {
  /** The signed-in person, usually the email. */
  name: string;
  role?: string;
  menu: MenuEntry[];
}

/** Avatar + name/role that opens the account menu. `compact` shows the avatar and the role badge only (top bar). */
export function AccountMenu({ account, compact = false }: { account: ShellAccount; compact?: boolean }) {
  return (
    <DropdownMenu
      align={compact ? 'end' : 'start'}
      items={account.menu}
      trigger={(p) => (
        <button type="button" className={`arlab-shell-account${compact ? ' compact' : ''}`} aria-label="Account menu" {...p}>
          {compact && account.role && <Badge>{account.role}</Badge>}
          <Avatar name={account.name} size={compact ? 28 : 30} />
          {!compact && (
            <span className="arlab-shell-who">
              <span>{account.name}</span>
              {account.role && <small>{account.role}</small>}
            </span>
          )}
        </button>
      )}
    />
  );
}

const svg = (d: ReactNode) => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{d}</svg>
);

/** The sidebar icon set, one recipe (24 grid, 1.6 stroke, round caps). */
export const ShellIcons = {
  home: () => svg(<path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" />),
  agents: () => svg(<><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></>),
  workflows: () => svg(<><rect x="3" y="3" width="6" height="6" /><rect x="15" y="15" width="6" height="6" /><path d="M9 6h6a3 3 0 0 1 3 3v6" /></>),
  build: () => svg(<path d="M12 5v14M5 12h14" />),
  apps: () => svg(<><rect x="3" y="3" width="8" height="8" /><rect x="13" y="3" width="8" height="8" /><rect x="3" y="13" width="8" height="8" /><rect x="13" y="13" width="8" height="8" /></>),
  admin: () => svg(<><circle cx="9" cy="8" r="3.5" /><path d="M2 20a7 7 0 0 1 14 0M16 4a3.5 3.5 0 0 1 0 7M22 20a7 7 0 0 0-5-6.7" /></>),
  docs: () => svg(<path d="M4 5a2 2 0 0 1 2-2h6v18H6a2 2 0 0 1-2-2zM12 3h6a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-6" />),
  search: () => svg(<><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" /></>),
};
