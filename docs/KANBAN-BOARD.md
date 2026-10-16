# Controlled Contour KanbanBoard

Implements `REQUEST-KANBAN-BOARD.md`. This replaces the Contour export's fixed demo data. Legacy `src/Kanban.tsx` remains unchanged. The component contains no project fixtures, network client or persistence.

## Exact contract

```ts
type KanbanColumn = {
  id: string;
  title: string;
  count?: number;
  tone?: 'quiet' | 'ok' | 'warn' | 'bad' | 'info';
  color?: string;
  description?: string;
  collapsed?: boolean;
  emptyLabel?: string;
  limit?: number;
};
type KanbanCard = { id: string; columnId: string };
interface KanbanBoardProps<T extends KanbanCard> {
  columns: KanbanColumn[];
  cards: T[];
  renderCard: (card: T) => React.ReactNode;
  onCardOpen?: (card: T) => void;
  onMove?: (cardId: string, toColumnId: string, index: number) => void;
  onColumnToggle?: (columnId: string, collapsed: boolean) => void;
  getCardLabel?: (card: T) => string;
  loading?: boolean;
  error?: React.ReactNode;
  columnWidth?: number;
  density?: 'regular' | 'compact';
}
```

- `cards` order defines order within each column. Card and column IDs must be stable and unique. Cards whose `columnId` is unknown are not rendered.
- `onMove` reports a **zero-based final insertion index in the destination after excluding the moved card**. The host owns reordering, permissions, optimistic updates and persistence. No callback means read-only: no handle or move menu.
- `getCardLabel` should return the actual project/title, not decorative content. Fallback is card ID.
- `onCardOpen` receives click/Enter intent. Arbitrary `renderCard` output is not nested in an interactive wrapper: the shared Open button, drag handle and move menu are siblings. Clicking noninteractive card content also opens; embedded controls/links retain their own actions.
- `onColumnToggle` reports requested collapse state. Host updates `columns[].collapsed`; omitted callback hides the toggle.
- `count` may represent a host's baseline total. Default is supplied cards in that column. It is display-only and does not fetch missing records.
- `limit` initially shows that many cards. Show N more reveals another limit-sized local batch. It does not call an API or alter host card data.
- `color` accepts a semantic CSS color/token, e.g. `var(--chart-2)`. If omitted, tone supplies a semantic phase line, or neutral line for quiet.
- `columnWidth` defaults to 280px, minimum 220px. Desktop collapsed strips are 52px. Phone shows one column at a time.
- `density='compact'` tightens column heading spacing while retaining the shared Panel's authoritative card padding/control styling and the requested 8px card gap.

## Rendering

The board uses horizontal shared ScrollArea; each column has a separate bounded vertical ScrollArea below its fixed heading. Column height is bounded to the viewport. Card surface is the actual shared Panel. Controls are shared Button/IconButton/Dropdown. There are no custom native input implementations or broad descendant control appearance overrides.

Loading renders three shared skeleton cards per expanded column. An error renders the shared generic StateView across the board. Empty columns have a quiet dashed empty area; a board with no columns has an explanatory StateView. The exported component's required TypeScript data props remain explicit, but missing JavaScript arrays fall back to an empty board rather than a fixed demo or crash.

## Move interactions

- Pointer/touch: drag the handle. It takes pointer capture, lifts a labelled preview, shows insertion markers and scrolls near column/board edges. Pointer cancellation/Escape cancels without invoking the host. A destination is remeasured on pointer-up so the final frame cannot drop into an outdated target.
- Phone dragging: holding at the left/right edge for roughly half a second switches the active column. The Move to menu also provides a simple touch alternative.
- Keyboard: focus Open/card label/handle, Space to pick up, Left/Right to change destination, Up/Down to change insertion index, Home/End to choose first/last, Space or Enter to drop, Escape to cancel. The source phone column remains visible until drop so keyboard focus is retained.
- Without pickup, arrows navigate between cards/columns. Navigating to a card beyond the local limit reveals it. Empty destination columns receive focus.
- Move to menu appends to the selected column. Choosing the current column moves the card to its end.
- Live announcements include the card label, destination column and resulting position. The announcement describes the controlled callback intent; hosts should expose persistence errors themselves and roll back their own data when necessary.
- Settle animation respects reduced-motion preference.

Phone column tabs show titles/counts and use the shared TabStrip. Swipe horizontally on noninteractive board content to change columns; vertical gestures remain available for column scrolling. Custom card controls are excluded from swipe/open delegation.

## Example

```tsx
<KanbanBoard
  columns={phases}
  cards={projects}
  renderCard={project => <ProjectCardContent project={project} />}
  getCardLabel={project => project.name}
  onCardOpen={project => setSelectedProject(project.id)}
  onColumnToggle={(id, collapsed) => updateColumn(id, { collapsed })}
  onMove={(id, to, index) => moveProjectInHost(id, to, index)}
/>
```

Use one optimistic host reorder for a move: remove the card, build the destination list without it, insert at index, then persist. Avoid sorting it back into an unrelated ordering after insertion. If the app prohibits transitions, withhold onMove or enforce/check permissions in its callback; the board does not invent business rules.

## Verification

TypeScript and CSS parsing pass. A source-execution harness validates destination clamping, keyboard move/cancel, unchanged host data, absence of movement controls when read-only, pointer capture/release and final insertion index, Show more, skeleton loading and error rendering. These are lightweight component execution checks, not real browser touch tests.

The controlled showcase now includes seven project phases, phase colors, collapse, read-only, loading, error, empty, Move to and details Modal. Parent release verification should still exercise actual pointer/touch capture, both scroll directions, phone swipe/edge switching, keyboard focus after a controlled reorder, reduced motion, long titles, custom interactive card content, and light/dark appearances. Generated component contract/docs must be regenerated from the new contract during release.
