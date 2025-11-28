import type {MappingFromScale} from "./util.js";

const spacingPrefixMap = {
    m: ['margin'],
    mt: ['marginTop'],
    mb: ['marginBottom'],
    ml: ['marginLeft'],
    mr: ['marginRight'],
    mx: ['marginHorizontal'],
    my: ['marginVertical'],
    p: ['padding'],
    pt: ['paddingTop'],
    pb: ['paddingBottom'],
    pl: ['paddingLeft'],
    pr: ['paddingRight'],
    px: ['paddingHorizontal'],
    py: ['paddingVertical'],
    gap: ['gap'],
    top: ['top'],
    bottom: ['bottom'],
    left: ['left'],
    right: ['right'],
    w: ['width'],
    h: ['height'],
    size: ['width', 'height'],
} as const;

type SpacingMap = typeof spacingPrefixMap;

export function dynamicSpacing<S extends Record<string, number | string>>(
    scale: S
): MappingFromScale<SpacingMap,S> {
    const result: any = {};
    const prefixes = Object.keys(spacingPrefixMap) as (keyof SpacingMap)[];

    for (const key in scale) {
        const value = scale[key];
        for (const prefix of prefixes) {
            const styleProp = spacingPrefixMap[prefix];
            const name = `${prefix}_${key}`;
            result[name] = {};
            for (const prop of styleProp) {
                result[name][prop] = value;
            }
        }
    }

    return result as any;
}