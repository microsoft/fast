import { CSSRules } from "@microsoft/fast-jss-manager";
import { format, important, toPx, add } from "@microsoft/fast-jss-utilities";
import { canUseForcedColors } from "@microsoft/fast-web-utilities";
import { DesignSystem } from "../design-system";
import { focusOutlineWidth, outlineWidth } from "./design-system";

export const highContrastSelector: string = "@media (-ms-high-contrast:active)";

export enum HighContrastColor {
    text = "WindowText",
    forcedColorLink = "LinkText",
    msLink = "-ms-hotlight",
    disabledText = "GrayText",
    selectedText = "HighlightText",
    selectedBackground = "Highlight",
    buttonText = "ButtonText",
    buttonBackground = "ButtonFace",
    background = "Window",
}

// Function used to to opt-out of high contrast color scheme for '-ms' prefixes
function applyhighContrastOptOutProperty(): CSSRules<{}> {
    return {
        "-ms-high-contrast-adjust": "none",
    };
}
// Used to to opt-out of high contrast color scheme
export const highContrastOptOutProperty: CSSRules<{}> = applyhighContrastOptOutProperty();

// Function used to to set link color base on 'forced-color' query
export function applyHighContrastLinkValue(): string {
    return canUseForcedColors() ? "LinkText !important" : "-ms-hotlight !important";
}
// Used to to set high contrast base on 'forced-color' query
export const highContrastLinkValue: string = applyHighContrastLinkValue();

// Used to remove text backplate and borders in 'ButtonText' colors
export const highContrastStealth: CSSRules<DesignSystem> = {
    [highContrastSelector]: {
        background: HighContrastColor.buttonBackground,
        border: "none",
        color: HighContrastColor.buttonText,
        fill: HighContrastColor.buttonText,
        ...highContrastOptOutProperty,
    },
};

// Used to remove text backplate in 'ButtonText' and 'ButtonFace' colors
export const highContrastOutline: CSSRules<DesignSystem> = {
    [highContrastSelector]: {
        background: HighContrastColor.buttonBackground,
        "border-color": HighContrastColor.buttonText,
        color: HighContrastColor.buttonText,
        fill: HighContrastColor.buttonText,
        ...highContrastOptOutProperty,
    },
};

// Used to remove text backplate in 'HighlightText' and 'Highlight' colors
export const highContrastAccent: CSSRules<DesignSystem> = {
    [highContrastSelector]: {
        background: HighContrastColor.selectedBackground,
        "border-color": HighContrastColor.selectedBackground,
        color: HighContrastColor.selectedText,
        fill: HighContrastColor.selectedText,
        ...highContrastOptOutProperty,
    },
};

// Used to set button with a border to 'link' color
export const highContrastLinkOutline: CSSRules<DesignSystem> = {
    [highContrastSelector]: {
        background: HighContrastColor.background,
        "border-color": highContrastLinkValue,
        color: highContrastLinkValue,
        fill: highContrastLinkValue,
    },
};

// Used to set a borderless component to disabled color
export const highContrastDisabled: CSSRules<DesignSystem> = {
    [highContrastSelector]: {
        opacity: "1",
        background: important(HighContrastColor.buttonBackground),
        color: important(HighContrastColor.disabledText),
        fill: important(HighContrastColor.disabledText),
    },
};

// Used to set a components with border to disabled color
export const highContrastDisabledBorder: CSSRules<DesignSystem> = {
    [highContrastSelector]: {
        opacity: "1",
        background: important(HighContrastColor.buttonBackground),
        color: important(HighContrastColor.disabledText),
        fill: important(HighContrastColor.disabledText),
        "border-color": important(HighContrastColor.disabledText),
    },
};

// Used to set foreground to disabled color
export const highContrastDisabledForeground: CSSRules<DesignSystem> = {
    [highContrastSelector]: {
        opacity: "1",
        color: important(HighContrastColor.disabledText),
        fill: important(HighContrastColor.disabledText),
    },
};

// Used to set background to disabled color
export const highContrastDisabledBackground: CSSRules<DesignSystem> = {
    [highContrastSelector]: {
        opacity: "1",
        background: important(HighContrastColor.disabledText),
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

// Used to apply a focus indicator outside of control bounds for smaller controls like checkbox and radio
export const highContrastDoubleOuterFocus: CSSRules<DesignSystem> = {
    [highContrastSelector]: {
        "box-shadow": format(
            `0 0 0 2px Background, 0 0 0 {0} {1}`,
            toPx(add(focusOutlineWidth, 2)),
            () => HighContrastColor.buttonText
        ),
    },
};

// Used to set double focus with keyboard focus
export const highContrastDoubleFocus: CSSRules<DesignSystem> = {
    [highContrastSelector]: {
        "border-color": important(HighContrastColor.buttonText),
        "box-shadow": format(
            "0 0 0 {0} inset {1}",
            toPx(focusOutlineWidth),
            () => HighContrastColor.buttonBackground
        ),
    },
};

// Used to set background to 'Highlight' foreground to 'HighlightText'
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
        color: important(HighContrastColor.text),
        fill: important(HighContrastColor.text),
    },
};

// Used to set foreground and glyph to be 'ButtonText' color
export const highContrastForeground: CSSRules<DesignSystem> = {
    [highContrastSelector]: {
        color: important(HighContrastColor.buttonText),
        fill: important(HighContrastColor.buttonText),
    },
};

// Used to set foreground and glyph to be 'HighlightText' color
export const highContrastSelectedForeground: CSSRules<DesignSystem> = {
    [highContrastSelector]: {
        color: important(HighContrastColor.selectedText),
        fill: important(HighContrastColor.selectedText),
    },
};

// Used to set foreground and glyph to be 'Highlight' color
export const highContrastHighlightForeground: CSSRules<DesignSystem> = {
    [highContrastSelector]: {
        color: important(HighContrastColor.selectedBackground),
        fill: important(HighContrastColor.selectedBackground),
    },
};

// Used to set foreground and glyph to be 'link' color
export const highContrastLinkForeground: CSSRules<DesignSystem> = {
    [highContrastSelector]: {
        color: highContrastLinkValue,
        fill: highContrastLinkValue,
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

// Used to set box-shadow border color to be 'link' color
export const highContrastLinkBorder: CSSRules<DesignSystem> = {
    [highContrastSelector]: {
        background: HighContrastColor.buttonBackground,
        "box-shadow": format(
            "0 0 0 {0} inset {1}",
            toPx(outlineWidth),
            () => highContrastLinkValue
        ),
    },
};

// Used to set background to be 'Window' color
export const highContrastColorBackground: CSSRules<DesignSystem> = {
    [highContrastSelector]: {
        background: HighContrastColor.background,
    },
};

// Used to set background to be 'ButtonText' color
export const highContrastBackground: CSSRules<DesignSystem> = {
    [highContrastSelector]: {
        background: HighContrastColor.buttonText,
    },
};

// Used to set background to be 'ButtonFace' color
export const highContrastButtonBackground: CSSRules<DesignSystem> = {
    [highContrastSelector]: {
        background: HighContrastColor.buttonBackground,
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

// Used to set background to be 'link' color
export const highContrastLinkBackground: CSSRules<DesignSystem> = {
    [highContrastSelector]: {
        background: highContrastLinkValue,
    },
};

// Used to set background to be 'ButtonFace' and border to 'HighlightText'
export const highContrastButtonColorIndicator: CSSRules<DesignSystem> = {
    [highContrastSelector]: {
        opacity: "1",
        background: HighContrastColor.buttonBackground,
        "border-color": HighContrastColor.selectedText,
    },
};

// Used to set background to be 'Highlight' and border to 'HighlightText'
export const highContrastHighlightColorIndicator: CSSRules<DesignSystem> = {
    [highContrastSelector]: {
        opacity: "1",
        background: HighContrastColor.selectedBackground,
        "border-color": HighContrastColor.selectedText,
    },
};
