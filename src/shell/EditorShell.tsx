'use client';
import type { ReactNode } from 'react';
import { cx } from '../lib/cx';

export interface EditorShellProps {
  /** Left of the toolbar: back to the list, the item picker, the mode switch. */
  start?: ReactNode;
  /** Middle: section links. Hidden on phones. */
  center?: ReactNode;
  /** Right: device switch, publish. */
  end?: ReactNode;
  /** The save state ("All saved", "3 unsaved changes"), shown as a chip in the corner, announced. */
  status?: ReactNode;
  statusTone?: 'ok' | 'warn' | 'bad' | 'neutral';
  /** An inspector on the right (the selected block's fields). */
  inspector?: ReactNode;
  inspectorLabel?: string;
  /** The canvas: the page being edited, full bleed. */
  children: ReactNode;
  className?: string;
  label?: string;
}

/** The CMS-style shell: a slim toolbar over a full-bleed canvas, an optional inspector and a save chip.
 * For editors (the website editor, a deck, a form builder), not for lists. */
export function EditorShell({ start, center, end, status, statusTone = 'ok', inspector, inspectorLabel = 'Inspector', children, className, label = 'Editor' }: EditorShellProps) {
  return (
    <div className={cx('ar-editor', className)}>
      <a className="ar-skip-link" href="#ar-canvas">Skip to the canvas</a>
      <div className="ar-editor-bar" role="toolbar" aria-label={`${label} toolbar`}>
        <div className="ar-editor-start">{start}</div>
        {center && <div className="ar-editor-center">{center}</div>}
        <div className="ar-editor-end">{end}</div>
      </div>
      <div className="ar-editor-body" data-inspector={inspector ? '' : undefined}>
        <main id="ar-canvas" className="ar-editor-canvas" tabIndex={-1}>{children}</main>
        {inspector && <aside className="ar-editor-inspector" aria-label={inspectorLabel}>{inspector}</aside>}
      </div>
      {status && <div className="ar-editor-status" role="status" data-tone={statusTone}><span className="ar-editor-dot" aria-hidden="true" />{status}</div>}
    </div>
  );
}
