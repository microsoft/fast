import { ComponentStyles } from "@microsoft/fast-jss-manager-react";

export interface CSSControlClassNameContract {
    css?: string;
}

const styles: ComponentStyles<CSSControlClassNameContract, {}> = {
    css: {
        "& fast-select, & fast-text-field, & fast-number-field": {
            "min-width": "unset",
            width: "100%",
        },
    },
};

export default styles;
