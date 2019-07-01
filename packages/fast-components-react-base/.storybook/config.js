import React from "react";
import { configure, addParameters, addDecorator } from "@storybook/react";
import { create, Global } from "@storybook/theming";
import theme from "@microsoft/fast-storybook-presets/dist/theme";

addParameters({
    options: {
        theme,
    },
});
