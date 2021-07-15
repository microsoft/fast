import { linkedDataSchema } from "@microsoft/fast-tooling";
export default {
    $schema: "http://json-schema.org/schema#",
    title: "General example",
    description: "A test component's schema definition.",
    type: "object",
    id: "generalExample",
    properties: {
        title: {
            title: "Title",
            type: "string",
        },
        toggle: {
            title: "Checkbox",
            type: "boolean",
        },
        details: {
            title: "Details",
            type: "string",
        },
        toggle2: {
            title: "Checkbox",
            type: "boolean",
        },
        tag: {
            title: "HTML tag",
            type: "string",
            enum: ["span", "button"],
            default: "button",
        },
        level: {
            title: "Level",
            type: "number",
            examples: [5],
        },
        text: {
            title: "Text",
            type: "string",
            examples: ["Example text"],
        },
        alignHorizontal: {
            title: "Align horizontal",
            type: "string",
            enum: ["left", "center", "right"],
        },
        alignVertical: {
            title: "Align vertical",
            type: "string",
            enum: ["top", "bottom", "center"],
        },
        level2: {
            title: "Level",
            type: "number",
            examples: [100],
        },
        objectNoRequired: {
            title: "Object (no required items)",
            type: "object",
            properties: {
                number: {
                    type: "number",
                },
            },
        },
        objectWithRequired: {
            title: "Object (with required items)",
            type: "object",
            properties: {
                boolean: {
                    type: "boolean",
                },
            },
            required: ["boolean"],
        },
        optionalObjectWithRequired: {
            title: "Optional object",
            type: "object",
            properties: {
                string: {
                    type: "string",
                },
            },
            required: ["string"],
        },
        optionalObjectNoRequired: {
            title: "Object with no required items",
            type: "object",
            properties: {
                boolean: {
                    type: "boolean",
                },
            },
        },
        strings: {
            title: "Array",
            type: "array",
            items: {
                type: "string",
            },
            minItems: 0,
            maxItems: 6,
        },
        theme: {
            title: "Theme",
            type: "string",
            enum: ["light", "dark"],
        },
        children: Object.assign({}, linkedDataSchema),
    },
    required: [
        "alignHorizontal",
        "alignVertical",
        "level",
        "level2",
        "title",
        "details",
        "tag",
        "toggle",
        "toggle2",
    ],
};
