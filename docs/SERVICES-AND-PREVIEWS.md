# Notifications, guided tours and previews

These additions preserve the presentational `Toast` and existing controlled `GuidedTour` contracts. Wrap notification consumers in `ToastProvider`, inside `ContourProvider` so notifications inherit the same mode and tokens.

```tsx
function App() {
  return <ContourProvider><ToastProvider><Workspace /></ToastProvider></ContourProvider>;
}
function Workspace() {
  const {toast, update, dismiss, clear} = useToast();
  const saved = () => {
    const id = toast({title: 'Saved', description: 'Your settings are up to date.', tone: 'success'});
    update(id, {description: 'Available to your team.'});
  };
  return <Button onClick={saved}>Save</Button>;
}
```

`toast(string | ToastOptions)` returns an id. Supplied ids update an existing notification without reordering it. `dismiss(id)` removes one; `clear()` removes all. Options include title, description, tone (`success`, `info`, `warning`, `danger`), duration and an optional `{label, onClick}` action. Default duration is 5000ms; zero disables automatic dismissal. Waiting notifications remain FIFO and start their timers only when visible. Visible timers pause while hovered, keyboard-focused or while the document is hidden. The viewport never takes focus. Danger messages use alert semantics; other messages use status semantics. No notification is persisted between mounts.

`ToastProvider` accepts `maxVisible` (default 3), `duration`, accessible `label`, and `position` (`bottom-right`, `bottom-left`, `top-right`, `top-left`). Do not place it inside an ancestor with transform or clipping if notifications must sit against the browser viewport.

## Guided tours

```tsx
const tour = useGuidedTour({
  steps: [{target: '[data-tour="creative-space"]', title: 'Creative', body: 'Open your workspace.'}],
  storageKey: 'studio-introduction', version: 1, autoStart: true,
});
return <><Button onClick={tour.start}>Show introduction</Button><GuidedTour {...tour.tourProps} /></>;
```

The hook returns `open`, `start()`, `close(reason)`, `reset()` and `tourProps`. Manual start always opens the tour. `autoStart` checks the optional persisted version. Completion and skipping mark the current version seen; an empty tour does not. `reset` removes the version and closes the tour. Storage denial is safe and does not prevent the tour. No storage is read or written without an explicit key. `onClose` receives `done`, `skip` or `empty`.

Spaces expose `data-tour="space-{id}"` by default on their real interactive controls. A space can override this with its own `"data-tour"` value. Existing NavigationItem supports application-owned `data-tour` values too. Tour arrows follow the selected popup side and disappear when the card docks on a phone.

## Preview frames

`PreviewFrame` forwards its ref to the iframe and accepts native iframe attributes and `onLoad`. Its existing boolean `loading` prop remains the visual loading overlay; it is not the browser's lazy-loading attribute. `overlay` accepts app content; `renderOverlay({loading, error, viewport})` provides an optional state-aware overlay. Overlay controls can receive pointer events while empty overlay space lets the iframe receive them.

`autoHeight` measures accessible same-origin iframe content after load and observes document size changes with ResizeObserver. `onHeightChange(height)` reports measured pixels. Cross-origin frames and sandboxed documents without same-origin access retain their normal height. The secure default `sandbox="allow-scripts"` is unchanged; applications must explicitly choose an appropriate sandbox if they require document measurement. Do not enable script and same-origin capabilities for untrusted same-origin content.
