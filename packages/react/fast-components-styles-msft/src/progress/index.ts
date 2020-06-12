import { ComponentStyles } from "@microsoft/fast-jss-manager";
import { ProgressClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";
import { directionSwitch, format, multiply, toPx } from "@microsoft/fast-jss-utilities";
import {
    accentForegroundRest,
    neutralFillRest,
    neutralForegroundHint,
} from "../utilities/color";
import { DesignSystem } from "../design-system";
import { designUnit, outlineWidth } from "../utilities/design-system";
import { glyphSize, height, heightNumber } from "../utilities/density";
import {
    highContrastBackground,
    HighContrastColor,
    highContrastOptOutProperty,
    highContrastSelector,
} from "../utilities/high-contrast";

const styles: ComponentStyles<ProgressClassNameContract, DesignSystem> = {
    progress: {
        display: "flex",
        width: "100%",
        "align-items": "center",
        height: toPx<DesignSystem>(designUnit),
        "text-align": "left",
        [highContrastSelector]: {
            ...highContrastOptOutProperty,
        },
    },
    progress__circular: {
        height: "unset",
        width: "unset",
        display: "inline-block",
        "& $progress_valueIndicator, & $progress_indicator": {
            fill: "none",
            "stroke-width": "2px",
            "stroke-linecap": "round",
            "transform-origin": "50% 50%",
            transform: "rotate(-90deg)",
            transition: "all 0.2s ease-in-out",
        },
        "& $progress_valueIndicator": {
            stroke: accentForegroundRest,
            transform: directionSwitch("", "scale(1)"),
            [highContrastSelector]: {
                stroke: HighContrastColor.buttonText,
            },
        },
        "& $progress_valueIndicator__indeterminate": {
            animation: "spin-infinite 2s linear infinite",
        },
        "& $progress_indicator": {
            stroke: neutralFillRest,
            [highContrastSelector]: {
                stroke: HighContrastColor.buttonBackground,
            },
        },
    },
    progress__paused: {
        "& $progress_valueIndicator": {
            background: neutralForegroundHint,
            stroke: neutralForegroundHint,
        },
        "& $progress_dot": {
            "background-color": neutralFillRest,
        },
        "& $progress_dot__1": {
            "animation-play-state": "paused",
        },
        "& $progress_dot__2": {
            "animation-play-state": "paused",
        },
        "& $progress_valueIndicator__indeterminate": {
            "animation-play-state": "paused",
            stroke: neutralFillRest,
        },
    },
    progress_circularSVG__control: {
        height: glyphSize,
        width: glyphSize,
    },
    progress_circularSVG__container: {
        height: height(),
        width: height(),
    },
    progress_circularSVG__page: {
        height: toPx(multiply(heightNumber(), 2)),
        width: toPx(multiply(heightNumber(), 2)),
    },
    progress_valueIndicator: {
        background: accentForegroundRest,
        "border-radius": "100px",
        height: "100%",
        transition: "all 0.2s ease-in-out",
        ...highContrastBackground,
    },
    progress_valueIndicator__indeterminate: {},
    progress_indicator: {
        position: "relative",
        display: "flex",
        "align-items": "center",
        width: "100%",
        overflow: "hidden",
        "border-radius": "100px",
        height: toPx<DesignSystem>(designUnit),
        background: neutralFillRest,
        transition: "all 0.2s ease-in-out",
        "-webkit-mask-image": "-webkit-radial-gradient(white, black)",
        "mask-image": "-webkit-radial-gradient(white, black)",
        [highContrastSelector]: {
            background: HighContrastColor.buttonBackground,
            border: format<DesignSystem>(
                "{0} solid {1}",
                toPx(outlineWidth),
                () => HighContrastColor.buttonText
            ),
        },
    },
    progress_indicator__determinate: {
        height: toPx<DesignSystem>(designUnit),
        "border-radius": "2px",
        [highContrastSelector]: {
            background: HighContrastColor.buttonBackground,
            border: format<DesignSystem>(
                "{0} solid {1}",
                toPx(outlineWidth),
                () => HighContrastColor.buttonText
            ),
        },
    },
    progress_dot: {
        position: "absolute",
        opacity: "0",
        height: "100%",
        "background-color": accentForegroundRest,
        "border-radius": "100px",
        "animation-timing-function": "cubic-bezier(0.4, 0.0, 0.6, 1.0)",
        [highContrastSelector]: {
            background: HighContrastColor.buttonText,
            opacity: "1 !important",
        },
    },
    progress_dot__1: {
        width: "40%",
        animation: "indeterminate-1 2s infinite",
    },
    progress_dot__2: {
        width: "60%",
        animation: "indeterminate-2 2s infinite",
    },
    "@keyframes spin-infinite": {
        "0%": {
            "stroke-dasharray": "0.01px 43.97px",
            transform: directionSwitch("rotate(0deg)", "rotate(1080deg)"),
        },
        "50%": {
            "stroke-dasharray": "21.99px 21.99px",
            transform: "rotate(450deg)",
        },
        "100%": {
            "stroke-dasharray": ".01px 43.97px",
            transform: directionSwitch("rotate(1080deg)", "rotate(0deg)"),
        },
    },
    "@keyframes indeterminate-1": {
        "0%": {
            opacity: "1",
            transform: directionSwitch("translateX(-100%)", "translateX(100%)"),
        },
        "70%": {
            opacity: "1",
            transform: directionSwitch("translateX(300%)", "translateX(-300%)"),
        },
        "70.01%": {
            opacity: "0",
        },
        "100%": {
            opacity: "0",
            transform: directionSwitch("translateX(300%)", "translateX(-300%)"),
        },
    },
    "@keyframes indeterminate-2": {
        "0%": {
            opacity: "0",
            transform: directionSwitch("translateX(-150%)", "translateX(150%)"),
        },
        "29.99%": {
            opacity: "0",
        },
        "30%": {
            opacity: "1",
            transform: directionSwitch("translateX(-150%)", "translateX(150%)"),
        },
        "100%": {
            transform: directionSwitch("translateX(166.66%)", "translateX(-166.66%)"),
            opacity: "1",
        },
    },
};

export default styles;
