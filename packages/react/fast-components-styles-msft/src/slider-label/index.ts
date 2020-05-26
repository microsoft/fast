import { SliderLabelClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";
import { ComponentStyles } from "@microsoft/fast-jss-manager";
import { divide, multiply, toPx } from "@microsoft/fast-jss-utilities";
import { DesignSystem, DesignSystemResolver } from "../design-system";
import { neutralForegroundRest, neutralOutlineRest } from "../utilities/color";
import { applyCursorDefault } from "../utilities/cursor";
import { heightNumber } from "../utilities/density";
import { designUnit } from "../utilities/design-system";
import { applyScaledTypeRamp } from "../utilities/typography";
import {
    highContrastBackground,
    highContrastOptOutProperty,
    highContrastSelector,
    highContrastTextForeground,
} from "../utilities/high-contrast";

const minMaxLabelMargin: DesignSystemResolver<string> = toPx(
    multiply(divide(heightNumber(), 4), -1)
);

const styles: ComponentStyles<SliderLabelClassNameContract, DesignSystem> = {
    sliderLabel: {
        display: "grid",
        ...applyCursorDefault(),
        [highContrastSelector]: {
            ...highContrastOptOutProperty,
        },
    },

    sliderLabel_positioningRegion: {
        display: "grid",
    },

    sliderLabel_label: {
        ...applyScaledTypeRamp("t9"),
        "white-space": "nowrap",
        color: neutralForegroundRest,
        ...highContrastTextForeground,
    },

    sliderLabel_tickMark: {
        background: neutralOutlineRest,
        ...highContrastBackground,
    },

    sliderLabel__positionMin: {},

    sliderLabel__positionMax: {},

    sliderLabel__horizontal: {
        "&$sliderLabel": {
            "align-self": "start",
            "grid-row": "2",
            "margin-top": "-2px",
        },

        "& $sliderLabel_positioningRegion": {
            "grid-template-columns": "0",
            "grid-template-rows": "auto auto",
            width: "0",
            "justify-self": "center",

            "&$sliderLabel__positionMin": {
                "& $sliderLabel_label": {
                    "margin-left": minMaxLabelMargin,
                    "justify-self": "start",
                },
            },

            "&$sliderLabel__positionMax": {
                "& $sliderLabel_label": {
                    "margin-right": minMaxLabelMargin,
                    "justify-self": "end",
                },
            },
        },

        "& $sliderLabel_label": {
            "justify-self": "center",
            "grid-row": "2",
        },

        "& $sliderLabel_tickMark": {
            height: toPx(designUnit),
            width: "2px",
            "justify-self": "center",
        },
    },

    sliderLabel__vertical: {
        "&$sliderLabel": {
            "grid-column": "2",
            "margin-left": "-2px",
        },

        "& $sliderLabel_positioningRegion": {
            "grid-template-columns": "auto auto",
            "grid-template-rows": "0",
            height: "2px",
            "align-self": "center",
        },

        "& $sliderLabel_label": {
            "grid-column": "2",
            "align-self": "center",
            margin: "2px",
        },

        "& $sliderLabel_tickMark": {
            height: "2px",
            width: toPx(designUnit),
            "align-self": "center",
        },
    },

    sliderLabel__rtl: {
        "&$sliderLabel__horizontal": {
            "& $sliderLabel_positioningRegion": {
                "&$sliderLabel__positionMin": {
                    "& $sliderLabel_label": {
                        "margin-right": "0",
                        "margin-left": minMaxLabelMargin,
                        "justify-self": "end",
                    },
                },

                "&$sliderLabel__positionMax": {
                    "& $sliderLabel_label": {
                        "margin-right": "0",
                        "margin-left": minMaxLabelMargin,
                        "justify-self": "start",
                    },
                },
            },
        },
    },
};

export default styles;
