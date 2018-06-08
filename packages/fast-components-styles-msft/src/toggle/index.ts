import { IDesignSystem } from "../design-system";
import { ComponentStyles, ComponentStyleSheet, ICSSRules } from "@microsoft/fast-jss-manager";
import { applyLocalizedProperty, toPx } from "@microsoft/fast-jss-utilities";
import { typeRamp } from "../utilities/typography";
import { IToggleClassNameContract } from "@microsoft/fast-components-class-name-contracts-base";
import * as Chroma from "chroma-js";
import { Direction } from "@microsoft/fast-application-utilities";

function setFloatAndClear(clearFloat: boolean = true): ICSSRules<IDesignSystem> {
    return {
        float: (config: IDesignSystem): string => config.direction === Direction.ltr ? "left" : "right",
        clear: clearFloat ? ((config: IDesignSystem): string => config.direction === Direction.ltr ? "left" : "right") : null
    };
}

/* tslint:disable:max-line-length */
const styles: ComponentStyles<IToggleClassNameContract, IDesignSystem> = (config: IDesignSystem): ComponentStyleSheet<IToggleClassNameContract, IDesignSystem> => {
/* tslint:enable:max-line-length */
    return {
        toggle: {
            display: "inline-block",
            "& span": {
                userSelect: "none",
                marginTop: "0",
                paddingBottom: "0" },
            "&[aria-disabled=\"true\"]": {
                color: (): string => {
                    return Chroma(config.foregroundColor).alpha(0.5).css();
                }
            }
        },
        toggle_label: {
            display: "inline-block",
            fontSize: toPx(typeRamp.t8.vp3.fontSize),
            lineHeight: toPx(typeRamp.t8.vp3.lineHeight),
            paddingBottom: toPx(7),
            ...setFloatAndClear(),
            "& + div": {
                marginTop: "0",
                ...setFloatAndClear(),
                "& + span": {
                    ...setFloatAndClear(false),
                    [applyLocalizedProperty("margin-left", "margin-right", config.direction)]: toPx(5),
                }
            }
        },
        toggle_wrapper: {
            position: "relative"
        },
        toggle_button: {
            position: "absolute",
            pointerEvents: "none",
            top: toPx(5),
            [applyLocalizedProperty("left", "right", config.direction)]: toPx(5),
            transition: "all .1s ease",
            backgroundColor: (): string => {
                return config.backgroundColor;
            },
            borderRadius: toPx(10),
            width: toPx(10),
            height: toPx(10)
        },
        toggle_input: {
            position: "relative",
            margin: "0",
            width: toPx(44),
            height: toPx(20),
            background: "transparent",
            border: `${toPx(1)} solid`,
            borderColor: (): string => {
                return config.foregroundColor;
            },
            borderRadius: toPx(20),
            appearance: "none",
            cursor: "pointer",
            "@media screen and (-ms-high-contrast:active)": {
                "&::after, &:checked + span": {
                    background: (): string => {
                        return config.backgroundColor;
                    }
                },
            },
            "@media screen and (-ms-high-contrast:black-on-white)": {
                "&::after, &:checked + span": {
                    background: (): string => {
                        return config.foregroundColor;
                    }
                }
            },
            "&:checked": {
                backgroundColor: (): string => {
                    return config.brandColor;
                },
                borderColor: (): string => {
                    return config.brandColor;
                },
                "&:hover": {
                    backgroundColor: (): string => {
                        return Chroma(config.brandColor).alpha(0.8).css();
                    },
                    borderColor: (): string => {
                        return Chroma(config.brandColor).alpha(0.8).css();
                    }
                },
                "&:focus": {
                    borderColor: (): string => {
                        return config.brandColor;
                    }
                },
                "& + span": {
                    left: "28px",
                    backgroundColor: (): string => {
                        return config.backgroundColor;
                    }
                },
                "&:disabled": {
                    cursor: "not-allowed",
                    background: (): string => {
                        return Chroma(config.foregroundColor).alpha(0.2).css();
                    },
                    borderColor: "transparent",
                    "& + span": {
                        background: (): string => {
                            return Chroma(config.foregroundColor).alpha(0.2).css();
                        }
                    },
                    "&:hover": {
                        borderColor: "transparent"
                    }
                }
            },
            "&:not(:checked)": {
                background: "transparent",
                borderColor: (): string => {
                    return config.foregroundColor;
                },
                "& + span": {
                    backgroundColor: (): string => {
                        return config.foregroundColor;
                    }
                },
                "&:disabled": {
                    cursor: "not-allowed",
                    background: "transparent",
                    borderColor: (): string => {
                        return Chroma(config.foregroundColor).alpha(0.2).css();
                    },
                    "& + span": {
                        backgroundColor: (): string => {
                            return Chroma(config.foregroundColor).alpha(0.2).css();
                        }
                    }
                }
            },
            "&:focus": {
                outline: "0"
            }
        }
    };
};

export default styles;
