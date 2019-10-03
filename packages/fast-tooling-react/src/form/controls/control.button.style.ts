import { ComponentStyles } from "@microsoft/fast-jss-manager-react";
import { applyInputStyle } from "../../style";

/**
 * Button class name contract
 */
export interface ButtonControlClassNameContract {
    buttonControl?: string;
    buttonControl__disabled?: string;
}

const styles: ComponentStyles<ButtonControlClassNameContract, {}> = {
    buttonControl: {
        ...applyInputStyle(),
        width: "100%",
        textAlign: "start",
    },
    buttonControl__disabled: {},
};

export default styles;
