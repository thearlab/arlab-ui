import {satinLiftTokens} from './satin-foundation.js';

const channels = hex => hex.slice(1).match(/../g).map(value=>parseInt(value,16));
const blend = (a,b,amount) => '#'+channels(a).map((value,index)=>Math.round(value*(1-amount)+channels(b)[index]*amount).toString(16).padStart(2,'0')).join('');
const luminance = hex => channels(hex).map(value=>{const s=value/255;return s<=.04045?s/12.92:((s+.055)/1.055)**2.4;}).reduce((sum,value,index)=>sum+value*[.2126,.7152,.0722][index],0);
const contrast = (a,b) => (Math.max(luminance(a),luminance(b))+.05)/(Math.min(luminance(a),luminance(b))+.05);
function readable(color,background,target=4.5) {
  const endpoint=contrast('#000000',background)>contrast('#FFFFFF',background)?'#000000':'#FFFFFF';
  for(let step=0;step<=100;step++) {
    const candidate=blend(color,endpoint,step/100);
    if(contrast(candidate,background)>=target)return candidate;
  }
  return endpoint;
}

const aliases = {'client services':'client','client servicing':'client','clients-servicing':'client','client-servicing':'client','strategy-growth':'strategy'};
/** @param {string | null | undefined} department */
export function normalizeDepartment(department) {
  const value=department?.trim().toLowerCase();
  if(!value)return undefined;
  const key=aliases[value]||value;
  return ['creative','engineering','client','company','strategy'].includes(key)?key:undefined;
}
/** Shared department accents. Status colors, charts and department identity fills stay independent.
 * @param {'light' | 'dark' | string} mode
 * @param {string | null | undefined} [department]
 */
export function departmentThemeTokens(mode='light',department) {
  const dark=mode==='dark',base=satinLiftTokens(mode);
  department=normalizeDepartment(department);
  const identity=base[`dept-${department}`];
  const accent=identity||base.accent;
  // Preserve the department button fill. Bright fills use dark labels when white would be illegible.
  const text=identity&&department!=='creative'?readable(accent,blend(base.raise,accent,dark?.14:.08)):base.link;
  const action=identity&&department!=='creative'?base[`dept-${department}-solid`]:base.action;
  const actionInk=!identity||department==='creative'?base.actionInk:contrast(action,'#FFFFFF')>=4.5?'#FFFFFF':readable(base.ink,action);
  const rgb=channels(accent).join(','),soft=`rgba(${rgb},${dark?'.10':'.08'})`;
  return {
    accent,link:text,focus:accent,'accent-deep':text,action,actionHover:action,actionInk,
    tint:blend(base.raise,accent,dark?.14:.08),
    'accent-soft':soft,'accent-tint':`rgba(${rgb},${dark?'.14':'.10'})`,'accent-line':`rgba(${rgb},${dark?'.40':'.35'})`,
    navSelected:text,navActive:blend(base.raise,accent,dark?.14:.08),
    'nav-active-surface':blend(base.raise,accent,dark?.14:.08),'nav-active-border':blend(base.line,accent,.25),
    'scrollbar-thumb':`rgba(${rgb},.35)`,'scrollbar-hover':`rgba(${rgb},.60)`,
    'page-gradient':`radial-gradient(ellipse at 10% 0%,rgba(${rgb},${dark?'.035':'.025'}),transparent 65%)`,
    'chrome-gradient':`linear-gradient(105deg,${blend(base.raise,'#FFFFFF',dark?.022:.20)},${base.raise} 32%,${blend(base.raise,base.sunken,.08)} 100%)`,
    'chrome-subtle-gradient':`linear-gradient(180deg,${blend(base.raise,'#FFFFFF',dark?.02:.20)},${base.raise} 82%)`,
    'chrome-control-gradient':`linear-gradient(180deg,${blend(base.raise,'#FFFFFF',dark?.045:.35)},${blend(base.raise,accent,dark?.008:.004)} 56%,${blend(base.raise,base.sunken,.12)})`,
    'shadow-primary-hover':dark?base['shadow-primary-hover']:`inset 0 1px 0 #FFFFFF30,0 4px 12px rgba(${rgb},.14)`,
  };
}
