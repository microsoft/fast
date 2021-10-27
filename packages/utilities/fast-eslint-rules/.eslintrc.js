module.exports = {
    root: true,
    parser: "@typescript-eslint/parser",
    plugins: ["@typescript-eslint", "import"],
    extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/eslint-recommended",
        "plugin:@typescript-eslint/recommended",
    ],
    rules: {
        "no-unused-vars": "off",
        "no-extra-boolean-cast": "off",
        "no-empty-function": "off",
        "@typescript-eslint/no-empty-function": [
            "error",
            { allow: ["asyncMethods", "methods"] },
        ],
        "@typescript-eslint/no-use-before-define": "off",
        "@typescript-eslint/typedef": "off",
        "@typescript-eslint/explicit-function-return-type": "off",
        "max-len": ["error", 140],
        "import/order": "error",
        "sort-imports": [
            "error",
            {
                ignoreCase: true,
                ignoreDeclarationSort: true,
            },
        ],
        "comma-dangle": "off",
        "@typescript-eslint/no-empty-interface": [
            "error",
            {
                allowSingleExtends: true,
            },
        ],
        "@typescript-eslint/camelcase": "off",
        "@typescript-eslint/naming-convention": [
            "error",
            {
                selector: "default",
                format: ["UPPER_CASE", "camelCase", "PascalCase"],
                leadingUnderscore: "allow",
            },
            {
                selector: "property",
                format: null, // disable for property names because of our foo__expanded convention for JSS
                // TODO: I think we can come up with a regex that ignores variables with __ in them
            },
            {
                selector: "variable",
                format: null, // disable for variable names because of our foo__expanded convention for JSS
                // TODO: I think we can come up with a regex that ignores variables with __ in them
            },
            {
                selector: "interface",
                format: ["PascalCase"],
                custom: {
                    regex: "^I[A-Z]",
                    match: false,
                },
            },
        ],
        "@typescript-eslint/no-inferrable-types": "off",
        "no-prototype-builtins": "off",
        "no-fallthrough": "off",
        "no-unexpected-multiline": "off",
        "@typescript-eslint/no-unused-vars": ["warn", { args: "none" }],
        "@typescript-eslint/no-explicit-any": "off",
    },
    overrides: [
        {
            files: ["**/*.js"],
            extends: ["eslint:recommended"],
            env: {
                node: true,
                "shared-node-browser": true,
            },
            rules: {
                "@typescript-eslint/no-var-requires": "off",
            },
        },
    ],
};
