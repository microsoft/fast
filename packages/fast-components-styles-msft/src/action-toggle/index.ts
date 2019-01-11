import {
    ComponentStyles,
    ComponentStyleSheet,
    CSSRules,
} from "@microsoft/fast-jss-manager";
import {
    ActionToggleClassNameContract,
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
export const actionToggleButtonOverrides: ComponentStyles<
    Partial<ButtonClassNameContract>,
    DesignSystem
> = {
    button: {
        maxWidth: "100%",
    },
    button_contentRegion: {
        alignItems: "center",
        display: "flex",
        transition: "all 600ms cubic-bezier(0.19, 1, 0.22, 1)",
        [applyLocalizedProperty("left", "right", Direction.ltr)]: "0",
    },
};

const styles: ComponentStyles<ActionToggleClassNameContract, DesignSystem> = (
    config: DesignSystem
): ComponentStyleSheet<ActionToggleClassNameContract, DesignSystem> => {
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
        actionToggle: {
            display: "inline-flex",
            maxWidth: "100%",
            minWidth: "14px",
        },
        actionToggle__selected: {},
        actionToggle_selectedGlyph: {
            display: "inline-block",
            position: "relative",
            width: "8px",
        },
        actionToggle_unselectedGlyph: {
            display: "inline-block",
            position: "relative",
            maxWidth: "16px",
        },
        actionToggle__primary: {
            "& $actionToggle_selectedGlyph, & $actionToggle_unselectedGlyph": {
                fill: color,
            },
            "&$actionToggle__disabled $actionToggle_selectedGlyph, &$actionToggle__disabled $actionToggle_unselectedGlyph": {
                fill: primaryDisabledColor,
            },
        },
        actionToggle__lightweight: {
            "& $actionToggle_selectedGlyph, & $actionToggle_unselectedGlyph": {
                fill: primaryRestBackgroundColor,
            },
            "&$actionToggle__disabled $actionToggle_selectedGlyph, &$actionToggle__disabled $actionToggle_unselectedGlyph": {
                fill: secondaryDisabledColor,
            },
        },
        actionToggle__justified: {
            [applyLocalizedProperty("marginLeft", "marginRight", direction)]: "-10px",
            "& $actionToggle_selectedGlyph, & $actionToggle_unselectedGlyph": {
                fill: primaryRestBackgroundColor,
            },
            "&$actionToggle__disabled $actionToggle_selectedGlyph, &$actionToggle__disabled $actionToggle_unselectedGlyph": {
                fill: secondaryDisabledColor,
            },
        },
        actionToggle__outline: {
            "& $actionToggle_selectedGlyph, & $actionToggle_unselectedGlyph": {
                fill: outlineColor,
            },
            "&$actionToggle__disabled $actionToggle_selectedGlyph, &$actionToggle__disabled $actionToggle_unselectedGlyph": {
                fill: outlineDisabledColor,
            },
        },
        actionToggle__disabled: {},
        actionToggle__hasGlyphAndContent: {
            "& $actionToggle_selectedGlyph, & $actionToggle_unselectedGlyph,": {
                [applyLocalizedProperty("marginRight", "marginLeft", direction)]: "6px",
            },
        },
    };
};

export default styles;
