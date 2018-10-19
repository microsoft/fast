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
    applyLocalizedProperty,
    Direction,
    localizeSpacing,
} from "@microsoft/fast-jss-utilities";
import { DesignSystem, withDesignSystemDefaults } from "../design-system/index";
import { disabledContrast, ensureNormalContrast } from "../utilities/colors";

// Since MSFT button is already styled, we need to override in this way to alter button classes
export const callToActionButtonOverrides: ComponentStyles<
    Partial<ButtonClassNameContract>,
    DesignSystem
> = {
    button: {
        maxWidth: "100%",
        padding: "0 12px",
    },
    button_contentRegion: {
        transition: "all 600ms cubic-bezier(0.19, 1, 0.22, 1)",
        [applyLocalizedProperty("left", "right", Direction.ltr)]: "0",
    },
    button__primary: {
        "&:hover": {
            "& $button_contentRegion": {
                left: (config: DesignSystem): string => {
                    const designSystem: DesignSystem = withDesignSystemDefaults(config);
                    return designSystem.direction === Direction.ltr ? "-4px" : "4px";
                },
            },
        },
    },
};

const styles: ComponentStyles<CallToActionClassNameContract, DesignSystem> = (
    config: DesignSystem
): ComponentStyleSheet<CallToActionClassNameContract, DesignSystem> => {
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
        callToAction: {
            fontSize: "15px",
            display: "inline-flex",
            maxWidth: "100%",
            border: "2px solid transparent",
            padding: "0 12px",
            lineHeight: "1",
            textDecoration: "none",
            whiteSpace: "nowrap",
            transition: "all 0.2s ease-in-out",
            "&:hover, &:focus": {
                outline: "none",
                "& $callToAction_glyph": {
                    left: direction === Direction.ltr ? "4px" : "-4px",
                    position: "relative",
                },
            },
        },
        callToAction_glyph: {
            fill: color,
            display: "inline-block",
            position: "relative",
            width: "8px",
            [applyLocalizedProperty("marginLeft", "marginRight", direction)]: "6px",
            transform: direction === Direction.ltr ? "none" : "rotate(180deg)",
            transition: "all 600ms cubic-bezier(0.19, 1, 0.22, 1)",
            left: "0",
            marginTop: direction === Direction.ltr ? "4px" : "0",
        },
        callToAction__primary: {
            "& $callToAction_glyph": {
                fill: color,
            },
        },
        callToAction__lightweight: {
            "& $callToAction_glyph": {
                fill: primaryRestBackgroundColor,
            },
        },
        callToAction__justified: {
            [applyLocalizedProperty("marginLeft", "marginRight", direction)]: "-10px",
            "& $callToAction_glyph": {
                fill: primaryRestBackgroundColor,
            },
        },
        callToAction__disabled: {
            "& $callToAction_glyph": {
                fill: primaryDisabledColor,
            },
        },
    };
};

export default styles;
