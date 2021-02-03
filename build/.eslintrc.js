module.exports = {
    extends: ["@microsoft/eslint-config-fast-dna", "prettier"],
    env: {
        es6: true,
        node: true,
    },
    rules: {
        "@typescript-eslint/explicit-function-return-type": 0,
        "@typescript-eslint/no-var-requires": 0,
        "@typescript-eslint/typedef": 0,
        "@typescript-eslint/explicit-module-boundary-types": 0,
        "@typescript-eslint/naming-convention": [
            0,
            {
                selector: "interface",
                format: ["PascalCase"],
                custom: {
                    regex: "^I[A-Z]",
                    match: true,
                },
            },
        ],
    },
};
