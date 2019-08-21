import { ButtonBaseClassNameContract as LightweightButtonClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";
import { ComponentStyles, CSSRules } from "@microsoft/fast-jss-manager";
import { DesignSystem } from "../design-system";
import { baseButton, buttonStyles } from "../patterns/button";
import {
    accentForegroundActive,
    accentForegroundHover,
    accentForegroundRest,
    neutralForegroundRest,
} from "../utilities/color";
import { applyFocusVisible, toPx } from "@microsoft/fast-jss-utilities";
import { focusOutlineWidth } from "../utilities/design-system";
import {
    highContrastBackground,
    highContrastDisabledForeground,
    highContrastSelector,
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
            "& $button_contentRegion::before": {
                background: neutralForegroundRest,
                height: toPx<DesignSystem>(focusOutlineWidth),
                ...highContrastBackground,
            },
        }),
        "a&, button&": {},
        // Underline
        "&:hover $button_contentRegion::before": {
            background: accentForegroundHover,
            ...highContrastBackground,
        },
        "&:hover$button__disabled $button_contentRegion::before": {
            display: "none",
        },
        "&:active $button_contentRegion::before": {
            background: accentForegroundActive,
        },
        "&$button__disabled, &$button__disabled $button_contentRegion::before": {
            "background-color": "transparent",
            ...highContrastDisabledForeground,
        },
        "&:hover:enabled": {
            color: accentForegroundHover,
            fill: accentForegroundHover,
            "background-color": "transparent",
            [highContrastSelector]: {
                fill: "Highlight",
            },
        },
        "&:active:enabled": {
            color: accentForegroundActive,
            fill: accentForegroundActive,
            "background-color": "transparent",
        },
        [highContrastSelector]: {
            border: "none",
            fill: "ButtonText",
        },
        "a&": {
            "&$button__disabled": {
                ...highContrastDisabledForeground,
            },
        },
    },
};

export default styles;
