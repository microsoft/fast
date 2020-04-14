import { ButtonBaseClassNameContract as LightweightButtonClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";
import { ComponentStyles } from "@microsoft/fast-jss-manager";
import { applyFocusVisible, toPx } from "@microsoft/fast-jss-utilities";
import { DesignSystem } from "../design-system";
import { baseButton, buttonStyles } from "../patterns/button";
import {
    accentForegroundActive,
    accentForegroundHover,
    accentForegroundRest,
    neutralForegroundRest,
} from "../utilities/color";
import { focusOutlineWidth } from "../utilities/design-system";
import {
    HighContrastColor,
    highContrastDisabledForeground,
    highContrastHighlightBackground,
    highContrastHighlightForeground,
    highContrastLinkForeground,
    highContrastLinkValue,
    highContrastSelector,
    highContrastStealth,
} from "../utilities/high-contrast";

const styles: ComponentStyles<LightweightButtonClassNameContract, DesignSystem> = {
    ...baseButton,
    button: {
        ...buttonStyles(),
        padding: "0",
        border: "0",
        "justify-content": "flex-start",
        "background-color": "transparent",
        color: accentForegroundRest,
        fill: accentForegroundRest,
        ...applyFocusVisible({
            "border-color": "transparent",
            "box-shadow": "none",
            ...highContrastHighlightForeground,
            "& $button_contentRegion::before": {
                background: neutralForegroundRest,
                height: toPx<DesignSystem>(focusOutlineWidth),
                ...highContrastHighlightBackground,
            },
        }),
        "a&, button&": {},
        // Underline
        "& $button_contentRegion::before": {
            [highContrastSelector]: {
                background: HighContrastColor.buttonText,
            },
        },
        "&:hover $button_contentRegion::before": {
            background: accentForegroundHover,
            ...highContrastHighlightBackground,
        },
        "&:hover$button__disabled $button_contentRegion::before": {
            display: "none",
        },
        "&:active $button_contentRegion::before": {
            background: accentForegroundActive,
            ...highContrastHighlightBackground,
        },
        "&$button__disabled, &$button__disabled $button_contentRegion::before": {
            "background-color": "transparent",
            ...highContrastDisabledForeground,
        },
        "&:hover:enabled, a&:not($button__disabled):hover": {
            color: accentForegroundHover,
            fill: accentForegroundHover,
            "background-color": "transparent",
            ...highContrastHighlightForeground,
        },
        "&:active:enabled, a&:not($button__disabled):active": {
            color: accentForegroundActive,
            fill: accentForegroundActive,
            "background-color": "transparent",
        },
        ...highContrastStealth,
        "a&:not($button__disabled)": {
            [highContrastSelector]: {
                background: HighContrastColor.background,
                color: highContrastLinkValue,
                fill: highContrastLinkValue,
            },
            "&:not($button__disabled):hover": {
                ...highContrastLinkForeground,
            },
            // Underline
            "&:hover $button_contentRegion::before": {
                [highContrastSelector]: {
                    background: highContrastLinkValue,
                },
            },
            "& $button_contentRegion::before": {
                [highContrastSelector]: {
                    background: "transparent",
                },
            },
        },
    },
};

export default styles;
