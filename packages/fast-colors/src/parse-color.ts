// tslint:disable:no-bitwise

import { ColorRGBA64 } from "./color-rgba-64";
import { normalize } from "./math-utilities";
import { NamedColors, namedColorsConfigs } from "./named-colors";

// Matches rgb(R, G, B) where R, G, and B are integers [0 - 255]
const webRGBRegex: RegExp = /^rgb\(\s*((?:(?:25[0-5]|2[0-4]\d|1\d\d|\d{1,2})\s*,\s*){2}(?:25[0-5]|2[0-4]\d|1\d\d|\d{1,2})\s*)\)$/i;
// Matches rgb(R, G, B, A) where R, G, and B are integers [0 - 255] and A is [0-1] floating
const webRGBARegex: RegExp = /^rgba\(\s*((?:(?:25[0-5]|2[0-4]\d|1\d\d|\d{1,2})\s*,\s*){3}(?:0|1|0?\.\d*)\s*)\)$/i;
// Matches #RGB and #RRGGBB, where R, G, and B are [0-9] or [A-F]
const hexRGBRegex: RegExp = /^#((?:[0-9a-f]{6}|[0-9a-f]{3}))$/i;
// Matches #RGB and #RRGGBBAA, where R, G, B, and A are [0-9] or [A-F]
const hexRGBARegex: RegExp = /^#((?:[0-9a-f]{8}|[0-9a-f]{4}))$/i;

/**
 * Test if a color matches #RRGGBB or #RGB
 */
export function isColorStringHexRGB(raw: string): boolean {
    return hexRGBRegex.test(raw);
}

/**
 * Test if a color matches #RRGGBBAA or #RGBA
 */
export function isColorStringHexRGBA(raw: string): boolean {
    return isColorStringHexARGB(raw); // No way to differentiate these two formats, so just use the same test
}

/**
 * Test if a color matches #AARRGGBB or #ARGB
 */
export function isColorStringHexARGB(raw: string): boolean {
    return hexRGBARegex.test(raw);
}

/**
 * Test if a color matches rgb(rr, gg, bb)
 */
export function isColorStringWebRGB(raw: string): boolean {
    return webRGBRegex.test(raw);
}

/**
 * Test if a color matches rgba(rr, gg, bb, aa)
 */
export function isColorStringWebRGBA(raw: string): boolean {
    return webRGBARegex.test(raw);
}

export function isColorNamed(raw: string | NamedColors): raw is NamedColors {
    return namedColorsConfigs.hasOwnProperty(raw);
}

// Expects format #RRGGBB or #RGB
export function parseColorHexRGB(raw: string): ColorRGBA64 | null {
    const result: string[] | null = hexRGBRegex.exec(raw);

    if (result === null) {
        return null;
    }

    let digits: string = result[1];

    if (digits.length === 3) {
        const r: string = digits.charAt(0);
        const g: string = digits.charAt(1);
        const b: string = digits.charAt(2);

        digits = r.concat(r, g, g, b, b);
    }

    const rawInt: number = parseInt(digits, 16);

    if (isNaN(rawInt)) {
        return null;
    }

    // Note the use of >>> rather than >> as we want JS to manipulate these as unsigned numbers
    return new ColorRGBA64(
        normalize((rawInt & 0xff0000) >>> 16, 0, 255),
        normalize((rawInt & 0x00ff00) >>> 8, 0, 255),
        normalize(rawInt & 0x0000ff, 0, 255),
        1
    );
}

// Expects format #AARRGGBB
export function parseColorHexARGB(raw: string): ColorRGBA64 | null {
    const result: string[] | null = hexRGBARegex.exec(raw);

    if (result === null) {
        return null;
    }

    let digits: string = result[1];

    if (digits.length === 4) {
        const a: string = digits.charAt(0);
        const r: string = digits.charAt(1);
        const g: string = digits.charAt(2);
        const b: string = digits.charAt(3);

        digits = a.concat(a, r, r, g, g, b, b);
    }

    const rawInt: number = parseInt(digits, 16);

    if (isNaN(rawInt)) {
        return null;
    }

    // Note the use of >>> rather than >> as we want JS to manipulate these as unsigned numbers
    return new ColorRGBA64(
        normalize((rawInt & 0x00ff0000) >>> 16, 0, 255),
        normalize((rawInt & 0x0000ff00) >>> 8, 0, 255),
        normalize(rawInt & 0x000000ff, 0, 255),
        normalize((rawInt & 0xff000000) >>> 24, 0, 255)
    );
}

// Expects format #RRGGBBAA or #RGBA
export function parseColorHexRGBA(raw: string): ColorRGBA64 | null {
    const result: string[] | null = hexRGBARegex.exec(raw);

    if (result === null) {
        return null;
    }

    let digits: string = result[1];

    if (digits.length === 4) {
        const r: string = digits.charAt(0);
        const g: string = digits.charAt(1);
        const b: string = digits.charAt(2);
        const a: string = digits.charAt(3);

        digits = r.concat(r, g, g, b, b, a, a);
    }

    const rawInt: number = parseInt(digits, 16);

    if (isNaN(rawInt)) {
        return null;
    }

    // Note the use of >>> rather than >> as we want JS to manipulate these as unsigned numbers
    return new ColorRGBA64(
        normalize((rawInt & 0xff000000) >>> 24, 0, 255),
        normalize((rawInt & 0x00ff0000) >>> 16, 0, 255),
        normalize((rawInt & 0x0000ff00) >>> 8, 0, 255),
        normalize(rawInt & 0x000000ff, 0, 255)
    );
}

// Expects format rgb(RR,GG,BB) where RR,GG,BB are [0,255]
export function parseColorWebRGB(raw: string): ColorRGBA64 | null {
    const result: string[] | null = webRGBRegex.exec(raw);

    if (result === null) {
        return null;
    }

    const split: string[] = result[1].split(",");

    return new ColorRGBA64(
        normalize(Number(split[0]), 0, 255),
        normalize(Number(split[1]), 0, 255),
        normalize(Number(split[2]), 0, 255),
        1
    );
}

// Expects format rgba(RR,GG,BB,a) where RR,GG,BB are [0,255] and a is [0,1]
export function parseColorWebRGBA(raw: string): ColorRGBA64 | null {
    const result: string[] | null = webRGBARegex.exec(raw);

    if (result === null) {
        return null;
    }

    const split: string[] = result[1].split(",");

    if (split.length === 4) {
        return new ColorRGBA64(
            normalize(Number(split[0]), 0, 255),
            normalize(Number(split[1]), 0, 255),
            normalize(Number(split[2]), 0, 255),
            Number(split[3])
        );
    }
    return null;
}

// Expects any of the CSS color names https://www.w3schools.com/colors/colors_names.asp
export function parseColorNamed(
    raw: keyof typeof namedColorsConfigs
): ColorRGBA64 | null {
    const config: typeof namedColorsConfigs[keyof typeof namedColorsConfigs] | void =
        namedColorsConfigs[raw.toLowerCase()];

    return !!config
        ? new ColorRGBA64(
              config.r,
              config.g,
              config.b,
              config.hasOwnProperty("a") ? config.a : void 0
          )
        : null;
}

// Expects any of the following and attempts to determine which is being used
// #RRGGBB
// #AARRGGBB
// rgb(RR,GG,BB)
// rgba(RR,GG,BB,a)
// or any of the CSS color names https://developer.mozilla.org/en-US/docs/Web/CSS/color_value#Color_keywords
export function parseColor(raw: string): ColorRGBA64 | null {
    const rawLower: string = raw.toLowerCase();

    return isColorStringHexRGB(rawLower)
        ? parseColorHexRGB(rawLower)
        : isColorStringHexRGBA(rawLower)
            ? parseColorHexARGB(rawLower)
            : isColorStringWebRGB(rawLower)
                ? parseColorWebRGB(rawLower)
                : isColorStringWebRGBA(rawLower)
                    ? parseColorWebRGBA(rawLower)
                    : isColorNamed(rawLower)
                        ? parseColorNamed(rawLower)
                        : null;
}
