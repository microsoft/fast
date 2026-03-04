module.exports = {
    extends: ["../../.eslintrc.js"],
    overrides: [
        {
            files: ["**/*.spec.ts"],
            rules: {
                "max-len": "off",
                "@typescript-eslint/no-empty-function": [
                    "error",
                    {
                        allow: [
                            "asyncMethods",
                            "methods",
                            "generatorMethods",
                            "arrowFunctions",
                        ],
                    },
                ],
            },
        },
    ],
};
