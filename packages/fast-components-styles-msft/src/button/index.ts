import designSystemDefaults, { IDesignSystem, safeDesignSystem } from "../design-system";
import { ComponentStyles, ComponentStyleSheet, ICSSRules } from "@microsoft/fast-jss-manager";
import { IButtonClassNameContract } from "@microsoft/fast-components-class-name-contracts-base";
import { IMSFTButtonClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";
import { applyLocalizedProperty, Direction, localizeSpacing, toPx, ensureContrast, contrast } from "@microsoft/fast-jss-utilities";
import { get } from "lodash-es";
import { applyType } from "../utilities/typography";
import { applyMixedColor, ContrastModifiers } from "../utilities/colors";
import Chroma from "chroma-js";

function applyTransaprentBackplateStyles(): ICSSRules<IDesignSystem> {
    return {
        color: (config: IDesignSystem): string => {
            const designSystem = safeDesignSystem(config);
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
                return contrast(config.contrast + ContrastModifiers.disabled, designSystem.foregroundColor, designSystem.backgroundColor)
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
            const designSystem = safeDesignSystem(config);

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
    const borderColor: string = contrast(config.contrast, foregroundColor, contrast(config.contrast, foregroundColor, backgroundColor));
    const background: string = contrast(config.contrast, foregroundColor, backgroundColor);
    const white: string = "white";

    const primaryRestBackground: string = ensureContrast(config.contrast, brandColor, white);
    const primaryFocusBorder: string = contrast(config.contrast, foregroundColor, brandColor);
    const boxShadow: string = `inset 0 0 0 2px ${contrast(config.contrast, primaryRestBackground, primaryFocusBorder)}`;

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
            color: white,
            backgroundColor: contrast(config.contrast, foregroundColor, white),
            "&:hover": {
                backgroundColor: contrast(config.contrast - ContrastModifiers.hover, foregroundColor, white)
            },
            "&:focus": {
                outline: "none",
                borderColor,
                boxShadow: Chroma.contrast(borderColor, contrast(config.contrast, foregroundColor, white)) >= config.contrast
                    ? ""
                    : `inset 0 0 0 2px ${contrast(config.contrast, contrast(config.contrast, foregroundColor, white), borderColor)}`
            },
            "&$button__disabled": {
                cursor: "not-allowed",
                ...((): ICSSRules<any> => {
                    return {
                        backgroundColor: contrast(config.contrast - ContrastModifiers.disabled, foregroundColor, backgroundColor),
                        color: contrast(config.contrast - ContrastModifiers.disabled,
                            white,
                            contrast(config.contrast - ContrastModifiers.disabled, foregroundColor, backgroundColor))
                    };
                })()
            }
        },
        button_primary: {
            extend: "button",
            color: "white",
            backgroundColor: primaryRestBackground,
            "&:hover": {
                backgroundColor: contrast(config.contrast - ContrastModifiers.hover, brandColor, white)
            },
            "&:focus": {
                borderColor: primaryFocusBorder,
                /*tslint:disable-next-line*/
                boxShadow: Chroma.contrast(primaryRestBackground, primaryFocusBorder) >= config.contrast
                    ? "none"
                    : `inset 0 0 0 2px ${contrast(config.contrast, primaryRestBackground, primaryFocusBorder)}`
            },
            "&$button__disabled": {
                color: contrast(config.contrast - ContrastModifiers.disabled, white, contrast(config.contrast - ContrastModifiers.disabled, brandColor, backgroundColor)),
                backgroundColor: contrast(config.contrast - ContrastModifiers.disabled, brandColor, backgroundColor)
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
