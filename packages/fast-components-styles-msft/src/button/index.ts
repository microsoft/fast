import { ButtonClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";
import { ComponentStyles, CSSRules } from "@microsoft/fast-jss-manager";
import {
    applyFocusVisible,
    directionSwitch,
    format,
    toPx,
} from "@microsoft/fast-jss-utilities";
import { DesignSystem, ensureDesignSystemDefaults } from "../design-system";
import { applyCornerRadius, applyFocusPlaceholderBorder } from "../utilities/border";
import {
    accentFillActive,
    accentFillHover,
    accentFillRest,
    accentForegroundActive,
    accentForegroundCut,
    accentForegroundHover,
    accentForegroundRest,
    neutralFillActive,
    neutralFillHover,
    neutralFillRest,
    neutralFillStealthActive,
    neutralFillStealthHover,
    neutralFillStealthRest,
    neutralFocus,
    neutralFocusInnerAccent,
    neutralForegroundRest,
    neutralOutlineActive,
    neutralOutlineHover,
    neutralOutlineRest,
} from "../utilities/color";
import { applyCursorPointer } from "../utilities/cursor";
import { glyphSize, height, horizontalSpacing } from "../utilities/density";
import { focusOutlineWidth, outlineWidth } from "../utilities/design-system";
import { applyDisabledState } from "../utilities/disabled";
import { applyScaledTypeRamp } from "../utilities/typography";

const transparentBackground: CSSRules<DesignSystem> = {
    backgroundColor: "transparent",
};

const applyTransparentBackplateStyles: CSSRules<DesignSystem> = {
    color: accentForegroundRest,
    fill: accentForegroundRest,
    ...transparentBackground,
    ...applyFocusVisible({
        borderColor: "transparent",
        boxShadow: "none",
        "& $button_contentRegion::before": {
            background: neutralForegroundRest,
            height: toPx<DesignSystem>(focusOutlineWidth),
        },
    }),
    // Underline
    "&:hover $button_contentRegion::before": {
        background: accentForegroundHover,
        "@media (-ms-high-contrast:active)": {
            background: "ButtonText",
        },
    },
    "&:hover$button__disabled $button_contentRegion::before": {
        display: "none",
    },
    "&:active $button_contentRegion::before": {
        background: accentForegroundActive,
    },
    "&$button__disabled, &$button__disabled $button_contentRegion::before": {
        ...transparentBackground,
    },
    "@media (-ms-high-contrast:active)": {
        border: "none",
        color: "ButtonText",
        fill: "ButtonText",
    },
    "&:hover:enabled": {
        color: accentForegroundHover,
        fill: accentForegroundHover,
        ...transparentBackground,
        "@media (-ms-high-contrast:active)": {
            color: "ButtonText",
            fill: "ButtonText",
        },
    },
    "&:active:enabled": {
        color: accentForegroundActive,
        fill: accentForegroundActive,
        ...transparentBackground,
    },
};

const styles: ComponentStyles<ButtonClassNameContract, DesignSystem> = {
    button: {
        ...applyScaledTypeRamp("t7"),
        fontFamily: "inherit",
        ...applyCursorPointer(),
        boxSizing: "border-box",
        maxWidth: "374px",
        minWidth: ensureDesignSystemDefaults(
            (designSystem: DesignSystem): string =>
                designSystem.density <= -2 ? "28px" : "32px"
        ),
        padding: format("0 {0}", horizontalSpacing(focusOutlineWidth)),
        display: "inline-flex",
        justifyContent: "center",
        alignItems: "center",
        height: height(),
        ...applyFocusPlaceholderBorder(),
        ...applyCornerRadius(),
        lineHeight: "1",
        overflow: "hidden",
        textDecoration: "none",
        whiteSpace: "nowrap",
        transition: "all 0.1s ease-in-out",
        color: neutralForegroundRest,
        fill: neutralForegroundRest,
        background: neutralFillRest,
        "&:hover:enabled": {
            background: neutralFillHover,
            "@media (-ms-high-contrast:active)": {
                background: "Highlight",
                color: "HighlightText",
                fill: "HighlightText"
            }
        },
        "&:active:enabled": {
            background: neutralFillActive,
        },
        ...applyFocusVisible<DesignSystem>({
            borderColor: neutralFocus,
        }),
        "&:disabled": {
            "@media (-ms-high-contrast:active)": {
                borderColor: "GrayText",
            }
        },
        "&::-moz-focus-inner": {
            border: "0",
        },
        "@media (-ms-high-contrast:active)": {
            background: "Background",
            borderColor: "ButtonText",
            color: "ButtonText",
            fill: "ButtonText",
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
                }
            },
        },
    },
    button__primary: {
        color: accentForegroundCut,
        fill: accentForegroundCut,
        background: accentFillRest,
        "&:hover:enabled": {
            background: accentFillHover,
            "@media (-ms-high-contrast:active)": {
                background: "HighlightText",
                borderColor: "Highlight",
                color: "Highlight",
            }
        },
        "&:active:enabled": {
            background: accentFillActive,
        },
        ...applyFocusVisible<DesignSystem>({
            borderColor: neutralFocus,
            boxShadow: format(
                "0 0 0 {0} inset {1}",
                toPx(focusOutlineWidth),
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
            }
        },
        "& $button_beforeContent, & $button_afterContent": {
            fill: accentForegroundCut,
            "@media (-ms-high-contrast:active)": {
                fill: "ButtonText",
            }
        },
        "@media (-ms-high-contrast:active)": {
            background: "Highlight",
            borderColor: "Highlight",
            color: "HighlightText",
            "-ms-high-contrast-adjust": "none"
        }
    },
    button__outline: {
        background: "transparent",
        border: format(
            "{0} solid {1}",
            toPx<DesignSystem>(outlineWidth),
            neutralOutlineRest
        ),
        padding: format("0 {0}", horizontalSpacing(outlineWidth)),
        "&:hover:enabled": {
            background: "transparent",
            border: format(
                "{0} solid {1}",
                toPx<DesignSystem>(outlineWidth),
                neutralOutlineHover
            ),
            "@media (-ms-high-contrast:active)": {
                background: "Highlight",
                color: "HighlightText",
            }
        },
        "&:active:enabled": {
            background: "transparent",
            border: format(
                "{0} solid {1}",
                toPx<DesignSystem>(outlineWidth),
                neutralOutlineActive
            ),
        },
        ...applyFocusVisible<DesignSystem>({
            boxShadow: ensureDesignSystemDefaults(
                (designSystem: DesignSystem): string => {
                    return `0 0 0 ${toPx(
                        designSystem.focusOutlineWidth - designSystem.outlineWidth
                    )} ${neutralFocus(designSystem)} inset`;
                }
            ),
            borderColor: neutralFocus,
            "@media (-ms-high-contrast:active)": {
                borderColor: "2px solid ButtonText"
            }
        }),
        "&:disabled": {
            "@media (-ms-high-contrast:active)": {
                borderColor: "GrayText",
            }
        },
        "@media (-ms-high-contrast:active)": {
            border: format(
                "{0} solid ButtonText",
                toPx<DesignSystem>(outlineWidth)
            ),
            color: "ButtonText",
            "-ms-high-contrast-adjust": "none"
        }
    },
    button__lightweight: {
        ...applyTransparentBackplateStyles,
    },
    button__justified: {
        ...applyTransparentBackplateStyles,
        minWidth: "74px",
        paddingLeft: "0",
        paddingRight: "0",
        borderWidth: "0",
        justifyContent: "flex-start",
    },
    button__stealth: {
        background: neutralFillStealthRest,
        "&:hover:enabled": {
            backgroundColor: neutralFillStealthHover,
            "@media (-ms-high-contrast:active)": {
                background: "Highlight",
                color: "HighlightText",
            }
        },
        "&:active:enabled": {
            backgroundColor: neutralFillStealthActive,
        },
        ...applyFocusVisible<DesignSystem>({
            borderColor: neutralFocus,
            "@media (-ms-high-contrast:active)": {
                borderColor: "2px solid ButtonText"
            }
        }),
        "@media (-ms-high-contrast:active)": {
            background: "Background",
            border: "none",
            color: "ButtonText",
            "-ms-high-contrast-adjust": "none"
        }
    },
    button_contentRegion: {
        position: "relative",
        "&::before": {
            content: "''",
            display: "block",
            height: toPx<DesignSystem>(outlineWidth),
            position: "absolute",
            bottom: "-3px",
            width: "100%",
            left: directionSwitch("0", ""),
            right: directionSwitch("", "0"),
        },
        "& svg": {
            width: glyphSize,
            height: glyphSize,
        },
    },
    button__disabled: {
        ...applyDisabledState(),
        "& $button_beforeContent, & $button_afterContent": {
            fill: "ButtonHighlight",
            "@media (-ms-high-contrast:active)": {
                fill: "GrayText",
            }
        },
    },
    button_beforeContent: {
        width: glyphSize,
        height: glyphSize,
    },
    button_afterContent: {
        width: glyphSize,
        height: glyphSize,
    },
};

export default styles;
