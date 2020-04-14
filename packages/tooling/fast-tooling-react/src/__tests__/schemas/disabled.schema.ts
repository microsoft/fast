import { linkedDataSchema } from "@microsoft/fast-tooling";

export default {
    $schema: "http://json-schema.org/schema#",
    title: "Component with all disabled types",
    description: "A test component's schema definition.",
    type: "object",
    id: "disabled",
    disabled: true,
    properties: {
        textarea: {
            title: "textarea",
            type: "string",
            disabled: true,
        },
        "section-link": {
            title: "section-link",
            type: "object",
            disabled: true,
        },
        display: {
            title: "display",
            const: "foobar",
            disabled: true,
        },
        checkbox: {
            title: "checkbox",
            type: "boolean",
            disabled: true,
        },
        button: {
            title: "button",
            type: "null",
            disabled: true,
        },
        array: {
            title: "array",
            items: {
                title: "array item",
                type: "string",
                disabled: true,
            },
            disabled: true,
        },
        "number-field": {
            title: "number-field",
            type: "number",
            disabled: true,
        },
        select: {
            title: "select",
            type: "string",
            enum: ["foo", "bar", "bat"],
            disabled: true,
        },
        children: {
            ...linkedDataSchema,
            disabled: true,
        },
    },
};
