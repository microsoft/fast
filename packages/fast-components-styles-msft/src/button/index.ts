import designSystemDefaults, { IDesignSystem } from "../design-system";
import { ComponentStyles, ComponentStyleSheet, ICSSRules } from "@microsoft/fast-jss-manager";
import { IButtonClassNameContract } from "@microsoft/fast-components-class-name-contracts-base";
import { IMSFTButtonClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";
import { applyLocalizedProperty, Direction, localizeSpacing, toPx } from "@microsoft/fast-jss-utilities";
import { get } from "lodash-es";
import { applyType } from "../utilities/typography";
import { applyMixedColor } from "../utilities/colors";
import * as Chroma from "chroma-js";

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
        backgroundColor: (): string => {
            return "transparent";
        }
    };
}

function applyPropertyDrivenColor(incomingProperty: string, mixValue?: number, alpha?: number): ICSSRules<IDesignSystem> {
    return {
        [incomingProperty]: (config: IDesignSystem): string => {
            const backgroundColor: string = get(config, "backgroundColor") || designSystemDefaults.backgroundColor;
            const foregroundColor: string = get(config, "foregroundColor") || designSystemDefaults.foregroundColor;

            return applyMixedColor(foregroundColor, backgroundColor, mixValue, alpha);
        }
    };
}
/* tslint:disable:max-line-length */
const styles: ComponentStyles<IMSFTButtonClassNameContract, IDesignSystem> = (config: IDesignSystem): ComponentStyleSheet<IMSFTButtonClassNameContract, IDesignSystem> => {
/* tslint:enable:max-line-length */
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
            color: (): string => {
                return get(config, "backgroundColor") || designSystemDefaults.backgroundColor;
            },
            ...applyPropertyDrivenColor("backgroundColor", 0.46),
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
            color: (): string => {
                return config.backgroundColor;
            },
            backgroundColor: (): string => {
                return get(config, "brandColor") || designSystemDefaults.brandColor;
            },
            "&:hover": {
                backgroundColor: (): string => {
                    return Chroma(get(config, "brandColor") || designSystemDefaults.brandColor).alpha(0.8).css();
                }
            },
            "&:focus": {
                outline: "none",
                backgroundColor: (): string => {
                    return Chroma(get(config, "brandColor") || designSystemDefaults.brandColor).darken().css();
                }
            },
            "&:disabled, &[aria-disabled]": {
                backgroundColor: (): string => {
                    return get(config, "brandColor") || designSystemDefaults.brandColor;
                },
                "&:hover": {
                    backgroundColor: (): string => {
                        return get(config, "brandColor") || designSystemDefaults.brandColor;
                    }
                }
            }
        },
        button_outline: {
            extend: "button",
            color: (): string => {
                return get(config, "foregroundColor") || designSystemDefaults.foregroundColor;
            },
            ...applyPropertyDrivenColor("borderColor", 0.46),
            ...applyTransaprentBackground(),
            "&:hover": {
                ...applyPropertyDrivenColor("borderColor", 0.46, 0.8),
                ...applyTransaprentBackground()
            },
            "&:focus": {
                borderColor: "transparent",
                boxShadow: (): string => {
                    /* tslint:disable max-line-length */
                    return `0 0 0 ${toPx(2)} ${applyMixedColor(get(config, "foregroundColor") || designSystemDefaults.foregroundColor, get(config, "backgroundColor") || designSystemDefaults.backgroundColor, 0.46)}`;
                    /* tslint:enable max-line-length */
                },
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
            padding: (): string => {
                return localizeSpacing(get(config, "direction") || designSystemDefaults.direction)(`${toPx(13)} ${toPx(12)} ${toPx(12)} 0`);
            },
            textAlign: (): string => get(config, "direction") === Direction.ltr || designSystemDefaults.direction ? "left" : "right"
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
                [applyLocalizedProperty("left", "right", get(config, "direction") || designSystemDefaults.direction)]: "0"
            }
        }
    };
};

export default styles;
