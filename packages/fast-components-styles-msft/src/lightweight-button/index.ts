import { ButtonBaseClassNameContract as LightweightButtonClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";
import { ComponentStyles, CSSRules } from "@microsoft/fast-jss-manager";
import { applyFocusVisible, directionSwitch, toPx } from "@microsoft/fast-jss-utilities";
import { DesignSystem } from "../design-system";
import { buttonStyles } from "../patterns/button";
import {
    accentForegroundActive,
    accentForegroundHover,
    accentForegroundRest,
    neutralForegroundRest,
} from "../utilities/color";
import { glyphSize } from "../utilities/density";
import { focusOutlineWidth } from "../utilities/design-system";
import { applyDisabledState } from "../utilities/disabled";

const transparentBackground: CSSRules<DesignSystem> = {
    backgroundColor: "transparent",
};

const styles: ComponentStyles<LightweightButtonClassNameContract, DesignSystem> = {
    button: {
        ...buttonStyles(),
        ...transparentBackground,
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
            ...transparentBackground,
        },
        "@media (-ms-high-contrast:active)": {
            border: "none",
            fill: "ButtonHighlight",
        },
        "&:hover:enabled": {
            color: accentForegroundHover,
            fill: accentForegroundHover,
            ...transparentBackground,
        },
        "&:active:enabled": {
            color: accentForegroundActive,
            fill: accentForegroundActive,
            ...transparentBackground,
        },
    },
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

export default styles;
