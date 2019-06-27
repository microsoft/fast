import { setup } from "@microsoft/fast-storybook-design-system-addon";
import { withA11y } from "@storybook/addon-a11y";
import { addDecorator, addParameters } from "@storybook/react";
import { create, Global } from "@storybook/theming";
import React from "react";

// Setup fast-storybook-design-system-addon
setup();

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

addDecorator(withA11y);
addDecorator(GlobalStyles);
