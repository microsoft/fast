import { ButtonBaseClassNameContract as AccentButtonClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";
import { ComponentStyles } from "@microsoft/fast-jss-manager";
import { applyFocusVisible, format, toPx } from "@microsoft/fast-jss-utilities";
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
import { focusOutlineWidth } from "../utilities/design-system";

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
                background: "HighlightText",
                borderColor: "Highlight",
                color: "Highlight",
            },
            "& $button_beforeContent, & $button_afterContent": {
                "@media (-ms-high-contrast:active)": {
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
            "@media (-ms-high-contrast:active)": {
                borderColor: "ButtonText",
                boxShadow: format(
                    "0 0 0 {0} inset ButtonFace",
                    toPx(focusOutlineWidth)
                ),
            }
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
                fill: "HighlightText",
            }
        },
        "@media (-ms-high-contrast:active)": {
            background: "Highlight",
            borderColor: "Highlight",
            color: "HighlightText",
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
                    borderColor: "GrayText",
                    color: "GrayText",
                },
                "& $button_beforeContent, & $button_afterContent": {
                    "@media (-ms-high-contrast:active)": {
                        fill: "GrayText",
                    },
                },
                "&:hover:enabled": {
                    "@media (-ms-high-contrast:active)": {
                        background: "transparent",
                        borderColor: "GrayText",
                        color: "GrayText",
                    },
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
