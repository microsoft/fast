import * as React from "react";
import Example from "../../../../app/components/example";

function handleGetStyles(style: string): void {}

export default {
    data: [
        {
            title: "default",
            props: {
                component: Example,
                data: {
                    textValue: "Hello World",
                    onChange: null,
                    getStyles: handleGetStyles,
                },
                styles: ".test { color: red; }"
            }
        }
    ]
};
