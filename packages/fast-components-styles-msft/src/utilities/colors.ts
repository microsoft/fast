import Chroma from "chroma-js";
import { DesignSystem, withDesignSystemDefaults } from "../design-system";
import { adjustContrast, contrast, ensureContrast, scaleContrast, WCAGElementContrastRatios } from "@microsoft/fast-jss-utilities";
import { curry } from "lodash-es";

export function applyMixedColor(color1: string, color2: string, mixValue: number, alpha: number = 1): string {
    return Chroma.mix(color1, color2, mixValue).alpha(alpha).css();
}

const scaleContrastNormal: (contrast: number) => number = curry(scaleContrast)(WCAGElementContrastRatios.normal);
const scaleContrastLarge: (contrast: number) => number = curry(scaleContrast)(WCAGElementContrastRatios.large);

export { scaleContrastNormal, scaleContrastLarge };

/**
 * The following functions use a "normal" and "large" naming convention. These names are intended
 * to map directly to the concepts proposed by www.w3.org/TR/UNDERSTANDING-WCAG20/visual-audio-contrast-contrast.html
 * where "normal" is 18pt text or 14pt bold text, or UI elements less than 3px in size, and "large" refers to
 * text or UI elements that exceed those values.
 */

/**
 * Adjusts contrast for normal elements by a contrast scale value
 */
export function normalContrast(contrastScale: number, operandColor: string, referenceColor: string): string {
    return contrast(scaleContrastNormal(contrastScale), operandColor, referenceColor);
}

/**
 * Ensures a color contrast for normal elements where contrast is scaled
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
 * Ensures a color contrast for large elements where contrast is scaled
 */
export function ensureLargeContrast(contrastScale: number, operandColor: string, referenceColor: string): string {
    return ensureContrast(scaleContrastLarge(contrastScale), operandColor, referenceColor);
}

/**
 * Returns a low-contrast disabled color
 */
export function disabledContrast(contrastScale: number, operandColor: string, referenceColor: string): string {
    return contrast(scaleContrast(1.75, contrastScale), operandColor, referenceColor);
}

/**
 * Apply a hover treatment to a color
 */
export function hoverContrast(contrastScale: number, operandColor: string, referenceColor: string): string {
    return adjustContrast(scaleContrast(1, contrastScale) * -1, operandColor, referenceColor);
}

/**
 * Ensure the foreground color meets normal contrast ratios against a background color
 */
export function ensureForegroundNormal(config: DesignSystem): string {
    const designSystem: DesignSystem = withDesignSystemDefaults(config);
    return ensureNormalContrast(designSystem.contrast, designSystem.foregroundColor, designSystem.backgroundColor);
}

/**
 * Set the foreground color to meet normal contrast ratios against a background color
 */
export function foregroundNormal(config: DesignSystem): string {
    const designSystem: DesignSystem = withDesignSystemDefaults(config);
    return normalContrast(designSystem.contrast, designSystem.foregroundColor, designSystem.backgroundColor);
}

/**
 * Ensure the brand color meets normal contrast ratios against a background color
 */
export function ensureBrandNormal(config: DesignSystem): string {
    const designSystem: DesignSystem = withDesignSystemDefaults(config);
    return ensureNormalContrast(designSystem.contrast, designSystem.brandColor, designSystem.backgroundColor);
}

/**
 * Ensure the background color meets normal contrast ratios against a background color
 */
export function ensuresBackgroundNormal(config: DesignSystem): string {
    const designSystem: DesignSystem = withDesignSystemDefaults(config);
    return ensureNormalContrast(designSystem.contrast, designSystem.backgroundColor, designSystem.foregroundColor);
}
