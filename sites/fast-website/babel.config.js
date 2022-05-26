module.exports = {
    presets: [
        [
            "@babel/preset-env",
            {
                targets: "defaults",
            },
        ],
    ],
    plugins: [["@babel/plugin-transform-runtime"]],
};
