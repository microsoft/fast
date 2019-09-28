import { ComponentStyles } from "@microsoft/fast-jss-manager-react";
import { applyInputStyle } from "../../style";

/**
 * Display class name contract
 */
export interface DisplayControlClassNameContract {
    displayControl?: string;
    displayControl__disabled?: string;
}

const styles: ComponentStyles<DisplayControlClassNameContract, {}> = {
    displayControl: {
        ...applyInputStyle(),
        width: "100%",
    },
    displayControl__disabled: {},
};

export default styles;
