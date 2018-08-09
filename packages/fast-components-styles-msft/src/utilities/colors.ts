import Chroma from "chroma-js";
import withDesignSystemDefaults, { IDesignSystem } from "../design-system";
import { contrast, WCAGAAContrastRatios } from "@microsoft/fast-jss-utilities";
import { curry } from "lodash-es";

export function applyMixedColor(color1: string, color2: string, mixValue: number, alpha: number = 1): string {
    return Chroma.mix(color1, color2, mixValue).alpha(alpha).css();
}

export enum ContrastModifiers {
    rest = 0,
    hover = 1,
    disabled = 3
}

/**
 * An instance of the contrast function with it's target ratio pre-bound
 */
// TODO: these need to use the scaleContrast tooling
export const normalContrast: (operandColor: string, referenceColor: string) => string = curry(contrast)(WCAGAAContrastRatios.normal);

/**
 * An instance of the contrast function with it's target ratio pre-bound
 */
export const largeContrast: (operandColor: string, referenceColor: string) => string = curry(contrast)(WCAGAAContrastRatios.large);
