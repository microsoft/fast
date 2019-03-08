import Chroma from "chroma-js";

/**
 * Type definition for a luminosity switch
 * @deprecated
 */
export type LuminositySwitch = (a: any, b: any) => any;

/**
 * Adjust a color to a specific luminosity. This function is almost a direct copy of
 * https://github.com/gka/chroma.js/blob/master/src/io/luminance.coffee, except that
 * it accepts a rounding function. This is necessary to prevent contrast ratios being slightly below
 * their target due to rounding RGB channel values the wrong direction.
 * @deprecated
 */
export function luminance(
    targetLuminance: number,
    sourceColor: Chroma,
    round?: (value: number) => number
): number[] {
    const sourceLuminosity: number = sourceColor.luminance();
    const maxIterations: number = 20;
    let color: any =
        sourceLuminosity > targetLuminance
            ? adjustLuminance(
                  Chroma("black"),
                  sourceColor,
                  targetLuminance,
                  maxIterations
              )
            : adjustLuminance(
                  sourceColor,
                  Chroma("white"),
                  targetLuminance,
                  maxIterations
              );

    if (typeof round === "function") {
        color = Chroma(color.rgb(false).map(round));
    }

    return color.rgba();
}

/**
 * Recursive function to adjust the luminosity value of a color
 */
function adjustLuminance(
    low: Chroma,
    high: Chroma,
    targetLuminance: number,
    iterations: number
): Chroma {
    const middle: Chroma = low.interpolate(high, 0.5, "rgb");
    const middleLuminosity: number = middle.luminance();
    iterations -= 1;

    return Math.abs(targetLuminance - middleLuminosity) < 1e-7 || !iterations
        ? middle
        : middleLuminosity > targetLuminance
            ? adjustLuminance(low, middle, targetLuminance, iterations)
            : adjustLuminance(middle, high, targetLuminance, iterations);
}

/**
 * Returns a function that selects one of two arguments based on the value of luminance inputs.
 * @deprecated
 */
export function luminanceSwitch(
    operandLuminance: number,
    referenceLuminance: number
): LuminositySwitch {
    return (a: any, b: any): any => {
        const difference: number = operandLuminance - referenceLuminance;

        return difference < 0 || (difference === 0 && referenceLuminance > 0.5) ? b : a;
    };
}
