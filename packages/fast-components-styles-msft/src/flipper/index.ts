import { ComponentStyles } from "@microsoft/fast-jss-manager";
import { FlipperClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";
import {
    applyFocusVisible,
    directionSwitch,
    format,
    toPx,
} from "@microsoft/fast-jss-utilities";
import { DesignSystem } from "../design-system";
import {
    neutralFillStealthActive,
    neutralFillStealthHover,
    neutralFillStealthRest,
    neutralFocus,
    neutralForegroundRest,
    neutralOutlineActive,
    neutralOutlineHover,
    neutralOutlineRest,
} from "../utilities/color";
import { glyphSize, height } from "../utilities/density";
import { outlineWidth } from "../utilities/design-system";
import { applyCursorPointer } from "../utilities/cursor";
import {
    highContrastColorBackground,
    highContrastHighlightBackground,
    highContrastOutline,
    highContrastSelectedForeground,
} from "../utilities/high-contrast";

const styles: ComponentStyles<FlipperClassNameContract, DesignSystem> = {
    flipper: {
        ...applyCursorPointer(),
        width: height(),
        height: height(),
        display: "inline-flex",
        "justify-content": "center",
        "align-items": "center",
        margin: "0",
        position: "relative",
        fill: neutralForegroundRest,
        color: neutralForegroundRest,
        background: "transparent",
        border: "none",
        padding: "0",
        "&::before": {
            transition: "all 0.1s ease-in-out",
            content: "''",
            opacity: "0.8",
            background: neutralFillStealthRest,
            border: format(
                "{0} solid {1}",
                toPx<DesignSystem>(outlineWidth),
                neutralOutlineRest
            ),
            "border-radius": "50%",
            position: "absolute",
            top: "0",
            right: "0",
            bottom: "0",
            left: "0",
            ...highContrastColorBackground,
        },
        "&:active": {
            "&::before": {
                background: neutralFillStealthActive,
                "border-color": neutralOutlineActive,
            },
        },
        "&:hover": {
            "&::before": {
                background: neutralFillStealthHover,
                "border-color": neutralOutlineHover,
                ...highContrastHighlightBackground,
            },
            "& $flipper_glyph": {
                ...highContrastSelectedForeground,
            },
        },
        ...applyFocusVisible({
            "&::before": {
                "box-shadow": format<DesignSystem>("0 0 0 1px {0} inset", neutralFocus),
                border: neutralFocus,
            },
        }),
        "&::-moz-focus-inner": {
            border: "0",
        },
        ...highContrastOutline,
    },
    flipper_glyph: {
        position: "relative",
        transform: directionSwitch("none", "rotate(180deg)"),
        width: glyphSize,
        height: glyphSize,
    },
    flipper__next: {},
    flipper__previous: {},
};

export default styles;
