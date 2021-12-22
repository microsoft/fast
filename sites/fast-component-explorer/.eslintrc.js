module.exports = {
    extends: [
        "@microsoft/eslint-config-fast-dna",
        "plugin:react/recommended",
        "prettier",
    ],
    rules: {
        "react/display-name": "off",
        "@typescript-eslint/ban-types": [
            "error",
            {
                types: {
                    "{}": false,
                },
                extendDefaults: true,
            },
        ],
    },
};
