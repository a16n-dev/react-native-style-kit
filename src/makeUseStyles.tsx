import {
  type ImageStyle,
  StyleSheet,
  type TextStyle,
  type ViewStyle,
} from 'react-native';

import { useContext, useMemo } from 'react';
import {
  StyleKitContext,
  type StyleKitContextValue,
  type StyleKitRuntime,
  type StyleKitTheme,
} from './StyleKitContext.js';
import type { breakpointFn } from './makeBreakpointFunction.js';

/**
 * Section #1: Utility types
 * These are all utility types required for later.
 */
type RNStyle = ViewStyle | TextStyle | ImageStyle;

type MaybeBoolToStringKeys<B> = B extends boolean
  ? 'true' | 'false'
  : NonNullable<B>;

type VariantType = Record<string, string | number | boolean | undefined | null>;

type VariantStyle<V extends VariantType> = {
  variants?: {
    [K in keyof V]?: {
      [Vv in MaybeBoolToStringKeys<V[K]>]?: RNStyle;
    };
  };
  compoundVariants?: Array<Partial<V> & { style: RNStyle }>;
};

type StyleDefinition<T, Variants extends VariantType> =
  Variants extends Record<string, never>
    ? {
        [P in keyof T]: RNStyle;
      }
    : {
        [P in keyof T]: RNStyle & VariantStyle<Variants>;
      };

// Remove variant/compoundVariant keys from the resulting style
type ReturnStyleDefinition<T> = {
  [P in keyof T]: {
    [K in Exclude<keyof T[P], 'variants' | 'compoundVariants'>]: T[P][K];
  };
};

type useStyles<T> = () => ReturnStyleDefinition<T>;
type useStylesWithVariants<T, Variants extends VariantType> = (
  variants: Variants
) => ReturnStyleDefinition<T>;

/**
 * The object passed to style functions to access theme, runtime, breakpoints etc
 */
type StyleFunctionContext = {
  theme: StyleKitTheme;
  rt: StyleKitRuntime;
  bp: breakpointFn;
};

type StyleDefinitionMaybeFunction<
  Variants extends VariantType,
  T extends StyleDefinition<any, Variants>,
> =
  | ((ctx: StyleFunctionContext) => T & StyleDefinition<any, Variants>)
  | (T & StyleDefinition<any, Variants>);

/**
 * The makeUseStyles function is overloaded to allow for optional currying if the
 * user wants to explicitly set the variants generic
 * ```ts
 * makeUseStyle({...}) // This works
 *
 * makeUseStyle()({...}) // This also works
 * ```
 */
export function makeUseStyles<T extends StyleDefinition<any, any>>(
  styleDefinition: StyleDefinitionMaybeFunction<Record<string, never>, T>
): useStyles<T>;

export function makeUseStyles<
  Variants extends VariantType = Record<string, never>,
>(): <T extends StyleDefinition<any, Variants>>(
  styleDefinition: StyleDefinitionMaybeFunction<Variants, T>
) => Variants extends Record<string, never>
  ? useStyles<T>
  : useStylesWithVariants<T, Variants>;

export function makeUseStyles(
  maybeStyleDefinition?: StyleDefinitionMaybeFunction<any, any>
) {
  // if the user passed a style definition here don't curry the inner function.
  if (maybeStyleDefinition) {
    return buildUseStylesHook(maybeStyleDefinition);
  }

  // This inner function exists so that Variants can be explicitly set as a generic
  // while still inferring the correct type T for the styles themselves
  return function innerMakeUseStyle(
    styleDefinition: StyleDefinitionMaybeFunction<any, any>
  ) {
    return buildUseStylesHook(styleDefinition) as any;
  };
}

/**
 * Takes in a style definition and builds the `useStyles` hook.
 */
function buildUseStylesHook<
  T extends StyleDefinition<T, Variants>,
  Variants extends VariantType,
>(styleDefinition: StyleDefinitionMaybeFunction<Variants, T>) {
  // Definition does not depend on context so we can use a simple implementation
  if (typeof styleDefinition !== 'function' || styleDefinition.length === 0) {
    const useStyles = (variants?: Variants): ReturnStyleDefinition<T> => {
      return useMemo(() => {
        if (variants) {
          const withCtx = applyContext(
            styleDefinition,
            {} as StyleKitContextValue
          );

          const withVariants = applyStyleVariants(withCtx, variants);
          return StyleSheet.create(withVariants);
        } else {
          const withCtx = applyContext(
            styleDefinition,
            {} as StyleKitContextValue
          );
          return StyleSheet.create(withCtx);
        }
      }, [...(variants ? Object.values(variants) : [])]);
    };
    return useStyles as any;
  }

  // Create a cache to store previously computed styles. This ensures that if
  // an instance of `useStyles` is used across multiple components,
  // we don't recalculate styles unnecessarily.
  const cache = new WeakMap();

  const useStyles = (variants?: Variants): ReturnStyleDefinition<T> => {
    const ctx = useContext(StyleKitContext);

    if (!ctx)
      throw new Error('useStyles must be used within a StyleKitProvider');

    return useMemo(() => {
      if (variants) {
        // Use the cache JUST for applying theme - variants get applied after cache
        let withCtx: T & StyleDefinition<any, Variants>;
        if (cache.has(ctx)) {
          withCtx = cache.get(ctx);
        } else {
          withCtx = applyContext(styleDefinition, ctx);
          cache.set(ctx, withCtx);
        }

        const withVariants = applyStyleVariants(withCtx, variants);
        return StyleSheet.create(withVariants);
      } else {
        // Otherwise with no variants
        if (cache.has(ctx)) {
          return cache.get(ctx);
        }

        const withCtx = applyContext(styleDefinition, ctx);
        const asStyleSheet = StyleSheet.create(withCtx);
        cache.set(ctx, asStyleSheet);
        return asStyleSheet;
      }
    }, [ctx, ...(variants ? Object.values(variants) : [])]);
  };

  return useStyles as any;
}

/**
 * Applies any variants defined in the styles
 */
function applyStyleVariants<T, Variants extends VariantType>(
  styles: T & StyleDefinition<any, Variants>,
  appliedVariants: Variants
) {
  const result: any = {};
  for (const key in styles) {
    const { variants, compoundVariants, ...baseStyle } = styles[
      key
    ] as unknown as {
      variants?: {
        [K in keyof Variants]?: {
          [Vv in MaybeBoolToStringKeys<Variants[K]>]?: RNStyle;
        };
      };
      compoundVariants: Array<Partial<Variants> & { style: RNStyle }>;
    };
    result[key] = baseStyle;

    if (variants) {
      // deal with variants by applying the correct styles
      for (const variantKey in variants) {
        for (const variantValue in variants[variantKey]) {
          // If "variantValue" is the same

          const appliedVariantValue =
            typeof appliedVariants[variantKey] === 'boolean'
              ? appliedVariants[variantKey]
                ? 'true'
                : 'false'
              : String(appliedVariants[variantKey]);

          if (appliedVariantValue === variantValue) {
            // Apply the styles set
            Object.assign(
              result[key],
              (variants[variantKey] as any)[variantValue]
            );
          }
        }
      }
    }

    if (compoundVariants) {
      compoundVariants.forEach((variant) => {
        let allMatch = true;

        for (const variantKey in variant) {
          if (variantKey === 'style') continue;

          if (appliedVariants[variantKey] !== variant[variantKey]) {
            allMatch = false;
            break;
          }
        }

        if (allMatch) {
          Object.assign(result[key], variant.style);
        }
      });
    }
  }

  return result;
}

function applyContext<
  T extends StyleDefinition<T, Variants>,
  Variants extends VariantType,
>(
  definition: StyleDefinitionMaybeFunction<Variants, T>,
  ctx: StyleKitContextValue
): T & StyleDefinition<any, Variants> {
  if (typeof definition !== 'function') {
    return definition;
  }

  return definition({
    theme: ctx.theme as StyleKitTheme,
    bp: ctx.breakpointFn,
    rt: ctx.runtime,
  });
}
