import { Direction, ellipsis, localizeSpacing, toPx } from "@microsoft/fast-jss-utilities";
import { ComponentStyles, ICSSRules } from "@microsoft/fast-jss-manager";
import {
    applyInputStyle,
    applyLabelStyle,
    applySelectInputStyles,
    applySelectSpanStyles,
    applyWrapperStyle
} from "../utilities/form-input.style";
import { IFormItemSelectClassNameContract } from "../class-name-contracts/";

const styles: ComponentStyles<IFormItemSelectClassNameContract, {}> = {
    formItemSelect: {
        ...applyWrapperStyle()
    },
    formItemSelect_label: {
        ...applyLabelStyle()
    },
    formItemSelect_span: {
        ...applySelectSpanStyles()
    },
    formItemSelect_input: {
        ...applySelectInputStyles()
    }
};

export default styles;
