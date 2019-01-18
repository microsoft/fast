import {
    applyControl,
    applyControlWrapper,
    applyInputStyle,
    applyLabelStyle,
    applySoftRemove,
    applySoftRemoveInput,
} from "../utilities";
import { ComponentStyles } from "@microsoft/fast-jss-manager";
import { FormItemNumberFieldClassNameContract } from "../class-name-contracts/";

const styles: ComponentStyles<FormItemNumberFieldClassNameContract, {}> = {
    formItemNumberField: {
        display: "flex",
        ...applyControlWrapper(),
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
