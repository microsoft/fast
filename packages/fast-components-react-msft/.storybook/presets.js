const path = require("path");

module.exports = [
    {
        name: "@storybook/preset-typescript",
        options: {
            tsLoaderOptions: {
                transpileOnly: true,
                compilerOptions: {
                    declaration: false,
                },
            },
        },
    },
    {
        name: "@microsoft/fast-storybook-presets",
    },
];
