// Week view maths: minutes from a time, and side-by-side lanes for overlapping events. Pure, tested.

/** 'HH:MM' to minutes since midnight. */
export const minutes = (t: string) => { const [h, m] = t.split(':').map(Number); return h * 60 + (m || 0); };

export interface Timed { id: string; start: string; end: string }
export interface Laid { id: string; top: number; height: number; lane: number; lanes: number }

/** Lay out one day's timed events: events that overlap share the width in lanes, the classic
 * calendar layout. `top` and `height` are minutes; an event shorter than 15 min shows as 15. */
export function layoutDay(events: readonly Timed[]): Laid[] {
  const evs = events
    .map((e) => ({ id: e.id, s: minutes(e.start), e: Math.max(minutes(e.end), minutes(e.start) + 15) }))
    .sort((a, b) => a.s - b.s || b.e - a.e);
  const out: Laid[] = [];
  let cluster: { id: string; s: number; e: number; lane: number }[] = [];
  let clusterEnd = -1;
  const flush = () => {
    const lanes = Math.max(1, ...cluster.map((c) => c.lane + 1));
    for (const c of cluster) out.push({ id: c.id, top: c.s, height: c.e - c.s, lane: c.lane, lanes });
    cluster = [];
  };
  for (const ev of evs) {
    if (ev.s >= clusterEnd && cluster.length) flush();
    const laneEnds: number[] = [];
    for (const c of cluster) laneEnds[c.lane] = Math.max(laneEnds[c.lane] ?? -1, c.e);
    let lane = laneEnds.findIndex((end) => end <= ev.s);
    if (lane < 0) lane = laneEnds.length;
    cluster.push({ ...ev, lane });
    clusterEnd = Math.max(clusterEnd, ev.e);
  }
  if (cluster.length) flush();
  return out;
}
