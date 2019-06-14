import { ButtonClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";
import { ComponentStyles, CSSRules } from "@microsoft/fast-jss-manager";
import {
    applyFocusVisible,
    directionSwitch,
    format,
    toPx,
} from "@microsoft/fast-jss-utilities";
import {
    DesignSystem,
    DesignSystemResolver,
    ensureDesignSystemDefaults,
} from "../design-system";
import { applyCornerRadius, applyFocusPlaceholderBorder } from "../utilities/border";
import {
    accentFillActive,
    accentFillHover,
    accentFillRest,
    accentForegroundActive,
    accentForegroundCut,
    accentForegroundHover,
    accentForegroundRest,
    neutralFillActive,
    neutralFillHover,
    neutralFillRest,
    neutralFillStealthActive,
    neutralFillStealthHover,
    neutralFillStealthRest,
    neutralFocus,
    neutralForegroundRest,
    neutralOutlineActive,
    neutralOutlineHover,
    neutralOutlineRest,
} from "../utilities/color";
import { isDarkMode, Palette, swatchByContrast } from "../utilities/color/palette";
import { applyCursorPointer } from "../utilities/cursor";
import { glyphSize, height, horizontalSpacing } from "../utilities/density";
import {
    accentPalette,
    focusOutlineWidth,
    outlineWidth,
} from "../utilities/design-system";
import { applyDisabledState } from "../utilities/disabled";
import { applyScaledTypeRamp } from "../utilities/typography";

const styles: ComponentStyles<ButtonClassNameContract, DesignSystem> = {
    button: {
        color: neutralForegroundRest,
        fill: neutralForegroundRest,
        background: neutralFillRest,
        "&:hover:enabled": {
            background: neutralFillHover,
        },
        "&:active:enabled": {
            background: neutralFillActive,
        },
        ...applyFocusVisible<DesignSystem>({
            borderColor: neutralFocus,
        }),
        "&::-moz-focus-inner": {
            border: "0",
        },
        "@media (-ms-high-contrast:active)": {
            fill: "ButtonHighlight",
        },
    },
    button__primary: {},
    button__outline: {},
    button__lightweight: {},
    button__justified: {},
    button__stealth: {},
    button_contentRegion: {
        position: "relative",
        "&::before": {
            content: "''",
            display: "block",
            height: toPx<DesignSystem>(focusOutlineWidth),
            position: "absolute",
            bottom: "-3px",
            width: "100%",
            left: directionSwitch("0", ""),
            right: directionSwitch("", "0"),
        },
        "& svg": {
            width: glyphSize,
            height: glyphSize,
        },
    },
    button__disabled: {
        ...applyDisabledState(),
        "& $button_beforeContent, & $button_afterContent": {
            fill: "ButtonHighlight",
        },
    },
    button_beforeContent: {
        width: glyphSize,
        height: glyphSize,
    },
    button_afterContent: {
        width: glyphSize,
        height: glyphSize,
    },
};

export default styles;
