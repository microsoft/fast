import {
    hslToRGB,
    labToRGB,
    lchToRGB,
    rgbToHSL,
    rgbToLAB,
    rgbToLCH,
} from "./color-converters";
import { ColorHSL } from "./color-hsl";
import { ColorLAB } from "./color-lab";
import { ColorLCH } from "./color-lch";
import { ColorRGBA64 } from "./color-rgba-64";
import { clamp } from "./math-utilities";
/**
 * Saturate a color using LCH color space
 *
 * @remarks
 * The alpha channel of the input is ignored
 *
 * @public
 */
export function saturateViaLCH(input, saturation, saturationConstant = 18) {
    const lch = rgbToLCH(input);
    let sat = lch.c + saturation * saturationConstant;
    if (sat < 0) {
        sat = 0;
    }
    return lchToRGB(new ColorLCH(lch.l, sat, lch.h));
}
/**
 * De-saturate a color using LCH color space
 *
 * @remarks
 * The alpha channel of the input is ignored
 *
 * @public
 */
export function desaturateViaLCH(input, saturation, saturationConstant = 18) {
    return saturateViaLCH(input, -1 * saturation, saturationConstant);
}
/**
 * Darken a color using LAB color space
 *
 * @remarks
 * The alpha channel of the input is ignored
 *
 * @public
 */
export function darkenViaLAB(input, amount, darkenConstant = 18) {
    const lab = rgbToLAB(input);
    const darkened = lab.l - amount * darkenConstant;
    return labToRGB(new ColorLAB(darkened, lab.a, lab.b));
}
/**
 * Lighten a color using LAB color space
 *
 * @remarks
 * The alpha channel of the input is ignored
 *
 * @public
 */
export function lightenViaLAB(input, amount, darkenConstant = 18) {
    return darkenViaLAB(input, -1 * amount, darkenConstant);
}
/**
 * @public
 */
export function blendBurnChannel(bottom, top) {
    if (top === 0.0) {
        // Despite the discontinuity, other sources seem to use 0.0 here instead of 1
        return 0.0;
    }
    return 1.0 - (1.0 - bottom) / top;
}
/**
 * Blends two colors with the burn mode
 *
 * @remarks
 * The alpha channel of the input is ignored
 *
 * @public
 */
export function blendBurn(bottom, top) {
    return new ColorRGBA64(
        blendBurnChannel(bottom.r, top.r),
        blendBurnChannel(bottom.g, top.g),
        blendBurnChannel(bottom.b, top.b),
        1
    );
}
/**
 * Blends two colors
 *
 * @remarks
 * The alpha channel of the input is ignored
 *
 * @public
 */
export function blendColor(bottom, top) {
    const bottomHSL = rgbToHSL(bottom);
    const topHSL = rgbToHSL(top);
    if (topHSL.s === 0) {
        return new ColorRGBA64(bottomHSL.l, bottomHSL.l, bottomHSL.l, 1);
    }
    return hslToRGB(new ColorHSL(topHSL.h, topHSL.s, bottomHSL.l));
}
/**
 * @public
 */
export function blendDarkenChannel(bottom, top) {
    return Math.min(bottom, top);
}
/**
 * Blends two colors with the darken mode
 *
 * @remarks
 * The alpha channel of the input is ignored
 *
 * @public
 */
export function blendDarken(bottom, top) {
    return new ColorRGBA64(
        blendDarkenChannel(bottom.r, top.r),
        blendDarkenChannel(bottom.g, top.g),
        blendDarkenChannel(bottom.b, top.b),
        1
    );
}
/**
 * @public
 */
export function blendDodgeChannel(bottom, top) {
    if (top >= 1.0) {
        return 1.0;
    }
    const retVal = bottom / (1.0 - top);
    if (retVal >= 1.0) {
        return 1.0;
    }
    return retVal;
}
/**
 * Blends two colors with the dodge mode
 *
 * @remarks
 * The alpha channel of the input is ignored
 *
 * @public
 */
export function blendDodge(bottom, top) {
    return new ColorRGBA64(
        blendDodgeChannel(bottom.r, top.r),
        blendDodgeChannel(bottom.g, top.g),
        blendDodgeChannel(bottom.b, top.b),
        1
    );
}
/**
 * @public
 */
export function blendLightenChannel(bottom, top) {
    return Math.max(bottom, top);
}
/**
 * Blends two colors with the lighten mode
 *
 * @remarks
 * The alpha channel of the input is ignored
 *
 * @public
 */
export function blendLighten(bottom, top) {
    return new ColorRGBA64(
        blendLightenChannel(bottom.r, top.r),
        blendLightenChannel(bottom.g, top.g),
        blendLightenChannel(bottom.b, top.b),
        1
    );
}
/**
 * @public
 */
export function blendMultiplyChannel(bottom, top) {
    return bottom * top;
}
/**
 * Blends two colors with the multiply mode
 *
 * @remarks
 * The alpha channel of the input is ignored
 *
 * @public
 */
export function blendMultiply(bottom, top) {
    return new ColorRGBA64(
        blendMultiplyChannel(bottom.r, top.r),
        blendMultiplyChannel(bottom.g, top.g),
        blendMultiplyChannel(bottom.b, top.b),
        1
    );
}
/**
 * @public
 */
export function blendOverlayChannel(bottom, top) {
    if (bottom < 0.5) {
        return clamp(2.0 * top * bottom, 0, 1);
    }
    return clamp(1.0 - 2.0 * (1.0 - top) * (1.0 - bottom), 0, 1);
}
/**
 * Blends two colors with the overlay mode
 *
 * @remarks
 * The alpha channel of the input is ignored
 *
 * @public
 */
export function blendOverlay(bottom, top) {
    return new ColorRGBA64(
        blendOverlayChannel(bottom.r, top.r),
        blendOverlayChannel(bottom.g, top.g),
        blendOverlayChannel(bottom.b, top.b),
        1
    );
}
/**
 * @public
 */
export function blendScreenChannel(bottom, top) {
    return 1.0 - (1.0 - top) * (1.0 - bottom);
}
/**
 * Blends two colors with the screen mode
 *
 * @remarks
 * The alpha channel of the input is ignored
 *
 * @public
 */
export function blendScreen(bottom, top) {
    return new ColorRGBA64(
        blendScreenChannel(bottom.r, top.r),
        blendScreenChannel(bottom.g, top.g),
        blendScreenChannel(bottom.b, top.b),
        1
    );
}
/**
 * Color blend modes.
 * @public
 */
export var ColorBlendMode;
(function (ColorBlendMode) {
    ColorBlendMode[(ColorBlendMode["Burn"] = 0)] = "Burn";
    ColorBlendMode[(ColorBlendMode["Color"] = 1)] = "Color";
    ColorBlendMode[(ColorBlendMode["Darken"] = 2)] = "Darken";
    ColorBlendMode[(ColorBlendMode["Dodge"] = 3)] = "Dodge";
    ColorBlendMode[(ColorBlendMode["Lighten"] = 4)] = "Lighten";
    ColorBlendMode[(ColorBlendMode["Multiply"] = 5)] = "Multiply";
    ColorBlendMode[(ColorBlendMode["Overlay"] = 6)] = "Overlay";
    ColorBlendMode[(ColorBlendMode["Screen"] = 7)] = "Screen";
})(ColorBlendMode || (ColorBlendMode = {}));
/**
 * Blend two colors.
 *
 * @remarks
 * The alpha channel of the input is ignored
 *
 * @public
 */
export function blend(mode, bottom, top) {
    switch (mode) {
        case ColorBlendMode.Burn:
            return blendBurn(bottom, top);
        case ColorBlendMode.Color:
            return blendColor(bottom, top);
        case ColorBlendMode.Darken:
            return blendDarken(bottom, top);
        case ColorBlendMode.Dodge:
            return blendDodge(bottom, top);
        case ColorBlendMode.Lighten:
            return blendLighten(bottom, top);
        case ColorBlendMode.Multiply:
            return blendMultiply(bottom, top);
        case ColorBlendMode.Overlay:
            return blendOverlay(bottom, top);
        case ColorBlendMode.Screen:
            return blendScreen(bottom, top);
        default:
            throw new Error("Unknown blend mode");
    }
}
/**
 * Alpha channel of bottom is ignored
 * The returned color always has an alpha channel of 1
 * Different programs (eg: paint.net, photoshop) will give different answers than this occasionally but within +/- 1/255 in each channel. Just depends on the details of how they round off decimals
 *
 * @public
 */
export function computeAlphaBlend(bottom, top) {
    if (top.a >= 1) {
        return top;
    } else if (top.a <= 0) {
        return new ColorRGBA64(bottom.r, bottom.g, bottom.b, 1);
    }
    const r = top.a * top.r + (1 - top.a) * bottom.r;
    const g = top.a * top.g + (1 - top.a) * bottom.g;
    const b = top.a * top.b + (1 - top.a) * bottom.b;
    return new ColorRGBA64(r, g, b, 1);
}
