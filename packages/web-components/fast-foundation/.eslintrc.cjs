const path = require("path");

module.exports = {
    extends: [
        "../../../.eslintrc.js",
        "plugin:storybook/recommended",
    ],
    rules: {
        "@typescript-eslint/naming-convention": [
            "error",
            {
                selector: "typeLike",
                format: ["UPPER_CASE", "camelCase", "PascalCase"],
                leadingUnderscore: "allow",
            },
        ],
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
    },
    overrides: [
        {
            files: ["**/*.cjs"],
            env: {
                commonjs: true,
                node: true,
            },
            rules: {
                "@typescript-eslint/no-var-requires": "off",
            },
        },
        {
            files: ["**/*.ts"],
            excludedFiles: ["playwright.config.ts"],
            parserOptions: {
                parser: "@typescript-eslint/parser",
                project: path.resolve(__dirname, "./tsconfig.json"),
            },
            rules: {
                "@typescript-eslint/consistent-type-imports": "error",
                "@typescript-eslint/consistent-type-exports": [
                    "error",
                    { fixMixedExportsWithInlineTypeSpecifier: false },
                ],
            },
        },
        {
            files: ["**/*.ts"],
            excludedFiles: ["**/*.stories.ts"],
            rules: {
                "no-restricted-imports": [
                    "error",
                    { patterns: ["**/stories/**", "**/*.pw.spec.ts"] },
                ],
            },
        },
    ],
};
