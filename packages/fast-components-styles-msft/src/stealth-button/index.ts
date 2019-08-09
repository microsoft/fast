import { ButtonBaseClassNameContract as AccentButtonClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";
import { ComponentStyles } from "@microsoft/fast-jss-manager";
import { applyFocusVisible, format, toPx } from "@microsoft/fast-jss-utilities";
import { DesignSystem } from "../design-system";
import {
    neutralFillStealthActive,
    neutralFillStealthHover,
    neutralFillStealthRest,
    neutralFocus,
    neutralForegroundRest,
} from "../utilities/color";
import { baseButton, buttonStyles } from "../patterns/button";
import { focusOutlineWidth } from "../utilities/design-system";

const styles: ComponentStyles<AccentButtonClassNameContract, DesignSystem> = {
    ...baseButton,
    button: {
        ...buttonStyles(),
        color: neutralForegroundRest,
        fill: neutralForegroundRest,
        background: neutralFillStealthRest,
        "&:hover:enabled": {
            backgroundColor: neutralFillStealthHover,
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
            backgroundColor: neutralFillStealthActive,
        },
        ...applyFocusVisible<DesignSystem>({
            borderColor: neutralFocus,
            "@media (-ms-high-contrast:active)": {
                boxShadow: format(`0 0 0 {0} inset ButtonText`, toPx(focusOutlineWidth)),
            },
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
        "@media (-ms-high-contrast:active)": {
            background: "ButtonFace",
            border: "none",
            color: "ButtonText",
            fill: "ButtonText",
            "-ms-high-contrast-adjust": "none",
        },
        "a&": {
            "@media (-ms-high-contrast:active)": {
                color: "LinkText",
                "&:hover": {
                    background: "Highlight",
                    color: "HighlightText",
                },
            },
            "&$button__disabled": {
                "@media (-ms-high-contrast:active)": {
                    color: "GrayText",
                    boxShadow: "none",
                },
                "&:hover": {
                    background: "transparent",
                    color: "GrayText",
                    "& $button_beforeContent, & $button_afterContent": {
                        "@media (-ms-high-contrast:active)": {
                            fill: "GrayText",
                        },
                    },
                },
            },
        },
    },
};

export default styles;
