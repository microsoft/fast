import { blendMultiply, blendOverlay, saturateViaLCH } from "./color-blending.js";
import { rgbToHSL } from "./color-converters.js";
import { ColorHSL } from "./color-hsl.js";
import {
    ColorInterpolationSpace,
    interpolateByColorSpace,
} from "./color-interpolation.js";
import { ColorRGBA64 } from "./color-rgba-64.js";
import { ColorScale, ColorScaleStop } from "./color-scale.js";
import { parseColorHexRGB } from "./parse-color.js";

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
export class ColorPalette {
    public static readonly defaultPaletteConfig: ColorPaletteConfig = {
        baseColor: parseColorHexRGB("#808080")!,
        steps: 11,
        interpolationMode: ColorInterpolationSpace.RGB,
        scaleColorLight: new ColorRGBA64(1, 1, 1, 1),
        scaleColorDark: new ColorRGBA64(0, 0, 0, 1),
        clipLight: 0.185,
        clipDark: 0.16,
        saturationAdjustmentCutoff: 0.05,
        saturationLight: 0.35,
        saturationDark: 1.25,
        overlayLight: 0,
        overlayDark: 0.25,
        multiplyLight: 0,
        multiplyDark: 0,
        baseScalePosition: 0.5,
    };
    public static readonly greyscalePaletteConfig: ColorPaletteConfig = {
        baseColor: parseColorHexRGB("#808080")!,
        steps: 11,
        interpolationMode: ColorInterpolationSpace.RGB,
        scaleColorLight: new ColorRGBA64(1, 1, 1, 1),
        scaleColorDark: new ColorRGBA64(0, 0, 0, 1),
        clipLight: 0,
        clipDark: 0,
        saturationAdjustmentCutoff: 0,
        saturationLight: 0,
        saturationDark: 0,
        overlayLight: 0,
        overlayDark: 0,
        multiplyLight: 0,
        multiplyDark: 0,
        baseScalePosition: 0.5,
    };

    constructor(config: ColorPaletteConfig) {
        this.config = Object.assign({}, ColorPalette.defaultPaletteConfig, config);
        this.palette = [];
        this.updatePaletteColors();
    }

    private readonly config: ColorPaletteConfig;
    public readonly palette: ColorRGBA64[];

    public updatePaletteGenerationValues(newConfig: ColorPaletteConfig): boolean {
        let changed: boolean = false;
        for (const key in newConfig) {
            if (this.config[key]) {
                if (this.config[key].equalValue) {
                    if (!this.config[key].equalValue(newConfig[key])) {
                        this.config[key] = newConfig[key];
                        changed = true;
                    }
                } else {
                    if (newConfig[key] !== this.config[key]) {
                        this.config[key] = newConfig[key];
                        changed = true;
                    }
                }
            }
        }
        if (changed) {
            this.updatePaletteColors();
        }
        return changed;
    }

    private updatePaletteColors(): void {
        const scale: ColorScale = this.generatePaletteColorScale();
        for (let i: number = 0; i < this.config.steps; i++) {
            this.palette[i] = scale.getColor(
                i / (this.config.steps - 1),
                this.config.interpolationMode
            );
        }
    }

    public generatePaletteColorScale(): ColorScale {
        // Even when config.baseScalePosition is specified, using 0.5 for the baseColor
        // in the baseScale gives better results. Otherwise very off-center palettes
        // tend to go completely grey at the end furthest from the specified base color.
        const baseColorHSL: ColorHSL = rgbToHSL(this.config.baseColor);
        const baseScale: ColorScale = new ColorScale([
            { position: 0, color: this.config.scaleColorLight },
            { position: 0.5, color: this.config.baseColor },
            { position: 1, color: this.config.scaleColorDark },
        ]);
        const trimmedScale: ColorScale = baseScale.trim(
            this.config.clipLight,
            1 - this.config.clipDark
        );
        const trimmedLight: ColorRGBA64 = trimmedScale.getColor(0);
        const trimmedDark: ColorRGBA64 = trimmedScale.getColor(1);
        let adjustedLight: ColorRGBA64 = trimmedLight;
        let adjustedDark: ColorRGBA64 = trimmedDark;

        if (baseColorHSL.s >= this.config.saturationAdjustmentCutoff) {
            adjustedLight = saturateViaLCH(adjustedLight, this.config.saturationLight);
            adjustedDark = saturateViaLCH(adjustedDark, this.config.saturationDark);
        }

        if (this.config.multiplyLight !== 0) {
            const multiply: ColorRGBA64 = blendMultiply(
                this.config.baseColor,
                adjustedLight
            );
            adjustedLight = interpolateByColorSpace(
                this.config.multiplyLight,
                this.config.interpolationMode,
                adjustedLight,
                multiply
            );
        }

        if (this.config.multiplyDark !== 0) {
            const multiply: ColorRGBA64 = blendMultiply(
                this.config.baseColor,
                adjustedDark
            );
            adjustedDark = interpolateByColorSpace(
                this.config.multiplyDark,
                this.config.interpolationMode,
                adjustedDark,
                multiply
            );
        }

        if (this.config.overlayLight !== 0) {
            const overlay: ColorRGBA64 = blendOverlay(
                this.config.baseColor,
                adjustedLight
            );
            adjustedLight = interpolateByColorSpace(
                this.config.overlayLight,
                this.config.interpolationMode,
                adjustedLight,
                overlay
            );
        }

        if (this.config.overlayDark !== 0) {
            const overlay: ColorRGBA64 = blendOverlay(
                this.config.baseColor,
                adjustedDark
            );
            adjustedDark = interpolateByColorSpace(
                this.config.overlayDark,
                this.config.interpolationMode,
                adjustedDark,
                overlay
            );
        }

        if (this.config.baseScalePosition) {
            if (this.config.baseScalePosition <= 0) {
                return new ColorScale([
                    { position: 0, color: this.config.baseColor },
                    { position: 1, color: adjustedDark.clamp() },
                ]);
            } else if (this.config.baseScalePosition >= 1) {
                return new ColorScale([
                    { position: 0, color: adjustedLight.clamp() },
                    { position: 1, color: this.config.baseColor },
                ]);
            }
            return new ColorScale([
                { position: 0, color: adjustedLight.clamp() },
                {
                    position: this.config.baseScalePosition,
                    color: this.config.baseColor,
                },
                { position: 1, color: adjustedDark.clamp() },
            ]);
        }
        return new ColorScale([
            { position: 0, color: adjustedLight.clamp() },
            { position: 0.5, color: this.config.baseColor },
            { position: 1, color: adjustedDark.clamp() },
        ]);
    }
}

/**
 * Takes the input color and compares it to each color in the reference array to find the index with the closest Lightness value in HSL color space
 * @public
 */
export function matchLightnessIndex(
    input: ColorRGBA64,
    reference: ColorRGBA64[]
): number {
    const hsl: ColorHSL = rgbToHSL(input);
    let bestFitValue: number = Number.MAX_VALUE;
    let bestFitIndex: number = 0;
    for (let i: number = 0; i < reference.length; i++) {
        const ihsl: ColorHSL = rgbToHSL(reference[i]);
        const fitValue: number = Math.abs(ihsl.l - hsl.l);
        if (fitValue < bestFitValue) {
            bestFitValue = fitValue;
            bestFitIndex = i;
        }
    }
    return bestFitIndex;
}

/**
 * Generates a greyscale palette using greyscaleConfig. The Lightness (in HSL) of the input color is then compared to the greyscale palette to determine how far off center the input color should be placed. The output palette is then generated with outputSteps number of steps using colorConfig.
 * @public
 */
export function generateOffCenterPalette(
    input: ColorRGBA64,
    outputSteps: number,
    greyscaleConfig: ColorPaletteConfig = ColorPalette.greyscalePaletteConfig,
    colorConfig: ColorPaletteConfig = ColorPalette.defaultPaletteConfig
): ColorPalette {
    const greyscale: ColorPalette = new ColorPalette({
        ...greyscaleConfig,
        steps: outputSteps,
    });

    const scaleIndex: number = matchLightnessIndex(input, greyscale.palette);
    return new ColorPalette({
        ...colorConfig,
        steps: outputSteps,
        baseColor: input,
        baseScalePosition: scaleIndex / (outputSteps - 1),
    });
}

/**
 * Take the input array of colors and extrapolates them to a larger palette of size targetSize. If preserveInputColors is false the input colors are evenly distributed into the output. Otherwise, the positions of the input colors are adjusted from a perfectly even distribution in order to ensure that the exact color values appearing in the input array also appear in the output array. The larger targetSize is compared to input.length the smaller those adjustments will be.
 *
 * @public
 */
export function rescale(
    input: ColorRGBA64[],
    targetSize: number,
    preserveInputColors: boolean
): ColorRGBA64[] {
    if (input.length <= 1 || targetSize <= 1) {
        throw new Error("The input array and targetSize must both be greater than 1");
    }
    if (preserveInputColors && targetSize <= input.length) {
        throw new Error(
            "If preserveInputColors is true then targetSize must be greater than the length of the input array"
        );
    }

    const stops: ColorScaleStop[] = new Array(input.length);

    if (preserveInputColors) {
        for (let i: number = 0; i < input.length; i++) {
            const p: number = i / (input.length - 1);
            let bestFitValue: number = 2;
            let bestFitIndex: number = 0;
            for (let j: number = 0; j < targetSize; j++) {
                const fitValue: number = Math.abs(j / (targetSize - 1) - p);
                if (fitValue < bestFitValue) {
                    bestFitValue = fitValue;
                    bestFitIndex = j;
                }
                if (fitValue === 0) {
                    break;
                }
            }
            stops[i] = {
                color: input[i],
                position: bestFitIndex / (targetSize - 1),
            };
        }
    } else {
        for (let i: number = 0; i < stops.length; i++) {
            stops[i] = { color: input[i], position: i / (input.length - 1) };
        }
    }

    const scale: ColorScale = new ColorScale(stops);

    const retVal: ColorRGBA64[] = new Array(targetSize);
    for (let i: number = 0; i < targetSize; i++) {
        retVal[i] = scale.getColor(i / (targetSize - 1));
    }

    return retVal;
}

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
export const defaultCenteredRescaleConfig: CenteredRescaleConfig = {
    targetSize: 63,
    spacing: 4,
    scaleColorLight: ColorPalette.defaultPaletteConfig.scaleColorLight,
    scaleColorDark: ColorPalette.defaultPaletteConfig.scaleColorDark,
};

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
export function centeredRescale(
    input: ColorRGBA64[],
    config: CenteredRescaleConfig = defaultCenteredRescaleConfig
): ColorRGBA64[] {
    if (input.length === 0) {
        return [];
    }
    const offset: number = Math.floor(
        (config.targetSize - ((input.length - 1) * config.spacing + 1)) / 2
    );
    if (offset < 0) {
        throw new Error(
            "(targetSize - ((input.length - 1) * spacing + 1)) / 2 must be >= 0"
        );
    }

    const stops: ColorScaleStop[] = new Array(input.length + 2);
    stops[0] = { position: 0, color: config.scaleColorLight };
    stops[stops.length - 1] = {
        position: 1,
        color: config.scaleColorDark,
    };

    for (let i: number = 0; i < input.length; i++) {
        stops[i + 1] = {
            color: input[i],
            position: (i * config.spacing + offset) / (config.targetSize - 1),
        };
    }

    const scale: ColorScale = new ColorScale(stops);

    const retVal: ColorRGBA64[] = new Array(config.targetSize);
    for (let i: number = 0; i < config.targetSize; i++) {
        retVal[i] = scale.getColor(i / (config.targetSize - 1));
    }

    return retVal;
}

/**
 * Generates two palettes of length shortPaletteLength and longPaletteLength from a base color. The base color is compared to the default greyscale palette to determine where it should be placed. The short palette is then fed into centeredRescale to create the long palette. The colors in the short palette are always contained within the long.
 * @public
 */
export function generateScaledPalettes(
    input: ColorRGBA64,
    shortPaletteLength: number = 11,
    config: CenteredRescaleConfig = defaultCenteredRescaleConfig
): { short: ColorRGBA64[]; long: ColorRGBA64[] } {
    const shortPalette: ColorPalette = generateOffCenterPalette(
        input,
        shortPaletteLength
    );

    const longPalette: ColorRGBA64[] = centeredRescale(shortPalette.palette, config);

    return { short: shortPalette.palette, long: longPalette };
}
