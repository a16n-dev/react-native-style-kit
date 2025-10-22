import { useMemo, type ReactNode } from 'react';
import {
  useSafeAreaFrame,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import {
  type StyleKitBreakpoints,
  StyleKitContext,
  type StyleKitContextValue,
  type StyleKitTheme,
} from './StyleKitContext.js';
import { makeBreakpointFn } from './makeBreakpointFunction.js';

export type StyleKitProviderProps = { children: ReactNode } &
  // Theme must be defined if types provided
  (keyof StyleKitTheme extends never
    ? { theme?: StyleKitTheme }
    : { theme: StyleKitTheme }) &
  // Breakpoints must be defined if types are provided
  (keyof StyleKitBreakpoints extends never
    ? { breakpoints?: StyleKitBreakpoints }
    : { breakpoints: StyleKitBreakpoints });

export function StyleKitProvider({
  theme,
  breakpoints,
  children,
}: StyleKitProviderProps) {
  const insets = useSafeAreaInsets();
  const screen = useSafeAreaFrame();

  const value: StyleKitContextValue = useMemo(() => {
    const breakpointFn = makeBreakpointFn(screen.width, breakpoints as any);

    return {
      theme,
      breakpointFn,
      runtime: {
        insets,
        screen: {
          width: screen.width,
          height: screen.height,
        },
      },
    };
  }, [theme, breakpoints, insets, screen.width, screen.height]);

  return (
    <StyleKitContext.Provider value={value}>
      {children}
    </StyleKitContext.Provider>
  );
}
