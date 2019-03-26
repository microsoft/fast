import { ComponentStyles } from "@microsoft/fast-jss-manager";
import {
    applyControl,
    applyControlRegion,
    applyControlWrapper,
    applyFormItemBadge,
    applyFormItemDisabled,
    applyInputStyle,
    applyInvalidMessage,
    applyLabelRegionStyle,
    applyLabelStyle,
    applySoftRemove,
    applySoftRemoveInput,
} from "../../style";
import { FormItemNumberFieldClassNameContract } from "./form-item.number-field.props";

const styles: ComponentStyles<FormItemNumberFieldClassNameContract, {}> = {
    formItemNumberField: {
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
    formItemNumberField_controlRegion: {
        ...applyControlRegion(),
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
    formItemNumberField_invalidMessage: {
        ...applyInvalidMessage(),
    },
};

export default styles;
