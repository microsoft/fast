import { ComponentStyles } from "@microsoft/fast-jss-manager-react";
import {
    applyControl,
    applyControlRegion,
    applyControlWrapper,
    applyFormControlDisabled,
    applyFormControlIndicator,
    applyInputStyle,
    applyInteractiveFormControlIndicator,
    applyInvalidMessage,
    applyLabelRegionStyle,
    applyLabelStyle,
    applySoftRemove,
    applySoftRemoveInput,
} from "../../style";
import { NumberFieldClassNameContractFormControl } from "./control.number-field.props";

const styles: ComponentStyles<NumberFieldClassNameContractFormControl, {}> = {
    numberFieldFormControl: {
        ...applyControlWrapper(),
    },
    numberFieldFormControl__disabled: {
        ...applyFormControlDisabled(),
    },
    numberFieldFormControl_badge: {
        ...applyFormControlIndicator(),
    },
    numberFieldFormControl_control: {
        ...applyControl(),
    },
    numberFieldFormControl_controlRegion: {
        ...applyControlRegion(),
    },
    numberFieldFormControl_controlLabel: {
        ...applyLabelStyle(),
    },
    numberFieldFormControl_controlLabelRegion: {
        ...applyLabelRegionStyle(),
    },
    numberFieldFormControl_controlInput: {
        ...applyInputStyle(),
        width: "100%",
    },
    numberFieldFormControl_defaultValueIndicator: {
        ...applyInteractiveFormControlIndicator(),
    },
    numberFieldFormControl_softRemove: {
        ...applySoftRemove(),
    },
    numberFieldFormControl_softRemoveInput: {
        ...applySoftRemoveInput(),
    },
    numberFieldFormControl_invalidMessage: {
        ...applyInvalidMessage(),
    },
};

export default styles;
