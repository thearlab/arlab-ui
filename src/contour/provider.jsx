import React from 'react';
import { tokensFor } from './system.js';
/** Contour theme boundary. Load @arlab/ui/styles.css and Manrope / IBM Plex Mono once. */
export function ContourProvider({ children, mode = 'light', className = '', style = {}, ...props }) {
  return <div {...props} className={`arlab-contour themed-preview ${className}`} data-direction="contour" data-mode={mode}
    style={{...Object.fromEntries(Object.entries(tokensFor('contour', mode)).map(([key,value]) => [`--${key}`,value])), ...style}}>{children}</div>;
}
