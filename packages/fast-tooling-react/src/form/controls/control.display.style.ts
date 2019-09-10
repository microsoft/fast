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
import { DisplayFormControlClassNameContract } from "./control.display.props";

const styles: ComponentStyles<DisplayFormControlClassNameContract, {}> = {
    displayFormControl: {
        ...applyControlWrapper(),
    },
    displayFormControl__disabled: {
        ...applyFormControlDisabled(),
    },
    displayFormControl_badge: {
        ...applyFormControlIndicator(),
    },
    displayFormControl_constValueIndicator: {
        ...applyInteractiveFormControlIndicator(),
    },
    displayFormControl_control: {
        ...applyControl(),
    },
    displayFormControl_controlRegion: {
        ...applyControlRegion(),
    },
    displayFormControl_controlLabel: {
        ...applyLabelStyle(),
    },
    displayFormControl_controlLabelRegion: {
        ...applyLabelRegionStyle(),
    },
    displayFormControl_controlInput: {
        ...applyInputStyle(),
        width: "100%",
    },
    displayFormControl_defaultValueIndicator: {
        ...applyInteractiveFormControlIndicator(),
    },
    displayFormControl_softRemove: {
        ...applySoftRemove(),
    },
    displayFormControl_softRemoveInput: {
        ...applySoftRemoveInput(),
    },
    displayFormControl_invalidMessage: {
        ...applyInvalidMessage(),
    },
};

export default styles;
