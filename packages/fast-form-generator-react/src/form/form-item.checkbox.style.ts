import { Direction, ellipsis, localizeSpacing, toPx } from "@microsoft/fast-jss-utilities";
import { ComponentStyles, ICSSRules } from "@microsoft/fast-jss-manager";
import { IFormItemCheckboxClassNameContract } from "../class-name-contracts/";
import { applyLabelStyle } from "../utilities/form-input.style";

const styles: ComponentStyles<IFormItemCheckboxClassNameContract, {}> = {
    formItemCheckbox: {
        display: "flex",
        flexDirection: "row"
    },
    formItemCheckbox_label: {
        ...applyLabelStyle(),
        position: "relative",
        lineHeight: toPx(31),
        marginRight: "0"
    },
    formItemCheckbox_input: {
        appearance: "none",
        width: toPx(20),
        height: toPx(20),
        borderRadius: toPx(2),
        boxShadow: `inset ${toPx(0)} 0${toPx(0)} ${toPx(4)} rgba(0, 0, 0, 0.08)`,
        backgroundColor: "rgba(0, 0, 0, 0.04)",
        float: "right",
        "&:focus": {
            outline: "none",
            boxShadow: `inset ${toPx(0)} ${toPx(0)} ${toPx(0)} ${toPx(1)} rgba(0,0,0, 0.5)`
        },
        "& + span": {
            position: "absolute",
            right: toPx(8),
            top: toPx(3),
            width: toPx(16),
            height: toPx(16),
            cursor: "pointer",
            "&:after, &:before": {
                position: "absolute",
                display: "block",
                content: "''",
                width: toPx(1),
                background: "#FB356D"
            }
        },
        "&:checked": {
            "& + span": {
                "&:before": {
                    height: toPx(5),
                    left: toPx(6),
                    top: toPx(10),
                    transform: "rotate(-45deg)"
                },
                "&:after": {
                    height: toPx(12),
                    left: toPx(12),
                    top: toPx(4),
                    transform: "rotate(45deg)"
                }
            }
        }
    },
    // formItemCheckbox_input: {
    //     position: "relative",
    //     cursor: "pointer",
    //     width: toPx(20),
    //     height: toPx(20),
    //     appearance: "none",
    //     borderRadius: toPx(2),
    //     boxShadow: `inset ${toPx(0)} 0${toPx(0)} ${toPx(4)} rgba(0, 0, 0, 0.08)`,
    //     backgroundColor: "rgba(0, 0, 0, 0.04)",
    //     "&:after, &:before": {
    //         position: "absolute",
    //         display: "block",
    //         content: "''",
    //         width: toPx(1),
    //         background: "#FB356D"
    //     },
    //     "&:focus": {
    //         outline: "none",
    //         boxShadow: `inset ${toPx(0)} ${toPx(0)} ${toPx(0)} ${toPx(1)} rgba(0,0,0, 0.5)`
    //     },
    //     "&:checked": {
    //         "&:before": {
    //             height: toPx(5),
    //             left: toPx(6),
    //             top: toPx(10),
    //             transform: "rotate(-45deg)"
    //         },
    //         "&:after": {
    //             height: toPx(12),
    //             left: toPx(12),
    //             top: toPx(4),
    //             transform: "rotate(45deg)"
    //         }
    //     }
    // }
};

export default styles;
