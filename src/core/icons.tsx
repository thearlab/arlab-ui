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
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        {...props}
        className={['ar-icon', className].filter(Boolean).join(' ')}
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
// ---- v2 additions (same recipe: 24 grid, 1.8 stroke, round caps) ----
export const ChevronUpIcon = icon('ChevronUpIcon', <path d="M6 15l6-6 6 6" />);
export const ArrowLeftIcon = icon('ArrowLeftIcon', <path d="M19 12H5M11 6l-6 6 6 6" />);
export const ArrowUpIcon = icon('ArrowUpIcon', <path d="M12 19V5M6 11l6-6 6 6" />);
export const ArrowDownIcon = icon('ArrowDownIcon', <path d="M12 5v14M6 13l6 6 6-6" />);
export const SortIcon = icon('SortIcon', <path d="M8 9l4-4 4 4M8 15l4 4 4-4" />);
export const HomeIcon = icon('HomeIcon', <path d="M4 11l8-7 8 7v8a1 1 0 0 1-1 1h-4v-6h-6v6H5a1 1 0 0 1-1-1z" />);
export const FolderIcon = icon('FolderIcon', <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />);
export const ChatIcon = icon('ChatIcon', <path d="M4 5h16v11H8l-4 4z" />);
export const SparkIcon = icon('SparkIcon', <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z" />);
export const ChartIcon = icon('ChartIcon', <><rect x="4" y="4" width="16" height="16" rx="3" /><path d="M8 15v-3M12 15V9M16 15v-5" /></>);
export const GlobeIcon = icon('GlobeIcon', <><circle cx="12" cy="12" r="8.5" /><path d="M3.5 12h17M12 3.5c2.5 2.6 2.5 14.4 0 17M12 3.5c-2.5 2.6-2.5 14.4 0 17" /></>);
export const HelpIcon = icon('HelpIcon', <><circle cx="12" cy="12" r="8.5" /><path d="M9.7 9.5a2.4 2.4 0 1 1 3.3 2.2c-.7.3-1 .8-1 1.5v.6" /><path d="M12 16.6v.01" /></>);
export const CalendarIcon = icon('CalendarIcon', <><rect x="4" y="5" width="16" height="15" rx="2.5" /><path d="M4 10h16M9 3v4M15 3v4" /></>);
export const ClockIcon = icon('ClockIcon', <><circle cx="12" cy="12" r="8.5" /><path d="M12 7.5V12l3 2" /></>);
export const TimerIcon = icon('TimerIcon', <><circle cx="12" cy="13" r="7" /><path d="M12 9v4l2.5 2M10 3h4" /></>);
export const FilterIcon = icon('FilterIcon', <path d="M4 5h16l-6 7.5V19l-4 1.5v-8z" />);
export const EditIcon = icon('EditIcon', <path d="M4 20h4L19 9l-4-4L4 16zM13.5 6.5l4 4" />);
export const GripIcon = icon('GripIcon', <path d="M9 6h.01M9 12h.01M9 18h.01M15 6h.01M15 12h.01M15 18h.01" strokeWidth={2.6} />);
export const MoreVerticalIcon = icon('MoreVerticalIcon', <path d="M12 5h.01M12 12h.01M12 19h.01" strokeWidth={2.6} />);
export const BellIcon = icon('BellIcon', <path d="M6 16V11a6 6 0 1 1 12 0v5l1.5 2h-15zM10 20.5a2 2 0 0 0 4 0" />);
export const StarIcon = icon('StarIcon', <path d="M12 4l2.4 5 5.4.6-4 3.7 1.1 5.4L12 16l-4.9 2.7 1.1-5.4-4-3.7 5.4-.6z" />);
export const CheckCircleIcon = icon('CheckCircleIcon', <><circle cx="12" cy="12" r="8.5" /><path d="M8.5 12.5l2.5 2.5 4.5-5" /></>);
export const XCircleIcon = icon('XCircleIcon', <><circle cx="12" cy="12" r="8.5" /><path d="M9.5 9.5l5 5M14.5 9.5l-5 5" /></>);
export const MinusIcon = icon('MinusIcon', <path d="M5 12h14" />);
export const FileIcon = icon('FileIcon', <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8zM14 3v5h5" />);
export const ImageIcon = icon('ImageIcon', <><rect x="3.5" y="4.5" width="17" height="15" rx="2.5" /><circle cx="9" cy="10" r="1.6" /><path d="M20 16l-4.5-4.5L7 20" /></>);
export const DownloadIcon = icon('DownloadIcon', <path d="M12 4v11M7 10l5 5 5-5M5 20h14" />);
export const LinkIcon = icon('LinkIcon', <path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1" />);
export const EyeIcon = icon('EyeIcon', <><path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z" /><circle cx="12" cy="12" r="3" /></>);
export const LockIcon = icon('LockIcon', <><rect x="5" y="10.5" width="14" height="10" rx="2.5" /><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" /></>);
export const LogoutIcon = icon('LogoutIcon', <path d="M10 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h4M15 8l4 4-4 4M19 12H9" />);
export const MonitorIcon = icon('MonitorIcon', <><rect x="3" y="4.5" width="18" height="12" rx="2.5" /><path d="M9 20h6M12 16.5V20" /></>);
export const UndoIcon = icon('UndoIcon', <path d="M9 7L4 12l5 5M4 12h11a5 5 0 0 1 0 10h-2" />);
export const SidebarIcon = icon('SidebarIcon', <><rect x="3.5" y="4.5" width="17" height="15" rx="2.5" /><path d="M9.5 4.5v15" /></>);
export const PanelRightIcon = icon('PanelRightIcon', <><rect x="3.5" y="4.5" width="17" height="15" rx="2.5" /><path d="M14.5 4.5v15" /></>);
export const CodeIcon = icon('CodeIcon', <path d="M8 7l-5 5 5 5M16 7l5 5-5 5" />);
export const DotIcon = icon('DotIcon', <circle cx="12" cy="12" r="3.5" fill="currentColor" stroke="none" />);
export const PaletteIcon = icon('PaletteIcon', <><path d="M12 3a9 9 0 1 0 0 18c1.1 0 1.6-.8 1.6-1.6 0-.9-.7-1.4-.7-2.3 0-.9.7-1.5 1.6-1.5H17a4 4 0 0 0 4-4C21 6.9 17 3 12 3z" /><path d="M7.5 11.5h.01M10 7.5h.01M15 7.5h.01" strokeWidth={2.6} /></>);
