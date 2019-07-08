import { CSSRules } from "@microsoft/fast-jss-manager";
import { format, toPx } from "@microsoft/fast-jss-utilities";
import { DesignSystem } from "../design-system";
import {
    cornerRadius,
    elevatedCornerRadius,
    focusOutlineWidth,
} from "../utilities/design-system";

/**
 * Sets the border radius for controls.
 */
export function applyCornerRadius(): CSSRules<DesignSystem> {
    return { borderRadius: toPx(cornerRadius) };
}

/**
 * Sets the border radius for elevated surfaces or controls.
 */
export function applyElevatedCornerRadius(): CSSRules<DesignSystem> {
    return applyFloatingCornerRadius();
}

/**
 * @deprecated Use applyElevatedCornerRadius instead.
 */
export function applyFloatingCornerRadius(): CSSRules<DesignSystem> {
    return { borderRadius: toPx(elevatedCornerRadius) };
}

/**
 * Sets the border width, style, and color to reserve the space for the focus indicator.
 */
export function applyFocusPlaceholderBorder(
    config?: DesignSystem /* @deprecated - this function doesn't need an argument */
): CSSRules<DesignSystem> {
    return {
        border: format("{0} solid transparent", toPx(focusOutlineWidth)),
    };
}
