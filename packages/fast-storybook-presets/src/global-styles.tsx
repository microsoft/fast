import React from "react";
import { addParameters, addDecorator } from "@storybook/react";
import { create, Global } from "@storybook/theming";

function GlobalStyles(fn) {
    return (
        <React.Fragment>
            <Global
                styles={{
                    body: {
                        fontFamily: "'Segoe UI'",
                    },
                }}
            />
            {fn()}
        </React.Fragment>
    );
}

addDecorator(GlobalStyles);
