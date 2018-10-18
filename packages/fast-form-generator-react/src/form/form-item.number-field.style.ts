import { toPx } from "@microsoft/fast-jss-utilities";
import {
    applyInputStyle,
    applyLabelStyle,
    applyWrapperStyle,
} from "../utilities/form-input.style";
import { ComponentStyles } from "@microsoft/fast-jss-manager";
import { FormItemNumberFieldClassNameContract } from "../class-name-contracts/";

const styles: ComponentStyles<FormItemNumberFieldClassNameContract, {}> = {
    formItemNumberField: {
        ...applyWrapperStyle(),
    },
    formItemNumberField_label: {
        ...applyLabelStyle(),
    },
    formItemNumberField_input: {
        maxWidth: toPx(75),
        ...applyInputStyle(),
    },
};

export default styles;
