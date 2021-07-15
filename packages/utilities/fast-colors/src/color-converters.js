import { ColorHSL } from "./color-hsl";
import { ColorHSV } from "./color-hsv";
import { ColorLAB } from "./color-lab";
import { ColorLCH } from "./color-lch";
import { ColorRGBA64 } from "./color-rgba-64";
import { ColorXYZ } from "./color-xyz";
import { degreesToRadians, radiansToDegrees } from "./math-utilities";
// All hue values are in degrees rather than radians or normalized
// All conversions use the D65 2 degree white point for XYZ
// Info on conversions and constants used can be found in the following:
// https://en.wikipedia.org/wiki/CIELAB_color_space
// https://en.wikipedia.org/wiki/Illuminant_D65
// https://ninedegreesbelow.com/photography/xyz-rgb.html
// http://user.engineering.uiowa.edu/~aip/Misc/ColorFAQ.html
// https://web.stanford.edu/~sujason/ColorBalancing/adaptation.html
// http://brucelindbloom.com/index.html
/**
 * Get the luminance of a color in the linear RGB space.
 * This is not the same as the relative luminance in the sRGB space for WCAG contrast calculations. Use rgbToRelativeLuminance instead.
 * @param rgb - The input color
 *
 * @public
 */
export function rgbToLinearLuminance(rgb) {
    return rgb.r * 0.2126 + rgb.g * 0.7152 + rgb.b * 0.0722;
}
/**
 * Get the relative luminance of a color.
 * Adjusts the color to sRGB space, which is necessary for the WCAG contrast spec.
 * The alpha channel of the input is ignored.
 * @param rgb - The input color
 *
 * @public
 */
export function rgbToRelativeLuminance(rgb) {
    function luminanceHelper(i) {
        if (i <= 0.03928) {
            return i / 12.92;
        }
        return Math.pow((i + 0.055) / 1.055, 2.4);
    }
    return rgbToLinearLuminance(
        new ColorRGBA64(
            luminanceHelper(rgb.r),
            luminanceHelper(rgb.g),
            luminanceHelper(rgb.b),
            1
        )
    );
}
const calculateContrastRatio = (a, b) => (a + 0.05) / (b + 0.05);
/**
 * Calculate the contrast ratio between two colors. Uses the formula described by {@link https://www.w3.org/TR/WCAG20-TECHS/G17.html | WCAG 2.0}.
 *
 * @remarks
 * The alpha channel of the input is ignored
 *
 * @public
 */
export function contrastRatio(a, b) {
    const luminanceA = rgbToRelativeLuminance(a);
    const luminanceB = rgbToRelativeLuminance(b);
    return luminanceA > luminanceB
        ? calculateContrastRatio(luminanceA, luminanceB)
        : calculateContrastRatio(luminanceB, luminanceA);
}
/**
 * Calculate an overlay color that uses rgba (rgb + alpha) that matches the appareance of a given solid color when placed on the same background
 * @param rgbMatch - The solid color the overlay should match in appearance when placed over the rgbBackground
 * @param rgbBackground - The background on which the overlay rests
 * @param rgbOverlay - The rgb color of the overlay. Typically this is either pure white or pure black. This color will be used in the returned output
 * @returns The rgba (rgb + alpha) color of the overlay
 *
 * @public
 */
export function calculateOverlayColor(rgbMatch, rgbBackground, rgbOverlay) {
    const rChannel = (rgbMatch.r - rgbBackground.r) / (rgbOverlay.r - rgbBackground.r);
    const gChannel = (rgbMatch.g - rgbBackground.g) / (rgbOverlay.g - rgbBackground.g);
    const bChannel = (rgbMatch.b - rgbBackground.b) / (rgbOverlay.b - rgbBackground.b);
    const alpha = (rChannel + gChannel + bChannel) / 3;
    return new ColorRGBA64(rgbOverlay.r, rgbOverlay.g, rgbOverlay.b, alpha);
}
/**
 * Converts a {@link @microsoft/fast-colors#ColorRGBA64} to a {@link @microsoft/fast-colors#ColorHSL}
 * @param rgb - the rgb color to convert
 *
 * @remarks
 * The alpha channel of the input is ignored
 *
 * @public
 */
export function rgbToHSL(rgb) {
    const max = Math.max(rgb.r, rgb.g, rgb.b);
    const min = Math.min(rgb.r, rgb.g, rgb.b);
    const delta = max - min;
    let hue = 0;
    if (delta !== 0) {
        if (max === rgb.r) {
            hue = 60 * (((rgb.g - rgb.b) / delta) % 6);
        } else if (max === rgb.g) {
            hue = 60 * ((rgb.b - rgb.r) / delta + 2);
        } else {
            hue = 60 * ((rgb.r - rgb.g) / delta + 4);
        }
    }
    if (hue < 0) {
        hue += 360;
    }
    const lum = (max + min) / 2;
    let sat = 0;
    if (delta !== 0) {
        sat = delta / (1 - Math.abs(2 * lum - 1));
    }
    return new ColorHSL(hue, sat, lum);
}
/**
 * Converts a {@link @microsoft/fast-colors#ColorHSL} to a {@link @microsoft/fast-colors#ColorRGBA64}
 * @param hsl - the hsl color to convert
 * @param alpha - the alpha value
 *
 * @public
 */
export function hslToRGB(hsl, alpha = 1) {
    const c = (1 - Math.abs(2 * hsl.l - 1)) * hsl.s;
    const x = c * (1 - Math.abs(((hsl.h / 60) % 2) - 1));
    const m = hsl.l - c / 2;
    let r = 0;
    let g = 0;
    let b = 0;
    if (hsl.h < 60) {
        r = c;
        g = x;
        b = 0;
    } else if (hsl.h < 120) {
        r = x;
        g = c;
        b = 0;
    } else if (hsl.h < 180) {
        r = 0;
        g = c;
        b = x;
    } else if (hsl.h < 240) {
        r = 0;
        g = x;
        b = c;
    } else if (hsl.h < 300) {
        r = x;
        g = 0;
        b = c;
    } else if (hsl.h < 360) {
        r = c;
        g = 0;
        b = x;
    }
    return new ColorRGBA64(r + m, g + m, b + m, alpha);
}
/**
 * Converts a {@link @microsoft/fast-colors#ColorRGBA64} to a {@link @microsoft/fast-colors#ColorHSV}
 * @param rgb - the rgb color to convert
 *
 * @remarks
 * The alpha channel of the input is ignored
 *
 * @public
 */
export function rgbToHSV(rgb) {
    const max = Math.max(rgb.r, rgb.g, rgb.b);
    const min = Math.min(rgb.r, rgb.g, rgb.b);
    const delta = max - min;
    let hue = 0;
    if (delta !== 0) {
        if (max === rgb.r) {
            hue = 60 * (((rgb.g - rgb.b) / delta) % 6);
        } else if (max === rgb.g) {
            hue = 60 * ((rgb.b - rgb.r) / delta + 2);
        } else {
            hue = 60 * ((rgb.r - rgb.g) / delta + 4);
        }
    }
    if (hue < 0) {
        hue += 360;
    }
    let sat = 0;
    if (max !== 0) {
        sat = delta / max;
    }
    return new ColorHSV(hue, sat, max);
}
/**
 * Converts a {@link @microsoft/fast-colors#ColorHSV} to a {@link @microsoft/fast-colors#ColorRGBA64}
 * @param hsv - the hsv color to convert
 * @param alpha - the alpha value
 *
 * @public
 */
export function hsvToRGB(hsv, alpha = 1) {
    const c = hsv.s * hsv.v;
    const x = c * (1 - Math.abs(((hsv.h / 60) % 2) - 1));
    const m = hsv.v - c;
    let r = 0;
    let g = 0;
    let b = 0;
    if (hsv.h < 60) {
        r = c;
        g = x;
        b = 0;
    } else if (hsv.h < 120) {
        r = x;
        g = c;
        b = 0;
    } else if (hsv.h < 180) {
        r = 0;
        g = c;
        b = x;
    } else if (hsv.h < 240) {
        r = 0;
        g = x;
        b = c;
    } else if (hsv.h < 300) {
        r = x;
        g = 0;
        b = c;
    } else if (hsv.h < 360) {
        r = c;
        g = 0;
        b = x;
    }
    return new ColorRGBA64(r + m, g + m, b + m, alpha);
}
/**
 * Converts a {@link @microsoft/fast-colors#ColorLCH} to a {@link @microsoft/fast-colors#ColorLAB}
 * @param lch - the lch color to convert
 *
 * @public
 */
export function lchToLAB(lch) {
    let a = 0;
    let b = 0;
    if (lch.h !== 0) {
        a = Math.cos(degreesToRadians(lch.h)) * lch.c;
        b = Math.sin(degreesToRadians(lch.h)) * lch.c;
    }
    return new ColorLAB(lch.l, a, b);
}
/**
 * Converts a {@link @microsoft/fast-colors#ColorLAB} to a {@link @microsoft/fast-colors#ColorLCH}
 * @param lab - the lab color to convert
 *
 * @remarks
 * The discontinuity in the C parameter at 0 means that floating point errors will often result in values near 0 giving unpredictable results.
 * EG: 0.0000001 gives a very different result than -0.0000001
 * In cases where both a and b are very near zero this function will return an LCH color with an H of 0
 * More info about the atan2 function: {@link https://en.wikipedia.org/wiki/Atan2}
 * @public
 */
export function labToLCH(lab) {
    let h = 0;
    // Because of the discontuity at 0 if a number is very close to 0 - often due to floating point errors - then
    // it gives unexpected results. EG: 0.000000000001 gives a different result than 0. So just avoid any number
    // that has both a and b very close to zero and lump it in with the h = 0 case.
    if (Math.abs(lab.b) > 0.001 || Math.abs(lab.a) > 0.001) {
        h = radiansToDegrees(Math.atan2(lab.b, lab.a));
    }
    if (h < 0) {
        h += 360;
    }
    const c = Math.sqrt(lab.a * lab.a + lab.b * lab.b);
    return new ColorLCH(lab.l, c, h);
}
/**
 * Converts a {@link @microsoft/fast-colors#ColorLAB} to a {@link @microsoft/fast-colors#ColorXYZ}
 * @param lab - the lab color to convert
 *
 * @public
 */
export function labToXYZ(lab) {
    const fy = (lab.l + 16) / 116;
    const fx = fy + lab.a / 500;
    const fz = fy - lab.b / 200;
    const xcubed = Math.pow(fx, 3);
    const ycubed = Math.pow(fy, 3);
    const zcubed = Math.pow(fz, 3);
    let x = 0;
    if (xcubed > ColorLAB.epsilon) {
        x = xcubed;
    } else {
        x = (116 * fx - 16) / ColorLAB.kappa;
    }
    let y = 0;
    if (lab.l > ColorLAB.epsilon * ColorLAB.kappa) {
        y = ycubed;
    } else {
        y = lab.l / ColorLAB.kappa;
    }
    let z = 0;
    if (zcubed > ColorLAB.epsilon) {
        z = zcubed;
    } else {
        z = (116 * fz - 16) / ColorLAB.kappa;
    }
    x = ColorXYZ.whitePoint.x * x;
    y = ColorXYZ.whitePoint.y * y;
    z = ColorXYZ.whitePoint.z * z;
    return new ColorXYZ(x, y, z);
}
/**
 * Converts a {@link @microsoft/fast-colors#ColorXYZ} to a {@link @microsoft/fast-colors#ColorLAB}
 * @param xyz - the xyz color to convert
 *
 * @public
 */
export function xyzToLAB(xyz) {
    function xyzToLABHelper(i) {
        if (i > ColorLAB.epsilon) {
            return Math.pow(i, 1 / 3);
        }
        return (ColorLAB.kappa * i + 16) / 116;
    }
    const x = xyzToLABHelper(xyz.x / ColorXYZ.whitePoint.x);
    const y = xyzToLABHelper(xyz.y / ColorXYZ.whitePoint.y);
    const z = xyzToLABHelper(xyz.z / ColorXYZ.whitePoint.z);
    const l = 116 * y - 16;
    const a = 500 * (x - y);
    const b = 200 * (y - z);
    return new ColorLAB(l, a, b);
}
/**
 * Converts a {@link @microsoft/fast-colors#ColorRGBA64} to a {@link @microsoft/fast-colors#ColorXYZ}
 * @param rgb - the rgb color to convert
 *
 * @remarks
 * The alpha channel of the input is ignored
 * @public
 */
export function rgbToXYZ(rgb) {
    function rgbToXYZHelper(i) {
        if (i <= 0.04045) {
            return i / 12.92;
        }
        return Math.pow((i + 0.055) / 1.055, 2.4);
    }
    const r = rgbToXYZHelper(rgb.r);
    const g = rgbToXYZHelper(rgb.g);
    const b = rgbToXYZHelper(rgb.b);
    const x = r * 0.4124564 + g * 0.3575761 + b * 0.1804375;
    const y = r * 0.2126729 + g * 0.7151522 + b * 0.072175;
    const z = r * 0.0193339 + g * 0.119192 + b * 0.9503041;
    return new ColorXYZ(x, y, z);
}
/**
 * Converts a {@link @microsoft/fast-colors#ColorXYZ} to a {@link @microsoft/fast-colors#ColorRGBA64}
 * @param xyz - the xyz color to convert
 * @param alpha - the alpha value
 *
 * @remarks
 * Note that the xyz color space is significantly larger than sRGB. As such, this can return colors rgb values greater than 1 or less than 0
 * @public
 */
export function xyzToRGB(xyz, alpha = 1) {
    function xyzToRGBHelper(i) {
        if (i <= 0.0031308) {
            return i * 12.92;
        }
        return 1.055 * Math.pow(i, 1 / 2.4) - 0.055;
    }
    const r = xyzToRGBHelper(xyz.x * 3.2404542 - xyz.y * 1.5371385 - xyz.z * 0.4985314);
    const g = xyzToRGBHelper(xyz.x * -0.969266 + xyz.y * 1.8760108 + xyz.z * 0.041556);
    const b = xyzToRGBHelper(xyz.x * 0.0556434 - xyz.y * 0.2040259 + xyz.z * 1.0572252);
    return new ColorRGBA64(r, g, b, alpha);
}
/**
 * Converts a {@link @microsoft/fast-colors#ColorRGBA64} to a {@link @microsoft/fast-colors#ColorLAB}
 * @param rgb - the rgb color to convert
 *
 * @remarks
 * The alpha channel of the input is ignored
 *
 * @public
 */
export function rgbToLAB(rgb) {
    return xyzToLAB(rgbToXYZ(rgb));
}
/**
 * Converts a {@link @microsoft/fast-colors#ColorLAB} to a {@link @microsoft/fast-colors#ColorRGBA64}
 * @param lab - the LAB color to convert
 * @param alpha - the alpha value
 *
 * @remarks
 * Note that the xyz color space (which the conversion from LAB uses) is significantly larger than sRGB. As such, this can return colors rgb values greater than 1 or less than 0
 *
 * @public
 */
export function labToRGB(lab, alpha = 1) {
    return xyzToRGB(labToXYZ(lab), alpha);
}
/**
 * Convert a {@link @microsoft/fast-colors#ColorRGBA64} to a {@link @microsoft/fast-colors#ColorLCH}
 *
 * @param rgb - the rgb color to convert
 *
 * @remarks
 * The alpha channel of the input is ignored
 *
 * @public
 */
export function rgbToLCH(rgb) {
    return labToLCH(rgbToLAB(rgb));
}
/**
 * Convert a {@link @microsoft/fast-colors#ColorLCH} to a {@link @microsoft/fast-colors#ColorRGBA64}
 * @param lch - the LCH color to convert
 * @param alpha - the alpha value
 *
 * @public
 */
export function lchToRGB(lch, alpha = 1) {
    return labToRGB(lchToLAB(lch), alpha);
}
/**
 * Converts a color temperature to a {@link @microsoft/fast-colors#ColorRGBA64}
 * @param tempKelvin - the temperature to convert
 * @param alpha - the alpha value
 *
 * @public
 */
export function temperatureToRGB(tempKelvin, alpha = 1) {
    // The constants I could find assumed a decimal range of [0,255] for each channel. Just going to put a /255.0 at the end
    let r = 0;
    let g = 0;
    let b = 0;
    if (tempKelvin <= 1000) {
        tempKelvin = 1000;
    } else if (tempKelvin >= 40000) {
        tempKelvin = 40000;
    }
    if (tempKelvin < 6600.0) {
        r = 255.0;
        g = tempKelvin / 100.0 - 2.0;
        g =
            -155.25485562709179 -
            0.44596950469579133 * g +
            104.49216199393888 * Math.log(g);
    } else {
        r = tempKelvin / 100.0 - 55.0;
        r = 351.97690566805693 + 0.114206453784165 * r - 40.25366309332127 * Math.log(r);
        g = tempKelvin / 100.0 - 50.0;
        g = 325.4494125711974 + 0.07943456536662342 * g - 28.0852963507957 * Math.log(g);
    }
    if (tempKelvin >= 6600.0) {
        b = 255.0;
    } else if (tempKelvin < 2000.0) {
        b = 0.0;
    } else {
        b = tempKelvin / 100.0 - 10;
        b =
            -254.76935184120902 +
            0.8274096064007395 * b +
            115.67994401066147 * Math.log(b);
    }
    return new ColorRGBA64(r / 255, g / 255, b / 255, alpha);
}
/**
 * Convert a rgb color to a color temperature
 * @param rgb - the color to convert
 *
 * @remarks
 * The alpha channel of the input is ignored
 *
 * @public
 */
export function rgbToTemperature(rgb) {
    let t = 0;
    let min = 1000;
    let max = 40000;
    while (max - min > 0.4) {
        t = (max + min) / 2.0;
        const testColor = temperatureToRGB(t);
        if (testColor.b / testColor.r >= rgb.b / rgb.r) {
            max = t;
        } else {
            min = t;
        }
    }
    return Math.round(t);
}
