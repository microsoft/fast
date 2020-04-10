import { CSSRules } from "@microsoft/fast-jss-manager";
import { format, toPx } from "@microsoft/fast-jss-utilities";
import { DesignSystem, DesignSystemResolver } from "../design-system";
import {
    cornerRadius,
    elevatedCornerRadius,
    focusOutlineWidth,
} from "../utilities/design-system";

function cornerRadiusRule(
    value: string | DesignSystemResolver<string>
): CSSRules<DesignSystem> {
    return { "border-radius": value };
}
/**
 * Sets the border radius for controls.
 */
export function applyCornerRadius(): CSSRules<DesignSystem> {
    return cornerRadiusRule(toPx(cornerRadius));
}

/**
 * @deprecated Use applyElevatedCornerRadius instead.
 */
export function applyFloatingCornerRadius(): CSSRules<DesignSystem> {
    return cornerRadiusRule(toPx(elevatedCornerRadius));
}

/**
 * Sets the border radius for elevated surfaces or controls.
 */
export function applyElevatedCornerRadius(): CSSRules<DesignSystem> {
    return applyFloatingCornerRadius();
}

/**
 * Sets the border radius for pill-shaped controls.
 */
export function applyPillCornerRadius(): CSSRules<DesignSystem> {
    return cornerRadiusRule("999px");
}

/**
 * Sets the border width, style, and color to reserve the space for the focus indicator.
 */
export function applyFocusPlaceholderBorder(
    /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
    config?: DesignSystem /* @deprecated - this function doesn't need an argument */
): CSSRules<DesignSystem> {
    return {
        border: format("{0} solid transparent", toPx(focusOutlineWidth)),
    };
}
