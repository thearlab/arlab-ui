'use client';

import { useRef, type HTMLAttributes, type KeyboardEvent, type ReactNode } from 'react';

export interface Prop {
  k: ReactNode;
  v: ReactNode;
  /** Render the value in the mono face (ids, keys). */
  mono?: boolean;
}

/** One slim row of labelled values under a title: "Id content-planner  Intelligence Signal  Owner dev". */
export function PropertyRow({ props }: { props: Prop[] }) {
  return (
    <div className="arlab-props">
      {props.map((p, i) => (
        <span className="arlab-prop" key={i}>
          <span className="arlab-prop-k">{p.k}</span>
          <span className={['arlab-prop-v', p.mono ? 'mono' : ''].filter(Boolean).join(' ')}>{p.v}</span>
        </span>
      ))}
    </div>
  );
}

export interface TabDef {
  id: string;
  label: ReactNode;
}

export interface TabStripProps {
  tabs: TabDef[];
  value: string;
  onChange: (id: string) => void;
  className?: string;
}

/** Full-width tab strip: equal tabs in a slim sunken track, the active one raised. Arrow keys move
 * between tabs; Home/End jump. Replaces the underline Tabs of 0.x. */
export function TabStrip({ tabs, value, onChange, className = '' }: TabStripProps) {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const onKey = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    const n = tabs.length;
    const go = (j: number) => { const t = tabs[(j + n) % n]; onChange(t.id); refs.current[(j + n) % n]?.focus(); };
    if (e.key === 'ArrowRight') { e.preventDefault(); go(i + 1); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); go(i - 1); }
    else if (e.key === 'Home') { e.preventDefault(); go(0); }
    else if (e.key === 'End') { e.preventDefault(); go(n - 1); }
  };
  return (
    <div className={['arlab-tabstrip', className].filter(Boolean).join(' ')} role="tablist">
      {tabs.map((t, i) => {
        const on = t.id === value;
        return (
          <button
            key={t.id}
            ref={(el) => { refs.current[i] = el; }}
            type="button"
            role="tab"
            aria-selected={on}
            tabIndex={on ? 0 : -1}
            className={on ? 'on' : ''}
            onClick={() => onChange(t.id)}
            onKeyDown={(e) => onKey(e, i)}
          >
            {t.label}
          </button>
        );
      })}
    </div>
  );
}

export interface DetailHeaderProps {
  title: ReactNode;
  /** Badges rendered inline after the title (kind, version). */
  badges?: ReactNode;
  /** Buttons at the right of the title row. */
  actions?: ReactNode;
  props?: Prop[];
  tabs?: TabDef[];
  tab?: string;
  onTab?: (id: string) => void;
}

/** The fixed header band of a detail pane, on the ground tone: title with badges, actions, the
 * property row, then the tab strip. The body scrolls beneath it. */
export function DetailHeader({ title, badges, actions, props, tabs, tab, onTab }: DetailHeaderProps) {
  const current = tab ?? tabs?.[0]?.id ?? '';
  return (
    <div className="arlab-dhead">
      <div className="arlab-dhead-row">
        <h1 className="arlab-dhead-title">
          {title}
          {badges}
        </h1>
        {actions ? <div className="arlab-dhead-actions">{actions}</div> : null}
      </div>
      {props && props.length ? <PropertyRow props={props} /> : null}
      {tabs && tabs.length ? (
        <div className="arlab-dhead-tabs">
          <TabStrip tabs={tabs} value={current} onChange={(id) => onTab?.(id)} />
        </div>
      ) : null}
    </div>
  );
}

/** The scrolling body under a DetailHeader. */
export function DetailBody({ className = '', ...rest }: HTMLAttributes<HTMLDivElement>) {
  return <div className={['arlab-dbody', className].filter(Boolean).join(' ')} {...rest} />;
}

export interface ColumnsProps extends HTMLAttributes<HTMLDivElement> {
  /** side: main + 320px rail (default). equal: 1 : 1. run: 1 : 1.25 (request beside result). */
  variant?: 'side' | 'equal' | 'run';
}

/** Two columns that collapse to one under 1100px. */
export function Columns({ variant = 'side', className = '', ...rest }: ColumnsProps) {
  return <div className={['arlab-cols', variant, className].filter(Boolean).join(' ')} {...rest} />;
}

/** Vertical rhythm for a column: 14px between children. */
export function Stack({ className = '', ...rest }: HTMLAttributes<HTMLDivElement>) {
  return <div className={['arlab-stack', className].filter(Boolean).join(' ')} {...rest} />;
}
