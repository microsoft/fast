module.exports = {
    root: true,
    parser: "@typescript-eslint/parser",
    plugins: ["@typescript-eslint", "import"],
    extends: [
        "eslint:recommended",
        "plugin:react/recommended",
        "plugin:@typescript-eslint/eslint-recommended",
        "plugin:@typescript-eslint/recommended",
    ],
    settings: {
        react: {
            version: "latest",
        },
    },
    rules: {
        "@typescript-eslint/interface-name-prefix": ["error", { prefixWithI: "never" }],
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
        "@typescript-eslint/typedef": [
            "error",
            {
                parameter: true,
                propertyDeclaration: true,
                memberVariableDeclaration: true,
                variableDeclarationIgnoreFunction: true,
            },
        ],
        "@typescript-eslint/explicit-function-return-type": "error",
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
        ],
        "@typescript-eslint/no-inferrable-types": "off",
        "no-prototype-builtins": "off",
        "no-fallthrough": "off",
        "no-unexpected-multiline": "off",
        "@typescript-eslint/no-unused-vars": ["warn", { args: "none" }],
        "react/no-children-prop": "off",
        "@typescript-eslint/no-explicit-any": "off",
    },
};
