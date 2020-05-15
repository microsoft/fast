const CircularDependencyPlugin = require("circular-dependency-plugin");

module.exports = {
    stories: ["../src/**/*.stories.ts"],
    webpackFinal: async config => {
        config.module.rules.push({
            test: /\.(ts|tsx)$/,
            use: [
                {
                    loader: require.resolve("ts-loader"),
                },
            ],
        });
        config.resolve.extensions.push(".ts");
        config.plugins.push(
            new CircularDependencyPlugin({
                exclude: /node_modules/,
                failOnError: process.env.NODE_ENV === "production",
            })
        );

        return config;
    },
};
