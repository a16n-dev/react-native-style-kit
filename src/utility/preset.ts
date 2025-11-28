import { aspectRatio } from './aspectRatio.js';
import { border } from './border.js';
import { flexbox } from './flexbox.js';
import { text } from './text.js';
import { positioning } from './positioning.js';
import { opacity } from './opacity.js';
import { sizing } from './sizing.js';

export const preset = {
  ...flexbox,
  ...aspectRatio,
  ...border,
  ...opacity,
  ...text,
  ...positioning,
  ...sizing,
};
