import { ComponentStyles, ComponentStyleSheet } from "@microsoft/fast-jss-manager";
import {
    ActionToggleClassNameContract,
    ButtonClassNameContract,
} from "@microsoft/fast-components-class-name-contracts-msft";
import {
    applyLocalizedProperty,
    Direction,
    directionSwitch,
} from "@microsoft/fast-jss-utilities";
import { DesignSystem, withDesignSystemDefaults } from "../design-system/index";
import {
    accentForegroundActive,
    accentForegroundCut,
    accentForegroundHover,
    accentForegroundRest,
    neutralForegroundRest,
} from "../utilities/color";
import { glyphSize, horizontalSpacing } from "../utilities/density";
import {
    applyHighContrastDisabledForeground,
    applyHighContrastForeground,
    applyHighContrastSelectedForeground,
    highContrastSelector,
} from "../utilities/high-contrast";

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
    actionToggle: {},
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
            ...applyHighContrastSelectedForeground,
        },
        "&:hover:enabled": {
            "& $actionToggle_selectedGlyph, & $actionToggle_unselectedGlyph": {
                [highContrastSelector]: {
                    fill: "Highlight",
                },
            },
        },
        "&$actionToggle__disabled $actionToggle_selectedGlyph, &$actionToggle__disabled $actionToggle_unselectedGlyph": {
            fill: accentForegroundCut,
            ...applyHighContrastDisabledForeground,
        },
    },
    actionToggle__lightweight: {
        "& $actionToggle_selectedGlyph, & $actionToggle_unselectedGlyph": {
            fill: accentForegroundRest,
            ...applyHighContrastForeground,
        },
        "&:hover:enabled": {
            "& $actionToggle_selectedGlyph, & $actionToggle_unselectedGlyph": {
                fill: accentForegroundHover,
                [highContrastSelector]: {
                    fill: "Highlight",
                },
            },
        },
        "&:active": {
            "& $actionToggle_selectedGlyph, & $actionToggle_unselectedGlyph": {
                fill: accentForegroundActive,
                ...applyHighContrastForeground,
            },
        },
        "&$actionToggle__disabled $actionToggle_selectedGlyph, &$actionToggle__disabled $actionToggle_unselectedGlyph": {
            fill: accentForegroundRest,
            ...applyHighContrastDisabledForeground,
        },
    },
    actionToggle__justified: {
        "& $actionToggle_selectedGlyph, & $actionToggle_unselectedGlyph": {
            fill: accentForegroundRest,
            ...applyHighContrastForeground,
        },
        "&:hover:enabled": {
            "& $actionToggle_selectedGlyph, & $actionToggle_unselectedGlyph": {
                fill: accentForegroundHover,
                [highContrastSelector]: {
                    fill: "Highlight",
                },
            },
        },
        "&$actionToggle__disabled $actionToggle_selectedGlyph, &$actionToggle__disabled $actionToggle_unselectedGlyph": {
            fill: accentForegroundRest,
            ...applyHighContrastDisabledForeground,
        },
    },
    actionToggle__stealth: {
        "& $actionToggle_selectedGlyph, & $actionToggle_unselectedGlyph": {
            fill: neutralForegroundRest,
            ...applyHighContrastForeground,
        },
        "&:hover": {
            "& $actionToggle_selectedGlyph, & $actionToggle_unselectedGlyph": {
                ...applyHighContrastSelectedForeground,
            },
        },
        "&$actionToggle__disabled $actionToggle_selectedGlyph, &$actionToggle__disabled $actionToggle_unselectedGlyph": {
            fill: neutralForegroundRest,
            ...applyHighContrastDisabledForeground,
        },
    },
    actionToggle__outline: {
        "& $actionToggle_selectedGlyph, & $actionToggle_unselectedGlyph": {
            fill: neutralForegroundRest,
            ...applyHighContrastForeground,
        },
        "&:hover": {
            "& $actionToggle_selectedGlyph, & $actionToggle_unselectedGlyph": {
                ...applyHighContrastSelectedForeground,
            },
        },
        "&$actionToggle__disabled $actionToggle_selectedGlyph, &$actionToggle__disabled $actionToggle_unselectedGlyph": {
            fill: neutralForegroundRest,
            ...applyHighContrastDisabledForeground,
        },
    },
    actionToggle__disabled: {
        "& $actionToggle_selectedGlyph, & $actionToggle_unselectedGlyph": {
            ...applyHighContrastDisabledForeground,
        },
    },
    actionToggle__hasGlyphAndContent: {
        "& $actionToggle_selectedGlyph, & $actionToggle_unselectedGlyph": {
            marginRight: directionSwitch(horizontalSpacing(), ""),
            marginLeft: directionSwitch("", horizontalSpacing()),
            fill: accentForegroundActive,
        },
    },
};

export default styles;
