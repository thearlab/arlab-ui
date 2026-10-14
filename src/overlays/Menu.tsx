'use client';
import { cloneElement, isValidElement, useEffect, useId, useMemo, useRef, useState, type ReactElement, type ReactNode } from 'react';
import { useAnchored, useControllable, useDismiss, useIsoLayoutEffect } from '../hooks';
import { cx } from '../lib/cx';
import { nextIndex, shortcutLabel, typeahead } from '../lib/keys';
import { place, type Placement, type Placed } from '../lib/place';
import { Portal } from '../core/Primitives';
import { Button, type ButtonProps } from '../core/Button';
import { CheckIcon, ChevronDownIcon, ChevronRightIcon } from '../core/icons';
import { useElement } from './useElement';

/** One command. A verb first ("Rename", "Copy link"), "…" when it opens more input. */
export interface MenuItemDef {
  id?: string;
  label: string;
  icon?: ReactNode;
  /** 'mod+d', shown in the HIG order on the right. The menu does not bind it; the app does. */
  shortcut?: string;
  description?: string;
  tone?: 'default' | 'danger';
  disabled?: boolean;
  /** checkbox and radio items show a check and stay open when chosen. */
  type?: 'item' | 'checkbox' | 'radio';
  checked?: boolean;
  onSelect?: () => void;
  /** One level of submenu, about five items at most (HIG menus). */
  submenu?: MenuEntry[];
}
export interface MenuSeparator { type: 'separator' }
export interface MenuGroup { type: 'group'; label: string; items: MenuEntry[] }
export type MenuEntry = MenuItemDef | MenuSeparator | MenuGroup;

const isSep = (e: MenuEntry): e is MenuSeparator => (e as MenuSeparator).type === 'separator';
const isGroup = (e: MenuEntry): e is MenuGroup => (e as MenuGroup).type === 'group';
const flatItems = (entries: MenuEntry[]): MenuItemDef[] => entries.flatMap((e) => (isSep(e) ? [] : isGroup(e) ? flatItems(e.items) : [e]));

interface PanelProps {
  items: MenuEntry[];
  label?: string;
  labelledBy?: string;
  /** Close the whole menu tree, optionally giving focus back to the trigger. */
  onClose: (refocus: boolean) => void;
  /** Called by a submenu when Left or Esc should go back up. */
  onBack?: () => void;
  /** Which item gets focus first: 0, 'last', or none (-1). */
  initial?: number | 'last';
  id?: string;
  style?: React.CSSProperties;
  panelRef?: React.Ref<HTMLDivElement>;
  className?: string;
}

/** The menu list itself (role=menu). Used by MenuButton and ContextMenu; render it alone for a menu
 * that is always shown. Arrows, Home, End, type-ahead, Enter and Space, Right into a submenu, Left out. */
export function Menu({ items, label, labelledBy, onClose, onBack, initial = 0, id, style, panelRef, className }: PanelProps) {
  const flat = useMemo(() => flatItems(items), [items]);
  const [active, setActive] = useState(() => (initial === 'last' ? flat.length - 1 : initial));
  const [sub, setSubState] = useState<number | null>(null);
  const [subFocus, setSubFocus] = useState(true);
  const setSub = (i: number | null, focus = true) => { setSubFocus(focus); setSubState(i); };
  const refs = useRef<Array<HTMLDivElement | null>>([]);
  const typed = useRef({ text: '', at: 0 });
  useEffect(() => { if (active >= 0) refs.current[active]?.focus({ preventScroll: false }); }, [active]);
  // Start on the first enabled item.
  useIsoLayoutEffect(() => {
    if (active >= 0 && flat[active]?.disabled) { const n = nextIndex(active, 'ArrowDown', flat.length, { disabled: (i) => !!flat[i].disabled }); if (n !== null) setActive(n); }
  }, []);

  const choose = (i: number) => {
    const it = flat[i]; if (!it || it.disabled) return;
    if (it.submenu) { setSub(i); return; }
    it.onSelect?.();
    if (it.type !== 'checkbox' && it.type !== 'radio') onClose(true);
  };
  const onKey = (e: React.KeyboardEvent) => {
    // Keys from a nested submenu bubble here: that menu handles them.
    if ((e.target as HTMLElement).closest('.ar-menu') !== e.currentTarget) return;
    if (sub !== null) setSub(null);
    const rtl = getComputedStyle(e.currentTarget).direction === 'rtl';
    const fwd = rtl ? 'ArrowLeft' : 'ArrowRight', back = rtl ? 'ArrowRight' : 'ArrowLeft';
    const n = nextIndex(active, e.key, flat.length, { disabled: (i) => !!flat[i].disabled });
    if (n !== null) { e.preventDefault(); setActive(n); return; }
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); choose(active); return; }
    if (e.key === fwd && flat[active]?.submenu) { e.preventDefault(); setSub(active); return; }
    if ((e.key === back || e.key === 'Escape') && onBack) { e.preventDefault(); e.stopPropagation(); onBack(); return; }
    if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); onClose(true); return; }
    if (e.key === 'Tab') { onClose(false); return; }
    if (e.key.length === 1 && /\S/.test(e.key) && !e.metaKey && !e.ctrlKey) {
      const now = Date.now(); const t = typed.current;
      t.text = now - t.at > 600 ? e.key : t.text + e.key; t.at = now;
      const i = typeahead(flat.map((x) => x.label), t.text, active);
      if (i >= 0) setActive(i);
    }
  };

  let k = -1;
  const render = (entries: MenuEntry[], key: string): ReactNode[] => entries.map((e, n) => {
    if (isSep(e)) return <div key={`${key}s${n}`} role="separator" className="ar-menu-sep" />;
    if (isGroup(e)) {
      const gid = `${id ?? 'm'}-${key}g${n}`;
      return <div key={gid} role="group" aria-labelledby={gid} className="ar-menu-group"><div id={gid} className="ar-menu-label" role="presentation">{e.label}</div>{render(e.items, `${key}g${n}-`)}</div>;
    }
    const i = ++k;
    const role = e.type === 'checkbox' ? 'menuitemcheckbox' : e.type === 'radio' ? 'menuitemradio' : 'menuitem';
    const checkable = flat.some((x) => x.type === 'checkbox' || x.type === 'radio');
    return (
      <div key={e.id ?? `${key}${n}`} ref={(el) => { refs.current[i] = el; }} role={role} tabIndex={i === Math.max(active, 0) ? 0 : -1}
        aria-checked={e.type === 'checkbox' || e.type === 'radio' ? !!e.checked : undefined} aria-disabled={e.disabled || undefined}
        aria-haspopup={e.submenu ? 'menu' : undefined} aria-expanded={e.submenu ? sub === i : undefined}
        className={cx('ar-menu-item', e.tone === 'danger' && 'ar-menu-item--danger')}
        onClick={() => { setActive(i); choose(i); }} onPointerMove={() => { if (active !== i) setActive(i); if (e.submenu && sub !== i) setSub(i, false); else if (!e.submenu && sub !== null) setSub(null); }}>
        {checkable && <span className="ar-menu-check" aria-hidden="true">{e.checked ? <CheckIcon size={16} /> : null}</span>}
        {e.icon && <span className="ar-menu-icon" aria-hidden="true">{e.icon}</span>}
        <span className="ar-menu-text"><span className="ar-menu-name">{e.label}</span>{e.description && <span className="ar-menu-desc">{e.description}</span>}</span>
        {e.shortcut && <kbd className="ar-menu-kbd" aria-hidden="true">{shortcutLabel(e.shortcut)}</kbd>}
        {e.submenu && <ChevronRightIcon size={16} className="ar-menu-more" aria-hidden="true" />}
      </div>
    );
  });

  return (
    <div ref={panelRef} className={cx('ar-menu-box', className)} style={style}>
    <div id={id} role="menu" aria-label={labelledBy ? undefined : label} aria-labelledby={labelledBy} aria-orientation="vertical"
      className="ar-menu ar-scroll" onKeyDown={onKey}>
      {render(items, '')}
      {sub !== null && flat[sub]?.submenu && (
        <Submenu anchor={refs.current[sub]} items={flat[sub].submenu!} label={flat[sub].label} initial={subFocus ? 0 : -1}
          onBack={() => { setSub(null); refs.current[active]?.focus(); }} onClose={onClose} />
      )}
    </div>
    </div>
  );
}

function Submenu({ anchor, items, label, initial, onBack, onClose }: { anchor: HTMLDivElement | null; items: MenuEntry[]; label: string; initial: number; onBack: () => void; onClose: (refocus: boolean) => void }) {
  const a = useRef<HTMLElement | null>(anchor); a.current = anchor;
  const [cb, ref, el] = useElement<HTMLDivElement>();
  const pos = useAnchored(a, ref, !!el, 'right-start', 2);
  return (
    // Not portalled: it stays inside the parent menu's DOM so a click in it is not "outside".
    <Menu panelRef={cb} items={items} label={label} initial={initial} onBack={onBack} onClose={onClose} className="ar-menu--float"
      style={{ top: pos?.top ?? -9999, left: pos?.left ?? -9999, maxHeight: pos?.maxHeight }} />
  );
}

export interface MenuButtonProps extends Omit<ButtonProps, 'children' | 'onSelect'> {
  items: MenuEntry[];
  /** The button text. Ignored when `trigger` is given. */
  children?: ReactNode;
  /** A custom trigger (an IconButton "More"). It gets aria-haspopup, aria-expanded and the keys. */
  trigger?: ReactElement;
  placement?: Placement;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

/** A button that opens a menu of commands (APG menu button). Down or Enter opens on the first item,
 * Up on the last; Esc closes and returns focus. */
export function MenuButton({ items, children, trigger, placement = 'bottom-start', open, defaultOpen = false, onOpenChange, variant, ...btn }: MenuButtonProps) {
  const [isOpen, setOpen] = useControllable(open, defaultOpen, onOpenChange);
  const [initial, setInitial] = useState<number | 'last'>(0);
  const anchor = useRef<HTMLElement | null>(null);
  const [panelCb, panel, panelEl] = useElement<HTMLDivElement>();
  const pos = useAnchored(anchor, panel, isOpen && !!panelEl, placement, 6);
  const id = useId();
  const close = (refocus: boolean) => { setOpen(false); if (refocus) anchor.current?.focus({ preventScroll: true }); };
  useDismiss(isOpen, () => close(true), [panel, anchor]);
  const props = {
    ref: (el: HTMLElement | null) => { anchor.current = el; },
    id: `${id}b`,
    'aria-haspopup': 'menu' as const,
    'aria-expanded': isOpen,
    'aria-controls': isOpen ? id : undefined,
    onClick: (e: any) => { (trigger?.props as any)?.onClick?.(e); setInitial(0); setOpen(!isOpen); },
    onKeyDown: (e: any) => {
      (trigger?.props as any)?.onKeyDown?.(e);
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); setInitial(e.key === 'ArrowUp' ? 'last' : 0); setOpen(true); }
    },
  };
  const t = trigger && isValidElement(trigger)
    ? cloneElement(trigger as ReactElement<any>, props)
    : <Button {...btn} variant={variant} {...props} iconEnd={<ChevronDownIcon />}>{children}</Button>;
  return (
    <>
      {t}
      {isOpen && (
        <Portal>
          <Menu panelRef={panelCb} id={id} items={items} labelledBy={`${id}b`} initial={initial} onClose={close} className="ar-menu--float"
            style={{ top: pos?.top ?? -9999, left: pos?.left ?? -9999, maxHeight: pos?.maxHeight }} />
        </Portal>
      )}
    </>
  );
}

export interface ContextMenuProps {
  items: MenuEntry[];
  /** The target: one element. Right click, Shift+F10 or the Menu key opens the menu on it. */
  children: ReactElement;
  /** Names the menu ("Actions for Labby key"). */
  label: string;
}

/** A context menu for one item. Every action in it must also exist somewhere visible (HIG menus). */
export function ContextMenu({ items, children, label }: ContextMenuProps) {
  const [at, setAt] = useState<{ x: number; y: number } | null>(null);
  const target = useRef<HTMLElement | null>(null);
  const [panelCb, panel, panelEl] = useElement<HTMLDivElement>();
  const [pos, setPos] = useState<Placed | null>(null);
  const close = (refocus: boolean) => { setAt(null); if (refocus) target.current?.focus({ preventScroll: true }); };
  useDismiss(!!at, () => close(true), [panel]);
  useIsoLayoutEffect(() => {
    if (!at || !panelEl) { setPos(null); return; }
    const p = panelEl;
    setPos(place({ top: at.y, left: at.x, width: 0, height: 0 }, p.scrollWidth, p.scrollHeight, window.innerWidth, window.innerHeight, 'bottom-start', 2));
  }, [at, panelEl]);
  if (!isValidElement(children)) return children;
  const cp = children.props as Record<string, any>;
  const child = cloneElement(children as ReactElement<any>, {
    ref: (el: HTMLElement | null) => { target.current = el; },
    'aria-haspopup': 'menu',
    onContextMenu: (e: React.MouseEvent) => { cp.onContextMenu?.(e); e.preventDefault(); setAt({ x: e.clientX, y: e.clientY }); },
    onKeyDown: (e: React.KeyboardEvent) => {
      cp.onKeyDown?.(e);
      if ((e.shiftKey && e.key === 'F10') || e.key === 'ContextMenu') {
        e.preventDefault(); const r = (e.currentTarget as HTMLElement).getBoundingClientRect(); setAt({ x: r.left + 8, y: r.bottom });
      }
    },
  });
  return (
    <>
      {child}
      {at && (
        <Portal>
          <Menu panelRef={panelCb} items={items} label={label} onClose={close} className="ar-menu--float"
            style={{ top: pos?.top ?? -9999, left: pos?.left ?? -9999, maxHeight: pos?.maxHeight }} />
        </Portal>
      )}
    </>
  );
}
