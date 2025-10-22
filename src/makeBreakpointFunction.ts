import type { StyleKitBreakpoints } from './StyleKitContext.js';

type ZeroBreakpoint<T> = {
  [K in keyof T]: T[K] extends 0 ? K : never;
}[keyof T];

type hasZeroBreakpoint<T> = [ZeroBreakpoint<StyleKitBreakpoints>] extends [
  never,
]
  ? false
  : T extends Record<ZeroBreakpoint<StyleKitBreakpoints>, any>
    ? true
    : false;

export type breakpointFn = {
  above: Record<keyof StyleKitBreakpoints, <V>(value: V) => V | undefined>;
  below: Record<keyof StyleKitBreakpoints, <V>(value: V) => V | undefined>;
  current: keyof StyleKitBreakpoints | undefined;
} & (<V extends Partial<Record<keyof StyleKitBreakpoints, any>>>(
  values: V
) => hasZeroBreakpoint<V> extends true ? V[keyof V] : V[keyof V] | undefined);

export function makeBreakpointFn(
  width: number,
  breakpoints?: Record<string, number>
): breakpointFn {
  if (!breakpoints) {
    return new Proxy(
      {},
      {
        get: () => () => {
          throw new Error('No breakpoints defined');
        },
      }
    ) as any;
  }

  // Sort breakpoints by their values, largest to smallest
  const sortedBreakpoints = Object.entries(breakpoints).sort(
    (a, b) => b[1] - a[1]
  );

  // Expect the smallest breakpoint to have a value of 0.
  if (sortedBreakpoints[sortedBreakpoints.length - 1][1] !== 0) {
    throw new Error(
      'The smallest breakpoint must have a value of 0. Please add a breakpoint with value 0.'
    );
  }

  // Sort breakpoints by value in ascending order
  const above = Object.keys(breakpoints).reduce(
    (acc, key) => {
      acc[key] = <V>(value: V) =>
        width >= breakpoints[key] ? value : undefined;
      return acc;
    },
    {} as Record<string, <V>(value: V) => V | undefined>
  );

  const below = Object.keys(breakpoints).reduce(
    (acc, key) => {
      acc[key] = <V>(value: V) =>
        width <= breakpoints[key] ? value : undefined;
      return acc;
    },
    {} as Record<string, <V>(value: V) => V | undefined>
  );

  // Find the current breakpoint
  const current = sortedBreakpoints.find(([, value]) => width >= value)?.[0];

  const fn = <V>(values: V): V[keyof V] | undefined => {
    // Find the largest matched breakpoint
    let matchedBreakpoint: string | undefined;
    for (const [key, value] of sortedBreakpoints) {
      if (width >= value) {
        matchedBreakpoint = key;
        break;
      }
    }
    return matchedBreakpoint ? (values as any)[matchedBreakpoint] : undefined;
  };

  return Object.assign(fn, { above, below, current }) as any;
}
