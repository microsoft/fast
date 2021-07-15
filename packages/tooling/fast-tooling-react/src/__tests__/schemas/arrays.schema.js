export default {
    $schema: "http://json-schema.org/schema#",
    title: "Component with array",
    description: "A test component's schema definition.",
    type: "object",
    id: "arrays",
    properties: {
        strings: {
            title: "Array of strings",
            type: "array",
            items: {
                title: "String",
                type: "string",
            },
            minItems: 2,
            maxItems: 5,
        },
        objects: {
            title: "Array of objects",
            type: "array",
            items: {
                title: "Object",
                type: "object",
                properties: {
                    string: {
                        title: "String",
                        type: "string",
                    },
                },
                required: ["string"],
            },
        },
        stringsWithDefault: {
            title: "Array of strings with default",
            type: "array",
            items: {
                title: "String",
                type: "string",
            },
            default: ["foo", "bar"],
        },
        objectsWithDefault: {
            title: "Array of objects with default",
            type: "array",
            items: {
                title: "Object",
                type: "object",
                properties: {
                    string: {
                        title: "String",
                        type: "string",
                    },
                },
                required: ["string"],
            },
            default: [
                {
                    string: "foo",
                },
                {
                    string: "bar",
                },
            ],
        },
    },
    required: ["strings"],
};
