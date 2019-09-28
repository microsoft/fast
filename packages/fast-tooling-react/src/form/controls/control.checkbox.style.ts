import { ComponentStyles, CSSRules } from "@microsoft/fast-jss-manager-react";
import { applyFocusVisible } from "@microsoft/fast-jss-utilities";
import { error, foreground300, foreground800, insetStrongBoxShadow } from "../../style";

/**
 * Checkbox class name contract
 */
export interface CheckboxControlClassNameContract {
    checkboxControl?: string;
    checkboxControl__disabled?: string;
}

const styles: ComponentStyles<CheckboxControlClassNameContract, {}> = {
    checkboxControl: {
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
    checkboxControl__disabled: {},
};

export default styles;
