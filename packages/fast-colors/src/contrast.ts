import Chroma from "chroma-js";
import { clamp } from "lodash-es";

enum DirectionAdjustment {
    lighten,
    darken  
}

export type RoundingFunction = (value: number) => number;
export type LuminocitySwitch = (a: any, b: any) => any;

/**
 * Adjust the darkness/lightness of a foreground color so that it matches a target contrast ratio against a background color
*/
export function contrast(targetRatio: number, foreground: string, background: string): string {
    const foregroundColor: any = Chroma(foreground);
    const backgroundLuminance: number = Chroma(background).luminance();
    const lumSwitch: LuminocitySwitch = luminanceSwitch(foregroundColor.luminance(), backgroundLuminance);
    const roundingFunction: RoundingFunction = lumSwitch(Math.floor, Math.ceil);

    return luminance(
        lumSwitch(L1, L2)(targetRatio, backgroundLuminance),
        foregroundColor,
        lumSwitch(Math.ceil, Math.floor)
    ).hex();
}

// If our foreground is more luminous than the background, our target will also be more luminous so we should
// solve for L1. If the foreground is less luminous than the background, we should solve for L2. If they have
// the same luminosity, we need to determine if the luminosity is "bright" or "dark". If it is light, solve for L2,
// if it is dark, solve for L1. 
function luminanceSwitch(foregroundLuminance: number, backgroundLuminance: number): LuminocitySwitch {
    return (a: any, b: any): any => {
        return foregroundLuminance > backgroundLuminance
            ? a
            : foregroundLuminance !== backgroundLuminance
            ? b
            : foregroundLuminance > .5 
            ? b
            : a;
    }
}

/**
 * The following functions (L1 and L2) are formulas derived from the WCAG 2.0 formula for calculating
 * color contrast ratios (https://www.w3.org/TR/WCAG20-TECHS/G18.html):
 *
 * ContrastRatio = (L1 + 0.05) / (L2 + 0.05)
 *
 * Given a known contrast ratio (r) and a known luminosity (L2 and L1 respectively), 
 * these formulas solve for L1 and L2 respectively.
 */

/**
 * Solve for L1 when L2 and contrast ratio are known
 */
function L1(ratio: number, L2: number): number {
    return (ratio * L2) + (5e-2 * ratio) - 5e-2;
}

/**
 * Solve for L2 when L1 and contrast ratio are known
 */
function L2(r: number, L1: number): number {
    return (-5e-2 * r + L1 + 5e-2) / r;
}

/**
 * Adjust a color to a specific luminosity. This function is almost a direct copy of 
 * https://github.com/gka/chroma.js/blob/master/src/io/luminance.coffee, except that
 * it accepts a rounding function. This is necessary to prevent contrast ratios being slightly below
 * their target due to rounding RGB channels the wrong direction.
 */
function luminance(targetLuminance: number, sourceColor: any, round?: RoundingFunction): any {
    const sourceLuminocity: number = sourceColor.luminance();
    const fidelity: number = 1e-7;
    let maxItterations = 20;

    function test(low: any, high: any): any {
        const middle: any = low.interpolate(high, 0.5, "rgb");
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
