import { ComponentStyles } from "@microsoft/fast-jss-manager-react";
import { ellipsis } from "@microsoft/fast-jss-utilities";
import { chevronDownStyle, chevronUpStyle, invalidMessageStyle } from "../../../style";
import {
    borderRadiusCSSProperty,
    errorColorCSSProperty,
    L1CSSProperty,
} from "../../../style/css-properties";
import { SectionValidationClassNameContract } from "./section.validation.props";

const styles: ComponentStyles<SectionValidationClassNameContract, {}> = {
    sectionValidation: {
        overflow: "visible",
        position: "relative",
    },
    sectionValidation_controlRegion: {
        ...invalidMessageStyle,
        border: `1px solid ${errorColorCSSProperty}`,
        padding: "10px",
        margin: "10px 0",
        "margin-right": undefined,
        "border-radius": borderRadiusCSSProperty,
        background: L1CSSProperty,
    },
    sectionValidation_message: {
        ...ellipsis(),
    },
    sectionValidation_expandTrigger: {
        ...chevronDownStyle,
        "&$sectionValidation_expandTrigger__active": {
            ...chevronUpStyle,
        },
    },
    sectionValidation_expandTrigger__active: {},
    sectionValidation_errorList: {
        margin: "10px 0 5px 0",
        padding: "0",
        "list-style": "inside",
    },
    sectionValidation_errorListItem: {
        ...ellipsis(),
    },
    sectionValidation_errorListItemDetails: {
        ...ellipsis(),
        "font-style": "italic",
    },
};

export default styles;
