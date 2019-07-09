import { withA11y } from "@storybook/addon-a11y";
import { addDecorator, addParameters } from "@storybook/react";
import { create, Global } from "@storybook/theming";
import React from "react";

function GlobalStyles(fn: () => JSX.Element): JSX.Element {
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

addDecorator(withA11y);
addDecorator(GlobalStyles);
