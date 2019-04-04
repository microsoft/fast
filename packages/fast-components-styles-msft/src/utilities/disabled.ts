import { CSSRules } from "@microsoft/fast-jss-manager";
import {
    DesignSystem,
    ensureDesignSystemDefaults,
    withDesignSystemDefaults,
} from "../design-system";
import { applyCursorDisabled } from "./cursor";

export function applyDisabledState(
    config?: DesignSystem /* @deprecated - this function doesn't need an argument */
): CSSRules<DesignSystem> {
    return {
        opacity: ensureDesignSystemDefaults(
            (designSystem: DesignSystem): string =>
                designSystem.disabledOpacity.toString()
        ),
        ...applyCursorDisabled(),
    };
}
