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
        extend: "button",
        ...applyTransaprentBackground(),
        "&:hover, &:focus": {
            ...applyTransaprentBackground()
        },
        color: (config: IDesignSystem): string => {
            return get(config, "brandColor") || designSystemDefaults.brandColor;
        },
        "&:disabled span::before, &[aria-disabled] span::before": {
            background: "transparent"
        },
        "&:focus span::before, &:active span::before, &:hover span::before": {
            background: (config: IDesignSystem): string => {
                return get(config, "brandColor") || designSystemDefaults.brandColor;
            }
        },
        "&:disabled, &[aria-disabled]": {
            "&:hover": {
                ...applyTransaprentBackground()
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
    const { foregroundColor, backgroundColor, brandColor, direction } = config;
    const borderColor: string = contrast(config.contrast, foregroundColor, contrast(config.contrast, foregroundColor, backgroundColor));
    const background: string = contrast(config.contrast, foregroundColor, backgroundColor);
    const white: string = "white"

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
            lineHeight: "1",
            textAlign: "center",
            textDecoration: "none",
            whiteSpace: "nowrap",
            verticalAlign: "bottom",
            transition: "all 0.2s ease-in-out",
            color: backgroundColor,
            backgroundColor: background,
            "&:hover": {
                backgroundColor: contrast(config.contrast + ContrastModifiers.hover, backgroundColor, foregroundColor)
            },
            "&:focus": {
                outline: "none",
                borderColor:  borderColor,
                boxShadow: Chroma.contrast(borderColor, background) >= config.contrast ? "" : `inset 0 0 0 2px ${contrast(config.contrast, backgroundColor, borderColor)}`
            },
            "&:disabled, &[aria-disabled]": {
                cursor: "not-allowed",
                backgroundColor: contrast(config.contrast + ContrastModifiers.disabled, backgroundColor, foregroundColor)
            }
        },
        button_primary: {
            extend: "button",
            color: "white",
            backgroundColor: ensureContrast(config.contrast, brandColor, white),
            "&:hover": {
                backgroundColor: contrast(config.contrast - ContrastModifiers.hover, brandColor, white)
            },
            "&:focus": {
                borderColor: contrast(config.contrast, foregroundColor, brandColor),
                boxShadow: Chroma.contrast(contrast(config.contrast, foregroundColor, brandColor), brandColor) >= config.contrast ? "" : `inset 0 0 0 2px ${contrast(config.contrast, brandColor, contrast(config.contrast, foregroundColor, brandColor))}`
            },
            "&:disabled, &[aria-disabled]": {
                backgroundColor: contrast(config.contrast - (ContrastModifiers.disabled - 1), brandColor, white)
            }
        },
        button_outline: {
            extend: "button",
            color: foregroundColor,
            borderColor: borderColor,
            ...applyTransaprentBackground(),
            "&:hover": {
                ...applyTransaprentBackground(),
                borderColor: contrast(config.contrast - ContrastModifiers.hover, borderColor, white),
                color: contrast(config.contrast - ContrastModifiers.hover, foregroundColor, backgroundColor),
            },
            "&:focus": {
                ...applyTransaprentBackground(),
                borderColor: contrast(config.contrast, foregroundColor, backgroundColor),
                boxShadow: Chroma.contrast(foregroundColor, backgroundColor) >= config.contrast ? "" : `inset 0 0 0 2px ${contrast(config.contrast, foregroundColor, backgroundColor)}`
                /* tslint:disable-next-line */
                // boxShadow: `0 0 0 ${toPx(2)} ${applyMixedColor(foregroundColor, backgroundColor, 0.46)}`,
            },
            "&:disabled, &[aria-disabled]": {
                ...applyTransaprentBackground(),
                color: contrast(config.contrast + ContrastModifiers.disabled, backgroundColor, foregroundColor),
                borderColor: contrast(config.contrast + ContrastModifiers.disabled, backgroundColor, foregroundColor)
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
            "&:before": {
                content: "''",
                display: "block",
                height: toPx(2),
                position: "absolute",
                bottom: toPx(-1),
                width: "100%",
                [applyLocalizedProperty("left", "right", direction)]: "0"
            }
        }
    };
};

export default styles;
