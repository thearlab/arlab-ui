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
