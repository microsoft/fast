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
        display: "flex",
        marginBottom: "12px",
    },
    formItemNumberField_control: {
        ...applyControl(),
    },
    formItemNumberField_controlLabel: {
        ...applyLabelStyle(),
        display: "block",
        marginTop: "7px",
    },
    formItemNumberField_controlInput: {
        ...applyInputStyle(),
        marginTop: toPx(8),
        width: "100%",
    },
    formItemNumberField_softRemove: {
        ...applySoftRemove(),
    },
    formItemNumberField_softRemoveInput: {
        ...applySoftRemoveInput(),
    },
};

export default styles;
