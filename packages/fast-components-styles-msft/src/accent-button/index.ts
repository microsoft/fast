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

const styles: ComponentStyles<AccentButtonClassNameContract, DesignSystem> = {
    ...baseButton,
    button: {
        ...buttonStyles(),
        color: accentForegroundCut,
        fill: accentForegroundCut,
        background: accentFillRest,
        "&:hover:enabled": {
            background: accentFillHover,
            "@media (-ms-high-contrast:active)": {
                background: "Highlight",
                color: "HighlightText",
            },
            "& $button_beforeContent, & $button_afterContent": {
                "@media (-ms-high-contrast:active)": {
                    fill: "HighlightText",
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
        }),
        "&:disabled": {
            "@media (-ms-high-contrast:active)": {
                background: "Background",
                borderColor: "GrayText",
                color: "GrayText",
            },
            "& $button_beforeContent, & $button_afterContent": {
                "@media (-ms-high-contrast:active)": {
                    fill: "GrayText",
                },
            },
        },
        "& $button_beforeContent, & $button_afterContent": {
            fill: accentForegroundCut,
            "@media (-ms-high-contrast:active)": {
                fill: "ButtonText",
            }
        },
        "@media (-ms-high-contrast:active)": {
            background: "ButtonFace",
            borderColor: "ButtonText",
            color: "ButtonText",
            "-ms-high-contrast-adjust": "none"
        },
        "a&": {
            "@media (-ms-high-contrast:active)": {
                color: "LinkText",
                "&:hover": {
                    background: "Highlight",
                    color: "HighlightText",
                }
            },
            "&$button__disabled": {
                "@media (-ms-high-contrast:active)": {
                    background: "transparent",
                    color: "GrayText",
                },
                "& $button_beforeContent, & $button_afterContent": {
                    "@media (-ms-high-contrast:active)": {
                        fill: "GrayText",
                    },
                }
            },
        },
    },
};

export default styles;
