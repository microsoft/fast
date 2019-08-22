import { TextFieldClassNameContract } from "@microsoft/fast-components-class-name-contracts-base";
import { TextActionClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";
import { ComponentStyles, CSSRules } from "@microsoft/fast-jss-manager";
import { directionSwitch, format, subtract, toPx } from "@microsoft/fast-jss-utilities";
import { DesignSystem } from "../design-system";
import { applyCornerRadius } from "../utilities/border";
import {
    neutralFillActive,
    neutralFillHover,
    neutralFillInputActive,
    neutralFillInputHover,
    neutralFillInputRest,
    neutralFillRest,
    neutralFocus,
    neutralForegroundRest,
    neutralOutlineActive,
    neutralOutlineHover,
    neutralOutlineRest,
} from "../utilities/color";
import { glyphSize, height, horizontalSpacing } from "../utilities/density";
import { focusOutlineWidth, outlineWidth } from "../utilities/design-system";
import { applyDisabledState } from "../utilities/disabled";
import {
    highContrastDisabledBorder,
    highContrastDisabledForeground,
    highContrastForeground,
    highContrastSelector,
} from "../utilities/high-contrast";

// Since MSFT text field is already styled, we need to override in this way to alter text field classes
export const textFieldOverrides: ComponentStyles<
    Partial<TextFieldClassNameContract>,
    DesignSystem
> = {
    textField: {
        height: "calc(100% - 4px)",
        margin: "2px 1px",
        border: "none",
        flex: "1 0 0",
        background: "transparent",
        "min-width": "inherit",
        "&:hover, &:hover:enabled, &:disabled, &:active, &:active:enabled, &:focus, &:focus:enabled": {
            background: "none",
            border: "none",
            "box-shadow": "none",
            [highContrastSelector]: {
                background: "none",
                border: "none",
                "box-shadow": "none",
            },
        },
    },
};

const glyphStyles: CSSRules<{}> = {
    width: glyphSize,
    height: glyphSize,
    margin: "auto",
    fill: neutralForegroundRest,
    ...highContrastForeground,
};

const styles: ComponentStyles<TextActionClassNameContract, DesignSystem> = {
    textAction: {
        "box-sizing": "border-box",
        position: "relative",
        height: height(),
        margin: "0",
        "min-width": "92px",
        border: format(
            "{0} solid {1}",
            toPx<DesignSystem>(outlineWidth),
            neutralOutlineRest
        ),
        background: neutralFillInputRest,
        ...applyCornerRadius(),
        display: "flex",
        "flex-direction": "row",
        transition: "all 0.2s ease-in-out",
        "&:hover": {
            background: neutralFillInputHover,
            "border-color": neutralOutlineHover,
        },
        "&:active": {
            background: neutralFillInputActive,
            "border-color": neutralOutlineActive,
        },
    },
    textAction__filled: {
        background: neutralFillRest,
        border: format("{0} solid transparent", toPx<DesignSystem>(outlineWidth)),
        "&:hover": {
            background: neutralFillHover,
            "border-color": "transparent",
        },
        "&:active": {
            background: neutralFillActive,
            "border-color": "transparent",
        },
    },
    textAction__outline: {},
    textAction__focus: {
        "&, &:hover": {
            "box-shadow": format(
                "0 0 0 {0} {1} inset",
                toPx<DesignSystem>(subtract(focusOutlineWidth, outlineWidth)),
                neutralFocus
            ),
            border: format(
                "{0} solid {1}",
                toPx<DesignSystem>(outlineWidth),
                neutralFocus
            ),
        },
        [highContrastSelector]: {
            "&, &:hover": {
                "box-shadow": format(
                    "0 0 0 {0} ButtonText inset",
                    toPx<DesignSystem>(subtract(focusOutlineWidth, outlineWidth))
                ),
                border: format("{0} solid ButtonText", toPx<DesignSystem>(outlineWidth)),
            },
        },
    },
    textAction__disabled: {
        ...applyDisabledState(),
        ...highContrastDisabledBorder,
        "&:hover": {
            background: neutralFillInputRest,
            "border-color": neutralOutlineRest,
        },
        "&:active": {
            background: neutralFillInputRest,
            "border-color": neutralOutlineRest,
        },
        "& $textAction_beforeGlyph, & $textAction_afterGlyph": {
            ...highContrastDisabledForeground,
        },
    },
    textAction_button: {
        "border-color": "transparent",
        color: neutralForegroundRest,
        fill: neutralForegroundRest,
        height: format("calc({0} - 6px)", height()),
        "min-width": "fit-content",
        margin: "2px",
        padding: `0 5px`,
        left: directionSwitch("0", ""),
        right: directionSwitch("", "0"),
        top: "0",
        transition: "color .1s, background-color .1s, border-color 0.2s ease-in-out",
        flex: "0 0 auto",
        cursor: "pointer",
        [highContrastSelector]: {
            background: "ButtonFace",
            fill: "ButtonText",
        },
        "&:hover": {
            [highContrastSelector]: {
                background: "Highlight",
                fill: "HighlightText",
            },
        },
        "&:disabled": {},
    },
    textAction_beforeGlyph: {
        ...glyphStyles,
        "margin-left": directionSwitch(horizontalSpacing(1), ""),
        "margin-right": directionSwitch("", horizontalSpacing(1)),
    },
    textAction_afterGlyph: {
        ...glyphStyles,
        "margin-left": directionSwitch("", horizontalSpacing(1)),
        "margin-right": directionSwitch(horizontalSpacing(1), ""),
    },
};

export default styles;
