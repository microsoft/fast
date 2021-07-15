import { ColorHSL } from "./color-hsl";
import { ColorHSV } from "./color-hsv";
import { ColorLAB } from "./color-lab";
import { ColorLCH } from "./color-lch";
import { ColorRGBA64 } from "./color-rgba-64";
import { ColorXYZ } from "./color-xyz";
/**
 * Interpolate by RGB color space
 *
 * @public
 */
export declare function interpolateRGB(
    position: number,
    left: ColorRGBA64,
    right: ColorRGBA64
): ColorRGBA64;
/**
 * Interpolate by HSL color space
 *
 * @public
 */
export declare function interpolateHSL(
    position: number,
    left: ColorHSL,
    right: ColorHSL
): ColorHSL;
/**
 * Interpolate by HSV color space
 *
 * @public
 */
export declare function interpolateHSV(
    position: number,
    left: ColorHSV,
    right: ColorHSV
): ColorHSV;
/**
 * Interpolate by XYZ color space
 *
 * @public
 */
export declare function interpolateXYZ(
    position: number,
    left: ColorXYZ,
    right: ColorXYZ
): ColorXYZ;
/**
 * Interpolate by LAB color space
 *
 * @public
 */
export declare function interpolateLAB(
    position: number,
    left: ColorLAB,
    right: ColorLAB
): ColorLAB;
/**
 * Interpolate by LCH color space
 *
 * @public
 */
export declare function interpolateLCH(
    position: number,
    left: ColorLCH,
    right: ColorLCH
): ColorLCH;
/**
 * Color interpolation spaces
 *
 * @public
 */
export declare enum ColorInterpolationSpace {
    RGB = 0,
    HSL = 1,
    HSV = 2,
    XYZ = 3,
    LAB = 4,
    LCH = 5,
}
/**
 * Interpolate by color space
 *
 * @public
 */
export declare function interpolateByColorSpace(
    position: number,
    space: ColorInterpolationSpace,
    left: ColorRGBA64,
    right: ColorRGBA64
): ColorRGBA64;
