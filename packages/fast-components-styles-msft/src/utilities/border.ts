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

    return toPx(arg.cornerRadius);
}

export function applyCornerRadius(): CSSRules<DesignSystem> {
    return { borderRadius: cornerRadius };
}

export function applyFloatingCornerRadius(): CSSRules<DesignSystem> {
    return { borderRadius: cornerRadius(2) };
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
