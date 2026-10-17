import { type ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";
import {Panel, Rows, Row} from "./library.js";
import {Button} from "./ui.js";
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
  items: { id: string; label: string; description?: ReactNode; leading?: ReactNode; trailing?: ReactNode; onOpen?: () => void }[];
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
  const inlineMeta = typeof meta === "string" || typeof meta === "number";
  return (
    <Panel className="ct-collection-group" contentInset="flush" aria-label={title}
      title={<span className="ct-collection-title">{title}{count !== undefined && <span className="ct-collection-count" aria-label={`${count} items`}>{count}</span>}</span>}
      description={inlineMeta ? meta : undefined}
      action={onOpen && <Button variant="quiet" onClick={onOpen}>View all <ArrowUpRight size={13}/></Button>}>
      {!inlineMeta && meta && <div className="ct-collection-meta">{meta}</div>}
      <Rows>{items.map(item => <Row key={item.id} title={item.label} description={item.description} leading={item.leading} trailing={item.trailing} onClick={item.onOpen}/>)}</Rows>
      {!!more && onOpen && <div className="ct-collection-footer"><Button variant="quiet" onClick={onOpen}>View {more} more</Button></div>}
    </Panel>
  );
}
