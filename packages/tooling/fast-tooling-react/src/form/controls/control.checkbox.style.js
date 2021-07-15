import { applyFocusVisible } from "@microsoft/fast-jss-utilities";
import {
    errorColorCSSProperty,
    insetStrongBoxShadow,
    L3FillColorProperty,
    textColorCSSProperty,
} from "../../style";
const styles = {
    checkboxControl: {
        position: "relative",
        height: "14px",
        width: "14px",
    },
    checkboxControl_input: Object.assign(
        Object.assign(
            {
                position: "absolute",
                appearance: "none",
                minWidth: "14px",
                height: "14px",
                boxSizing: "border-box",
                borderRadius: "2px",
                border: "1px solid transparent",
                zIndex: "1",
                margin: "0",
                "&:disabled": {
                    cursor: "not-allowed",
                },
                "&:hover": {
                    border: `1px solid ${textColorCSSProperty}`,
                },
            },
            applyFocusVisible(
                Object.assign(
                    { outline: "none" },
                    insetStrongBoxShadow(textColorCSSProperty)
                )
            )
        ),
        {
            "&:checked": {
                "& + $checkboxControl_checkmark": {
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
                borderColor: errorColorCSSProperty,
            },
            "&$checkboxControl__default": {
                "& + span": {
                    "&::after, &::before": {
                        background: textColorCSSProperty,
                    },
                },
            },
        }
    ),
    checkboxControl_checkmark: {
        position: "absolute",
        left: "0",
        width: "14px",
        height: "14px",
        background: L3FillColorProperty,
        "&::after, &::before": {
            position: "absolute",
            display: "block",
            content: "''",
            width: "1px",
            background: textColorCSSProperty,
        },
    },
    checkboxControl__disabled: {},
    checkboxControl__default: {},
};
export default styles;
