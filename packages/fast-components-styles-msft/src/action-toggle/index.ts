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
        },
        "&$actionToggle__disabled $actionToggle_selectedGlyph, &$actionToggle__disabled $actionToggle_unselectedGlyph": {
            fill: accentForegroundCut,
        },
    },
    actionToggle__lightweight: {
        "& $actionToggle_selectedGlyph, & $actionToggle_unselectedGlyph": {
            fill: accentForegroundRest,
        },
        "&:hover": {
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
        "&:hover": {
            "& $actionToggle_selectedGlyph, & $actionToggle_unselectedGlyph": {
                fill: accentForegroundHover,
            },
        },
        actionToggle__stealth: {
            "& $actionToggle_selectedGlyph, & $actionToggle_unselectedGlyph": {
                fill: neutralForegroundRest,
            },
            "&$actionToggle__disabled $actionToggle_selectedGlyph, &$actionToggle__disabled $actionToggle_unselectedGlyph": {
                fill: neutralForegroundRest,
            },
        },
        actionToggle__disabled: {},
        actionToggle__hasGlyphAndContent: {
            "& $actionToggle_selectedGlyph, & $actionToggle_unselectedGlyph": {
                fill: accentForegroundActive,
            },
        },
        "&$actionToggle__disabled $actionToggle_selectedGlyph, &$actionToggle__disabled $actionToggle_unselectedGlyph": {
            fill: accentForegroundRest,
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
    actionToggle__disabled: {},
    actionToggle__hasGlyphAndContent: {
        "& $actionToggle_selectedGlyph, & $actionToggle_unselectedGlyph": {
            marginRight: directionSwitch(horizontalSpacing(), ""),
            marginLeft: directionSwitch("", horizontalSpacing()),
        },
    },
};

export default styles;
