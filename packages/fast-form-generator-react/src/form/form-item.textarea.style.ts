import {
    applyControl,
    applyInputStyle,
    applyLabelStyle,
    applySoftRemove,
    applySoftRemoveInput,
    applyWrapperStyle,
    colors,
    insetStrongBoxShadow,
} from "../utilities/form-input.style";
import { toPx } from "@microsoft/fast-jss-utilities";
import { ComponentStyles } from "@microsoft/fast-jss-manager";
import { FormItemTextareaClassNameContract } from "../class-name-contracts/";

const styles: ComponentStyles<FormItemTextareaClassNameContract, {}> = {
    formItemTextarea: {
        display: "flex",
        marginBottom: "12px",
    },
    formItemTextarea_control: {
        ...applyControl(),
    },
    formItemTextarea_controlLabel: {
        ...applyLabelStyle(),
        display: "block",
        marginTop: "7px",
    },
    formItemTextarea_controlTextarea: {
        ...applyInputStyle(),
        width: "100%",
        marginTop: "8px",
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
