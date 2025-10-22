import { StyleKitContext, type StyleKitTheme } from './StyleKitContext.js';
import { useContext } from 'react';

export function useTheme(): StyleKitTheme {
  const ctx = useContext(StyleKitContext);

  if (!ctx) throw new Error('useTheme must be used within a StyleKitProvider');

  return ctx.theme as StyleKitTheme;
}
