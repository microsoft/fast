import { ComponentStyles, CSSRules } from "@microsoft/fast-jss-manager";
import { DesignSystem, ensureDesignSystemDefaults } from "../design-system";
import {
    applyFocusVisible,
    directionSwitch,
    format,
    toPx,
} from "@microsoft/fast-jss-utilities";
import { applyCornerRadius, applyFocusPlaceholderBorder } from "../utilities/border";
import { applyCursorPointer } from "../utilities/cursor";
import { focusOutlineWidth } from "../utilities/design-system";
import { applyScaledTypeRamp } from "../utilities/typography";
import { glyphSize, height, horizontalSpacing } from "../utilities/density";
import { applyDisabledState } from "../utilities/disabled";
import { ButtonBaseClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";
import {
    accentForegroundActive,
    accentForegroundHover,
    accentForegroundRest,
    neutralForegroundRest,
} from "../utilities/color";

export function buttonStyles(): CSSRules<{}> {
    return {
        ...applyScaledTypeRamp("t7"),
        ...applyCursorPointer(),
        ...applyFocusPlaceholderBorder(),
        ...applyCornerRadius(),
        fontFamily: "inherit",
        boxSizing: "border-box",
        maxWidth: "374px",
        minWidth: ensureDesignSystemDefaults(
            (designSystem: DesignSystem): string =>
                designSystem.density <= -2 ? "28px" : "32px"
        ),
        padding: format("0 {0}", horizontalSpacing(focusOutlineWidth)),
        display: "inline-flex",
        justifyContent: "center",
        alignItems: "center",
        height: height(),
        lineHeight: "1",
        overflow: "hidden",
        textDecoration: "none",
        whiteSpace: "nowrap",
        transition: "all 0.1s ease-in-out",
        "&::-moz-focus-inner": {
            border: "0",
        },
    };
}
/**
 * The base button stye object
 */
export const baseButton: ComponentStyles<ButtonBaseClassNameContract, DesignSystem> = {
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

export function lightweightButtonStyles(): CSSRules<{}> {
    return {
        ...buttonStyles(),
        backgroundColor: "transparent",
        color: accentForegroundRest,
        fill: accentForegroundRest,
        ...applyFocusVisible({
            borderColor: "transparent",
            boxShadow: "none",
            "& $button_contentRegion::before": {
                background: neutralForegroundRest,
            },
        }),
        // Underline
        "&:hover $button_contentRegion::before": {
            background: accentForegroundHover,
            "@media (-ms-high-contrast:active)": {
                background: "ButtonHighlight",
            },
        },
        "&:hover$button__disabled $button_contentRegion::before": {
            display: "none",
        },
        "&:active $button_contentRegion::before": {
            background: accentForegroundActive,
        },
        "&$button__disabled, &$button__disabled $button_contentRegion::before": {
            backgroundColor: "transparent",
        },
        "@media (-ms-high-contrast:active)": {
            border: "none",
            fill: "ButtonHighlight",
        },
        "&:hover:enabled": {
            color: accentForegroundHover,
            fill: accentForegroundHover,
            backgroundColor: "transparent",
        },
        "&:active:enabled": {
            color: accentForegroundActive,
            fill: accentForegroundActive,
            backgroundColor: "transparent",
        },
    };
}
