import { horizontalSpacing } from "../utilities/density";
import { CSSRules } from "@microsoft/fast-jss-manager";
import { DesignSystem } from "../design-system";
import { format, subtract, toPx } from "@microsoft/fast-jss-utilities";
import {
    neutralFillHover,
    neutralFillInputActive,
    neutralFillInputHover,
    neutralFillInputRest,
    neutralFillRest,
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
import { focusOutlineWidth, outlineWidth } from "../utilities/design-system";

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
        padding: format("0 {0}", horizontalSpacing(outlineWidth)),
        ...applyCornerRadius(),
        margin: "0",
        transition: "all 0.2s ease-in-out",
        "&:hover:enabled": {
            background: neutralFillInputHover,
            borderColor: neutralOutlineHover,
            "@media (-ms-high-contrast:active)": {
                background: "Background",
                border: format("{0} solid ButtonText", toPx<DesignSystem>(outlineWidth)),
            },
        },
        "&:active:enabled": {
            background: neutralFillInputActive,
            borderColor: neutralOutlineActive,
        },
        "&:focus:enabled": {
            boxShadow: format<DesignSystem>("0 0 0 1px {0} inset", neutralFocus),
            borderColor: neutralFocus,
            outline: "none",
            "@media (-ms-high-contrast:active)": {
                boxShadow: format(
                    "0 0 0 {0} ButtonText inset",
                    toPx<DesignSystem>(subtract(focusOutlineWidth, outlineWidth))
                ),
            },
        },
        "&:disabled": {
            ...applyDisabledState(),
            "@media (-ms-high-contrast:active)": {
                opacity: "1",
                background: "Background",
                border: format("{0} solid GrayText", toPx<DesignSystem>(outlineWidth)),
            },
        },
        "&::placeholder": {
            color: neutralForegroundHint(neutralFillInputRest),
        },
    };
}

export function filledInputFieldStyles(): CSSRules<{}> {
    return {
        ...inputFieldStyles(),
        background: neutralFillRest,
        border: format("{0} solid transparent", toPx(outlineWidth)),
        "&:hover:enabled": {
            background: neutralFillHover,
            borderColor: "transparent",
        },
        "&:active:enabled": {
            borderColor: "transparent",
        },
        "&:focus:enabled": {
            borderColor: neutralFocus,
        },
        "&::placeholder": {
            color: neutralForegroundHint(neutralFillRest),
        },
    };
}
