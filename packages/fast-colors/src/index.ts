import * as Chroma from "chroma-js";

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

const white = "#FFF";
const black = "#000";

/**
 * Saturates a color by a given value. If the value is lower than the lowpass it will not make an adjustment
 */
function saturate(color: any, referenceColor: any, value: number, lowpass: number = 0.05, highpass:number = 1) {
    const saturation = Chroma(referenceColor).get("hsl.s");
    return saturation >= lowpass && saturation <= highpass ? color.saturate(value) : color;
}

/**
 * Creates a filter function by the name of the filter
 */
function filter(name: string) {
    return (background: any, foreground: any, value: number) => {
        const adjustment = Chroma.blend(background, foreground, name);
        return Chroma.mix(foreground, adjustment, value, "rgb");
    }
}

/**
 * Adjusts the threshold of a color-range based on configuration. Applies various color transformations and returns
 * the new color threshold.
 */
function adjustThreshold(thresholdColor: string, referenceColor: any, saturation: number, brightness: number, multiply: number, overlay: number) {
    const color: any = Chroma(thresholdColor);
    const saturated = saturate(color, referenceColor, saturation);
    const brightened = saturated.brighten(brightness);
    const multiplied = filter("multiply")(referenceColor, brightened, multiply);
    return filter("overlay")(referenceColor, multiplied, overlay);
}

/**
 * Algorithm to generate a color range based on an original color. 
 */
export function variants(color: string, options: Partial<IColorOptions> = {}): string[] {
    const normalizedOptions: IColorOptions = Object.assign({}, options, {
        variants: 7,
        paddingLight: 0.185,
        paddingDark: 0.16,
        saturationLight: 0.35,
        saturationDark: 1.25,
        brightnessLight: 0.01,
        brightnessDark: 0.01,
        filterOverlayLight: 0,
        filterOverlayDark: 0.25,
        filterMultiplyLight: 0,
        filterMultiplyDark: 0
    });

    // Create the color-range to derive the color variants from
    const colorRange = Chroma
        .scale([white, color, black])
        .padding([normalizedOptions.paddingLight, normalizedOptions.paddingDark])
        .colors(3);

    const lightest = adjustThreshold(
        colorRange[0],
        color,
        normalizedOptions.saturationLight,
        normalizedOptions.brightnessLight,
        normalizedOptions.filterMultiplyLight,
        normalizedOptions.filterOverlayLight);
    const darkest = adjustThreshold(
        colorRange[2],
        color,
        normalizedOptions.saturationDark,
        normalizedOptions.brightnessDark,
        normalizedOptions.filterMultiplyDark,
        normalizedOptions.filterOverlayDark);


    return Chroma
        .scale([lightest, color, darkest])
        .colors(normalizedOptions.variants);
}
