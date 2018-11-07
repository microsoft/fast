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
import { disabledContrast, ensureNormalContrast } from "../utilities/colors";

// Since MSFT button is already styled, we need to override in this way to alter button classes
export const actionTriggerButtonOverrides: ComponentStyles<
    Partial<ButtonClassNameContract>,
    DesignSystem
> = {
    button: {
        maxWidth: "100%",
    },
    button_contentRegion: {
        transition: "all 600ms cubic-bezier(0.19, 1, 0.22, 1)",
        [applyLocalizedProperty("left", "right", Direction.ltr)]: "0",
    },
    button__primary: {
        "&:hover": {
            "& $button_contentRegion": {
                transform: (config: DesignSystem): string => {
                    const designSystem: DesignSystem = withDesignSystemDefaults(config);
                    return designSystem.direction === Direction.ltr
                        ? "translateX(-4px)"
                        : "translateX(4px)";
                },
            },
        },
    },
};

const styles: ComponentStyles<ActionTriggerClassNameContract, DesignSystem> = (
    config: DesignSystem
): ComponentStyleSheet<ActionTriggerClassNameContract, DesignSystem> => {
    const designSystem: DesignSystem = withDesignSystemDefaults(config);
    const direction: Direction = designSystem.direction;
    const color: string = "white";
    const primaryRestBackgroundColor: string = ensureNormalContrast(
        designSystem.contrast,
        designSystem.brandColor,
        designSystem.backgroundColor
    );
    const primaryDisabledBackground: string = disabledContrast(
        designSystem.contrast,
        primaryRestBackgroundColor,
        designSystem.backgroundColor
    );
    const primaryDisabledColor: string = disabledContrast(
        designSystem.contrast,
        color,
        primaryDisabledBackground
    );

    return {
        actionTrigger: {
            display: "inline-flex",
            maxWidth: "100%",
            border: "2px solid transparent",
            lineHeight: "1",
            textDecoration: "none",
            whiteSpace: "nowrap",
            transition: "all 0.2s ease-in-out",
            "&:hover, &:focus": {
                outline: "none",
                "& $actionTrigger_glyph": {
                    transform:
                        direction === Direction.ltr
                            ? "translateX(4px)"
                            : "rotate(180deg) translateX(4px)",
                    position: "relative",
                },
            },
        },
        actionTrigger_glyph: {
            fill: color,
            display: "inline-block",
            position: "relative",
            width: "8px",
            [applyLocalizedProperty("marginLeft", "marginRight", direction)]: "6px",
            transform: direction === Direction.ltr ? "none" : "rotate(180deg)",
            transition: "all 600ms cubic-bezier(0.19, 1, 0.22, 1)",
            marginTop: direction === Direction.ltr ? "4px" : "0",
        },
        actionTrigger__primary: {
            "& $callToAction_glyph": {
                fill: color,
            },
        },
        actionTrigger__lightweight: {
            "& $callToAction_glyph": {
                fill: primaryRestBackgroundColor,
            },
        },
        actionTrigger__justified: {
            [applyLocalizedProperty("marginLeft", "marginRight", direction)]: "-10px",
            "& $callToAction_glyph": {
                fill: primaryRestBackgroundColor,
            },
        },
        actionTrigger__disabled: {
            "& $callToAction_glyph": {
                fill: primaryDisabledColor,
            },
        },
    };
};

export default styles;
