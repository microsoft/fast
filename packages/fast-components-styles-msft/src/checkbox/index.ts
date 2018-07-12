import designSystemDefaults, { IDesignSystem } from "../design-system";
import { ComponentStyles, ComponentStyleSheet, ICSSRules } from "@microsoft/fast-jss-manager";
import { ICheckboxClassNameContract } from "@microsoft/fast-components-class-name-contracts-base";
import { applyTypeRampConfig } from "../utilities/typography";
import { applyLocalizedProperty, Direction, toPx } from "@microsoft/fast-jss-utilities";
import { get } from "lodash-es";
import * as Chroma from "chroma-js";

/* tslint:disable:max-line-length */
const styles: ComponentStyles<ICheckboxClassNameContract, IDesignSystem> = (config: IDesignSystem): ComponentStyleSheet<ICheckboxClassNameContract, IDesignSystem> => {
/* tslint:disable:max-line-length */
    const backgroundColor: string = get(config, "backgroundColor") || designSystemDefaults.backgroundColor;
    const brandColor: string = get(config, "brandColor") || designSystemDefaults.brandColor;
    const direction: Direction = get(config, "direction") || designSystemDefaults.direction;
    const foregroundColor: string = get(config, "foregroundColor") || designSystemDefaults.foregroundColor;

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
            background: backgroundColor,
            /* tslint:disable-next-line */
            boxShadow: `inset ${toPx(0)} ${toPx(0)} ${toPx(0)} ${toPx(1)} ${Chroma.mix(foregroundColor, backgroundColor, 0.46).css()}`,
            "&:hover": {
                /* tslint:disable-next-line */
                boxShadow: `inset ${toPx(0)} ${toPx(0)} ${toPx(0)} ${toPx(1)} ${Chroma.mix(foregroundColor, backgroundColor, 0.51).css()}`
            },
            "&:focus": {
                outline: "none",
                /* tslint:disable-next-line */
                boxShadow: `inset ${toPx(0)} ${toPx(0)} ${toPx(0)} ${toPx(2)} ${Chroma.mix(foregroundColor, backgroundColor, 0.46).css()}`
            },
            "&:checked": {
                "& + span": {
                    "&::after, &::before": {
                        position: "absolute",
                        zIndex: "1",
                        content: "\"\"",
                        borderRadius: toPx(2),
                        background: foregroundColor
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
                        [applyLocalizedProperty("left", "right", direction)]: toPx(5),
                        top: toPx(5),
                        height: toPx(10),
                        width: toPx(10),
                        background: foregroundColor
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
                left: toPx(11),
                height: toPx(12),
                transform: "rotate(40deg)"
            },
            "&::after": {
                top: toPx(9),
                left: toPx(6),
                height: toPx(6),
                transform: "rotate(-45deg)"
            }
        },
        checkbox_label: {
            color: foregroundColor,
            ...applyTypeRampConfig("t7"),
            [applyLocalizedProperty("marginLeft", "marginRight", direction)]: toPx(5),
        },
        checkbox_disabled: {
            cursor: "not-allowed",
            opacity: ".6"
        }
    };
};

export default styles;
