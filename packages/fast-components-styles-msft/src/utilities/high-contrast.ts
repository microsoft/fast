import { CSSRules } from "@microsoft/fast-jss-manager";
import { DesignSystem } from "../design-system";
import { format, toPx } from "@microsoft/fast-jss-utilities";
import { focusOutlineWidth, outlineWidth } from "./design-system";
import { importantValue } from "./important";

export const highContrastSelector: string = "@media (-ms-high-contrast:active)";

export enum HighContrastColor {
    text = "WindowText",
    hyperLinks = "Hotlight",
    disabledText = "GrayText",
    selectedText = "HighlightText",
    selectedBackground = "Highlight",
    buttonText = "ButtonText",
    buttonBackground = "ButtonFace",
    background = "Window",
}

// Function used to to opt-out of high contrast color scheme for '-ms' prefixes
export function applyhighContrastOptOutProperty(): CSSRules<{}> {
    return {
        "-ms-high-contrast-adjust": "none",
    };
}

// Used to to opt-out of high contrast color scheme
export const highContrastOptOutProperty: CSSRules<{}> = applyhighContrastOptOutProperty();

// Used to remove text backplate and borders in 'ButtonText' colors
export const highContrastStealth: CSSRules<DesignSystem> = {
    [highContrastSelector]: {
        background: HighContrastColor.buttonBackground,
        border: "none",
        color: HighContrastColor.buttonText,
        fill: HighContrastColor.buttonText,
        ...highContrastOptOutProperty
    },
};

// Used to remove text backplate in 'ButtonText' and 'ButtonFace' colors
export const highContrastOutline: CSSRules<DesignSystem> = {
    [highContrastSelector]: {
        background: HighContrastColor.buttonBackground,
        "border-color": HighContrastColor.buttonText,
        color: HighContrastColor.buttonText,
        fill: HighContrastColor.buttonText,
        ...highContrastOptOutProperty
    },
};

// Used to remove text backplate in 'HighlightText' and 'Highlight' colors
export const highContrastAccent: CSSRules<DesignSystem> = {
    [highContrastSelector]: {
        background: HighContrastColor.selectedBackground,
        "border-color": HighContrastColor.selectedBackground,
        color: HighContrastColor.selectedText,
        fill: HighContrastColor.selectedText,
        ...highContrastOptOutProperty
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

// Used to set focus with keyboard focus
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

// Used to set double focus with keyboard focus
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

// Used to set 'HighlightText' color
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

// Used to set 'Highlight' color with an outline
export const highContrastSelectedOutline: CSSRules<DesignSystem> = {
    [highContrastSelector]: {
        background: HighContrastColor.selectedText,
        "border-color": HighContrastColor.selectedBackground,
        color: HighContrastColor.selectedBackground,
        fill: HighContrastColor.selectedBackground,
    },
};

// Used to set foreground and glyph to be 'WindowText' color
export const highContrastTextForeground: CSSRules<DesignSystem> = {
    [highContrastSelector]: {
        color: importantValue(HighContrastColor.text),
        fill: importantValue(HighContrastColor.text),
    },
};

// Used to set foreground and glyph to be 'ButtonText' color
export const highContrastForeground: CSSRules<DesignSystem> = {
    [highContrastSelector]: {
        color: importantValue(HighContrastColor.buttonText),
        fill: importantValue(HighContrastColor.buttonText),
    },
};

// Used to set foreground and glyph to be 'HighlightText' color
export const highContrastSelectedForeground: CSSRules<DesignSystem> = {
    [highContrastSelector]: {
        color: importantValue(HighContrastColor.selectedText),
        fill: importantValue(HighContrastColor.selectedText),
    },
};

// Used to set foreground and glyph to be 'Highlight' color
export const highContrastHighlightForeground: CSSRules<DesignSystem> = {
    [highContrastSelector]: {
        color: importantValue(HighContrastColor.selectedBackground),
        fill: importantValue(HighContrastColor.selectedBackground),
    },
};

// Used to set borders to be 'WindowText' color
export const highContrastBorder: CSSRules<DesignSystem> = {
    [highContrastSelector]: {
        border: format(
            "{0} solid {1}",
            toPx<DesignSystem>(outlineWidth),
            () => HighContrastColor.text
        ),
    },
};

// Used to set border color to be 'ButtonText' color
export const highContrastBorderColor: CSSRules<DesignSystem> = {
    [highContrastSelector]: {
        "border-color": HighContrastColor.buttonText,
    },
};

// Used to set transparent background
export const highContrastTransparentBackground: CSSRules<DesignSystem> = {
    [highContrastSelector]: {
        background: "transparent",
    },
};

// Used to set background to be 'ButtonText' color
export const highContrastBackground: CSSRules<DesignSystem> = {
    [highContrastSelector]: {
        background: HighContrastColor.buttonText,
    },
};

// Used to set background to be 'HighlightText' color
export const highContrastSelectedBackground: CSSRules<DesignSystem> = {
    [highContrastSelector]: {
        background: HighContrastColor.selectedText,
    },
};

// Used to set background to be 'Highlight' color
export const highContrastHighlightBackground: CSSRules<DesignSystem> = {
    [highContrastSelector]: {
        background: HighContrastColor.selectedBackground,
    },
};

// Used to set background to be 'ButtonFace' and border to 'HighlightText'
export const highContrastButtonColorIndicator: CSSRules<DesignSystem> = {
    [highContrastSelector]: {
        opacity: "1",
        background: HighContrastColor.buttonBackground,
        "border-color": HighContrastColor.selectedText,
    },
}

// Used to set background to be 'Highlight' and border to 'HighlightText'
export const highContrastHighlightColorIndicator: CSSRules<DesignSystem> = {
    [highContrastSelector]: {
        opacity: "1",
        background: HighContrastColor.selectedBackground,
        "border-color": HighContrastColor.selectedText,
    },
}
