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
    sectionControl_category: {
        margin: "0",
        padding: "0",
        border: "none",
        "min-inline-size": "unset", // override for fieldsets inherited style
        "font-size": "14px",
        "line-height": "20px",
    },
    sectionControl_categoryTitle: {
        "font-weight": "bold",
        padding: "unset",
        float: "left",
        "padding-top": "16px",
        "padding-bottom": "12px",
    },
};

export default styles;
