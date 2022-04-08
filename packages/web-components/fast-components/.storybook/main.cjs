const CircularDependencyPlugin = require("circular-dependency-plugin");
const ResolveTypescriptPlugin = require("resolve-typescript-plugin");

module.exports = {
    features: {
        postcss: false,
        buildStoriesJson: true,
    },
    addons: ["@storybook/addon-links", "@storybook/addon-essentials"],
    stories: ["../src/**/*.stories.ts"],
    webpackFinal: async config => {
        config.resolve.plugins = config.resolve.plugins ?? [];
        config.resolve.plugins.push(new ResolveTypescriptPlugin());
        config.module.rules.push({
            test: /\.ts$/,
            loader: "ts-loader",
            sideEffects: true,
            options: {
                compilerOptions: {
                    declaration: false,
                    declarationDir: null
                }
            }
        });

        config.plugins.push(
            new CircularDependencyPlugin({
                exclude: /node_modules/,
                failOnError: process.env.NODE_ENV === "production",
            })
        );

        return config;
    },
};
