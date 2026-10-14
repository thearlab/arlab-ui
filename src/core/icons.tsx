'use client';

import type { ReactNode, SVGProps } from 'react';

export interface IconProps extends SVGProps<SVGSVGElement> {
  size?: number;
}

/* One shared geometry for every icon: 24x24 canvas, 1.6 stroke, round
 * caps/joins. 1.6 rather than the more common 1.75-2 — a hair thinner
 * reads more confident/precise at small sizes instead of slightly
 * cartoonish, the same call Linear/Arc-style tool UIs make. Keeping every
 * icon on this single recipe is what makes a hand-drawn set read as "one
 * family" instead of a grab-bag. */
function icon(displayName: string, children: ReactNode) {
  function Cmp({ size = 18, className = '', ...props }: IconProps) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        {...props}
        className={['arlab-icon', className].filter(Boolean).join(' ')}
      >
        {children}
      </svg>
    );
  }
  Cmp.displayName = displayName;
  return Cmp;
}

export const ChevronDownIcon = icon('ChevronDownIcon', <path d="M6 9l6 6 6-6" />);
export const ChevronRightIcon = icon('ChevronRightIcon', <path d="M9 6l6 6-6 6" />);
export const ChevronLeftIcon = icon('ChevronLeftIcon', <path d="M15 6l-6 6 6 6" />);

export const CloseIcon = icon('CloseIcon', <path d="M6 6l12 12M18 6L6 18" />);

export const SearchIcon = icon(
  'SearchIcon',
  <>
    <circle cx="11" cy="11" r="7" />
    <path d="M21 21l-4.3-4.3" />
  </>,
);

export const CheckIcon = icon('CheckIcon', <path d="M5 13l4 4L19 7" />);

export const PlusIcon = icon('PlusIcon', <path d="M12 5v14M5 12h14" />);

export const TrashIcon = icon(
  'TrashIcon',
  <>
    <path d="M4 7h16" />
    <path d="M9 7V4.8C9 4.36 9.36 4 9.8 4h4.4c.44 0 .8.36.8.8V7" />
    <path d="M6.5 7l.7 12.1c.05.9.8 1.9 1.8 1.9h6c1 0 1.75-1 1.8-1.9L18.5 7" />
    <path d="M10 11v6M14 11v6" />
  </>,
);

export const ExternalLinkIcon = icon(
  'ExternalLinkIcon',
  <>
    <path d="M14 5h5v5" />
    <path d="M19 5l-8.5 8.5" />
    <path d="M11 5H7a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-4" />
  </>,
);

export const CopyIcon = icon(
  'CopyIcon',
  <>
    <rect x="8" y="8" width="12" height="12" rx="2.2" />
    <path d="M6 16h-.5A1.5 1.5 0 0 1 4 14.5v-9A1.5 1.5 0 0 1 5.5 4h9A1.5 1.5 0 0 1 16 5.5V6" />
  </>,
);

export const KeyIcon = icon(
  'KeyIcon',
  <>
    <circle cx="7.5" cy="15.5" r="3.5" />
    <path d="M10.5 12.5L20 3" />
    <path d="M16.5 6.5l3 3" />
    <path d="M14 9l2 2" />
  </>,
);

export const UserIcon = icon(
  'UserIcon',
  <>
    <circle cx="12" cy="8" r="3.5" />
    <path d="M5 20c0-3.9 3.1-7 7-7s7 3.1 7 7" />
  </>,
);

export const UsersIcon = icon(
  'UsersIcon',
  <>
    <circle cx="9" cy="8" r="3.2" />
    <path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" />
    <circle cx="17" cy="8.5" r="2.6" />
    <path d="M15.5 14.2c2.7.4 4.8 2.7 4.8 5.8" />
  </>,
);

/* "Adjustments" glyph in place of a gear — reads cleaner at 16-18px and
 * is the convention several premium tools use for settings. */
export const SettingsIcon = icon(
  'SettingsIcon',
  <>
    <line x1="4" y1="7" x2="20" y2="7" />
    <circle cx="9" cy="7" r="2" />
    <line x1="4" y1="12" x2="20" y2="12" />
    <circle cx="16" cy="12" r="2" />
    <line x1="4" y1="17" x2="20" y2="17" />
    <circle cx="10" cy="17" r="2" />
  </>,
);

export const MoreHorizontalIcon = icon(
  'MoreHorizontalIcon',
  <>
    <circle cx="5" cy="12" r="1.4" fill="currentColor" stroke="none" />
    <circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none" />
    <circle cx="19" cy="12" r="1.4" fill="currentColor" stroke="none" />
  </>,
);

export const RefreshIcon = icon(
  'RefreshIcon',
  <>
    <path d="M20 11A8 8 0 1 0 18 16.3" />
    <path d="M20 5.5V11h-5.5" />
  </>,
);

export const ArrowRightIcon = icon(
  'ArrowRightIcon',
  <>
    <path d="M5 12h14" />
    <path d="M13 6l6 6-6 6" />
  </>,
);

export const AlertTriangleIcon = icon(
  'AlertTriangleIcon',
  <>
    <path d="M12 3.5l9.5 16.5H2.5L12 3.5z" strokeLinejoin="round" />
    <line x1="12" y1="9.5" x2="12" y2="14" />
    <circle cx="12" cy="17" r="0.9" fill="currentColor" stroke="none" />
  </>,
);

export const InfoCircleIcon = icon(
  'InfoCircleIcon',
  <>
    <circle cx="12" cy="12" r="9" />
    <line x1="12" y1="11" x2="12" y2="16.5" />
    <circle cx="12" cy="7.8" r="0.9" fill="currentColor" stroke="none" />
  </>,
);

export const SunIcon = icon(
  'SunIcon',
  <>
    <circle cx="12" cy="12" r="4.2" />
    <g strokeLinecap="round">
      <line x1="12" y1="2.5" x2="12" y2="4.8" />
      <line x1="12" y1="19.2" x2="12" y2="21.5" />
      <line x1="2.5" y1="12" x2="4.8" y2="12" />
      <line x1="19.2" y1="12" x2="21.5" y2="12" />
      <line x1="5.3" y1="5.3" x2="6.9" y2="6.9" />
      <line x1="17.1" y1="17.1" x2="18.7" y2="18.7" />
      <line x1="5.3" y1="18.7" x2="6.9" y2="17.1" />
      <line x1="17.1" y1="6.9" x2="18.7" y2="5.3" />
    </g>
  </>,
);

export const MoonIcon = icon('MoonIcon', <path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5z" strokeLinejoin="round" />);

export const UploadIcon = icon(
  'UploadIcon',
  <>
    <path d="M12 16V4" />
    <path d="M7 9l5-5 5 5" />
    <path d="M4 16v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3" />
  </>,
);

export const MenuIcon = icon(
  'MenuIcon',
  <>
    <path d="M4 7h16" />
    <path d="M4 12h16" />
    <path d="M4 17h16" />
  </>,
);