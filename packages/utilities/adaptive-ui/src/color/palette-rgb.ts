import {
    ColorHSL,
    ColorLAB,
    ColorRGBA64,
    hslToRGB,
    interpolateRGB,
    labToRGB,
    rgbToHSL,
    rgbToLAB,
    roundToPrecisionSmall,
} from "@microsoft/fast-colors";
import { BasePalette } from "./palette.js";
import { SwatchRGB } from "./swatch.js";
import { contrast } from "./utilities/relative-luminance.js";

/**
 * A utility Palette that generates many Swatches used for selection in the actual Palette.
 * The algorithm uses the LAB color space and keeps the saturation from the source color throughout.
 */
class HighResolutionPaletteRGB extends BasePalette<SwatchRGB> {
    /**
     * Bump the saturation if it falls below the reference color saturation.
     *
     * @param reference - Color with target saturation
     * @param color - Color to check and bump if below target saturation
     * @returns Original or adjusted color
     */
    private static saturationBump(
        reference: ColorRGBA64,
        color: ColorRGBA64
    ): ColorRGBA64 {
        const hslReference = rgbToHSL(reference);
        const saturationTarget = hslReference.s;
        const hslColor = rgbToHSL(color);
        if (hslColor.s < saturationTarget) {
            const hslNew = new ColorHSL(hslColor.h, saturationTarget, hslColor.l);
            return hslToRGB(hslNew);
        }
        return color;
    }

    /**
     * Scales input from 0 to 100 to 0 to 0.5.
     *
     * @param l - Input number, 0 to 100
     * @returns Output number, 0 to 0.5
     */
    private static ramp(l: number) {
        const inputval = l / 100;
        if (inputval > 0.5) return (inputval - 0.5) / 0.5; //from 0.500001in = 0.00000001out to 1.0in = 1.0out
        return 2 * inputval; //from 0in = 0out to 0.5in = 1.0out
    }

    /**
     * Creates a new high-resolution Palette.
     *
     * @param source - The source color
     * @returns The Palette based on the `source` color
     */
    static from(source: SwatchRGB): HighResolutionPaletteRGB {
        const swatches: SwatchRGB[] = [];

        const labSource = rgbToLAB(ColorRGBA64.fromObject(source)!.roundToPrecision(4));
        const lab0 = labToRGB(new ColorLAB(0, labSource.a, labSource.b))
            .clamp()
            .roundToPrecision(4);
        const lab50 = labToRGB(new ColorLAB(50, labSource.a, labSource.b))
            .clamp()
            .roundToPrecision(4);
        const lab100 = labToRGB(new ColorLAB(100, labSource.a, labSource.b))
            .clamp()
            .roundToPrecision(4);
        const rgbMin = new ColorRGBA64(0, 0, 0);
        const rgbMax = new ColorRGBA64(1, 1, 1);

        const lAbove = lab100.equalValue(rgbMax) ? 0 : 14;
        const lBelow = lab0.equalValue(rgbMin) ? 0 : 14;

        // 257 levels max, depending on whether lab0 or lab100 are black or white respectively.
        for (let l = 100 + lAbove; l >= 0 - lBelow; l -= 0.5) {
            let rgb: ColorRGBA64;

            if (l < 0) {
                // For L less than 0, scale from black to L=0
                const percentFromRgbMinToLab0 = l / lBelow + 1;
                rgb = interpolateRGB(percentFromRgbMinToLab0, rgbMin, lab0);
            } else if (l <= 50) {
                // For L less than 50, we scale from L=0 to the base color
                rgb = interpolateRGB(HighResolutionPaletteRGB.ramp(l), lab0, lab50);
            } else if (l <= 100) {
                // For L less than 100, scale from the base color to L=100
                rgb = interpolateRGB(HighResolutionPaletteRGB.ramp(l), lab50, lab100);
            } else {
                // For L greater than 100, scale from L=100 to white
                const percentFromLab100ToRgbMax = (l - 100.0) / lAbove;
                rgb = interpolateRGB(percentFromLab100ToRgbMax, lab100, rgbMax);
            }

            rgb = HighResolutionPaletteRGB.saturationBump(lab50, rgb).roundToPrecision(4);

            swatches.push(SwatchRGB.from(rgb));
        }

        return new HighResolutionPaletteRGB(source, swatches);
    }
}

/**
 * Options to tailor the generation of PaletteRGB.
 *
 * @public
 */
export interface PaletteRGBOptions {
    /**
     * The minimum amount of contrast between steps in the palette.
     * - Default 1.05
     * - Greater than 1
     * - Recommended increments by hundredths
     */
    stepContrast: number;

    /**
     * Multiplier for increasing step contrast as the swatches darken.
     * - Default 0.
     * - Greater than or equal to 0
     * - Recommended increments by hundredths
     */
    stepContrastRamp: number;

    /**
     * Whether to keep the exact source color in the target palette.
     * - Default false
     *
     * Only recommended when the exact color is required and used in stateful interaction recipes like hover.
     *
     * Note that custom recipes can still access the source color even if it's not in the ramp,
     * but turning this on will potentially increase the contrast between steps toward the ends of the palette.
     */
    preserveSource: boolean;
}

const defaultPaletteRGBOptions: PaletteRGBOptions = {
    stepContrast: 1.05,
    stepContrastRamp: 0,
    preserveSource: false,
};

/**
 * An implementation of a {@link Palette} that has a consistent minimum contrast value between Swatches.
 * This is useful for UI as it means the perception of the difference between colors the same distance
 * apart in the Palette will be consistent whether the colors are light yellow or dark red.
 * It generates its curve using the LAB color space and maintains the saturation of the source color throughout.
 *
 * @public
 */
export class PaletteRGB extends BasePalette<SwatchRGB> {
    /**
     * Adjust one end of the contrast-based palette so it doesn't abruptly fall to black (or white).
     *
     * @param swatchContrast - Function to get the target contrast for the next swatch
     * @param referencePalette - The high resolution palette
     * @param targetPalette - The contrast-based palette to adjust
     * @param direction - The end to adjust
     */
    private static adjustEnd(
        swatchContrast: (swatch: SwatchRGB) => number,
        referencePalette: HighResolutionPaletteRGB,
        targetPalette: SwatchRGB[],
        direction: 1 | -1
    ) {
        // Careful with the use of referencePalette as only the refSwatches is reversed.
        const refSwatches =
            direction === -1
                ? referencePalette.swatches
                : referencePalette.reversedSwatches;
        const refIndex = (swatch: SwatchRGB) => {
            const index = referencePalette.closestIndexOf(swatch);
            return direction === 1 ? referencePalette.lastIndex - index : index;
        };

        // Only operates on the 'end' end of the array, so flip if we're adjusting the 'beginning'
        if (direction === 1) {
            targetPalette.reverse();
        }

        const targetContrast = swatchContrast(targetPalette[targetPalette.length - 2]);
        const actualContrast = roundToPrecisionSmall(
            contrast(
                targetPalette[targetPalette.length - 1],
                targetPalette[targetPalette.length - 2]
            ),
            2
        );
        if (actualContrast < targetContrast) {
            // Remove last swatch if not sufficient contrast
            targetPalette.pop();

            // Distribute to the last swatch
            const safeSecondSwatch = referencePalette.colorContrast(
                refSwatches[referencePalette.lastIndex],
                targetContrast,
                undefined,
                direction
            );
            const safeSecondRefIndex = refIndex(safeSecondSwatch);
            const targetSwatchCurrentRefIndex = refIndex(
                targetPalette[targetPalette.length - 2]
            );
            const swatchesToSpace = safeSecondRefIndex - targetSwatchCurrentRefIndex;
            let space = 1;
            for (
                let i = targetPalette.length - swatchesToSpace - 1;
                i < targetPalette.length;
                i++
            ) {
                const currentRefIndex = refIndex(targetPalette[i]);
                const nextRefIndex =
                    i === targetPalette.length - 1
                        ? referencePalette.lastIndex
                        : currentRefIndex + space;
                targetPalette[i] = refSwatches[nextRefIndex];
                space++;
            }
        }

        if (direction === 1) {
            targetPalette.reverse();
        }
    }

    /**
     * Generate a Palette with consistent minimum contrast between Swatches.
     *
     * @param source - The source color
     * @param options - Palette generation options
     * @returns A Palette meeting the requested contrast between Swatches.
     */
    private static createColorPaletteByContrast(
        source: SwatchRGB,
        options: PaletteRGBOptions
    ): SwatchRGB[] {
        const referencePalette = HighResolutionPaletteRGB.from(source);

        // Ramp function to increase contrast as the swatches get darker
        const nextContrast = (swatch: SwatchRGB) => {
            const c =
                options.stepContrast +
                options.stepContrast *
                    (1 - swatch.relativeLuminance) *
                    options.stepContrastRamp;
            return roundToPrecisionSmall(c, 2);
        };

        const swatches: SwatchRGB[] = [];

        // Start with the source color (when preserving) or the light end color
        let ref = options.preserveSource ? source : referencePalette.swatches[0];
        swatches.push(ref);

        // Add swatches by contrast toward dark
        do {
            const targetContrast = nextContrast(ref);
            ref = referencePalette.colorContrast(ref, targetContrast, undefined, 1);
            swatches.push(ref);
        } while (ref.relativeLuminance > 0);

        // Add swatches by contrast toward light
        if (options.preserveSource) {
            ref = source;
            do {
                // This is off from the dark direction because `ref` here is the darker swatch, probably subtle
                const targetContrast = nextContrast(ref);
                ref = referencePalette.colorContrast(ref, targetContrast, undefined, -1);
                swatches.unshift(ref);
            } while (ref.relativeLuminance < 1);
        }

        // Cleanup dark end
        this.adjustEnd(nextContrast, referencePalette, swatches, -1);

        // Cleanup light end
        if (options.preserveSource) {
            this.adjustEnd(nextContrast, referencePalette, swatches, 1);
        }

        return swatches;
    }

    /**
     * Creates a PaletteRGB from a source Swatch with options.
     *
     * @param source - The source Swatch to create a Palette from
     * @param options - Options to specify details of palette generation
     * @returns The PaletteRGB with Swatches based on `source`
     */
    static from(source: SwatchRGB, options?: Partial<PaletteRGBOptions>): PaletteRGB {
        const opts =
            options === void 0 || null
                ? defaultPaletteRGBOptions
                : { ...defaultPaletteRGBOptions, ...options };

        return new PaletteRGB(
            source,
            Object.freeze(PaletteRGB.createColorPaletteByContrast(source, opts))
        );
    }
}
