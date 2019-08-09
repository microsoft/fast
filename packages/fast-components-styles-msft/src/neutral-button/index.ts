import { ButtonBaseClassNameContract as NeutralButtonClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";
import { ComponentStyles } from "@microsoft/fast-jss-manager";
import { DesignSystem } from "../design-system";
import { baseButton, buttonStyles } from "../patterns/button";
import { applyFocusVisible, format, toPx } from "@microsoft/fast-jss-utilities";
import {
    neutralFillActive,
    neutralFillHover,
    neutralFillRest,
    neutralFocus,
    neutralForegroundRest,
} from "../utilities/color";
import { outlineWidth } from "../utilities/design-system";

const styles: ComponentStyles<NeutralButtonClassNameContract, DesignSystem> = {
    ...baseButton,
    button: {
        ...buttonStyles(),
        color: neutralForegroundRest,
        fill: neutralForegroundRest,
        background: neutralFillRest,
        "&:hover:enabled": {
            background: neutralFillHover,
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
            background: neutralFillActive,
        },
        ...applyFocusVisible<DesignSystem>({
            borderColor: neutralFocus,
            "@media (-ms-high-contrast:active)": {
                borderColor: "ButtonText",
                boxShadow: format("0 0 0 {0} inset ButtonText", toPx(outlineWidth)),
            },
        }),
        "&:disabled": {
            "@media (-ms-high-contrast:active)": {
                background: "Background",
                borderColor: "GrayText",
                color: "GrayText",
            },
            "a&": {
                "@media (-ms-high-contrast:active)": {
                    color: "GrayText",
                },
            },
        },
        "&::-moz-focus-inner": {
            border: "0",
        },
        "@media (-ms-high-contrast:active)": {
            background: "ButtonFace",
            borderColor: "ButtonText",
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
                    background: "transparent",
                    borderColor: "GrayText",
                    color: "GrayText",
                },
                "&:hover": {
                    background: "transparent",
                    borderColor: "GrayText",
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
