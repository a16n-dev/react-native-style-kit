import { useContext } from 'react';
import { StyleKitContext } from './StyleKitContext.js';

export function useBreakpoints() {
  const ctx = useContext(StyleKitContext);

  if (!ctx) {
    throw new Error('useBreakpoints must be used within a StyleKitProvider');
  }

  return ctx.breakpointFn;
}
