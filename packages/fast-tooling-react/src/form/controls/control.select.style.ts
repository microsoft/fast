import { ComponentStyles, CSSRules } from "@microsoft/fast-jss-manager-react";
import {
    applyControl,
    applyControlRegion,
    applyControlWrapper,
    applyFormControlDisabled,
    applyFormControlIndicator,
    applyInteractiveFormControlIndicator,
    applyInvalidMessage,
    applyLabelRegionStyle,
    applyLabelStyle,
    applySelectInputStyles,
    applySelectSpanStyles,
    applySoftRemove,
    applySoftRemoveInput,
} from "../../style";
import { SelectFormControlClassNameContract } from "./control.select.props";

const styles: ComponentStyles<SelectFormControlClassNameContract, {}> = {
    selectFormControl: {
        ...applyControlWrapper(),
    },
    selectFormControl__disabled: {
        ...applyFormControlDisabled(),
    },
    selectFormControl_badge: {
        ...applyFormControlIndicator(),
    },
    selectFormControl_control: {
        ...applyControl(),
    },
    selectFormControl_controlLabel: {
        ...applyLabelStyle(),
    },
    selectFormControl_controlLabelRegion: {
        ...applyLabelRegionStyle(),
    },
    selectFormControl_controlRegion: {
        ...applyControlRegion(),
    },
    selectFormControl_controlSpan: {
        ...applySelectSpanStyles(),
    },
    selectFormControl_controlInput: {
        ...applySelectInputStyles(),
    },
    selectFormControl_defaultValueIndicator: {
        ...applyInteractiveFormControlIndicator(),
    },
    selectFormControl_invalidMessage: {
        ...applyInvalidMessage(),
    },
    selectFormControl_softRemove: {
        ...applySoftRemove(),
    },
    selectFormControl_softRemoveInput: {
        ...applySoftRemoveInput(),
    },
};

export default styles;
