import { configure } from "@storybook/react";

configure(() => {
    const req = require.context("../src", true, /\.stories\.tsx$/);

    req.keys().forEach(filename => req(filename));
}, module);
