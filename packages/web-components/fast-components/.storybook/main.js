const CircularDependencyPlugin = require("circular-dependency-plugin");

module.exports = {
    features: {
        postcss: false,
    },
    stories: ["../src/**/*.stories.ts"],
    webpackFinal: async config => {
        config.module.rules.push({
            test: /\.ts$/,
            sideEffects: true,
            use: "ts-loader",
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
