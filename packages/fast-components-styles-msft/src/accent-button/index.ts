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
    applyHighContrastDisabledBorder,
    applyHighContrastDisabledForeground,
    applyHighContrastDoubleFocus,
    applyHighContrastHyperLink,
    applyHighContrastSelected,
    applyHighContrastSelectedForeground,
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
                background: "HighlightText",
                borderColor: "Highlight",
                color: "Highlight",
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
            ...applyHighContrastDoubleFocus,
        }),
        "&:disabled": {
            ...applyHighContrastDisabledBorder,
            "& $button_beforeContent, & $button_afterContent": {
                ...applyHighContrastDisabledForeground,
            },
        },
        "& $button_beforeContent, & $button_afterContent": {
            fill: accentForegroundCut,
            ...applyHighContrastSelectedForeground,
        },
        ...applyHighContrastSelected,
        "a&": {
            ...applyHighContrastHyperLink,
            "&$button__disabled": {
                ...applyHighContrastDisabledBorder,
                "& $button_beforeContent, & $button_afterContent": {
                    ...applyHighContrastDisabledForeground,
                },
                "&:hover:enabled": {
                    ...applyHighContrastDisabledBorder,
                    "& $button_beforeContent, & $button_afterContent": {
                        ...applyHighContrastDisabledForeground,
                    },
                },
            },
        },
    },
};

export default styles;
