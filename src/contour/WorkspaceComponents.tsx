import { type ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";
export interface SectionHeaderProps {
  title: string;
  count?: number;
  action?: ReactNode;
}
export function SectionHeader({ title, count, action }: SectionHeaderProps) {
  return (
    <header className="ct-section-header">
      <h2>{title}</h2>
      {count !== undefined && <span>{count}</span>}
      {action && <div>{action}</div>}
    </header>
  );
}
export interface CollectionGroupProps {
  title: string;
  count?: number;
  meta?: ReactNode;
  items: { id: string; label: string; onOpen: () => void }[];
  onOpen?: () => void;
  more?: number;
}
export function CollectionGroup({
  title,
  count,
  meta,
  items,
  onOpen,
  more,
}: CollectionGroupProps) {
  return (
    <section className="ct-collection-group">
      <header>
        <h3>{title}</h3>
        {count !== undefined && <span>{count}</span>}
        {onOpen && (
          <button type="button" className="ct-collection-open" onClick={onOpen}>
            View all <ArrowUpRight size={13} />
          </button>
        )}
      </header>
      {meta && <div className="ct-collection-meta">{meta}</div>}
      <ul>
        {items.map((item) => (
          <li key={item.id}>
            <button type="button" onClick={item.onOpen}>
              <span>{item.label}</span>
              <ArrowUpRight size={13} />
            </button>
          </li>
        ))}
      </ul>
      {!!more && onOpen && (
        <button type="button" className="ct-collection-more" onClick={onOpen}>
          View {more} more
        </button>
      )}
    </section>
  );
}
