import { horizontalSpacing } from "../utilities/density";
import { CSSRules } from "@microsoft/fast-jss-manager";
import { DesignSystem, ensureDesignSystemDefaults } from "../design-system";
import { format, toPx } from "@microsoft/fast-jss-utilities";
import {
    neutralFillInputActive,
    neutralFillInputHover,
    neutralFillInputRest,
    neutralFocus,
    neutralForegroundHint,
    neutralForegroundRest,
    neutralOutlineActive,
    neutralOutlineHover,
    neutralOutlineRest,
} from "../utilities/color";
import { applyCornerRadius } from "../utilities/border";
import { applyDisabledState } from "../utilities/disabled";
import { applyScaledTypeRamp } from "../utilities/typography";
import { applyFontWeightNormal } from "../utilities/fonts";
import { outlineWidth } from "../utilities/design-system";

/**
 * Shared input field styles
 */
export function inputFieldStyles(
    config?: DesignSystem /* @deprecated - argument is no longer necessary */
): CSSRules<{}> {
    return {
        ...applyScaledTypeRamp("t7"),
        ...applyFontWeightNormal(),
        background: neutralFillInputRest,
        border: format(
            "{0} solid {1}",
            toPx<DesignSystem>(outlineWidth),
            neutralOutlineRest
        ),
        color: neutralForegroundRest,
        fontFamily: "inherit",
        boxSizing: "border-box",
        padding: ensureDesignSystemDefaults(
            (designSystem: DesignSystem): string =>
                format("0 {0}", horizontalSpacing(designSystem.outlineWidth))(
                    designSystem
                )
        ),
        ...applyCornerRadius(),
        margin: "0",
        transition: "all 0.2s ease-in-out",
        "&:hover:enabled": {
            background: neutralFillInputHover,
            borderColor: neutralOutlineHover,
        },
        "&:active:enabled": {
            background: neutralFillInputActive,
            borderColor: neutralOutlineActive,
        },
        "&:focus": {
            boxShadow: format<DesignSystem>("0 0 0 1px {0} inset", neutralFocus),
            borderColor: neutralFocus,
            outline: "none",
        },
        "&:disabled": {
            ...applyDisabledState(),
        },
        "&::placeholder": {
            color: neutralForegroundHint,
        },
    };
}
