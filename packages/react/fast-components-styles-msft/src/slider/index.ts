import { ComponentStyles } from "@microsoft/fast-jss-manager";
import {
    applyFocusVisible,
    divide,
    format,
    important,
    multiply,
    subtract,
    toPx,
} from "@microsoft/fast-jss-utilities";
import { SliderClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";
import { applyCursorPointer } from "../utilities/cursor";
import { DesignSystem, DesignSystemResolver } from "../design-system";
import { applyPillCornerRadius } from "../utilities/border";
import {
    neutralForegroundActive,
    neutralForegroundHint,
    neutralForegroundHover,
    neutralForegroundRest,
    neutralOutlineRest,
} from "../utilities/color";
import { densityCategorySwitch, heightNumber } from "../utilities/density";
import { designUnit } from "../utilities/design-system";
import { applyDisabledState } from "../utilities/disabled";
import {
    highContrastBackground,
    HighContrastColor,
    highContrastDisabledBackground,
    highContrastHighlightBackground,
    highContrastOptOutProperty,
    highContrastSelector,
    highContrastDoubleOuterFocus,
} from "../utilities/high-contrast";
import { doubleOuterFocus } from "../patterns/input-field";

const thumbSizeValue: DesignSystemResolver<number> = divide(heightNumber(), 2);
const thumbSize: DesignSystemResolver<string> = toPx(thumbSizeValue);
const halfThumbSize: DesignSystemResolver<string> = toPx(divide(thumbSizeValue, 2));
const trackSizeValue: DesignSystemResolver<number> = densityCategorySwitch(
    divide(designUnit, 2),
    designUnit,
    multiply(designUnit, 1.5)
);
const trackSize: DesignSystemResolver<string> = toPx(trackSizeValue);
const trackOffset: DesignSystemResolver<string> = toPx(
    divide(subtract(thumbSizeValue, trackSizeValue), 2)
);
const trackOverhang: DesignSystemResolver<string> = toPx(
    multiply(divide(designUnit, 2), -1)
);
const minSize: string = "50px";

const styles: ComponentStyles<SliderClassNameContract, DesignSystem> = {
    slider: {
        display: "inline-grid",
        ...applyCursorPointer(),
        [highContrastSelector]: {
            ...highContrastOptOutProperty,
        },
    },
    slider_layoutRegion: {
        display: "grid",
    },
    slider_thumb: {
        height: thumbSize,
        width: thumbSize,
        border: "none",
        background: neutralForegroundRest,
        "border-radius": "50%",
        transition: "all 0.2s ease",
        ...applyFocusVisible<DesignSystem>({
            ...doubleOuterFocus,
            ...highContrastDoubleOuterFocus,
        }),
        "&:hover": {
            background: neutralForegroundHover,
        },
        "&:active": {
            background: neutralForegroundActive,
        },
        [highContrastSelector]: {
            background: HighContrastColor.buttonText,
            "&:hover, &:active": {
                background: HighContrastColor.selectedBackground,
            },
        },
    },
    slider_thumb__lowerValue: {},
    slider_thumb__upperValue: {},
    slider_track: {},
    slider_backgroundTrack: {
        ...applyPillCornerRadius(),
        background: neutralOutlineRest,
        ...highContrastBackground,
    },
    slider_foregroundTrack: {
        ...applyPillCornerRadius(),
        background: neutralForegroundHint,
        transition: "all 0.2s ease",
        ...highContrastHighlightBackground,
    },
    slider__disabled: {
        ...applyDisabledState(),
        "& $slider_thumb, & $slider_backgroundTrack": {
            ...highContrastDisabledBackground,
            "&:hover": {
                background: neutralForegroundRest,
            },
            "&:active": {
                background: neutralForegroundRest,
            },
        },
        "& $slider_layoutRegion": {
            "& div > span": {
                color: important(HighContrastColor.disabledText),
            },
            "& div > div": {
                background: important(HighContrastColor.disabledText),
            },
        },
    },
    slider__dragging: {
        "& $slider_thumb": {
            transition: "none",
        },
        "& $slider_foregroundTrack": {
            transition: "none",
        },
    },
    slider__incrementing: {
        "& $slider_thumb": {
            transition: "all 0.10s linear",
        },
        "& $slider_foregroundTrack": {
            transition: "all 0.10s linear",
        },
    },
    slider__horizontal: {
        "&$slider": {
            width: "100%",
            "min-height": thumbSize,
            "min-width": minSize,
        },
        "& $slider_layoutRegion": {
            margin: format(`0 {0}`, halfThumbSize),
            "grid-template-rows": format(`{0} 1fr`, thumbSize),
        },
        "& $slider_thumb": {
            "align-self": "start",
        },
        "& $slider_thumb__upperValue": {
            transform: format(`translateX({0})`, halfThumbSize),
        },
        "& $slider_thumb__lowerValue": {
            transform: format(`translateX(-{0})`, halfThumbSize),
        },
        "& $slider_track": {
            "align-self": "start",
            height: thumbSize,
            width: "100%",
        },
        "& $slider_backgroundTrack": {
            "margin-top": trackOffset,
            "align-self": "start",
            height: trackSize,
            left: trackOverhang,
            right: trackOverhang,
        },
        "& $slider_foregroundTrack": {
            "margin-top": trackOffset,
            "align-self": "start",
            height: trackSize,
        },
        "&$slider__modeAdjustLower": {
            "& $slider_foregroundTrack": {
                "margin-right": trackOverhang,
            },
        },
        "&$slider__modeAdjustUpper": {
            "& $slider_foregroundTrack": {
                "margin-left": trackOverhang,
            },
        },
    },
    slider__vertical: {
        "&$slider": {
            height: "100%",
            "min-height": minSize,
            "min-width": thumbSize,
        },
        "& $slider_thumb": {
            "justify-self": "start",
        },
        "& $slider_layoutRegion": {
            margin: format(`{0} 0`, halfThumbSize),
            "grid-template-columns": format(`{0} 1fr`, thumbSize),
        },
        "& $slider_thumb__upperValue": {
            transform: format(`translateY(-{0})`, halfThumbSize),
        },
        "& $slider_thumb__lowerValue": {
            transform: format(`translateY({0})`, halfThumbSize),
        },
        "& $slider_track": {
            "justify-self": "start",
            "margin-left": trackOffset,
            width: trackSize,
            height: "100%",
        },
        "& $slider_backgroundTrack": {
            "justify-self": "start",
            "margin-left": trackOffset,
            width: trackSize,
            top: trackOverhang,
            bottom: trackOverhang,
        },
        "& $slider_foregroundTrack": {
            "justify-self": "start",
            "margin-left": trackOffset,
            width: trackSize,
        },
        "&$slider__modeAdjustLower": {
            "& $slider_foregroundTrack": {
                "margin-top": trackOverhang,
            },
        },
        "&$slider__modeAdjustUpper": {
            "& $slider_foregroundTrack": {
                "margin-bottom": trackOverhang,
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
                    "margin-right": "0",
                    "margin-left": trackOverhang,
                },
            },
            "&$slider__modeAdjustUpper": {
                "& $slider_foregroundTrack": {
                    "margin-right": trackOverhang,
                    "margin-left": "0",
                },
            },
        },
        "&$slider__vertical": {
            "& $slider_backgroundTrack": {
                "margin-right": trackOffset,
                "margin-left": "0",
            },
            "& $slider_foregroundTrack": {
                "margin-right": trackOffset,
                "margin-left": "0",
            },
        },
    },
    slider__modeSingle: {
        "& $slider_foregroundTrack": {
            display: "none",
        },
    },
    slider__modeAdjustLower: {},
    slider__modeAdjustUpper: {},
    slider__modeAdjustBoth: {
        "&$slider__horizontal": {
            "& $slider_thumb__upperValue": {
                width: halfThumbSize,
                "border-radius": format(`0px {0} {0} 0px`, halfThumbSize),
            },
            "& $slider_thumb__lowerValue": {
                width: halfThumbSize,
                "border-radius": format(`{0} 0px 0px {0}`, halfThumbSize),
            },
            "&$slider__rtl": {
                "& $slider_thumb__upperValue": {
                    "border-radius": format(`{0} 0px 0px {0}`, halfThumbSize),
                },

                "& $slider_thumb__lowerValue": {
                    "border-radius": format(`0px {0} {0} 0px`, halfThumbSize),
                },
            },
        },
        "&$slider__vertical": {
            "& $slider_thumb__upperValue": {
                height: halfThumbSize,
                "border-radius": format(`{0} {0} 0px 0px`, halfThumbSize),
            },
            "& $slider_thumb__lowerValue": {
                height: halfThumbSize,
                "border-radius": format(`0px 0px {0} {0}`, halfThumbSize),
            },
        },
        "& $slider_foregroundTrack": {
            "border-radius": "0",
        },
    },
};

export default styles;
