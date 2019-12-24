import React from "react";
import { configure, addParameters, addDecorator } from "@storybook/react";
import { create, Global } from "@storybook/theming";
import { addReadme } from "storybook-readme";

// Import from dist cause storybook throws up if we import the named import from the index
import theme from "@microsoft/fast-storybook-presets/dist/theme";

addDecorator(addReadme);
addParameters({
    options: {
        theme,
    },
});
