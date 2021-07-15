import { ColorInterpolationSpace } from "./color-interpolation";
import { ColorRGBA64 } from "./color-rgba-64";
import { ColorScale } from "./color-scale";
/**
 * @public
 */
export interface ColorPaletteConfig {
    baseColor?: ColorRGBA64;
    steps?: number;
    interpolationMode?: ColorInterpolationSpace;
    scaleColorLight?: ColorRGBA64;
    scaleColorDark?: ColorRGBA64;
    clipLight?: number;
    clipDark?: number;
    saturationAdjustmentCutoff?: number;
    saturationLight?: number;
    saturationDark?: number;
    overlayLight?: number;
    overlayDark?: number;
    multiplyLight?: number;
    multiplyDark?: number;
    baseScalePosition?: number;
}
/**
 * Generates a color palette
 * @public
 */
export declare class ColorPalette {
    static readonly defaultPaletteConfig: ColorPaletteConfig;
    static readonly greyscalePaletteConfig: ColorPaletteConfig;
    constructor(config: ColorPaletteConfig);
    private readonly config;
    readonly palette: ColorRGBA64[];
    updatePaletteGenerationValues(newConfig: ColorPaletteConfig): boolean;
    private updatePaletteColors;
    generatePaletteColorScale(): ColorScale;
}
/**
 * Takes the input color and compares it to each color in the reference array to find the index with the closest Lightness value in HSL color space
 * @public
 */
export declare function matchLightnessIndex(
    input: ColorRGBA64,
    reference: ColorRGBA64[]
): number;
/**
 * Generates a greyscale palette using greyscaleConfig. The Lightness (in HSL) of the input color is then compared to the greyscale palette to determine how far off center the input color should be placed. The output palette is then generated with outputSteps number of steps using colorConfig.
 * @public
 */
export declare function generateOffCenterPalette(
    input: ColorRGBA64,
    outputSteps: number,
    greyscaleConfig?: ColorPaletteConfig,
    colorConfig?: ColorPaletteConfig
): ColorPalette;
/**
 * Take the input array of colors and extrapolates them to a larger palette of size targetSize. If preserveInputColors is false the input colors are evenly distributed into the output. Otherwise, the positions of the input colors are adjusted from a perfectly even distribution in order to ensure that the exact color values appearing in the input array also appear in the output array. The larger targetSize is compared to input.length the smaller those adjustments will be.
 *
 * @public
 */
export declare function rescale(
    input: ColorRGBA64[],
    targetSize: number,
    preserveInputColors: boolean
): ColorRGBA64[];
/**
 * @public
 */
export interface CenteredRescaleConfig {
    targetSize: number;
    spacing: number;
    scaleColorLight: ColorRGBA64;
    scaleColorDark: ColorRGBA64;
}
/**
 * @public
 */
export declare const defaultCenteredRescaleConfig: CenteredRescaleConfig;
/**
 * Takes an input array of colors and extrapolates them to a larger palette. The mapping first takes the input array and extrapolates between each color so that they are separated by spacing-1 slots. Then it adds to either end enough new colors to make up the desired targetSize. All output color slots between the defined stops are interpolated.
 * @example
 * For an input array with length 5, a targetSize of 17 and spacing of 3 the output would be:
 *  0: scaleColorLight
 *  1:
 *  2: input 0
 *  3:
 *  4:
 *  5: input 1
 *  6:
 *  7:
 *  8: input 2
 *  9:
 * 10:
 * 11: input 3
 * 12:
 * 13:
 * 14: input 4
 * 15:
 * 16: scaleColorDark
 *
 * @public
 */
export declare function centeredRescale(
    input: ColorRGBA64[],
    config?: CenteredRescaleConfig
): ColorRGBA64[];
/**
 * Generates two palettes of length shortPaletteLength and longPaletteLength from a base color. The base color is compared to the default greyscale palette to determine where it should be placed. The short palette is then fed into centeredRescale to create the long palette. The colors in the short palette are always contained within the long.
 * @public
 */
export declare function generateScaledPalettes(
    input: ColorRGBA64,
    shortPaletteLength?: number,
    config?: CenteredRescaleConfig
): {
    short: ColorRGBA64[];
    long: ColorRGBA64[];
};
