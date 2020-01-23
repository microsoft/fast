import { ComponentStyles } from "@microsoft/fast-jss-manager-react";
import { inputStyle } from "../../style";

/**
 * Number field class name contract
 */
export interface NumberFieldControlClassNameContract {
    numberFieldControl?: string;
    numberFieldControl__disabled?: string;
}

const styles: ComponentStyles<NumberFieldControlClassNameContract, {}> = {
    numberFieldControl: {
        ...inputStyle,
        width: "100%",
    },
    numberFieldControl__disabled: {},
};

export default styles;
