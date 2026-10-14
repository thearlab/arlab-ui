'use client';
import { useEffect, useId, useRef, type HTMLAttributes, type ReactNode } from 'react';
import { useControllable } from '../hooks';
import { cx } from '../lib/cx';
import { nextIndex } from '../lib/keys';

export interface TabItem<T extends string = string> {
  value: T;
  label: ReactNode;
  icon?: ReactNode;
  /** A count after the label. Shown only above zero. */
  count?: number;
  /** 'alert' (red, default): something needs you. 'neutral': just a number. */
  countTone?: 'alert' | 'neutral';
  disabled?: boolean;
  /** The panel. Leave it out when the page renders the panel itself (use TabPanel with `tabsId`). */
  content?: ReactNode;
}

export interface TabsProps<T extends string = string> {
  items: TabItem<T>[];
  value?: T;
  defaultValue?: T;
  /** Fires on every change. Sync the URL here (`?view=logs`, replaceState). */
  onChange?: (value: T) => void;
  /** Names the tab list for screen readers ("Engine admin sections"). Required. */
  label: string;
  /** pill: the large page tabs (one filled accent pill). line: underline tabs inside a card. */
  variant?: 'pill' | 'line';
  /** automatic (default): arrows select. manual: arrows move focus, Enter or Space selects. */
  activation?: 'automatic' | 'manual';
  /** Keep every panel mounted (hidden) instead of rendering only the active one. */
  keepMounted?: boolean;
  /** Set to link external TabPanels: their ids are `${id}-panel-${value}`. */
  id?: string;
  className?: string;
  /** Words after an alert count for screen readers (default "need you"). */
  countLabel?: string;
}

/** Tabs switch between panes of one area (HIG tab views, WAI-ARIA tabs). At most six; label tabs
 * with short nouns in sentence case. Each tab shows only its own content. */
export function Tabs<T extends string = string>({
  items, value, defaultValue, onChange, label, variant = 'pill', activation = 'automatic', keepMounted, id, className, countLabel = 'need you',
}: TabsProps<T>) {
  const auto = useId();
  const base = id ?? `ar-tabs${auto.replace(/:/g, '')}`;
  const [v, setV] = useControllable<T>(value, defaultValue ?? items[0]?.value, onChange);
  const refs = useRef<Array<HTMLButtonElement | null>>([]);
  const cur = Math.max(0, items.findIndex((t) => t.value === v));
  // Only point at panels that exist: lazily rendered panels exist for the chosen tab only.
  const hasPanels = items.some((t) => t.content !== undefined);

  // Keep the chosen tab in view when the list scrolls sideways (phone width).
  useEffect(() => { refs.current[cur]?.scrollIntoView?.({ block: 'nearest', inline: 'nearest' }); }, [cur]);

  const onKey = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const focused = refs.current.findIndex((r) => r === document.activeElement);
    const from = focused < 0 ? cur : focused;
    const rtl = getComputedStyle(e.currentTarget).direction === 'rtl';
    const i = nextIndex(from, e.key, items.length, { orientation: 'horizontal', rtl, disabled: (n) => !!items[n].disabled });
    if (i === null) return;
    e.preventDefault();
    refs.current[i]?.focus();
    if (activation === 'automatic') setV(items[i].value);
  };

  return (
    <div className={cx('ar-tabs', `ar-tabs--${variant}`, className)}>
      <div className="ar-tabs-scroll">
        <div role="tablist" aria-label={label} className="ar-tablist" onKeyDown={onKey}>
          {items.map((t, i) => {
            const on = i === cur;
            return (
              <button key={t.value} ref={(el) => { refs.current[i] = el; }} type="button" role="tab" id={`${base}-tab-${t.value}`}
                aria-selected={on} aria-controls={(hasPanels || id) && (on || (hasPanels && keepMounted)) ? `${base}-panel-${t.value}` : undefined} tabIndex={on ? 0 : -1} disabled={t.disabled}
                className="ar-tab" onClick={() => setV(t.value)}>
                {t.icon && <span className="ar-tab-icon" aria-hidden="true">{t.icon}</span>}
                <span className="ar-tab-label">{t.label}</span>
                {!!t.count && t.count > 0 && (
                  <span className={cx('ar-tab-count', t.countTone === 'neutral' && 'ar-tab-count--neutral')}>
                    {t.count}{t.countTone !== 'neutral' && <span className="ar-visually-hidden"> {countLabel}</span>}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
      {hasPanels && items.map((t, i) => (keepMounted || i === cur) && (
        <TabPanel key={t.value} tabsId={base} value={t.value} hidden={i !== cur}>{t.content}</TabPanel>
      ))}
    </div>
  );
}

export interface TabPanelProps extends HTMLAttributes<HTMLDivElement> {
  /** The Tabs `id`. */
  tabsId: string;
  value: string;
}
/** The panel for one tab. Rendered by Tabs from `items[].content`, or by the page with the same `tabsId`. */
export function TabPanel({ tabsId, value, className, ...rest }: TabPanelProps) {
  return <div role="tabpanel" id={`${tabsId}-panel-${value}`} aria-labelledby={`${tabsId}-tab-${value}`} tabIndex={0} className={cx('ar-tabpanel', className)} {...rest} />;
}
