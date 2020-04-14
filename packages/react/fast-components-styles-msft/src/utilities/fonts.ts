import { CSSRules } from "@microsoft/fast-jss-manager";
import { DesignSystem, DesignSystemResolver } from "../design-system";
import { getFontWeight } from "./design-system";

export interface FontWeight {
    light: number;
    semilight: number;
    normal: number;
    semibold: number;
    bold: number;
}

/**
 * Retrieve the focusOutlineWidth from the design system
 */

function weight(index: keyof FontWeight): DesignSystemResolver<string> {
    return (designSystem: DesignSystem): string => {
        return getFontWeight(designSystem)[index].toString();
    };
}

function applyFontWeight(
    weightResolver: DesignSystemResolver<string>
): CSSRules<DesignSystem> {
    return { "font-weight": weightResolver };
}

export function applyFontWeightLight(): CSSRules<DesignSystem> {
    return applyFontWeight(weight("light"));
}

export function applyFontWeightSemiLight(): CSSRules<DesignSystem> {
    return applyFontWeight(weight("semilight"));
}

export function applyFontWeightNormal(): CSSRules<DesignSystem> {
    return applyFontWeight(weight("normal"));
}

export function applyFontWeightSemiBold(): CSSRules<DesignSystem> {
    return applyFontWeight(weight("semibold"));
}

export function applyFontWeightBold(): CSSRules<DesignSystem> {
    return applyFontWeight(weight("bold"));
}
