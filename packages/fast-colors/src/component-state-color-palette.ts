import { ColorRGBA64 } from "./color-rgba-64";
import { ColorPalette } from "./color-palette";
import { hslToRGB, rgbToHSL, rgbToLuminanceLinear } from "./color-converters";
import { ColorScale, ColorScaleStop } from "./color-scale";
import { ColorHSL } from "./color-hsl";
import { ColorInterpolationSpace } from "./color-interpolation";
import { parseColorHexRGB } from "./parse-color";

export interface ComponentStateColorPaletteConfig {
    baseColor?: ColorRGBA64;
    steps?: number;
}

export class ComponentStateColorPalette {
    public static readonly defaultPaletteConfig: ComponentStateColorPaletteConfig = {
        baseColor: parseColorHexRGB("#808080"),
        steps: 94,
    };

    public palette: ColorRGBA64[] = [];
    private readonly config: ComponentStateColorPaletteConfig;

    constructor(config: ComponentStateColorPaletteConfig) {
        this.config = Object.assign(
            {},
            ComponentStateColorPalette.defaultPaletteConfig,
            config
        );
        this.palette = [];
        this.regenPalettes();
    }

    private regenPalettes(): void {
        let s: number = this.config.steps;
        if (isNaN(this.config.steps) || this.config.steps < 3) {
            s = 3;
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
        // F------------------------------------------------------------------------------------D-------0
        const r: ColorPalette = new ColorPalette({
            ...ColorPalette.greyscalePaletteConfig,
            baseColor: darkLumColor,
            baseScalePosition: ((1 - darkLum) * 100) / stepsForLuminanceRamp,
            steps: s,
        });
        const referencePalette: ColorRGBA64[] = r.palette;

        // Find the requested base color on the adjusted luminance reference ramp.
        // There is no _right_ way to desaturate a color, and both methods we've tested have value, so average them out.
        const baseColorLum1: number = rgbToLuminanceLinear(this.config.baseColor);
        const baseColorLum2: number = rgbToHSL(this.config.baseColor).l;
        const baseColorLum: number = (baseColorLum1 + baseColorLum2) / 2;
        const baseColorRefIndex: number = this.matchRelativeLuminanceIndex(
            baseColorLum,
            referencePalette
        );
        const baseColorPercent: number = baseColorRefIndex / (s - 1);

        // Find the luminance location for the dark cutoff.
        const darkRefIndex: number = this.matchRelativeLuminanceIndex(
            darkLum,
            referencePalette
        );
        const darkPercent: number = darkRefIndex / (s - 1);

        // TODO: Creating a color from H, S, and a known L value is not the inverse of getting the relative
        // luminace as above. Need to derive a relative luminance version of the color to better match on the dark end.

        // Find the dark cutoff and darkest variations of the requested base color.
        const baseColorHSL: ColorHSL = rgbToHSL(this.config.baseColor);

        const darkBaseHSL: ColorHSL = ColorHSL.fromObject({
            h: baseColorHSL.h,
            s: baseColorHSL.s,
            l: darkLum,
        });
        const darkBaseColor: ColorRGBA64 = hslToRGB(darkBaseHSL);

        const darkestBaseHSL: ColorHSL = ColorHSL.fromObject({
            h: baseColorHSL.h,
            s: baseColorHSL.s,
            l: darkestLum,
        });
        const darkestBaseColor: ColorRGBA64 = hslToRGB(darkestBaseHSL);

        // Create the color stops give the base color and the two dark variations of the base color.
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
        const sortedStops: ColorScaleStop[] = fullColorScaleStops.sort(
            (a: ColorScaleStop, b: ColorScaleStop): number => {
                const A: number = a.position;
                const B: number = b.position;

                if (A < B) {
                    return -1;
                } else if (A > B) {
                    return 1;
                } else {
                    return 0;
                }
            }
        );
        const scale: ColorScale = new ColorScale(sortedStops);

        // Create the palette.
        this.palette = new Array(s);
        for (let i: number = 0; i < s; i++) {
            const c: ColorRGBA64 = scale.getColor(
                i / (s - 1),
                ColorInterpolationSpace.RGB
            );
            this.palette[i] = c;
        }
    }

    private matchRelativeLuminanceIndex(input: number, reference: ColorRGBA64[]): number {
        let bestFitValue: number = Number.MAX_VALUE;
        let bestFitIndex: number = 0;
        for (let i: number = 0; i < reference.length; i++) {
            const iLum: number = rgbToLuminanceLinear(reference[i]);
            const fitValue: number = Math.abs(iLum - input);
            if (fitValue < bestFitValue) {
                bestFitValue = fitValue;
                bestFitIndex = i;
            }
        }
        return bestFitIndex;
    }
}
