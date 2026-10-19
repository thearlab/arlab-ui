import React,{useContext} from 'react';
import {normalizeDepartment} from './department-theme.js';
import { ContourThemeContext, ContourDepartmentContext } from './ThemeContext.js';
import { tokensFor } from './system.js';
/** Contour theme boundary. Load @arlab/ui/styles.css once; Satoshi loads from its official Fontshare stylesheet; DM Mono is self-hosted. */
/** @param {React.HTMLAttributes<HTMLDivElement> & {mode?: 'light'|'dark', department?: string | null}} props */
export function ContourProvider({ children, mode, className = '', style = {}, department, ...props }) {
  const inheritedMode=useContext(ContourThemeContext);
  mode=mode??inheritedMode??'light';
  const inheritedDepartment=useContext(ContourDepartmentContext);
  const activeDepartment=normalizeDepartment(department===undefined?inheritedDepartment:department);
  return <ContourDepartmentContext.Provider value={activeDepartment}><ContourThemeContext.Provider value={mode}><div {...props} className={`arlab-contour themed-preview ${className}`} data-direction="contour" data-mode={mode} data-department-theme={activeDepartment}
    style={{...Object.fromEntries(Object.entries(tokensFor('contour', mode, {department:activeDepartment})).map(([key,value]) => [`--${key}`,value])), ...style}}>{children}</div></ContourThemeContext.Provider></ContourDepartmentContext.Provider>;
}
