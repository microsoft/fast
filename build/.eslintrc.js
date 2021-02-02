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
    },
};
