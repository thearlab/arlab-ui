// Approved Satin Lift foundation. Geometry and visual treatment are separate
// from the existing control heights, spacing, responsive behavior and component APIs.
const palettes = {
  light: {ground:'#F7F5F9',raise:'#FFFDFF',sunken:'#EDE8F1',ink:'#2C2532',dim:'#665C70',line:'#DDD4E5'},
  dark: {ground:'#202022',raise:'#29292C',sunken:'#1B1B1E',ink:'#F4F4F6',dim:'#BDBDC5',line:'#414146'},
};
const rgb = hex => hex.slice(1).match(/../g).map(channel=>parseInt(channel,16));
const blend = (a,b,amount) => '#'+rgb(a).map((value,index)=>Math.round(value*(1-amount)+rgb(b)[index]*amount).toString(16).padStart(2,'0')).join('');

export function satinLiftTokens(mode) {
  const dark = mode === 'dark';
  const {ground,raise,sunken,ink,dim,line} = palettes[dark ? 'dark' : 'light'];
  const accent = dark ? '#F04EE8' : '#E414DB';
  const channels = rgb(accent).join(',');
  const soft = `rgba(${channels},${dark ? '.10' : '.08'})`;
  const colors = {ground,raise,sunken,ink,dim,line,strong:dim,
    nav:raise,navInk:dim,navActive:blend(raise,accent,dark?.14:.08),navSelected:accent,
    accent,tint:blend(raise,accent,dark?.14:.08),action:accent,actionHover:accent,actionInk:'#FFFFFF',
    link:accent,focus:accent,'accent-deep':accent,'accent-soft':soft,
    'accent-tint':`rgba(${channels},${dark?'.14':'.10'})`,'accent-line':`rgba(${channels},${dark?'.40':'.35'})`,
    'secondary-accent':'#FB923C','secondary-accent-text':dark?'#FDBA74':'#984414','secondary-accent-soft':dark?'#503826':'#FDF0E4',
    'scrollbar-thumb':`rgba(${channels},.35)`,'scrollbar-hover':`rgba(${channels},.60)`,'scrollbar-track':'transparent',
  };
  [['ok','#356A5A'],['bad','#AD4053'],['info','#4B619D']].forEach(([role,color])=>{
    colors[role]=dark?blend(color,'#FFFFFF',.62):color;
    colors[`${role}Tint`]=blend(raise,colors[role],dark?.16:.075);
  });
  colors.warn=colors['secondary-accent-text'];colors.warnTint=colors['secondary-accent-soft'];
  const charts = dark ? ['#F04EE8','#FB923C','#A78BFA','#38BDF8','#2DD4BF','#C4B5FD','#FBBF24']
    : ['#E414DB','#FB923C','#8058D6','#198BC2','#128D83','#9560C7','#BF870D'];
  charts.forEach((color,index)=>colors[`chart-${index+1}`]=color);
  colors['chart-trend']=colors['chart-4'];
  // Department tiles retain the approved vivid hues and white outline icons.
  ['creative','engineering','client','company','strategy'].forEach((department,index)=>{
    const color=charts[index];
    colors[`dept-${department}`]=color;colors[`dept-${department}-solid`]=color;
    colors[`dept-${department}-ink`]='#FFFFFF';
  });
  return {...colors,
    'font-sans':"'Satoshi', sans-serif",'font-display':"'Satoshi', sans-serif",'font-mono':"'DM Mono', monospace",
    'weight-regular':'400','weight-medium':'500','weight-semibold':'600','weight-heading':'600','font-weight-heading':'600','icon-stroke':'1.5',
    'radius-xs':'7px','radius-sm':'7px','radius-lg':'14px','radius-md':'14px','radius-panel':'14px','radius-control':'7px',
    'surface-border-color':'transparent',
    'surface-gradient':dark?'linear-gradient(150deg,#29292C,#28282B),linear-gradient(135deg,#48484E,#38383D 32%,#414146 65%,#46464B)':'linear-gradient(150deg,#FFFDFF,#FDFCFE),linear-gradient(135deg,#E3DCE9,#D2C9DB 32%,#F4EFF7 65%,#D8CEDE)',
    'shadow-surface':dark?'inset 0 1px 0 #FFFFFF04,0 1px 2px #00000025,0 10px 26px -16px #00000080':'inset 0 1px 0 #FFFFFF,0 1px 2px #20283808,0 10px 26px -16px #20283830',
    'shadow-card':dark?'inset 0 1px 0 #FFFFFF04,0 1px 2px #00000025,0 10px 26px -16px #00000080':'inset 0 1px 0 #FFFFFF,0 1px 2px #20283808,0 10px 26px -16px #20283830',
    'shadow-control':dark?'inset 0 1px 0 #FFFFFF05':'0 1px 2px #20283809',
    'shadow-control-hover':dark?'inset 0 1px 0 #FFFFFF0A,0 3px 10px #00000025':'inset 0 1px 0 #FFFFFF,0 3px 10px #20283812',
    'shadow-primary':dark?'inset 0 1px 0 #FFFFFF14':'inset 0 1px 0 #FFFFFF20',
    'shadow-primary-hover':dark?'inset 0 1px 0 #FFFFFF20,0 4px 12px #00000040':`inset 0 1px 0 #FFFFFF30,0 4px 12px rgba(${channels},.14)`,
    'shadow-pop':dark?'0 4px 8px #00000035,0 20px 48px -12px #00000090':'0 4px 8px #2028380A,0 20px 48px -12px #20283830',
    'shadow-chrome':dark?'0 2px 10px #00000020':'0 2px 10px #20283808',
    'action-gradient':dark?'linear-gradient(135deg,rgba(251,146,60,.08),transparent 70%)':'none',
    'page-gradient':'none','chrome-gradient':'none',
    'icon-hover-color':ink,'icon-rest-border':blend(raise,ink,dark?.2:.13),'icon-hover-border':blend(raise,ink,dark?.28:.18),
    'icon-rest-surface':blend(raise,sunken,.12),'icon-hover-surface':blend(raise,sunken,.35),
    'icon-rest-gradient':`linear-gradient(180deg,${dark?'rgba(255,255,255,.025)':'rgba(255,255,255,.6)'},transparent 65%)`,
    'icon-hover-gradient':`linear-gradient(180deg,${dark?'rgba(255,255,255,.045)':'rgba(255,255,255,.8)'},transparent 70%)`,
    'icon-rest-shadow':dark?'inset 0 1px 0 #FFFFFF04':'inset 0 1px 0 #FFFFFFB0,0 1px 1px #20283804',
    'icon-hover-shadow':dark?'inset 0 1px 0 #FFFFFF08,0 1px 3px #00000015':'inset 0 1px 0 #FFFFFFD0,0 1px 3px #2028380A',
    'chrome-line':blend(raise,ink,dark?.2:.13),'chrome-line-hover':blend(raise,ink,dark?.27:.18),
    'chrome-control-surface':raise,'chrome-control-gradient':`linear-gradient(180deg,${raise},${blend(raise,sunken,.2)})`,
    'control-gradient':`linear-gradient(180deg,${raise},${blend(raise,sunken,.2)})`,
    'chrome-control-shadow':dark?'inset 0 1px 0 #FFFFFF04':'inset 0 1px 0 #FFFFFFC0,0 1px 2px #20283805',
    'chrome-control-hover-shadow':dark?'inset 0 1px 0 #FFFFFF06,0 1px 3px #00000018':'inset 0 1px 0 #FFFFFF,0 1px 3px #2028380A',
    'chrome-divider':blend(raise,ink,dark?.13:.085),'chrome-row-hover':blend(raise,ink,dark?.035:.025),
    'chrome-subtle-gradient':`linear-gradient(180deg,${blend(raise,sunken,.1)},${blend(raise,sunken,.2)})`,
    'switch-off-track':blend(raise,ink,dark?.16:.13),'switch-off-border':blend(raise,ink,dark?.38:.35),'switch-thumb':dark?'#EBEBEF':dim,
  };
}
