import { ComponentStyles, CSSRules } from "@microsoft/fast-jss-manager";
import { FormItemCheckboxClassNameContract } from "../class-name-contracts/";
import {
    applyControlSingleLineWrapper,
    applyLabelStyle,
    applySoftRemove,
    applySoftRemoveInput,
    DISABLED_OPACITY,
    foreground300,
    foreground800,
    insetStrongBoxShadow,
} from "./";

const styles: ComponentStyles<FormItemCheckboxClassNameContract, {}> = {
    formItemCheckbox: {
        ...applyControlSingleLineWrapper(),
        position: "relative",
    },
    formItemCheckbox__disabled: {
        opacity: `${DISABLED_OPACITY}`,
        cursor: "not-allowed",
        "& $formItemCheckbox_label": {
            cursor: "not-allowed",
        },
    },
    formItemCheckbox_label: {
        ...applyLabelStyle(),
        marginLeft: "8px",
    },
    formItemCheckbox_input: {
        appearance: "none",
        width: "14px",
        height: "14px",
        boxSizing: "border-box",
        borderRadius: "2px",
        border: `1px solid ${foreground800}`,
        float: "right",
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
    },
    formItemCheckbox_softRemove: {
        ...applySoftRemove(),
    },
    formItemCheckbox_softRemoveInput: {
        ...applySoftRemoveInput(),
    },
};

export default styles;
