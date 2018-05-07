import { Direction, ellipsis, localizeSpacing, toPx } from "@microsoft/fast-jss-utilities";
import { ComponentStyles, ICSSRules } from "@microsoft/fast-jss-manager";
import { IFormItemCheckboxClassNameContract } from "../class-name-contracts/";

const styles: ComponentStyles<IFormItemCheckboxClassNameContract, {}> = {
    formItemCheckbox: {
        display: "flex",
        flexDirection: "row"
    },
    formItemCheckbox_label: {
        flexGrow: "1",
        lineHeight: toPx(16),
        fontSize: toPx(14),
        marginRight: toPx(16),
        ...ellipsis()
    },
    formItemCheckbox_input: {
        position: "relative",
        cursor: "pointer",
        width: toPx(20),
        height: toPx(20),
        appearance: "none",
        borderRadius: toPx(2),
        boxShadow: "inset 0px 0px 4px rgba(0, 0, 0, 0.08)",
        backgroundColor: "rgba(0, 0, 0, 0.04)",
        "&:after, &:before": {
            position: "absolute",
            display: "block",
            content: "''",
            width: toPx(1),
            background: "#FB356D"
        },
        "&:focus": {
            outline: "none",
            boxShadow: " inset 0px 0px 0px 1px rgba(0,0,0, 0.5)"
        },
        "&:checked": {
            "&:before": {
                height: toPx(5),
                left: toPx(5),
                top: toPx(9),
                transform: "rotate(-45deg)"
            },
            "&:after": {
                height: toPx(11),
                left: toPx(10),
                top: toPx(4),
                transform: "rotate(45deg)"
            }
        }
    }
};

export default styles;
