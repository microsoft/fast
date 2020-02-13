import { ComponentStyles, CSSRules } from "@microsoft/fast-jss-manager-react";
import { SectionControlClassNameContract } from "./control.section.props";

const styles: ComponentStyles<SectionControlClassNameContract, {}> = {
    sectionControl: {
        margin: "0",
        padding: "0",
        border: "none",
        "min-inline-size": "unset", // override for fieldsets inherited style
    },
    sectionControl__disabled: {},
};

export default styles;
