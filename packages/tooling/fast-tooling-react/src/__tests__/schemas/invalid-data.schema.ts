export default {
    $schema: "https://json-schema.org/schema#",
    title: "Component with invalid data",
    description: "A test component's schema definition.",
    type: "object",
    id: "invalidData",
    properties: {
        invalidBooleanWrongType: {
            title: "Invalid boolean wrong type",
            type: "boolean",
        },
        invalidBooleanRequired: {
            title: "Invalid boolean required",
            type: "boolean",
        },
        invalidNullWrongType: {
            title: "Invalid null wrong type",
            type: "null",
        },
        invalidNullRequired: {
            title: "Invalid null required",
            type: "null",
        },
        invalidStringWrongType: {
            title: "Invalid string wrong type",
            type: "string",
        },
        invalidNumberWrongType: {
            title: "Invalid number wrong type",
            type: "number",
        },
        invalidEnumWrongType: {
            title: "Invalid enum wrong type",
            type: "string",
            enum: ["foo", "bar", "bat"],
        },
        invalidArrayWrongType: {
            title: "Invalid array wrong type",
            type: "array",
            items: {
                title: "Invalid array wrong type item",
                type: "string",
            },
        },
        invalidObjectWrongType: {
            title: "Invalid object wrong type",
            type: "object",
        },
        invalidObjectMissingProperty: {
            title: "Invalid object missing property",
            type: "object",
            properties: {
                foo: {
                    title: "String",
                    type: "string",
                },
                bar: {
                    title: "Missing required property",
                    type: "string",
                },
            },
            required: ["bar"],
        },
        objectExample: {
            title: "Object",
            type: "object",
            properties: {
                invalidBooleanWrongType: {
                    title: "Invalid boolean wrong type",
                    type: "boolean",
                },
            },
        },
        arrayExample: {
            title: "Array",
            type: "array",
            items: {
                title: "Invalid string wrong type",
                type: "string",
            },
        },
    },
    required: ["invalidBooleanRequired", "invalidNullRequired"],
};
