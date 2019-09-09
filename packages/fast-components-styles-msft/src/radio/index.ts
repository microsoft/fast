import { ComponentStyles } from "@microsoft/fast-jss-manager";
import {
    densityCategorySwitch,
    heightNumber,
    horizontalSpacing,
} from "../utilities/density";
import { RadioClassNameContract } from "@microsoft/fast-components-class-name-contracts-base";
import {
    add,
    applyFocusVisible,
    directionSwitch,
    divide,
    format,
    toPx,
} from "@microsoft/fast-jss-utilities";
import {
    neutralFillInputActive,
    neutralFillInputHover,
    neutralFillInputRest,
    neutralFocus,
    neutralForegroundRest,
    neutralOutlineActive,
    neutralOutlineHover,
    neutralOutlineRest,
} from "../utilities/color";
import { DesignSystem, DesignSystemResolver } from "../design-system";
import { applyDisabledState } from "../utilities/disabled";
import { applyScaledTypeRamp } from "../utilities/typography";
import { designUnit, outlineWidth } from "../utilities/design-system";
import { applyCursorDisabled, applyCursorPointer } from "../utilities/cursor";
import {
    highContrastDisabledBorder,
    highContrastHighlightBackground,
    highContrastSelectedBackground,
    highContrastSelector,
} from "../utilities/high-contrast";

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
            neutralOutlineRest
        ),
        "&:enabled": {
            ...applyCursorPointer(),
        },
        "&:hover:enabled": {
            background: neutralFillInputHover,
            "border-color": neutralOutlineHover,
        },
        "&:active": {
            background: neutralFillInputActive,
            "border-color": neutralOutlineActive,
        },
        ...applyFocusVisible({
            "box-shadow": format<DesignSystem>("0 0 0 1px {0} inset", neutralFocus),
            "border-color": neutralFocus,
            [highContrastSelector]: {
                "box-shadow": "0 0 0 1px ButtonText inset",
            },
        }),
        [highContrastSelector]: {
            border: format("{0} solid ButtonText", toPx<DesignSystem>(outlineWidth)),
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
    },
    radio_label: {
        ...applyCursorPointer(),
        color: neutralForegroundRest,
        ...applyScaledTypeRamp("t7"),
        "margin-left": directionSwitch(horizontalSpacing(2), ""),
        "margin-right": directionSwitch("", horizontalSpacing(2)),
        [highContrastSelector]: {
            color: "ButtonText",
        },
    },
    radio__checked: {
        "& $radio_stateIndicator": {
            "&::before": {
                background: neutralForegroundRest,
                ...highContrastHighlightBackground,
            },
        },
        "&:hover $radio_stateIndicator::before": {
            ...highContrastSelectedBackground,
        },
        "& $radio_input": {
            ...highContrastSelectedBackground,
            "&:hover": {
                ...highContrastHighlightBackground,
            },
        },
    },
    radio__disabled: {
        ...applyDisabledState(),
        "& $radio_input, & $radio_label": {
            ...applyCursorDisabled(),
            ...highContrastDisabledBorder,
        },
    },
};

export default styles;
