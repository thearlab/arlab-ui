import React from 'react';
import { ContourThemeContext } from './ThemeContext.js';
import { tokensFor } from './system.js';
/** Contour theme boundary. Load @arlab/ui/styles.css once; Satoshi loads from its official Fontshare stylesheet; DM Mono is self-hosted. */
/** @param {React.HTMLAttributes<HTMLDivElement> & {mode?: 'light'|'dark'}} props */
export function ContourProvider({ children, mode = 'light', className = '', style = {}, ...props }) {
  return <ContourThemeContext.Provider value={mode}><div {...props} className={`arlab-contour themed-preview ${className}`} data-direction="contour" data-mode={mode}
    style={{...Object.fromEntries(Object.entries(tokensFor('contour', mode)).map(([key,value]) => [`--${key}`,value])), ...style}}>{children}</div></ContourThemeContext.Provider>;
}
