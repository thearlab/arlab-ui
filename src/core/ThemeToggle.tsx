'use client';
import { useEffect, useState } from 'react';
import { IconButton } from './IconButton';
import { MonitorIcon, MoonIcon, SunIcon } from './icons';
import { SegmentedControl } from './SegmentedControl';
import { getAccent, getResolvedTheme, getTheme, onThemeChange, setAccent, setTheme, type Accent, type Theme } from './theme';

function useThemeState() {
  const [s, setS] = useState(() => ({ theme: 'system' as Theme, resolved: 'light' as 'light' | 'dark', accent: 'magenta' as Accent }));
  useEffect(() => {
    const read = () => setS({ theme: getTheme(), resolved: getResolvedTheme(), accent: getAccent() });
    read(); return onThemeChange(read);
  }, []);
  return s;
}

export interface ThemeToggleProps {
  /** segmented: System, Light, Dark (for the account menu or settings). icon: one button that flips light and dark. */
  variant?: 'segmented' | 'icon';
  size?: 'sm' | 'md';
  /** Show words next to the icons in the segmented variant. */
  labels?: boolean;
  className?: string;
}

/** Light, dark or follow the system. The HIG puts the full choice in the account menu or settings. */
export function ThemeToggle({ variant = 'segmented', size = 'sm', labels = false, className }: ThemeToggleProps) {
  const { theme, resolved } = useThemeState();
  if (variant === 'icon') {
    const next = resolved === 'dark' ? 'light' : 'dark';
    return <IconButton className={className} size={size} label={`Switch to ${next} theme`} onClick={() => setTheme(next)}>{resolved === 'dark' ? <MoonIcon /> : <SunIcon />}</IconButton>;
  }
  return (
    <SegmentedControl<Theme> className={className} size={size} label="Theme" value={theme} onChange={setTheme} options={[
      { value: 'system', icon: <MonitorIcon size={16} />, label: labels ? 'System' : '', 'aria-label': labels ? undefined : 'Follow the system' },
      { value: 'light', icon: <SunIcon size={16} />, label: labels ? 'Light' : '', 'aria-label': labels ? undefined : 'Light' },
      { value: 'dark', icon: <MoonIcon size={16} />, label: labels ? 'Dark' : '', 'aria-label': labels ? undefined : 'Dark' },
    ]} />
  );
}

/** ARLAB magenta (the default) or violet. One accent per product; this is for previews and settings. */
export function AccentToggle({ size = 'sm', className }: { size?: 'sm' | 'md'; className?: string }) {
  const { accent } = useThemeState();
  return (
    <SegmentedControl<Accent> className={className} size={size} label="Accent colour" value={accent} onChange={setAccent} options={[
      { value: 'magenta', label: 'ARLAB magenta' },
      { value: 'violet', label: 'Violet' },
    ]} />
  );
}
