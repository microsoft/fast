import React from "react";
import { configure, addParameters, addDecorator } from "@storybook/react";
import { create, Global } from "@storybook/theming";
// Import from dist cause storybook throws up if we import the named import from the index
import theme from "@microsoft/fast-storybook-presets/dist/theme";

addParameters({
    options: {
        theme,
    },
});
