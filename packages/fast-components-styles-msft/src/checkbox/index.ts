import { IDesignSystem } from "../design-system";
import { ComponentStyles, ComponentStyleSheet, ICSSRules } from "@microsoft/fast-jss-manager";
import { ICheckboxClassNameContract } from "@microsoft/fast-components-class-name-contracts-base";
import { applyTypeRampConfig } from "../utilities/typography";
import { applyLocalizedProperty, Direction, toPx } from "@microsoft/fast-jss-utilities";
import * as Chroma from "chroma-js";
import { relative } from "path";

/* tslint:disable:max-line-length */
const styles: ComponentStyles<ICheckboxClassNameContract, IDesignSystem> = (config: IDesignSystem): ComponentStyleSheet<ICheckboxClassNameContract, IDesignSystem> => {
/* tslint:disable:max-line-length */
    return {
        checkbox: {
            display: "inline-flex",
            flexDirection: "row",
            alignItems: "center",
            cursor: "pointer"
        },
        checkbox_input: {
            cursor: "inherit",
            position: "absolute",
            width: toPx(20),
            height: toPx(20),
            appearance: "none",
            borderRadius: toPx(2),
            boxSizing: "content-box",
            margin: "0",
            zIndex: "1",
            boxShadow: (): string => {
                /* tslint:disable-next-line */
                return `inset ${toPx(0)} ${toPx(0)} ${toPx(0)} ${toPx(1)} ${Chroma.mix(config.foregroundColor, config.backgroundColor, 0.46).css()}`;
            },
            "&:hover": {
                boxShadow: (): string => {
                    /* tslint:disable-next-line */
                    return `inset ${toPx(0)} ${toPx(0)} ${toPx(0)} ${toPx(1)} ${Chroma.mix(config.foregroundColor, config.backgroundColor, 0.51).css()}`;
                }
            },
            "&:focus": {
                outline: "none",
                boxShadow: (): string => {
                    /* tslint:disable-next-line */
                    return `inset ${toPx(0)} ${toPx(0)} ${toPx(0)} ${toPx(2)} ${Chroma.mix(config.foregroundColor, config.backgroundColor, 0.46).css()}`;
                }
            },
            "&:checked": {
                "& + span": {
                    "&::after, &::before": {
                        position: "absolute",
                        zIndex: "1",
                        content: "\"\"",
                        borderRadius: toPx(2),
                        background: (): string => {
                            return config.foregroundColor;
                        }
                    }
                }
            },
            "&:indeterminate": {
                "& + span": {
                    "&::before": {
                        position: "absolute",
                        zIndex: "1",
                        content: "\"\"",
                        borderRadius: toPx(2),
                        transform: "none",
                        [applyLocalizedProperty("left", "right", config.direction)]: toPx(5),
                        top: toPx(5),
                        height: toPx(10),
                        width: toPx(10),
                        background: (): string => {
                            return config.foregroundColor;
                        }
                    }
                }
            }
        },
        checkbox_span: {
            position: "relative",
            borderRadius: toPx(2),
            display: "inline-block",
            width: toPx(20),
            height: toPx(20),
            "&::before, &::after": {
                width: toPx(2)
            },
            "&::before": {
                top: toPx(4),
                [applyLocalizedProperty("left", "right", config.direction)]: toPx(11),
                height: toPx(12),
                transform: (): string => config.direction === Direction.ltr ? "rotate(40deg)" : "rotate(-40deg)"
            },
            "&::after": {
                top: toPx(9),
                [applyLocalizedProperty("left", "right", config.direction)]: toPx(6),
                height: toPx(6),
                transform: (): string => config.direction === Direction.ltr ? "rotate(-45deg)" : "rotate(45deg)"
            }
        },
        checkbox_label: {
            color: (): string => {
                return config.foregroundColor;
            },
            ...applyTypeRampConfig("t7"),
            [applyLocalizedProperty("marginLeft", "marginRight", config.direction)]: toPx(5),
        },
        checkbox_disabled: {
            cursor: "not-allowed",
            opacity: ".6"
        }
    };
};

export default styles;
