import { ComponentStyles } from "@microsoft/fast-jss-manager";
import {
    applyControl,
    applyControlWrapper,
    applyFormItemDisabled,
    applyInputStyle,
    applyLabelStyle,
    applySoftRemove,
    applySoftRemoveInput,
    disabledOpacity,
} from "../../style";
import { FormItemNumberFieldClassNameContract } from "./form-item.number-field.props";

const styles: ComponentStyles<FormItemNumberFieldClassNameContract, {}> = {
    formItemNumberField: {
        display: "flex",
        ...applyControlWrapper(),
    },
    formItemNumberField__disabled: {
        ...applyFormItemDisabled(),
    },
    formItemNumberField_control: {
        ...applyControl(),
    },
    formItemNumberField_controlLabel: {
        ...applyLabelStyle(),
    },
    formItemNumberField_controlInput: {
        ...applyInputStyle(),
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
