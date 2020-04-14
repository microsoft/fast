import { ComponentStyles } from "@microsoft/fast-jss-manager";
import {
    ActionToggleClassNameContract,
    ButtonClassNameContract,
} from "@microsoft/fast-components-class-name-contracts-msft";
import { directionSwitch, important } from "@microsoft/fast-jss-utilities";
import { DesignSystem } from "../design-system/index";
import {
    accentForegroundActive,
    accentForegroundCut,
    accentForegroundHover,
    accentForegroundRest,
    neutralForegroundRest,
} from "../utilities/color";
import { glyphSize, horizontalSpacing } from "../utilities/density";
import {
    HighContrastColor,
    highContrastDisabledForeground,
    highContrastForeground,
    highContrastSelectedForeground,
    highContrastSelector,
} from "../utilities/high-contrast";

// Since MSFT button is already styled, we need to override in this way to alter button classes
export const actionToggleButtonOverrides: ComponentStyles<
    Partial<ButtonClassNameContract>,
    DesignSystem
> = {
    button: {
        "max-width": "100%",
        "min-width": "initial",
    },
    button_contentRegion: {
        "align-items": "center",
        display: "flex",
        transition: "all 600ms cubic-bezier(0.19, 1, 0.22, 1)",
    },
};

const styles: ComponentStyles<ActionToggleClassNameContract, DesignSystem> = {
    actionToggle: {
        "&:hover:enabled": {
            "& $actionToggle_glyph": {
                ...highContrastSelectedForeground,
            },
        },
        "&$actionToggle__justified, &$actionToggle__lightweight": {
            "&:hover:enabled": {
                "& $actionToggle_glyph": {
                    [highContrastSelector]: {
                        fill: important(HighContrastColor.selectedBackground),
                    },
                },
            },
        },
    },
    actionToggle_glyph: {
        ...highContrastForeground,
        display: "inline-block",
        position: "relative",
        width: glyphSize,
        height: glyphSize,
    },
    actionToggle__primary: {
        "& $actionToggle_glyph": {
            fill: accentForegroundCut,
            ...highContrastSelectedForeground,
        },
        "&:hover:enabled": {
            "& $actionToggle_glyph": {
                [highContrastSelector]: {
                    fill: important(HighContrastColor.selectedBackground),
                },
            },
        },
    },
    actionToggle__lightweight: {
        "& $actionToggle_glyph": {
            fill: accentForegroundRest,
        },
        "&:hover:enabled": {
            "& $actionToggle_glyph": {
                fill: accentForegroundHover,
            },
        },
        "&:active": {
            "& $actionToggle_glyph": {
                fill: accentForegroundActive,
            },
        },
    },
    actionToggle__justified: {
        "& $actionToggle_glyph": {
            fill: accentForegroundRest,
        },
        "&:hover:enabled": {
            "& $actionToggle_glyph": {
                fill: accentForegroundHover,
            },
        },
    },
    actionToggle__stealth: {
        "& $actionToggle_glyph": {
            fill: neutralForegroundRest,
        },
    },
    actionToggle__outline: {
        "& $actionToggle_glyph": {
            fill: neutralForegroundRest,
        },
    },
    actionToggle__disabled: {
        "& $actionToggle_glyph": {
            ...highContrastDisabledForeground,
        },
    },
    actionToggle__hasGlyphAndContent: {
        "& $actionToggle_glyph": {
            "margin-right": directionSwitch(horizontalSpacing(), ""),
            "margin-left": directionSwitch("", horizontalSpacing()),
        },
    },
};

export default styles;
