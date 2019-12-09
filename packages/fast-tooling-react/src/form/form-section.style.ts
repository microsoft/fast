import { ComponentStyles, CSSRules } from "@microsoft/fast-jss-manager-react";
import { applyInvalidMessage, error } from "../style";
import { FormSectionClassNameContract } from "./form-section.props";

const styles: ComponentStyles<FormSectionClassNameContract, {}> = {
    formSection: {
        margin: "0",
        padding: "0",
        border: "none",
    },
    formSection__disabled: {},
    formSection_invalidMessage: {
        ...applyInvalidMessage(),
        border: `1px solid ${error}`,
        padding: "10px",
        "line-height": "11px",
        margin: "10px 30px 10px 0",
        "margin-right": undefined,
        "border-radius": "2px",
        background: "rgba(255,0,0,0.1)",
    },
};

export default styles;
