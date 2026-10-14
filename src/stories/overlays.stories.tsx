import { useState, type ReactNode } from 'react';
import { Button } from '../core/Button';
import { IconButton } from '../core/IconButton';
import { SegmentedControl } from '../core/SegmentedControl';
import { CopyIcon, DownloadIcon, EditIcon, LinkIcon, MoreHorizontalIcon, TrashIcon, StarIcon, FolderIcon } from '../core/icons';
import { Inline, Stack } from '../layout';
import { ConfirmDialog, ContextMenu, Dialog, DialogFooter, Drawer, Menu, MenuButton, Popover, Sheet, SheetSection, type MenuEntry } from '../overlays';
import { Accordion, Disclosure, HelpButton, Stepper, Tour } from '../disclosure';
import { ChatComposer, ChatThread, CodeBlock, Markdown, ReadableData, type ChatMessage } from '../content';
import type { Story } from './types';

const Row = ({ k, children }: { k: string; children: ReactNode }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, fontSize: 'var(--fs-sm)' }}><span style={{ color: 'var(--ink-3)' }}>{k}</span><b style={{ fontWeight: 600, minWidth: 0, textAlign: 'end' }}>{children}</b></div>
);
const Field = ({ label, id, defaultValue }: { label: string; id: string; defaultValue?: string }) => (
  <label htmlFor={id} style={{ display: 'grid', gap: 6, fontSize: 'var(--fs-sm)', fontWeight: 600 }}>{label}
    <input id={id} defaultValue={defaultValue} style={{ height: 'var(--h-md)', padding: '0 12px', borderRadius: 'var(--r-control)', border: '1px solid var(--control-line)', background: 'var(--surface)', color: 'var(--ink)', fontWeight: 400 }} />
  </label>
);
const Hero = ({ title, sub }: { title: string; sub: string }) => (
  <div style={{ padding: '26px 24px 20px', background: 'radial-gradient(120% 140% at 0% 0%, var(--hero-a), transparent 60%), radial-gradient(90% 120% at 70% 10%, var(--hero-b), transparent 60%), var(--surface)' }}>
    <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--ink-2)', fontWeight: 600 }}>{sub}</div>
    <div style={{ fontSize: 'var(--fs-2xl)', fontWeight: 800, lineHeight: 1.15 }}>{title}</div>
  </div>
);

function SheetWithConfirm() {
  const [confirm, setConfirm] = useState(false);
  return (
    <Sheet defaultOpen kicker="Member" title="Nadia Fares" description="nadia@thearlab.com" footer={<Button>Close</Button>}>
      <SheetSection title="Access"><Row k="Role">Member</Row><Row k="Added by">Laure</Row><Row k="Added">3 Oct</Row></SheetSection>
      <SheetSection title="Remove" description="Take away their access to this tool.">
        <div><Button variant="danger" size="sm" onClick={() => setConfirm(true)}>Remove</Button></div>
      </SheetSection>
      <ConfirmDialog open={confirm} onOpenChange={setConfirm} title="Remove this member?" confirmLabel="Remove Nadia"
        onConfirm={() => new Promise((r) => setTimeout(r, 900))}>
        <b>nadia@thearlab.com</b> loses access the next time they load the tool. You can add them back at any time.
      </ConfirmDialog>
    </Sheet>
  );
}

function MenuDemo() {
  const [view, setView] = useState('board');
  const [pinned, setPinned] = useState(true);
  const items: MenuEntry[] = [
    { type: 'group', label: 'Project', items: [
      { label: 'Rename…', icon: <EditIcon />, shortcut: 'mod+r' },
      { label: 'Copy link', icon: <LinkIcon />, shortcut: 'mod+shift+c' },
      { label: 'Duplicate', icon: <CopyIcon />, description: 'Copies the tasks, not the files' },
      { label: 'Move to', icon: <FolderIcon />, submenu: [{ label: 'Creative' }, { label: 'Engineering' }, { label: 'Client servicing' }] },
    ] },
    { type: 'separator' },
    { type: 'group', label: 'View', items: [
      { label: 'Board', type: 'radio', checked: view === 'board', onSelect: () => setView('board') },
      { label: 'Table', type: 'radio', checked: view === 'table', onSelect: () => setView('table') },
      { label: 'Pinned to Home', type: 'checkbox', checked: pinned, onSelect: () => setPinned(!pinned) },
    ] },
    { type: 'separator' },
    { label: 'Export CSV', icon: <DownloadIcon />, disabled: true },
    { label: 'Delete project…', icon: <TrashIcon />, tone: 'danger' },
  ];
  return <MenuButton items={items} defaultOpen>Project actions</MenuButton>;
}

function ChatDemo() {
  const t = (h: number, m: number, d = 0) => { const x = new Date(); x.setDate(x.getDate() - d); x.setHours(h, m, 0, 0); return x.toISOString(); };
  const [msgs, setMsgs] = useState<ChatMessage[]>([
    { id: '1', from: 'them', author: 'Labby', time: t(9, 2, 1), text: 'Morning. 9 of your projects need someone today.' },
    { id: '2', from: 'them', author: 'Labby', time: t(9, 2), text: 'Msheireb Street Scavenger Hunt is blocked on the client voiceover.' },
    { id: '3', from: 'them', author: 'Labby', time: t(9, 3), text: 'Disney, Toy Story 5 is at risk: V1 shipped, client feedback pending.' },
    { id: '4', from: 'me', time: t(9, 15), text: 'Open the at-risk ones' },
    { id: '5', from: 'me', time: t(9, 16), text: 'And send the Fanta team a reminder', status: 'failed' },
    { id: '6', from: 'me', time: t(9, 17), text: 'Thanks', status: 'pending' },
  ]);
  return (
    <div style={{ height: 460, display: 'grid', gridTemplateRows: 'minmax(0, 1fr) auto', gap: 12, maxWidth: 520 }}>
      <ChatThread label="Labby, this morning" messages={msgs} onRetry={() => {}} typing="Labby is writing" />
      <ChatComposer onSend={(text) => setMsgs((m) => [...m, { id: String(m.length + 1), from: 'me', time: new Date().toISOString(), text }])} />
    </div>
  );
}

const DOC = `## Release notes

The **Project Assessment** flow now pauses for a lead's approval before pricing. Read the [assessment guide](/browse/engineering/assessment.md) or the [HIG library](https://docs.thearlab.com).

- Runs pause for answers and approvals
- [x] Gates show the *whole* thing being approved
- [ ] Email digest

1. Open the brief
2. Press \`Start\`

> Never hand an upstream error body to the browser.

| Step | Owner | Days |
|:--|:--|--:|
| Assess | Lead | 1 |
| Price | PM | 2 |

\`\`\`ts
const run = await startRun({ brief });
\`\`\`
`;

export const stories: Story[] = [
  {
    id: 'dialog', title: 'Dialog', group: 'Overlays', components: ['Dialog', 'DialogFooter'], isolate: true,
    summary: 'A centred modal for confirmations and short focused tasks, and the detail popup (verdict first). Long forms go in a Sheet.',
    usage: `<Dialog open={open} onOpenChange={setOpen} title="Rename the project" footer={<DialogFooter><Button>Cancel</Button><Button variant="primary">Rename</Button></DialogFooter>}>…</Dialog>`,
    a11y: ['role=dialog, aria-modal, labelled by its title and described by its description.', 'Focus moves in (first field, or `data-autofocus`), Tab stays inside, Esc closes and focus returns to the opener.', 'The page behind does not scroll. One dialog at a time; on a phone it rises from the bottom.'],
    covers: ['Dialog', 'DialogFooter', 'Viewer'],
    states: [
      { name: 'Short task', render: () => <Dialog defaultOpen title="Rename the project" description="The new name shows everywhere at once, including the tracker." footer={<DialogFooter><Button>Cancel</Button><Button variant="primary">Rename</Button></DialogFooter>}><Field id="dn" label="Project name" defaultValue="Msheireb Street Scavenger Hunt" /></Dialog> },
      { name: 'Detail popup, verdict first', render: () => (
        <Dialog defaultOpen size="xl" title="Next step" hero={<Hero sub="Snapchat Lens, Complex" title="Msheireb Street Scavenger Hunt" />}
          footer={<DialogFooter><Button>Close</Button><Button variant="primary">Open as page</Button></DialogFooter>}>
          <Stack gap="sm">
            <div style={{ background: 'var(--bad-soft)', borderRadius: 16, padding: '14px 16px' }}><div style={{ color: 'var(--bad)', fontWeight: 700, fontSize: 'var(--fs-sm)' }}>Blocked</div><div style={{ fontWeight: 700 }}>Waiting for client voiceover</div></div>
            <p style={{ margin: 0, color: 'var(--ink-2)' }}>Get the voiceover from the client, then finish the build.</p>
          </Stack>
        </Dialog>) },
      { name: 'Long content scrolls inside', render: () => <Dialog defaultOpen size="sm" title="What changed" footer={<DialogFooter><Button variant="primary">Got it</Button></DialogFooter>}>{Array.from({ length: 14 }, (_, i) => <p key={i} style={{ margin: '0 0 10px', color: 'var(--ink-2)' }}>Change {i + 1}: the board now remembers its filters per person.</p>)}</Dialog> },
    ],
  },
  {
    id: 'confirm-dialog', title: 'Confirm', group: 'Overlays', components: ['ConfirmDialog'], isolate: true,
    summary: 'Asks before a destructive or outward change: what happens, to what, whether it can be undone. The action is named in full; "Keep it" is the way out.',
    usage: `<ConfirmDialog open={ask} onOpenChange={setAsk} title="Revoke the Labby key?" confirmLabel="Revoke the key" onConfirm={() => revoke(id)}>It has made 1,394 calls. Labby stops working until it gets a new key. This cannot be undone.</ConfirmDialog>`,
    a11y: ['role=alertdialog; focus starts on the safe choice.', 'While the promise runs: "Working", both buttons disabled, Esc ignored. A failure is shown in the dialog (role=alert).'],
    covers: [],
    states: [
      { name: 'Destructive', render: () => <ConfirmDialog defaultOpen title="Revoke the Labby key?" confirmLabel="Revoke the key" onConfirm={() => {}}>It has made 1,394 calls, the last one 2 h ago. Labby stops working until it gets a new key. This cannot be undone.</ConfirmDialog> },
      { name: 'Calm save', render: () => <ConfirmDialog defaultOpen tone="accent" title="Save who gets Daily status?" confirmLabel="Save" cancelLabel="Not yet" onConfirm={() => {}}>It applies from the next message Labby sends.</ConfirmDialog> },
    ],
  },
  {
    id: 'sheet', title: 'Sheet', group: 'Overlays', components: ['Sheet', 'SheetSection'], isolate: true,
    summary: 'A side sheet (about 620px) for reading a record, editing it, or a long form, so the page stays where it was. A bottom sheet on phones.',
    usage: `<Sheet open={!!sel} onOpenChange={(o) => !o && setSel(null)} kicker="Member" title={name} footer={<Button>Close</Button>}>\n  <SheetSection title="Access">…</SheetSection>\n</Sheet>`,
    a11y: ['Modal: focus trapped and returned, Esc closes, the page behind does not scroll.', 'A confirm can open on top; Esc closes only the confirm.'],
    covers: ['Sheet', 'SheetSection'],
    states: [
      { name: 'Read a record, with a confirm', render: () => <SheetWithConfirm /> },
      { name: 'Long form', render: () => (
        <Sheet defaultOpen kicker="Add a member" title="New member" footer={<><Button>Cancel</Button><Button variant="primary">Add member</Button></>}>
          <SheetSection title="Who"><Field id="se" label="Their ARLAB email" /><Field id="sn" label="Name (optional)" /></SheetSection>
          <SheetSection title="Access"><SegmentedControl label="Role" defaultValue="member" options={[{ value: 'member', label: 'Member' }, { value: 'owner', label: 'Owner' }]} /></SheetSection>
          <SheetSection title="Note">{Array.from({ length: 6 }, (_, i) => <p key={i} style={{ margin: 0, color: 'var(--ink-2)' }}>They still sign in with ARLAB ID. Adding someone who has never signed in is fine.</p>)}</SheetSection>
        </Sheet>) },
      { name: 'Grid cell (Agent, Mon 13 Oct)', render: () => <Sheet defaultOpen kicker="Agent, Mon 13 Oct" title="scout-rate" description="12 runs, $0.91."><SheetSection>{['09:02 Laure $0.08', '09:40 Labby $0.11', '11:15 Patil $0.07'].map((x) => <Row key={x} k={x.slice(0, 5)}>{x.slice(6)}</Row>)}</SheetSection></Sheet> },
      { name: 'Bottom sheet', render: () => <Sheet defaultOpen side="bottom" title="Filters" footer={<><Button>Clear</Button><Button variant="primary">Show 24 projects</Button></>}><SheetSection title="Status"><SegmentedControl label="Status" defaultValue="all" options={[{ value: 'all', label: 'Every status' }, { value: 'risk', label: 'At risk' }, { value: 'blocked', label: 'Blocked' }]} /></SheetSection></Sheet> },
    ],
  },
  {
    id: 'drawer', title: 'Drawer', group: 'Overlays', components: ['Drawer'], isolate: true,
    summary: 'A non-modal side panel for filters, a phone navigation list or a companion panel. The page stays usable.',
    a11y: ['A labelled landmark (aside). Focus moves in when it opens; Esc inside it closes it and focus goes back.'],
    covers: [],
    states: [
      { name: 'Overlay, right', render: () => <Drawer defaultOpen title="Filters" footer={<Button variant="primary">Apply</Button>}><Field id="df" label="Client" /><Field id="ds" label="Service" /></Drawer> },
      { name: 'Push, in the layout', render: () => <div style={{ display: 'flex', gap: 16, height: 320 }}><Drawer defaultOpen mode="push" side="left" width={260} title="Areas"><Stack gap="xs">{['Home', 'Projects', 'Clients', 'People'].map((x) => <Button key={x} variant="ghost" block>{x}</Button>)}</Stack></Drawer><div style={{ flex: 1, minWidth: 0, color: 'var(--ink-2)' }}>The page keeps its width minus the drawer.</div></div> },
    ],
  },
  {
    id: 'popover', title: 'Popover', group: 'Overlays', components: ['Popover'], isolate: true,
    summary: 'A small surface anchored to its control: a few fields (an edit popover) or a few facts. Never a warning. A bottom sheet on phones.',
    usage: `<Popover trigger={<Button>Edit title</Button>} title="Page title" footer={<Button variant="primary">Save</Button>}>…</Popover>`,
    a11y: ['The trigger gets aria-expanded and aria-controls. Focus moves to the first field (or stays on the trigger with focus="trigger").', 'Esc, a click outside or tabbing out closes it; focus returns to the trigger.'],
    covers: ['Popover', 'EditPopover'],
    states: [
      { name: 'Edit popover', render: () => <Popover defaultOpen trigger={<Button icon={<EditIcon />}>Edit title</Button>} title="Page title" sub="Google shows about 60 characters" footer={<><Button size="sm">Cancel</Button><Button size="sm" variant="primary">Save</Button></>}><Field id="pt" label="Title" defaultValue="Sephora Mascara 3D Pin Map | theARLab" /></Popover> },
      { name: 'Facts, with an arrow', render: () => <Popover defaultOpen arrow focus="trigger" aria-label="Key details" trigger={<Button variant="ghost">Key details</Button>}><Row k="Starts with">cak_live_7f…</Row><Row k="Can reach">Knowledge, read only</Row><Row k="Made by">Laure</Row></Popover> },
    ],
  },
  {
    id: 'menu', title: 'Menu', group: 'Overlays', components: ['MenuButton', 'Menu'], isolate: true,
    summary: 'Commands behind a button: verbs first, most used on top, groups and separators, "…" when more input follows. Checkbox and radio items, one submenu level.',
    usage: `<MenuButton items={[{ label: 'Rename…', onSelect: rename }, { type: 'separator' }, { label: 'Delete…', tone: 'danger', onSelect: ask }]}>Actions</MenuButton>`,
    a11y: ['APG menu button: Down or Enter opens on the first item, Up on the last; arrows, Home, End and type-ahead move; Enter or Space chooses.', 'Right opens a submenu, Left or Esc goes back; Esc on the menu closes it and returns focus; Tab closes it.'],
    covers: [],
    states: [
      { name: 'Every kind of item', render: () => <MenuDemo /> },
      { name: 'Icon trigger', render: () => <MenuButton trigger={<IconButton label="More actions" variant="secondary"><MoreHorizontalIcon /></IconButton>} items={[{ label: 'Pin', icon: <StarIcon /> }, { label: 'Copy link', icon: <LinkIcon /> }, { type: 'separator' }, { label: 'Delete', icon: <TrashIcon />, tone: 'danger' }]} /> },
      { name: 'Always shown', render: () => <div style={{ maxWidth: 260 }}><Menu label="Sort by" initial={-1} onClose={() => {}} items={[{ label: 'Newest first', type: 'radio', checked: true }, { label: 'Oldest first', type: 'radio' }, { label: 'Name', type: 'radio' }]} /></div> },
    ],
  },
  {
    id: 'context-menu', title: 'Context menu', group: 'Overlays', components: ['ContextMenu'],
    summary: 'A few actions for one item on right click, Shift+F10 or the Menu key. Every action must also exist somewhere visible.',
    a11y: ['The target must be focusable. Shift+F10 or the Menu key opens the menu on it; the menu behaves like any Menu.'],
    covers: [],
    states: [{ name: 'Right click the card', render: () => (
      <ContextMenu label="Actions for Labby key" items={[{ label: 'Copy prefix', icon: <CopyIcon /> }, { label: 'Rename…', icon: <EditIcon /> }, { type: 'separator' }, { label: 'Revoke…', icon: <TrashIcon />, tone: 'danger' }]}>
        <div tabIndex={0} style={{ padding: 16, borderRadius: 16, background: 'var(--surface)', boxShadow: 'var(--shadow-1)', maxWidth: 320 }}><b>Labby key</b><div style={{ color: 'var(--ink-3)', fontSize: 'var(--fs-sm)' }}>Right click, or focus and press Shift+F10</div></div>
      </ContextMenu>) }],
  },
  {
    id: 'accordion', title: 'Accordion', group: 'Disclosure', components: ['Accordion'],
    summary: 'Stacked sections that open and close, for settings and FAQs where people need one part at a time.',
    a11y: ['Each title is a button inside a heading with aria-expanded; the panel is a region labelled by it.', 'Up and Down move between titles, Home and End jump. Closed panels are hidden from the tab order.'],
    covers: [],
    states: [
      { name: 'Single', render: () => <Accordion type="single" defaultValue={['a']} items={[{ id: 'a', title: 'Who gets in', meta: 'Invite only', content: 'Only the people listed can use this tool.' }, { id: 'b', title: 'Messages', meta: '3 on', content: 'Daily status at 09:00 Beirut, to leads.' }, { id: 'c', title: 'Danger zone', content: 'Delete the tool and its data.' }]} /> },
      { name: 'Multiple, disabled item', render: () => <Accordion defaultValue={['a', 'b']} items={[{ id: 'a', title: 'Agent', content: 'scout-rate, version 1.2.0' }, { id: 'b', title: 'Key', content: 'cak_live_7f…, knowledge read only' }, { id: 'c', title: 'Billing', content: '', disabled: true }]} /> },
    ],
  },
  {
    id: 'disclosure', title: 'Disclosure', group: 'Disclosure', components: ['Disclosure'],
    summary: 'One titled section that shows and hides its details. Plain for a "more options" link, panel for a page section.',
    a11y: ['The title row is a role=button with aria-expanded (a read-only fieldset cannot lock it); Enter and Space toggle.'],
    covers: ['Disclosure', 'Collapsible'],
    states: [
      { name: 'Panel, open', render: () => <Disclosure defaultOpen title="Advanced" meta="4 settings" actions={<Button size="sm" variant="ghost">Reset</Button>}><p style={{ margin: 0, color: 'var(--ink-2)' }}>Retries, timeout and the fallback model.</p></Disclosure> },
      { name: 'Panel, closed, long title', render: () => <Disclosure title="Every message Labby sends on its own, with who gets it and when" meta="12" /> },
      { name: 'Plain', render: () => <Disclosure variant="plain" title="More options"><p style={{ margin: 0, color: 'var(--ink-2)' }}>Show archived projects too.</p></Disclosure> },
    ],
  },
  {
    id: 'stepper', title: 'Stepper', group: 'Disclosure', components: ['Stepper'],
    summary: 'Where a multi-step job is up to: done, current, upcoming, needs attention. Shape and words, not colour alone.',
    a11y: ['An ordered list; the current step has aria-current="step"; each step says its state to screen readers.'],
    covers: ['Steps'],
    states: [
      { name: 'Horizontal', render: () => <Stepper current={2} label="Assessment" steps={[{ title: 'Brief' }, { title: 'Questions', description: '3 answered' }, { title: 'Assess' }, { title: 'Price' }, { title: 'Send' }]} /> },
      { name: 'Vertical, with an error', render: () => <Stepper orientation="vertical" current={2} steps={[{ title: 'Assess', description: 'Done in 40 s' }, { title: 'Price', description: 'Approved by Laure' }, { title: 'Send', description: 'The email bounced', status: 'error' }]} /> },
      { name: 'Clickable finished steps', render: () => <Stepper current={2} onStepClick={() => {}} steps={[{ title: 'Details' }, { title: 'Media' }, { title: 'Review' }]} /> },
    ],
  },
  {
    id: 'tour', title: 'Tour', group: 'Disclosure', components: ['Tour', 'HelpButton', 'useTour'], isolate: true,
    summary: 'The "?" tour every tool keeps: 3 to 5 steps on the key areas, opens once per person and version, the ? reopens it.',
    usage: `const tour = useTour({ app: 'my-tool', version: 1, seen, ready });\n<HelpButton onClick={tour.start} expanded={tour.open} />\n<Tour steps={TOUR} open={tour.open} onClose={tour.close} />`,
    a11y: ['A non-modal dialog beside its target; Right or Enter next, Left back, Esc skips; focus returns to the ?.', 'Steps whose target is not on screen are skipped.'],
    covers: ['Tour', 'HelpButton'],
    states: [{ name: 'Open on step 1', render: () => (
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderRadius: 16, background: 'var(--surface)' }}>
        <Inline><Button data-tour="nav-projects">Projects</Button><Button data-tour="nav-clients">Clients</Button></Inline>
        <HelpButton expanded />
        <Tour open onClose={() => {}} steps={[{ target: '[data-tour="nav-projects"]', title: 'Projects', body: 'Every live project and where it is up to.' }, { target: '[data-tour="nav-clients"]', title: 'Clients', body: 'Briefs and brand guidelines per client.' }, { target: '[data-tour="help"]', title: 'Come back any time', body: 'Press ? to see this tour again.' }]} />
      </div>) }],
  },
  {
    id: 'chat', title: 'Chat', group: 'Messaging and code', components: ['ChatThread', 'ChatBubble', 'ChatComposer'],
    summary: 'A conversation with Labby or a person: grouped by day and author, newest kept in view, pending and failed messages said in words.',
    a11y: ['The thread is role=log (new messages announced politely) and scrolls with the keyboard.', 'Enter sends, Shift+Enter is a new line. A failed message says "Not sent" and offers Retry.'],
    covers: [],
    states: [
      { name: 'Thread and composer', render: () => <ChatDemo /> },
      { name: 'Empty', render: () => <div style={{ height: 200, maxWidth: 520 }}><ChatThread label="Ask ARLAB" messages={[]} empty="Ask about any project, client or doc." /></div> },
      { name: 'Composer, sending', render: () => <div style={{ maxWidth: 520 }}><ChatComposer defaultValue="Draft the client update" sending onSend={() => {}} /></div> },
    ],
  },
  {
    id: 'code-block', title: 'Code block', group: 'Messaging and code', components: ['CodeBlock', 'CopyButton'],
    summary: 'Code in the mono font with a copy button. Long lines scroll inside the block or wrap.',
    a11y: ['The code region takes keyboard focus so it can be scrolled; Copy says "Copied" to screen readers.'],
    covers: [],
    states: [
      { name: 'With line numbers', render: () => <CodeBlock language="ts" title="functions/agent/run.ts" lineNumbers code={`export const onRequestPost = async ({ request, env }) => {\n  const input = await request.json();\n  return relay(await upstream(\`\${env.RUNNER_API}/skills/\${env.AGENT_ID}/run\`, { method: 'POST', body: JSON.stringify(input) }), 'agent');\n};`} /> },
      { name: 'Long line, wrapped', render: () => <CodeBlock language="bash" wrap code={'CLOUDFLARE_ACCOUNT_ID=767129560a477f3ffd0bc49cd9caa0b3 npx wrangler pages deploy dist --project-name arlab-ui-showcase --branch v2 --commit-dirty=true'} /> },
      { name: 'Long line, scrolls', render: () => <CodeBlock language="json" code={'{"runId":"8f2c1a90-3b7e-4d51-9c0a-77e1f2a4b6c8","status":"awaiting","pending":[{"eventId":"approve-price-1","render":"Approve the price"}]}'} /> },
    ],
  },
  {
    id: 'markdown', title: 'Markdown', group: 'Messaging and code', components: ['Markdown'],
    summary: 'Renders Markdown safely as React elements. Raw HTML stays text; links keep only safe addresses.',
    a11y: ['Headings start at h2 by default so the page keeps one h1. External links say they open a new tab.'],
    covers: ['Md'],
    states: [
      { name: 'A document', render: () => <Markdown>{DOC}</Markdown> },
      { name: 'Unsafe input stays harmless', render: () => <Markdown>{'A [bad link](javascript:alert(1)) and <img src=x onerror=alert(1)> stay as text.'}</Markdown> },
      { name: 'Compact', render: () => <Markdown compact>{'**Blocked**: waiting for the client voiceover. Next: chase it on `#fanta`.'}</Markdown> },
    ],
  },
  {
    id: 'readable-data', title: 'Readable data', group: 'Messaging and code', components: ['ReadableData'],
    summary: 'Any agent or workflow result as a readable document, never a JSON blob.',
    covers: ['ReadableDoc'],
    states: [{ name: 'A result', render: () => <ReadableData value={{ verdict: 'Complex', points: 34, lensType: 'World, with a 3D pin map', risks: ['Client voiceover late', 'Three languages'], team: { lead: 'Nadia Fares', developer: 'Hadi' }, approved: true, notes: '' }} /> }],
  },
];
