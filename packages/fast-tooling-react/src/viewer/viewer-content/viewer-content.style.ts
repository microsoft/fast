import {
    ComponentStyles,
    ComponentStyleSheet,
    CSSRules,
} from "@microsoft/fast-jss-manager-react";

/* tslint:disable:max-line-length */
const styles: ComponentStyles<{}, {}> = (config: {}): ComponentStyleSheet<{}, {}> => {
    return {
        "@global": {
            body: {
                margin: "0",
                padding: "0",
            },
        },
    };
};

export default styles;
