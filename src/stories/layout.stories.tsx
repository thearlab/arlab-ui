import type { CSSProperties, ReactNode } from 'react';
import { CardGrid, Col, Inline, PageGrid, Stack } from '../layout';
import { Button } from '../core';
import type { Story } from './types';

const box: CSSProperties = { background: 'var(--surface)', borderRadius: 'var(--r-md)', boxShadow: 'var(--shadow-1)', padding: 16, minHeight: 64, color: 'var(--ink-2)', fontSize: 'var(--fs-sm)' };
const B = ({ children, tall }: { children: ReactNode; tall?: boolean }) => <div style={{ ...box, minHeight: tall ? 140 : 64 }}>{children}</div>;

export const stories: Story[] = [
  {
    id: 'page-grid', title: 'Page grid and columns', group: 'Layout', components: ['PageGrid', 'Col'],
    summary: 'The required page layout: 12 columns, spans add up to 12 per row. Answers to its own width, so it works in panes and sheets.',
    usage: `<PageGrid>\n  <Col span={8}><Card /></Col>\n  <Col span={4}><Card /></Col>\n</PageGrid>`,
    covers: ['PageGrid', 'Col'],
    states: [
      { name: '8 + 4, 6 + 6, 3 x 4', wide: true, render: () => <PageGrid><Col span={8}><B tall>8</B></Col><Col span={4}><B>4 (stretches to the row)</B></Col><Col span={6}><B>6</B></Col><Col span={6}><B>6</B></Col>{[1, 2, 3, 4].map((n) => <Col key={n} span={3}><B>3</B></Col>)}</PageGrid> },
      { name: '9 + 3, stacked in a column', wide: true, render: () => <PageGrid><Col span={9}><B tall>9</B></Col><Col span={3}><B>3, first</B><B>3, second</B></Col></PageGrid> },
    ],
  },
  {
    id: 'card-grid', title: 'Card grid', group: 'Layout', components: ['CardGrid'],
    summary: 'Equal-height cards in even rows. The last row stretches so no card sits alone beside a hole.',
    usage: `<CardGrid cols={3}>{projects.map((p) => <ProjectCard key={p.id} p={p} />)}</CardGrid>`,
    covers: ['CardGrid'],
    states: [
      { name: '3 columns, 5 cards', wide: true, render: () => <CardGrid cols={3}>{[1, 2, 3, 4, 5].map((n) => <B key={n} tall={n === 2}>Card {n}</B>)}</CardGrid> },
      { name: '4 columns, 7 cards', wide: true, render: () => <CardGrid cols={4}>{[1, 2, 3, 4, 5, 6, 7].map((n) => <B key={n}>Card {n}</B>)}</CardGrid> },
      { name: 'Keep the last row', wide: true, render: () => <CardGrid cols={3} last="keep">{[1, 2, 3, 4].map((n) => <B key={n}>Card {n}</B>)}</CardGrid> },
    ],
  },
  {
    id: 'stack-inline', title: 'Stack and inline', group: 'Layout', components: ['Stack', 'Inline'],
    summary: 'Stack for vertical rhythm (12 inside a card, 24 between sections, 36 between parts). Inline for a row of controls or tags, never cards.',
    covers: ['Stack'],
    states: [
      { name: 'Stack gaps', render: () => <Inline align="start" gap="xl">{(['sm', 'md', 'lg'] as const).map((g) => <Stack key={g} gap={g} style={{ width: 140 }}><B>{g}</B><B>{g}</B></Stack>)}</Inline> },
      { name: 'Inline, between', render: () => <Inline justify="between"><Inline><Button size="sm">Filter</Button><Button size="sm">Sort</Button></Inline><Button size="sm" variant="primary">New</Button></Inline> },
    ],
  },
];
