import { ButtonClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";
import { ComponentStyles, CSSRules } from "@microsoft/fast-jss-manager";
import {
    applyFocusVisible,
    directionSwitch,
    format,
    subtract,
    toPx,
} from "@microsoft/fast-jss-utilities";
import { DesignSystem, DesignSystemResolver } from "../design-system";
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
import {
    focusOutlineWidth,
    getDesignSystemValue,
    outlineWidth,
} from "../utilities/design-system";
import { applyDisabledState } from "../utilities/disabled";
import {
    highContrastAccent,
    HighContrastColor,
    highContrastDisabledBorder,
    highContrastDisabledForeground,
    highContrastDoubleFocus,
    highContrastHighlightBackground,
    highContrastHighlightForeground,
    highContrastLinkBorder,
    highContrastLinkForeground,
    highContrastLinkOutline,
    highContrastLinkValue,
    highContrastOutline,
    highContrastOutlineFocus,
    highContrastSelected,
    highContrastSelectedForeground,
    highContrastSelectedOutline,
    highContrastSelector,
    highContrastStealth,
} from "../utilities/high-contrast";
import { applyScaledTypeRamp } from "../utilities/typography";

const transparentBackground: CSSRules<DesignSystem> = {
    "background-color": "transparent",
};

const density: DesignSystemResolver<number> = getDesignSystemValue("density");

const applyTransparentBackplateStyles: CSSRules<DesignSystem> = {
    color: accentForegroundRest,
    fill: accentForegroundRest,
    ...transparentBackground,
    ...applyFocusVisible({
        "border-color": "transparent",
        "box-shadow": "none",
        ...highContrastHighlightForeground,
        "& $button_contentRegion::before": {
            background: neutralForegroundRest,
            height: toPx<DesignSystem>(focusOutlineWidth),
            ...highContrastHighlightBackground,
        },
    }),
    // Underline
    "& $button_contentRegion::before": {
        [highContrastSelector]: {
            background: HighContrastColor.buttonText,
        },
    },
    "&:hover $button_contentRegion::before": {
        background: accentForegroundHover,
        ...highContrastHighlightBackground,
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
    "&:hover:enabled, a&:not($button__disabled):hover": {
        color: accentForegroundHover,
        ...transparentBackground,
        ...highContrastHighlightForeground,
        "& $button_beforeContent, & $button_afterContent": {
            fill: accentForegroundHover,
            ...highContrastHighlightForeground,
        },
    },
    "&:active:enabled, a&:not($button__disabled):active": {
        color: accentForegroundActive,
        fill: accentForegroundActive,
        ...transparentBackground,
    },
    ...highContrastStealth,
};

const styles: ComponentStyles<ButtonClassNameContract, DesignSystem> = {
    button: {
        ...applyScaledTypeRamp("t7"),
        "font-family": "inherit",
        ...applyCursorPointer(),
        "box-sizing": "border-box",
        "max-width": "374px",
        "min-width": (designSystem: DesignSystem): string =>
            density(designSystem) <= -2 ? "28px" : "32px",
        padding: format("0 {0}", horizontalSpacing(focusOutlineWidth)),
        display: "inline-flex",
        "justify-content": "center",
        "align-items": "center",
        height: height(),
        ...applyFocusPlaceholderBorder(),
        ...applyCornerRadius(),
        "line-height": "1",
        overflow: "hidden",
        "text-decoration": "none",
        "white-space": "nowrap",
        transition: "all 0.1s ease-in-out",
        color: neutralForegroundRest,
        fill: neutralForegroundRest,
        background: neutralFillRest,
        "&:hover:enabled, a&:not($button__disabled):hover": {
            background: neutralFillHover,
            ...highContrastSelected,
            "& $button_beforeContent, & $button_afterContent": {
                ...highContrastSelectedForeground,
            },
        },
        "&:active:enabled, a&:not($button__disabled):active": {
            background: neutralFillActive,
        },
        ...applyFocusVisible<DesignSystem>({
            ...highContrastOutlineFocus,
            "border-color": neutralFocus,
        }),
        "&:disabled": {
            ...highContrastDisabledBorder,
        },
        "&::-moz-focus-inner": {
            border: "0",
        },
        ...highContrastOutline,
        "a&:not($button__disabled)": {
            ...highContrastLinkOutline,
            "&:not($button__disabled):hover": {
                ...highContrastLinkBorder,
                "& $button_beforeContent, & $button_afterContent": {
                    ...highContrastLinkForeground,
                },
            },
            "&$button__disabled": {
                ...highContrastDisabledBorder,
                "&:hover": {
                    [highContrastSelector]: {
                        "box-shadow": "none !important",
                    },
                },
            },
        },
    },
    button__primary: {
        color: accentForegroundCut,
        fill: accentForegroundCut,
        background: accentFillRest,
        "&:hover:enabled, a&:not($button__disabled):hover": {
            background: accentFillHover,
            ...highContrastSelectedOutline,
        },
        "&:active:enabled, a&:not($button__disabled):active": {
            background: accentFillActive,
        },
        ...applyFocusVisible<DesignSystem>({
            "border-color": neutralFocus,
            "box-shadow": format(
                "0 0 0 {0} inset {1}",
                toPx(focusOutlineWidth),
                neutralFocusInnerAccent(accentFillRest)
            ),
            ...highContrastDoubleFocus,
        }),
        "& $button_beforeContent, & $button_afterContent": {
            fill: accentForegroundCut,
        },
        ...highContrastAccent,
        "a&:not($button__disabled)": {
            "& $button_beforeContent, & $button_afterContent": {
                ...highContrastLinkForeground,
            },
        },
    },
    button__outline: {
        background: "transparent",
        border: format(
            "{0} solid {1}",
            toPx<DesignSystem>(outlineWidth),
            neutralOutlineRest
        ),
        padding: format("0 {0}", horizontalSpacing(outlineWidth)),
        "&:hover:enabled, a&:not($button__disabled):hover": {
            background: "transparent",
            border: format(
                "{0} solid {1}",
                toPx<DesignSystem>(outlineWidth),
                neutralOutlineHover
            ),
            ...highContrastSelected,
        },
        "&:active:enabled, a&:not($button__disabled):active": {
            background: "transparent",
            border: format(
                "{0} solid {1}",
                toPx<DesignSystem>(outlineWidth),
                neutralOutlineActive
            ),
        },
        ...applyFocusVisible<DesignSystem>({
            ...highContrastOutlineFocus,
            "box-shadow": format(
                "0 0 0 {0} {1} inset",
                toPx<DesignSystem>(subtract(focusOutlineWidth, outlineWidth)),
                neutralFocus
            ),
            "border-color": neutralFocus,
        }),
        ...highContrastOutline,
    },
    button__lightweight: {
        ...applyTransparentBackplateStyles,
        "a&:not($button__disabled)": {
            "&:not($button__disabled):hover": {
                [highContrastSelector]: {
                    "box-shadow": "none !important",
                    color: highContrastLinkValue,
                    fill: highContrastLinkValue,
                },
                "& $button_contentRegion::before": {
                    [highContrastSelector]: {
                        background: highContrastLinkValue,
                    },
                },
            },
            "&$button__disabled": {
                ...highContrastDisabledBorder,
            },
            "& $button_contentRegion::before": {
                [highContrastSelector]: {
                    background: "transparent",
                },
            },
        },
    },
    button__justified: {
        ...applyTransparentBackplateStyles,
        "min-width": "74px",
        "padding-left": "0",
        "padding-right": "0",
        "border-width": "0",
        "justify-content": "flex-start",
        "a&:not($button__disabled)": {
            "&:not($button__disabled):hover": {
                [highContrastSelector]: {
                    "box-shadow": "none !important",
                    color: highContrastLinkValue,
                    fill: highContrastLinkValue,
                },
                "& $button_contentRegion::before": {
                    [highContrastSelector]: {
                        background: highContrastLinkValue,
                    },
                },
            },
            "&$button__disabled": {
                ...highContrastDisabledBorder,
            },
        },
    },
    button__stealth: {
        background: neutralFillStealthRest,
        "&:hover:enabled, a&:not($button__disabled):hover": {
            "background-color": neutralFillStealthHover,
            ...highContrastSelected,
        },
        "&:active:enabled, a&:not($button__disabled):active": {
            "background-color": neutralFillStealthActive,
        },
        ...applyFocusVisible<DesignSystem>({
            ...highContrastOutlineFocus,
            "border-color": neutralFocus,
        }),
        ...highContrastStealth,
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
        ...highContrastDisabledBorder,
        "& $button_beforeContent, & $button_afterContent": {
            ...highContrastDisabledForeground,
        },
    },
    button_beforeContent: {
        width: glyphSize,
        height: glyphSize,
        "margin-right": directionSwitch(horizontalSpacing(), ""),
        "margin-left": directionSwitch("", horizontalSpacing()),
    },
    button_afterContent: {
        width: glyphSize,
        height: glyphSize,
        "margin-right": directionSwitch("", horizontalSpacing()),
        "margin-left": directionSwitch(horizontalSpacing(), ""),
    },
};

export default styles;
