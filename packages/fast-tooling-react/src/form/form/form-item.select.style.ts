import { ComponentStyles, CSSRules } from "@microsoft/fast-jss-manager";
import {
    applyControl,
    applyControlWrapper,
    applyFormItemDisabled,
    applyLabelStyle,
    applySelectInputStyles,
    applySelectSpanStyles,
    applySoftRemove,
    applySoftRemoveInput,
} from "../../style";
import { FormItemSelectClassNameContract } from "./form-item.select.props";

const styles: ComponentStyles<FormItemSelectClassNameContract, {}> = {
    formItemSelect: {
        display: "flex",
        ...applyControlWrapper(),
    },
    formItemSelect__disabled: {
        ...applyFormItemDisabled(),
    },
    formItemSelect_control: {
        ...applyControl(),
    },
    formItemSelect_controlLabel: {
        ...applyLabelStyle(),
    },
    formItemSelect_controlSpan: {
        ...applySelectSpanStyles(),
    },
    formItemSelect_controlInput: {
        ...applySelectInputStyles(),
    },
    formItemSelect_softRemove: {
        ...applySoftRemove(),
    },
    formItemSelect_softRemoveInput: {
        ...applySoftRemoveInput(),
    },
};

export default styles;
