import { CSSRules } from "@microsoft/fast-jss-manager";
import { toString } from "@microsoft/fast-jss-utilities";
import { DesignSystem } from "../design-system";
import { disabledOpacity } from "../utilities/design-system";
import { applyCursorDisabled } from "./cursor";
import { HighContrastColor, highContrastSelector } from "./high-contrast";

export function applyDisabledState(
    /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
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
