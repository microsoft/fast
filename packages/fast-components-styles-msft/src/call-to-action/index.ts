import {
    ComponentStyles,
    ComponentStyleSheet,
    CSSRules,
} from "@microsoft/fast-jss-manager";
import {
    ButtonClassNameContract,
    CallToActionClassNameContract,
} from "@microsoft/fast-components-class-name-contracts-msft";
import {
    applyFocusVisible,
    applyLocalizedProperty,
    Direction,
} from "@microsoft/fast-jss-utilities";
import { DesignSystem, withDesignSystemDefaults } from "../design-system/index";
import {
    accentFillRest,
    accentForegroundCut,
    neutralForegroundRest,
} from "../utilities/color";

// Since MSFT button is already styled, we need to override in this way to alter button classes
export const callToActionButtonOverrides: ComponentStyles<
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
    button__disabled: {
        "&:hover": {
            "& $button_contentRegion": {
                transform: "none",
            },
        },
    },
};

const styles: ComponentStyles<CallToActionClassNameContract, DesignSystem> = (
    config: DesignSystem
): ComponentStyleSheet<CallToActionClassNameContract, DesignSystem> => {
    const designSystem: DesignSystem = withDesignSystemDefaults(config);
    const direction: Direction = designSystem.direction;

    return {
        callToAction: {
            transition: "all 0.2s ease-in-out",
            display: "inline-flex",
            maxWidth: "100%",
            border: "2px solid transparent",
            lineHeight: "1",
            textDecoration: "none",
            whiteSpace: "nowrap",
            "&:hover": {
                "& $callToAction_glyph": {
                    transform:
                        direction === Direction.ltr
                            ? "translateX(4px)"
                            : "rotate(180deg) translateX(4px)",
                    position: "relative",
                },
            },
            ...applyFocusVisible("& $callToAction_glyph", {
                transform:
                    direction === Direction.ltr
                        ? "translateX(4px)"
                        : "rotate(180deg) translateX(4px)",
                position: "relative",
            }),
        },
        callToAction_glyph: {
            fill: accentForegroundCut,
            display: "inline-block",
            position: "relative",
            width: "8px",
            [applyLocalizedProperty("marginLeft", "marginRight", direction)]: "6px",
            transform: direction === Direction.ltr ? "none" : "rotate(180deg)",
            transition: "all 600ms cubic-bezier(0.19, 1, 0.22, 1)",
            marginTop: direction === Direction.ltr ? "4px" : "0",
        },
        callToAction__primary: {
            "& $callToAction_glyph": {
                fill: accentForegroundCut,
            },
        },
        callToAction__lightweight: {
            "& $callToAction_glyph": {
                fill: accentFillRest,
            },
        },
        callToAction__justified: {
            [applyLocalizedProperty("marginLeft", "marginRight", direction)]: "-10px",
            "& $callToAction_glyph": {
                fill: accentFillRest,
            },
        },
        callToAction__disabled: {
            "&:hover": {
                "& $callToAction_glyph": {
                    transform: "none",
                },
            },
        },
    };
};

export default styles;
