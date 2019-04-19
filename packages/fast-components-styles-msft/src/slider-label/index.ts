import { ComponentStyles, ComponentStyleSheet } from "@microsoft/fast-jss-manager";
import { applyFocusVisible, toPx } from "@microsoft/fast-jss-utilities";
import { SliderLabelClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";
import { glyphSize, height, horizontalSpacing } from "../utilities/density";
import { neutralForegroundActive, neutralOutlineRest } from "../utilities/color";
import { DesignSystem, withDesignSystemDefaults } from "../design-system";
import {
    applyLocalizedProperty,
    Direction,
    ellipsis,
} from "@microsoft/fast-jss-utilities";
import { applyCornerRadius, applyFocusPlaceholderBorder } from "../utilities/border";
import { applyCursorDefault, applyCursorPointer } from "../utilities/cursor";
import { applyDisabledState } from "../utilities/disabled";
import { applyScaledTypeRamp } from "../utilities/typography";

const styles: ComponentStyles<SliderLabelClassNameContract, DesignSystem> = (
    config: DesignSystem
): ComponentStyleSheet<SliderLabelClassNameContract, DesignSystem> => {
    const designSystem: DesignSystem = withDesignSystemDefaults(config);
    const direction: Direction = designSystem.direction;

    return {
        sliderLabel: {
            display: "grid",
        },

        sliderLabel_positioningRegion: {
            display: "grid",
        },

        sliderLabel_label: {
            ...applyScaledTypeRamp("t9"),
            color: neutralForegroundActive,
        },

        sliderLabel_tickMark: {
            background: neutralOutlineRest,
        },

        sliderLabel__positionMin: {},

        sliderLabel__positionMax: {},

        sliderLabel__horizontal: {
            "&$sliderLabel": {
                alignSelf: "start",
                gridRow: "2",
                marginTop: "-2px",
            },

            "& $sliderLabel_positioningRegion": {
                gridTemplateColumns: "0",
                gridTemplateRows: "auto auto",
                width: "0",
                justifySelf: "center",

                "&$sliderLabel__positionMin": {
                    "& $sliderLabel_label": {
                        marginLeft: "-10px",
                        justifySelf: "start",
                    },
                },

                "&$sliderLabel__positionMax": {
                    "& $sliderLabel_label": {
                        marginRight: "-10px",
                        justifySelf: "end",
                    },
                },
            },

            "& $sliderLabel_label": {
                justifySelf: "center",
                gridRow: "2",
            },

            "& $sliderLabel_tickMark": {
                height: "4px",
                width: "2px",
                justifySelf: "center",
            },
        },

        sliderLabel__vertical: {
            "&$sliderLabel": {
                gridColumn: "2",
                marginLeft: "-2px",
            },

            "& $sliderLabel_positioningRegion": {
                gridTemplateColumns: "auto auto",
                gridTemplateRows: "0",
                height: "2px",
                alignSelf: "center",
            },

            "& $sliderLabel_label": {
                gridColumn: "2",
                alignSelf: "center",
                margin: "2px",
            },

            "& $sliderLabel_tickMark": {
                height: "2px",
                width: "4px",
                alignSelf: "center",
            },
        },

        sliderLabel__rtl: {
            "&$sliderLabel__horizontal": {
                "& $sliderLabel_positioningRegion": {
                    "&$sliderLabel__positionMin": {
                        "& $sliderLabel_label": {
                            marginRight: "0",
                            marginLeft: "-10px",
                            justifySelf: "end",
                        },
                    },

                    "&$sliderLabel__positionMax": {
                        "& $sliderLabel_label": {
                            marginRight: "0",
                            marginLeft: "-10px",
                            justifySelf: "start",
                        },
                    },
                },
            },
        },
    };
};

export default styles;
