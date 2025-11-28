import type { MappingFromScale } from './util.js';

const radiusPrefixMap = {
  rounded: ['borderRadius'],
  rounded_t: ['borderTopLeftRadius', 'borderTopRightRadius'],
  rounded_b: ['borderBottomLeftRadius', 'borderBottomRightRadius'],
  rounded_l: ['borderTopLeftRadius', 'borderBottomLeftRadius'],
  rounded_r: ['borderTopRightRadius', 'borderBottomRightRadius'],
  rounded_tl: ['borderTopLeftRadius'],
  rounded_tr: ['borderTopRightRadius'],
  rounded_bl: ['borderBottomLeftRadius'],
  rounded_br: ['borderBottomRightRadius'],
} as const;

type RadiusMap = typeof radiusPrefixMap;

export function dynamicBorderRadius<S extends Record<string, number | string>>(
  scale: S
): MappingFromScale<RadiusMap, S> {
  const result: any = {};
  const prefixes = Object.keys(radiusPrefixMap) as (keyof RadiusMap)[];

  for (const key in scale) {
    const value = scale[key];
    for (const prefix of prefixes) {
      const styleProp = radiusPrefixMap[prefix];
      const name = `${prefix}_${key}`;
      result[name] = {};
      for (const prop of styleProp) {
        result[name][prop] = value;
      }
    }
  }

  return result as any;
}
