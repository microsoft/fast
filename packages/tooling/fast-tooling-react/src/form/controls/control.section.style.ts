import { ComponentStyles } from "@microsoft/fast-jss-manager-react";
import { SectionControlClassNameContract } from "./control.section.props";

const styles: ComponentStyles<SectionControlClassNameContract, {}> = {
    sectionControl: {
        margin: "0",
        padding: "0",
        border: "none",
        "min-inline-size": "unset", // override for fieldsets inherited style
    },
    sectionControl__disabled: {
        opacity: "1", // override the fieldset disabled inherited style
    },
};

export default styles;
