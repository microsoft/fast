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
import { curry } from "lodash-es";
import { DesignSystem, withDesignSystemDefaults } from "../design-system/index";
import {
    disabledContrast,
    ensureNormalContrast,
    normalContrast,
} from "../utilities/colors";

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
        display: "flex",
        alignItems: "center",
        [applyLocalizedProperty("left", "right", Direction.ltr)]: "0",
    },
};

const styles: ComponentStyles<ActionTriggerClassNameContract, DesignSystem> = (
    config: DesignSystem
): ComponentStyleSheet<ActionTriggerClassNameContract, DesignSystem> => {
    type ContrastFunction = (operandColor: string, referenceColor: string) => string;
    const designSystem: DesignSystem = withDesignSystemDefaults(config);
    const contrastScale: number = designSystem.contrast;
    const foregroundColor: string = designSystem.foregroundColor;
    const backgroundColor: string = designSystem.backgroundColor;
    const brandColor: string = designSystem.brandColor;
    const direction: Direction = designSystem.direction;
    const scaledNormalContrast: ContrastFunction = curry(normalContrast)(contrastScale);
    const scaledEnsureNormalContrast: ContrastFunction = curry(ensureNormalContrast)(
        contrastScale
    );

    // Define secondary button colors
    const color: string = "white";
    const secondaryBackgroundColor: string = scaledEnsureNormalContrast(
        scaledNormalContrast(backgroundColor, foregroundColor),
        color
    );
    const secondaryFocusBorderColor: string = scaledEnsureNormalContrast(
        scaledEnsureNormalContrast(foregroundColor, backgroundColor),
        secondaryBackgroundColor
    );
    const secondaryDisabledBackgroundColor: string = disabledContrast(
        contrastScale,
        secondaryBackgroundColor,
        backgroundColor
    );
    const secondaryDisabledColor: string = disabledContrast(
        contrastScale,
        foregroundColor,
        designSystem.brandColor
    );
    // Define primary button colors
    const primaryRestBackgroundColor: string = scaledEnsureNormalContrast(
        scaledEnsureNormalContrast(brandColor, backgroundColor),
        color
    );
    const primaryDisabledBackground: string = disabledContrast(
        contrastScale,
        primaryRestBackgroundColor,
        backgroundColor
    );
    const primaryDisabledColor: string = disabledContrast(
        contrastScale,
        color,
        primaryDisabledBackground
    );
    const outlineColor: string = scaledEnsureNormalContrast(
        foregroundColor,
        backgroundColor
    );
    const outlineBorderColor: string = scaledNormalContrast(
        foregroundColor,
        backgroundColor
    );
    const outlineDisabledColor: string = disabledContrast(
        designSystem.contrast,
        outlineColor,
        backgroundColor
    );
    const outlineDisabledBorderColor: string = outlineDisabledColor;
    return {
        actionTrigger: {
            display: "inline-flex",
            maxWidth: "100%",
            minWidth: "14px",
        },
        actionTrigger_glyph: {
            display: "inline-block",
            position: "relative",
            maxWidth: "16px",
            [applyLocalizedProperty("marginRight", "marginLeft", direction)]: "6px",
        },
        actionTrigger__primary: {
            "& $actionTrigger_glyph": {
                fill: color,
            },
            "&$actionTrigger__disabled $actionTrigger_glyph": {
                fill: primaryDisabledColor,
            },
        },
        actionTrigger__lightweight: {
            "& $actionTrigger_glyph": {
                fill: primaryRestBackgroundColor,
            },
            "&$actionTrigger__disabled $actionTrigger_glyph": {
                fill: secondaryDisabledColor,
            },
        },
        actionTrigger__justified: {
            [applyLocalizedProperty("marginLeft", "marginRight", direction)]: "-10px",
            "& $actionTrigger_glyph": {
                fill: primaryRestBackgroundColor,
            },
            "&$actionTrigger__disabled $actionTrigger_glyph": {
                fill: secondaryDisabledColor,
            },
        },
        actionTrigger__outline: {
            [applyLocalizedProperty("marginLeft", "marginRight", direction)]: "-10px",
            "& $actionTrigger_glyph": {
                fill: outlineColor,
            },
            "&$actionTrigger__disabled $actionTrigger_glyph": {
                fill: outlineDisabledColor,
            },
        },
        actionTrigger__disabled: {},
    };
};

export default styles;
