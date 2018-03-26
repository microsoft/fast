/**
 * A huge thanks to bobbyrayit and mlijanto for creating the algorithm implemented in the range function.
 * This code borrows heavily from their original implementation.
 */
import * as Chroma from "chroma-js";

/**
 * Interface that describes the configuration options of the color algorithm .
 */
export interface IColorOptions {
    /**
     * The number of variants to generate
     */
    variants: number;

    /**
     * The amount to pad light values
     */
    paddingLight: number;

    /**
     * The amount to pad dark values
     */
    paddingDark: number;

    /**
     * Saturation of the light values
     */
    saturationLight: number;

    /**
     * Saturation of the dark values
     */
    saturationDark: number;

    /**
     * Brightness of light values
     */
    brightnessLight: number;

    /**
     * Brightness of dark values
     */
    brightnessDark: number;

    /**
     * The overlay filter on light values
     */
    filterOverlayLight: number;

    /**
     * The overlay filter on dark values
     */
    filterOverlayDark: number;

    /**
     * The multiply filter on light values
     */
    filterMultiplyLight: number;

    /**
     * The multiply filter on dark values
     */
    filterMultiplyDark: number;
}

/**
 * A color value as a string - can be hex or RGB
 */
export type Color = string;

/**
 * A function that applies a filter to a color
 */
export type FilterFunction = (background: Color, foreground: Color, amount: number) => Chroma;

const white: Color = "#FFF";
const black: Color = "#000";

/**
 * Saturates a color by a given value. If the value is lower than the lowpass it will not make an adjustment
 */
function saturate(color: Chroma, referenceColor: Color, value: number, lowpass: number = 0.05, highpass: number = 1): Chroma {
    const saturation: number = Chroma(referenceColor).get("hsl.s");
    return saturation >= lowpass && saturation <= highpass ? color.saturate(value) : color;
}

/**
 * Creates a filter function by the name of the filter
 */
function filter(name: string): FilterFunction {
    return (background: Color, foreground: Color, value: number): Chroma => {
        const adjustment: Chroma = Chroma.blend(background, foreground, name);
        return Chroma.mix(foreground, adjustment, value, "rgb");
    };
}

/**
 * Adjusts the threshold of a color-range based on configuration. Applies various color transformations and returns
 * the new color threshold. This function is used to adjust the extremes of a color range.
 */
function adjustThreshold(
    thresholdColor: Color,
    referenceColor: Color,
    saturation: number,
    brightness: number,
    multiply: number,
    overlay: number
): Chroma {
    const color: any = Chroma(thresholdColor);
    const saturated: Chroma = saturate(color, referenceColor, saturation);
    const brightened: Chroma = saturated.brighten(brightness);
    const multiplied: Chroma = filter("multiply")(referenceColor, brightened, multiply);
    return filter("overlay")(referenceColor, multiplied, overlay);
}

/**
 * Algorithm to generate a range of color variants based on a single color, where the input color is the middle
 * of the returned color range.
 */
export function range(color: Color, options: Partial<IColorOptions> = {}): Color[] {
    const defaults = {
        variants: 7,
        paddingLight: 0.185,
        paddingDark: 0.16,
        saturationLight: 0.35,
        saturationDark: 1.25,
        brightnessLight: 0,
        brightnessDark: 0,
        filterOverlayLight: 0,
        filterOverlayDark: 0.25,
        filterMultiplyLight: 0,
        filterMultiplyDark: 0
    };

    const normalizedOptions: IColorOptions = Object.assign({}, defaults, options);

    // Create the color-range to derive the color variants from
    const colorRange: Color[] = Chroma
        .scale([white, color, black])
        .padding([normalizedOptions.paddingLight, normalizedOptions.paddingDark])
        .colors(3);

    const lightest: Color = adjustThreshold(
        colorRange[0],
        color,
        normalizedOptions.saturationLight,
        normalizedOptions.brightnessLight,
        normalizedOptions.filterMultiplyLight,
        normalizedOptions.filterOverlayLight
    );

    const darkest: Color = adjustThreshold(
        colorRange[2],
        color,
        normalizedOptions.saturationDark,
        normalizedOptions.brightnessDark,
        normalizedOptions.filterMultiplyDark,
        normalizedOptions.filterOverlayDark
    );

    return Chroma
        .scale([lightest, color, darkest])
        .colors(normalizedOptions.variants);
}
