import { CSSRules } from "@microsoft/fast-jss-manager";
import { DesignSystem } from "../design-system";
import { applyCursorDisabled } from "./cursor";
import { disabledOpacity } from "../utilities/design-system";
import { toString } from "@microsoft/fast-jss-utilities";

export function applyDisabledState(
    config?: DesignSystem /* @deprecated - this function doesn't need an argument */
): CSSRules<DesignSystem> {
    return {
        opacity: toString(disabledOpacity),
        ...applyCursorDisabled(),
    };
}
