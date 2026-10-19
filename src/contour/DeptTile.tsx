import type { CSSProperties, ReactNode } from 'react';
import { Building2, Palette, Code2, Users, Compass } from 'lucide-react';
const departments: Record<string, string> = {Creative:'creative', Engineering:'engineering', 'Client services':'client', Company:'company', Strategy:'strategy', 'clients-servicing':'client', 'client-servicing':'client', 'strategy-growth':'strategy'};
const icons: Record<string, ReactNode> = {creative:<Palette size={16}/>,engineering:<Code2 size={16}/>,client:<Users size={16}/>,company:<Building2 size={16}/>,strategy:<Compass size={16}/>};
/** Resolve aliases once so department tiles and their navigation controls share the same identity. */
export function departmentIdentity(department: string, color?: string) {
 const key=departments[department] || department.toLowerCase();
 return { key, color:color || `var(--dept-${key}-solid, var(--cn-dept-${key}, var(--dept-${key}, var(--cn-accent, var(--accent-deep, currentColor)))))`, ink:`var(--dept-${key}-ink, var(--on-dept-solid,#fff))` };
}
/** Department identity. Compact tiles are decorative inside a named navigation control. */
export function DeptTile({department='Creative',compact=false,icon,color}: {department?:string;compact?:boolean;icon?:ReactNode;color?:string}) {
 const identity=departmentIdentity(department,color), key=identity.key;
 const tint=compact?identity.color:color || `var(--dept-${key}, var(--cn-dept-${key}, var(--cn-accent, var(--accent-deep, currentColor))))`;
 return compact ? <span className="contour-dept-tile-compact" style={{'--dept-tile-color':tint,'--dept-tile-ink':identity.ink} as CSSProperties} aria-hidden="true">{icon || icons[key] || icons.company}</span> : <span className="dept-tile"><i style={{background:tint}}/>{department}</span>;
}
