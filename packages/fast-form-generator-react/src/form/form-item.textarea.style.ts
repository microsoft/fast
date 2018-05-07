import { applyInputStyle, applyLabelStyle, applyWrapperStyle } from "../utilities/form-input.shared-style.style";
import { ComponentStyles } from "@microsoft/fast-jss-manager";
import { IFormItemTextareaClassNameContract } from "../class-name-contracts/";

const styles: ComponentStyles<IFormItemTextareaClassNameContract, {}> = {
    formItemTextarea: {
        ...applyWrapperStyle()
    },
    formItemTextarea_label: {
        ...applyLabelStyle()
    },
    formItemTextarea_textarea: {
        ...applyInputStyle()
    }
};

export default styles;
