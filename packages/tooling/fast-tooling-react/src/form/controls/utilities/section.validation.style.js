import { ellipsis } from "@microsoft/fast-jss-utilities";
import { chevronDownStyle, chevronUpStyle, invalidMessageStyle } from "../../../style";
import {
    borderRadiusCSSProperty,
    errorColorCSSProperty,
    L1CSSProperty,
} from "../../../style/css-properties";
const styles = {
    sectionValidation: {
        overflow: "visible",
        position: "relative",
    },
    sectionValidation_controlRegion: Object.assign(
        Object.assign({}, invalidMessageStyle),
        {
            border: `1px solid ${errorColorCSSProperty}`,
            padding: "10px",
            margin: "10px 0",
            "margin-right": undefined,
            "border-radius": borderRadiusCSSProperty,
            background: L1CSSProperty,
        }
    ),
    sectionValidation_message: Object.assign({}, ellipsis()),
    sectionValidation_expandTrigger: Object.assign(Object.assign({}, chevronDownStyle), {
        "&$sectionValidation_expandTrigger__active": Object.assign({}, chevronUpStyle),
    }),
    sectionValidation_expandTrigger__active: {},
    sectionValidation_errorList: {
        margin: "10px 0 5px 0",
        padding: "0",
        "list-style": "inside",
    },
    sectionValidation_errorListItem: Object.assign({}, ellipsis()),
    sectionValidation_errorListItemDetails: Object.assign(Object.assign({}, ellipsis()), {
        "font-style": "italic",
    }),
};
export default styles;
