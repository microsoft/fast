import { CSSRules } from "@microsoft/fast-jss-manager";
import { toPx } from "@microsoft/fast-jss-utilities";
import {
    DesignSystem,
    DesignSystemResolver,
    ensureDesignSystemDefaults,
    withDesignSystemDefaults,
} from "../design-system";

function cornerRadius(designSystem: DesignSystem): string;
function cornerRadius(multiplier: number): DesignSystemResolver<string>;
function cornerRadius(arg: any): any {
    if (typeof arg === "number") {
        return ensureDesignSystemDefaults(
            (designSystem: DesignSystem): string => {
                return toPx(designSystem.cornerRadius * arg);
            }
        );
    }

    return toPx(withDesignSystemDefaults(arg).cornerRadius);
}

export function applyCornerRadius(): CSSRules<DesignSystem> {
    return { borderRadius: cornerRadius };
}

export function applyFloatingCornerRadius(): CSSRules<DesignSystem> {
    return { borderRadius: cornerRadius(2) };
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
