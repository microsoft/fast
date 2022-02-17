module.exports = {
    extends: ["@microsoft/eslint-config-fast-dna", "prettier"],
    rules: {
        "import/extensions": ["error", "always"],
        "max-classes-per-file": "off",
        "no-case-declarations": "off",
        "@typescript-eslint/no-non-null-assertion": "off",
        "@typescript-eslint/ban-types": [
            "error",
            {
                types: {
                    "{}": false,
                    Function: false,
                    Object: false,
                },
                extendDefaults: true,
            },
        ],
        "@typescript-eslint/no-use-before-define": ["error", { typedefs: false }],
        "@typescript-eslint/explicit-function-return-type": [
            "error",
            {
                allowExpressions: true,
            },
        ],
    },
};
