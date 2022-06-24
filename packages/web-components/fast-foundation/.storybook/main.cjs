const ResolveTypescriptPlugin = require("resolve-typescript-plugin");
const path = require("path");

module.exports = {
    addons: ["@storybook/addon-links", "@storybook/addon-essentials"],
    stories: ["../src/**/stories/*.stories.ts"],
    framework: "@storybook/html",
    features: {
        babelModeV7: true,
    },
    core: {
        disableTelemetry: true,
        builder: "webpack5",
    },
    webpackFinal: async config => {
        config.module.rules = [
            {
                test: /\.ts$/,
                loader: "ts-loader",
                sideEffects: true,
                options: {
                    configFile: path.resolve("./tsconfig.json"),
                    transpileOnly: true,
                },
            },
        ];

        config.resolve.plugins = [
            ...(config.resolve.plugins || []),
            new ResolveTypescriptPlugin({
                includeNodeModules: true,
            }),
        ];
        return config;
    },
};
