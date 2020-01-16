import { ComponentStyles, CSSRules } from "@microsoft/fast-jss-manager-react";
import { FormSectionClassNameContract } from "./form-section.props";

const styles: ComponentStyles<FormSectionClassNameContract, {}> = {
    formSection: {
        margin: "0",
        padding: "0",
        border: "none",
        "min-inline-size": "unset", // override for fieldsets inherited style
    },
    formSection__disabled: {},
};

export default styles;
