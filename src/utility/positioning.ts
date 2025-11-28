export const positioning = {
  overflow_hidden: { overflow: 'hidden' },
  overflow_visible: { overflow: 'visible' },
  absolute: { position: 'absolute' },
  relative: { position: 'relative' },
  inset_0: { top: 0, right: 0, bottom: 0, left: 0 },
  absolute_fill: { position: 'absolute', top: 0, right: 0, bottom: 0, left: 0 },
} as const;
