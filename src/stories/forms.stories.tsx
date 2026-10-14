import { useState } from 'react';
import {
  Checkbox, CheckboxGroup, Combobox, DatePicker, Field, FileUploader, Form, FormActions, FormGrid, FormSection, Input, MediaGallery,
  MultiSelect, NumberInput, RadioGroup, SaveBar, SearchInput, Select, Slider, Switch, TagInput, Textarea, TimePicker, withAllOption,
} from '../forms';
import { Button } from '../core';
import { GlobeIcon } from '../core/icons';
import { Inline, Stack } from '../layout';
import type { Story } from './types';

const KINDS = withAllOption('Every kind', [
  { value: 'knowledge', label: 'Knowledge key', count: 14 }, { value: 'agent', label: 'Agent key', count: 9 }, { value: 'app', label: 'App key', count: 5 },
]);
const PEOPLE = ['Laure', 'Nadia Fares', 'Habib S.', 'Hadi', 'Walaa AlSalem', 'Rafi', 'Aya', 'Yasmina Muslimany', 'Manon Darrouzes', 'Rita Allam', 'Patil'];
const PEOPLE_OPTS = withAllOption('Everyone', PEOPLE.map((p, i) => ({ value: p.toLowerCase().replace(/\W+/g, '-'), label: p, count: (i * 7) % 23 + 1 })));
const DEPTS = [{ value: 'company', label: 'Company' }, { value: 'engineering', label: 'Engineering' }, { value: 'creative', label: 'Creative' }, { value: 'clients-servicing', label: 'Client servicing' }, { value: 'strategy-growth', label: 'Strategy and growth' }];
const SERVICES = ['Snapchat Lens', 'TikTok effect', 'WebAR', 'Interactive screens', 'On-ground activation', 'Spectacles', 'Instagram filter'].map((s) => ({ value: s, label: s }));

const thumb = (a: string, b: string) => `data:image/svg+xml;utf8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="160" height="120"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient></defs><rect width="160" height="120" fill="url(#g)"/><circle cx="118" cy="38" r="16" fill="#fff" fill-opacity=".5"/></svg>`)}`;
const MEDIA = [['#B3109C', '#F8DDF3', 'Sephora pin map, cover'], ['#6D4AE8', '#E9DEFF', 'Disney Toy Story 5, key art'], ['#C2661A', '#FFE8DE', 'Fanta marker, frame 1'], ['#1F8A6E', '#E3F4EC', 'Msheireb hunt, clue card'], ['#2F6FE0', '#E5EDFD', 'TikTok symphony, end card'], ['#C9403F', '#FCE7E3', 'Ram clinics, booth']].map(([a, b, alt], i) => ({ id: `m${i}`, src: thumb(a, b), alt, caption: `${alt.split(',')[0]}.${i === 1 ? 'mp4' : 'jpg'}`, kind: (i === 1 ? 'video' : 'image') as 'video' | 'image', disabled: i === 5 }));

function NumberDemo() { const [n, setN] = useState<number | null>(8); return <Field label="Hours this week" help="Up to 60, in half hours."><NumberInput value={n} onChange={setN} min={0} max={60} step={0.5} unit="h" /></Field>; }
function SaveDemo() {
  const [changed, setChanged] = useState(['Title', 'Description', 'Cover']);
  const [saving, setSaving] = useState(false);
  return <SaveBar sticky={false} changed={changed} saving={saving} note="Nothing changes on the site until you save." onDiscard={() => setChanged([])} onSave={() => { setSaving(true); setTimeout(() => { setSaving(false); setChanged([]); }, 900); }} />;
}
const fakeUpload = (file: File, onProgress: (n: number) => void) => new Promise<void>((res, rej) => { let p = 0; const t = setInterval(() => { p += 20; onProgress(p); if (p >= 100) { clearInterval(t); file.name.includes('fail') ? rej(new Error('The connection dropped. Try again.')) : res(); } }, 200); });

export const stories: Story[] = [
  {
    id: 'field', title: 'Field', group: 'Forms', components: ['Field', 'useFieldProps'],
    summary: 'A label, the control, help and the error, wired for screen readers. Every form control goes in one.',
    usage: `<Field label="Project name" help="As the client says it." error={err}>\n  <Input value={name} onChange={(e) => setName(e.target.value)} />\n</Field>`,
    a11y: ['The label is a real <label for>.', 'Help and error are linked with aria-describedby; an error sets aria-invalid.', 'Required shows a star and sets required.'],
    covers: ['Field', 'FieldRow'],
    states: [
      { name: 'Label and help', render: () => <Field label="Project name" help="As the client says it, not the internal code name."><Input placeholder="Msheireb Street Scavenger Hunt" /></Field> },
      { name: 'Required and optional', render: () => <Stack gap="sm"><Field label="Client" required><Input defaultValue="Msheireb Properties" /></Field><Field label="Purchase order" optional><Input /></Field></Stack> },
      { name: 'Error', render: () => <Field label="Work email" error="That does not look like an email address. Use name@thearlab.com." required><Input defaultValue="laure@thearlab" /></Field> },
      { name: 'Disabled', render: () => <Field label="Created by" disabled help="Set when the brief came in."><Input defaultValue="Labby" /></Field> },
      { name: 'Inline (settings row)', render: () => <Field inline label="Weekly digest day" help="When Labby sends the summary."><Select aria-label="Day" defaultValue="mon" options={[{ value: 'mon', label: 'Monday' }, { value: 'fri', label: 'Friday' }]} /></Field> },
    ],
  },
  {
    id: 'input', title: 'Input', group: 'Forms', components: ['Input'],
    summary: 'One line of text. The placeholder is a hint, never the label.',
    usage: `<Field label="Website"><Input prefix="https://" clearable /></Field>`,
    covers: ['Input'],
    states: [
      { name: 'Default and placeholder', render: () => <Stack gap="sm"><Field label="Name"><Input defaultValue="Nadia Fares" /></Field><Field label="Role"><Input placeholder="Producer, developer, PM" /></Field></Stack> },
      { name: 'Prefix, suffix, clearable', render: () => <Stack gap="sm"><Field label="Website"><Input prefix={<GlobeIcon size={16} />} defaultValue="thearlab.com" clearable /></Field><Field label="Budget"><Input prefix="$" suffix="USD" inputMode="decimal" defaultValue="12,500" /></Field></Stack> },
      { name: 'Sizes', render: () => <Stack gap="sm"><Input size="sm" aria-label="Small" placeholder="Small" /><Input aria-label="Medium" placeholder="Medium" /><Input size="lg" aria-label="Large" placeholder="Large" /></Stack> },
      { name: 'Invalid, disabled, read only', render: () => <Stack gap="sm"><Field label="Slug" error="Only lowercase letters, digits and dashes."><Input defaultValue="Msheireb Hunt!" /></Field><Field label="Engine id" disabled><Input defaultValue="prj_8c1f" /></Field><Field label="Created"><Input readOnly defaultValue="14 Oct 2026" /></Field></Stack> },
      { name: 'Long value', render: () => <div style={{ maxWidth: 260 }}><Field label="Title"><Input defaultValue="Disney, Toy Story 5 | AR Lens Concept Deck | Snapchat | Sept 2026 | final final v3" /></Field></div> },
    ],
  },
  {
    id: 'textarea', title: 'Textarea', group: 'Forms', components: ['Textarea'],
    summary: 'Several lines. Auto-grow for notes, a count when there is a limit.',
    covers: ['Textarea'],
    states: [
      { name: 'Default', render: () => <Field label="Notes for the team"><Textarea placeholder="What should the team know before they start?" /></Field> },
      { name: 'Auto-grow with a count', render: () => <Field label="Description" help="Shown in Google. Aim for 120 to 160 characters."><Textarea autoGrow rows={2} showCount maxLength={160} defaultValue="A 3D pin map Snapchat Lens for Sephora's new mascara launch in the UAE, with a hunt across Dubai Mall." /></Field> },
      { name: 'Error and disabled', render: () => <Stack gap="sm"><Field label="Brief" error="Write at least one sentence about the goal."><Textarea rows={2} /></Field><Field label="Client feedback" disabled><Textarea rows={2} defaultValue="Approved on 12 Oct." /></Field></Stack> },
    ],
  },
  {
    id: 'number-input', title: 'Number input', group: 'Forms', components: ['NumberInput'],
    summary: 'A number with − and +. Arrow keys step, Page keys step by ten, the value is clamped when you leave the field.',
    a11y: ['A spinbutton with aria-valuenow, min and max.', 'The − and + buttons are for pointers; keyboard users use the arrows.'],
    covers: [],
    states: [
      { name: 'Default', render: () => <NumberDemo /> },
      { name: 'Empty, bare, disabled', render: () => <Stack gap="sm"><Field label="Seats"><NumberInput min={1} max={20} placeholder="1 to 20" /></Field><Field label="Points"><NumberInput hideSteppers defaultValue={13} /></Field><Field label="Days" disabled><NumberInput defaultValue={3} /></Field></Stack> },
      { name: 'At the limit and invalid', render: () => <Field label="Discount" error="Over 30% needs Fred's approval."><NumberInput defaultValue={40} min={0} max={100} unit="%" /></Field> },
    ],
  },
  {
    id: 'search-input', title: 'Search input', group: 'Forms', components: ['SearchInput'],
    summary: 'Filters a list as people type. The placeholder names what it searches. Esc clears.',
    covers: [],
    states: [
      { name: 'Empty and filled', render: () => <Stack gap="sm"><SearchInput placeholder="Search briefs and clients" /><SearchInput placeholder="Search keys" defaultValue="labby" /></Stack> },
      { name: 'Small, disabled', render: () => <Inline><SearchInput size="sm" placeholder="Search people" /><SearchInput placeholder="Search agents" disabled /></Inline> },
    ],
  },
  {
    id: 'select', title: 'Select', group: 'Forms', isolate: true, components: ['Select', 'withAllOption'],
    summary: 'The shared dropdown: checkmark column, counts on the right, a search box over 8 options, the "all" phrase first.',
    usage: `<Select aria-label="Kind" value={kind} onChange={setKind}\n  options={withAllOption('Every kind', facets)} />`,
    a11y: ['A button that opens a listbox. Arrows, Home, End and type-ahead move; Enter picks; Esc and Tab close and return focus.', 'Over 8 options the search box takes focus and drives the list (aria-activedescendant).', 'Opens up or down by room and never leaves the window.'],
    covers: ['Select', 'Picker'],
    states: [
      { name: 'Closed, in a filters bar', render: () => <Inline><Select aria-label="Kind" options={KINDS} /><Select aria-label="Use" prefixLabel="Use" defaultValue="unused" options={[{ value: '', label: 'Used or not', count: 28 }, { value: 'unused', label: 'Unused for 30 days', count: 6 }, { value: 'never', label: 'Never used', count: 3 }]} size="sm" /></Inline> },
      { name: 'Open, short list', render: () => <div style={{ minHeight: 230 }}><Select aria-label="Kind" defaultOpen options={KINDS} defaultValue="agent" /></div> },
      { name: 'Open, searchable (over 8)', render: () => <div style={{ minHeight: 420 }}><Field label="Person"><Select defaultOpen options={PEOPLE_OPTS} defaultValue="hadi" /></Field></div> },
      { name: 'Placeholder, error, disabled', render: () => <Stack gap="sm"><Field label="Department" error="Pick the department that owns it." required><Select options={DEPTS} placeholder="Choose a department" defaultValue={undefined as any} value={'' as any} /></Field><Field label="Agent" disabled><Select options={[{ value: 'scout', label: 'scout-rate' }]} /></Field></Stack> },
      { name: 'Disabled option, block', render: () => <Select block aria-label="Period" defaultValue="30" options={[{ value: '1', label: 'Today' }, { value: '7', label: 'Last 7 days' }, { value: '30', label: 'Last 30 days' }, { value: '90', label: 'Last 90 days', disabled: true, description: 'Data is kept 45 days' }]} /> },
    ],
  },
  {
    id: 'combobox', title: 'Combobox', group: 'Forms', isolate: true, components: ['Combobox'],
    summary: 'Type or pick: suggestions filter as you type; allowCustom keeps what was typed. Async lists set loading.',
    a11y: ['An input with role combobox and a listbox. Arrows move, Enter picks, Esc closes then clears.'],
    covers: [],
    states: [
      { name: 'Pick from a list', render: () => <Field label="Service"><Combobox options={SERVICES} defaultValue="WebAR" /></Field> },
      { name: 'Custom values allowed', render: () => <Field label="Client" help="Pick a known client or type a new one."><Combobox allowCustom options={['Msheireb Properties', 'Sephora', 'Disney', 'Fanta', 'Ram Clinics'].map((c) => ({ value: c, label: c }))} placeholder="Client name" /></Field> },
      { name: 'Loading', render: () => <Field label="Agent"><Combobox loading filter={false} options={[]} placeholder="Search agents" /></Field> },
      { name: 'Error, disabled', render: () => <Stack gap="sm"><Field label="Service" error="Pick a service from the list."><Combobox options={SERVICES} /></Field><Field label="Service" disabled><Combobox options={SERVICES} defaultValue="Spectacles" /></Field></Stack> },
    ],
  },
  {
    id: 'multi-select', title: 'Multi select', group: 'Forms', isolate: true, components: ['MultiSelect'],
    summary: 'Choose several: chips in the trigger, checkbox rows, select all and clear, search when long.',
    covers: [],
    states: [
      { name: 'Empty and chosen', render: () => <Stack gap="sm"><Field label="Departments"><MultiSelect options={DEPTS} placeholder="Every department" /></Field><Field label="Departments"><MultiSelect options={DEPTS} defaultValue={['engineering', 'creative', 'company']} /></Field></Stack> },
      { name: 'Open', render: () => <div style={{ minHeight: 330 }}><Field label="Departments"><MultiSelect defaultOpen options={DEPTS} defaultValue={['creative']} /></Field></div> },
      { name: 'Open, searchable', render: () => <div style={{ minHeight: 440 }}><Field label="People"><MultiSelect defaultOpen options={PEOPLE_OPTS.slice(1)} defaultValue={['laure', 'rafi']} /></Field></div> },
      { name: 'Disabled', render: () => <Field label="Departments" disabled><MultiSelect options={DEPTS} defaultValue={['engineering']} /></Field> },
    ],
  },
  {
    id: 'tag-input', title: 'Tag input', group: 'Forms', components: ['TagInput'],
    summary: 'A token field: recipients, tags, clients on a brief. Enter or comma adds, Backspace removes the last.',
    covers: [],
    states: [
      { name: 'With suggestions', render: () => <Field label="Who gets it" help="Company addresses only."><TagInput defaultValue={['laure@thearlab.com', 'fred@thearlab.com']} suggestions={['nadia@thearlab.com', 'habib@thearlab.com', 'walaa@thearlab.com']} validate={(t) => (/^[^@\s]+@thearlab\.com$/.test(t) ? null : 'Use a thearlab.com address.')} /></Field> },
      { name: 'Empty, full, disabled', render: () => <Stack gap="sm"><Field label="Tags"><TagInput placeholder="Add a tag" /></Field><Field label="Two at most"><TagInput max={2} defaultValue={['AR', 'Lens']} /></Field><Field label="Tags" disabled><TagInput defaultValue={['Archived']} /></Field></Stack> },
    ],
  },
  {
    id: 'checkbox', title: 'Checkbox', group: 'Forms', components: ['Checkbox', 'CheckboxGroup'],
    summary: 'Options in dense forms and lists, and picking rows. Indeterminate for "some chosen".',
    covers: ['Checkbox'],
    states: [
      { name: 'States', render: () => <Stack gap="sm"><Checkbox label="Send me the weekly digest" defaultChecked /><Checkbox label="Include archived projects" /><Checkbox label="Some chosen" indeterminate /><Checkbox label="Locked by an admin" disabled defaultChecked /><Checkbox label="I agree to the terms" invalid /></Stack> },
      { name: 'With description', render: () => <Checkbox label="Leads only" description="Only department leads see the daily status of each project." defaultChecked /> },
      { name: 'Group', render: () => <CheckboxGroup legend="Who gets the new-brief email" help="Plus the PM named on the brief." defaultValue={['leads']} options={[{ value: 'leads', label: 'Department leads' }, { value: 'pm', label: 'The PM' }, { value: 'fred', label: 'Fred', description: 'Only for briefs over $20k' }]} /> },
      { name: 'Bare (in a table row)', render: () => <Checkbox aria-label="Select Msheireb Street Scavenger Hunt" /> },
    ],
  },
  {
    id: 'radio-group', title: 'Radio group', group: 'Forms', components: ['RadioGroup', 'Radio'],
    summary: '2 to 5 exclusive choices, all visible. More than 5: a Select.',
    a11y: ['A fieldset with a legend; arrow keys move and choose (native radios).'],
    covers: [],
    states: [
      { name: 'Vertical with descriptions', render: () => <RadioGroup legend="Open the tool to" defaultValue="invited" options={[{ value: 'invited', label: 'Only people I add' }, { value: 'everyone', label: 'Everyone at ARLAB', description: 'They still sign in with ARLAB ID.' }, { value: 'departments', label: 'By department', disabled: true, description: 'Needs ACCESS_MODE = "as-user".' }]} /> },
      { name: 'Horizontal, error', render: () => <RadioGroup orientation="horizontal" legend="Complexity" error="Pick one before you send." options={[{ value: 's', label: 'Simple' }, { value: 'm', label: 'Medium' }, { value: 'c', label: 'Complex' }]} /> },
    ],
  },
  {
    id: 'switch', title: 'Switch', group: 'Forms', components: ['Switch'],
    summary: 'On or off, taking effect at once (settings). For a choice saved with a form, a checkbox.',
    a11y: ['A native checkbox with role switch: Space toggles; state is not colour alone (the thumb moves and shows a tick).'],
    covers: ['Switch'],
    states: [
      { name: 'Settings rows', render: () => <Stack gap="sm" style={{ maxWidth: 420 }}><Switch label="Daily status email" description="Sent at 09:00 Beirut to leads." defaultChecked /><Switch label="Test mode" description="Every message goes to the test addresses only." /><Switch label="Slack reminders" disabled /></Stack> },
      { name: 'Small, label after, bare', render: () => <Inline gap="lg"><Switch size="sm" labelFirst={false} label="Compact" defaultChecked /><Switch aria-label="Show archived" /></Inline> },
    ],
  },
  {
    id: 'slider', title: 'Slider', group: 'Forms', components: ['Slider'],
    summary: 'A value on a range with live feedback. Pair with a number field when exact values matter.',
    covers: [],
    states: [
      { name: 'With value and marks', render: () => <Field label="Monthly cap"><Slider min={0} max={300} step={10} defaultValue={120} showValue format={(v) => `$${v}`} marks={[{ value: 0, label: '$0' }, { value: 150, label: '$150' }, { value: 300, label: '$300' }]} /></Field> },
      { name: 'Plain, disabled', render: () => <Stack gap="sm"><Field label="Opacity"><Slider defaultValue={40} /></Field><Field label="Locked" disabled><Slider defaultValue={70} /></Field></Stack> },
    ],
  },
  {
    id: 'date-picker', title: 'Date picker', group: 'Forms', isolate: true, components: ['DatePicker', 'formatDate'],
    summary: 'Type a date ("14/10/2026") or pick it. Weeks start on Monday; min, max and blocked days.',
    a11y: ['The calendar is a dialog with a grid: arrows by day and week, Page keys by month (Shift by year), Home and End the week, Enter picks, Esc returns to the field.', 'Today is marked with aria-current; blocked days are aria-disabled.'],
    covers: [],
    states: [
      { name: 'Filled and empty', render: () => <Stack gap="sm"><Field label="Live date"><DatePicker defaultValue="2026-10-20" /></Field><Field label="Kick-off" help="Type it or pick it."><DatePicker /></Field></Stack> },
      { name: 'Open with limits', render: () => <div style={{ minHeight: 400 }}><Field label="Delivery"><DatePicker defaultOpen defaultValue="2026-10-20" min="2026-10-08" max="2026-11-15" isDisabled={(d) => [0, 6].includes(new Date(d + 'T00:00').getDay())} /></Field></div> },
      { name: 'Error, disabled', render: () => <Stack gap="sm"><Field label="Live date" error="The live date is before the kick-off."><DatePicker defaultValue="2026-09-01" /></Field><Field label="Created" disabled><DatePicker defaultValue="2026-10-14" /></Field></Stack> },
    ],
  },
  {
    id: 'time-picker', title: 'Time picker', group: 'Forms', components: ['TimePicker'],
    summary: 'A 24 h time: type "9:30" or "9.30 pm", or pick from 15 or 30 minute steps.',
    covers: [],
    states: [
      { name: 'Default', render: () => <Inline align="start"><Field label="Sends at"><TimePicker defaultValue="09:00" /></Field><Field label="Meeting" help="Steps of 15 minutes, working hours."><TimePicker step={15} start="08:00" end="19:00" /></Field></Inline> },
      { name: 'Disabled', render: () => <Field label="Sends at" disabled><TimePicker defaultValue="18:30" /></Field> },
    ],
  },
  {
    id: 'file-uploader', title: 'File uploader', group: 'Forms', components: ['FileUploader'],
    summary: 'Drop or choose files, checked for type, size and count in plain words, with progress, retry and previews.',
    a11y: ['A real button opens the file picker; the drop area is a convenience.', 'Rejected files are listed in an alert; each row has named Remove and Retry buttons; progress is a progressbar.'],
    covers: ['MediaField'],
    states: [
      { name: 'Empty', render: () => <FileUploader accept="image/*,video/*" maxSize={50 * 1024 * 1024} maxFiles={6} title="Drop images or videos here" upload={fakeUpload} /> },
      { name: 'With files (uploading, done, failed)', render: () => <FileUploader upload={fakeUpload} defaultItems={[
        { id: '1', name: 'sephora-pin-map-cover.jpg', size: 482_000, type: 'image/jpeg', status: 'done', url: MEDIA[0].src },
        { id: '2', name: 'toy-story-5-teaser.mp4', size: 18_400_000, type: 'video/mp4', status: 'uploading', progress: 62 },
        { id: '3', name: 'brief-final-final.pdf', size: 2_100_000, type: 'application/pdf', status: 'error', error: 'The connection dropped. Try again.' },
      ]} /> },
      { name: 'One file, disabled', render: () => <FileUploader multiple={false} accept=".pdf" disabled title="Drop the signed contract" /> },
    ],
  },
  {
    id: 'media-gallery', title: 'Media gallery', group: 'Forms', components: ['MediaGallery'],
    summary: 'Pick a picture (or several) from a grid. Arrows move in two dimensions, Space picks.',
    covers: ['Gallery'],
    states: [
      { name: 'Pick one', render: () => <MediaGallery label="Pick a cover picture" items={MEDIA} defaultValue={['m1']} /> },
      { name: 'Pick several, 3 per row', render: () => <MediaGallery label="Pictures for the case study" multiple cols={3} items={MEDIA.slice(0, 5)} defaultValue={['m0', 'm3']} /> },
      { name: 'Empty', render: () => <MediaGallery label="Pictures" items={[]} empty="No pictures on this project yet. Upload some on the Media tab." /> },
    ],
  },
  {
    id: 'form-layout', title: 'Form layout', group: 'Forms', components: ['Form', 'FormSection', 'FormGrid', 'FormActions'],
    summary: 'Sections with a title and a line of purpose, fields in one or two even columns, the primary action last.',
    covers: ['FieldRow'],
    states: [
      { name: 'A brief form', wide: true, render: () => (
        <Form>
          <FormSection title="The project" description="What it is and who it is for.">
            <FormGrid>
              <Field label="Project name" required><Input defaultValue="Msheireb Street Scavenger Hunt" /></Field>
              <Field label="Client" required><Combobox allowCustom options={[{ value: 'Msheireb Properties', label: 'Msheireb Properties' }]} defaultValue="Msheireb Properties" /></Field>
              <Field label="Service"><Select options={SERVICES} defaultValue="Snapchat Lens" /></Field>
              <Field label="Live date"><DatePicker defaultValue="2026-10-20" /></Field>
              <div data-span="full"><Field label="Goal" help="One or two sentences."><Textarea rows={3} autoGrow /></Field></div>
            </FormGrid>
          </FormSection>
          <FormSection aside title="Notifications" description="Who hears about this project and when.">
            <Switch label="Daily status" description="Leads only, 09:00 Beirut." defaultChecked />
            <Switch label="Client satisfaction survey" description="Sent a week after delivery." />
          </FormSection>
          <FormActions start="Saved as a draft 2 min ago."><Button variant="ghost">Cancel</Button><Button variant="primary" type="submit">Send the brief</Button></FormActions>
        </Form>
      ) },
      { name: 'Sticky actions', render: () => <FormActions sticky><Button>Save as draft</Button><Button variant="primary">Publish</Button></FormActions> },
    ],
  },
  {
    id: 'save-bar', title: 'Save bar', group: 'Forms', components: ['SaveBar'],
    summary: 'Unsaved changes, Discard and Save, then "All changes saved". Saving and failure states.',
    a11y: ['A status region: the count, saving and errors are announced.'],
    covers: ['SaveBar'],
    states: [
      { name: 'Unsaved', render: () => <SaveDemo /> },
      { name: 'Saving', render: () => <SaveBar sticky={false} changed={2} saving onSave={() => {}} onDiscard={() => {}} /> },
      { name: 'Saved', render: () => <SaveBar sticky={false} changed={0} onSave={() => {}} onDiscard={() => {}} /> },
      { name: 'Failed', render: () => <SaveBar sticky={false} changed={2} error="The engine did not answer. Your changes are still here." onSave={() => {}} onDiscard={() => {}} /> },
    ],
  },
];
