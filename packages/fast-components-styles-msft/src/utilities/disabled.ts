import { CSSRules } from "@microsoft/fast-jss-manager";
import { DesignSystem } from "../design-system";
import { applyCursorDisabled } from "./cursor";
import { disabledOpacity } from "../utilities/design-system";
import { toString } from "@microsoft/fast-jss-utilities";
import { HighContrastColor, highContrastSelector } from "./high-contrast";

export function applyDisabledState(
    config?: DesignSystem /* @deprecated - this function doesn't need an argument */
): CSSRules<DesignSystem> {
    return {
        opacity: toString(disabledOpacity),
        ...applyCursorDisabled(),
        [highContrastSelector]: {
            opacity: "1",
            color: HighContrastColor.disabledText,
        },
    };
}
