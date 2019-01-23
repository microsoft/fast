import { ComponentStyles, CSSRules } from "@microsoft/fast-jss-manager";
import { disabledOpacity } from "./form.constants.style";
import {
    applyControl,
    applyControlWrapper,
    applyLabelStyle,
    applySelectInputStyles,
    applySelectSpanStyles,
    applySoftRemove,
    applySoftRemoveInput,
} from "./form.utilities.style";
import { FormItemSelectClassNameContract } from "../class-name-contracts/";

const styles: ComponentStyles<FormItemSelectClassNameContract, {}> = {
    formItemSelect: {
        display: "flex",
        ...applyControlWrapper(),
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
    formItemSelect_controlSpan__disabled: {
        opacity: `${disabledOpacity}`,
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
