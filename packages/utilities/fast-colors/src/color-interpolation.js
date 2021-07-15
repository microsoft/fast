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
} from "./color-converters";
import { ColorHSL } from "./color-hsl";
import { ColorHSV } from "./color-hsv";
import { ColorLAB } from "./color-lab";
import { ColorLCH } from "./color-lch";
import { ColorRGBA64 } from "./color-rgba-64";
import { ColorXYZ } from "./color-xyz";
import { lerp, lerpAnglesInDegrees } from "./math-utilities";
/**
 * Interpolate by RGB color space
 *
 * @public
 */
export function interpolateRGB(position, left, right) {
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
export function interpolateHSL(position, left, right) {
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
export function interpolateHSV(position, left, right) {
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
export function interpolateXYZ(position, left, right) {
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
export function interpolateLAB(position, left, right) {
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
export function interpolateLCH(position, left, right) {
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
export var ColorInterpolationSpace;
(function (ColorInterpolationSpace) {
    ColorInterpolationSpace[(ColorInterpolationSpace["RGB"] = 0)] = "RGB";
    ColorInterpolationSpace[(ColorInterpolationSpace["HSL"] = 1)] = "HSL";
    ColorInterpolationSpace[(ColorInterpolationSpace["HSV"] = 2)] = "HSV";
    ColorInterpolationSpace[(ColorInterpolationSpace["XYZ"] = 3)] = "XYZ";
    ColorInterpolationSpace[(ColorInterpolationSpace["LAB"] = 4)] = "LAB";
    ColorInterpolationSpace[(ColorInterpolationSpace["LCH"] = 5)] = "LCH";
})(ColorInterpolationSpace || (ColorInterpolationSpace = {}));
/**
 * Interpolate by color space
 *
 * @public
 */
export function interpolateByColorSpace(position, space, left, right) {
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
