import { CSSRules } from "@microsoft/fast-jss-manager";
import { multiply, toPx } from "@microsoft/fast-jss-utilities";
import {
    DesignSystem,
    DesignSystemResolver,
    ensureDesignSystemDefaults,
    withDesignSystemDefaults,
} from "../design-system";
import { cornerRadius } from "../utilities/design-system";

export function applyCornerRadius(): CSSRules<DesignSystem> {
    return { borderRadius: toPx(cornerRadius) };
}

export function applyFloatingCornerRadius(): CSSRules<DesignSystem> {
    return { borderRadius: toPx(multiply(cornerRadius, 2)) };
}

/**
 * Sets the border width, style, and color to reserve the space for the focus indicator.
 */
export function applyFocusPlaceholderBorder(
    config?: DesignSystem /* @deprecated - this function doesn't need an argument */
): CSSRules<DesignSystem> {
    return {
        border: ensureDesignSystemDefaults(
            (designSystem: DesignSystem): string =>
                `${toPx(designSystem.focusOutlineWidth)} solid transparent`
        ),
    };
}
