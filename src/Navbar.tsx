import type { AnchorHTMLAttributes, HTMLAttributes, ReactNode } from 'react';

/** A flex row, nothing more prescriptive — any element can go inside it.
 * Compose with NavbarBrand and NavbarSpacer, or skip both and just put
 * whatever you need directly as children. */
export function Navbar({ className = '', ...rest }: HTMLAttributes<HTMLElement>) {
  return <header className={['arlab-navbar', className].filter(Boolean).join(' ')} {...rest} />;
}

export interface NavbarBrandProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  logo?: ReactNode;
  name: string;
  /** The small accent pulse next to the name — an ambient "this is live" signal, not a status indicator. Off by default; turn on deliberately. */
  dot?: boolean;
}

/** The one opinionated piece: logo + name, consistently spaced and sized.
 * Renders as a link when href is given, otherwise a plain non-interactive lockup. */
export function NavbarBrand({ logo, name, dot = false, href, className = '', ...rest }: NavbarBrandProps) {
  const cls = ['arlab-navbar-brand', className].filter(Boolean).join(' ');
  const inner = (
    <>
      {logo ? <span className="arlab-navbar-logo">{logo}</span> : null}
      {dot ? <span className="arlab-navbar-dot" aria-hidden="true" /> : null}
      <span className="arlab-navbar-name">{name}</span>
    </>
  );
  if (href) {
    return (
      <a href={href} className={cls} {...rest}>
        {inner}
      </a>
    );
  }
  return <div className={cls}>{inner}</div>;
}

/** Push everything after it to the right. Place none, one, or more of
 * these among your children to control grouping. */
export function NavbarSpacer() {
  return <div className="arlab-navbar-spacer" />;
}

export interface NavbarLinkOption {
  value: string;
  label: string;
}

export interface NavbarLinksProps {
  options: NavbarLinkOption[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

/** Primary app navigation, directly in the bar. Reach for this for a
 * top-level section switcher (Agents / Orchestrate / Admin, say) —
 * SegmentedControl is for a small, secondary view toggle and looks like
 * an isolated widget if you use it for whole-app navigation instead. */
export function NavbarLinks({ options, value, onChange, className = '' }: NavbarLinksProps) {
  return (
    <nav className={['arlab-navbar-links', className].filter(Boolean).join(' ')}>
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          className="arlab-navbar-link"
          aria-current={opt.value === value ? 'true' : undefined}
          onClick={() => onChange(opt.value)}
        >
          {opt.label}
        </button>
      ))}
    </nav>
  );
}
