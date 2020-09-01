module.exports = {
    presets: [
        [
            "@babel/preset-env",
            {
                targets: {
                    node: "current",
                },
                modules: false,
            },
        ],
        "@babel/react",
    ],
    plugins: ["@babel/plugin-syntax-dynamic-import"],
};
