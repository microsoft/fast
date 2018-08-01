import Chroma from "chroma-js";

/**
 * Type definition for a luminosity switch
 */
export type LuminositySwitch = (a: any, b: any) => any;

/**
 * Adjust a color to a specific luminosity. This function is almost a direct copy of
 * https://github.com/gka/chroma.js/blob/master/src/io/luminance.coffee, except that
 * it accepts a rounding function. This is necessary to prevent contrast ratios being slightly below
 * their target due to rounding RGB channel values the wrong direction.
 */
export function luminance(targetLuminance: number, sourceColor: Chroma, round?: (value: number) => number): number[] {
    const sourceLuminosity: number = sourceColor.luminance();
    const fidelity: number = 1e-7;
    let maxItterations: number = 20;

    function test(low: Chroma, high: Chroma): any {
        // Chroma typings are out of date so cast `low` as an any value
        const middle: Chroma = (low as any).interpolate(high, 0.5, "rgb");
        const middleLuminosity: number = middle.luminance();

        if (Math.abs(targetLuminance - middleLuminosity) < fidelity || !maxItterations--) {
            return middle;
        } else if (middleLuminosity > targetLuminance) {
            return test(low, middle);
        } else {
            return test(middle, high);
        }
    }

    let color: any = sourceLuminosity > targetLuminance
        ? test(Chroma("black"), sourceColor)
        : test(sourceColor, Chroma("white"));

    if (typeof round === "function") {
        color = Chroma(color.rgb(false).map(round));
    }

    return color.rgba();
}

/**
 * Returns a function that selects one of two arguments based on the value of luminance inputs.
 */
export function luminanceSwitch(foregroundLuminance: number, backgroundLuminance: number): LuminositySwitch {
    return (a: any, b: any): any => {
        const difference: number = foregroundLuminance - backgroundLuminance;

        return difference < 0 || (difference === 0 && foregroundLuminance > .5) ? b : a;
    };
}
