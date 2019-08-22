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
    highContrastBackground,
    highContrastDisabledBorder,
    highContrastDisabledForeground,
    highContrastDoubleFocus,
    highContrastOutlineFocus,
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
        "& $button_contentRegion::before": {
            background: neutralForegroundRest,
            height: toPx<DesignSystem>(focusOutlineWidth),
            ...highContrastBackground,
        },
    }),
    // Underline
    "&:hover $button_contentRegion::before": {
        background: accentForegroundHover,
        ...highContrastBackground,
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
    "&:hover:enabled": {
        color: accentForegroundHover,
        fill: accentForegroundHover,
        ...transparentBackground,
        [highContrastSelector]: {
            background: "ButtonFace !important",
            color: "ButtonText !important",
        },
    },
    "&:active:enabled": {
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
        "&:hover:enabled": {
            background: neutralFillHover,
            [highContrastSelector]: {
                background: "Highlight !important",
                "border-color": "ButtonText !important",
                color: "HighlightText !important",
            },
            "& $button_beforeContent, & $button_afterContent": {
                fill: accentForegroundCut,
                [highContrastSelector]: {
                    fill: "HighlightText",
                },
            },
        },
        "&:active:enabled": {
            background: neutralFillActive,
        },
        ...applyFocusVisible<DesignSystem>({
            ...highContrastOutlineFocus,
            "border-color": neutralFocus,
        }),
        "&:disabled": {
            [highContrastSelector]: {
                background: "ButtonFace",
                "border-color": "GrayText",
                color: "GrayText",
            },
        },
        "&::-moz-focus-inner": {
            border: "0",
        },
        [highContrastSelector]: {
            background: "ButtonFace",
            "border-color": "ButtonText",
            color: "ButtonText",
            fill: "ButtonText",
            "-ms-high-contrast-adjust": "none",
        },
        "a&": {
            "&$button__disabled": {
                "&:hover": {
                    ...highContrastDisabledBorder,
                },
            },
        },
    },
    button__primary: {
        color: accentForegroundCut,
        fill: accentForegroundCut,
        background: accentFillRest,
        "&:hover:enabled": {
            background: accentFillHover,
            [highContrastSelector]: {
                background: "HighlightText !important",
                "border-color": "Highlight !important",
                color: "Highlight !important",
            },
        },
        "&:active:enabled": {
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
        [highContrastSelector]: {
            background: "Highlight !important",
            "border-color": "Highlight !important",
            color: "HighlightText !important",
            "-ms-high-contrast-adjust": "none",
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
        "&:hover:enabled": {
            background: "transparent",
            border: format(
                "{0} solid {1}",
                toPx<DesignSystem>(outlineWidth),
                neutralOutlineHover
            ),
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
            ...highContrastOutlineFocus,
            "box-shadow": format(
                "0 0 0 {0} {1} inset",
                toPx(subtract(focusOutlineWidth, outlineWidth)),
                neutralFocus
            ),
            "border-color": neutralFocus,
        }),
    },
    button__lightweight: {
        ...applyTransparentBackplateStyles,
    },
    button__justified: {
        ...applyTransparentBackplateStyles,
        "min-width": "74px",
        "padding-left": "0",
        "padding-right": "0",
        "border-width": "0",
        "justify-content": "flex-start",
    },
    button__stealth: {
        background: neutralFillStealthRest,
        "&:hover:enabled": {
            "background-color": neutralFillStealthHover,
        },
        "&:active:enabled": {
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
            fill: "ButtonHighlight",
            ...highContrastDisabledForeground,
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
