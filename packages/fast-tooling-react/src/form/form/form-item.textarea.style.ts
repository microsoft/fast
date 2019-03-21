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
import { FormItemTextareaClassNameContract } from "./form-item.textarea.props";

const styles: ComponentStyles<FormItemTextareaClassNameContract, {}> = {
    formItemTextarea: {
        display: "flex",
        ...applyControlWrapper(),
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
