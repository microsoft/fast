module.exports = {
    extends: ["@microsoft/eslint-config-fast-dna", "prettier"],
    rules: {
        "@typescript-eslint/no-unused-vars": "off",
        "react/display-name": "off",
        "no-extra-boolean-cast": "off",
        "@typescript-eslint/no-use-before-define": "off",
        "@typescript-eslint/typedef": "off",
        "@typescript-eslint/explicit-function-return-type": "off",
        "@typescript-eslint/no-non-null-assertion": "off",
    },
};
