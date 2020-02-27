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

        return config;
    },
};
