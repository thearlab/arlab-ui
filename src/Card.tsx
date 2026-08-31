import type { CSSProperties, HTMLAttributes, ReactNode } from 'react';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** Adds hover lift + focus ring for a card that's itself clickable. */
  interactive?: boolean;
  /** A colored left-edge rail (arlab-docs' DepartmentCard pattern) — pass a color, or `true` to use the accent. */
  rail?: string | boolean;
  /** A top accent bar that reveals on hover/focus (arlab-docs' EntityCard pattern). Combine with `rail` to match its color. */
  accentHover?: boolean;
}

export function Card({ interactive = false, rail, accentHover = false, className = '', style, ...rest }: CardProps) {
  const cls = ['arlab-card', interactive ? 'interactive' : '', rail ? 'rail' : '', accentHover ? 'accent-hover' : '', className]
    .filter(Boolean)
    .join(' ');
  const railStyle = typeof rail === 'string' ? { '--card-rail': rail } : undefined;
  return <div className={cls} style={{ ...railStyle, ...style } as CSSProperties} tabIndex={interactive ? 0 : undefined} {...rest} />;
}

export interface CardHeaderProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  title: ReactNode;
  meta?: ReactNode;
  /** Status/action slot, right-aligned against the title — a badge, a menu button, a timestamp. */
  trailing?: ReactNode;
}

/** Title (+ optional meta line) on the left, a status or action on the
 * right. Matches how a resource card usually reads: identity first, state
 * second, never competing for the same visual weight. */
export function CardHeader({ title, meta, trailing, className = '', ...rest }: CardHeaderProps) {
  return (
    <div className={['arlab-card-header', className].filter(Boolean).join(' ')} {...rest}>
      <div className="arlab-card-header-main">
        <h3 className="arlab-card-title">{title}</h3>
        {meta ? <div className="arlab-card-description">{meta}</div> : null}
      </div>
      {trailing ? <div>{trailing}</div> : null}
    </div>
  );
}

export function CardTitle({ className = '', ...rest }: HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={['arlab-card-title', className].filter(Boolean).join(' ')} {...rest} />;
}

export function CardDescription({ className = '', ...rest }: HTMLAttributes<HTMLParagraphElement>) {
  return <p className={['arlab-card-description', className].filter(Boolean).join(' ')} {...rest} />;
}

export function CardBody({ className = '', ...rest }: HTMLAttributes<HTMLDivElement>) {
  return <div className={['arlab-card-body', className].filter(Boolean).join(' ')} {...rest} />;
}

export function CardFooter({ className = '', ...rest }: HTMLAttributes<HTMLDivElement>) {
  return <div className={['arlab-card-footer', className].filter(Boolean).join(' ')} {...rest} />;
}
