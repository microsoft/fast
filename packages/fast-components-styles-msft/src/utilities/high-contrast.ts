import { CSSRules } from "@microsoft/fast-jss-manager";
import { DesignSystem } from "../design-system";
import { format, toPx } from "@microsoft/fast-jss-utilities";
import { focusOutlineWidth, outlineWidth } from "./design-system";

export const highContrastSelector: string = "@media (-ms-high-contrast:active)";

export enum HighContrastColor {
    text = "WindowText",
    hyperLinks = "LinkText",
    disabledText = "GrayText !important",
    selectedText = "HighlightText",
    selectedBackground = "Highlight",
    buttonText = "ButtonText",
    buttonBackground = "ButtonFace",
    background = "Background",
}

// Used to remove text backplate and borders in 'button-text' colors
export const highContrastStealth: CSSRules<DesignSystem> = {
    [highContrastSelector]: {
        background: HighContrastColor.buttonBackground,
        color: HighContrastColor.buttonText,
        fill: HighContrastColor.buttonText,
        border: "none",
        "-ms-high-contrast-adjust": "none",
    },
};

// Used to remove text backplate in 'button-text' colors
export const highContrastOutline: CSSRules<DesignSystem> = {
    [highContrastSelector]: {
        background: HighContrastColor.buttonBackground,
        borderColor: HighContrastColor.buttonText,
        color: HighContrastColor.buttonText,
        fill: HighContrastColor.buttonText,
        "-ms-high-contrast-adjust": "none",
    },
};

// Used to set a borderless component to disabled color
export const highContrastDisabled: CSSRules<DesignSystem> = {
    [highContrastSelector]: {
        opacity: "1",
        background: HighContrastColor.background,
        color: HighContrastColor.disabledText,
        fill: HighContrastColor.disabledText,
    },
};

// Used to set a components with border to disabled color
export const highContrastDisabledBorder: CSSRules<DesignSystem> = {
    [highContrastSelector]: {
        opacity: "1",
        background: "ButtonFace !important",
        borderColor: HighContrastColor.disabledText,
        color: HighContrastColor.disabledText,
        fill: HighContrastColor.disabledText,
    },
};

// Used to set foreground to disabled color
export const highContrastDisabledForeground: CSSRules<DesignSystem> = {
    [highContrastSelector]: {
        opacity: "1",
        color: HighContrastColor.disabledText,
        fill: HighContrastColor.disabledText,
    },
};

// Used to set focus with keyboard focus
export const highContrastOutlineFocus: CSSRules<DesignSystem> = {
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
export const highContrastDoubleFocus: CSSRules<DesignSystem> = {
    [highContrastSelector]: {
        borderColor: "ButtonText !important",
        boxShadow: format(
            "0 0 0 {0} inset {1}",
            toPx(focusOutlineWidth),
            () => HighContrastColor.buttonBackground
        ),
    },
};

// Used to set 'selected-text' color
export const highContrastSelection: CSSRules<DesignSystem> = {
    [highContrastSelector]: {
        background: HighContrastColor.selectedBackground,
        borderColor: HighContrastColor.buttonText,
        color: HighContrastColor.selectedText,
        fill: HighContrastColor.selectedText,
    },
};

// Used to set foreground and glyph to be 'button-text' color
export const highContrastForeground: CSSRules<DesignSystem> = {
    [highContrastSelector]: {
        color: "ButtonText !important",
        fill: "ButtonText !important",
    },
};

// Used to set borders to be 'text' color
export const highContrastBorder: CSSRules<DesignSystem> = {
    [highContrastSelector]: {
        border: format(
            "{0} solid {1}",
            toPx<DesignSystem>(outlineWidth),
            () => HighContrastColor.text
        ),
    },
};

// Used to set border color to be 'button-text' color
export const highContrastBorderColor: CSSRules<DesignSystem> = {
    [highContrastSelector]: {
        borderColor: HighContrastColor.buttonText,
    },
};

// Used to set background to be 'button-text' color
export const highContrastBackground: CSSRules<DesignSystem> = {
    [highContrastSelector]: {
        background: HighContrastColor.buttonText,
    },
};
