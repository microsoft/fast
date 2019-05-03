import { ComponentStyles, ComponentStyleSheet } from "@microsoft/fast-jss-manager";
import {
    ActionTriggerClassNameContract,
    ButtonClassNameContract,
} from "@microsoft/fast-components-class-name-contracts-msft";
import { applyLocalizedProperty, Direction } from "@microsoft/fast-jss-utilities";
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

const styles: ComponentStyles<ActionTriggerClassNameContract, DesignSystem> = (
    config: DesignSystem
): ComponentStyleSheet<ActionTriggerClassNameContract, DesignSystem> => {
    const designSystem: DesignSystem = withDesignSystemDefaults(config);
    const direction: Direction = designSystem.direction;

    return {
        actionTrigger: {},
        actionTrigger_glyph: {
            display: "inline-block",
            position: "relative",
            width: glyphSize,
            height: glyphSize,
            flexShrink: "0",
            [applyLocalizedProperty(
                "marginRight",
                "marginLeft",
                direction
            )]: horizontalSpacing(),
        },
        actionTrigger__primary: {
            "& $actionTrigger_glyph": {
                fill: accentForegroundCut,
            },
            "&$actionTrigger__disabled $actionTrigger_glyph": {
                fill: accentForegroundCut,
            },
        },
        actionTrigger__lightweight: {
            "& $actionTrigger_glyph": {
                fill: accentForegroundRest,
            },
            "&:hover": {
                "& $actionTrigger_glyph": {
                    fill: accentForegroundHover,
                },
            },
            "&:active": {
                "& $actionTrigger_glyph": {
                    fill: accentForegroundActive,
                },
            },
            "&$actionTrigger__disabled $actionTrigger_glyph": {
                fill: accentForegroundRest,
            },
        },
        actionTrigger__justified: {
            "& $actionTrigger_glyph": {
                fill: accentForegroundRest,
            },
            "&:hover": {
                "& $actionTrigger_glyph": {
                    fill: accentForegroundHover,
                },
            },
            "&:active": {
                "& $actionTrigger_glyph": {
                    fill: accentForegroundActive,
                },
            },
            "&$actionTrigger__disabled $actionTrigger_glyph": {
                fill: accentForegroundRest,
            },
        },
        actionTrigger__outline: {
            "& $actionTrigger_glyph": {
                fill: neutralForegroundRest,
            },
            "&$actionTrigger__disabled $actionTrigger_glyph": {
                fill: neutralForegroundRest,
            },
        },
        actionTrigger__stealth: {
            "& $actionTrigger_glyph": {
                fill: neutralForegroundRest,
            },
            "&$actionTrigger__disabled $actionTrigger_glyph": {
                fill: neutralForegroundRest,
            },
        },
        actionTrigger__disabled: {},
    };
};

export default styles;
