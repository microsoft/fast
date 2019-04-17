import { DesignSystem, withDesignSystemDefaults } from "../design-system";
import { ComponentStyles, ComponentStyleSheet } from "@microsoft/fast-jss-manager";
import { toPx } from "@microsoft/fast-jss-utilities";
import {
    ButtonClassNameContract,
    SliderClassNameContract,
} from "@microsoft/fast-components-class-name-contracts-msft";
import { elevation, ElevationMultiplier } from "../utilities/elevation";
import {
    neutralFillStealthRest,
    neutralForegroundHover,
    neutralForegroundRest,
    neutralOutlineRest,
    neutralForegroundHint,
    neutralOutlineHover,
} from "../utilities/color";
import { applyFloatingCornerRadius } from "../utilities/border";
import { transform } from "@babel/core";

const styles: ComponentStyles<SliderClassNameContract, DesignSystem> = (
    config: DesignSystem
): ComponentStyleSheet<SliderClassNameContract, DesignSystem> => {
    const designSystem: DesignSystem = withDesignSystemDefaults(config);

    return {
        slider: {
            height: "100%",
            width: "100%",
            display: "inline-grid",
            "&:hover": {
                "& $slider_barBack": {
                    background: neutralOutlineHover,
                },

                "& $slider_barFront": {
                    background: neutralForegroundHover,
                },
            },
        },

        slider_layoutPanel: {
            display: "grid",
        },

        slider_thumb: {
            height: "16px",
            width: "16px",
            border: "none",
            background: neutralForegroundRest,
            borderRadius: "50%",
            transition: "all .04s linear",
            ...elevation(ElevationMultiplier.e2)(designSystem),

            "&:hover": {
                cursor: "pointer",
            },
        },

        slider_thumb_lower: {},

        slider_thumb_upper: {},

        slider_barTrack: {},

        slider_barBack: {
            borderRadius: "2px",
            background: neutralOutlineRest,
        },

        slider_barFront: {
            transition: "all .04s linear",
            borderRadius: "2px",
            background: neutralForegroundHint,
        },

        slider__disabled: {
            opacity: ".3",
        },

        slider__orientationHorizontal: {
            "&$slider": {
                minHeight: "32px",
                minWidth: "128px",
            },

            "& $slider_layoutPanel": {
                margin: "0 10px 0 10px",
                gridTemplateRows: "16px 1fr",
            },

            "& $slider_thumb": {
                alignSelf: "start",
            },

            "& $slider_thumb_upper": {
                transform: "translateX(8px)",
            },

            "& $slider_thumb_lower": {
                transform: "translateX(-8px)",
            },

            "& $slider_barTrack": {
                marginTop: "6px",
                alignSelf: "start",
                height: "4px",
                width: "100%",
            },

            "& $slider_barBack": {
                marginTop: "6px",
                alignSelf: "start",
                height: "4px",
                left: "-2px",
                right: "-2px",
            },

            "& $slider_barFront": {
                marginTop: "6px",
                alignSelf: "start",
                height: "4px",
            },

            "&$slider__modeAdjustLower": {
                "& $slider_barFront": {
                    marginRight: "-2px",
                },
            },

            "&$slider__modeAdjustUpper": {
                "& $slider_barFront": {
                    marginLeft: "-2px",
                },
            },
        },

        slider__orientationVertical: {
            "&$slider": {
                minHeight: "128px",
                minWidth: "32px",
            },

            "& $slider_thumb": {
                justifySelf: "start",
            },

            "& $slider_layoutPanel": {
                margin: "8px 0 8px 0",
                gridTemplateColumns: "16px 1fr",
            },

            "& $slider_thumb_upper": {
                transform: "translateY(-8px)",
            },

            "& $slider_thumb_lower": {
                transform: "translateY(8px)",
            },

            "& $slider_barTrack": {
                justifySelf: "start",
                marginLeft: "6px",
                width: "4px",
                height: "100%",
            },

            "& $slider_barBack": {
                justifySelf: "start",
                marginLeft: "6px",
                width: "4px",
                top: "-2px",
                bottom: "-2px",
            },

            "& $slider_barFront": {
                justifySelf: "start",
                marginLeft: "6px",
                width: "4px",
            },

            "&$slider__modeAdjustLower": {
                "& $slider_barFront": {
                    marginTop: "-2px",
                },
            },

            "&$slider__modeAdjustUpper": {
                "& $slider_barFront": {
                    marginBottom: "-2px",
                },
            },
        },

        slider__rtl: {
            "&$slider__orientationHorizontal": {
                "& $slider_thumb_upper": {
                    transform: "translateX(-8px)",
                },

                "& $slider_thumb_lower": {
                    transform: "translateX(8px)",
                },

                "&$slider__modeAdjustLower": {
                    "& $slider_barFront": {
                        marginRight: "0",
                        marginLeft: "-2px",
                    },
                },

                "&$slider__modeAdjustUpper": {
                    "& $slider_barFront": {
                        marginRight: "-2px",
                        marginLeft: "0",
                    },
                },
            },

            "&$slider__orientationVertical": {
                "& $slider_barBack": {
                    marginRight: "6px",
                    marginLeft: "0",
                },

                "& $slider_barFront": {
                    marginRight: "6px",
                    marginLeft: "0",
                },
            },
        },

        slider__modeSingle: {},

        slider__modeAdjustLower: {},

        slider__modeAdjustUpper: {},

        slider__modeAdjustBoth: {
            "&$slider__orientationHorizontal": {
                "& $slider_thumb_upper": {
                    width: "8px",
                    borderTopRightRadius: "8px",
                    borderBottomRightRadius: "8px",
                    borderTopLeftRadius: "0",
                    borderBottomLeftRadius: "0",
                },

                "& $slider_thumb_lower": {
                    width: "8px",
                    borderTopRightRadius: "0",
                    borderBottomRightRadius: "0",
                    borderTopLeftRadius: "8px",
                    borderBottomLeftRadius: "8px",
                },

                "&$slider__rtl": {
                    "& $slider_thumb_upper": {
                        borderTopRightRadius: "0",
                        borderBottomRightRadius: "0",
                        borderTopLeftRadius: "8px",
                        borderBottomLeftRadius: "8px",
                    },

                    "& $slider_thumb_lower": {
                        borderTopRightRadius: "8px",
                        borderBottomRightRadius: "8px",
                        borderTopLeftRadius: "0",
                        borderBottomLeftRadius: "0",
                    },
                },
            },

            "&$slider__orientationVertical": {
                "& $slider_thumb_upper": {
                    height: "8px",
                    borderTopRightRadius: "8px",
                    borderBottomRightRadius: "0",
                    borderTopLeftRadius: "8px",
                    borderBottomLeftRadius: "0",
                },

                "& $slider_thumb_lower": {
                    height: "8px",
                    borderTopRightRadius: "0",
                    borderBottomRightRadius: "8px",
                    borderTopLeftRadius: "0",
                    borderBottomLeftRadius: "8px",
                },
            },

            "& $slider_barFront": {
                borderRadius: "0",
            },
        },
    };
};

export default styles;
