// Where a floating box (menu, popover, tooltip, select list) goes next to its anchor: the preferred
// side, flipped when it does not fit, then slid to stay inside the window. Pure, unit tested.

export type Side = 'top' | 'bottom' | 'left' | 'right';
export type Align = 'start' | 'center' | 'end';
export type Placement = Side | `${Side}-${Align}`;
export interface Rect { top: number; left: number; width: number; height: number }
export interface Placed { top: number; left: number; side: Side; align: Align; maxHeight: number; maxWidth: number }

const opposite: Record<Side, Side> = { top: 'bottom', bottom: 'top', left: 'right', right: 'left' };

export function parsePlacement(p: Placement): [Side, Align] {
  const [s, a] = p.split('-') as [Side, Align | undefined];
  return [s, a ?? 'center'];
}

/**
 * @param a       the anchor's rect (viewport coordinates)
 * @param w,h     the floating box's natural size
 * @param vw,vh   the viewport
 * @param rtl     flips start and end
 */
export function place(a: Rect, w: number, h: number, vw: number, vh: number, placement: Placement = 'bottom-start', offset = 6, edge = 8, rtl = false): Placed {
  let [side, align] = parsePlacement(placement);
  if (rtl && align !== 'center' && (side === 'top' || side === 'bottom')) align = align === 'start' ? 'end' : 'start';
  const room: Record<Side, number> = {
    top: a.top - offset - edge,
    bottom: vh - (a.top + a.height) - offset - edge,
    left: a.left - offset - edge,
    right: vw - (a.left + a.width) - offset - edge,
  };
  const need = side === 'top' || side === 'bottom' ? h : w;
  if (room[side] < need && room[opposite[side]] > room[side]) side = opposite[side];
  const vertical = side === 'top' || side === 'bottom';
  const maxHeight = Math.max(80, vertical ? room[side] : vh - edge * 2);
  const maxWidth = Math.max(120, vertical ? vw - edge * 2 : room[side]);
  const hh = Math.min(h, maxHeight), ww = Math.min(w, maxWidth);
  let top: number, left: number;
  if (vertical) {
    top = side === 'bottom' ? a.top + a.height + offset : a.top - offset - hh;
    left = align === 'start' ? a.left : align === 'end' ? a.left + a.width - ww : a.left + a.width / 2 - ww / 2;
    left = clamp(left, edge, vw - ww - edge);
  } else {
    left = side === 'right' ? a.left + a.width + offset : a.left - offset - ww;
    top = align === 'start' ? a.top : align === 'end' ? a.top + a.height - hh : a.top + a.height / 2 - hh / 2;
    top = clamp(top, edge, vh - hh - edge);
  }
  return { top: Math.round(top), left: Math.round(left), side, align, maxHeight: Math.floor(maxHeight), maxWidth: Math.floor(maxWidth) };
}

// A window smaller than the box gives hi < lo: lo wins so the start stays visible.
export const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));
