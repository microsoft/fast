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
import { ButtonFormControlClassNameContract } from "./control.button.props";

const styles: ComponentStyles<ButtonFormControlClassNameContract, {}> = {
    buttonFormControl: {
        ...applyControlWrapper(),
    },
    buttonFormControl__disabled: {
        ...applyFormControlDisabled(),
    },
    buttonFormControl_badge: {
        ...applyFormControlIndicator(),
    },
    buttonFormControl_control: {
        ...applyControl(),
    },
    buttonFormControl_controlRegion: {
        ...applyControlRegion(),
    },
    buttonFormControl_controlLabel: {
        ...applyLabelStyle(),
    },
    buttonFormControl_controlLabelRegion: {
        ...applyLabelRegionStyle(),
    },
    buttonFormControl_controlInput: {
        ...applyInputStyle(),
        width: "100%",
        textAlign: "start",
    },
    buttonFormControl_defaultValueIndicator: {
        ...applyInteractiveFormControlIndicator(),
    },
    buttonFormControl_softRemove: {
        ...applySoftRemove(),
    },
    buttonFormControl_softRemoveInput: {
        ...applySoftRemoveInput(),
    },
    buttonFormControl_invalidMessage: {
        ...applyInvalidMessage(),
    },
};

export default styles;
