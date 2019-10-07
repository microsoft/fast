import { CSSRules } from "@microsoft/fast-jss-manager";
import { DesignSystem } from "../design-system";
import { format, toPx } from "@microsoft/fast-jss-utilities";
import { focusOutlineWidth, outlineWidth } from "./design-system";
import { importantValue } from "./important";

export enum HighContrastColor {
    text = "WindowText",
    hyperLinks = "LinkText",
    disabledText = "GrayText",
    selectedText = "HighlightText",
    selectedBackground = "Highlight",
    buttonText = "ButtonText",
    buttonBackground = "ButtonFace",
    background = "Canvas",
}

// Function used to to set high contrast media query
export function applyHighContrastSelector(): string {
    return window.matchMedia("(forced-colors: none)").matches ||
        window.matchMedia("(forced-colors: active)").matches
        ? "@media (forced-colors: active)"
        : "@media (-ms-high-contrast: active)";
}

// Used to to set high contrast media query
export const highContrastSelector: string = applyHighContrastSelector();

// Function used to to opt-out of high contrast color scheme for 'forced-colors' and '-ms' prefixes
export function applyhighContrastOptOutProperty(): CSSRules<{}> {
    return {
        "-ms-high-contrast-adjust": "none",
        "forced-color-adjust": "none",
    };
}

// Used to to opt-out of high contrast color scheme
export const highContrastOptOutProperty: CSSRules<{}> = applyhighContrastOptOutProperty();

// Used to remove text backplate and borders in 'button-text' colors
export const highContrastStealth: CSSRules<DesignSystem> = {
    [highContrastSelector]: {
        background: HighContrastColor.buttonBackground,
        border: "none",
        color: HighContrastColor.buttonText,
        fill: HighContrastColor.buttonText,
        ...highContrastOptOutProperty,
    },
};

// Used to remove text backplate in 'button-text' and 'button-background' colors
export const highContrastOutline: CSSRules<DesignSystem> = {
    [highContrastSelector]: {
        background: HighContrastColor.buttonBackground,
        "border-color": HighContrastColor.buttonText,
        color: HighContrastColor.buttonText,
        fill: HighContrastColor.buttonText,
        ...highContrastOptOutProperty,
    },
};

// Used to remove text backplate in 'select-text' and 'selected-background' colors
export const highContrastAccent: CSSRules<DesignSystem> = {
    [highContrastSelector]: {
        background: HighContrastColor.selectedBackground,
        "border-color": HighContrastColor.selectedBackground,
        color: HighContrastColor.selectedText,
        fill: HighContrastColor.selectedText,
        ...highContrastOptOutProperty,
    },
};

// Used to set a borderless component to disabled color
export const highContrastDisabled: CSSRules<DesignSystem> = {
    [highContrastSelector]: {
        opacity: "1",
        background: importantValue(HighContrastColor.buttonBackground),
        color: importantValue(HighContrastColor.disabledText),
        fill: importantValue(HighContrastColor.disabledText),
    },
};

// Used to set a components with border to disabled color
export const highContrastDisabledBorder: CSSRules<DesignSystem> = {
    [highContrastSelector]: {
        opacity: "1",
        background: importantValue(HighContrastColor.buttonBackground),
        color: importantValue(HighContrastColor.disabledText),
        fill: importantValue(HighContrastColor.disabledText),
        "border-color": importantValue(HighContrastColor.disabledText),
    },
};

// Used to set foreground to disabled color
export const highContrastDisabledForeground: CSSRules<DesignSystem> = {
    [highContrastSelector]: {
        opacity: "1",
        color: importantValue(HighContrastColor.disabledText),
        fill: importantValue(HighContrastColor.disabledText),
    },
};

// Used to set background to disabled color
export const highContrastDisabledBackground: CSSRules<DesignSystem> = {
    [highContrastSelector]: {
        opacity: "1",
        background: importantValue(HighContrastColor.disabledText),
    },
};

// Used to set focus for keyboard focus
export const highContrastOutlineFocus: CSSRules<DesignSystem> = {
    [highContrastSelector]: {
        "border-color": HighContrastColor.buttonText,
        "box-shadow": format(
            "0 0 0 {0} inset {1}",
            toPx(outlineWidth),
            () => HighContrastColor.buttonText
        ),
    },
};

// Used to set double focus for keyboard focus
export const highContrastDoubleFocus: CSSRules<DesignSystem> = {
    [highContrastSelector]: {
        "border-color": importantValue(HighContrastColor.buttonText),
        "box-shadow": format(
            "0 0 0 {0} inset {1}",
            toPx(focusOutlineWidth),
            () => HighContrastColor.buttonBackground
        ),
    },
};

// Used to set 'selected-text' on foreground and 'selected-background' on background
export const highContrastSelected: CSSRules<DesignSystem> = {
    [highContrastSelector]: {
        background: HighContrastColor.selectedBackground,
        color: HighContrastColor.selectedText,
        fill: HighContrastColor.selectedText,
    },
};
/**
 * @deprecated Use 'highContrastSelected' instead
 */
export const highContrastSelection: CSSRules<DesignSystem> = highContrastSelected;

// Used to set 'selected-background' on foreground and 'selected-text' on background with an outline
export const highContrastSelectedOutline: CSSRules<DesignSystem> = {
    [highContrastSelector]: {
        background: HighContrastColor.selectedText,
        "border-color": HighContrastColor.selectedBackground,
        color: HighContrastColor.selectedBackground,
        fill: HighContrastColor.selectedBackground,
    },
};

// Used to set foreground and glyph to be 'button-text' color
export const highContrastForeground: CSSRules<DesignSystem> = {
    [highContrastSelector]: {
        color: importantValue(HighContrastColor.buttonText),
        fill: importantValue(HighContrastColor.buttonText),
    },
};

// Used to set foreground and glyph to be 'select-text' color
export const highContrastSelectedForeground: CSSRules<DesignSystem> = {
    [highContrastSelector]: {
        color: importantValue(HighContrastColor.selectedText),
        fill: importantValue(HighContrastColor.selectedText),
    },
};

// Used to set foreground and glyph to be 'highlight' color
export const highContrastHighlightForeground: CSSRules<DesignSystem> = {
    [highContrastSelector]: {
        color: importantValue(HighContrastColor.selectedBackground),
        fill: importantValue(HighContrastColor.selectedBackground),
    },
};

// Used to set foreground and glyph to be 'text' color
export const highContrastTextForeground: CSSRules<DesignSystem> = {
    [highContrastSelector]: {
        color: importantValue(HighContrastColor.text),
        fill: importantValue(HighContrastColor.text),
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
        "border-color": HighContrastColor.buttonText,
    },
};

// Used to set background to be 'button-text' color
export const highContrastBackground: CSSRules<DesignSystem> = {
    [highContrastSelector]: {
        background: HighContrastColor.buttonText,
    },
};

// Used to set background to be 'selected-text' color
export const highContrastSelectedBackground: CSSRules<DesignSystem> = {
    [highContrastSelector]: {
        background: HighContrastColor.selectedText,
    },
};

// Used to set background to be 'highlight' color
export const highContrastHighlightBackground: CSSRules<DesignSystem> = {
    [highContrastSelector]: {
        background: HighContrastColor.selectedBackground,
    },
};
