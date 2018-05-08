import { ellipsis, toPx } from "@microsoft/fast-jss-utilities";
import { applyInputStyle, applyLabelStyle, applyWrapperStyle } from "../utilities/form-input.shared-style.style";
import { ComponentStyles, ICSSRules } from "@microsoft/fast-jss-manager";
import { IFormClassNameContract } from "../class-name-contracts/";

function applyCleanListStyle(): ICSSRules<{}> {
    return {
        listStyle: "none",
        margin: "0",
        padding: "0"
    };
}

const styles: ComponentStyles<IFormClassNameContract, {}> = {
    form_breadcrumbs: {
        display: "flex",
        flexFlow: "row-wrap"
    }
};

export default styles;
