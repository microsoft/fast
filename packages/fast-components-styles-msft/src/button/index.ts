import { IDesignSystem } from "../design-system";
import { ComponentStyles, ICSSRules } from "@microsoft/fast-jss-manager";
import { IButtonClassNameContract } from "@microsoft/fast-components-class-name-contracts-base";
import { IMSFTButtonClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";
import { toPx } from "@microsoft/fast-jss-utilities";
import { applyType } from "../utilities/typography";
import * as Chroma from "chroma-js";
import { isNullOrUndefined } from "util";

function applyTransaprentBackplateStyles(): ICSSRules<IDesignSystem> {
    return {
        extend: "button",
        backgroundColor: (): string => {
            return "transparent";
        },
        "&:hover": {
            backgroundColor: (): string => {
                return "transparent";
            }
        },
        color: (config: IDesignSystem): string => {
            return config.brandColor;
        },
        "&:disabled span:before, &[aria-disabled] span:before": {
            background: "transparent"
        },
        "&:focus span:before, &:active span:before, &:hover span:before": {
            // TODO: Issue #309 https://github.com/Microsoft/fast-dna/issues/309
            background: (config: IDesignSystem): string => {
                return config.brandColor;
            }
        },
        "&:disabled, &[aria-disabled]": {
            "&:hover": {
                background: (): string => {
                    return "transparent";
                }
            }
        }
    };
}

function applyMixedColor(incomingProperty: string, value?: number, alpha?: number, accent?: boolean): ICSSRules<IDesignSystem> {

    function applyColors(config: IDesignSystem): string {
        if (alpha) {
            if (accent && isNullOrUndefined(value)) {
                return Chroma(config.brandColor).alpha(alpha).css();
            } else {
                return Chroma.mix(config.foregroundColor, config.backgroundColor, value).alpha(alpha).css();
            }
        } else {
            return Chroma.mix(config.foregroundColor, config.backgroundColor, value).css();
        }
    }

    switch (incomingProperty) {
        case "background":
            return {background: (config: IDesignSystem): string => {
                return applyColors(config);
            }};
        case "backgroundColor":
            return {backgroundColor: (config: IDesignSystem): string => {
                return applyColors(config);
            }};
        case "boxShadowColor":
            return {boxShadowColor: (config: IDesignSystem): string => {
                return applyColors(config);
            }};
        case "borderColor":
            return {borderColor: (config: IDesignSystem): string => {
                return applyColors(config);
            }
        };
    }
}

const styles: ComponentStyles<IMSFTButtonClassNameContract, IDesignSystem> = {
    button: {
        ...applyType("t7", "vp1"),
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
        whiteSpace: "nowrap",
        verticalAlign: "bottom",
        transition: "all 0.2s ease-in-out",
        color: (config: IDesignSystem): string => {
            return config.backgroundColor;
        },
        ...applyMixedColor("backgroundColor", 0.46),
        "&:hover": {
            ...applyMixedColor("backgroundColor", 0.46, 0.8)
        },
        "&:focus": {
            outline: "none",
            ...applyMixedColor("backgroundColor", 0.38)
        },
        "&:disabled, &[aria-disabled]": {
            opacity: ".4",
            cursor: "not-allowed",
            "&:hover": {
                ...applyMixedColor("backgroundColor", 0.46)
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
            ...applyMixedColor("backgroundColor", null, 0.8, true)
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
        ...applyMixedColor("borderColor", 0.46),
        backgroundColor: (): string => {
            return "transparent";
        },
        "&:hover": {
            ...applyMixedColor("borderColor", 0.46, 0.8),
            backgroundColor: (): string => {
                return "transparent";
            }
        },
        "&:focus": {
            borderColor: "transparent",
            boxShadow: `0 0 0 ${toPx(2)}`,
            ...applyMixedColor("boxShadowColor", 0.46),
            backgroundColor: (): string => {
                return "transparent";
            }
        },
        "&:disabled, &[aria-disabled]": {
            ...applyMixedColor("backgroundColor", 0.46),
            "&:hover": {
                ...applyMixedColor("backgroundColor", 0.46)
            }
        }
    },
    button_lightweight: {
        ...applyTransaprentBackplateStyles()
    },
    button_justified: {
        ...applyTransaprentBackplateStyles(),
        padding: `${toPx(23)} ${toPx(2)} ${toPx(2)} 0`
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
            left: "0"
        }
    }
};

export default styles;
