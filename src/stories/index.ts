// Every story, in showcase order. Exported as '@arlab/ui/stories'.
import type { Story } from './types';
import { stories as core } from './core.stories';
import { stories as layout } from './layout.stories';
import { stories as shell } from './shell.stories';
import { stories as navFeedback } from './nav-feedback.stories';
import { stories as forms } from './forms.stories';
import { stories as data } from './data.stories';
import { stories as boardTime } from './board-time.stories';
import { stories as overlays } from './overlays.stories';
import { stories as patterns } from './patterns.stories';

export * from './types';
export const stories: Story[] = [...core, ...layout, ...shell, ...navFeedback, ...forms, ...data, ...boardTime, ...overlays, ...patterns];
export const storyById = (id: string) => stories.find((s) => s.id === id);
