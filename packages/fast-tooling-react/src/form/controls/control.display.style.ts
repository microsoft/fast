import { ComponentStyles } from "@microsoft/fast-jss-manager-react";
import { defaultFontStyle, inputStyle } from "../../style";

/**
 * Display class name contract
 */
export interface DisplayControlClassNameContract {
    displayControl?: string;
    displayControl__disabled?: string;
    displayControl__default?: string;
}

const styles: ComponentStyles<DisplayControlClassNameContract, {}> = {
    displayControl: {
        ...inputStyle,
        width: "100%",
        "&$displayControl__default": {
            ...defaultFontStyle,
        },
    },
    displayControl__disabled: {},
    displayControl__default: {},
};

export default styles;
