import { CSSRules } from "@microsoft/fast-jss-manager";
import {
    DesignSystem,
    DesignSystemResolver,
    getDesignSystemValue
} from "../design-system";

export interface FontWeight {
    light: number;
    semilight: number;
    normal: number;
    semibold: number;
    bold: number;
}

export const defaultFontWeights: FontWeight = {
    light: 100,
    semilight: 200,
    normal: 400,
    semibold: 600,
    bold: 700,
};

/**
 * @deprecated - use applyFontWeight instead
 */
export const fontWeight: FontWeight = defaultFontWeights;

/**
 * Retrieve the focusOutlineWidth from the design system
 */
const getDesignSystemFontWeight: DesignSystemResolver<FontWeight> = getDesignSystemValue(
    "fontWeight"
);

function weight(index: keyof FontWeight): DesignSystemResolver<string> {
    return (designSystem: DesignSystem): string => {
            return `${getDesignSystemFontWeight(designSystem)[index]}`;
        };
}

export function applyFontWeightLight(): CSSRules<DesignSystem> {
    return { fontWeight: weight("light") };
}

export function applyFontWeightSemiLight(): CSSRules<DesignSystem> {
    return { fontWeight: weight("semilight") };
}

export function applyFontWeightNormal(): CSSRules<DesignSystem> {
    return { fontWeight: weight("normal") };
}

export function applyFontWeightSemiBold(): CSSRules<DesignSystem> {
    return { fontWeight: weight("semibold") };
}

export function applyFontWeightBold(): CSSRules<DesignSystem> {
    return { fontWeight: weight("bold") };
}
