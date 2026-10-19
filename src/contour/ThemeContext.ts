import { createContext } from 'react';
export const ContourThemeContext = createContext<'light' | 'dark' | undefined>(undefined);

/** Active workspace identity, retained by portals and nested theme boundaries. */
export const ContourDepartmentContext = createContext<string | undefined>(undefined);
