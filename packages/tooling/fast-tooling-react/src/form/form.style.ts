import { ComponentStyles } from "@microsoft/fast-jss-manager-react";
import {
    accentColorCSSProperty,
    cleanListStyle,
    defaultTextSizeCSSProperty,
    gutterCSSProperty,
    L2CSSProperty,
    L4CSSProperty,
    textColorCSSProperty,
} from "../style";
import { FormClassNameContract } from "./form.props";

const styles: ComponentStyles<FormClassNameContract, {}> = {
    form: {
        background: L4CSSProperty,
        color: textColorCSSProperty,
        height: "100%",
        overflow: "auto",
        "font-size": defaultTextSizeCSSProperty,
        "&::-webkit-scrollbar": {
            background: L4CSSProperty,
            width: "8px",
            height: "8px",
        },
        "&::-webkit-scrollbar-thumb": {
            background: L2CSSProperty,
            borderRadius: "8px",
        },
        display: "flex",
        "& > form": {
            padding: `0 ${gutterCSSProperty}`,
            width: "100%",
        },
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
            "padding-right": "4px",
            "&::after": {
                content: "'/'",
                "padding-left": "4px",
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
