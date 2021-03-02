import { ComponentStyles } from "@microsoft/fast-jss-manager-react";
import { applyFocusVisible } from "@microsoft/fast-jss-utilities";
import {
    accentColorCSSProperty,
    insetStrongBoxShadow,
    L2CSSProperty,
    textColorCSSProperty,
} from "../../style";
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
        "line-height": "20px",
    },
    sectionControl_category__expanded: {
        "& $sectionControl_categoryExpandTrigger": {
            "&::before": {
                transform: "rotate(180deg)",
                "margin-top": "-6px",
            },
        },
        "& $sectionControl_categoryContentRegion": {
            display: "block",
        },
    },
    sectionControl_categoryTitleRegion: {
        display: "grid",
        "grid-template-columns": "auto 24px",
    },
    sectionControl_categoryTitle: {
        "font-weight": "bold",
        "font-size": "16px",
        padding: "unset",
        "padding-top": "16px",
        "padding-bottom": "12px",
    },
    sectionControl_categoryExpandTrigger: {
        margin: "12px 0",
        background: L2CSSProperty,
        border: "none",
        "&::before": {
            content: "''",
            display: "inline-block",
            "margin-top": "2px",
            "border-top": `4px solid ${textColorCSSProperty}`,
            "border-left": "4px solid transparent",
            "border-right": "4px solid transparent",
            "border-bottom": "4px solid transparent",
            "vertical-align": "middle",
        },
        ...applyFocusVisible({
            ...insetStrongBoxShadow(accentColorCSSProperty),
            outline: "none",
        }),
    },
    sectionControl_categoryContentRegion: {
        display: "none",
    },
};

export default styles;
