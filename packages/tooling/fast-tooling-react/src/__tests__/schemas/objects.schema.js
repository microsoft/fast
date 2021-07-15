export default {
    $schema: "http://json-schema.org/schema#",
    title: "Component with objects",
    description: "A test component's schema definition.",
    type: "object",
    id: "objects",
    properties: {
        objectNoRequired: {
            title: "object with no required items",
            type: "object",
            properties: {
                number: {
                    type: "number",
                },
            },
        },
        objectWithRequired: {
            title: "object with required items",
            type: "object",
            properties: {
                boolean: {
                    type: "boolean",
                },
            },
            required: ["boolean"],
        },
        optionalObjectWithRequired: {
            title: "optional object",
            type: "object",
            properties: {
                string: {
                    type: "string",
                },
            },
            required: ["string"],
        },
        optionalObjectNoRequired: {
            title: "object with no required items",
            type: "object",
            properties: {
                boolean: {
                    type: "boolean",
                },
            },
        },
        optionalObjectWithNestedObject: {
            title: "object with nested object",
            type: "object",
            properties: {
                nestedObject: {
                    title: "Nested object",
                    type: "object",
                    properties: {
                        boolean: {
                            type: "boolean",
                        },
                    },
                },
            },
        },
        optionalObjectWithDefaultValue: {
            title: "object with defaultValues",
            type: "object",
            properties: {
                foo: {
                    type: "string",
                },
            },
            default: {
                foo: "bar",
            },
        },
        optionalObjectDisabled: {
            title: "object disabled",
            type: "object",
            disabled: true,
            properties: {
                foo: {
                    title: "Disabled textarea",
                    type: "string",
                },
                bar: {
                    title: "Disabled numberfield",
                    type: "number",
                },
            },
            default: {
                foo: "bar",
            },
        },
    },
    required: ["objectNoRequired", "objectWithRequired"],
};
