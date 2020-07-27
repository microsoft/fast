const CircularDependencyPlugin = require("circular-dependency-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
    stories: ["../src/**/*.stories.ts", "../src/**/*.stories.tsx"],
    webpackFinal: async config => {
        config.module.rules.push({
            test: /\.ts$/,
            use: [
                {
                    loader: require.resolve("ts-loader"),
                },
            ],
        });
        config.resolve.extensions.push(".ts");
        config.resolve.extensions.push(".js");
        config.plugins.push(
            new CircularDependencyPlugin({
                exclude: /node_modules/,
                failOnError: process.env.NODE_ENV === "production",
            }),
            new CopyWebpackPlugin([
                {
                    from: "src/unity-host/fixtures/wasm/build",
                    to: "src/unity-host/fixtures/wasm/build",
                },
                {
                    from: "src/mock-ui/fixtures/wasm/build",
                    to: "src/mock-ui/fixtures/wasm/build",
                },
            ])
        );

        return config;
    },
};
