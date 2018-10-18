import { ComponentStyles, CSSRules } from "@microsoft/fast-jss-manager";
import {
    applyInputStyle,
    applyLabelStyle,
    applySelectInputStyles,
    applySelectSpanStyles,
    applyWrapperStyle,
} from "../utilities/form-input.style";
import { FormItemSelectClassNameContract } from "../class-name-contracts/";

const styles: ComponentStyles<FormItemSelectClassNameContract, {}> = {
    formItemSelect: {
        ...applyWrapperStyle(),
    },
    formItemSelect_label: {
        ...applyLabelStyle(),
    },
    formItemSelect_span: {
        ...applySelectSpanStyles(),
    },
    formItemSelect_input: {
        ...applySelectInputStyles(),
    },
};

export default styles;
