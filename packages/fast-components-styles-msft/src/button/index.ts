import { IDesignSystem } from "../design-system";
import { ComponentStyles, ICSSRules } from "@microsoft/fast-jss-manager";
import { IButtonClassNameContract } from "@microsoft/fast-components-class-name-contracts-base";
import { IMSFTButtonClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";
import { Direction, localizeSpacing, toPx } from "@microsoft/fast-jss-utilities";
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
            return config.brandColor;
        },
        "&:disabled span::before, &[aria-disabled] span::before": {
            background: "transparent"
        },
        "&:focus span::before, &:active span::before, &:hover span::before": {
            background: (config: IDesignSystem): string => {
                return config.brandColor;
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
            return applyMixedColor(config.foregroundColor, config.backgroundColor, mixValue, alpha);
        }
    };
}

const styles: ComponentStyles<IMSFTButtonClassNameContract, IDesignSystem> = {
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
        color: (config: IDesignSystem): string => {
            return config.backgroundColor;
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
        color: (config: IDesignSystem): string => {
            return config.backgroundColor;
        },
        backgroundColor: (config: IDesignSystem): string => {
            return config.brandColor;
        },
        "&:hover": {
            backgroundColor: (config: IDesignSystem): string => {
                return Chroma(config.brandColor).alpha(0.8).css();
            }
        },
        "&:focus": {
            outline: "none",
            backgroundColor: (config: IDesignSystem): string => {
                return Chroma(config.brandColor).darken().css();
            }
        },
        "&:disabled, &[aria-disabled]": {
            backgroundColor: (config: IDesignSystem): string => {
                return config.brandColor;
            },
            "&:hover": {
                backgroundColor: (config: IDesignSystem): string => {
                    return config.brandColor;
                }
            }
        }
    },
    button_outline: {
        extend: "button",
        color: (config: IDesignSystem): string => {
            return config.foregroundColor;
        },
        ...applyPropertyDrivenColor("borderColor", 0.46),
        ...applyTransaprentBackground(),
        "&:hover": {
            ...applyPropertyDrivenColor("borderColor", 0.46, 0.8),
            ...applyTransaprentBackground()
        },
        "&:focus": {
            borderColor: "transparent",
            boxShadow: (config: IDesignSystem): string => {
                return `0 0 0 ${toPx(2)} ${applyMixedColor(config.foregroundColor, config.backgroundColor, 0.46)}`;
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
        padding: (config: IDesignSystem): string => {
            return localizeSpacing(config.direction)(`${toPx(13)} ${toPx(12)} ${toPx(12)} 0`);
        },
        textAlign: (config: IDesignSystem): string => config.direction === Direction.ltr ? "left" : "right"
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
            function(config: IDesignSystem): ICSSRules<IDesignSystem> {
                return {[config.direction === Direction.ltr ? "left" : "right"]: "0"};
            }
        }
    }
};

export default styles;
