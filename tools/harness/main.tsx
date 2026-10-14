// The test harness: renders one story (every state, or one state) by URL, for the axe and visual
// checks. #/<story-id>[/<state-index>]?theme=light|dark&accent=magenta|violet&dir=rtl
import '@fontsource/onest/400.css';
import '@fontsource/onest/500.css';
import '@fontsource/onest/600.css';
import '@fontsource/onest/700.css';
import '@fontsource/onest/800.css';
import '../../src/index.css';
import './harness.css';
import { Fragment, StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { stories } from '../../src/stories';
import * as feedback from '../../src/feedback';
const Wrap: any = (feedback as any).ToastProvider ?? Fragment;

const [, id = '', stateIx] = location.hash.replace(/\?.*/, '').split('/');
const q = new URLSearchParams(location.hash.split('?')[1] || location.search);
const html = document.documentElement;
if (q.get('theme')) html.setAttribute('data-theme', q.get('theme')!);
if (q.get('accent') === 'violet') html.setAttribute('data-accent', 'violet');
if (q.get('dir')) html.setAttribute('dir', q.get('dir')!);
(window as any).__STORIES__ = stories.map((s) => ({ id: s.id, isolate: !!s.isolate, states: s.states.map((x) => x.name) }));

function Page() {
  const s = stories.find((x) => x.id === id);
  if (!s) return <main className="h-index"><h1>Stories</h1><ul>{stories.map((x) => <li key={x.id}><a href={`#/${x.id}`}>{x.title}</a></li>)}</ul></main>;
  const states = stateIx !== undefined ? [s.states[Number(stateIx)]] : s.states;
  return (
    <main className="h-page" data-story={s.id}>
      <h1>{s.title}</h1>
      {states.map((st) => (
        <section key={st.name} className={st.wide || s.isolate ? 'h-state wide' : 'h-state'} aria-label={st.name}>
          <h2>{st.name}</h2>
          <div className="h-canvas">{st.render()}</div>
        </section>
      ))}
    </main>
  );
}
createRoot(document.getElementById('root')!).render(<StrictMode><Wrap><Page /></Wrap></StrictMode>);
