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
  const accent = dark ? '#D572CC' : '#E414DB';
  const channels = rgb(accent).join(',');
  const soft = `rgba(${channels},${dark ? '.10' : '.08'})`;
  const colors = {ground,raise,sunken,ink,dim,line,strong:dim,
    nav:raise,navInk:dim,navActive:blend(raise,accent,dark?.14:.08),navSelected:accent,
    'nav-hover-surface':blend(ground,line,.30),
    'nav-active-surface':blend(raise,accent,dark?.14:.08),
    'nav-active-border':blend(line,accent,.25),
    accent,tint:blend(raise,accent,dark?.14:.08),action:dark?'#BA29B0':accent,actionHover:dark?'#C02EB5':accent,actionInk:'#FFFFFF',
    link:accent,focus:accent,'accent-deep':accent,'accent-soft':soft,
    'accent-tint':`rgba(${channels},${dark?'.14':'.10'})`,'accent-line':`rgba(${channels},${dark?'.40':'.35'})`,
    'secondary-accent':dark?'#D99868':'#FB923C','secondary-accent-text':dark?'#E4B389':'#984414','secondary-accent-soft':dark?'#503826':'#FDF0E4',
    'scrollbar-thumb':`rgba(${channels},.35)`,'scrollbar-hover':`rgba(${channels},.60)`,'scrollbar-track':'transparent',
  };
  // Explicit dark semantic hues retain their meaning on neutral chrome surfaces.
  const semantic = dark
    ? {ok:'#75D6A6',bad:'#FF94A3',info:'#8DBBFF',planning:'#C3AAFF'}
    : {ok:'#356A5A',bad:'#AD4053',info:'#4B619D',planning:'#7053A1'};
  Object.entries(semantic).forEach(([role,color])=>{
    colors[role]=color;
    const darkTints={ok:'#233D32',bad:'#4B2630',info:'#253B58',planning:'#3B2D54'};
    colors[`${role}Tint`]=dark ? darkTints[role] : blend(raise,color,.075);
  });
  colors.warn=colors['secondary-accent-text'];colors.warnTint=colors['secondary-accent-soft'];
  const charts = dark ? ['#D572CC','#D99868','#AF91D9','#78ACCA','#76B3A7','#B9A4D5','#D4B36F']
    : ['#E414DB','#FB923C','#8058D6','#198BC2','#128D83','#9560C7','#BF870D'];
  charts.forEach((color,index)=>colors[`chart-${index+1}`]=color);
  colors['chart-trend']=colors['chart-4'];
  // Dark text/chart colors and solid identity fills have different contrast roles.
  const departmentFills = dark ? ['#BE36B3','#AE6332','#8863C3','#307DA6','#2D8177'] : charts;
  ['creative','engineering','client','company','strategy'].forEach((department,index)=>{
    const color=charts[index];
    colors[`dept-${department}`]=color;colors[`dept-${department}-solid`]=departmentFills[index];
    colors[`dept-${department}-ink`]='#FFFFFF';
  });
  return {...colors,
    'font-sans':"'Satoshi', sans-serif",'font-display':"'Satoshi', sans-serif",'font-mono':"'DM Mono', monospace",
    'weight-regular':'400','weight-medium':'500','weight-semibold':'600','weight-heading':'600','font-weight-heading':'600','icon-stroke':'1.5',
    'radius-tag':'5px','radius-xs':'7px','radius-sm':'7px','radius-lg':'14px','radius-md':'14px','radius-panel':'14px','radius-control':'7px',
    'surface-inset-shadow':dark?'inset 0 1px 0 #FFFFFF30,inset 1px 0 0 #FFFFFF12,inset 0 -1px 2px #00000045':'inset 0 2px 0 #FFFFFF,inset 1px 0 0 #FFFFFFCC,inset 0 -2px 4px #30304016',
    'chrome-inset-shadow':dark?'inset 0 1px 0 #FFFFFF30,inset 0 -1px 2px #00000045':'inset 0 1px 0 #FFFFFF,inset 0 -1px 2px #20283820',
    'chrome-pressed-shadow':dark?'inset 0 2px 4px #00000066,inset 0 -1px 0 #FFFFFF25,0 1px 2px #00000020':'inset 0 2px 4px #2028382A,inset 0 -1px 0 #FFFFFF,0 1px 2px #20283810',
    'surface-border-color':'transparent',
    'surface-border-width':'1px','surface-radius':'var(--radius-panel)',
    'surface-elevation':'var(--shadow-surface)','surface-overlay-elevation':'var(--shadow-pop)',
    'surface-hover-elevation':dark?'var(--surface-inset-shadow),0 4px 10px #00000055,0 18px 36px -10px #000000A0':'var(--surface-inset-shadow),0 4px 10px #20283820,0 18px 36px -10px #20283848',
    'text-kbd':'var(--text-2xs)','radius-bar':'1px',
    'z-tour':'2200','panel-inset':'22px','panel-inset-compact':'17px','panel-header-block':'var(--space-4)','panel-header-gap':'18px','panel-body-gap':'var(--space-4)',
    'workspace-padding':'28px','text-workspace-heading':'26px',
    'loading-sheen':dark?'#FFFFFF0D':'#FFFFFFCC','loading-sheen-duration':'6.4s',
    'surface-gradient':`linear-gradient(155deg,${raise},${raise}),${dark?'linear-gradient(135deg,#62626C,#34343B 40%,#4B4B55 75%,#5D5D68)':'linear-gradient(135deg,#FFFFFF,#D5D5DF 40%,#F5F5FB 75%,#D0D0DB)'}`,
    'shadow-surface':dark?'var(--surface-inset-shadow),0 2px 4px #00000040,0 10px 22px -10px #00000088':'var(--surface-inset-shadow),0 2px 4px #20283814,0 10px 22px -10px #20283838',
    'shadow-card':'var(--shadow-surface)',
    'shadow-control':dark?'inset 0 1px 0 #FFFFFF05':'0 1px 2px #20283809',
    'shadow-control-hover':dark?'inset 0 1px 0 #FFFFFF0A,0 3px 10px #00000025':'inset 0 1px 0 #FFFFFF,0 3px 10px #20283812',
    'shadow-primary':dark?'inset 0 1px 0 #FFFFFF14':'inset 0 1px 0 #FFFFFF20',
    'shadow-primary-hover':dark?'inset 0 1px 0 #FFFFFF20,0 4px 12px #00000040':`inset 0 1px 0 #FFFFFF30,0 4px 12px rgba(${channels},.14)`,
    'shadow-pop':'var(--shadow-surface)',
    'shadow-chrome':dark?'0 2px 10px #00000020':'0 2px 10px #20283808',
    'action-gradient':`linear-gradient(180deg,${dark?'#FFFFFF08':'#FFFFFF24'},transparent 62%)`,
    'button-chrome-gradient':dark?'linear-gradient(180deg,#FFFFFF0D,transparent 52%,#00000008)':'linear-gradient(180deg,#FFFFFFCC,transparent 62%,#00000004)',
    'button-chrome-hover-gradient':dark?'linear-gradient(180deg,#FFFFFF14,transparent 56%,#00000005)':'linear-gradient(180deg,#FFFFFFF2,transparent 62%,#00000003)',
    'page-gradient':`radial-gradient(ellipse at 10% 0%,rgba(${channels},${dark?'.035':'.025'}),transparent 65%)`,
    'chrome-gradient':`linear-gradient(135deg,${blend(raise,accent,dark?.025:.018)},${raise} 75%)`,
    'icon-hover-color':ink,'icon-rest-border':blend(raise,ink,dark?.2:.13),'icon-hover-border':blend(raise,ink,dark?.28:.18),
    'icon-rest-surface':blend(raise,sunken,.12),'icon-hover-surface':blend(raise,sunken,.35),
    'icon-rest-gradient':`linear-gradient(180deg,${dark?'rgba(255,255,255,.025)':'rgba(255,255,255,.6)'},transparent 65%)`,
    'icon-hover-gradient':`linear-gradient(180deg,${dark?'rgba(255,255,255,.045)':'rgba(255,255,255,.8)'},transparent 70%)`,
    'dept-selected-border':dark?'rgba(255,255,255,.18)':'rgba(0,0,0,.30)',
    'dept-pressed-gradient':dark?'linear-gradient(155deg,#00000030,#0000000C 52%,#FFFFFF12)':'linear-gradient(155deg,#00000024,#00000005 52%,#FFFFFF28)',
    'dept-pressed-shadow':dark?'inset 0 2px 4px #00000066,inset 0 -1px 0 #FFFFFF20,0 2px 4px #00000035':'inset 0 2px 4px #00000030,inset 0 -1px 0 #FFFFFF70,0 2px 4px #20283820',
    'dept-solid-gradient':dark?'linear-gradient(150deg,#FFFFFF18,transparent 55%,#00000014)':'linear-gradient(150deg,#FFFFFF20,transparent 55%,#0000000A)',
    'dept-solid-hover-gradient':dark?'linear-gradient(150deg,#FFFFFF40,#FFFFFF05 36%,#00000020 54%,#FFFFFF20)':'linear-gradient(150deg,#FFFFFF55,#FFFFFF08 36%,#00000018 54%,#FFFFFF30)',
    'dept-solid-shadow':dark?'inset 0 1px 0 #FFFFFF40,inset 1px 0 0 #FFFFFF12,inset 0 -1px 2px #00000045,0 2px 3px #00000030':'inset 0 1px 0 #FFFFFF70,inset 1px 0 0 #FFFFFF20,inset 0 -1px 2px #00000024,0 2px 3px #20283818',
    'dept-solid-hover-shadow':dark?'inset 0 1px 0 #FFFFFF40,inset 0 -1px 0 #00000030,0 1px 3px #00000030':'inset 0 1px 0 #FFFFFF55,inset 0 -1px 0 #00000020,0 1px 3px #00000018',
    'dept-icon-gradient':dark?'linear-gradient(150deg,#FFFFFF12,#FFFFFF03 36%,#00000014 54%,#FFFFFF08)':'linear-gradient(150deg,#FFFFFFF2,#FFFFFF70 36%,#00000008 54%,#FFFFFFA0)',
    'dept-icon-shadow':dark?'inset 0 1px 0 #FFFFFF12,inset 0 -1px 0 #00000024,0 1px 2px #00000018':'inset 0 1px 0 #FFFFFF,inset 0 -1px 0 #2C25320A,0 1px 2px #20283808',
    'icon-rest-shadow':'var(--chrome-control-shadow)',
    'icon-hover-shadow':'var(--chrome-control-hover-shadow)',
    'chrome-line':blend(raise,ink,dark?.2:.13),'chrome-line-hover':blend(raise,ink,dark?.27:.18),
    'field-surface':blend(raise,sunken,dark?.22:.14),
    'field-gradient':`linear-gradient(180deg,${blend(raise,sunken,dark?.36:.26)},${blend(raise,sunken,dark?.16:.08)} 62%,${raise})`,
    'field-shadow':dark?'inset 0 2px 4px #00000065,inset 0 -1px 0 #FFFFFF15':'inset 0 2px 4px #20283822,inset 0 -1px 0 #FFFFFF',
    'field-hover-shadow':dark?'inset 0 2px 4px #00000075,inset 0 -1px 0 #FFFFFF20':'inset 0 2px 4px #2028382A,inset 0 -1px 0 #FFFFFF',
    'chrome-control-surface':raise,'chrome-control-gradient':`linear-gradient(180deg,${blend(raise,'#FFFFFF',dark?.045:.35)},${blend(raise,accent,dark?.008:.004)} 56%,${blend(raise,sunken,.12)})`,
    'tag-gradient':`linear-gradient(180deg,${dark?'#FFFFFF0A':'#FFFFFF66'},transparent 72%)`,
    'tag-shadow':dark?'inset 0 1px 0 #FFFFFF25,inset 0 -1px 1px #00000030':'inset 0 1px 0 #FFFFFF,inset 0 -1px 1px #20283818',
    'control-gradient':'var(--chrome-control-gradient)',
    'chrome-control-shadow':dark?'var(--chrome-inset-shadow),0 2px 3px #00000030':'var(--chrome-inset-shadow),0 2px 3px #20283812',
    'chrome-control-hover-shadow':dark?'var(--chrome-inset-shadow),0 2px 3px #00000030,0 3px 7px #00000040':'var(--chrome-inset-shadow),0 2px 3px #20283812,0 3px 7px #20283820',
    'chrome-rule-highlight':dark?'#FFFFFF10':'#FFFFFFB3',
    'shell-edge-shadow':dark?'inset -1px 0 0 #FFFFFF0D,inset 1px 0 0 #FFFFFF04':'inset -1px 0 0 #FFFFFFCC,inset 1px 0 0 #FFFFFF70',
    'shell-header-shadow':dark?'inset 0 1px 0 #FFFFFF08,0 1px 3px #00000028':'inset 0 1px 0 #FFFFFFCC,0 1px 3px #2028380C',
    'chrome-divider':blend(raise,ink,dark?.13:.085),'chrome-row-hover':blend(raise,ink,dark?.035:.025),
    'chrome-subtle-gradient':`linear-gradient(145deg,${blend(raise,accent,dark?.018:.012)},${raise} 80%)`,
    'toggle-shadow':dark?'0 1px 2px #00000018':'0 1px 2px #20283808',
    'toggle-hover-shadow':dark?'0 1px 3px #00000020':'0 1px 3px #2028380C',
    'switch-off-track':blend(raise,ink,dark?.16:.13),'switch-off-border':blend(raise,ink,dark?.38:.35),'switch-thumb':dark?'#EBEBEF':dim,
  };
}
