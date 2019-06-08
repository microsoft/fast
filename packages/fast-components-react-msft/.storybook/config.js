import React from "react";
import { configure, addParameters, addDecorator } from "@storybook/react";
import { setup } from "@microsoft/fast-storybook-design-system-addon";
import { create, Global } from "@storybook/theming";
import icon from "../favicon.png";

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
const fastTheme = create({
    base: "dark",

    // Typography
    fontBase: "Segoe UI, sans-serif",

    brandTitle: "FAST-DNA",
});

addParameters({
    options: {
        theme: fastTheme,
    },
});

setup();
addDecorator(GlobalStyles);

configure(() => {
    const req = require.context("../src", true, /\.stories\.tsx$/);

    req.keys().forEach(filename => req(filename));
}, module);
