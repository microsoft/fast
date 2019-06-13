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
import { FormItemButtonClassNameContract } from "./form-item.button.props";

const styles: ComponentStyles<FormItemButtonClassNameContract, {}> = {
    formItemButton: {
        ...applyControlWrapper(),
    },
    formItemButton__disabled: {
        ...applyFormItemDisabled(),
    },
    formItemButton_badge: {
        ...applyFormItemIndicator(),
    },
    formItemButton_control: {
        ...applyControl(),
    },
    formItemButton_controlRegion: {
        ...applyControlRegion(),
    },
    formItemButton_controlLabel: {
        ...applyLabelStyle(),
    },
    formItemButton_controlLabelRegion: {
        ...applyLabelRegionStyle(),
    },
    formItemButton_controlInput: {
        ...applyInputStyle(),
        width: "100%",
        textAlign: "start",
    },
    formItemButton_defaultValueIndicator: {
        ...applyInteractiveFormItemIndicator(),
    },
    formItemButton_softRemove: {
        ...applySoftRemove(),
    },
    formItemButton_softRemoveInput: {
        ...applySoftRemoveInput(),
    },
    formItemButton_invalidMessage: {
        ...applyInvalidMessage(),
    },
};

export default styles;
