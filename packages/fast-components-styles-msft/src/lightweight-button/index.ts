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
    applyHighContrastColorFill,
    applyHighContrastDisabledColor,
    applyHighContrastHyperLink,
    highContrastSelector
} from "../utilities/high-contrast";

const styles: ComponentStyles<LightweightButtonClassNameContract, DesignSystem> = {
    ...baseButton,
    button: {
        ...buttonStyles(),
        padding: "0",
        border: "0",
        justifyContent: "flex-start",
        backgroundColor: "transparent",
        color: accentForegroundRest,
        fill: accentForegroundRest,
        ...applyFocusVisible({
            borderColor: "transparent",
            boxShadow: "none",
            "& $button_contentRegion::before": {
                background: neutralForegroundRest,
                height: toPx<DesignSystem>(focusOutlineWidth),
                [highContrastSelector]: {
                    background: "ButtonText",
                    height: toPx<DesignSystem>(focusOutlineWidth),
                },
            },
        }),
        "a&, button&": {},
        // Underline
        "&:hover $button_contentRegion::before": {
            background: accentForegroundHover,
            [highContrastSelector]: {
                background: "ButtonText",
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
        [highContrastSelector]: {
            border: "none",
            fill: "ButtonText",
        },
        "&:hover:enabled": {
            color: accentForegroundHover,
            fill: accentForegroundHover,
            backgroundColor: "transparent",
            ...applyHighContrastColorFill(),
        },
        "&:active:enabled": {
            color: accentForegroundActive,
            fill: accentForegroundActive,
            backgroundColor: "transparent",
        },
        "a&": {
            ...applyHighContrastHyperLink(),
            "&$button__disabled": {
                "&:hover": {
                    "& $button_contentRegion": {
                        ...applyHighContrastDisabledColor()
                    },
                },
            },
        },
    },
};

export default styles;
