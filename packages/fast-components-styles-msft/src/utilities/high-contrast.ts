import { CSSRules } from "@microsoft/fast-jss-manager";
import { DesignSystem } from "../design-system";
import { format, toPx } from "@microsoft/fast-jss-utilities";
import { focusOutlineWidth, outlineWidth } from "./design-system";

enum HighContrastColor {
    text = "WindowText",
    hyperLinks = "LinkText",
    disabledText = "GrayText",
    selectedText = "HighlightText",
    selectedBackground = "Highlight",
    buttonText = "ButtonText",
    buttonBackground = "ButtonFace",
    background = "Background",
}

export const highContrastSelector: string = "@media (-ms-high-contrast:active)";

export function applyHighContrastAdjustStealth(): CSSRules<DesignSystem> {
    return {
        [highContrastSelector]: {
            background: HighContrastColor.buttonBackground,
            color: HighContrastColor.buttonText,
            fill: HighContrastColor.buttonText,
            border: "none",
            "-ms-high-contrast-adjust": "none",
        },
    };
}

export function applyHighContrastAdjustOutline(): CSSRules<DesignSystem> {
    return {
        [highContrastSelector]: {
            background: HighContrastColor.buttonBackground,
            borderColor: HighContrastColor.buttonText,
            color: HighContrastColor.buttonText,
            fill: HighContrastColor.buttonText,
            "-ms-high-contrast-adjust": "none",
        },
    };
}

export function applyHighContrastBorder(): CSSRules<DesignSystem> {
    return {
        [highContrastSelector]: {
            background: HighContrastColor.buttonBackground,
            border: format("{0} solid ButtonText", toPx<DesignSystem>(outlineWidth)),
        },
    };
}

export function applyHighContrastAdjustSelectOutline(): CSSRules<DesignSystem> {
    return {
        [highContrastSelector]: {
            background: HighContrastColor.selectedBackground,
            borderColor: HighContrastColor.selectedBackground,
            color: HighContrastColor.selectedText,
            "-ms-high-contrast-adjust": "none",
        },
    };
}

export function applyHighContrastDisabled(): CSSRules<DesignSystem> {
    return {
        [highContrastSelector]: {
            opacity: "1",
            background: HighContrastColor.background,
            color: HighContrastColor.disabledText,
            fill: HighContrastColor.disabledText,
        },
    };
}

export function applyHighContrastDisabledBorder(): CSSRules<DesignSystem> {
    return {
        [highContrastSelector]: {
            opacity: "1",
            background: HighContrastColor.background,
            borderColor: HighContrastColor.disabledText,
            color: HighContrastColor.disabledText,
            fill: HighContrastColor.disabledText,
        },
    };
}

export function applyHighContrastDisabledColor(): CSSRules<DesignSystem> {
    return {
        [highContrastSelector]: {
            opacity: "1",
            color: HighContrastColor.disabledText,
        },
    };
}

export function applyHighContrastDisabledFill(): CSSRules<DesignSystem> {
    return {
        [highContrastSelector]: {
            fill: HighContrastColor.disabledText,
        },
    };
}

export function applyHighContrastDisabledBackground(): CSSRules<DesignSystem> {
    return {
        [highContrastSelector]: {
            background: HighContrastColor.background,
        },
    };
}

export function applyHighContrastHyperLink(): CSSRules<DesignSystem> {
    return {
        [highContrastSelector]: {
            color: HighContrastColor.hyperLinks,
            "&:hover": {
                background: HighContrastColor.selectedBackground,
                color: HighContrastColor.selectedText,
            },
        },
    };
}

export function applyHighContrastBorderOnlyFocus(): CSSRules<DesignSystem> {
    return {
        [highContrastSelector]: {
            borderColor: HighContrastColor.buttonText,
        },
    };
}

export function applyHighContrastInsetFocus(): CSSRules<DesignSystem> {
    return {
        [highContrastSelector]: {
            borderColor: HighContrastColor.buttonText,
            boxShadow: format("0 0 0 {0} inset ButtonText", toPx(outlineWidth)),
        },
    };
}

export function applyHighContrastDoubleFocus(): CSSRules<DesignSystem> {
    return {
        [highContrastSelector]: {
            borderColor: HighContrastColor.buttonText,
            boxShadow: format("0 0 0 {0} inset ButtonFace", toPx(focusOutlineWidth)),
        },
    };
}

export function applyHighContrastSelectFocus(): CSSRules<DesignSystem> {
    return {
        [highContrastSelector]: {
            background: HighContrastColor.selectedBackground,
            color: HighContrastColor.selectedText,
        },
    };
}

export function applyHighContrastAccentSelectedHover(): CSSRules<DesignSystem> {
    return {
        [highContrastSelector]: {
            background: HighContrastColor.selectedText,
            borderColor: HighContrastColor.selectedBackground,
            color: HighContrastColor.selectedBackground,
        },
    };
}

export function applyHighContrastAccentSelectedFillHover(): CSSRules<DesignSystem> {
    return {
        [highContrastSelector]: {
            fill: HighContrastColor.selectedBackground,
        },
    };
}

export function applyHighContrastSelectedHover(): CSSRules<DesignSystem> {
    return {
        [highContrastSelector]: {
            background: HighContrastColor.selectedBackground,
            borderColor: HighContrastColor.buttonText,
            color: HighContrastColor.selectedText,
            fill: HighContrastColor.selectedText,
        },
    };
}

export function applyHighContrastSelectedFillHover(): CSSRules<DesignSystem> {
    return {
        [highContrastSelector]: {
            fill: HighContrastColor.selectedText,
        },
    };
}

export function applyHighContrastColorFill(): CSSRules<DesignSystem> {
    return {
        [highContrastSelector]: {
            color: HighContrastColor.buttonText,
            fill: HighContrastColor.buttonText,
        },
    };
}

export function applyHighContrastSelectedColorFill(): CSSRules<DesignSystem> {
    return {
        [highContrastSelector]: {
            color: HighContrastColor.selectedText,
            fill: HighContrastColor.selectedText,
        },
    };
}

export function applyHighContrastTextBorder(): CSSRules<DesignSystem> {
    return {
        [highContrastSelector]: {
            border: format("{0} solid WindowText", toPx<DesignSystem>(outlineWidth)),
        },
    };
}
