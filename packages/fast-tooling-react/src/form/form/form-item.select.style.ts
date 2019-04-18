import { ComponentStyles, CSSRules } from "@microsoft/fast-jss-manager-react";
import {
    applyControl,
    applyControlRegion,
    applyControlWrapper,
    applyFormItemDisabled,
    applyFormItemIndicator,
    applyInvalidMessage,
    applyLabelRegionStyle,
    applyLabelStyle,
    applySelectInputStyles,
    applySelectSpanStyles,
    applySoftRemove,
    applySoftRemoveInput,
} from "../../style";
import { FormItemSelectClassNameContract } from "./form-item.select.props";

const styles: ComponentStyles<FormItemSelectClassNameContract, {}> = {
    formItemSelect: {
        ...applyControlWrapper(),
    },
    formItemSelect__disabled: {
        ...applyFormItemDisabled(),
    },
    formItemSelect_badge: {
        ...applyFormItemIndicator(),
    },
    formItemSelect_control: {
        ...applyControl(),
    },
    formItemSelect_controlLabel: {
        ...applyLabelStyle(),
    },
    formItemSelect_controlLabelRegion: {
        ...applyLabelRegionStyle(),
    },
    formItemSelect_controlRegion: {
        ...applyControlRegion(),
    },
    formItemSelect_controlSpan: {
        ...applySelectSpanStyles(),
    },
    formItemSelect_controlInput: {
        ...applySelectInputStyles(),
    },
    formItemSelect_defaultValueIndicator: {
        ...applyFormItemIndicator(),
    },
    formItemSelect_invalidMessage: {
        ...applyInvalidMessage(),
    },
    formItemSelect_softRemove: {
        ...applySoftRemove(),
    },
    formItemSelect_softRemoveInput: {
        ...applySoftRemoveInput(),
    },
};

export default styles;
