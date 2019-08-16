import { ComponentStyles } from "@microsoft/fast-jss-manager";
import {
    ActionTriggerClassNameContract,
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
    applyHighContrastDisabledForeground,
    applyHighContrastForeground,
    applyHighContrastSelectedForeground,
    highContrastSelector,
} from "../utilities/high-contrast";

// Since MSFT button is already styled, we need to override in this way to alter button classes
export const actionTriggerButtonOverrides: ComponentStyles<
    Partial<ButtonClassNameContract>,
    DesignSystem
> = {
    button: {
        maxWidth: "100%",
        minWidth: "initial",
    },
    button_contentRegion: {
        transition: "all 600ms cubic-bezier(0.19, 1, 0.22, 1)",
        display: "flex",
        alignItems: "center",
    },
};

const styles: ComponentStyles<ActionTriggerClassNameContract, DesignSystem> = {
    actionTrigger: {},
    actionTrigger_glyph: {
        display: "inline-block",
        position: "relative",
        width: glyphSize,
        height: glyphSize,
        flexShrink: "0",
    },
    actionTrigger__primary: {
        "& $actionTrigger_glyph": {
            fill: accentForegroundCut,
            ...applyHighContrastSelectedForeground,
        },
        "&:hover:enabled": {
            "& $actionTrigger_glyph": {
                [highContrastSelector]: {
                    fill: "Highlight",
                },
            },
        },
        "&$actionTrigger__disabled $actionTrigger_glyph": {
            fill: accentForegroundCut,
            ...applyHighContrastDisabledForeground,
        },
    },
    actionTrigger__lightweight: {
        "& $actionTrigger_glyph": {
            fill: accentForegroundRest,
            ...applyHighContrastForeground,
        },
        "&:hover": {
            "& $actionTrigger_glyph": {
                fill: accentForegroundHover,
                ...applyHighContrastForeground,
            },
        },
        "&:active": {
            "& $actionTrigger_glyph": {
                fill: accentForegroundActive,
                ...applyHighContrastForeground,
            },
        },
        "&$actionTrigger__disabled $actionTrigger_glyph": {
            fill: accentForegroundRest,
            ...applyHighContrastDisabledForeground,
        },
    },
    actionTrigger__justified: {
        "& $actionTrigger_glyph": {
            fill: accentForegroundRest,
            ...applyHighContrastForeground,
        },
        "&:hover": {
            "& $actionTrigger_glyph": {
                fill: accentForegroundHover,
                ...applyHighContrastForeground,
            },
        },
        "&:active": {
            "& $actionTrigger_glyph": {
                fill: accentForegroundActive,
                ...applyHighContrastForeground,
            },
        },
        "&$actionTrigger__disabled $actionTrigger_glyph": {
            fill: accentForegroundRest,
            ...applyHighContrastDisabledForeground,
        },
    },
    actionTrigger__outline: {
        "& $actionTrigger_glyph": {
            fill: neutralForegroundRest,
            ...applyHighContrastForeground,
        },
        "&:hover": {
            "& $actionTrigger_glyph": {
                ...applyHighContrastSelectedForeground,
            },
        },
        "&$actionTrigger__disabled $actionTrigger_glyph": {
            fill: neutralForegroundRest,
            ...applyHighContrastDisabledForeground,
        },
    },
    actionTrigger__stealth: {
        "& $actionTrigger_glyph": {
            fill: neutralForegroundRest,
            ...applyHighContrastForeground,
        },
        "&:hover": {
            "& $actionTrigger_glyph": {
                ...applyHighContrastSelectedForeground,
            },
        },
        "&$actionTrigger__disabled $actionTrigger_glyph": {
            fill: neutralForegroundRest,
            ...applyHighContrastDisabledForeground,
        },
    },
    actionTrigger__disabled: {
        "& $actionTrigger_glyph": {
            ...applyHighContrastDisabledForeground,
        },
    },
    actionTrigger__hasGlyphAndContent: {
        "& $actionTrigger_glyph": {
            marginRight: directionSwitch(horizontalSpacing(), ""),
            marginLeft: directionSwitch("", horizontalSpacing()),
        },
    },
};

export default styles;
