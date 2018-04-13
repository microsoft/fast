import { IDesignSystem } from "../design-system";
import { ComponentStyles } from "@microsoft/fast-jss-manager";
import { toPx } from "../utilities/units";
import { typeRamp } from "../utilities/typography";
import { IToggleClassNameContract } from "@microsoft/fast-components-class-name-contracts-base";
import * as Chroma from "chroma-js";

const styles: ComponentStyles<IToggleClassNameContract, IDesignSystem> = {
    toggle: {
        "& span": {
            userSelect: "none",
            marginTop: "0",
            paddingBottom: "0"
        },
        "&[aria-disabled='true']": {
            color: (config: IDesignSystem): string => {
                return Chroma(config.foregroundColor).alpha(0.5).css();
            }
        }
    },
    toggle_label: {
        display: "inline-block",
        fontSize: toPx(typeRamp.t8.vp3.fontSize),
        lineHeight: toPx(typeRamp.t8.vp3.lineHeight),
        marginTop: toPx(21),
        paddingBottom: toPx(7),
        float: "left",
        clear: "left",
        "& + div": {
            marginTop: "0",
            float: "left",
            clear: "left",
            "& + span": {
                float: "left",
                marginLeft: toPx(5)
            }
        }
    },
    toggle_wrapper: {
        position: "relative"
    },
    toggle_button: {
        position: "absolute",
        pointerEvents: "none",
        left: toPx(5),
        top: toPx(5),
        transition: "all .1s ease",
        backgroundColor: (config: IDesignSystem): string => {
            return config.backgroundColor;
        },
        content: "''",
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
        borderColor: (config: IDesignSystem): string => {
            return config.foregroundColor;
        },
        borderRadius: toPx(20),
        appearance: "none",
        cursor: "pointer",
        "@media screen and (-ms-high-contrast)": {
            "&:after, &:checked+span": {
                background: (config: IDesignSystem): string => {
                    return config.backgroundColor;
                }
            }
        },
        "@media screen and (-ms-high-contrast: black-on-white)": {
            "&:after, &:checked+span": {
                background: (config: IDesignSystem): string => {
                    return config.foregroundColor;
                }
            }
        },
        "&:checked": {
            backgroundColor: (config: IDesignSystem): string => {
                return config.brandColor;
            },
            borderColor: (config: IDesignSystem): string => {
                return config.brandColor;
            },
            "&:hover": {
                backgroundColor: (config: IDesignSystem): string => {
                    return Chroma(config.brandColor).alpha(0.8).css();
                },
                borderColor: (config: IDesignSystem): string => {
                    return Chroma(config.brandColor).alpha(0.8).css();
                }
            },
            "&:focus": {
                borderColor: (config: IDesignSystem): string => {
                    return config.brandColor;
                }
            },
            "& + span": {
                left: "28px",
                backgroundColor: (config: IDesignSystem): string => {
                    return config.backgroundColor;
                }
            },
            "&:disabled": {
                cursor: "not-allowed",
                background: (config: IDesignSystem): string => {
                    return Chroma(config.foregroundColor).alpha(0.2).css();
                },
                borderColor: "transparent",
                "& + span": {
                    background: (config: IDesignSystem): string => {
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
            borderColor: (config: IDesignSystem): string => {
                return config.foregroundColor;
            },
            "& + span": {
                backgroundColor: (config: IDesignSystem): string => {
                    return config.foregroundColor;
                }
            },
            "&:disabled": {
                cursor: "not-allowed",
                background: "transparent",
                borderColor: (config: IDesignSystem): string => {
                    return Chroma(config.foregroundColor).alpha(0.2).css();
                },
                "& + span": {
                    backgroundColor: (config: IDesignSystem): string => {
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

export default styles;
