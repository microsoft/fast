import { CSSRules } from "@microsoft/fast-jss-manager";
import { applyCornerRadius } from "../utilities/border";
import { DesignSystem } from "../design-system";
import { format, toPx } from "@microsoft/fast-jss-utilities";
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
import { horizontalSpacing } from "../utilities/density";
import { applyDisabledState } from "../utilities/disabled";
import { applyScaledTypeRamp } from "../utilities/typography";
import { applyFontWeightNormal } from "../utilities/fonts";
import { outlineWidth } from "../utilities/design-system";
import {
    highContrastDisabledBorder,
    highContrastOutlineFocus,
    highContrastSelector,
} from "../utilities/high-contrast";

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
            [highContrastSelector]: {
                background: "Background",
                border: format("{0} solid Highlight", toPx<DesignSystem>(outlineWidth)),
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
            ...highContrastOutlineFocus,
        },
        "&:disabled": {
            ...applyDisabledState(),
            ...highContrastDisabledBorder,
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
