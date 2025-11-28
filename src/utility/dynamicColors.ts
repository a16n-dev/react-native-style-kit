import type { MappingFromScale } from './util.js';

const colorsPrefixMap = {
  bg: ['backgroundColor'],
  text: ['color'],
  border: ['borderColor'],
} as const;

type ColorsMap = typeof colorsPrefixMap;

export function dynamicColors<S extends Record<string, string>>(
  scale: S
): MappingFromScale<ColorsMap, S> {
  const result: any = {};
  const prefixes = Object.keys(colorsPrefixMap) as (keyof ColorsMap)[];

  for (const key in scale) {
    const value = scale[key];
    for (const prefix of prefixes) {
      const styleProp = colorsPrefixMap[prefix];
      const name = `${prefix}_${key}`;
      result[name] = {};
      for (const prop of styleProp) {
        result[name][prop] = value;
      }
    }
  }

  return result as any;
}
