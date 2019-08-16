import { applyDisabledState } from "../utilities/disabled";
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
import { applyScaledTypeRamp } from "../utilities/typography";
import { densityCategorySwitch, heightNumber } from "../utilities/density";
import { designUnit, focusOutlineWidth, outlineWidth } from "../utilities/design-system";
import { applyCursorDisabled, applyCursorPointer } from "../utilities/cursor";
import {
    applyHighContrastDoubleFocus,
    applyHighContrastForeground,
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
const indicatorCheckedLeft: DesignSystemResolver<number> = subtract(
    width,
    indicatorMargin,
    indicatorSize
);

const styles: ComponentStyles<ToggleClassNameContract, DesignSystem> = {
    toggle: {
        display: "inline-block",
        color: neutralForegroundRest,
        transition: "all 0.2s ease-in-out",
        ...applyHighContrastForeground,
    },
    toggle_label: {
        ...applyCursorPointer(),
        ...applyScaledTypeRamp("t7"),
        display: "block",
        paddingBottom: "7px",
        clear: "both",
    },
    toggle_toggleButton: {
        ...applyCursorPointer(),
        position: "relative",
        marginTop: "0",
        float: directionSwitch("left", "right"),
    },
    toggle_stateIndicator: {
        position: "absolute",
        pointerEvents: "none",
        top: toPx(indicatorMargin),
        left: toPx(indicatorMargin),
        transition: "all .1s ease",
        borderRadius: toPx(indicatorSize),
        width: toPx(indicatorSize),
        height: toPx(indicatorSize),
        background: neutralForegroundRest,
        [highContrastSelector]: {
            background: "ButtonText",
        },
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
        borderRadius: toPx(height),
        appearance: "none",
        outline: "none",
        "&:active": {
            background: neutralFillInputActive,
            borderColor: neutralOutlineActive,
            [highContrastSelector]: {
                background: "Highlight",
                "& + span": {
                    background: "HighlightText",
                },
            },
        },
        "&:hover": {
            background: neutralFillInputHover,
            borderColor: neutralOutlineHover,
            [highContrastSelector]: {
                borderColor: "Highlight",
                "& + span": {
                    background: "Highlight",
                },
            },
        },
        ...applyFocusVisible({
            boxShadow: format<DesignSystem>("0 0 0 1px {0} inset", neutralFocus),
            borderColor: neutralFocus,
            [highContrastSelector]: {
                boxShadow: format<DesignSystem>("0 0 0 2px ButtonText"),
            },
        }),
        [highContrastSelector]: {
            borderColor: "ButtonText",
        },
    },
    toggle__checked: {
        "& $toggle_input": {
            background: accentFillRest,
            borderColor: accentFillRest,
            ...applyFocusVisible({
                boxShadow: format<DesignSystem>(
                    "0 0 0 {0} {1} inset, 0 0 0 {2} {3} inset",
                    toPx(subtract(focusOutlineWidth, outlineWidth)),
                    neutralFocus,
                    toPx(add(focusOutlineWidth, outlineWidth)),
                    neutralFocusInnerAccent(accentFillRest)
                ),
                borderColor: neutralFocus,
                ...applyHighContrastDoubleFocus,
            }),
            "&:disabled": {
                [highContrastSelector]: {
                    background: "GrayText",
                    borderColor: "GrayText",
                    "& + span": {
                        background: "Background",
                    },
                },
                "&:hover": {
                    [highContrastSelector]: {
                        background: "GrayText",
                        borderColor: "GrayText",
                        "& + span": {
                            background: "Background",
                        },
                    },
                },
            },
            [highContrastSelector]: {
                background: "Highlight",
                borderColor: "Highlight",
                "&:active": {
                    [highContrastSelector]: {
                        background: "Highlight",
                        "& + span": {
                            background: "HighlightText",
                        },
                    },
                },
                "&:hover": {
                    [highContrastSelector]: {
                        background: "HighlightText",
                        borderColor: "Highlight",
                    },
                },
            },
        },
        "& $toggle_stateIndicator": {
            left: toPx(indicatorCheckedLeft),
            background: accentForegroundCut,
            [highContrastSelector]: {
                background: "HighlightText",
                "&:hover": {
                    [highContrastSelector]: {
                        background: "Highlight",
                    },
                },
            },
        },
    },
    toggle__disabled: {
        ...applyDisabledState(),
        "& $toggle_input": {
            background: neutralFillSelected,
            borderColor: neutralFillSelected,
            [highContrastSelector]: {
                background: "Background",
                borderColor: "GrayText",
                "&:active": {
                    [highContrastSelector]: {
                        background: "Background",
                        "& + span": {
                            background: "GrayText",
                        },
                    },
                },
                "&:hover": {
                    [highContrastSelector]: {
                        background: "Background",
                        borderColor: "GrayText",
                        "& + span": {
                            background: "GrayText",
                        },
                    },
                },
            },
        },
        "& $toggle_stateIndicator": {
            background: neutralForegroundRest,
            [highContrastSelector]: {
                background: "GrayText",
            },
        },
        "& $toggle_input, & $toggle_label, & $toggle_statusMessage": {
            ...applyCursorDisabled(),
            [highContrastSelector]: {
                color: "GrayText",
            },
        },
        [highContrastSelector]: {
            opacity: "1",
        },
    },
    toggle_statusMessage: {
        ...applyScaledTypeRamp("t7"),
        lineHeight: toPx(height),
        float: directionSwitch("left", "right"),
        paddingLeft: directionSwitch("5px", ""),
        paddingRight: directionSwitch("", "5px"),
        userSelect: "none",
        marginTop: "0",
        paddingBottom: "0",
    },
};

export default styles;
