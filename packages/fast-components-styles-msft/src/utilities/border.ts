import { CSSRules } from "@microsoft/fast-jss-manager";
import { toPx } from "@microsoft/fast-jss-utilities";
import { DesignSystem, withDesignSystemDefaults } from "../design-system";

export function applyCornerRadius(
    designSystem: DesignSystem,
    floating: boolean = false
): CSSRules<DesignSystem> {
    return {
        borderRadius: toPx(designSystem.cornerRadius * (floating ? 2 : 1)),
    };
}

/**
 * Sets the border width, style, and color to reserve the space for the focus indicator.
 *
 * @param config The design system config
 */
export function applyFocusPlaceholderBorder(
    config: DesignSystem
): CSSRules<DesignSystem> {
    const designSystem: DesignSystem = withDesignSystemDefaults(config);
    return {
        border: `${toPx(designSystem.focusOutlineWidth)} solid transparent`,
    };
}
