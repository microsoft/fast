import { ColorRGBA64 } from "./color-rgba-64.js";
import { hsluvToRGB, rgbToHSLUV } from "./color-converters.js";
import { ColorHSLUV } from "./color-hsluv.js";
import { reduceAngleDegrees, reducePrecisionSmall } from "./math-utilities.js";

/**
 * Defines the interface of the return data from {@link @microsoft/fast-colors#rotateHue}
 *
 * @public
 */
export interface RotateHueOutput {
    outputColor: ColorRGBA64;
    isGreyscale: boolean;
}

/**
 * Creates a complimentary color to go with the input color.
 * If the input is greyscale then this returns the output of {@link @microsoft/fast-colors#rotateGreyscale}
 * Otherwise the input is converted to {@link @microsoft/fast-colors#ColorHSLUV} and the rotation param is added to the hue
 *
 * @param color - input color
 * @param rotation - how much to alter the hue by in the {@link @microsoft/fast-colors#ColorHSLUV} color space
 * @param greyscaleCutoff - How close together the red, green and blue values must be in order to be considered greyscale. Do not use values greater than 0.4
 * @param greyscaleShift - For a greyscale color how much to shift the red, green and blue values from the average
 *
 * @public
 */
export function rotateHue(
    color: ColorRGBA64,
    rotation: number,
    greyscaleCutoff: number | null = 0.05,
    greyscaleShift: number | null = 0.2
): RotateHueOutput {
    if (greyscaleCutoff !== null && greyscaleShift !== null) {
        if (checkForGreyscale(color, greyscaleCutoff)) {
            return {
                isGreyscale: true,
                outputColor: rotateGreyscale(color, greyscaleShift),
            };
        }
    }

    const hsluv: ColorHSLUV = rgbToHSLUV(color);

    const newH: number = reduceAngleDegrees(hsluv.h + rotation);

    const rotated: ColorHSLUV = new ColorHSLUV(newH, hsluv.s, hsluv.l);
    // Clamp values just in case of oddities during conversion as a result of rotation
    const outputColor: ColorRGBA64 = hsluvToRGB(rotated, color.a).clamp();

    return { isGreyscale: false, outputColor };
}

/**
 * Creates a complimentary greyscale color to go with the input color
 * If the input has better contrast with black then the output will as well and if the input has better contrast with white the output will as well.
 *
 * @param color - input color. the red, green and blue values are averaged so if this input color is not already greyscale the output is unpredictable.
 * @param greyscaleShift - For a greyscale color how much to shift the red, green and blue values from the average. Do not use values greater than 0.4
 *
 * @public
 */
export function rotateGreyscale(color: ColorRGBA64, greyscaleShift: number): ColorRGBA64 {
    // The crossover point between having better contrast with white vs black is ~ 0.461
    // output needs to stay on the same side of that line as input
    const crossover: number = 0.461;
    const average: number = reducePrecisionSmall((color.r + color.g + color.b) / 3, 8);

    // Output should also contrast with white
    if (1 - greyscaleShift <= average) {
        // color is very close to white
        return new ColorRGBA64(
            average - greyscaleShift,
            average - greyscaleShift,
            average - greyscaleShift,
            color.a
        );
    }
    if (greyscaleShift >= average) {
        // Color is very close to black
        return new ColorRGBA64(
            average + greyscaleShift,
            average + greyscaleShift,
            average + greyscaleShift,
            color.a
        );
    }
    if (average < crossover) {
        return new ColorRGBA64(
            average - greyscaleShift,
            average - greyscaleShift,
            average - greyscaleShift,
            color.a
        );
    } else {
        return new ColorRGBA64(
            average + greyscaleShift,
            average + greyscaleShift,
            average + greyscaleShift,
            color.a
        );
    }
}

/**
 * Checks whether the input color is greyscale. This is defined as the maximum difference between it's red, green and blue values being \>= greyscaleCutoff
 *
 * @public
 */
export function checkForGreyscale(
    color: ColorRGBA64,
    greyscaleCutoff: number = 0.05
): boolean {
    const maxChannelDifference: number = Math.max(
        Math.abs(color.r - color.g),
        Math.abs(color.r - color.b),
        Math.abs(color.g - color.b)
    );
    return maxChannelDifference < greyscaleCutoff;
}
