import {
    applyInputStyle,
    applyLabelStyle,
    applyWrapperStyle,
} from "../utilities/form-input.style";
import { toPx } from "@microsoft/fast-jss-utilities";
import { ComponentStyles } from "@microsoft/fast-jss-manager";
import { FormItemTextareaClassNameContract } from "../class-name-contracts/";

const styles: ComponentStyles<FormItemTextareaClassNameContract, {}> = {
    formItemTextarea: {
        ...applyWrapperStyle(),
        flexDirection: "column",
        alignItems: "stretch",
    },
    formItemTextarea_label: {
        ...applyLabelStyle(),
        display: "block",
        marginTop: toPx(12),
    },
    formItemTextarea_textarea: {
        ...applyInputStyle(),
        marginTop: toPx(8),
        marginBottom: toPx(2),
        resize: "vertical",
        fontFamily: "inherit",
    },
};

export default styles;
