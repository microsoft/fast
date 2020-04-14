import { withA11y } from "@storybook/addon-a11y";
import { addDecorator } from "@storybook/react";
import { Global } from "@storybook/theming";
import { withPerformance } from "storybook-addon-performance";
import React from "react";

function GlobalStyles(fn: () => JSX.Element): JSX.Element {
    return (
        <React.Fragment>
            <Global
                styles={{
                    body: {
                        fontFamily:
                            "Segoe UI, SegoeUI, Helvetica Neue, Helvetica, Arial, sans-serif",
                    },
                }}
            />
            {fn()}
        </React.Fragment>
    );
}

addDecorator(withA11y);
addDecorator(GlobalStyles);
addDecorator(withPerformance);
