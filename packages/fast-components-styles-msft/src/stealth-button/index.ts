import { ButtonBaseClassNameContract as AccentButtonClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";
import { ComponentStyles } from "@microsoft/fast-jss-manager";
import { applyFocusVisible } from "@microsoft/fast-jss-utilities";
import { DesignSystem } from "../design-system";
import {
    neutralFillStealthActive,
    neutralFillStealthHover,
    neutralFillStealthRest,
    neutralFocus,
    neutralForegroundRest,
} from "../utilities/color";
import { baseButton, buttonStyles } from "../patterns/button";

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
            }
        },
        "&:active:enabled": {
            backgroundColor: neutralFillStealthActive,
        },
        ...applyFocusVisible<DesignSystem>({
            borderColor: neutralFocus,
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
            border: "none",
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
                    color: "GrayText",
                },
            }
        },
    },
};

export default styles;
