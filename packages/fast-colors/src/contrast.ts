import Chroma from "chroma-js";
import { memoize } from "lodash-es";
import { LuminositySwitch, luminance, luminanceSwitch } from "./luminosity";



/**
 * Adjust the darkness/lightness of a foreground color so that it matches a target contrast ratio against a background color
*/
export function contrast(targetRatio: number, foreground: string, background: string): string {
    const foregroundColor: Chroma = Chroma(foreground);
    const backgroundLuminance: number = Chroma(background).luminance();
    const lumSwitch: LuminositySwitch = luminanceSwitch(foregroundColor.luminance(), backgroundLuminance);

    return Chroma(luminance(
        lumSwitch(L1, L2)(targetRatio, backgroundLuminance),
        foregroundColor,
        lumSwitch(Math.ceil, Math.floor)
    )).hex();
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
