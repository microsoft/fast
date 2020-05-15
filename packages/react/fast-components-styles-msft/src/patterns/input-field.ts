import { CSSRules } from "@microsoft/fast-jss-manager";
import { add, format, toPx } from "@microsoft/fast-jss-utilities";
import { applyCornerRadius } from "../utilities/border";
import { DesignSystem } from "../design-system";
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
import {
    backgroundColor,
    focusOutlineWidth,
    outlineWidth,
} from "../utilities/design-system";
import {
    HighContrastColor,
    highContrastDisabledBorder,
    highContrastOptOutProperty,
    highContrastOutlineFocus,
    highContrastSelector,
} from "../utilities/high-contrast";

/**
 * Shared input field styles
 */
export function inputFieldStyles(
    /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
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
        "font-family": "inherit",
        "box-sizing": "border-box",
        padding: format("0 {0}", horizontalSpacing(outlineWidth)),
        ...applyCornerRadius(),
        margin: "0",
        transition: "all 0.2s ease-in-out",
        "&:hover:enabled": {
            background: neutralFillInputHover,
            "border-color": neutralOutlineHover,
            [highContrastSelector]: {
                background: HighContrastColor.buttonBackground,
                border: format(
                    "{0} solid {1}",
                    toPx<DesignSystem>(outlineWidth),
                    () => HighContrastColor.selectedBackground
                ),
            },
        },
        "&:active:enabled": {
            background: neutralFillInputActive,
            "border-color": neutralOutlineActive,
        },
        "&:focus:enabled": {
            "box-shadow": format<DesignSystem>("0 0 0 1px {0} inset", neutralFocus),
            "border-color": neutralFocus,
            outline: "none",
            ...highContrastOutlineFocus,
        },
        "&:disabled": {
            ...applyDisabledState(),
            ...highContrastDisabledBorder,
        },
        "&::placeholder": {
            color: neutralForegroundHint(neutralFillInputRest),
            [highContrastSelector]: {
                color: HighContrastColor.disabledText,
            },
        },
        [highContrastSelector]: {
            ...highContrastOptOutProperty,
            background: HighContrastColor.buttonBackground,
            "border-color": HighContrastColor.buttonText,
            color: HighContrastColor.buttonText,
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
            "border-color": "transparent",
            [highContrastSelector]: {
                background: HighContrastColor.buttonBackground,
                border: format(
                    "{0} solid {1}",
                    toPx<DesignSystem>(outlineWidth),
                    () => HighContrastColor.selectedBackground
                ),
            },
        },
        "&:active:enabled": {
            "border-color": "transparent",
        },
        "&:focus:enabled": {
            "border-color": neutralFocus,
        },
        "&::placeholder": {
            color: neutralForegroundHint(neutralFillRest),
            [highContrastSelector]: {
                color: HighContrastColor.disabledText,
            },
        },
        [highContrastSelector]: {
            ...highContrastOptOutProperty,
            background: HighContrastColor.buttonBackground,
            "border-color": HighContrastColor.buttonText,
        },
    };
}

export const doubleOuterFocus: CSSRules<DesignSystem> = {
    "box-shadow": format(
        `0 0 0 2px {0}, 0 0 0 {2} {1}`,
        backgroundColor,
        neutralFocus,
        toPx(add(focusOutlineWidth, 2))
    ),
};
