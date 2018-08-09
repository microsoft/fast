import designSystemDefaults, { IDesignSystem, safeDesignSystem } from "../design-system";
import { ComponentStyles, ComponentStyleSheet, ICSSRules } from "@microsoft/fast-jss-manager";
import { IButtonClassNameContract } from "@microsoft/fast-components-class-name-contracts-base";
import { IMSFTButtonClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";
import { applyLocalizedProperty, contrast, Direction, ensureContrast, localizeSpacing, toPx } from "@microsoft/fast-jss-utilities";
import { get } from "lodash-es";
import { applyType } from "../utilities/typography";
import { applyMixedColor, ContrastModifiers } from "../utilities/colors";
import Chroma from "chroma-js";

function applyTransaprentBackplateStyles(): ICSSRules<IDesignSystem> {
    return {
        color: (config: IDesignSystem): string => {
            const designSystem: IDesignSystem = safeDesignSystem(config);
            return ensureContrast(config.contrast, designSystem.brandColor, designSystem.backgroundColor);
        },
        ...applyTransaprentBackground(),
        "&:hover, &:focus": {
            borderColor: "transparent",
            boxShadow: "none",
            ...applyTransaprentBackground()
        },
        "&:focus span::before, &:active span::before, &:hover span::before": {
            background: (config: IDesignSystem): string => {
                const designSystem = safeDesignSystem(config);
                return ensureContrast(config.contrast, designSystem.brandColor, designSystem.backgroundColor);
            }
        },
        "&$button__disabled $button_span::before, &$button__disabled $button_span::before": {
            ...applyTransaprentBackground(),
        },
        "&:disabled, &[aria-disabled]": {
            ...applyTransaprentBackground(),
            borderColor: "transparent",
            color: (config: IDesignSystem): string => {
                const designSystem = safeDesignSystem(config);
                return contrast(config.contrast + ContrastModifiers.disabled, designSystem.foregroundColor, designSystem.backgroundColor);
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
                config.foregroundColor,
                config.backgroundColor,
                mixValue,
                alpha
            );
        }
    };
}
/* tslint:disable-next-line */
const styles: ComponentStyles<IMSFTButtonClassNameContract, IDesignSystem> = (config: IDesignSystem): ComponentStyleSheet<IMSFTButtonClassNameContract, IDesignSystem> => {
    config = safeDesignSystem(config);
    const foregroundColor: string = config.foregroundColor;
    const backgroundColor: string = config.backgroundColor;
    const brandColor: string = config.brandColor;
    const direction: Direction = config.direction;

    // Define secondary button colors
    const color: string = "white";
    const secondaryRestBackgroundColor: string = contrast(config.contrast, backgroundColor, color);
    const sencodaryHoverBackgroundColor: string = contrast(config.contrast - ContrastModifiers.hover, secondaryRestBackgroundColor, color);
    /* tslint:disable-next-line*/
    const secondaryFocusBorderColor: string = contrast(config.contrast, foregroundColor, secondaryRestBackgroundColor);
    const secondaryFocusBoxShadow: string = Chroma.contrast(secondaryRestBackgroundColor, secondaryFocusBorderColor) < config.contrast
        ? `inset 0 0 0 2px ${contrast(config.contrast, foregroundColor, secondaryRestBackgroundColor)}`
        : "none";
    /* tslint:disable-next-line*/
    const secondaryDisabledBackgroundColor: string = contrast(config.contrast - ContrastModifiers.disabled, secondaryRestBackgroundColor, backgroundColor);
    const secondaryDisabledColor: string = contrast(config.contrast - ContrastModifiers.disabled, color, secondaryDisabledBackgroundColor);

    // Define primary button colors
    const primaryBackgroundContrast: number = Chroma.contrast(brandColor, color);
    const primaryRestBackground: string = ensureContrast(config.contrast, brandColor, color);
    const primaryHoverBackground: string = contrast(primaryBackgroundContrast - ContrastModifiers.hover, primaryRestBackground, color);
    const primaryFocusBorder: string = contrast(config.contrast, foregroundColor, brandColor);
    const primaryFocusBoxShadow: string = Chroma.contrast(primaryRestBackground, primaryFocusBorder) < config.contrast
        ? `inset 0 0 0 2px ${contrast(config.contrast, primaryRestBackground, primaryFocusBorder)}`
        : "none";
    /* tslint:disable-next-line */
    const primaryDisabledBackground: string = contrast(config.contrast - ContrastModifiers.disabled, primaryRestBackground, backgroundColor);
    const primaryDisabledColor: string = contrast(config.contrast - ContrastModifiers.disabled, color, primaryDisabledBackground);

    const borderColor: string = contrast(config.contrast, foregroundColor, contrast(config.contrast, foregroundColor, backgroundColor));
    const background: string = contrast(config.contrast, foregroundColor, backgroundColor);
    const white: string = "white";

    return {
        button: {
            ...applyType("t7", "vp1"),
            boxSizing: "border-box",
            maxWidth: toPx(374),
            minWidth: toPx(120),
            display: "inline-block",
            padding: `${toPx(13)} ${toPx(12)} ${toPx(12)}`,
            border: `${toPx(2)} solid`,
            borderColor: "transparent",
            borderRadius: toPx(2),
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
                backgroundColor: sencodaryHoverBackgroundColor
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
        button_primary: {
            color,
            backgroundColor: primaryRestBackground,
            "&:hover": {
                backgroundColor: primaryHoverBackground
            },
            "&:focus": {
                borderColor: primaryFocusBorder,
                boxShadow: primaryFocusBoxShadow
            },
            "&$button__disabled": {
                color: primaryDisabledColor,
                backgroundColor: primaryDisabledBackground
            }
        },
        button_outline: {
            extend: "button",
            color: foregroundColor,
            borderWidth: "1px",
            borderColor: background,
            ...applyTransaprentBackground(),
            "&:hover": {
                ...applyTransaprentBackground(),
                borderColor: contrast(config.contrast - ContrastModifiers.hover, borderColor, white),
                color: contrast(config.contrast - ContrastModifiers.hover, foregroundColor, backgroundColor),
            },
            "&:focus": {
                ...applyTransaprentBackground(),
                borderColor: contrast(config.contrast, foregroundColor, backgroundColor),
                boxShadow: `inset 0 0 0 1px ${contrast(config.contrast, foregroundColor, backgroundColor)}`
            },
            "&$button__disabled": {
                ...applyTransaprentBackground(),
                color: contrast(config.contrast - ContrastModifiers.disabled, foregroundColor, backgroundColor),
                // borderColor: contrast(config.contrast + ContrastModifiers.disabled, backgroundColor, foregroundColor)
                borderColor: contrast(config.contrast - ContrastModifiers.disabled, foregroundColor, backgroundColor),
            }
        },
        button_lightweight: {
            ...applyTransaprentBackplateStyles()
        },
        button_justified: {
            ...applyTransaprentBackplateStyles(),
            minWidth: toPx(74),
            padding: localizeSpacing(direction)(`${toPx(13)} ${toPx(12)} ${toPx(12)} 0`),
            textAlign: direction === Direction.ltr ? "left" : "right"
        },
        button_span: {
            position: "relative",
            "&::before": {
                content: "''",
                display: "block",
                height: toPx(2),
                position: "absolute",
                bottom: toPx(-1),
                width: "100%",
                [applyLocalizedProperty("left", "right", direction)]: "0"
            }
        },
        button__disabled: {}
    };
};

export default styles;
