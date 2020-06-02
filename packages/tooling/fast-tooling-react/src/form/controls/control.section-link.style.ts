import { ComponentStyles } from "@microsoft/fast-jss-manager-react";
import { ellipsis } from "@microsoft/fast-jss-utilities";
import { defaultFontStyle, errorColorCSSProperty } from "../../style";

/**
 * SectionLink class name contract
 */
export interface SectionLinkControlClassNameContract {
    sectionLinkControl?: string;
    sectionLinkControl__disabled?: string;
    sectionLinkControl__default?: string;
    sectionLinkControl__invalid?: string;
}

const styles: ComponentStyles<SectionLinkControlClassNameContract, {}> = {
    sectionLinkControl: {
        ...ellipsis(),
        display: "block",
        width: "100%",
        cursor: "pointer",
        lineHeight: "23px",
        borderBottom: "1px solid transparent",
        "&$sectionLinkControl__default": {
            ...defaultFontStyle,
        },
    },
    sectionLinkControl__disabled: {},
    sectionLinkControl__invalid: {
        borderColor: errorColorCSSProperty,
    },
    sectionLinkControl__default: {},
};

export default styles;
