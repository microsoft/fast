import designSystemDefaults, { IDesignSystem } from "../design-system";
import { ComponentStyles, ComponentStyleSheet, ICSSRules } from "@microsoft/fast-jss-manager";
import { IButtonClassNameContract } from "@microsoft/fast-components-class-name-contracts-base";
import { IMSFTButtonClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";
import { applyLocalizedProperty, Direction, localizeSpacing, toPx, ensureContrast } from "@microsoft/fast-jss-utilities";
import { get } from "lodash-es";
import { applyType } from "../utilities/typography";
import { applyMixedColor } from "../utilities/colors";
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
            return applyMixedColor(
                get(config, "foregroundColor") || designSystemDefaults.foregroundColor,
                get(config, "backgroundColor") || designSystemDefaults.backgroundColor,
                mixValue,
                alpha
            );
        }
    };
}
/* tslint:disable:max-line-length */
const styles: ComponentStyles<IMSFTButtonClassNameContract, IDesignSystem> = (config: IDesignSystem): ComponentStyleSheet<IMSFTButtonClassNameContract, IDesignSystem> => {
/* tslint:enable:max-line-length */
    const backgroundColor: string = get(config, "backgroundColor") || designSystemDefaults.backgroundColor;
    const brandColor: string = get(config, "brandColor") || designSystemDefaults.brandColor;
    const direction: Direction = get(config, "direction") || designSystemDefaults.direction;
    const foregroundColor: string = get(config, "foregroundColor") || designSystemDefaults.foregroundColor;

    return {
        button: {
            ...applyType("t7", "vp1"),
            boxSizing: "border-box",
            maxWidth: toPx(374),
            minWidth: toPx(120),
            display: "inline-block",
            padding: `${toPx(13)} ${toPx(12)} ${toPx(12)}`,
            border: `${toPx(2)} solid transparent`,
            borderRadius: toPx(2),
            cursor: "pointer",
            overflow: "hidden",
            lineHeight: "1",
            textAlign: "center",
            textDecoration: "none",
            whiteSpace: "nowrap",
            verticalAlign: "bottom",
            transition: "all 0.2s ease-in-out",
            color: ensureContrast(4.5, backgroundColor, foregroundColor),
            backgroundColor: ensureContrast(4.5, foregroundColor, backgroundColor),
            "&:hover": {
                ...applyPropertyDrivenColor("backgroundColor", 0.46, 0.8)
            },
            "&:focus": {
                outline: "none",
                ...applyPropertyDrivenColor("backgroundColor", 0.38)
            },
            "&:disabled, &[aria-disabled]": {
                opacity: ".4",
                cursor: "not-allowed",
                "&:hover": {
                    ...applyPropertyDrivenColor("backgroundColor", 0.46)
                }
            }
        },
        button_primary: {
            extend: "button",
            color: backgroundColor,
            backgroundColor: ensureContrast(4.5, brandColor, foregroundColor),
            "&:hover": {
                backgroundColor: Chroma(brandColor).alpha(0.8).css()
            },
            "&:focus": {
                outline: "none",
                backgroundColor: Chroma(brandColor).darken().css()
            },
            "&:disabled, &[aria-disabled]": {
                backgroundColor: brandColor,
                "&:hover": {
                    backgroundColor: brandColor
                }
            }
        },
        button_outline: {
            extend: "button",
            color: foregroundColor,
            ...applyPropertyDrivenColor("borderColor", 0.46),
            ...applyTransaprentBackground(),
            "&:hover": {
                ...applyPropertyDrivenColor("borderColor", 0.46, 0.8),
                ...applyTransaprentBackground()
            },
            "&:focus": {
                borderColor: "transparent",
                /* tslint:disable-next-line */
                boxShadow: `0 0 0 ${toPx(2)} ${applyMixedColor(foregroundColor, backgroundColor, 0.46)}`,
                ...applyTransaprentBackground()
            },
            "&:disabled, &[aria-disabled]": {
                ...applyTransaprentBackground(),
                "&:hover": {
                    ...applyTransaprentBackground()
                }
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
