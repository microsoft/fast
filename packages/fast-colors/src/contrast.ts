import * as Chroma from "chroma-js";
import { clamp } from "lodash-es";


/**
 * Type definition for a luminosity switch
 */
export type LuminocitySwitch = (a: any, b: any) => any;

/**
 * Adjust the darkness/lightness of a foreground color so that it matches a target contrast ratio against a background color
*/
export function contrast(targetRatio: number, foreground: string, background: string): string {
    const foregroundColor: Chroma.Color = Chroma(foreground);
    const backgroundLuminance: number = Chroma(background).luminance();
    const lumSwitch: LuminocitySwitch = luminanceSwitch(foregroundColor.luminance(), backgroundLuminance);

    return luminance(
        lumSwitch(L1, L2)(targetRatio, backgroundLuminance),
        foregroundColor,
        lumSwitch(Math.ceil, Math.floor)
    ).hex();
}

/**
 * Returns a function that selects one of two arguments based on the value of luminance inputs.
 */
export function luminanceSwitch(foregroundLuminance: number, backgroundLuminance: number): LuminocitySwitch {
    return (a: any, b: any): any => {
        const difference: number = foregroundLuminance - backgroundLuminance;

        return difference < 0 || (difference === 0 && foregroundLuminance > .5) ? b : a;
    }
}

/**
 * The following functions (L1 and L2) are formulas derived from the WCAG 2.0 formula for calculating
 * color contrast ratios - https://www.w3.org/TR/WCAG20-TECHS/G18.html):
 *
 * ContrastRatio = (L1 + 0.05) / (L2 + 0.05)
 *
 * Given a known contrast ratio (ratio) and a known luminosity (L2 and L1 respectively), 
 * these formulas solve for L1 and L2 respectively.
 */

/**
 * Solve for L1 when L2 and contrast ratio are known
 */
function L1(ratio: number, L2: number): number {
    return (ratio * L2) + (0.05 * ratio) - 0.05;
}

/**
 * Solve for L2 when L1 and contrast ratio are known
 */
function L2(ratio: number, L1: number): number {
    return (-0.05 * ratio + L1 + 0.05) / ratio;
}

/**
 * Adjust a color to a specific luminosity. This function is almost a direct copy of 
 * https://github.com/gka/chroma.js/blob/master/src/io/luminance.coffee, except that
 * it accepts a rounding function. This is necessary to prevent contrast ratios being slightly below
 * their target due to rounding RGB channel values the wrong direction.
 */
function luminance(targetLuminance: number, sourceColor: Chroma.Color, round?: (value: number) => number): Chroma.Color {
    const sourceLuminocity: number = sourceColor.luminance();
    const fidelity: number = 1e-7;
    let maxItterations = 20;

    function test(low: Chroma.Color, high: Chroma.Color): any {
        // Chroma typings are out of date so cast `low` as an any value
        const middle: Chroma.Color = (low as any).interpolate(high, 0.5, "rgb");
        const middleLuminocity: number = middle.luminance();
        
        if (Math.abs(targetLuminance - middleLuminocity) < fidelity || !maxItterations--) {
            return middle;
        } else if (middleLuminocity > targetLuminance) {
            return test(low, middle);
        } else {
            return test(middle, high);
        }
    }

    let color: any = sourceLuminocity > targetLuminance
        ? test(Chroma("black"), sourceColor)
        : test(sourceColor, Chroma("white"));

    if (typeof round === "function") {
        color = Chroma(color.rgb(false).map(round));
    }

    return color;
}
