import designSystemDefaults, { IDesignSystem } from "../design-system";
import { ComponentStyles, ComponentStyleSheet, ICSSRules } from "@microsoft/fast-jss-manager";
import { applyLocalizedProperty, Direction, toPx } from "@microsoft/fast-jss-utilities";
import { typeRamp } from "../utilities/typography";
import { IToggleClassNameContract } from "@microsoft/fast-components-class-name-contracts-base";
import { get } from "lodash";
import * as Chroma from "chroma-js";

/* tslint:disable-next-line */
const styles: ComponentStyles<IToggleClassNameContract, IDesignSystem> = (config: IDesignSystem): ComponentStyleSheet<IToggleClassNameContract, IDesignSystem> => {
    const backgroundColor: string = get(config, "backgroundColor") || designSystemDefaults.backgroundColor;
    const brandColor: string = get(config, "brandColor") || designSystemDefaults.brandColor;
    const direction: Direction = get(config, "direction") || designSystemDefaults.direction;
    const foregroundColor: string = get(config, "foregroundColor") || designSystemDefaults.foregroundColor;

    return {
        toggle: {
            display: "inline-block",
            "& span": {
                userSelect: "none",
                marginTop: "0",
                paddingBottom: "0" },
            "&[aria-disabled=\"true\"]": {
                color: Chroma(foregroundColor).alpha(0.5).css()
            }
        },
        toggle_label: {
            display: "inline-block",
            fontSize: toPx(typeRamp.t8.vp3.fontSize),
            lineHeight: toPx(typeRamp.t8.vp3.lineHeight),
            paddingBottom: toPx(7),
            float: applyLocalizedProperty("left", "right", direction),
            clear: applyLocalizedProperty("left", "right", direction),
            "& + div": {
                marginTop: "0",
                float: applyLocalizedProperty("left", "right", direction),
                clear: applyLocalizedProperty("left", "right", direction),
                "& + span": {
                    float: applyLocalizedProperty("left", "right", direction),
                    [applyLocalizedProperty("margin-left", "margin-right", direction)]: toPx(5),
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
            [applyLocalizedProperty("left", "right", direction)]: toPx(5),
            transition: "all .1s ease",
            backgroundColor,
            borderRadius: toPx(10),
            width: toPx(10),
            height: toPx(10)
        },
        toggle_input: {
            position: "relative",
            margin: "0",
            width: toPx(44),
            height: toPx(20),
            background: backgroundColor,
            border: `${toPx(1)} solid`,
            borderColor: foregroundColor,
            borderRadius: toPx(20),
            appearance: "none",
            cursor: "pointer",
            "@media screen and (-ms-high-contrast:active)": {
                "&::after, &:checked + span": {
                    background: backgroundColor
                },
            },
            "@media screen and (-ms-high-contrast:black-on-white)": {
                "&::after, &:checked + span": {
                    background: foregroundColor
                }
            },
            "&:checked": {
                backgroundColor: brandColor,
                borderColor: brandColor,
                "&:hover": {
                    backgroundColor: Chroma(brandColor).alpha(0.8).css(),
                    borderColor: Chroma(brandColor).alpha(0.8).css()
                },
                "&:focus": {
                    borderColor: brandColor
                },
                "& + span": {
                    left: "28px",
                    backgroundColor
                },
                "&:disabled": {
                    cursor: "not-allowed",
                    background: Chroma(foregroundColor).alpha(0.2).css(),
                    borderColor: "transparent",
                    "& + span": {
                        background: Chroma(foregroundColor).alpha(0.2).css()
                    },
                    "&:hover": {
                        borderColor: "transparent"
                    }
                }
            },
            "&:not(:checked)": {
                borderColor: foregroundColor,
                "& + span": {
                    backgroundColor: foregroundColor
                },
                "&:disabled": {
                    cursor: "not-allowed",
                    borderColor: Chroma(foregroundColor).alpha(0.2).css(),
                    "& + span": {
                        backgroundColor: Chroma(foregroundColor).alpha(0.2).css()
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
