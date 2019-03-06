// tslint:disable:no-bitwise

import { ColorRGBA64 } from "./colorRGBA64";
import { normalize } from "./mathUtils";

export const namedColors: object = {
    aliceblue: new ColorRGBA64(0.941176, 0.972549, 1, 1),
    antiquewhite: new ColorRGBA64(0.980392, 0.921569, 0.843137, 1),
    aqua: new ColorRGBA64(0, 1, 1, 1),
    aquamarine: new ColorRGBA64(0.498039, 1, 0.831373, 1),
    azure: new ColorRGBA64(0.941176, 1, 1, 1),
    beige: new ColorRGBA64(0.960784, 0.960784, 0.862745, 1),
    bisque: new ColorRGBA64(1, 0.894118, 0.768627, 1),
    black: new ColorRGBA64(0, 0, 0, 1),
    blanchedalmond: new ColorRGBA64(1, 0.921569, 0.803922, 1),
    blue: new ColorRGBA64(0, 0, 1, 1),
    blueviolet: new ColorRGBA64(0.541176, 0.168627, 0.886275, 1),
    brown: new ColorRGBA64(0.647059, 0.164706, 0.164706, 1),
    burlywood: new ColorRGBA64(0.870588, 0.721569, 0.529412, 1),
    cadetblue: new ColorRGBA64(0.372549, 0.619608, 0.627451, 1),
    chartreuse: new ColorRGBA64(0.498039, 1, 0, 1),
    chocolate: new ColorRGBA64(0.823529, 0.411765, 0.117647, 1),
    coral: new ColorRGBA64(1, 0.498039, 0.313725, 1),
    cornflowerblue: new ColorRGBA64(0.392157, 0.584314, 0.929412, 1),
    cornsilk: new ColorRGBA64(1, 0.972549, 0.862745, 1),
    crimson: new ColorRGBA64(0.862745, 0.078431, 0.235294, 1),
    cyan: new ColorRGBA64(0, 1, 1, 1),
    darkblue: new ColorRGBA64(0, 0, 0.545098, 1),
    darkcyan: new ColorRGBA64(0, 0.545098, 0.545098, 1),
    darkgoldenrod: new ColorRGBA64(0.721569, 0.52549, 0.043137, 1),
    darkgray: new ColorRGBA64(0.662745, 0.662745, 0.662745, 1),
    darkgreen: new ColorRGBA64(0, 0.392157, 0, 1),
    darkgrey: new ColorRGBA64(0.662745, 0.662745, 0.662745, 1),
    darkkhaki: new ColorRGBA64(0.741176, 0.717647, 0.419608, 1),
    darkmagenta: new ColorRGBA64(0.545098, 0, 0.545098, 1),
    darkolivegreen: new ColorRGBA64(0.333333, 0.419608, 0.184314, 1),
    darkorange: new ColorRGBA64(1, 0.54902, 0, 1),
    darkorchid: new ColorRGBA64(0.6, 0.196078, 0.8, 1),
    darkred: new ColorRGBA64(0.545098, 0, 0, 1),
    darksalmon: new ColorRGBA64(0.913725, 0.588235, 0.478431, 1),
    darkseagreen: new ColorRGBA64(0.560784, 0.737255, 0.560784, 1),
    darkslateblue: new ColorRGBA64(0.282353, 0.239216, 0.545098, 1),
    darkslategray: new ColorRGBA64(0.184314, 0.309804, 0.309804, 1),
    darkslategrey: new ColorRGBA64(0.184314, 0.309804, 0.309804, 1),
    darkturquoise: new ColorRGBA64(0, 0.807843, 0.819608, 1),
    darkviolet: new ColorRGBA64(0.580392, 0, 0.827451, 1),
    deeppink: new ColorRGBA64(1, 0.078431, 0.576471, 1),
    deepskyblue: new ColorRGBA64(0, 0.74902, 1, 1),
    dimgray: new ColorRGBA64(0.411765, 0.411765, 0.411765, 1),
    dimgrey: new ColorRGBA64(0.411765, 0.411765, 0.411765, 1),
    dodgerblue: new ColorRGBA64(0.117647, 0.564706, 1, 1),
    firebrick: new ColorRGBA64(0.698039, 0.133333, 0.133333, 1),
    floralwhite: new ColorRGBA64(1, 0.980392, 0.941176, 1),
    forestgreen: new ColorRGBA64(0.133333, 0.545098, 0.133333, 1),
    fuchsia: new ColorRGBA64(1, 0, 1, 1),
    gainsboro: new ColorRGBA64(0.862745, 0.862745, 0.862745, 1),
    ghostwhite: new ColorRGBA64(0.972549, 0.972549, 1, 1),
    gold: new ColorRGBA64(1, 0.843137, 0, 1),
    goldenrod: new ColorRGBA64(0.854902, 0.647059, 0.12549, 1),
    gray: new ColorRGBA64(0.501961, 0.501961, 0.501961, 1),
    green: new ColorRGBA64(0, 0.501961, 0, 1),
    greenyellow: new ColorRGBA64(0.678431, 1, 0.184314, 1),
    grey: new ColorRGBA64(0.501961, 0.501961, 0.501961, 1),
    honeydew: new ColorRGBA64(0.941176, 1, 0.941176, 1),
    hotpink: new ColorRGBA64(1, 0.411765, 0.705882, 1),
    indianred: new ColorRGBA64(0.803922, 0.360784, 0.360784, 1),
    indigo: new ColorRGBA64(0.294118, 0, 0.509804, 1),
    ivory: new ColorRGBA64(1, 1, 0.941176, 1),
    khaki: new ColorRGBA64(0.941176, 0.901961, 0.54902, 1),
    lavender: new ColorRGBA64(0.901961, 0.901961, 0.980392, 1),
    lavenderblush: new ColorRGBA64(1, 0.941176, 0.960784, 1),
    lawngreen: new ColorRGBA64(0.486275, 0.988235, 0, 1),
    lemonchiffon: new ColorRGBA64(1, 0.980392, 0.803922, 1),
    lightblue: new ColorRGBA64(0.678431, 0.847059, 0.901961, 1),
    lightcoral: new ColorRGBA64(0.941176, 0.501961, 0.501961, 1),
    lightcyan: new ColorRGBA64(0.878431, 1, 1, 1),
    lightgoldenrodyellow: new ColorRGBA64(0.980392, 0.980392, 0.823529, 1),
    lightgray: new ColorRGBA64(0.827451, 0.827451, 0.827451, 1),
    lightgreen: new ColorRGBA64(0.564706, 0.933333, 0.564706, 1),
    lightgrey: new ColorRGBA64(0.827451, 0.827451, 0.827451, 1),
    lightpink: new ColorRGBA64(1, 0.713725, 0.756863, 1),
    lightsalmon: new ColorRGBA64(1, 0.627451, 0.478431, 1),
    lightseagreen: new ColorRGBA64(0.12549, 0.698039, 0.666667, 1),
    lightskyblue: new ColorRGBA64(0.529412, 0.807843, 0.980392, 1),
    lightslategray: new ColorRGBA64(0.466667, 0.533333, 0.6, 1),
    lightslategrey: new ColorRGBA64(0.466667, 0.533333, 0.6, 1),
    lightsteelblue: new ColorRGBA64(0.690196, 0.768627, 0.870588, 1),
    lightyellow: new ColorRGBA64(1, 1, 0.878431, 1),
    lime: new ColorRGBA64(0, 1, 0, 1),
    limegreen: new ColorRGBA64(0.196078, 0.803922, 0.196078, 1),
    linen: new ColorRGBA64(0.980392, 0.941176, 0.901961, 1),
    magenta: new ColorRGBA64(1, 0, 1, 1),
    maroon: new ColorRGBA64(0.501961, 0, 0, 1),
    mediumaquamarine: new ColorRGBA64(0.4, 0.803922, 0.666667, 1),
    mediumblue: new ColorRGBA64(0, 0, 0.803922, 1),
    mediumorchid: new ColorRGBA64(0.729412, 0.333333, 0.827451, 1),
    mediumpurple: new ColorRGBA64(0.576471, 0.439216, 0.858824, 1),
    mediumseagreen: new ColorRGBA64(0.235294, 0.701961, 0.443137, 1),
    mediumslateblue: new ColorRGBA64(0.482353, 0.407843, 0.933333, 1),
    mediumspringgreen: new ColorRGBA64(0, 0.980392, 0.603922, 1),
    mediumturquoise: new ColorRGBA64(0.282353, 0.819608, 0.8, 1),
    mediumvioletred: new ColorRGBA64(0.780392, 0.082353, 0.521569, 1),
    midnightblue: new ColorRGBA64(0.098039, 0.098039, 0.439216, 1),
    mintcream: new ColorRGBA64(0.960784, 1, 0.980392, 1),
    mistyrose: new ColorRGBA64(1, 0.894118, 0.882353, 1),
    moccasin: new ColorRGBA64(1, 0.894118, 0.709804, 1),
    navajowhite: new ColorRGBA64(1, 0.870588, 0.678431, 1),
    navy: new ColorRGBA64(0, 0, 0.501961, 1),
    oldlace: new ColorRGBA64(0.992157, 0.960784, 0.901961, 1),
    olive: new ColorRGBA64(0.501961, 0.501961, 0, 1),
    olivedrab: new ColorRGBA64(0.419608, 0.556863, 0.137255, 1),
    orange: new ColorRGBA64(1, 0.647059, 0, 1),
    orangered: new ColorRGBA64(1, 0.270588, 0, 1),
    orchid: new ColorRGBA64(0.854902, 0.439216, 0.839216, 1),
    palegoldenrod: new ColorRGBA64(0.933333, 0.909804, 0.666667, 1),
    palegreen: new ColorRGBA64(0.596078, 0.984314, 0.596078, 1),
    paleturquoise: new ColorRGBA64(0.686275, 0.933333, 0.933333, 1),
    palevioletred: new ColorRGBA64(0.858824, 0.439216, 0.576471, 1),
    papayawhip: new ColorRGBA64(1, 0.937255, 0.835294, 1),
    peachpuff: new ColorRGBA64(1, 0.854902, 0.72549, 1),
    peru: new ColorRGBA64(0.803922, 0.521569, 0.247059, 1),
    pink: new ColorRGBA64(1, 0.752941, 0.796078, 1),
    plum: new ColorRGBA64(0.866667, 0.627451, 0.866667, 1),
    powderblue: new ColorRGBA64(0.690196, 0.878431, 0.901961, 1),
    purple: new ColorRGBA64(0.501961, 0, 0.501961, 1),
    red: new ColorRGBA64(1, 0, 0, 1),
    rosybrown: new ColorRGBA64(0.737255, 0.560784, 0.560784, 1),
    royalblue: new ColorRGBA64(0.254902, 0.411765, 0.882353, 1),
    saddlebrown: new ColorRGBA64(0.545098, 0.270588, 0.07451, 1),
    salmon: new ColorRGBA64(0.980392, 0.501961, 0.447059, 1),
    sandybrown: new ColorRGBA64(0.956863, 0.643137, 0.376471, 1),
    seagreen: new ColorRGBA64(0.180392, 0.545098, 0.341176, 1),
    seashell: new ColorRGBA64(1, 0.960784, 0.933333, 1),
    sienna: new ColorRGBA64(0.627451, 0.321569, 0.176471, 1),
    silver: new ColorRGBA64(0.752941, 0.752941, 0.752941, 1),
    skyblue: new ColorRGBA64(0.529412, 0.807843, 0.921569, 1),
    slateblue: new ColorRGBA64(0.415686, 0.352941, 0.803922, 1),
    slategray: new ColorRGBA64(0.439216, 0.501961, 0.564706, 1),
    slategrey: new ColorRGBA64(0.439216, 0.501961, 0.564706, 1),
    snow: new ColorRGBA64(1, 0.980392, 0.980392, 1),
    springgreen: new ColorRGBA64(0, 1, 0.498039, 1),
    steelblue: new ColorRGBA64(0.27451, 0.509804, 0.705882, 1),
    tan: new ColorRGBA64(0.823529, 0.705882, 0.54902, 1),
    teal: new ColorRGBA64(0, 0.501961, 0.501961, 1),
    thistle: new ColorRGBA64(0.847059, 0.74902, 0.847059, 1),
    tomato: new ColorRGBA64(1, 0.388235, 0.278431, 1),
    transparent: new ColorRGBA64(0, 0, 0, 0),
    turquoise: new ColorRGBA64(0.25098, 0.878431, 0.815686, 1),
    violet: new ColorRGBA64(0.933333, 0.509804, 0.933333, 1),
    wheat: new ColorRGBA64(0.960784, 0.870588, 0.701961, 1),
    white: new ColorRGBA64(1, 1, 1, 1),
    whitesmoke: new ColorRGBA64(0.960784, 0.960784, 0.960784, 1),
    yellow: new ColorRGBA64(1, 1, 0, 1),
    yellowgreen: new ColorRGBA64(0.603922, 0.803922, 0.196078, 1),
};

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
export function parseColorNamed(raw: string): ColorRGBA64 | null {
    const rawLower: string = raw.toLowerCase();
    if (namedColors[rawLower]) {
        return namedColors[rawLower];
    }
    return null;
}

// Expects any of the following and attempts to determine which is being used
// #RRGGBB
// #AARRGGBB
// rgb(RR,GG,BB)
// rgba(RR,GG,BB,a)
// or any of the CSS color names https://www.w3schools.com/colors/colors_names.asp
export function parseColor(raw: string): ColorRGBA64 | null {
    const rawLower: string = raw.toLowerCase();

    if (isColorStringHexRGB(rawLower)) {
        return parseColorHexRGB(rawLower);
    } else if (isColorStringHexRGBA(rawLower)) {
        return parseColorHexARGB(rawLower);
    } else if (isColorStringWebRGB(rawLower)) {
        return parseColorWebRGB(rawLower);
    } else if (isColorStringWebRGBA(rawLower)) {
        return parseColorWebRGBA(rawLower);
    } else if (namedColors[rawLower]) {
        return namedColors[rawLower];
    }

    return null;
}
