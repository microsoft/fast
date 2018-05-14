import { applyInputStyle, applyLabelStyle, applyWrapperStyle } from "../utilities/form-input.style";
import { toPx } from "@microsoft/fast-jss-utilities";
import { ComponentStyles } from "@microsoft/fast-jss-manager";
import { IFormItemTextareaClassNameContract } from "../class-name-contracts/";

const styles: ComponentStyles<IFormItemTextareaClassNameContract, {}> = {
    formItemTextarea: {
        ...applyWrapperStyle(),
        flexDirection: "column"
    },
    formItemTextarea_label: {
        ...applyLabelStyle(),
        display: "block"
    },
    formItemTextarea_textarea: {
        ...applyInputStyle(),
        marginTop: toPx(8)
    }
};

export default styles;
