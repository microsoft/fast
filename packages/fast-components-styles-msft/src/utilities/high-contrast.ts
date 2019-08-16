import { CSSRules } from "@microsoft/fast-jss-manager";
import { DesignSystem } from "../design-system";
import { format, toPx } from "@microsoft/fast-jss-utilities";
import { focusOutlineWidth, outlineWidth } from "./design-system";

export const highContrastSelector: string = "@media (-ms-high-contrast:active)";

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

// Used to remove text backplate and borders in 'button-text' colors
export const applyHighContrastAdjustStealth: CSSRules<DesignSystem> = {
    [highContrastSelector]: {
        background: HighContrastColor.buttonBackground,
        color: HighContrastColor.buttonText,
        fill: HighContrastColor.buttonText,
        border: "none",
        "-ms-high-contrast-adjust": "none",
    },
};

// Used to remove text backplate in 'button-text' colors
export const applyHighContrastAdjustOutline: CSSRules<DesignSystem> = {
    [highContrastSelector]: {
        background: HighContrastColor.buttonBackground,
        borderColor: HighContrastColor.buttonText,
        color: HighContrastColor.buttonText,
        fill: HighContrastColor.buttonText,
        "-ms-high-contrast-adjust": "none",
    },
};

// Used to remove text backplate in 'selected-text' colors
export const applyHighContrastSelected: CSSRules<DesignSystem> = {
    [highContrastSelector]: {
        background: HighContrastColor.selectedBackground,
        borderColor: HighContrastColor.selectedBackground,
        color: HighContrastColor.selectedText,
        "-ms-high-contrast-adjust": "none",
    },
};

// Used to set a borderless component to disabled color
export const applyHighContrastDisabled: CSSRules<DesignSystem> = {
    [highContrastSelector]: {
        opacity: "1",
        background: HighContrastColor.background,
        color: HighContrastColor.disabledText,
        fill: HighContrastColor.disabledText,
    },
};

// Used to set a components with border to disabled color
export const applyHighContrastDisabledBorder: CSSRules<DesignSystem> = {
    [highContrastSelector]: {
        opacity: "1",
        background: HighContrastColor.background,
        borderColor: HighContrastColor.disabledText,
        color: HighContrastColor.disabledText,
        fill: HighContrastColor.disabledText,
    },
};
// Used to set foreground to disabled color
export const applyHighContrastDisabledForeground: CSSRules<DesignSystem> = {
    [highContrastSelector]: {
        opacity: "1",
        color: HighContrastColor.disabledText,
        fill: HighContrastColor.disabledText,
    },
};

// Used to set background to disabled color
export const applyHighContrastDisabledBackground: CSSRules<DesignSystem> = {
    [highContrastSelector]: {
        background: HighContrastColor.disabledText,
    },
};

// Used to set anchors to 'hyper-link' color with 'selected-text' colors on hover
export const applyHighContrastHyperLink: CSSRules<DesignSystem> = {
    [highContrastSelector]: {
        color: HighContrastColor.hyperLinks,
        "&:hover": {
            background: HighContrastColor.selectedBackground,
            color: HighContrastColor.selectedText,
        },
    },
};

// Used to set focus with keyboard focus
export const applyHighContrastOutlineFocus: CSSRules<DesignSystem> = {
    [highContrastSelector]: {
        borderColor: HighContrastColor.buttonText,
        boxShadow: format(
            "0 0 0 {0} inset {1}",
            toPx(outlineWidth),
            () => HighContrastColor.buttonText
        ),
    },
};

// Used to set double focus with keyboard focus
export const applyHighContrastDoubleFocus: CSSRules<DesignSystem> = {
    [highContrastSelector]: {
        borderColor: HighContrastColor.buttonText,
        boxShadow: format(
            "0 0 0 {0} inset {1}",
            toPx(focusOutlineWidth),
            () => HighContrastColor.buttonBackground
        ),
    },
};

// Used to set 'selected-text' color theme
export const applyHighContrastSelection: CSSRules<DesignSystem> = {
    [highContrastSelector]: {
        background: HighContrastColor.selectedBackground,
        borderColor: HighContrastColor.buttonText,
        color: HighContrastColor.selectedText,
        fill: HighContrastColor.selectedText,
    },
};

// Used to set foreground and glyph to use 'button-text' color
export const applyHighContrastForeground: CSSRules<DesignSystem> = {
    [highContrastSelector]: {
        color: HighContrastColor.buttonText,
        fill: HighContrastColor.buttonText,
    },
};

// Used to set foreground and glyph to use 'selected-text' color
export const applyHighContrastSelectedForeground: CSSRules<DesignSystem> = {
    [highContrastSelector]: {
        color: HighContrastColor.selectedText,
        fill: HighContrastColor.selectedText,
    },
};

// Used to set borders to use 'text' color
export const applyHighContrastTextBorder: CSSRules<DesignSystem> = {
    [highContrastSelector]: {
        border: format(
            "{0} solid {1}",
            toPx<DesignSystem>(outlineWidth),
            () => HighContrastColor.text
        ),
    },
};

// Used to set borders to use 'button-text' color
export const applyHighContrastBorder: CSSRules<DesignSystem> = {
    [highContrastSelector]: {
        background: HighContrastColor.buttonBackground,
        border: format(
            "{0} solid {1}",
            toPx<DesignSystem>(outlineWidth),
            () => HighContrastColor.buttonText
        ),
    },
};
