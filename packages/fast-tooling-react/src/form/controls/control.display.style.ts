import { ComponentStyles } from "@microsoft/fast-jss-manager-react";
import { inputStyle } from "../../style";

/**
 * Display class name contract
 */
export interface DisplayControlClassNameContract {
    displayControl?: string;
    displayControl__disabled?: string;
}

const styles: ComponentStyles<DisplayControlClassNameContract, {}> = {
    displayControl: {
        ...inputStyle,
        width: "100%",
    },
    displayControl__disabled: {},
};

export default styles;
