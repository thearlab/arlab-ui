import type { HTMLAttributes, ReactNode } from 'react';

export function ArlabList({ className = '', ...rest }: HTMLAttributes<HTMLDivElement>) {
  return <div className={['arlab-list', className].filter(Boolean).join(' ')} {...rest} />;
}

export interface RowProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  title: ReactNode;
  meta?: ReactNode;
  trailing?: ReactNode;
}

/** A divided list row. Use in place of a one-off bordered card for anything
 * that is a list item, not an independent object (see arlab-ui README). */
export function Row({ title, meta, trailing, className = '', ...rest }: RowProps) {
  return (
    <div className={['arlab-row', className].filter(Boolean).join(' ')} {...rest}>
      <div>
        <div className="arlab-row-title">{title}</div>
        {meta ? <div className="arlab-row-meta">{meta}</div> : null}
      </div>
      {trailing ? <div>{trailing}</div> : null}
    </div>
  );
}
