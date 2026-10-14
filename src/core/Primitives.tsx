'use client';
import { useEffect, useState, type HTMLAttributes, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { cx } from '../lib/cx';
import { shortcutLabel } from '../lib/keys';

/** Hidden on screen, read by screen readers. */
export function VisuallyHidden({ className, ...rest }: HTMLAttributes<HTMLSpanElement>) {
  return <span className={cx('ar-visually-hidden', className)} {...rest} />;
}

/** Render into document.body (overlays, so no parent's overflow or transform can clip them). */
export function Portal({ children, container }: { children: ReactNode; container?: HTMLElement | null }) {
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  if (!ready || typeof document === 'undefined') return null;
  return createPortal(children, container ?? document.body);
}

export interface KbdProps extends HTMLAttributes<HTMLElement> {
  /** 'mod+k', 'shift+?', 'esc'. Rendered as ⌘K on a Mac, Ctrl+K elsewhere, in the HIG order. */
  keys?: string;
}
/** A keyboard key or shortcut. */
export function Kbd({ keys, children, className, ...rest }: KbdProps) {
  return <kbd className={cx('ar-kbd', className)} {...rest}>{keys ? shortcutLabel(keys) : children}</kbd>;
}

/** A skip link, first thing in the shell: "Skip to content". */
export function SkipLink({ href = '#main', children = 'Skip to content' }: { href?: string; children?: ReactNode }) {
  return <a className="ar-skip-link" href={href}>{children}</a>;
}
