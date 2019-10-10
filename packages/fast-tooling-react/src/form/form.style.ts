import { accent, applyCleanListStyle, foreground300, neutralLayerL4 } from "../style";
import { ComponentStyles } from "@microsoft/fast-jss-manager-react";
import { FormClassNameContract } from "./form.props";

const styles: ComponentStyles<FormClassNameContract, {}> = {
    form: {
        background: neutralLayerL4,
        color: foreground300,
        height: "100%",
        padding: "0 0 0 10px",
        overflow: "auto",
    },
    form_breadcrumbs: {
        display: "flex",
        "flex-wrap": "wrap",
        "margin-top": "4px",
        "font-size": "12px",
        "line-height": "16px",
        "padding-bottom": "12px",
        ...applyCleanListStyle(),
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
                color: accent,
            },
        },
    },
};

export default styles;
