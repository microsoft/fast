import { ComponentStyles } from "@microsoft/fast-jss-manager";
import {
    ActionToggleClassNameContract,
    ButtonClassNameContract,
} from "@microsoft/fast-components-class-name-contracts-msft";
import { directionSwitch } from "@microsoft/fast-jss-utilities";
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
import { importantValue } from "../utilities/important";

// Since MSFT button is already styled, we need to override in this way to alter button classes
export const actionToggleButtonOverrides: ComponentStyles<
    Partial<ButtonClassNameContract>,
    DesignSystem
> = {
    button: {
        maxWidth: "100%",
        minWidth: "initial",
    },
    button_contentRegion: {
        alignItems: "center",
        display: "flex",
        transition: "all 600ms cubic-bezier(0.19, 1, 0.22, 1)",
    },
};

const styles: ComponentStyles<ActionToggleClassNameContract, DesignSystem> = {
    actionToggle: {
        "& $actionToggle_selectedGlyph, & $actionToggle_unselectedGlyph": {
            ...highContrastForeground,
        },
        "&:hover:enabled": {
            "& $actionToggle_selectedGlyph, & $actionToggle_unselectedGlyph": {
                ...highContrastSelectedForeground,
            },
        },
        [`&$actionToggle__justified, &$actionToggle__lightweight`]: {
            "&:hover:enabled": {
                "& $actionToggle_selectedGlyph, & $actionToggle_unselectedGlyph": {
                    [highContrastSelector]: {
                        fill: importantValue(HighContrastColor.selectedBackground),
                    },
                },
            },
        },
    },
    actionToggle__selected: {},
    actionToggle_selectedGlyph: {
        display: "inline-block",
        position: "relative",
        width: glyphSize,
        height: glyphSize,
    },
    actionToggle_unselectedGlyph: {
        display: "inline-block",
        position: "relative",
        width: glyphSize,
        height: glyphSize,
    },
    actionToggle__primary: {
        "& $actionToggle_selectedGlyph, & $actionToggle_unselectedGlyph": {
            fill: accentForegroundCut,
            ...highContrastSelectedForeground,
        },
        "&:hover:enabled": {
            "& $actionToggle_selectedGlyph, & $actionToggle_unselectedGlyph": {
                [highContrastSelector]: {
                    fill: importantValue(HighContrastColor.selectedBackground),
                },
            },
        },
        "&$actionToggle__disabled $actionToggle_selectedGlyph, &$actionToggle__disabled $actionToggle_unselectedGlyph": {
            fill: accentForegroundCut,
        },
    },
    actionToggle__lightweight: {
        "& $actionToggle_selectedGlyph, & $actionToggle_unselectedGlyph": {
            fill: accentForegroundRest,
        },
        "&:hover:enabled": {
            "& $actionToggle_selectedGlyph, & $actionToggle_unselectedGlyph": {
                fill: accentForegroundHover,
            },
        },
        "&:active": {
            "& $actionToggle_selectedGlyph, & $actionToggle_unselectedGlyph": {
                fill: accentForegroundActive,
            },
        },
        "&$actionToggle__disabled $actionToggle_selectedGlyph, &$actionToggle__disabled $actionToggle_unselectedGlyph": {
            fill: accentForegroundRest,
        },
    },
    actionToggle__justified: {
        "& $actionToggle_selectedGlyph, & $actionToggle_unselectedGlyph": {
            fill: accentForegroundRest,
        },
        "&:hover:enabled": {
            "& $actionToggle_selectedGlyph, & $actionToggle_unselectedGlyph": {
                fill: accentForegroundHover,
            },
        },
        "&$actionToggle__disabled $actionToggle_selectedGlyph, &$actionToggle__disabled $actionToggle_unselectedGlyph": {
            fill: accentForegroundRest,
        },
    },
    actionToggle__stealth: {
        "& $actionToggle_selectedGlyph, & $actionToggle_unselectedGlyph": {
            fill: neutralForegroundRest,
        },
        "&:hover": {
            "& $actionToggle_selectedGlyph, & $actionToggle_unselectedGlyph": {},
        },
        "&$actionToggle__disabled $actionToggle_selectedGlyph, &$actionToggle__disabled $actionToggle_unselectedGlyph": {
            fill: neutralForegroundRest,
        },
    },
    actionToggle__outline: {
        "& $actionToggle_selectedGlyph, & $actionToggle_unselectedGlyph": {
            fill: neutralForegroundRest,
        },
        "&$actionToggle__disabled $actionToggle_selectedGlyph, &$actionToggle__disabled $actionToggle_unselectedGlyph": {
            fill: neutralForegroundRest,
        },
    },
    actionToggle__disabled: {
        "& $actionToggle_selectedGlyph, & $actionToggle_unselectedGlyph": {
            ...highContrastDisabledForeground,
        },
    },
    actionToggle__hasGlyphAndContent: {
        "& $actionToggle_selectedGlyph, & $actionToggle_unselectedGlyph": {
            "margin-right": directionSwitch(horizontalSpacing(), ""),
            "margin-left": directionSwitch("", horizontalSpacing()),
        },
    },
};

export default styles;
