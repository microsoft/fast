import { ButtonBaseClassNameContract as AccentButtonClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";
import { ComponentStyles } from "@microsoft/fast-jss-manager";
import { applyFocusVisible, format } from "@microsoft/fast-jss-utilities";
import { DesignSystem } from "../design-system";
import { baseButton, buttonStyles } from "../patterns/button";
import {
    accentFillActive,
    accentFillHover,
    accentFillRest,
    accentForegroundCut,
    neutralFocus,
    neutralFocusInnerAccent,
} from "../utilities/color";
import {
    HighContrastColor,
    highContrastDisabledBorder,
    highContrastDisabledForeground,
    highContrastDoubleFocus,
    highContrastSelector,
} from "../utilities/high-contrast";

const styles: ComponentStyles<AccentButtonClassNameContract, DesignSystem> = {
    ...baseButton,
    button: {
        ...buttonStyles(),
        color: accentForegroundCut,
        fill: accentForegroundCut,
        background: accentFillRest,
        "&:hover:enabled": {
            background: accentFillHover,
            [highContrastSelector]: {
                background: HighContrastColor.selectedText,
                borderColor: HighContrastColor.selectedBackground,
                color: HighContrastColor.selectedBackground,
            },
            "& $button_beforeContent, & $button_afterContent": {
                [highContrastSelector]: {
                    fill: "Highlight",
                },
            },
        },
        "&:active:enabled": {
            background: accentFillActive,
        },
        ...applyFocusVisible<DesignSystem>({
            borderColor: neutralFocus,
            boxShadow: format(
                "0 0 0 2px inset {0}",
                neutralFocusInnerAccent(accentFillRest)
            ),
            ...highContrastDoubleFocus,
        }),
        "&:disabled": {
            ...highContrastDisabledBorder,
            "& $button_beforeContent, & $button_afterContent": {
                ...highContrastDisabledForeground,
            },
        },
        "& $button_beforeContent, & $button_afterContent": {
            fill: accentForegroundCut,
            [highContrastSelector]: {
                fill: "HighlightText",
            },
        },
        [highContrastSelector]: {
            background: HighContrastColor.selectedBackground,
            borderColor: HighContrastColor.selectedBackground,
            color: HighContrastColor.selectedText,
            "-ms-high-contrast-adjust": "none",
        },
        "a&": {
            "&$button__disabled": {
                ...highContrastDisabledBorder,
                "& $button_beforeContent, & $button_afterContent": {
                    ...highContrastDisabledForeground,
                },
            },
        },
    },
};

export default styles;
