import { DesignSystem, withDesignSystemDefaults } from "../design-system";
import { ComponentStyles, ComponentStyleSheet } from "@microsoft/fast-jss-manager";
import { SliderClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";
import { elevation, ElevationMultiplier } from "../utilities/elevation";
import {
    neutralForegroundHint,
    neutralForegroundHover,
    neutralForegroundRest,
    neutralOutlineRest,
} from "../utilities/color";

const styles: ComponentStyles<SliderClassNameContract, DesignSystem> = (
    config: DesignSystem
): ComponentStyleSheet<SliderClassNameContract, DesignSystem> => {
    const designSystem: DesignSystem = withDesignSystemDefaults(config);

    return {
        slider: {
            height: "100%",
            width: "100%",
            display: "inline-grid",
        },

        slider_layoutPanel: {
            display: "grid",
        },

        slider_thumb: {
            height: "20px",
            width: "20px",
            border: "none",
            background: neutralForegroundRest,
            borderRadius: "50%",
            transition: "all .04s linear",
            ...elevation(ElevationMultiplier.e2)(designSystem),

            "&:hover": {
                cursor: "pointer",
                background: neutralForegroundHover,
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
                minHeight: "36px",
                minWidth: "128px",
            },

            "& $slider_layoutPanel": {
                margin: "0 10px 0 10px",
                gridTemplateRows: "20px 1fr",
            },

            "& $slider_thumb": {
                alignSelf: "start",
            },

            "& $slider_thumb_upper": {
                transform: "translateX(10px)",
            },

            "& $slider_thumb_lower": {
                transform: "translateX(-10px)",
            },

            "& $slider_barTrack": {
                marginTop: "8px",
                alignSelf: "start",
                height: "4px",
                width: "100%",
            },

            "& $slider_barBack": {
                marginTop: "8px",
                alignSelf: "start",
                height: "4px",
                left: "-2px",
                right: "-2px",
            },

            "& $slider_barFront": {
                marginTop: "8px",
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
                minWidth: "36px",
            },

            "& $slider_thumb": {
                justifySelf: "start",
            },

            "& $slider_layoutPanel": {
                margin: "10px 0 10px 0",
                gridTemplateColumns: "20px 1fr",
            },

            "& $slider_thumb_upper": {
                transform: "translateY(-10px)",
            },

            "& $slider_thumb_lower": {
                transform: "translateY(10px)",
            },

            "& $slider_barTrack": {
                justifySelf: "start",
                marginLeft: "8px",
                width: "4px",
                height: "100%",
            },

            "& $slider_barBack": {
                justifySelf: "start",
                marginLeft: "8px",
                width: "4px",
                top: "-2px",
                bottom: "-2px",
            },

            "& $slider_barFront": {
                justifySelf: "start",
                marginLeft: "8px",
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
                    transform: "translateX(-10px)",
                },

                "& $slider_thumb_lower": {
                    transform: "translateX(10px)",
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
                    marginRight: "8px",
                    marginLeft: "0",
                },

                "& $slider_barFront": {
                    marginRight: "8px",
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
                    width: "10px",
                    borderTopRightRadius: "10px",
                    borderBottomRightRadius: "10px",
                    borderTopLeftRadius: "0",
                    borderBottomLeftRadius: "0",
                },

                "& $slider_thumb_lower": {
                    width: "10px",
                    borderTopRightRadius: "0",
                    borderBottomRightRadius: "0",
                    borderTopLeftRadius: "10px",
                    borderBottomLeftRadius: "8px",
                },

                "&$slider__rtl": {
                    "& $slider_thumb_upper": {
                        borderTopRightRadius: "0",
                        borderBottomRightRadius: "0",
                        borderTopLeftRadius: "10px",
                        borderBottomLeftRadius: "10px",
                    },

                    "& $slider_thumb_lower": {
                        borderTopRightRadius: "10px",
                        borderBottomRightRadius: "10px",
                        borderTopLeftRadius: "0",
                        borderBottomLeftRadius: "0",
                    },
                },
            },

            "&$slider__orientationVertical": {
                "& $slider_thumb_upper": {
                    height: "10px",
                    borderTopRightRadius: "10px",
                    borderBottomRightRadius: "0",
                    borderTopLeftRadius: "10px",
                    borderBottomLeftRadius: "0",
                },

                "& $slider_thumb_lower": {
                    height: "10px",
                    borderTopRightRadius: "0",
                    borderBottomRightRadius: "10px",
                    borderTopLeftRadius: "0",
                    borderBottomLeftRadius: "10px",
                },
            },

            "& $slider_barFront": {
                borderRadius: "0",
            },
        },
    };
};

export default styles;
