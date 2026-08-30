import { useEffect, useState } from 'react';
import { Button, type ButtonProps } from './Button';
import { getTheme, setTheme, type Theme } from './theme';

export function ThemeToggle(props: Omit<ButtonProps, 'onClick' | 'children'>) {
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
    <Button variant="ghost" size="sm" {...props} onClick={toggle} aria-label="Toggle theme">
      {theme === 'dark' ? 'Dark' : 'Light'}
    </Button>
  );
}
