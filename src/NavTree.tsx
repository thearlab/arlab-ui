'use client';

import { useEffect, useState } from 'react';
import { ChevronRightIcon } from './icons';

export interface NavTreeItem {
  id: string;
  label: string;
  href?: string;
  children?: NavTreeItem[];
}

export interface NavTreeProps {
  items: NavTreeItem[];
  activeId?: string;
  onNavigate: (item: NavTreeItem) => void;
}

function findPath(items: NavTreeItem[], id: string, trail: string[] = []): string[] | null {
  for (const item of items) {
    if (item.id === id) return trail;
    if (item.children) {
      const found = findPath(item.children, id, [...trail, item.id]);
      if (found) return found;
    }
  }
  return null;
}

/** A collapsible, nested nav — arlab-docs' Sidebar had this but hand-rolled
 * per-instance. Auto-expands the branch containing activeId, same as that
 * original. Route-awareness (matching activeId) is the caller's job: pass
 * whatever id scheme your routing uses. */
export function NavTree({ items, activeId, onNavigate }: NavTreeProps) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!activeId) return;
    const path = findPath(items, activeId);
    if (path?.length) setExpanded((prev) => new Set([...prev, ...path]));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeId]);

  function toggle(id: string) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function renderNode(item: NavTreeItem) {
    const hasChildren = !!item.children?.length;
    const isOpen = expanded.has(item.id);
    return (
      <div className="arlab-navtree-node" key={item.id}>
        <div className="arlab-navtree-row">
          {hasChildren ? (
            <button
              type="button"
              className={['arlab-navtree-toggle', isOpen ? 'open' : ''].filter(Boolean).join(' ')}
              onClick={() => toggle(item.id)}
              aria-label={isOpen ? `Collapse ${item.label}` : `Expand ${item.label}`}
              aria-expanded={isOpen}
            >
              <ChevronRightIcon size={13} />
            </button>
          ) : (
            <span style={{ width: 20, flexShrink: 0 }} />
          )}
          <a
            href={item.href ?? '#'}
            className={['arlab-navtree-link', item.id === activeId ? 'active' : ''].filter(Boolean).join(' ')}
            onClick={(e) => {
              e.preventDefault();
              onNavigate(item);
            }}
          >
            {item.label}
          </a>
        </div>
        {hasChildren && isOpen ? <div className="arlab-navtree-children">{item.children!.map(renderNode)}</div> : null}
      </div>
    );
  }

  return <nav className="arlab-navtree">{items.map(renderNode)}</nav>;
}