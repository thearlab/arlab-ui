/** A group header is a virtual row, with the same fixed geometry as a record row. */
export type InfiniteTableEntry<Row> =
  | { kind: 'group'; group: string; count: number; firstRowIndex: number }
  | { kind: 'row'; row: Row; rowIndex: number };

/** Group contiguous records without reordering a server's results. Sort/group on the host
 * when all records in a group must be adjacent. Appending a page extends an existing group. */
export function infiniteTableEntries<Row>(rows: Row[], groupBy?: keyof Row | ((row: Row) => string | number | null | undefined)): InfiniteTableEntry<Row>[] {
  const entries: InfiniteTableEntry<Row>[] = [];
  let heading: Extract<InfiniteTableEntry<Row>, {kind: 'group'}> | undefined;
  rows.forEach((row, rowIndex) => {
    if (groupBy !== undefined) {
      const group = String((typeof groupBy === 'function' ? groupBy(row) : row[groupBy]) ?? 'Ungrouped');
      if (!heading || heading.group !== group) {
        heading = {kind: 'group', group, count: 0, firstRowIndex: rowIndex};
        entries.push(heading);
      }
      heading.count += 1;
    }
    entries.push({kind: 'row', row, rowIndex});
  });
  return entries;
}

export interface InfiniteTableGroupHeading {index:number;label:string;count:number}
/** Locate the pinned heading without scanning every record on each scroll frame. */
export function activeInfiniteTableGroup(groups:InfiniteTableGroupHeading[],scrollTop:number,rowHeight:number) {
 if(!groups.length)return null;
 const position=Math.max(0,scrollTop),slot=Math.floor(position/rowHeight);
 let low=0,high=groups.length-1,current=0;
 while(low<=high){const middle=(low+high)>>1;if(groups[middle].index<=slot){current=middle;low=middle+1;}else high=middle-1;}
 const group=groups[current],next=groups[current+1];
 return {...group,offset:next?Math.min(0,next.index*rowHeight-position-rowHeight):0};
}
