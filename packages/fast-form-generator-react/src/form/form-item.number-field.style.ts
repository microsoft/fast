import { toPx } from "@microsoft/fast-jss-utilities";
import {
    applyControl,
    applyInputStyle,
    applyLabelStyle,
    applySoftRemove,
    applySoftRemoveInput,
    applyWrapperStyle,
} from "../utilities/form-input.style";
import { ComponentStyles } from "@microsoft/fast-jss-manager";
import { FormItemNumberFieldClassNameContract } from "../class-name-contracts/";

const styles: ComponentStyles<FormItemNumberFieldClassNameContract, {}> = {
    formItemNumberField: {
        position: "relative",
    },
    formItemNumberField_control: {
        ...applyControl(),
    },
    formItemNumberField_control_label: {
        ...applyLabelStyle(),
        display: "block",
        marginTop: toPx(12),
    },
    formItemNumberField_control_input: {
        ...applyInputStyle(),
        marginTop: toPx(8),
        width: "100%",
    },
    formItemNumberField_softRemove: {
        ...applySoftRemove(),
    },
    formItemNumberField_softRemove_input: {
        ...applySoftRemoveInput(),
    },
};

export default styles;
