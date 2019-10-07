import { ComponentStyles } from "@microsoft/fast-jss-manager-react";
import { ellipsis } from "@microsoft/fast-jss-utilities";

/**
 * SectionLink class name contract
 */
export interface SectionLinkControlClassNameContract {
    sectionLinkControl?: string;
    sectionLinkControl__disabled?: string;
    sectionLinkControl__invalid?: string;
}

const styles: ComponentStyles<SectionLinkControlClassNameContract, {}> = {
    sectionLinkControl: {
        ...ellipsis(),
        display: "block",
        width: "100%",
        cursor: "pointer",
        fontSize: "12px",
        lineHeight: "23px",
        borderBottom: "1px solid transparent",
    },
    sectionLinkControl__disabled: {},
    sectionLinkControl__invalid: {
        borderColor: "red",
    },
};

export default styles;
