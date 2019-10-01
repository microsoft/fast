import {
    accentFillRest,
    accentForegroundCut,
    neutralFillInputActive,
    neutralFillInputHover,
    neutralFillInputRest,
    neutralFillSelected,
    neutralFocus,
    neutralFocusInnerAccent,
    neutralForegroundRest,
    neutralOutlineActive,
    neutralOutlineHover,
    neutralOutlineRest,
} from "../utilities/color";
import { applyDisabledState } from "../utilities/disabled";
import { ComponentStyles } from "@microsoft/fast-jss-manager";
import {
    add,
    applyFocusVisible,
    directionSwitch,
    divide,
    format,
    multiply,
    subtract,
    toPx,
} from "@microsoft/fast-jss-utilities";
import { ToggleClassNameContract } from "@microsoft/fast-components-class-name-contracts-base";
import { DesignSystem, DesignSystemResolver } from "../design-system";
import { applyScaledTypeRamp } from "../utilities/typography";
import { densityCategorySwitch, heightNumber } from "../utilities/density";
import { designUnit, focusOutlineWidth, outlineWidth } from "../utilities/design-system";
import { applyCursorDisabled, applyCursorPointer } from "../utilities/cursor";
import {
    highContrastBackground,
    highContrastBorderColor,
    highContrastDoubleFocus,
    highContrastHighlightBackground,
    highContrastSelectedBackground,
    highContrastSelector,
} from "../utilities/high-contrast";

const height: DesignSystemResolver<number> = add(divide(heightNumber(), 2), designUnit);
const width: DesignSystemResolver<number> = multiply(height, 2);

const indicatorMargin: DesignSystemResolver<number> = add(
    designUnit,
    densityCategorySwitch(0, 1, 2)
);
const indicatorSize: DesignSystemResolver<number> = subtract(
    height,
    multiply(indicatorMargin, 2)
);
const indicatorCheckedOffset: DesignSystemResolver<number> = subtract(
    width,
    indicatorMargin,
    indicatorSize
);

const styles: ComponentStyles<ToggleClassNameContract, DesignSystem> = {
    toggle: {
        display: "inline-block",
        color: neutralForegroundRest,
        transition: "all 0.2s ease-in-out",
    },
    toggle_label: {
        ...applyCursorPointer(),
        ...applyScaledTypeRamp("t7"),
        display: "block",
        "padding-bottom": "7px",
        clear: "both",
    },
    toggle_toggleButton: {
        ...applyCursorPointer(),
        position: "relative",
        "margin-top": "0",
        float: directionSwitch("left", "right"),
    },
    toggle_stateIndicator: {
        position: "absolute",
        "pointer-events": "none",
        top: toPx(indicatorMargin),
        left: directionSwitch(toPx(indicatorMargin), "unset"),
        right: directionSwitch("unset", toPx(indicatorMargin)),
        transition: "all .1s ease",
        "border-radius": toPx(indicatorSize),
        width: toPx(indicatorSize),
        height: toPx(indicatorSize),
        background: neutralForegroundRest,
        ...highContrastBackground,
    },
    toggle_input: {
        ...applyCursorPointer(),
        position: "relative",
        margin: "0",
        width: toPx(width),
        height: toPx(height),
        background: neutralFillInputRest,
        border: format(
            "{0} solid {1}",
            toPx<DesignSystem>(outlineWidth),
            neutralOutlineRest
        ),
        "border-radius": toPx(height),
        appearance: "none",
        "-webkit-appearance": "none",
        "-moz-appearance": "none",
        outline: "none",
        "&:active": {
            background: neutralFillInputActive,
            "border-color": neutralOutlineActive,
            [highContrastSelector]: {
                background: "Highlight",
                "& + span": {
                    background: "HighlightText",
                },
            },
        },
        "&:hover": {
            background: neutralFillInputHover,
            "border-color": neutralOutlineHover,
            [highContrastSelector]: {
                "border-color": "Highlight",
                "& + span": {
                    background: "Highlight",
                },
            },
        },
        ...applyFocusVisible({
            "box-shadow": format<DesignSystem>("0 0 0 1px {0} inset", neutralFocus),
            "border-color": neutralFocus,
            [highContrastSelector]: {
                "box-shadow": format<DesignSystem>(
                    "0 0 0 {0} ButtonText inset",
                    toPx<DesignSystem>(outlineWidth)
                ),
            },
        }),
        ...highContrastBorderColor,
    },
    toggle__checked: {
        "& $toggle_input": {
            background: accentFillRest,
            "border-color": accentFillRest,
            ...applyFocusVisible({
                "box-shadow": format<DesignSystem>(
                    "0 0 0 {0} {1} inset, 0 0 0 {2} {3} inset",
                    toPx(subtract(focusOutlineWidth, outlineWidth)),
                    neutralFocus,
                    toPx(add(focusOutlineWidth, outlineWidth)),
                    neutralFocusInnerAccent(accentFillRest)
                ),
                "border-color": neutralFocus,
                ...highContrastDoubleFocus,
            }),
            "&:disabled": {
                [highContrastSelector]: {
                    background: "GrayText !important",
                    "border-color": "GrayText !important",
                    "& + span": {
                        background: "Background !important",
                    },
                },
            },
            [highContrastSelector]: {
                background: "Highlight",
                "border-color": "Highlight",
                "&:hover": {
                    background: "HighlightText",
                    "border-color": "Highlight",
                },
                "&:active": {
                    [highContrastSelector]: {
                        background: "Highlight",
                        "& + span": {
                            background: "HighlightText",
                        },
                    },
                },
            },
        },
        "& $toggle_stateIndicator": {
            left: directionSwitch(toPx(indicatorCheckedOffset), "unset"),
            right: directionSwitch("unset", toPx(indicatorCheckedOffset)),
            background: accentForegroundCut,
            ...highContrastSelectedBackground,
            "&:hover": {
                ...highContrastHighlightBackground,
            },
        },
    },
    toggle__disabled: {
        ...applyDisabledState(),
        "& $toggle_input, & $toggle_label, & $toggle_statusMessage": {
            ...applyCursorDisabled(),
            background: neutralFillSelected,
            "border-color": neutralFillSelected,
            [highContrastSelector]: {
                background: "Background !important",
                "border-color": "GrayText !important",
                "& + span": {
                    background: "GrayText !important",
                },
            },
        },
    },
    toggle_statusMessage: {
        ...applyScaledTypeRamp("t7"),
        "line-height": toPx(height),
        float: directionSwitch("left", "right"),
        "padding-left": directionSwitch("5px", ""),
        "padding-right": directionSwitch("", "5px"),
        "user-select": "none",
        "margin-top": "0",
        "padding-bottom": "0",
    },
};

export default styles;
