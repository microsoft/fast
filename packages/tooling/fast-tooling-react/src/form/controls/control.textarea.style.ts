import { ComponentStyles } from "@microsoft/fast-jss-manager-react";
import { defaultFontStyle, inputStyle } from "../../style";

/**
 * Textarea class name contract
 */
export interface TextareaControlClassNameContract {
    textareaControl?: string;
    textareaControl__disabled?: string;
    textareaControl__default?: string;
}

const styles: ComponentStyles<TextareaControlClassNameContract, {}> = {
    textareaControl: {
        ...inputStyle,
        width: "100%",
        resize: "none",
        fontFamily: "inherit",
        "&$textareaControl__default": {
            ...defaultFontStyle,
        },
    },
    textareaControl__disabled: {},
    textareaControl__default: {},
};

export default styles;
