import { ComponentStyles } from "@microsoft/fast-jss-manager-react";
import {
    accentColorCSSProperty,
    cleanListStyle,
    defaultTextSizeCSSProperty,
    gutterCSSProperty,
    L4CSSProperty,
    textColorCSSProperty,
} from "../style";
import { FormClassNameContract } from "./form.props";

const styles: ComponentStyles<FormClassNameContract, {}> = {
    form: {
        background: L4CSSProperty,
        color: textColorCSSProperty,
        height: "100%",
        padding: `0 0 0 ${gutterCSSProperty}`,
        overflow: "auto",
        "font-size": defaultTextSizeCSSProperty,
    },
    form_breadcrumbs: {
        display: "flex",
        "flex-wrap": "wrap",
        "margin-top": "4px",
        "line-height": "16px",
        "padding-bottom": "12px",
        ...cleanListStyle,
        "& li": {
            display: "inline-block",
            "padding-right": "8px",
            "&::after": {
                content: "'/'",
                "padding-left": "8px",
            },
            "&:last-child::after": {
                content: "''",
                "padding-left": "0",
            },
            "& a": {
                color: accentColorCSSProperty,
            },
        },
    },
};

export default styles;
