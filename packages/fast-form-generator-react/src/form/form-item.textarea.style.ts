import {
    applyControl,
    applyControlWrapper,
    applyInputStyle,
    applyLabelStyle,
    applySoftRemove,
    applySoftRemoveInput,
} from "./";
import { ComponentStyles } from "@microsoft/fast-jss-manager";
import { FormItemTextareaClassNameContract } from "../class-name-contracts/";

const styles: ComponentStyles<FormItemTextareaClassNameContract, {}> = {
    formItemTextarea: {
        display: "flex",
        ...applyControlWrapper(),
    },
    formItemTextarea_control: {
        ...applyControl(),
    },
    formItemTextarea_controlLabel: {
        ...applyLabelStyle(),
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
