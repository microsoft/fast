import {
    ComponentStyles,
    ComponentStyleSheet,
    CSSRules,
} from "@microsoft/fast-jss-manager";
import {
    ActionTriggerClassNameContract,
    ButtonClassNameContract,
} from "@microsoft/fast-components-class-name-contracts-msft";
import {
    applyLocalizedProperty,
    Direction,
    localizeSpacing,
} from "@microsoft/fast-jss-utilities";
import { DesignSystem, withDesignSystemDefaults } from "../design-system/index";
import {
    accentForegroundActive,
    accentForegroundHover,
    accentForegroundCut,
    accentForegroundRest,
    neutralForegroundRest,
} from "../utilities/color";

// Since MSFT button is already styled, we need to override in this way to alter button classes
export const actionTriggerButtonOverrides: ComponentStyles<
    Partial<ButtonClassNameContract>,
    DesignSystem
> = {
    button: {
        maxWidth: "100%",
        minWidth: "14px",
    },
    button_contentRegion: {
        transition: "all 600ms cubic-bezier(0.19, 1, 0.22, 1)",
        display: "flex",
        alignItems: "center",
        [applyLocalizedProperty("left", "right", Direction.ltr)]: "0",
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
            maxWidth: "16px",
            [applyLocalizedProperty("marginRight", "marginLeft", direction)]: "6px",
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
                fill: neutralForegroundRest,
            },
        },
        actionTrigger__justified: {
            [applyLocalizedProperty("marginLeft", "marginRight", direction)]: "-10px",
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
                fill: neutralForegroundRest,
            },
        },
        actionTrigger__outline: {
            [applyLocalizedProperty("marginLeft", "marginRight", direction)]: "-10px",
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
