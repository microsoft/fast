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
import { TextareaFormControlClassNameContract } from "./control.textarea.props";

const styles: ComponentStyles<TextareaFormControlClassNameContract, {}> = {
    textareaFormControl: {
        ...applyControlWrapper(),
    },
    textareaFormControl_invalidMessage: {
        ...applyInvalidMessage(),
    },
    textareaFormControl__disabled: {
        ...applyFormControlDisabled(),
    },
    textareaFormControl_badge: {
        ...applyFormControlIndicator(),
    },
    textareaFormControl_control: {
        ...applyControl(),
    },
    textareaFormControl_controlRegion: {
        ...applyControlRegion(),
    },
    textareaFormControl_controlLabel: {
        ...applyLabelStyle(),
    },
    textareaFormControl_controlLabelRegion: {
        ...applyLabelRegionStyle(),
    },
    textareaFormControl_controlTextarea: {
        ...applyInputStyle(),
        width: "100%",
        resize: "none",
        fontFamily: "inherit",
    },
    textareaFormControl_defaultValueIndicator: {
        ...applyInteractiveFormControlIndicator(),
    },
    textareaFormControl_softRemove: {
        ...applySoftRemove(),
    },
    textareaFormControl_softRemoveInput: {
        ...applySoftRemoveInput(),
    },
};

export default styles;
