import type { ReactNode } from 'react';

export type StoryGroup =
  | 'Brand' | 'Buttons' | 'Layout' | 'App shell' | 'Navigation' | 'Forms' | 'Data display' | 'Charts'
  | 'Boards' | 'Content and time' | 'Feedback' | 'Overlays' | 'Disclosure' | 'Messaging and code' | 'Patterns';

export const STORY_GROUPS: StoryGroup[] = ['Brand', 'Buttons', 'Layout', 'App shell', 'Navigation', 'Forms', 'Data display', 'Charts', 'Boards', 'Content and time', 'Feedback', 'Overlays', 'Disclosure', 'Messaging and code', 'Patterns'];

export interface StoryState {
  /** "Default", "Disabled", "Loading", "Error", "Empty", "Long text", "RTL"... */
  name: string;
  render: () => ReactNode;
  /** Wider than a column (tables, shells): the harness gives it the full width. */
  wide?: boolean;
}

/** One component (or pattern) and every state it can be in. The showcase, the harness, the axe
 * check and the visual check all read the same list, so a story written once is shown and tested. */
export interface Story {
  /** kebab-case, unique: 'button', 'select', 'admin-page'. */
  id: string;
  title: string;
  group: StoryGroup;
  /** The exports this story demonstrates. */
  components: string[];
  /** One line: what it is for and when to pick it. */
  summary: string;
  /** A short code example. */
  usage?: string;
  /** Keyboard and screen-reader behaviour, in plain words. */
  a11y?: string[];
  states: StoryState[];
  /** Render (and test) each state on its own page: overlays, shells and full pages. */
  isolate?: boolean;
  /** Names in the internal dashboard inventory that this story covers (for the coverage page). */
  covers?: string[];
}
