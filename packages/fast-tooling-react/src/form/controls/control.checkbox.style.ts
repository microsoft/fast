import { ComponentStyles, CSSRules } from "@microsoft/fast-jss-manager-react";
import { CheckboxFormControlClassNameContract } from "./control.checkbox.props";
import { applyFocusVisible } from "@microsoft/fast-jss-utilities";
import {
    applyControlSingleLineWrapper,
    applyFormControlDisabled,
    applyFormControlIndicator,
    applyInteractiveFormControlIndicator,
    applyInvalidMessage,
    applyLabelStyle,
    applySoftRemove,
    applySoftRemoveInput,
    error,
    foreground300,
    foreground800,
    insetStrongBoxShadow,
} from "../../style";

const styles: ComponentStyles<CheckboxFormControlClassNameContract, {}> = {
    checkboxFormControl: {},
    checkboxFormControl_control: {
        ...applyControlSingleLineWrapper(),
        position: "relative",
    },
    checkboxFormControl__disabled: {
        ...applyFormControlDisabled(),
    },
    checkboxFormControl_badge: {
        ...applyFormControlIndicator(),
    },
    checkboxFormControl_defaultValueIndicator: {
        ...applyInteractiveFormControlIndicator(),
    },
    checkboxFormControl_label: {
        ...applyLabelStyle(),
        marginLeft: "8px",
    },
    checkboxFormControl_input: {
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
        ...applyFocusVisible({
            outline: "none",
            ...insetStrongBoxShadow(foreground300),
        }),
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
    checkboxFormControl_invalidMessage: {
        ...applyInvalidMessage(),
    },
    checkboxFormControl_softRemove: {
        ...applySoftRemove(),
    },
    checkboxFormControl_softRemoveInput: {
        ...applySoftRemoveInput(),
    },
};

export default styles;
