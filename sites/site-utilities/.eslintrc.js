module.exports = {
    extends: ["@microsoft/eslint-config-fast-dna", "prettier"],
    env: {
        "shared-node-browser": true,
    },
    rules: {
        "@typescript-eslint/no-unused-vars": "off",
        "react/display-name": "off",
    },
};
