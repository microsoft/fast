module.exports = {
    extends: ["@microsoft/eslint-config-fast-dna", "prettier"],
    rules: {
        "max-classes-per-file": "off",
        "no-case-declarations": "off",
        "@typescript-eslint/no-non-null-assertion": "off",
        "@typescript-eslint/no-use-before-define": ["error", { typedefs: false }],
        "@typescript-eslint/explicit-function-return-type": [
            "error",
            {
                allowExpressions: true,
            },
        ],
    },
};
