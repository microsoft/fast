import { linkedDataSchema } from "@microsoft/fast-tooling";

export default {
    $schema: "http://json-schema.org/schema#",
    title: "Category",
    description: "A test component's schema definition.",
    type: "object",
    $id: "category",
    id: "category",
    properties: {
        string: {
            title: "Textarea",
            type: "string",
        },
        boolean: {
            title: "Checkbox",
            type: "boolean",
        },
        enum: {
            title: "Select",
            type: "string",
            enum: ["span", "button"],
        },
        number: {
            title: "Numberfield",
            type: "number",
        },
        object: {
            title: "Object",
            type: "object",
            properties: {
                number: {
                    type: "number",
                },
            },
        },
        array: {
            title: "Array",
            type: "array",
            items: {
                title: "String item",
                type: "string",
            },
        },
        children: {
            title: "Linked data",
            ...linkedDataSchema,
        },
    },
};
