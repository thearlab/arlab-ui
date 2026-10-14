'use client';
import { useEffect, useId, useRef, type ReactNode, type RefObject } from 'react';
import { useControllable, usePresence } from '../hooks';
import { cx } from '../lib/cx';
import { Portal } from '../core/Primitives';
import { IconButton } from '../core/IconButton';
import { CloseIcon } from '../core/icons';
import { DURATIONS } from '../tokens/tokens';
import { useModal } from './useModal';

export interface SheetProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  onClose?: () => void;
  title: ReactNode;
  /** A small line above the title: what kind of thing this is ("Member", "Agent, Mon 13 Oct"). */
  kicker?: ReactNode;
  /** Under the title. */
  description?: ReactNode;
  children?: ReactNode;
  /** Sticky footer: Cancel then the action, or Close. */
  footer?: ReactNode;
  /** right (default, a bottom sheet on phones), left, or bottom. */
  side?: 'right' | 'left' | 'bottom';
  /** Width of a side sheet in px (default 620). */
  width?: number;
  /** Esc and a scrim click close it (default). */
  dismissible?: boolean;
  initialFocus?: RefObject<HTMLElement | null>;
  className?: string;
}

/** A side sheet for reading a record, an edit or a long form: the page stays where it was underneath.
 * Modal: focus is trapped and returned, Esc closes, one sheet at a time (a confirm may sit on top). */
export function Sheet({ open, defaultOpen = false, onOpenChange, onClose, title, kicker, description, children, footer, side = 'right', width, dismissible = true, initialFocus, className }: SheetProps) {
  const [isOpen, setOpen] = useControllable(open, defaultOpen, onOpenChange);
  const close = () => { setOpen(false); onClose?.(); };
  const { ref, mounted, state } = useModal(isOpen, close, { dismissible, initialFocus });
  const id = useId();
  if (!mounted) return null;
  return (
    <Portal>
      <div className="ar-scrim ar-scrim--sheet" data-side={side} data-state={state} onClick={(e) => { if (dismissible && e.target === e.currentTarget) close(); }}>
        <div ref={ref} role="dialog" aria-modal="true" aria-labelledby={`${id}t`} aria-describedby={description ? `${id}d` : undefined} tabIndex={-1}
          className={cx('ar-sheet', className)} data-side={side} data-state={state} style={width ? { ['--sheet-w' as string]: `${width}px` } : undefined}>
          <header className="ar-sheet-head">
            <div className="ar-sheet-titles">
              {kicker && <div className="ar-sheet-kicker">{kicker}</div>}
              <h2 id={`${id}t`} className="ar-sheet-title">{title}</h2>
              {description && <div id={`${id}d`} className="ar-sheet-desc">{description}</div>}
            </div>
            {dismissible && <IconButton label="Close" variant="secondary" size="sm" onClick={close}><CloseIcon /></IconButton>}
          </header>
          <div className="ar-sheet-body ar-scroll">{children}</div>
          {footer && <footer className="ar-sheet-foot">{footer}</footer>}
        </div>
      </div>
    </Portal>
  );
}

export interface SheetSectionProps { title?: ReactNode; description?: ReactNode; actions?: ReactNode; children?: ReactNode; className?: string }
/** A titled group inside a Sheet (Access, Who, Remove). */
export function SheetSection({ title, description, actions, children, className }: SheetSectionProps) {
  const id = useId();
  return (
    <section className={cx('ar-sheet-section', className)} aria-labelledby={title ? id : undefined}>
      {(title || actions) && <div className="ar-sheet-section-head">{title && <h3 id={id}>{title}</h3>}{actions}</div>}
      {description && <p className="ar-sheet-section-desc">{description}</p>}
      <div className="ar-sheet-section-body">{children}</div>
    </section>
  );
}

export interface DrawerProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Names the panel (a landmark): "Filters", "Navigation". */
  title: ReactNode;
  children?: ReactNode;
  footer?: ReactNode;
  side?: 'left' | 'right';
  /** overlay: floats over the page (default). push: sits in the layout and takes its width. */
  mode?: 'overlay' | 'push';
  width?: number;
  className?: string;
}

/** A non-modal side panel: filters, a navigation list on a phone, a companion panel. The page stays
 * usable. Esc closes it and focus goes back to what opened it. */
export function Drawer({ open, defaultOpen = false, onOpenChange, title, children, footer, side = 'right', mode = 'overlay', width, className }: DrawerProps) {
  const [isOpen, setOpen] = useControllable(open, defaultOpen, onOpenChange);
  const { mounted, state } = usePresence(isOpen, DURATIONS.panel);
  const ref = useRef<HTMLElement>(null);
  const id = useId();
  useEffect(() => {
    if (!isOpen) return;
    const before = document.activeElement as HTMLElement | null;
    ref.current?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape' && ref.current?.contains(document.activeElement)) { e.stopPropagation(); setOpen(false); } };
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('keydown', onKey); if (before && document.contains(before) && ref.current?.contains(document.activeElement)) before.focus({ preventScroll: true }); };
  }, [isOpen]); // eslint-disable-line react-hooks/exhaustive-deps
  if (!mounted) return null;
  const panel = (
    <aside ref={ref} tabIndex={-1} aria-labelledby={id} className={cx('ar-drawer', `ar-drawer--${mode}`, className)} data-side={side} data-state={state}
      style={width ? { ['--drawer-w' as string]: `${width}px` } : undefined}>
      <header className="ar-drawer-head">
        <h2 id={id} className="ar-drawer-title">{title}</h2>
        <IconButton label="Close" size="sm" onClick={() => setOpen(false)}><CloseIcon /></IconButton>
      </header>
      <div className="ar-drawer-body ar-scroll">{children}</div>
      {footer && <footer className="ar-drawer-foot">{footer}</footer>}
    </aside>
  );
  return mode === 'push' ? panel : <Portal>{panel}</Portal>;
}
