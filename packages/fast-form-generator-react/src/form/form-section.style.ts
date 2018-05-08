import { ellipsis, toPx } from "@microsoft/fast-jss-utilities";
import { applyInputStyle, applyLabelStyle, applyWrapperStyle } from "../utilities/form-input.shared-style.style";
import { ComponentStyles, ICSSRules } from "@microsoft/fast-jss-manager";
import { IFormSectionClassNameContract } from "../class-name-contracts/";

function applyCleanListStyle(): ICSSRules<{}> {
    return {
        listStyle: "none",
        margin: "0",
        padding: "0"
    };
}

const styles: ComponentStyles<IFormSectionClassNameContract, {}> = {
    formItemSection: {
        display: "block"
    },
    formItemSection_menu: {
        listStyle: "none"
    }
};

export default styles;
