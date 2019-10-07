import { applyScaledTypeRamp } from "../utilities/typography";
import { DesignSystem, DesignSystemResolver } from "../design-system";
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
import { applyDisabledState } from "../utilities/disabled";
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
import { densityCategorySwitch, heightNumber } from "../utilities/density";
import { designUnit, focusOutlineWidth, outlineWidth } from "../utilities/design-system";
import { applyCursorDisabled, applyCursorPointer } from "../utilities/cursor";
import {
    HighContrastColor,
    highContrastDoubleFocus,
    highContrastOptOutProperty,
    highContrastSelector,
    highContrastTextForeground,
} from "../utilities/high-contrast";
import { importantValue } from "../utilities/important";

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
        [highContrastSelector]: {
            ...highContrastOptOutProperty,
        },
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
                background: HighContrastColor.selectedBackground,
                "border-color": HighContrastColor.selectedText,
                "& + span": {
                    background: HighContrastColor.selectedText,
                },
            },
        },
        "&:hover": {
            background: neutralFillInputHover,
            "border-color": neutralOutlineHover,
            [highContrastSelector]: {
                background: HighContrastColor.selectedText,
                "border-color": HighContrastColor.selectedBackground,
                "& + span": {
                    background: HighContrastColor.selectedBackground,
                },
            },
        },
        ...applyFocusVisible({
            "box-shadow": format<DesignSystem>("0 0 0 1px {0} inset", neutralFocus),
            "border-color": neutralFocus,
            [highContrastSelector]: {
                "box-shadow": format<DesignSystem>(
                    "0 0 0 {0} {1} inset",
                    toPx<DesignSystem>(outlineWidth),
                    () => HighContrastColor.buttonText
                ),
            },
        }),
        [highContrastSelector]: {
            background: HighContrastColor.buttonBackground,
            "border-color": HighContrastColor.buttonText,
            "& + span": {
                background: HighContrastColor.buttonText,
            },
        },
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
                "& $toggle_input, & $toggle_label, & $toggle_statusMessage": {
                    [highContrastSelector]: {
                        background: "none",
                        "border-color": importantValue(HighContrastColor.disabledText),
                        color: importantValue(HighContrastColor.disabledText),
                        "& + span": {
                            background: importantValue(HighContrastColor.disabledText),
                        },
                    },
                }
            },
            "&:hover": {
                [highContrastSelector]: {
                    background: HighContrastColor.selectedText,
                    "border-color": HighContrastColor.selectedBackground,
                    "& + span": {
                        background: HighContrastColor.selectedBackground,
                    },
                }
            },
            "&:active": {
                [highContrastSelector]: {
                    background: importantValue(HighContrastColor.selectedBackground),
                    "border-color": importantValue(HighContrastColor.selectedBackground),
                    "& + span": {
                        background: importantValue(HighContrastColor.selectedText),
                    },
                },
            },
            [highContrastSelector]: {
                background: HighContrastColor.selectedBackground,
                "border-color": HighContrastColor.selectedBackground,
                "& + span": {
                    background: HighContrastColor.selectedText,
                },
            },
        },
        "& $toggle_stateIndicator": {
            left: directionSwitch(toPx(indicatorCheckedOffset), "unset"),
            right: directionSwitch("unset", toPx(indicatorCheckedOffset)),
            background: accentForegroundCut,
        },
    },
    toggle__disabled: {
        ...applyDisabledState(),
        "& $toggle_input, & $toggle_label, & $toggle_statusMessage": {
            ...applyCursorDisabled(),
            background: neutralFillSelected,
            "border-color": neutralFillSelected,
            [highContrastSelector]: {
                background: "none",
                "border-color": importantValue(HighContrastColor.disabledText),
                color: importantValue(HighContrastColor.disabledText),
                "& + span": {
                    background: importantValue(HighContrastColor.disabledText),
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
        ...highContrastTextForeground
    },
};

export default styles;
