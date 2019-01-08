import { toPx } from "@microsoft/fast-jss-utilities";
import { ComponentStyles, CSSRules } from "@microsoft/fast-jss-manager";
import { FormItemCheckboxClassNameContract } from "../class-name-contracts/";
import {
    applyLabelStyle,
    applySoftRemove,
    applySoftRemoveInput,
    applyWrapperStyle,
    colors,
    insetStrongBoxShadow,
} from "../utilities/form-input.style";

const styles: ComponentStyles<FormItemCheckboxClassNameContract, {}> = {
    formItemCheckbox: {
        ...applyWrapperStyle(),
        position: "relative",
    },
    formItemCheckbox__disabled: {
        color: "rgba(255, 255, 255, 0.7)",
        cursor: "not-allowed",
        "& $formItemCheckbox_label": {
            cursor: "not-allowed",
        },
    },
    formItemCheckbox_label: {
        ...applyLabelStyle(),
        marginLeft: "16px",
    },
    formItemCheckbox_input: {
        appearance: "none",
        width: "14px",
        height: "14px",
        boxSizing: "border-box",
        borderRadius: "2px",
        border: "1px solid #909090",
        float: "right",
        zIndex: "1",
        margin: "0",
        "&:disabled": {
            border: "1px solid #909090",
            color: "rgba(255, 255, 255, 0.7)",
            cursor: "not-allowed",
            "&::after, &::before": {
                background: "rgba(255, 255, 255, 0.7)",
            },
            "&:hover": {
                border: "1px solid #909090",
            },
        },
        "&:hover": {
            border: "1px solid #F2F2F2",
        },
        "&:focus": {
            outline: "none",
            ...insetStrongBoxShadow("#F2F2F2"),
        },
        "& + span": {
            position: "absolute",
            left: "0",
            width: "14px",
            height: "14px",
            "&::after, &::before": {
                position: "absolute",
                display: "block",
                content: "''",
                width: "1px",
                background: colors.white,
            },
        },
        "&:checked": {
            "& + span": {
                "&::before": {
                    height: "3px",
                    left: "4px",
                    top: "7px",
                    transform: "rotate(-45deg)",
                },
                "&::after": {
                    height: "8px",
                    left: "8px",
                    top: "2px",
                    transform: "rotate(45deg)",
                },
            },
        },
    },
    formItemCheckbox_softRemove: {
        ...applySoftRemove(),
    },
    formItemCheckbox_softRemoveInput: {
        ...applySoftRemoveInput(),
    },
};

export default styles;
