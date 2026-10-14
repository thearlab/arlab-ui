'use client';
import { cloneElement, isValidElement, useId, useRef, type ReactElement, type ReactNode } from 'react';
import { useAnchored, useControllable, useDismiss, useIsoLayoutEffect, useMediaQuery, focusables } from '../hooks';
import { cx } from '../lib/cx';
import type { Placement } from '../lib/place';
import { Portal } from '../core/Primitives';
import { IconButton } from '../core/IconButton';
import { CloseIcon } from '../core/icons';
import { useElement } from './useElement';

export interface PopoverProps {
  /** The one element that opens it (a Button, an IconButton). It gets aria-expanded and aria-controls. */
  trigger: ReactElement;
  children: ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  placement?: Placement;
  /** A title row with a close button (an edit popover). Also names the popover. */
  title?: ReactNode;
  /** A line under the title. */
  sub?: ReactNode;
  /** Sticky actions row (Cancel, Save). */
  footer?: ReactNode;
  /** Names it when there is no title. */
  'aria-label'?: string;
  /** content (default): focus moves to the first field. trigger: focus stays on the trigger (a hint). */
  focus?: 'content' | 'trigger';
  /** Width in px (default fits the content, max 380). */
  width?: number;
  arrow?: boolean;
  className?: string;
}

/** A small surface anchored to the control that opened it: a few related fields or facts, then gone.
 * Non-modal: Esc, a click outside, or Tab out of it closes it, focus goes back to the trigger. On a
 * phone it becomes a bottom sheet. Never a warning (HIG popovers). */
export function Popover({ trigger, children, open, defaultOpen = false, onOpenChange, placement = 'bottom-start', title, sub, footer, focus = 'content', width, arrow, className, ...rest }: PopoverProps) {
  const [isOpen, setOpen] = useControllable(open, defaultOpen, onOpenChange);
  const anchor = useRef<HTMLElement | null>(null);
  const [panelRef, panel, panelEl] = useElement<HTMLDivElement>();
  const phone = useMediaQuery('(max-width: 640px)');
  const pos = useAnchored(anchor, panel, isOpen && !phone && !!panelEl, placement, arrow ? 12 : 8);
  const id = useId();
  const close = (refocus = true) => { setOpen(false); if (refocus) anchor.current?.focus({ preventScroll: true }); };
  useDismiss(isOpen, () => close(), [panel, anchor]);
  useIsoLayoutEffect(() => {
    if (!isOpen || focus !== 'content' || !panelEl) return;
    const f = panelEl.querySelector<HTMLElement>('[data-autofocus]') ?? focusables(panelEl).find((el) => !el.closest('.ar-popover-head')) ?? panelEl;
    f.focus({ preventScroll: true });
  }, [isOpen, panelEl]);
  if (!isValidElement(trigger)) return null;
  const tp = trigger.props as Record<string, any>;
  const t = cloneElement(trigger as ReactElement<any>, {
    ref: (el: HTMLElement | null) => { anchor.current = el; },
    'aria-expanded': isOpen,
    'aria-controls': isOpen ? id : undefined,
    'aria-haspopup': 'dialog',
    onClick: (e: any) => { tp.onClick?.(e); if (!e.defaultPrevented) setOpen(!isOpen); },
  });
  return (
    <>
      {t}
      {isOpen && (
        <Portal>
          <div ref={panelRef} id={id} role="dialog" aria-label={title ? undefined : rest['aria-label']} aria-labelledby={title ? `${id}t` : undefined}
            tabIndex={-1} className={cx('ar-popover', phone && 'ar-popover--sheet', className)} data-side={pos?.side}
            style={phone ? undefined : { top: pos?.top ?? -9999, left: pos?.left ?? -9999, width, maxHeight: pos?.maxHeight }}
            onBlur={(e) => { const n = e.relatedTarget as Node | null; if (n && !panel.current?.contains(n) && !anchor.current?.contains(n)) close(false); }}>
            {arrow && !phone && <span className="ar-popover-arrow" aria-hidden="true" />}
            {title && (
              <div className="ar-popover-head">
                <div><h2 id={`${id}t`} className="ar-popover-title">{title}</h2>{sub && <p className="ar-popover-sub">{sub}</p>}</div>
                <IconButton label="Close" size="sm" onClick={() => close()}><CloseIcon /></IconButton>
              </div>
            )}
            <div className="ar-popover-body ar-scroll">{children}</div>
            {footer && <div className="ar-popover-foot">{footer}</div>}
          </div>
        </Portal>
      )}
    </>
  );
}
