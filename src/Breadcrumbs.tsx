import { Fragment } from 'react';
import { ChevronRightIcon } from './icons';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  onNavigate?: (item: BreadcrumbItem) => void;
}

/** Sentence case, not the mono-uppercase trail arlab-docs had duplicated
 * across two files — same information, without the developer-tool voice. */
export function Breadcrumbs({ items, onNavigate }: BreadcrumbsProps) {
  return (
    <nav className="arlab-breadcrumbs" aria-label="Breadcrumb">
      {items.map((item, i) => {
        const isLast = i === items.length - 1;
        return (
          <Fragment key={i}>
            {i > 0 ? <ChevronRightIcon size={12} className="sep" /> : null}
            {isLast || !item.href ? (
              <span className={isLast ? 'current' : undefined} aria-current={isLast ? 'page' : undefined}>
                {item.label}
              </span>
            ) : (
              <a
                href={item.href}
                onClick={(e) => {
                  if (onNavigate) {
                    e.preventDefault();
                    onNavigate(item);
                  }
                }}
              >
                {item.label}
              </a>
            )}
          </Fragment>
        );
      })}
    </nav>
  );
}
