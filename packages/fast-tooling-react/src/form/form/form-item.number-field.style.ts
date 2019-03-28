import { ComponentStyles } from "@microsoft/fast-jss-manager";
import {
    applyControl,
    applyControlWrapper,
    applyFormItemBadge,
    applyFormItemDisabled,
    applyInputStyle,
    applyLabelRegionStyle,
    applyLabelStyle,
    applySoftRemove,
    applySoftRemoveInput,
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
    formItemNumberField_badge: {
        ...applyFormItemBadge(),
    },
    formItemNumberField_control: {
        ...applyControl(),
    },
    formItemNumberField_controlLabel: {
        ...applyLabelStyle(),
    },
    formItemNumberField_controlLabelRegion: {
        ...applyLabelRegionStyle(),
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
