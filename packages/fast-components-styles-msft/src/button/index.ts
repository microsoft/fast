import designSystemDefaults, { IDesignSystem, withDesignSystemDefaults } from "../design-system";
import { ComponentStyles, ComponentStyleSheet, ICSSRules } from "@microsoft/fast-jss-manager";
import { IButtonClassNameContract } from "@microsoft/fast-components-class-name-contracts-base";
import { IMSFTButtonClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";
import {
    adjustContrast,
    applyLocalizedProperty,
    contrast,
    Direction,
    ensureContrast,
    localizeSpacing,
    toPx
} from "@microsoft/fast-jss-utilities";
import { curry, get } from "lodash-es";
import { applyType } from "../utilities/typography";
import {
    applyMixedColor,
    disabledContrast,
    ensureLargeContrast,
    ensureNormalContrast,
    hoverContrast,
    largeContrast,
    normalContrast,
    scaleContrastNormal
} from "../utilities/colors";
import Chroma from "chroma-js";
import { density } from "../utilities/density";

function applyTransaprentBackplateStyles(): ICSSRules<IDesignSystem> {
    return {
        color: (config: IDesignSystem): string => {
            const designSystem: IDesignSystem = withDesignSystemDefaults(config);
            return ensureNormalContrast(designSystem.contrast, designSystem.brandColor, designSystem.backgroundColor);
        },
        ...applyTransaprentBackground(),
        "&:hover, &:focus": {
            borderColor: "transparent",
            boxShadow: "none",
            ...applyTransaprentBackground()
        },
        "&:focus span::before, &:active span::before, &:hover span::before": {
            background: (config: IDesignSystem): string => {
                const designSystem: IDesignSystem = withDesignSystemDefaults(config);
                return ensureNormalContrast(designSystem.contrast, designSystem.brandColor, designSystem.backgroundColor);
            }
        },
        "&$button__disabled $button_contentRegion::before, &$button__disabled $button_contentRegion::before": {
            ...applyTransaprentBackground(),
        },
        "&:disabled, &[aria-disabled]": {
            ...applyTransaprentBackground(),
            borderColor: "transparent",
            color: (config: IDesignSystem): string => {
                const designSystem: IDesignSystem = withDesignSystemDefaults(config);

                return disabledContrast(
                    designSystem.contrast,
                    designSystem.foregroundColor,
                    designSystem.brandColor
                );
            }
        }
    };
}

function applyTransaprentBackground(): ICSSRules<IDesignSystem> {
    return {
        backgroundColor: "transparent"
    };
}

const styles: ComponentStyles<IMSFTButtonClassNameContract, IDesignSystem> = (
    config: IDesignSystem
): ComponentStyleSheet<IMSFTButtonClassNameContract, IDesignSystem> => {
    type ContrastFunction = (operandColor: string, referenceColor: string) => string;
    const designSystem: IDesignSystem = withDesignSystemDefaults(config);
    const contrastScale: number = designSystem.contrast;
    const foregroundColor: string = designSystem.foregroundColor;
    const backgroundColor: string = designSystem.backgroundColor;
    const brandColor: string = designSystem.brandColor;
    const direction: Direction = designSystem.direction;
    const scaledNormalContrast: ContrastFunction = curry(normalContrast)(contrastScale);
    const scaledEnsureNormalContrast: ContrastFunction = curry(ensureNormalContrast)(contrastScale);
    const focusBoxShadowDefaults: string = "inset 0 0 0 2px";

    // Define secondary button colors
    const color: string = "white";
    const secondaryBackgroundColor: string = scaledEnsureNormalContrast(
        scaledNormalContrast(backgroundColor, foregroundColor),
        color
    );
    const secondaryHoverBackgroundColor: string = hoverContrast(
        designSystem.contrast,
        secondaryBackgroundColor,
        color
    );
    const secondaryFocusBorderColor: string = scaledEnsureNormalContrast(
        scaledEnsureNormalContrast(foregroundColor, backgroundColor),
        secondaryBackgroundColor
    );

    const secondaryFocusBoxShadow: string = Chroma.contrast(
        secondaryBackgroundColor,
        secondaryFocusBorderColor
    ) < scaleContrastNormal(contrastScale)
        ? `${focusBoxShadowDefaults} ${ensureNormalContrast(contrastScale, secondaryBackgroundColor, secondaryFocusBorderColor)}`
        : "none";
    const secondaryDisabledBackgroundColor: string = disabledContrast(
        contrastScale,
        secondaryBackgroundColor,
        backgroundColor
    );

    const secondaryDisabledColor: string = disabledContrast(
        contrastScale,
        color,
        secondaryDisabledBackgroundColor
    );

    // Define primary button colors
    const primaryRestBackgroundColor: string = scaledEnsureNormalContrast(
        scaledEnsureNormalContrast(brandColor, backgroundColor),
        color
    );

    const primaryHoverBackground: string = hoverContrast(
        designSystem.contrast,
        primaryRestBackgroundColor,
        color
    );
    const primaryFocusBorderColor: string = scaledEnsureNormalContrast(
        scaledEnsureNormalContrast(foregroundColor, backgroundColor),
        primaryRestBackgroundColor
    );
    const primaryFocusBoxShadow: string = Chroma.contrast(
        primaryRestBackgroundColor,
        primaryFocusBorderColor
    ) < scaleContrastNormal(contrastScale)
        ? `${focusBoxShadowDefaults} ${ensureNormalContrast(contrastScale, primaryRestBackgroundColor, primaryFocusBorderColor)}`
        : "none";
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

    const outlineColor: string = scaledEnsureNormalContrast(foregroundColor, backgroundColor);
    const outlineBorderColor: string = scaledNormalContrast(foregroundColor, backgroundColor);
    const outlineDisabledColor: string = disabledContrast(
        designSystem.contrast,
        outlineColor,
        backgroundColor
    );
    const outlineDisabledBorderColor: string = outlineDisabledColor;

    return {
        button: {
            ...applyType("t7", "vp1"),
            boxSizing: "border-box",
            maxWidth: "374px",
            minWidth: "120px",
            display: "inline-flex",
            justifyContent: "center",
            alignItems: "center",
            padding: `0 ${density(config.designUnit * 3)(designSystem)}`,
            height: density(config.designUnit * 11)(designSystem),
            border: "2px solid",
            borderColor: "transparent",
            borderRadius: "2px",
            lineHeight: "1",
            overflow: "hidden",
            textDecoration: "none",
            whiteSpace: "nowrap",
            transition: "all 0.2s ease-in-out",
            color,
            backgroundColor: secondaryBackgroundColor,
            "&:hover": {
                backgroundColor: secondaryHoverBackgroundColor
            },
            "&:focus": {
                outline: "none",
                borderColor: secondaryFocusBorderColor,
                boxShadow: secondaryFocusBoxShadow,
            },
            "&$button__disabled": {
                cursor: "not-allowed",
                backgroundColor: secondaryDisabledBackgroundColor,
                color: secondaryDisabledColor
            }
        },
        button__primary: {
            color,
            backgroundColor: primaryRestBackgroundColor,
            "&:hover": {
                backgroundColor: primaryHoverBackground
            },
            "&:focus": {
                borderColor: primaryFocusBorderColor,
                boxShadow: primaryFocusBoxShadow
            },
            "&$button__disabled": {
                color: primaryDisabledColor,
                backgroundColor: primaryDisabledBackground
            }
        },
        button__outline: {
            borderWidth: "1px",
            "&, &:hover": {
                color: outlineColor,
                borderColor: outlineBorderColor,
                ...applyTransaprentBackground(),
            },
            "&:focus": {
                ...applyTransaprentBackground(),
                borderColor: outlineBorderColor,
                boxShadow: `inset 0 0 0 1px ${outlineBorderColor}`
            },
            "&$button__disabled": {
                ...applyTransaprentBackground(),
                color: outlineDisabledColor,
                borderColor: outlineDisabledBorderColor
            }
        },
        button__lightweight: {
            ...applyTransaprentBackplateStyles()
        },
        button__justified: {
            ...applyTransaprentBackplateStyles(),
            minWidth: "74px",
            [applyLocalizedProperty("paddingLeft", "paddingRight", direction)]: "0",
            justifyContent: "flex-start"
        },
        button_contentRegion: {
            position: "relative",
            "&::before": {
                content: "''",
                display: "block",
                height: "2px",
                position: "absolute",
                bottom: "-1px",
                width: "100%",
                [applyLocalizedProperty("left", "right", direction)]: "0"
            }
        },
        button__disabled: {}
    };
};

export default styles;
