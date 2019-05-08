import { SliderClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";
import { ComponentStyles } from "@microsoft/fast-jss-manager";
import {
    add,
    applyFocusVisible,
    divide,
    format,
    multiply,
    toPx,
} from "@microsoft/fast-jss-utilities";
import { DesignSystem, DesignSystemResolver } from "../design-system";
import { applyCornerRadius } from "../utilities/border";
import {
    neutralFocus,
    neutralForegroundActive,
    neutralForegroundHint,
    neutralForegroundHover,
    neutralForegroundRest,
    neutralOutlineRest,
} from "../utilities/color";
import { applyCursorPointer } from "../utilities/cursor";
import { heightNumber } from "../utilities/density";
import {
    backgroundColor,
    designUnit,
    focusOutlineWidth,
} from "../utilities/design-system";
import { applyDisabledState } from "../utilities/disabled";
import { applyElevation, ElevationMultiplier } from "../utilities/elevation";

const thumbSizeValue: DesignSystemResolver<number> = add(
    divide(heightNumber(), 2),
    designUnit
);
const thumbSize: DesignSystemResolver<string> = toPx(thumbSizeValue);
const halfThumbSize: DesignSystemResolver<string> = toPx(divide(thumbSizeValue, 2));
const trackOffset: DesignSystemResolver<string> = toPx(divide(heightNumber(), 4));
const trackOverhang: DesignSystemResolver<string> = toPx(
    multiply(divide(designUnit, 2), -1)
);
const minSize: string = "50px";

const styles: ComponentStyles<SliderClassNameContract, DesignSystem> = {
    slider: {
        display: "inline-grid",
        ...applyCursorPointer(),
    },
    slider_layoutRegion: {
        display: "grid",
    },
    slider_thumb: {
        height: thumbSize,
        width: thumbSize,
        border: "none",
        background: neutralForegroundRest,
        borderRadius: "50%",
        transition: "all 0.1s ease",
        ...applyElevation(ElevationMultiplier.e4),
        ...applyFocusVisible<DesignSystem>({
            boxShadow: format(
                `0 0 0 2px {0}, 0 0 0 {2} {1}`,
                backgroundColor,
                neutralFocus,
                toPx(add(focusOutlineWidth, 2))
            ),
        }),
        "&:hover": {
            background: neutralForegroundHover,
        },
        "&:active": {
            background: neutralForegroundActive,
        },
    },
    slider_thumb__lowerValue: {},
    slider_thumb__upperValue: {},
    slider_track: {},
    slider_backgroundTrack: {
        ...applyCornerRadius(),
        background: neutralOutlineRest,
    },
    slider_foregroundTrack: {
        ...applyCornerRadius(),
        background: neutralForegroundHint,
        transition: "all 0.1s ease",
    },
    slider__disabled: {
        ...applyDisabledState(),
        "& $slider_thumb": {
            "&:hover": {
                background: neutralForegroundRest,
            },
        },
    },
    slider__horizontal: {
        "&$slider": {
            width: "100%",
            minHeight: thumbSize,
            minWidth: minSize,
        },
        "& $slider_layoutRegion": {
            margin: format(`0 {0}`, halfThumbSize),
            gridTemplateRows: format(`{0} 1fr`, thumbSize),
        },
        "& $slider_thumb": {
            alignSelf: "start",
        },
        "& $slider_thumb__upperValue": {
            transform: format(`translateX({0})`, halfThumbSize),
        },
        "& $slider_thumb__lowerValue": {
            transform: format(`translateX(-{0})`, halfThumbSize),
        },
        "& $slider_track": {
            alignSelf: "start",
            height: thumbSize,
            width: "100%",
        },
        "& $slider_backgroundTrack": {
            marginTop: trackOffset,
            alignSelf: "start",
            height: toPx(designUnit),
            left: trackOverhang,
            right: trackOverhang,
        },
        "& $slider_foregroundTrack": {
            marginTop: trackOffset,
            alignSelf: "start",
            height: toPx(designUnit),
        },
        "&$slider__modeAdjustLower": {
            "& $slider_foregroundTrack": {
                marginRight: trackOverhang,
            },
        },
        "&$slider__modeAdjustUpper": {
            "& $slider_foregroundTrack": {
                marginLeft: trackOverhang,
            },
        },
    },
    slider__vertical: {
        "&$slider": {
            height: "100%",
            minHeight: minSize,
            minWidth: thumbSize,
        },
        "& $slider_thumb": {
            justifySelf: "start",
        },
        "& $slider_layoutRegion": {
            margin: format(`{0} 0`, halfThumbSize),
            gridTemplateColumns: format(`{0} 1fr`, thumbSize),
        },
        "& $slider_thumb__upperValue": {
            transform: format(`translateY(-{0})`, halfThumbSize),
        },
        "& $slider_thumb__lowerValue": {
            transform: format(`translateY({0})`, halfThumbSize),
        },
        "& $slider_track": {
            justifySelf: "start",
            marginLeft: trackOffset,
            width: toPx(designUnit),
            height: "100%",
        },
        "& $slider_backgroundTrack": {
            justifySelf: "start",
            marginLeft: trackOffset,
            width: toPx(designUnit),
            top: trackOverhang,
            bottom: trackOverhang,
        },
        "& $slider_foregroundTrack": {
            justifySelf: "start",
            marginLeft: trackOffset,
            width: toPx(designUnit),
        },
        "&$slider__modeAdjustLower": {
            "& $slider_foregroundTrack": {
                marginTop: trackOverhang,
            },
        },
        "&$slider__modeAdjustUpper": {
            "& $slider_foregroundTrack": {
                marginBottom: trackOverhang,
            },
        },
    },
    slider__rtl: {
        "&$slider__horizontal": {
            "& $slider_thumb__upperValue": {
                transform: format(`translateX(-{0})`, halfThumbSize),
            },
            "& $slider_thumb__lowerValue": {
                transform: format(`translateX({0})`, halfThumbSize),
            },
            "&$slider__modeAdjustLower": {
                "& $slider_foregroundTrack": {
                    marginRight: "0",
                    marginLeft: trackOverhang,
                },
            },
            "&$slider__modeAdjustUpper": {
                "& $slider_foregroundTrack": {
                    marginRight: trackOverhang,
                    marginLeft: "0",
                },
            },
        },
        "&$slider__vertical": {
            "& $slider_backgroundTrack": {
                marginRight: trackOffset,
                marginLeft: "0",
            },
            "& $slider_foregroundTrack": {
                marginRight: trackOffset,
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
                width: halfThumbSize,
                borderRadius: format(`0px {0} {0} 0px`, halfThumbSize),
            },
            "& $slider_thumb__lowerValue": {
                width: halfThumbSize,
                borderRadius: format(`{0} 0px 0px {0}`, halfThumbSize),
            },
            "&$slider__rtl": {
                "& $slider_thumb__upperValue": {
                    borderRadius: format(`{0} 0px 0px {0}`, halfThumbSize),
                },

                "& $slider_thumb__lowerValue": {
                    borderRadius: format(`0px {0} {0} 0px`, halfThumbSize),
                },
            },
        },
        "&$slider__vertical": {
            "& $slider_thumb__upperValue": {
                height: halfThumbSize,
                borderRadius: format(`{0} {0} 0px 0px`, halfThumbSize),
            },
            "& $slider_thumb__lowerValue": {
                height: halfThumbSize,
                borderRadius: format(`0px 0px {0} {0}`, halfThumbSize),
            },
        },
        "& $slider_foregroundTrack": {
            borderRadius: "0",
        },
    },
};

export default styles;
