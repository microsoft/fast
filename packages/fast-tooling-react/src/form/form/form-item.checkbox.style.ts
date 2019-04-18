import { ComponentStyles, CSSRules } from "@microsoft/fast-jss-manager-react";
import { FormItemCheckboxClassNameContract } from "./form-item.checkbox.props";
import {
    applyControlSingleLineWrapper,
    applyFormItemDisabled,
    applyFormItemIndicator,
    applyInvalidMessage,
    applyLabelStyle,
    applySoftRemove,
    applySoftRemoveInput,
    error,
    foreground300,
    foreground800,
    insetStrongBoxShadow,
} from "../../style";

const styles: ComponentStyles<FormItemCheckboxClassNameContract, {}> = {
    formItemCheckbox: {},
    formItemCheckbox_control: {
        ...applyControlSingleLineWrapper(),
        position: "relative",
    },
    formItemCheckbox__disabled: {
        ...applyFormItemDisabled(),
    },
    formItemCheckbox_badge: {
        ...applyFormItemIndicator(),
    },
    formItemCheckbox_defaultValueIndicator: {
        ...applyFormItemIndicator(),
    },
    formItemCheckbox_label: {
        ...applyLabelStyle(),
        marginLeft: "8px",
    },
    formItemCheckbox_input: {
        appearance: "none",
        minWidth: "14px",
        height: "14px",
        boxSizing: "border-box",
        borderRadius: "2px",
        border: `1px solid ${foreground800}`,
        zIndex: "1",
        margin: "0",
        "&:disabled": {
            cursor: "not-allowed",
        },
        "&:hover": {
            border: `1px solid ${foreground300}`,
        },
        "&:focus": {
            outline: "none",
            ...insetStrongBoxShadow(foreground300),
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
                background: foreground300,
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
        "&:invalid": {
            borderColor: error,
        },
    },
    formItemCheckbox_invalidMessage: {
        ...applyInvalidMessage(),
    },
    formItemCheckbox_softRemove: {
        ...applySoftRemove(),
    },
    formItemCheckbox_softRemoveInput: {
        ...applySoftRemoveInput(),
    },
};

export default styles;
