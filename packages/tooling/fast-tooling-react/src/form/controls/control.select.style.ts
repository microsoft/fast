import { ComponentStyles } from "@microsoft/fast-jss-manager-react";
import { defaultFontStyle, selectInputStyle, selectSpanStyle } from "../../style";

/**
 * Select class name contract
 */
export interface SelectControlClassNameContract {
    selectControl?: string;
    selectControl__disabled?: string;
    selectControl__default?: string;
    selectControl_input?: string;
}

const styles: ComponentStyles<SelectControlClassNameContract, {}> = {
    selectControl: {
        ...selectSpanStyle,
        "&$selectControl__default $selectControl_input": {
            ...defaultFontStyle,
        },
    },
    selectControl__disabled: {},
    selectControl_input: {
        ...selectInputStyle,
    },
    selectControl__default: {},
};

export default styles;
