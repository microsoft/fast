import {
    ComponentStyles,
    ComponentStyleSheet,
    CSSRules,
} from "@microsoft/fast-jss-manager";
import { applyTypeRampConfig } from "../utilities/typography";
import { ButtonClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";
import {
    adjustContrast,
    applyLocalizedProperty,
    contrast,
    Direction,
    ensureContrast,
    focusVisible,
    localizeSpacing,
    scaleContrast,
    toPx,
} from "@microsoft/fast-jss-utilities";
import { curry, get } from "lodash-es";
import designSystemDefaults, {
    DesignSystem,
    withDesignSystemDefaults,
} from "../design-system";
import {
    applyMixedColor,
    disabledContrast,
    ensureForegroundNormal,
    ensureLargeContrast,
    ensureNormalContrast,
    hoverContrast,
    largeContrast,
    normalContrast,
    scaleContrastNormal,
} from "../utilities/colors";
import Chroma from "chroma-js";
import { density } from "../utilities/density";
import { defaultHeight, maxHeight, minHeight } from "../utilities/height";
import outlinePattern from "../patterns/outline";

function applyTransaprentBackplateStyles(): CSSRules<DesignSystem> {
    return {
        color: (config: DesignSystem): string => {
            const designSystem: DesignSystem = withDesignSystemDefaults(config);
            return ensureNormalContrast(
                designSystem.contrast,
                designSystem.brandColor,
                designSystem.backgroundColor
            );
        },
        ...applyTransparentBackground(),
        [`&:hover, &${focusVisible()}`]: {
            borderColor: "transparent",
            boxShadow: "none",
            ...applyTransparentBackground(),
        },
        "&:active $button_contentRegion::before, &:hover $button_contentRegion::before": {
            background: (config: DesignSystem): string => {
                const designSystem: DesignSystem = withDesignSystemDefaults(config);
                return ensureNormalContrast(
                    designSystem.contrast,
                    designSystem.brandColor,
                    designSystem.backgroundColor
                );
            },
        },
        [`&${focusVisible()} $button_contentRegion::before`]: {
            background: ensureForegroundNormal,
        },
        "&$button__disabled, &$button__disabled $button_contentRegion::before": {
            ...applyTransparentBackground(),
        },
        "&$button__disabled": {
            borderColor: "transparent",
            color: (config: DesignSystem): string => {
                const designSystem: DesignSystem = withDesignSystemDefaults(config);

                return disabledContrast(
                    designSystem.contrast,
                    designSystem.foregroundColor,
                    designSystem.brandColor
                );
            },
        },
    };
}

function applyTransparentBackground(): CSSRules<DesignSystem> {
    return {
        backgroundColor: "transparent",
    };
}

const styles: ComponentStyles<ButtonClassNameContract, DesignSystem> = (
    config: DesignSystem
): ComponentStyleSheet<ButtonClassNameContract, DesignSystem> => {
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
    const scaledEnsureLargeContrast: ContrastFunction = curry(ensureLargeContrast)(
        contrastScale
    );
    const scaledLargeContrast: ContrastFunction = curry(largeContrast)(contrastScale);
    const focusBoxShadowDefaults: string = "inset 0 0 0 2px";

    // Define secondary button colors
    const color: string = "white";
    const secondaryForegroundColor: string = designSystem.foregroundColor;
    const secondaryBackgroundColor: string = scaledEnsureNormalContrast(
        contrast(
            scaleContrast(1.32, contrastScale),
            designSystem.foregroundColor,
            designSystem.backgroundColor
        ),
        secondaryForegroundColor
    );

    const secondaryHoverBackgroundColor: string = hoverContrast(
        designSystem.contrast,
        secondaryBackgroundColor
    );
    const secondaryFocusBorderColor: string = scaledEnsureNormalContrast(
        scaledEnsureNormalContrast(foregroundColor, backgroundColor),
        secondaryBackgroundColor
    );

    const secondaryFocusBoxShadow: string =
        Chroma.contrast(secondaryBackgroundColor, secondaryFocusBorderColor) <
        scaleContrastNormal(contrastScale)
            ? `${focusBoxShadowDefaults} ${ensureNormalContrast(
                  contrastScale,
                  secondaryBackgroundColor,
                  secondaryFocusBorderColor
              )}`
            : "none";
    const secondaryDisabledBackgroundColor: string = disabledContrast(
        contrastScale,
        secondaryBackgroundColor,
        backgroundColor
    );

    const secondaryDisabledColor: string = disabledContrast(
        contrastScale,
        secondaryForegroundColor,
        secondaryDisabledBackgroundColor
    );

    // Define primary button colors
    const primaryRestBackgroundColor: string = scaledEnsureLargeContrast(
        scaledEnsureNormalContrast(brandColor, backgroundColor),
        color
    );

    const primaryHoverBackground: string = hoverContrast(
        designSystem.contrast,
        primaryRestBackgroundColor
    );
    const primaryFocusBorderColor: string = scaledEnsureNormalContrast(
        scaledEnsureNormalContrast(foregroundColor, backgroundColor),
        primaryRestBackgroundColor
    );
    const primaryFocusBoxShadow: string =
        Chroma.contrast(primaryRestBackgroundColor, primaryFocusBorderColor) <
        scaleContrastNormal(contrastScale)
            ? `${focusBoxShadowDefaults} ${ensureNormalContrast(
                  contrastScale,
                  primaryRestBackgroundColor,
                  primaryFocusBorderColor
              )}`
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
        button: {
            ...applyTypeRampConfig("t7"),
            fontFamily: "inherit",
            boxSizing: "border-box",
            maxWidth: "374px",
            minWidth: "120px",
            padding: "0 16px",
            display: "inline-flex",
            justifyContent: "center",
            alignItems: "center",
            height: density(defaultHeight)(designSystem),
            minHeight: toPx(minHeight),
            maxHeight: toPx(maxHeight),
            border: "2px solid",
            borderColor: "transparent",
            borderRadius: "2px",
            lineHeight: "1",
            overflow: "hidden",
            textDecoration: "none",
            whiteSpace: "nowrap",
            transition: "all 0.2s ease-in-out",
            color: secondaryForegroundColor,
            backgroundColor: secondaryBackgroundColor,
            "&:hover": {
                backgroundColor: secondaryHoverBackgroundColor,
            },
            "&:focus": {
                outline: "none",
            },
            [`&${focusVisible()}`]: {
                outline: "none",
                borderColor: secondaryFocusBorderColor,
                boxShadow: secondaryFocusBoxShadow,
            },
            "&$button__disabled": {
                cursor: "not-allowed",
                backgroundColor: secondaryDisabledBackgroundColor,
                color: secondaryDisabledColor,
            },
        },
        button__primary: {
            color,
            backgroundColor: primaryRestBackgroundColor,
            "&:hover": {
                backgroundColor: primaryHoverBackground,
            },
            [`&${focusVisible()}`]: {
                borderColor: primaryFocusBorderColor,
                boxShadow: primaryFocusBoxShadow,
            },
            "&$button__disabled": {
                color: primaryDisabledColor,
                backgroundColor: primaryDisabledBackground,
            },
        },
        button__outline: {
            ...outlinePattern.rest,
            "&, &:hover": {
                color: outlineColor,
                ...applyTransparentBackground(),
            },
            "&:hover": {
                ...outlinePattern.hover,
            },
            [`&${focusVisible()}`]: {
                ...applyTransparentBackground(),
                ...outlinePattern.focus,
            },
            "&$button__disabled": {
                ...applyTransparentBackground(),
                ...outlinePattern.disabled,
                color: outlineDisabledColor,
            },
        },
        button__lightweight: {
            ...applyTransaprentBackplateStyles(),
        },
        button__justified: {
            ...applyTransaprentBackplateStyles(),
            minWidth: "74px",
            [applyLocalizedProperty("paddingLeft", "paddingRight", direction)]: "0",
            justifyContent: "flex-start",
        },
        button_contentRegion: {
            position: "relative",
            "&::before": {
                content: "''",
                display: "block",
                height: "2px",
                position: "absolute",
                bottom: "-3px",
                width: "100%",
                [applyLocalizedProperty("left", "right", direction)]: "0",
            },
        },
        button__disabled: {},
    };
};

export default styles;
