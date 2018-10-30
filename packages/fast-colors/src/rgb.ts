export function hexToRgb(hex: string): string {
    const processedHex: RgbJSON = properRGBValues(hex);
    const r: string = processedHex.r;
    const g: string = processedHex.g;
    const b: string = processedHex.b;
    const a: string = processedHex.a;
    const rgb: boolean = processedHex.rgb;
    const rgba: boolean = processedHex.rgba;

    if (rgb) {
        return `rgb(${parseInt(r, 16)}, ${parseInt(g, 16)}, ${parseInt(b, 16)})`;
    } else if (rgba) {
        return `rgba(${parseInt(r, 16)}, ${parseInt(g, 16)}, ${parseInt(
            b,
            16
        )}, ${parseInt(a, 16) / 255})`;
    }
}

interface RgbJSON {
    r: string;
    g: string;
    b: string;
    a: string;
    rgb: boolean;
    rgba: boolean;
}

function properRGBValues(hex: string): RgbJSON {
    hex = hex.replace("#", "");
    if (3 === hex.length || 6 === hex.length) {
        return processRGBHex(hex);
    } else if (4 === hex.length || 8 === hex.length) {
        return processRGBAHex(hex);
    } else {
        throw new Error(`#${hex} is not a convertible hex value`);
    }
}

function processRGBHex(hex: string): RgbJSON {
    if (3 === hex.length && /^([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
        return {
            r: hex.charAt(0) + hex.charAt(0),
            g: hex.charAt(1) + hex.charAt(1),
            b: hex.charAt(2) + hex.charAt(2),
            a: "",
            rgb: true,
            rgba: false,
        };
    } else if (6 === hex.length && /^([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
        return {
            r: hex.substring(0, 2),
            g: hex.substring(2, 4),
            b: hex.substring(4, 6),
            a: "",
            rgb: true,
            rgba: false,
        };
    } else {
        throw new Error(`#${hex} is not a convertible hex value`);
    }
}

function processRGBAHex(hex: string): RgbJSON {
    if (4 === hex.length && /^([A-Fa-f0-9]{4}){1,2}$/.test(hex)) {
        return {
            r: hex.charAt(0) + hex.charAt(0),
            g: hex.charAt(1) + hex.charAt(1),
            b: hex.charAt(2) + hex.charAt(2),
            a: hex.charAt(3) + hex.charAt(3),
            rgb: false,
            rgba: true,
        };
    } else if (8 === hex.length && /^([A-Fa-f0-9]{4}){1,2}$/.test(hex)) {
        return {
            r: hex.substring(0, 2),
            g: hex.substring(2, 4),
            b: hex.substring(4, 6),
            a: hex.substring(6, 8),
            rgb: false,
            rgba: true,
        };
    } else {
        throw new Error(`#${hex} is not a convertible hex value`);
    }
}
