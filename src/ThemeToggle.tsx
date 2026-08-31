import { useEffect, useState } from 'react';
import { IconButton, type IconButtonProps } from './IconButton';
import { MoonIcon, SunIcon } from './icons';
import { getTheme, setTheme, type Theme } from './theme';

export function ThemeToggle(props: Omit<IconButtonProps, 'onClick' | 'children' | 'aria-label'>) {
  const [theme, setThemeState] = useState<Theme>('light');

  useEffect(() => {
    setThemeState(getTheme());
  }, []);

  function toggle() {
    const next: Theme = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    setThemeState(next);
  }

  return (
    <IconButton
      {...props}
      onClick={toggle}
      aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
      title={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
    >
      {theme === 'dark' ? <MoonIcon size={16} /> : <SunIcon size={16} />}
    </IconButton>
  );
}
