import { useState, type ReactNode } from 'react';
import { Popover } from './Popover';

export interface MenuItemDef {
  id: string;
  label: string;
  icon?: ReactNode;
  danger?: boolean;
  disabled?: boolean;
  onSelect: () => void;
}

export type MenuEntry = MenuItemDef | { separator: true };

export interface DropdownMenuProps {
  trigger: (props: { onClick: () => void; 'aria-expanded': boolean }) => ReactNode;
  items: MenuEntry[];
  align?: 'start' | 'end';
}

/** The floating action menu neither app had — for a kebab button, a row's
 * overflow actions, anything that's "click to reveal a short list of
 * things to do" rather than a value to pick (that's Select or
 * ComboboxPicker). Arrow keys move a highlighted item; Enter selects. */
export function DropdownMenu({ trigger, items, align = 'end' }: DropdownMenuProps) {
  const [active, setActive] = useState(0);
  const selectable = items.filter((i): i is MenuItemDef => !('separator' in i) && !i.disabled);

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, selectable.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      selectable[active]?.onSelect();
    }
  }

  return (
    <Popover align={align} trigger={trigger}>
      <div role="menu" onKeyDown={onKeyDown}>
        {items.map((item, i) =>
          'separator' in item ? (
            <div className="arlab-menu-sep" key={`sep-${i}`} role="separator" />
          ) : (
            <button
              key={item.id}
              type="button"
              role="menuitem"
              disabled={item.disabled}
              className={['arlab-menu-item', item.danger ? 'danger' : '', selectable[active]?.id === item.id ? 'active' : ''].filter(Boolean).join(' ')}
              onClick={item.onSelect}
            >
              {item.icon}
              {item.label}
            </button>
          ),
        )}
      </div>
    </Popover>
  );
}
