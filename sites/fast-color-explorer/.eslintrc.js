module.exports = {
    extends: ["@microsoft/eslint-config-fast-dna", "prettier"],
    rules: {
        "@typescript-eslint/explicit-function-return-type": "off",
        "@typescript-eslint/no-non-null-assertion": "off",
        "@typescript-eslint/no-unused-vars": "off",
        "@typescript-eslint/typedef": "off",
        "@typescript-eslint/ban-types": [
            "error",
            {
                types: {
                    "{}": false,
                },
                extendDefaults: true,
            },
        ],
        "no-unused-expressions": "off",
    },
};
