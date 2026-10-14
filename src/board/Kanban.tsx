'use client';
import { useEffect, useId, useMemo, useRef, useState, type ReactNode } from 'react';
import { IconButton } from '../core/IconButton';
import { ChevronLeftIcon, ChevronRightIcon, PlusIcon } from '../core/icons';
import { cx } from '../lib/cx';
import { hueIndex, initials } from '../lib/format';
import { dropIndex, findCard, keyboardTarget, moveCard, spotText, type Columns, type Spot } from '../lib/kanban';

export interface KanbanColumnDef {
  id: string;
  title: string;
  /** A small square of colour before the title. A CSS colour or token. */
  swatch?: string;
  /** Work-in-progress limit: the count turns amber and says so when it is over. */
  limit?: number;
  /** Start collapsed (the person can expand it). */
  collapsed?: boolean;
}

export interface KanbanCardState { dragging: boolean; lifted: boolean }

export interface KanbanProps<T> {
  /** Names the board for screen readers ("Ongoing projects"). */
  label: string;
  columns: KanbanColumnDef[];
  /** Cards by column id, in order. Controlled: apply `onMove` to update. */
  items: Columns<T>;
  getId: (item: T) => string;
  /** Plain text for announcements ("Picked up <label>"). */
  getLabel: (item: T) => string;
  renderCard: (item: T, state: KanbanCardState) => ReactNode;
  /** A card moved (pointer or keyboard). `toIndex` is its index in the destination column. */
  onMove?: (itemId: string, toColumn: string, toIndex: number) => void;
  /** A click, or Enter, on a card. Without it, Enter also picks the card up. */
  onOpen?: (item: T) => void;
  /** Shows a + button in each column header. */
  onAdd?: (columnId: string) => void;
  /** Text in an empty column. */
  emptyLabel?: ReactNode;
  className?: string;
}

type Drag = { id: string; mode: 'pointer' | 'keyboard'; origin: Spot; spot: Spot; height: number };

const HINT = 'Press Space to pick up the card, arrow keys to move it, Space to drop it, Escape to cancel.';

/** Work moving through stages. Cards move by pointer (mouse, pen, or a long press on touch) or by
 * keyboard (Space picks up, arrows move within and across columns, Space drops, Esc cancels), and every
 * move is announced. The board scrolls sideways on its own; the page never does. */
export function Kanban<T>({ label, columns, items, getId, getLabel, renderCard, onMove, onOpen, onAdd, emptyLabel = 'Nothing here yet', className }: KanbanProps<T>) {
  const uid = useId();
  const [collapsed, setCollapsed] = useState<Set<string>>(() => new Set(columns.filter((c) => c.collapsed).map((c) => c.id)));
  const [drag, setDrag] = useState<Drag | null>(null);
  const [say, setSay] = useState('');
  const board = useRef<HTMLDivElement>(null);
  const ghost = useRef<HTMLDivElement>(null);
  const dragRef = useRef<Drag | null>(null); dragRef.current = drag;
  const live = useRef({ items, onMove, getId, getLabel, columns }); live.current = { items, onMove, getId, getLabel, columns };

  const order = columns.filter((c) => !collapsed.has(c.id)).map((c) => c.id);
  const titleOf = (col: string) => columns.find((c) => c.id === col)?.title ?? col;
  const itemOf = (id: string) => { const s = findCard(items, id, getId); return s ? items[s.column][s.index] : undefined; };
  const announce = (t: string) => setSay((p) => (p === t ? t + ' ' : t));

  // While a card is lifted by keyboard, the board shows it at its new spot.
  const shown = useMemo(() => (drag?.mode === 'keyboard' ? moveCard(items, drag.id, drag.spot.column, drag.spot.index, getId) : items), [items, drag, getId]);

  // Keep focus on the lifted card as it changes column (it remounts in the new list).
  useEffect(() => {
    if (drag?.mode !== 'keyboard') return;
    board.current?.querySelector<HTMLElement>(`[data-kanban-card="${CSS.escape(drag.id)}"]`)?.focus({ preventScroll: false });
  }, [drag]);

  const finish = (d: Drag, drop: boolean) => {
    const it = itemOf(d.id); const name = it ? getLabel(it) : 'card';
    setDrag(null);
    const moved = drop && (d.spot.column !== d.origin.column || d.spot.index !== d.origin.index);
    if (moved) onMove?.(d.id, d.spot.column, d.spot.index);
    const count = moveCard(items, d.id, d.spot.column, d.spot.index, getId)[d.spot.column]?.length ?? 0;
    announce(drop ? `Dropped ${name}. ${spotText(titleOf(d.spot.column), d.spot.index, count)}` : `Cancelled. ${name} is back in column ${titleOf(d.origin.column)}.`);
  };

  // ---- keyboard ----
  const onCardKey = (e: React.KeyboardEvent, item: T) => {
    if (e.target !== e.currentTarget) return; // keys inside the card's own buttons stay theirs
    const id = getId(item);
    if (!drag) {
      if (e.key === 'Enter' && onOpen) { e.preventDefault(); onOpen(item); return; }
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        const at = findCard(items, id, getId)!;
        setDrag({ id, mode: 'keyboard', origin: at, spot: at, height: 0 });
        announce(`Picked up ${getLabel(item)}. ${spotText(titleOf(at.column), at.index, items[at.column].length)} ${HINT}`);
      }
      return;
    }
    if (drag.mode !== 'keyboard' || drag.id !== id) return;
    if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); finish(drag, true); return; }
    if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); finish(drag, false); return; }
    if (e.key === 'Tab') { finish(drag, false); return; }
    const rtl = getComputedStyle(e.currentTarget).direction === 'rtl';
    const to = keyboardTarget(shown, order, drag.spot, e.key, rtl);
    if (!to) { if (/^Arrow|Home|End/.test(e.key)) e.preventDefault(); return; }
    e.preventDefault();
    setDrag({ ...drag, spot: to });
    const n = to.column === drag.spot.column ? shown[to.column].length : shown[to.column].length + 1;
    announce(spotText(titleOf(to.column), to.index, n));
  };

  // ---- pointer ----
  const onPointerDown = (e: React.PointerEvent<HTMLElement>, item: T) => {
    if (e.button !== 0 || drag || !onMove) return;
    if ((e.target as HTMLElement).closest('button, a, input, textarea, select')) return; // the card's own controls keep their clicks
    const el = e.currentTarget, rect = el.getBoundingClientRect();
    const id = getId(item), origin = findCard(items, id, getId)!;
    const sx = e.clientX, sy = e.clientY, ox = sx - rect.left, oy = sy - rect.top;
    const touch = e.pointerType === 'touch';
    let started = false, timer = 0, raf = 0, px = sx, py = sy;
    const noScroll = (ev: TouchEvent) => { if (started) ev.preventDefault(); };

    const begin = () => {
      started = true;
      const d: Drag = { id, mode: 'pointer', origin, spot: origin, height: rect.height };
      setDrag(d);
      announce(`Picked up ${getLabel(item)}.`);
      window.addEventListener('touchmove', noScroll, { passive: false });
      requestAnimationFrame(() => { if (ghost.current) { ghost.current.style.width = `${rect.width}px`; place(); } });
      raf = requestAnimationFrame(tick);
    };
    const place = () => { if (ghost.current) ghost.current.style.transform = `translate(${px - ox}px, ${py - oy}px) rotate(1.5deg)`; };
    const target = () => {
      const under = document.elementFromPoint(px, py) as HTMLElement | null;
      const col = under?.closest<HTMLElement>('[data-kanban-col]');
      if (!col || col.dataset.collapsed) return;
      const cards = [...col.querySelectorAll<HTMLElement>('[data-kanban-card]')];
      const spot = { column: col.dataset.kanbanCol!, index: dropIndex(cards.map((c) => { const r = c.getBoundingClientRect(); return r.top + r.height / 2; }), py) };
      const cur = dragRef.current;
      if (cur && (cur.spot.column !== spot.column || cur.spot.index !== spot.index)) setDrag({ ...cur, spot });
    };
    // Auto-scroll: the board sideways near its edges, the column list or the page near the top and bottom.
    const tick = () => {
      const b = board.current;
      if (b) {
        const r = b.getBoundingClientRect(), edge = 56;
        if (px < r.left + edge) b.scrollLeft -= Math.ceil((r.left + edge - px) / 4);
        else if (px > r.right - edge) b.scrollLeft += Math.ceil((px - r.right + edge) / 4);
        const list = (document.elementFromPoint(px, py) as HTMLElement | null)?.closest<HTMLElement>('.ar-kanban-list');
        const scroller = list && list.scrollHeight > list.clientHeight ? list : null;
        const top = scroller ? scroller.getBoundingClientRect().top : 0, bottom = scroller ? scroller.getBoundingClientRect().bottom : window.innerHeight;
        const dy = py < top + edge ? -Math.ceil((top + edge - py) / 4) : py > bottom - edge ? Math.ceil((py - bottom + edge) / 4) : 0;
        if (dy) { if (scroller) scroller.scrollTop += dy; else window.scrollBy(0, dy); }
      }
      target();
      raf = requestAnimationFrame(tick);
    };
    const move = (ev: PointerEvent) => {
      px = ev.clientX; py = ev.clientY;
      const far = Math.hypot(px - sx, py - sy);
      if (!started) {
        if (touch) { if (far > 8) cleanup(); return; }   // a swipe is a scroll, not a drag
        if (far > 5) begin(); else return;
      }
      place();
    };
    const up = () => {
      const d = dragRef.current;
      if (started && d) {
        finish(d, true);
        // The click that follows a drag must not open the card.
        const eat = (ce: MouseEvent) => { ce.stopPropagation(); ce.preventDefault(); };
        window.addEventListener('click', eat, { capture: true, once: true });
        setTimeout(() => window.removeEventListener('click', eat, true), 0);
      }
      cleanup();
    };
    const cancel = () => { const d = dragRef.current; if (started && d) finish(d, false); cleanup(); };
    const key = (ev: KeyboardEvent) => { if (ev.key === 'Escape') { ev.preventDefault(); cancel(); } };
    const cleanup = () => {
      clearTimeout(timer); cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      window.removeEventListener('pointercancel', cancel);
      window.removeEventListener('keydown', key, true);
      window.removeEventListener('touchmove', noScroll);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
    window.addEventListener('pointercancel', cancel);
    window.addEventListener('keydown', key, true);
    if (touch) timer = window.setTimeout(begin, 280);
  };

  const ghostItem = drag?.mode === 'pointer' ? itemOf(drag.id) : undefined;
  const template = columns.map((c) => (collapsed.has(c.id) ? '52px' : 'minmax(260px, 1fr)')).join(' ');
  const templatePhone = columns.map((c) => (collapsed.has(c.id) ? '52px' : '82%')).join(' ');

  return (
    <div className={cx('ar-kanban', className)} data-dragging={drag?.mode === 'pointer' || undefined}>
      <div ref={board} className="ar-kanban-board ar-scroll-x" role="region" aria-label={label} tabIndex={-1}
        style={{ ['--ar-kb-cols' as string]: template, ['--ar-kb-cols-phone' as string]: templatePhone }}>
        {columns.map((c) => {
          const isCollapsed = collapsed.has(c.id);
          const list = shown[c.id] ?? [];
          const visible = drag?.mode === 'pointer' ? list.filter((x) => getId(x) !== drag.id) : list;
          const count = (items[c.id] ?? []).length;
          const over = c.limit !== undefined && count > c.limit;
          const headId = `${uid}-${c.id}`;
          const toggle = () => setCollapsed((s) => { const n = new Set(s); if (n.has(c.id)) n.delete(c.id); else n.add(c.id); return n; });
          const countPill = (
            <span className={cx('ar-kanban-count', over && 'is-over')}>
              {c.limit !== undefined ? `${count} / ${c.limit}` : count}
              {over && <span className="ar-visually-hidden">, over the limit of {c.limit}</span>}
            </span>
          );
          if (isCollapsed) {
            return (
              <section key={c.id} className="ar-kanban-col is-collapsed" data-kanban-col={c.id} data-collapsed="" aria-labelledby={headId}>
                <IconButton size="sm" label={`Expand ${c.title}`} onClick={toggle} aria-expanded={false}><ChevronRightIcon /></IconButton>
                <h3 id={headId} className="ar-kanban-vtitle">{c.title}</h3>
                {countPill}
              </section>
            );
          }
          const rows: ReactNode[] = visible.map((it) => {
            const id = getId(it);
            const lifted = drag?.mode === 'keyboard' && drag.id === id;
            return (
              <li key={id} data-kanban-card={id} tabIndex={0} aria-roledescription="draggable card" aria-describedby={`${uid}-hint`}
                className={cx('ar-kanban-item', lifted && 'is-lifted')}
                onKeyDown={(e) => onCardKey(e, it)}
                onBlur={(e) => { const d = dragRef.current; if (d?.mode === 'keyboard' && d.id === id && !e.currentTarget.contains(e.relatedTarget as Node) && e.relatedTarget) finish(d, false); }}
                onPointerDown={(e) => onPointerDown(e, it)}
                onClick={(e) => { if (onOpen && !(e.target as HTMLElement).closest('button, a, input')) onOpen(it); }}>
                {renderCard(it, { dragging: false, lifted })}
              </li>
            );
          });
          if (drag?.mode === 'pointer' && drag.spot.column === c.id) rows.splice(drag.spot.index, 0, <li key="__drop" className="ar-kanban-drop" style={{ height: drag.height }} aria-hidden="true" />);
          return (
            <section key={c.id} className="ar-kanban-col" data-kanban-col={c.id} aria-labelledby={headId}>
              <header className="ar-kanban-head">
                {c.swatch && <span className="ar-kanban-swatch" style={{ background: c.swatch }} aria-hidden="true" />}
                <h3 id={headId} className="ar-kanban-title">{c.title}</h3>
                {countPill}
                <span className="ar-kanban-head-end">
                  {onAdd && <IconButton size="sm" variant="secondary" label={`Add a card to ${c.title}`} onClick={() => onAdd(c.id)}><PlusIcon /></IconButton>}
                  <IconButton size="sm" label={`Collapse ${c.title}`} onClick={toggle} aria-expanded><ChevronLeftIcon /></IconButton>
                </span>
              </header>
              <ul className="ar-kanban-list" role="list" aria-labelledby={headId}>
                {rows}
                {!rows.length && <li className="ar-kanban-empty">{emptyLabel}</li>}
              </ul>
            </section>
          );
        })}
      </div>
      <p id={`${uid}-hint`} className="ar-visually-hidden">{onMove ? HINT : ''}</p>
      <div className="ar-visually-hidden" role="status" aria-live="polite">{say}</div>
      {ghostItem !== undefined && (
        <div ref={ghost} className="ar-kanban-ghost" aria-hidden="true">{renderCard(ghostItem, { dragging: true, lifted: false })}</div>
      )}
    </div>
  );
}

// ---- The default card anatomy (restyle): title, two lines, people, a hairline, tags and a date. ----
export type KanbanTagTone = 'neutral' | 'accent' | 'ok' | 'warn' | 'bad' | 'info';
export interface KanbanCardProps {
  title: ReactNode;
  /** Up to two lines of context; longer text is clamped. */
  text?: ReactNode;
  /** Names; shown as initials faces with the name. */
  people?: string[];
  tags?: { label: string; tone?: KanbanTagTone }[];
  /** A due date or time, at the end of the footer. */
  date?: ReactNode;
  /** An action at the top right (a menu button). */
  action?: ReactNode;
  className?: string;
}
export function KanbanCard({ title, text, people, tags, date, action, className }: KanbanCardProps) {
  return (
    <article className={cx('ar-kanban-card', className)}>
      <div className="ar-kanban-card-top"><h4>{title}</h4>{action}</div>
      {text && <p className="ar-kanban-card-text">{text}</p>}
      {!!people?.length && (
        <ul className="ar-kanban-people" role="list">
          {people.map((p) => <li key={p}><span className="ar-kanban-face" style={{ ['--_hue' as string]: `var(--hue-${hueIndex(p)})` }} aria-hidden="true">{initials(p)}</span>{p}</li>)}
        </ul>
      )}
      {(!!tags?.length || date) && (
        <div className="ar-kanban-foot">
          {tags?.map((t) => <span key={t.label} className="ar-kanban-tag" data-tone={t.tone ?? 'neutral'}>{t.label}</span>)}
          {date && <span className="ar-kanban-date">{date}</span>}
        </div>
      )}
    </article>
  );
}
