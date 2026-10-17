import {createElement,type HTMLAttributes,type ReactNode} from 'react';
export interface SurfaceProps extends HTMLAttributes<HTMLElement> {
  as?: 'div'|'section'|'article'|'aside'|'nav'|'a'|'button';
  children?: ReactNode;
  /** Hover elevation belongs only on actionable cards. Native links/buttons keep their semantics. */
  interactive?: boolean;
  elevation?: 'surface'|'overlay';
  variant?: 'framed'|'flush';
  href?: string;
  target?: string;
  rel?: string;
  type?: 'button'|'submit'|'reset';
  disabled?: boolean;
}
/** The approved Satin Lift container. Geometry, rim, paint and elevation are foundation tokens. */
export function Surface({as='section',interactive=false,elevation='surface',variant='framed',className='',...props}:SurfaceProps) {
 return createElement(as,{...props,className:`ct-surface ${className}`,'data-surface-interactive':interactive||undefined,'data-surface-elevation':elevation,'data-surface-variant':variant,...(as==='button'?{type:props.type??'button'}:{})});
}
