import designSystemDefaults, {
    DesignSystem,
    withDesignSystemDefaults,
} from "../design-system";
import { ComponentStyles, ComponentStyleSheet } from "@microsoft/fast-jss-manager";
import { ProgressClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";
import { accentFillRest, neutralFillRest } from "../utilities/color";
import { multiply, toPx } from "@microsoft/fast-jss-utilities";
import { designUnit } from "../utilities/design-system";
import { glyphSize, height, heightNumber } from "../utilities/density";
import { highContrastBackground, highContrastSelector } from "../utilities/high-contrast";

const styles: ComponentStyles<ProgressClassNameContract, DesignSystem> = {
    progress: {
        display: "flex",
        width: "100%",
        "align-items": "center",
        height: toPx<DesignSystem>(designUnit),
        "text-align": "left",
    },
    progress__circular: {
        height: "unset",
        "& $progress_valueIndicator, & $progress_indicator": {
            fill: "none",
            "stroke-width": "2px",
            "stroke-linecap": "round",
            "transform-origin": "50% 50%",
            transform: "rotate(-90deg)",
            transition: "all 0.2s ease-in-out",
        },
        "& $progress_valueIndicator": {
            stroke: accentFillRest,
            [highContrastSelector]: {
                stroke: "ButtonText",
            },
        },
        "& $progress_valueIndicator__indeterminate": {
            animation: "spin-infinite 2s linear infinite",
        },
        "& $progress_indicator": {
            stroke: neutralFillRest,
            [highContrastSelector]: {
                stroke: "ButtonFace",
            },
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
        background: accentFillRest,
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
            background: "ButtonFace",
            border: "1px solid ButtonText",
        },
    },
    progress_indicator__determinate: {
        height: toPx<DesignSystem>(designUnit),
        "border-radius": "2px",
        [highContrastSelector]: {
            background: "ButtonFace",
            border: "1px solid ButtonText",
        },
    },
    progress_dot: {
        position: "absolute",
        opacity: "0",
        height: "100%",
        "background-color": accentFillRest,
        "border-radius": "100px",
        "animation-timing-function": "cubic-bezier(0.4, 0.0, 0.6, 1.0)",
        [highContrastSelector]: {
            background: "ButtonText",
            opacity: "1 !important",
        },
    },
    progress_dot__1: {
        width: "40%",
        transform: "translateX(-100%)",
        animation: "indeterminate-1 2s infinite",
    },
    progress_dot__2: {
        width: "60%",
        transform: "translateX(-150%)",
        animation: "indeterminate-2 2s infinite",
    },
    "@keyframes spin-infinite": {
        "0%": {
            "stroke-dasharray": "0.01px 43.97px",
            transform: "rotate(0deg)",
        },
        "50%": {
            "stroke-dasharray": "21.99px 21.99px",
            transform: "rotate(450deg)",
        },
        "100%": {
            "stroke-dasharray": ".01px 43.97px",
            transform: "rotate(1080deg)",
        },
    },
    "@keyframes indeterminate-1": {
        "0%": {
            opacity: "1",
            transform: "translateX(-100%)",
        },
        "70%": {
            opacity: "1",
            transform: "translateX(300%)",
        },
        "70.01%": {
            opacity: "0",
        },
        "100%": {
            opacity: "0",
            transform: "translateX(300%)",
        },
    },
    "@keyframes indeterminate-2": {
        "0%": {
            opacity: "0",
            transform: "translateX(-150%)",
        },
        "29.99%": {
            opacity: "0",
        },
        "30%": {
            opacity: "1",
            transform: "translateX(-150%)",
        },
        "100%": {
            transform: "translateX(166.66%)",
            opacity: "1",
        },
    },
};

export default styles;
