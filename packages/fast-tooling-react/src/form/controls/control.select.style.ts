import { ComponentStyles, CSSRules } from "@microsoft/fast-jss-manager-react";
import { selectInputStyle, selectSpanStyle } from "../../style";

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
        ...selectSpanStyle,
    },
    selectControl__disabled: {},
    selectControl_input: {
        ...selectInputStyle,
    },
};

export default styles;
