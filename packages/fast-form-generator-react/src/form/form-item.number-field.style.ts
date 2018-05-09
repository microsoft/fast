import { toPx } from "@microsoft/fast-jss-utilities";
import { applyInputStyle, applyLabelStyle, applyWrapperStyle } from "../utilities/form-input.style";
import { ComponentStyles } from "@microsoft/fast-jss-manager";
import { IFormItemNumberFieldClassNameContract } from "../class-name-contracts/";

const styles: ComponentStyles<IFormItemNumberFieldClassNameContract, {}> = {
    formItemNumberField: {
        ...applyWrapperStyle()
    },
    formItemNumberField_label: {
        ...applyLabelStyle()
    },
    formItemNumberField_input: {
        minWidth: toPx(75),
        ...applyInputStyle()
    }
};

export default styles;
