const CircularDependencyPlugin = require("circular-dependency-plugin");

module.exports = {
    stories: ["../src/**/*.stories.ts"],
    addons: ["@storybook/addon-essentials"],
    webpackFinal: async config => {
        config.module.rules.push({
            test: /\.ts$/,
            use: [
                {
                    loader: require.resolve("ts-loader"),
                },
            ],
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
