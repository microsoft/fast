import { ComponentStyles, CSSRules } from "@microsoft/fast-jss-manager";
import {
    applyControl,
    applyInputStyle,
    applyLabelStyle,
    applySelectInputStyles,
    applySelectSpanStyles,
    applySoftRemove,
    applySoftRemoveInput,
    applyWrapperStyle,
} from "../utilities/form-input.style";
import { FormItemSelectClassNameContract } from "../class-name-contracts/";

const styles: ComponentStyles<FormItemSelectClassNameContract, {}> = {
    formItemSelect: {
        display: "block",
        position: "relative",
    },
    formItemSelect_control: {
        ...applyControl(),
    },
    formItemSelect_control_label: {
        ...applyLabelStyle(),
        display: "block",
        marginTop: "12px",
    },
    formItemSelect_control_span: {
        ...applySelectSpanStyles(),
        marginTop: "8px",
    },
    formItemSelect_control_input: {
        ...applySelectInputStyles(),
    },
    formItemSelect_softRemove: {
        ...applySoftRemove(),
    },
    formItemSelect_softRemove_input: {
        ...applySoftRemoveInput(),
    },
};

export default styles;
