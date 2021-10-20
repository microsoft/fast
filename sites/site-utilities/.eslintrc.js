module.exports = {
    extends: [
        "@microsoft/eslint-config-fast-dna",
        "plugin:react/recommended",
        "prettier",
    ],
    rules: {
        "@typescript-eslint/no-unused-vars": "off",
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
