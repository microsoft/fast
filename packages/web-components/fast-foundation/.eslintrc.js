module.exports = {
    extends: ["@microsoft/eslint-config-fast-dna", "prettier"],
    rules: {
        "no-extra-boolean-cast": "off",
        "@typescript-eslint/no-use-before-define": "off",
        "@typescript-eslint/typedef": "off",
        "@typescript-eslint/explicit-function-return-type": "off",
        "@typescript-eslint/no-non-null-assertion": "off",
        "@typescript-eslint/no-empty-interface": [
            "error",
            {
                allowSingleExtends: true,
            },
        ],
        "@typescript-eslint/explicit-module-boundary-types": [
            "error",
            {
                allowArgumentsExplicitlyTypedAsAny: true,
            },
        ],
        "@typescript-eslint/consistent-type-imports": [
            "error",
            {
                prefer: "type-imports",
            },
        ],
    },
};
