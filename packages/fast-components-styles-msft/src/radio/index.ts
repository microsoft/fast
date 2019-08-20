import { DesignSystem, DesignSystemResolver } from "../design-system";
import { ComponentStyles } from "@microsoft/fast-jss-manager";
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
import {
    densityCategorySwitch,
    heightNumber,
    horizontalSpacing,
} from "../utilities/density";
import { applyDisabledState } from "../utilities/disabled";
import { applyScaledTypeRamp } from "../utilities/typography";
import { designUnit, outlineWidth } from "../utilities/design-system";
import { applyCursorDisabled, applyCursorPointer } from "../utilities/cursor";
import {
    highContrastDisabledBorder,
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
        flexDirection: "row",
        alignItems: "center",
        transition: "all 0.2s ease-in-out",
    },
    radio_input: {
        position: "absolute",
        width: inputSize,
        height: inputSize,
        appearance: "none",
        borderRadius: "50%",
        margin: "0",
        zIndex: "1",
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
            borderColor: neutralOutlineHover,
        },
        "&:active": {
            background: neutralFillInputActive,
            borderColor: neutralOutlineActive,
        },
        ...applyFocusVisible({
            boxShadow: format<DesignSystem>("0 0 0 1px {0} inset", neutralFocus),
            borderColor: neutralFocus,
            [highContrastSelector]: {
                boxShadow: "0 0 0 1px ButtonText inset",
            },
        }),
        [highContrastSelector]: {
            border: format("{0} solid ButtonText", toPx<DesignSystem>(outlineWidth)),
        },
    },
    radio_stateIndicator: {
        position: "relative",
        borderRadius: "50%",
        display: "inline-block",
        width: inputSize,
        height: inputSize,
        flexShrink: "0",
        "&::before": {
            pointerEvents: "none",
            position: "absolute",
            zIndex: "1",
            content: '""',
            borderRadius: "50%",
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
        marginLeft: directionSwitch(horizontalSpacing(2), ""),
        marginRight: directionSwitch("", horizontalSpacing(2)),
        [highContrastSelector]: {
            color: "ButtonText",
        },
    },
    radio__checked: {
        "& $radio_stateIndicator": {
            "&::before": {
                background: neutralForegroundRest,
                [highContrastSelector]: {
                    background: "Highlight",
                },
            },
        },
        "&:hover $radio_stateIndicator::before": {
            [highContrastSelector]: {
                background: "HighlightText",
            },
        },
        "& $radio_input": {
            [highContrastSelector]: {
                background: "HighlightText",
            },
            "&:hover": {
                [highContrastSelector]: {
                    background: "Highlight",
                },
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
