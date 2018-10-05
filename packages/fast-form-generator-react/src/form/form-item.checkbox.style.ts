import { toPx } from "@microsoft/fast-jss-utilities";
import { ComponentStyles, CSSRules } from "@microsoft/fast-jss-manager";
import { FormItemCheckboxClassNameContract } from "../class-name-contracts/";
import { applyLabelStyle, applyWrapperStyle, colors, insetStrongBoxShadow } from "../utilities/form-input.style";

const styles: ComponentStyles<FormItemCheckboxClassNameContract, {}> = {
    formItemCheckbox: {
        ...applyWrapperStyle(),
        position: "relative"
    },
    formItemCheckbox_label: {
        ...applyLabelStyle()
    },
    formItemCheckbox_input: {
        appearance: "none",
        width: toPx(20),
        height: toPx(20),
        borderRadius: toPx(2),
        boxShadow: `inset ${toPx(0)} 0${toPx(0)} ${toPx(4)} ${colors.boxShadow}`,
        backgroundColor: colors.grayBackground,
        float: "right",
        zIndex: "1",
        margin: "0",
        "&:hover": {
            ...insetStrongBoxShadow(colors.hover)
        },
        "&:focus": {
            outline: "none",
            ...insetStrongBoxShadow(colors.pink)
        },
        "& + span": {
            position: "absolute",
            right: "0",
            width: toPx(20),
            height: toPx(20),
            "&::after, &::before": {
                position: "absolute",
                display: "block",
                content: "''",
                width: toPx(1),
                background: colors.pink
            }
        },
        "&:checked": {
            "& + span": {
                "&::before": {
                    height: toPx(5),
                    left: toPx(6),
                    top: toPx(10),
                    transform: "rotate(-45deg)"
                },
                "&::after": {
                    height: toPx(12),
                    left: toPx(12),
                    top: toPx(4),
                    transform: "rotate(45deg)"
                }
            }
        }
    }
};

export default styles;
