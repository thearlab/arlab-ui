// The maths behind Tour, kept free of React and the DOM so scripts/check-tour.mjs can test it.

export type TourSide = 'top' | 'bottom' | 'left' | 'right';
export type TourPlacement = 'auto' | TourSide;
export interface TourRect { top: number; left: number; width: number; height: number }
export interface TourSpot {
  side: TourSide | 'dock';
  x: number;
  y: number;
  /** Arrow offset along the popup's edge (left for top/bottom, top for left/right). */
  arrow: number;
}

const GAP = 12;   // between the target and the popup
const EDGE = 12;  // the popup stays this far inside the window
const DOCK = 16;  // phone gutter
export const TOUR_PHONE = 640;

// A window narrower than the popup gives hi < lo: then lo wins, so the popup's start stays visible.
const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

/** Where a w x h popup goes next to target r in a vw x vh window: the preferred side first, then
 * bottom, right, top, left; the first one with room wins (else the roomiest). It then slides along
 * that side to stay inside the window, and the arrow slides back to keep pointing at the target.
 * At phone width it docks to the bottom with no arrow. */
export function placeTour(r: TourRect, w: number, h: number, vw: number, vh: number, prefer: TourPlacement = 'auto'): TourSpot {
  if (vw <= TOUR_PHONE) return { side: 'dock', x: DOCK, y: vh - h - DOCK, arrow: 0 };
  const bottom = r.top + r.height, right = r.left + r.width;
  const room: Record<TourSide, number> = { bottom: vh - bottom, top: r.top, right: vw - right, left: r.left };
  const need: Record<TourSide, number> = { bottom: h + GAP + EDGE, top: h + GAP + EDGE, right: w + GAP + EDGE, left: w + GAP + EDGE };
  const order: TourSide[] = ['bottom', 'right', 'top', 'left'];
  if (prefer !== 'auto') order.unshift(prefer);
  const side = order.find((s) => room[s] >= need[s]) ?? (Object.keys(room) as TourSide[]).sort((a, b) => room[b] - room[a])[0];
  if (side === 'bottom' || side === 'top') {
    const x = clamp(r.left + r.width / 2 - w / 2, EDGE, vw - w - EDGE);
    const y = side === 'bottom' ? bottom + GAP : r.top - GAP - h;
    return { side, x, y, arrow: clamp(r.left + r.width / 2 - x - 6, 14, w - 26) };
  }
  const y = clamp(r.top + r.height / 2 - h / 2, EDGE, vh - h - EDGE);
  const x = side === 'right' ? right + GAP : r.left - GAP - w;
  return { side, x, y, arrow: clamp(r.top + r.height / 2 - y - 6, 14, h - 26) };
}

/** True when the tour should open by itself: neither the person's saved version (engine) nor the
 * browser copy has reached the current one. */
export const tourDue = (version: number, seen?: number | null, local?: number | null) =>
  Math.max(seen || 0, local || 0) < version;
