import type { CSSProperties, ReactNode } from 'react';
import { Building2, Palette, Code2, Users, Compass } from 'lucide-react';
const departments: Record<string, string> = {Creative:'creative', Engineering:'engineering', 'Client services':'client', Company:'company', Strategy:'strategy', 'clients-servicing':'client', 'client-servicing':'client', 'strategy-growth':'strategy'};
const icons: Record<string, ReactNode> = {creative:<Palette size={16}/>,engineering:<Code2 size={16}/>,client:<Users size={16}/>,company:<Building2 size={16}/>,strategy:<Compass size={16}/>};
/** Department identity. Compact tiles are decorative inside a named navigation control. */
export function DeptTile({department='Creative',compact=false,icon,color}: {department?:string;compact?:boolean;icon?:ReactNode;color?:string}) {
 const key=departments[department] || department.toLowerCase();
 const tint=color || `var(--dept-${key}, var(--cn-dept-${key}, var(--cn-accent, #a80fa3)))`;
 return compact ? <span className="contour-dept-tile-compact" style={{'--dept-tile-color':tint} as CSSProperties} aria-hidden="true">{icon || icons[key] || icons.company}</span> : <span className="dept-tile"><i style={{background:tint}}/>{department}</span>;
}
