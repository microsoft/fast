import { ComponentStyles, CSSRules } from "@microsoft/fast-jss-manager-react";
import { ellipsis } from "@microsoft/fast-jss-utilities";
import { chevronDownStyle, chevronUpStyle, error, invalidMessageStyle } from "../style";
import { FormSectionValidationClassNameContract } from "./form-section-validation.props";

const styles: ComponentStyles<FormSectionValidationClassNameContract, {}> = {
    formSectionValidation: {
        overflow: "visible",
        position: "relative",
    },
    formSectionValidation_controlRegion: {
        ...invalidMessageStyle,
        border: `1px solid ${error}`,
        padding: "10px",
        margin: "10px 30px 10px 0",
        "margin-right": undefined,
        "border-radius": "2px",
        background: "rgba(255,0,0,0.1)",
    },
    formSectionValidation_message: {
        ...ellipsis(),
    },
    formSectionValidation_expandTrigger: {
        ...chevronDownStyle,
        "&$formSectionValidation_expandTrigger__active": {
            ...chevronUpStyle,
        },
    },
    formSectionValidation_expandTrigger__active: {},
    formSectionValidation_errorList: {
        margin: "10px 0 5px 0",
        padding: "0",
        "list-style": "inside",
    },
    formSectionValidation_errorListItem: {
        ...ellipsis(),
    },
    formSectionValidation_errorListItemDetails: {
        ...ellipsis(),
        "font-style": "italic",
    },
};

export default styles;
