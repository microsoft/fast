import { ellipsis } from "@microsoft/fast-jss-utilities";
import { defaultFontStyle, errorColorCSSProperty } from "../../style";
const styles = {
    sectionLinkControl: Object.assign(Object.assign({}, ellipsis()), {
        display: "block",
        width: "100%",
        cursor: "pointer",
        lineHeight: "23px",
        borderBottom: "1px solid transparent",
        "&$sectionLinkControl__default": Object.assign({}, defaultFontStyle),
    }),
    sectionLinkControl__disabled: {},
    sectionLinkControl__invalid: {
        borderColor: errorColorCSSProperty,
    },
    sectionLinkControl__default: {},
};
export default styles;
