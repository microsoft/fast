import Chroma from "chroma-js";
import withDesignSystemDefaults, { IDesignSystem } from "../design-system";
import { contrast, ensureContrast, scaleContrast, WCAGAAContrastRatios } from "@microsoft/fast-jss-utilities";
import { curry } from "lodash-es";

export function applyMixedColor(color1: string, color2: string, mixValue: number, alpha: number = 1): string {
    return Chroma.mix(color1, color2, mixValue).alpha(alpha).css();
}

export enum ContrastModifiers {
    hover = -1,
    disabled = -3
}

const scaleContrastNormal: (contrast: number) => number = curry(scaleContrast)(WCAGAAContrastRatios.normal);
const scaleContrastLarge: (contrast: number) => number = curry(scaleContrast)(WCAGAAContrastRatios.large);

export { scaleContrastNormal, scaleContrastLarge };

/**
 * Adjusts contrast for normal elements by a contrast scale value
 */
export function normalContrast(contrastScale: number, operandColor: string, referenceColor: string): string {
    return contrast(scaleContrastNormal(contrastScale), operandColor, referenceColor);
}

/**
 * Ensures a color contrast where contrast is scaled
 */
export function ensureNormalContrast(contrastScale: number, operandColor: string, referenceColor: string): string {
    return ensureContrast(scaleContrastNormal(contrastScale), operandColor, referenceColor);
}

/**
 * Adjusts contrast for large elements by a contrast scale value
 */
export function largeContrast(contrastScale: number, operandColor: string, referenceColor: string): string {
    return contrast(scaleContrastLarge(contrastScale), operandColor, referenceColor);
}

/**
 * Ensures a color contrast where contrast is scaled
 */
export function ensureLargeContrast(contrastScale: number, operandColor: string, referenceColor: string): string {
    return ensureContrast(scaleContrastLarge(contrastScale), operandColor, referenceColor);
}
