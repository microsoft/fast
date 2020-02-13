module.exports = {
    stories: ["../src/**/stories.ts"],
    webpackFinal: async config => {
        config.module.rules.push({
            test: /\.(ts|tsx)$/,
            use: [
                {
                    loader: require.resolve("awesome-typescript-loader"),
                },
            ],
        });
        config.resolve.extensions.push(".ts");

        // config.entry = config.entry.filter(entry => !entry.includes('/webpack-hot-middleware/'))
        return config;
    },
};
