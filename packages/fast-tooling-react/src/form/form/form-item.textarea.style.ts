import { ComponentStyles } from "@microsoft/fast-jss-manager-react";
import {
    applyControl,
    applyControlRegion,
    applyControlWrapper,
    applyFormItemDisabled,
    applyFormItemIndicator,
    applyInputStyle,
    applyInteractiveFormItemIndicator,
    applyInvalidMessage,
    applyLabelRegionStyle,
    applyLabelStyle,
    applySoftRemove,
    applySoftRemoveInput,
} from "../../style";
import { FormItemTextareaClassNameContract } from "./form-item.textarea.props";

const styles: ComponentStyles<FormItemTextareaClassNameContract, {}> = {
    formItemTextarea: {
        ...applyControlWrapper(),
    },
    formItemTextarea_invalidMessage: {
        ...applyInvalidMessage(),
    },
    formItemTextarea__disabled: {
        ...applyFormItemDisabled(),
    },
    formItemTextarea_badge: {
        ...applyFormItemIndicator(),
    },
    formItemTextarea_control: {
        ...applyControl(),
    },
    formItemTextarea_controlRegion: {
        ...applyControlRegion(),
    },
    formItemTextarea_controlLabel: {
        ...applyLabelStyle(),
    },
    formItemTextarea_controlLabelRegion: {
        ...applyLabelRegionStyle(),
    },
    formItemTextarea_controlTextarea: {
        ...applyInputStyle(),
        width: "100%",
        resize: "none",
        fontFamily: "inherit",
    },
    formItemTextarea_defaultValueIndicator: {
        ...applyInteractiveFormItemIndicator(),
    },
    formItemTextarea_softRemove: {
        ...applySoftRemove(),
    },
    formItemTextarea_softRemoveInput: {
        ...applySoftRemoveInput(),
    },
};

export default styles;
