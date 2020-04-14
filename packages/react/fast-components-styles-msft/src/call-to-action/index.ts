import { ComponentStyles, CSSRules } from "@microsoft/fast-jss-manager";
import {
    ButtonClassNameContract,
    CallToActionClassNameContract,
} from "@microsoft/fast-components-class-name-contracts-msft";
import {
    applyFocusVisible,
    directionSwitch,
    format,
    multiply,
    toPx,
} from "@microsoft/fast-jss-utilities";
import { DesignSystem, DesignSystemResolver } from "../design-system";
import {
    accentForegroundActive,
    accentForegroundCut,
    accentForegroundHover,
    accentForegroundRest,
    neutralForegroundRest,
} from "../utilities/color";
import { glyphSize } from "../utilities/density";
import { designUnit } from "../utilities/design-system";
import {
    highContrastDisabledForeground,
    highContrastForeground,
    highContrastHighlightForeground,
    highContrastLinkForeground,
    highContrastOptOutProperty,
    highContrastSelectedForeground,
    highContrastSelector,
} from "../utilities/high-contrast";

function applyContentRegionTransform(): CSSRules<DesignSystem> {
    return {
        transform: format(
            "translateX({0})",
            toPx(multiply(designUnit, directionSwitch(-1, 1)))
        ),
    };
}

function applyGlyphTransform(): CSSRules<DesignSystem> {
    return {
        transform: directionSwitch(
            format("translateX({0})", toPx(designUnit)),
            format("rotate(180deg) translateX({0})", toPx(designUnit))
        ),
        position: "relative",
    };
}

// Since MSFT button is already styled, we need to override in this way to alter button classes
export const callToActionButtonOverrides: ComponentStyles<
    Partial<ButtonClassNameContract>,
    DesignSystem
> = {
    button: {
        "max-width": "100%",
        "&:hover": {
            "& $button_contentRegion": {
                ...applyContentRegionTransform(),
            },
        },
    },
    button_contentRegion: {
        transition: "all 600ms cubic-bezier(0.19, 1, 0.22, 1)",
    },
    button__justified: {
        "&:hover": {
            "& $button_contentRegion": {
                transform: "none",
            },
        },
    },
    button__disabled: {
        "&:hover": {
            "& $button_contentRegion": {
                transform: "none",
            },
        },
    },
};

const translateXValue: DesignSystemResolver<string> = toPx(designUnit);
const styles: ComponentStyles<CallToActionClassNameContract, DesignSystem> = {
    callToAction: {
        transition: "all 0.2s ease-in-out",
        display: "inline-flex",
        "max-width": "100%",
        "line-height": "1",
        "text-decoration": "none",
        "white-space": "nowrap",
        "&:hover": {
            "& $callToAction_glyph": {
                ...applyGlyphTransform(),
                ...highContrastSelectedForeground,
            },
        },
        ...applyFocusVisible("& $callToAction_glyph", {
            ...applyGlyphTransform(),
        }),
        [highContrastSelector]: {
            ...highContrastOptOutProperty,
        },
    },
    callToAction_glyph: {
        fill: neutralForegroundRest,
        display: "inline-block",
        position: "relative",
        width: glyphSize,
        height: glyphSize,
        "margin-left": directionSwitch("6px", ""),
        "margin-right": directionSwitch("", "6px"),
        transform: directionSwitch("none", "rotate(180deg)"),
        transition: "all 600ms cubic-bezier(0.19, 1, 0.22, 1)",
        ...highContrastForeground,
    },
    callToAction__primary: {
        "& $button_contentRegion, $callToAction_glyph": {
            fill: accentForegroundCut,
            ...highContrastSelectedForeground,
        },
        "&:hover": {
            "& $callToAction_glyph": {
                ...highContrastHighlightForeground,
            },
            "a&": {
                [highContrastSelector]: {
                    "box-shadow": "none !important",
                },
            },
        },
        "a& $button_contentRegion, a& $callToAction_glyph, a&:hover $button_contentRegion, a&:hover $callToAction_glyph": {
            ...highContrastLinkForeground,
        },
    },
    callToAction__lightweight: {
        "& $callToAction_glyph": {
            fill: accentForegroundRest,
        },
        "&:hover": {
            "& $callToAction_glyph": {
                fill: accentForegroundHover,
                ...highContrastHighlightForeground,
            },
        },
        "&:active": {
            "& $callToAction_glyph": {
                fill: accentForegroundActive,
            },
        },
    },
    callToAction__justified: {
        "padding-right": directionSwitch(translateXValue, ""),
        "padding-left": directionSwitch("", translateXValue),
        "& $callToAction_glyph": {
            fill: accentForegroundRest,
        },
        "&:hover": {
            "& $callToAction_glyph": {
                fill: accentForegroundHover,
                ...highContrastHighlightForeground,
            },
        },
        "&:active": {},
    },
    callToAction__outline: {},
    callToAction__stealth: {},
    callToAction__disabled: {
        "& $callToAction_glyph": {
            ...highContrastDisabledForeground,
        },
        "&:hover": {
            "& $callToAction_glyph": {
                transform: "none",
                ...highContrastDisabledForeground,
            },
        },
    },
};

export default styles;
