import { createContext } from 'react';
export const NavigationDismissContext = createContext<(() => void) | undefined>(undefined);
