import {
    hslToRGB,
    hsvToRGB,
    labToRGB,
    lchToRGB,
    rgbToHSL,
    rgbToHSV,
    rgbToLAB,
    rgbToLCH,
    rgbToXYZ,
    xyzToRGB,
} from "./color-converters.js";
import { ColorHSL } from "./color-hsl.js";
import { ColorHSV } from "./color-hsv.js";
import { ColorLAB } from "./color-lab.js";
import { ColorLCH } from "./color-lch.js";
import { ColorRGBA64 } from "./color-rgba-64.js";
import { ColorXYZ } from "./color-xyz.js";
import { lerp, lerpAnglesInDegrees } from "./math-utilities.js";

/**
 * Interpolate by RGB color space
 *
 * @public
 */
export function interpolateRGB(
    position: number,
    left: ColorRGBA64,
    right: ColorRGBA64
): ColorRGBA64 {
    if (isNaN(position) || position <= 0) {
        return left;
    } else if (position >= 1) {
        return right;
    }
    return new ColorRGBA64(
        lerp(position, left.r, right.r),
        lerp(position, left.g, right.g),
        lerp(position, left.b, right.b),
        lerp(position, left.a, right.a)
    );
}

/**
 * Interpolate by HSL color space
 *
 * @public
 */
export function interpolateHSL(
    position: number,
    left: ColorHSL,
    right: ColorHSL
): ColorHSL {
    if (isNaN(position) || position <= 0) {
        return left;
    } else if (position >= 1) {
        return right;
    }
    return new ColorHSL(
        lerpAnglesInDegrees(position, left.h, right.h),
        lerp(position, left.s, right.s),
        lerp(position, left.l, right.l)
    );
}

/**
 * Interpolate by HSV color space
 *
 * @public
 */
export function interpolateHSV(
    position: number,
    left: ColorHSV,
    right: ColorHSV
): ColorHSV {
    if (isNaN(position) || position <= 0) {
        return left;
    } else if (position >= 1) {
        return right;
    }
    return new ColorHSV(
        lerpAnglesInDegrees(position, left.h, right.h),
        lerp(position, left.s, right.s),
        lerp(position, left.v, right.v)
    );
}

/**
 * Interpolate by XYZ color space
 *
 * @public
 */
export function interpolateXYZ(
    position: number,
    left: ColorXYZ,
    right: ColorXYZ
): ColorXYZ {
    if (isNaN(position) || position <= 0) {
        return left;
    } else if (position >= 1) {
        return right;
    }
    return new ColorXYZ(
        lerp(position, left.x, right.x),
        lerp(position, left.y, right.y),
        lerp(position, left.z, right.z)
    );
}

/**
 * Interpolate by LAB color space
 *
 * @public
 */
export function interpolateLAB(
    position: number,
    left: ColorLAB,
    right: ColorLAB
): ColorLAB {
    if (isNaN(position) || position <= 0) {
        return left;
    } else if (position >= 1) {
        return right;
    }
    return new ColorLAB(
        lerp(position, left.l, right.l),
        lerp(position, left.a, right.a),
        lerp(position, left.b, right.b)
    );
}

/**
 * Interpolate by LCH color space
 *
 * @public
 */
export function interpolateLCH(
    position: number,
    left: ColorLCH,
    right: ColorLCH
): ColorLCH {
    if (isNaN(position) || position <= 0) {
        return left;
    } else if (position >= 1) {
        return right;
    }
    return new ColorLCH(
        lerp(position, left.l, right.l),
        lerp(position, left.c, right.c),
        lerpAnglesInDegrees(position, left.h, right.h)
    );
}

/**
 * Color interpolation spaces
 *
 * @public
 */
export enum ColorInterpolationSpace {
    RGB,
    HSL,
    HSV,
    XYZ,
    LAB,
    LCH,
}

/**
 * Interpolate by color space
 *
 * @public
 */
export function interpolateByColorSpace(
    position: number,
    space: ColorInterpolationSpace,
    left: ColorRGBA64,
    right: ColorRGBA64
): ColorRGBA64 {
    if (isNaN(position) || position <= 0) {
        return left;
    } else if (position >= 1) {
        return right;
    }
    switch (space) {
        case ColorInterpolationSpace.HSL:
            return hslToRGB(interpolateHSL(position, rgbToHSL(left), rgbToHSL(right)));
        case ColorInterpolationSpace.HSV:
            return hsvToRGB(interpolateHSV(position, rgbToHSV(left), rgbToHSV(right)));
        case ColorInterpolationSpace.XYZ:
            return xyzToRGB(interpolateXYZ(position, rgbToXYZ(left), rgbToXYZ(right)));
        case ColorInterpolationSpace.LAB:
            return labToRGB(interpolateLAB(position, rgbToLAB(left), rgbToLAB(right)));
        case ColorInterpolationSpace.LCH:
            return lchToRGB(interpolateLCH(position, rgbToLCH(left), rgbToLCH(right)));
        default:
            return interpolateRGB(position, left, right);
    }
}
