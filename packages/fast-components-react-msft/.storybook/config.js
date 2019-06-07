import { configure, addParameters, addDecorator } from "@storybook/react";
import { setup } from "@microsoft/fast-storybook-design-system-addon";

addParameters({
    backgrounds: [
        { name: "light", value: "#FFF", default: true },
        { name: "dark", value: "#111" },
    ],
});

setup();

configure(() => {
    const req = require.context("../src", true, /\.stories\.tsx$/);

    req.keys().forEach(filename => req(filename));
}, module);
