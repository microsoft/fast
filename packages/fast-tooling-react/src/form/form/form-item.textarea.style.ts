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
    error,
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
        ...applyFormItemBadge(),
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
    formItemTextarea_softRemove: {
        ...applySoftRemove(),
    },
    formItemTextarea_softRemoveInput: {
        ...applySoftRemoveInput(),
    },
};

export default styles;
