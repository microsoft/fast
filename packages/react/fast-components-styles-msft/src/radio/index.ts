import { ComponentStyles } from "@microsoft/fast-jss-manager";
import { RadioClassNameContract } from "@microsoft/fast-components-class-name-contracts-base";
import {
    add,
    applyFocusVisible,
    directionSwitch,
    divide,
    format,
    important,
    toPx,
} from "@microsoft/fast-jss-utilities";
import { DesignSystem, DesignSystemResolver } from "../design-system";
import {
    neutralFillInputActive,
    neutralFillInputHover,
    neutralFillInputRest,
    neutralForegroundRest,
    neutralOutlineContrastActive,
    neutralOutlineContrastHover,
    neutralOutlineContrastRest,
} from "../utilities/color";
import {
    densityCategorySwitch,
    heightNumber,
    horizontalSpacing,
} from "../utilities/density";
import { applyDisabledState } from "../utilities/disabled";
import { applyScaledTypeRamp } from "../utilities/typography";
import { backgroundColor, designUnit, outlineWidth } from "../utilities/design-system";
import { applyCursorDisabled, applyCursorPointer } from "../utilities/cursor";
import {
    HighContrastColor,
    highContrastDoubleOuterFocus,
    highContrastHighlightBackground,
    highContrastOptOutProperty,
    highContrastSelectedBackground,
    highContrastSelector,
} from "../utilities/high-contrast";
import { doubleOuterFocus } from "../patterns/input-field";

const inputSize: DesignSystemResolver<string> = toPx(
    add(divide(heightNumber(), 2), designUnit)
);

const indicatorMargin: DesignSystemResolver<string> = toPx(
    add(designUnit, densityCategorySwitch(0, 1, 2))
);

const styles: ComponentStyles<RadioClassNameContract, DesignSystem> = {
    radio: {
        position: "relative",
        display: "inline-flex",
        "flex-direction": "row",
        "align-items": "center",
        transition: "all 0.2s ease-in-out",
    },
    radio_input: {
        position: "absolute",
        width: inputSize,
        height: inputSize,
        appearance: "none",
        "-webkit-appearance": "none",
        "-moz-appearance": "none",
        "border-radius": "50%",
        margin: "0",
        "z-index": "1",
        background: neutralFillInputRest,
        transition: "all 0.2s ease-in-out",
        border: format(
            "{0} solid {1}",
            toPx<DesignSystem>(outlineWidth),
            neutralOutlineContrastRest
        ),
        "&:enabled": {
            ...applyCursorPointer(),
        },
        "&:hover:enabled": {
            background: neutralFillInputHover,
            "border-color": neutralOutlineContrastHover,
            [highContrastSelector]: {
                background: "transparent",
                border: format(
                    "{0} solid {1}",
                    toPx<DesignSystem>(outlineWidth),
                    () => HighContrastColor.selectedBackground
                ),
            },
        },
        "&:active:enabled": {
            background: neutralFillInputActive,
            "border-color": neutralOutlineContrastActive,
        },
        ...applyFocusVisible({
            ...doubleOuterFocus,
            ...highContrastDoubleOuterFocus,
        }),
        [highContrastSelector]: {
            ...highContrastOptOutProperty,
            background: "transparent",
            border: format(
                "{0} solid {1}",
                toPx<DesignSystem>(outlineWidth),
                () => HighContrastColor.buttonText
            ),
        },
    },
    radio_stateIndicator: {
        position: "relative",
        "border-radius": "50%",
        display: "inline-block",
        width: inputSize,
        height: inputSize,
        "flex-shrink": "0",
        "&::before": {
            "pointer-events": "none",
            position: "absolute",
            "z-index": "1",
            content: '""',
            "border-radius": "50%",
            top: indicatorMargin,
            left: indicatorMargin,
            bottom: indicatorMargin,
            right: indicatorMargin,
            background: "transparent",
        },
        [highContrastSelector]: {
            ...highContrastOptOutProperty,
        },
    },
    radio_label: {
        ...applyCursorPointer(),
        color: neutralForegroundRest,
        ...applyScaledTypeRamp("t7"),
        "margin-left": directionSwitch(horizontalSpacing(2), ""),
        "margin-right": directionSwitch("", horizontalSpacing(2)),
    },
    radio__checked: {
        "& $radio_stateIndicator": {
            "&::before": {
                background: backgroundColor,
                [highContrastSelector]: {
                    background: HighContrastColor.selectedBackground,
                },
            },
        },
        "&:hover $radio_stateIndicator::before": {
            ...highContrastSelectedBackground,
        },
        "& $radio_input": {
            "background-color": neutralOutlineContrastRest,
            ...highContrastSelectedBackground,
            "&:hover:enabled": {
                "background-color": neutralOutlineContrastHover,
                ...highContrastHighlightBackground,
            },
            "&:active:enabled": {
                "background-color": neutralOutlineContrastActive,
            },
        },
    },
    radio__disabled: {
        ...applyDisabledState(),
        "& $radio_input, & $radio_label": {
            ...applyCursorDisabled(),
            [highContrastSelector]: {
                ...highContrastOptOutProperty,
                background: important(HighContrastColor.buttonBackground),
                color: important(HighContrastColor.disabledText),
                fill: important(HighContrastColor.disabledText),
                "border-color": important(HighContrastColor.disabledText),
            },
        },
    },
};

export default styles;
