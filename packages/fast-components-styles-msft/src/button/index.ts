/* tslint:disable:max-line-length */
import designSystemDefaults, { IDesignSystem, safeDesignSystem } from "../design-system";
import { ComponentStyles, ComponentStyleSheet, ICSSRules } from "@microsoft/fast-jss-manager";
import { IButtonClassNameContract } from "@microsoft/fast-components-class-name-contracts-base";
import { IMSFTButtonClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";
import { adjustContrast, applyLocalizedProperty, contrast, Direction, ensureContrast, localizeSpacing, toPx } from "@microsoft/fast-jss-utilities";
import { curry, get } from "lodash-es";
import { applyType } from "../utilities/typography";
import { applyMixedColor, ContrastModifiers, ensureLargeContrast, ensureNormalContrast, largeContrast, normalContrast, scaleContrastNormal } from "../utilities/colors";
import Chroma from "chroma-js";

function applyTransaprentBackplateStyles(): ICSSRules<IDesignSystem> {
    return {
        color: (config: IDesignSystem): string => {
            const designSystem: IDesignSystem = safeDesignSystem(config);
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
                const designSystem: IDesignSystem = safeDesignSystem(config);
                return ensureNormalContrast(designSystem.contrast, designSystem.brandColor, designSystem.backgroundColor);
            }
        },
        "&$button__disabled $button_span::before, &$button__disabled $button_span::before": {
            ...applyTransaprentBackground(),
        },
        "&:disabled, &[aria-disabled]": {
            ...applyTransaprentBackground(),
            borderColor: "transparent",
            color: (config: IDesignSystem): string => {
                const designSystem: IDesignSystem = safeDesignSystem(config);
                return contrast(
                    ContrastModifiers.disabled * -1,
                    designSystem.foregroundColor,
                    designSystem.backgroundColor
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

function applyPropertyDrivenColor(incomingProperty: string, mixValue?: number, alpha?: number): ICSSRules<IDesignSystem> {
    return {
        [incomingProperty]: (config: IDesignSystem): string => {
            const designSystem: IDesignSystem = safeDesignSystem(config);

            return applyMixedColor(
                designSystem.foregroundColor,
                designSystem.backgroundColor,
                mixValue,
                alpha
            );
        }
    };
}

const styles: ComponentStyles<IMSFTButtonClassNameContract, IDesignSystem> = (config: IDesignSystem): ComponentStyleSheet<IMSFTButtonClassNameContract, IDesignSystem> => {
    type ContrastFunction = (operandColor: string, referenceCOlor: string) => string;
    const designSystem: IDesignSystem = safeDesignSystem(config);
    const contrastScale: number = designSystem.contrast;
    const foregroundColor: string = designSystem.foregroundColor;
    const backgroundColor: string = designSystem.backgroundColor;
    const brandColor: string = designSystem.brandColor;
    const direction: Direction = designSystem.direction;
    const applyNormalContrast: ContrastFunction = curry(normalContrast)(contrastScale);
    const applyLargeContrast: ContrastFunction = curry(largeContrast)(contrastScale);
    const applyEnsureNormalContrast: ContrastFunction = curry(ensureNormalContrast)(contrastScale);
    const applyEnsureLargeContrast: ContrastFunction = curry(ensureNormalContrast)(contrastScale);
    const focusBoxShadowDefualts: string = "inset 0 0 0 2px";

    // Define secondary button colors
    const color: string = "white";
    const secondaryRestBackgroundColor: string = applyEnsureNormalContrast(
        applyNormalContrast(backgroundColor, foregroundColor),
        color
    );
    const secondaryHoverBackgroundColor: string = adjustContrast(
        ContrastModifiers.hover,
        secondaryRestBackgroundColor,
        color
    );
    const secondaryFocusBorderColor: string = applyEnsureNormalContrast(
        applyEnsureNormalContrast(foregroundColor, backgroundColor),
        secondaryRestBackgroundColor
    );

    const secondaryFocusBoxShadow: string = Chroma.contrast(
        secondaryRestBackgroundColor,
        secondaryFocusBorderColor
    ) < scaleContrastNormal(contrastScale)
        ? `${focusBoxShadowDefualts} ${ensureNormalContrast(contrastScale, secondaryRestBackgroundColor, secondaryFocusBorderColor)}`
        : "none";
    const secondaryDisabledBackgroundColor: string = adjustContrast(
        ContrastModifiers.disabled,
        secondaryRestBackgroundColor,
        color
    );

    // Define primary button colors
    const primaryRestBackgroundColor: string = applyEnsureNormalContrast(
        applyEnsureNormalContrast(brandColor, backgroundColor),
        color
    );
    const primaryHoverBackground: string = adjustContrast(
        ContrastModifiers.hover,
        primaryRestBackgroundColor,
        color
    );
    const primaryFocusBorderColor: string = applyEnsureNormalContrast(
        applyEnsureNormalContrast(foregroundColor, backgroundColor),
        primaryRestBackgroundColor
    );
    const primaryFocusBoxShadow: string = Chroma.contrast(
        primaryRestBackgroundColor,
        primaryFocusBorderColor
    ) < scaleContrastNormal(contrastScale)
        ? `${focusBoxShadowDefualts} ${ensureNormalContrast(contrastScale, primaryRestBackgroundColor, primaryFocusBorderColor)}`
        : "none";
    const primaryDisabledBackground: string = adjustContrast(
        ContrastModifiers.disabled,
        primaryRestBackgroundColor,
        backgroundColor
    );
    const primaryDisabledColor: string = contrast(
        ContrastModifiers.disabled * -1,
        color,
        primaryDisabledBackground
    );

    const outlineColor: string = applyEnsureNormalContrast(foregroundColor, backgroundColor);
    const outlineBorderColor: string = applyNormalContrast(foregroundColor, backgroundColor);
    const outlineDisabledColor: string = contrast(
        ContrastModifiers.disabled * -1,
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
            display: "inline-block",
            padding: "13px 12px 12px",
            border: "2px solid",
            borderColor: "transparent",
            borderRadius: "2px",
            cursor: "pointer",
            overflow: "hidden",
            lineHeight: "1", textAlign: "center",
            textDecoration: "none",
            whiteSpace: "nowrap",
            verticalAlign: "bottom",
            transition: "all 0.2s ease-in-out",
            color,
            backgroundColor: secondaryRestBackgroundColor,
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
                color
            }
        },
        button_primary: {
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
        button_outline: {
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
        button_lightweight: {
            ...applyTransaprentBackplateStyles()
        },
        button_justified: {
            ...applyTransaprentBackplateStyles(),
            minWidth: "74px",
            padding: localizeSpacing(direction)("13px 12px 12px 0"),
            textAlign: applyLocalizedProperty("left", "right", direction),
        },
        button_span: {
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
/* tslint:enable:max-line-length */
