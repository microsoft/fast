import { ColorRGBA64 } from "./color-rgba-64";
import { ColorPalette } from "./color-palette";
import { hslToRGB, rgbToHSL, rgbToLinearLuminance } from "./color-converters";
import { ColorScale, ColorScaleStop } from "./color-scale";
import { ColorHSL } from "./color-hsl";
import { ColorInterpolationSpace } from "./color-interpolation";
import { parseColorHexRGB } from "./parse-color";

/**
 * Configuration for {@link ComponentStateColorPalette}
 * @public
 */
export interface ComponentStateColorPaletteConfig {
    /**
     * The color to create the palette from
     */
    baseColor?: ColorRGBA64;

    /**
     * The number of steps in the palette
     */
    steps?: number;
}

/**
 * Creates a color palette for UI components
 * @public
 */
export class ComponentStateColorPalette {
    public static readonly defaultPaletteConfig: ComponentStateColorPaletteConfig = {
        baseColor: parseColorHexRGB("#808080"),
        steps: 94,
    };

    public palette: ColorRGBA64[] = [];
    private readonly config: ComponentStateColorPaletteConfig;

    constructor(config?: ComponentStateColorPaletteConfig) {
        this.config = Object.assign(
            {},
            ComponentStateColorPalette.defaultPaletteConfig,
            config
        );
        this.regenPalettes();
    }

    private regenPalettes(): void {
        let steps: number = this.config.steps;
        if (isNaN(steps) || steps < 3) {
            steps = 3;
        }

        // This palette is tuned to go as dark as differences between the levels can be perceived according to tests
        // on numerous monitors in different conditions. Stay linear from white until this first cutoff.
        const darkLum: number = 0.14;

        // In the dark compression, this is the last luminance value before full black.
        const darkestLum: number = 0.06;

        // The Color for the luminance value above, placed on the ramp at it's normal position, so darker colors after
        // it can be compressed.
        const darkLumColor: ColorRGBA64 = new ColorRGBA64(darkLum, darkLum, darkLum, 1);

        // The number of steps in the ramp that has been tuned for default use. This coincides with the size of the
        // default ramp, but the palette could be generated with fewer steps to increase final contrast. This number
        // should however stay the same.
        const stepsForLuminanceRamp: number = 94;

        // Create the reference, dark-compressed, grey palette, like:
        // F------------------------------------------------------------------------------------[dark]------[darkest]0
        //                                                                                      |--compressed area--|
        const r: ColorPalette = new ColorPalette({
            ...ColorPalette.greyscalePaletteConfig,
            baseColor: darkLumColor,
            baseScalePosition: ((1 - darkLum) * 100) / stepsForLuminanceRamp,
            steps,
        });
        const referencePalette: ColorRGBA64[] = r.palette;

        // Find the requested base color on the adjusted luminance reference ramp.
        // There is no _right_ way to desaturate a color, and both methods we've tested have value, so average them out.
        const baseColorLum1: number = rgbToLinearLuminance(this.config.baseColor);
        const baseColorLum2: number = rgbToHSL(this.config.baseColor).l;
        const baseColorLum: number = (baseColorLum1 + baseColorLum2) / 2;
        const baseColorRefIndex: number = this.matchRelativeLuminanceIndex(
            baseColorLum,
            referencePalette
        );
        const baseColorPercent: number = baseColorRefIndex / (steps - 1);

        // Find the luminance location for the dark cutoff.
        const darkRefIndex: number = this.matchRelativeLuminanceIndex(
            darkLum,
            referencePalette
        );
        const darkPercent: number = darkRefIndex / (steps - 1);

        // Issue https://github.com/microsoft/fast-dna/issues/1904
        // Creating a color from H, S, and a known L value is not the inverse of getting the relative
        // luminace as above. Need to derive a relative luminance version of the color to better match on the dark end.

        // Find the dark cutoff and darkest variations of the requested base color.
        const baseColorHSL: ColorHSL = rgbToHSL(this.config.baseColor);
        const darkBaseColor: ColorRGBA64 = hslToRGB(
            ColorHSL.fromObject({
                h: baseColorHSL.h,
                s: baseColorHSL.s,
                l: darkLum,
            })
        );
        const darkestBaseColor: ColorRGBA64 = hslToRGB(
            ColorHSL.fromObject({
                h: baseColorHSL.h,
                s: baseColorHSL.s,
                l: darkestLum,
            })
        );

        // Create the gradient stops, including the base color and anchor colors for the dark end compression.
        const fullColorScaleStops: ColorScaleStop[] = new Array(5);
        fullColorScaleStops[0] = {
            position: 0,
            color: new ColorRGBA64(1, 1, 1, 1),
        };
        fullColorScaleStops[1] = {
            position: baseColorPercent,
            color: this.config.baseColor,
        };
        fullColorScaleStops[2] = {
            position: darkPercent,
            color: darkBaseColor,
        };
        fullColorScaleStops[3] = {
            position: 0.99,
            color: darkestBaseColor,
        };
        fullColorScaleStops[4] = {
            position: 1,
            color: new ColorRGBA64(0, 0, 0, 1),
        };
        const scale: ColorScale = new ColorScale(fullColorScaleStops);

        // Create the palette.
        this.palette = new Array(steps);
        for (let i: number = 0; i < steps; i++) {
            const c: ColorRGBA64 = scale.getColor(
                i / (steps - 1),
                ColorInterpolationSpace.RGB
            );
            this.palette[i] = c;
        }
    }

    private matchRelativeLuminanceIndex(input: number, reference: ColorRGBA64[]): number {
        let bestFitValue: number = Number.MAX_VALUE;
        let bestFitIndex: number = 0;
        let i: number = 0;
        const referenceLength: number = reference.length;
        for (; i < referenceLength; i++) {
            const fitValue: number = Math.abs(rgbToLinearLuminance(reference[i]) - input);
            if (fitValue < bestFitValue) {
                bestFitValue = fitValue;
                bestFitIndex = i;
            }
        }
        return bestFitIndex;
    }
}
