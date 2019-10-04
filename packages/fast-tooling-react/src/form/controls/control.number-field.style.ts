import { ComponentStyles } from "@microsoft/fast-jss-manager-react";
import { applyInputStyle } from "../../style";

/**
 * Number field class name contract
 */
export interface NumberFieldControlClassNameContract {
    numberFieldControl?: string;
    numberFieldControl__disabled?: string;
}

const styles: ComponentStyles<NumberFieldControlClassNameContract, {}> = {
    numberFieldControl: {
        ...applyInputStyle(),
        width: "100%",
    },
    numberFieldControl__disabled: {},
};

export default styles;
