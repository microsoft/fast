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

        slider_layoutRegion: {
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

        slider_thumb__lowerValue: {},

        slider_thumb__upperValue: {},

        slider_track: {},

        slider_backgroundTrack: {
            borderRadius: "2px",
            background: neutralOutlineRest,
        },

        slider_foregroundTrack: {
            transition: "all .04s linear",
            borderRadius: "2px",
            background: neutralForegroundHint,
        },

        slider__disabled: {
            opacity: ".3",
        },

        slider__horizontal: {
            "&$slider": {
                minHeight: "36px",
                minWidth: "128px",
            },

            "& $slider_layoutRegion": {
                margin: "0 10px 0 10px",
                gridTemplateRows: "20px 1fr",
            },

            "& $slider_thumb": {
                alignSelf: "start",
            },

            "& $slider_thumb__upperValue": {
                transform: "translateX(10px)",
            },

            "& $slider_thumb__lowerValue": {
                transform: "translateX(-10px)",
            },

            "& $slider_track": {
                marginTop: "8px",
                alignSelf: "start",
                height: "4px",
                width: "100%",
            },

            "& $slider_backgroundTrack": {
                marginTop: "8px",
                alignSelf: "start",
                height: "4px",
                left: "-2px",
                right: "-2px",
            },

            "& $slider_foregroundTrack": {
                marginTop: "8px",
                alignSelf: "start",
                height: "4px",
            },

            "&$slider__modeAdjustLower": {
                "& $slider_foregroundTrack": {
                    marginRight: "-2px",
                },
            },

            "&$slider__modeAdjustUpper": {
                "& $slider_foregroundTrack": {
                    marginLeft: "-2px",
                },
            },
        },

        slider__vertical: {
            "&$slider": {
                minHeight: "128px",
                minWidth: "36px",
            },

            "& $slider_thumb": {
                justifySelf: "start",
            },

            "& $slider_layoutRegion": {
                margin: "10px 0 10px 0",
                gridTemplateColumns: "20px 1fr",
            },

            "& $slider_thumb__upperValue": {
                transform: "translateY(-10px)",
            },

            "& $slider_thumb__lowerValue": {
                transform: "translateY(10px)",
            },

            "& $slider_track": {
                justifySelf: "start",
                marginLeft: "8px",
                width: "4px",
                height: "100%",
            },

            "& $slider_backgroundTrack": {
                justifySelf: "start",
                marginLeft: "8px",
                width: "4px",
                top: "-2px",
                bottom: "-2px",
            },

            "& $slider_foregroundTrack": {
                justifySelf: "start",
                marginLeft: "8px",
                width: "4px",
            },

            "&$slider__modeAdjustLower": {
                "& $slider_foregroundTrack": {
                    marginTop: "-2px",
                },
            },

            "&$slider__modeAdjustUpper": {
                "& $slider_foregroundTrack": {
                    marginBottom: "-2px",
                },
            },
        },

        slider__rtl: {
            "&$slider__horizontal": {
                "& $slider_thumb__upperValue": {
                    transform: "translateX(-10px)",
                },

                "& $slider_thumb__lowerValue": {
                    transform: "translateX(10px)",
                },

                "&$slider__modeAdjustLower": {
                    "& $slider_foregroundTrack": {
                        marginRight: "0",
                        marginLeft: "-2px",
                    },
                },

                "&$slider__modeAdjustUpper": {
                    "& $slider_foregroundTrack": {
                        marginRight: "-2px",
                        marginLeft: "0",
                    },
                },
            },

            "&$slider__vertical": {
                "& $slider_backgroundTrack": {
                    marginRight: "8px",
                    marginLeft: "0",
                },

                "& $slider_foregroundTrack": {
                    marginRight: "8px",
                    marginLeft: "0",
                },
            },
        },

        slider__modeSingle: {},

        slider__modeAdjustLower: {},

        slider__modeAdjustUpper: {},

        slider__modeAdjustBoth: {
            "&$slider__horizontal": {
                "& $slider_thumb__upperValue": {
                    width: "10px",
                    borderRadius: "0px 10px 10px 0px",
                },

                "& $slider_thumb__lowerValue": {
                    width: "10px",
                    borderRadius: "10px 0px 0px 10px",
                },

                "&$slider__rtl": {
                    "& $slider_thumb__upperValue": {
                        borderRadius: "10px 0px 0px 10px",
                    },

                    "& $slider_thumb__lowerValue": {
                        borderRadius: "0px 10px 10px 0px",
                    },
                },
            },

            "&$slider__vertical": {
                "& $slider_thumb__upperValue": {
                    height: "10px",
                    borderRadius: "10px 10px 0px 0px",
                },

                "& $slider_thumb__lowerValue": {
                    height: "10px",
                    borderRadius: "0px 0px 10px 10px",
                },
            },

            "& $slider_foregroundTrack": {
                borderRadius: "0",
            },
        },
    };
};

export default styles;
