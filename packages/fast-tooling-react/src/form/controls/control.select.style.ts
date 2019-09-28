import { ComponentStyles, CSSRules } from "@microsoft/fast-jss-manager-react";
import { applySelectInputStyles, applySelectSpanStyles } from "../../style";

/**
 * Select class name contract
 */
export interface SelectControlClassNameContract {
    selectControl?: string;
    selectControl__disabled?: string;
    selectControl_input?: string;
}

const styles: ComponentStyles<SelectControlClassNameContract, {}> = {
    selectControl: {
        ...applySelectSpanStyles(),
    },
    selectControl__disabled: {},
    selectControl_input: {
        ...applySelectInputStyles(),
    },
};

export default styles;
