import { createContext, useContext } from 'react';
import type { FilterColumn } from './DataFilters.js';

/** Share collection presentation without remounting its table or resetting its state. */
export const CondensedCollectionContext = createContext(false);
export function useCollectionColumns<Row>(columns: FilterColumn<Row>[]): FilterColumn<Row>[] {
  const condensed = useContext(CondensedCollectionContext);
  return condensed ? columns.slice(0, 1).map(column => ({ ...column, width: undefined, minWidth: undefined, maxWidth: undefined })) : columns;
}
