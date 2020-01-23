import { ComponentStyles } from "@microsoft/fast-jss-manager-react";
import { inputStyle } from "../../style";

/**
 * Textarea class name contract
 */
export interface TextareaControlClassNameContract {
    textareaControl?: string;
    textareaControl__disabled?: string;
}

const styles: ComponentStyles<TextareaControlClassNameContract, {}> = {
    textareaControl: {
        ...inputStyle,
        width: "100%",
        resize: "none",
        fontFamily: "inherit",
    },
    textareaControl__disabled: {},
};

export default styles;
