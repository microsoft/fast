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
import { FormItemDisplayClassNameContract } from "./form-item.display.props";

const styles: ComponentStyles<FormItemDisplayClassNameContract, {}> = {
    formItemDisplay: {
        ...applyControlWrapper(),
    },
    formItemDisplay__disabled: {
        ...applyFormItemDisabled(),
    },
    formItemDisplay_badge: {
        ...applyFormItemIndicator(),
    },
    formItemDisplay_constValueIndicator: {
        ...applyInteractiveFormItemIndicator(),
    },
    formItemDisplay_control: {
        ...applyControl(),
    },
    formItemDisplay_controlRegion: {
        ...applyControlRegion(),
    },
    formItemDisplay_controlLabel: {
        ...applyLabelStyle(),
    },
    formItemDisplay_controlLabelRegion: {
        ...applyLabelRegionStyle(),
    },
    formItemDisplay_controlInput: {
        ...applyInputStyle(),
        width: "100%",
    },
    formItemDisplay_defaultValueIndicator: {
        ...applyInteractiveFormItemIndicator(),
    },
    formItemDisplay_softRemove: {
        ...applySoftRemove(),
    },
    formItemDisplay_softRemoveInput: {
        ...applySoftRemoveInput(),
    },
    formItemDisplay_invalidMessage: {
        ...applyInvalidMessage(),
    },
};

export default styles;
