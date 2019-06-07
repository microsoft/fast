import { configure, addParameters } from "@storybook/react";

addParameters({
    backgrounds: [
        { name: "light", value: "#FFF", default: true },
        { name: "dark", value: "#111" },
    ],
});

configure(() => {
    const req = require.context("../src", true, /\.stories\.tsx$/);

    req.keys().forEach(filename => req(filename));
}, module);
