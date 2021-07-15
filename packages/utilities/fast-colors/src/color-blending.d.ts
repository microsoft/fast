import { ColorRGBA64 } from "./color-rgba-64";
/**
 * Saturate a color using LCH color space
 *
 * @remarks
 * The alpha channel of the input is ignored
 *
 * @public
 */
export declare function saturateViaLCH(
    input: ColorRGBA64,
    saturation: number,
    saturationConstant?: number
): ColorRGBA64;
/**
 * De-saturate a color using LCH color space
 *
 * @remarks
 * The alpha channel of the input is ignored
 *
 * @public
 */
export declare function desaturateViaLCH(
    input: ColorRGBA64,
    saturation: number,
    saturationConstant?: number
): ColorRGBA64;
/**
 * Darken a color using LAB color space
 *
 * @remarks
 * The alpha channel of the input is ignored
 *
 * @public
 */
export declare function darkenViaLAB(
    input: ColorRGBA64,
    amount: number,
    darkenConstant?: number
): ColorRGBA64;
/**
 * Lighten a color using LAB color space
 *
 * @remarks
 * The alpha channel of the input is ignored
 *
 * @public
 */
export declare function lightenViaLAB(
    input: ColorRGBA64,
    amount: number,
    darkenConstant?: number
): ColorRGBA64;
/**
 * @public
 */
export declare function blendBurnChannel(bottom: number, top: number): number;
/**
 * Blends two colors with the burn mode
 *
 * @remarks
 * The alpha channel of the input is ignored
 *
 * @public
 */
export declare function blendBurn(bottom: ColorRGBA64, top: ColorRGBA64): ColorRGBA64;
/**
 * Blends two colors
 *
 * @remarks
 * The alpha channel of the input is ignored
 *
 * @public
 */
export declare function blendColor(bottom: ColorRGBA64, top: ColorRGBA64): ColorRGBA64;
/**
 * @public
 */
export declare function blendDarkenChannel(bottom: number, top: number): number;
/**
 * Blends two colors with the darken mode
 *
 * @remarks
 * The alpha channel of the input is ignored
 *
 * @public
 */
export declare function blendDarken(bottom: ColorRGBA64, top: ColorRGBA64): ColorRGBA64;
/**
 * @public
 */
export declare function blendDodgeChannel(bottom: number, top: number): number;
/**
 * Blends two colors with the dodge mode
 *
 * @remarks
 * The alpha channel of the input is ignored
 *
 * @public
 */
export declare function blendDodge(bottom: ColorRGBA64, top: ColorRGBA64): ColorRGBA64;
/**
 * @public
 */
export declare function blendLightenChannel(bottom: number, top: number): number;
/**
 * Blends two colors with the lighten mode
 *
 * @remarks
 * The alpha channel of the input is ignored
 *
 * @public
 */
export declare function blendLighten(bottom: ColorRGBA64, top: ColorRGBA64): ColorRGBA64;
/**
 * @public
 */
export declare function blendMultiplyChannel(bottom: number, top: number): number;
/**
 * Blends two colors with the multiply mode
 *
 * @remarks
 * The alpha channel of the input is ignored
 *
 * @public
 */
export declare function blendMultiply(bottom: ColorRGBA64, top: ColorRGBA64): ColorRGBA64;
/**
 * @public
 */
export declare function blendOverlayChannel(bottom: number, top: number): number;
/**
 * Blends two colors with the overlay mode
 *
 * @remarks
 * The alpha channel of the input is ignored
 *
 * @public
 */
export declare function blendOverlay(bottom: ColorRGBA64, top: ColorRGBA64): ColorRGBA64;
/**
 * @public
 */
export declare function blendScreenChannel(bottom: number, top: number): number;
/**
 * Blends two colors with the screen mode
 *
 * @remarks
 * The alpha channel of the input is ignored
 *
 * @public
 */
export declare function blendScreen(bottom: ColorRGBA64, top: ColorRGBA64): ColorRGBA64;
/**
 * Color blend modes.
 * @public
 */
export declare enum ColorBlendMode {
    Burn = 0,
    Color = 1,
    Darken = 2,
    Dodge = 3,
    Lighten = 4,
    Multiply = 5,
    Overlay = 6,
    Screen = 7,
}
/**
 * Blend two colors.
 *
 * @remarks
 * The alpha channel of the input is ignored
 *
 * @public
 */
export declare function blend(
    mode: ColorBlendMode,
    bottom: ColorRGBA64,
    top: ColorRGBA64
): ColorRGBA64;
/**
 * Alpha channel of bottom is ignored
 * The returned color always has an alpha channel of 1
 * Different programs (eg: paint.net, photoshop) will give different answers than this occasionally but within +/- 1/255 in each channel. Just depends on the details of how they round off decimals
 *
 * @public
 */
export declare function computeAlphaBlend(
    bottom: ColorRGBA64,
    top: ColorRGBA64
): ColorRGBA64;
