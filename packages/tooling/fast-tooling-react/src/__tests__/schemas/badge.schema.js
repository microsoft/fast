import { linkedDataSchema } from "@microsoft/fast-tooling";
export default {
    $schema: "http://json-schema.org/schema#",
    title: "Badge",
    description: "A test component's schema definition.",
    type: "object",
    id: "badge",
    properties: {
        string: {
            title: "Textarea",
            badge: "info",
            badgeDescription: "More information is provided",
            type: "string",
        },
        boolean: {
            title: "Checkbox",
            badge: "warning",
            badgeDescription: "Warning message",
            type: "boolean",
        },
        enum: {
            title: "Select",
            badge: "locked",
            badgeDescription: "This field is locked",
            type: "string",
            enum: ["span", "button"],
        },
        number: {
            title: "Numberfield",
            badge: "info",
            badgeDescription: "More information is provided",
            type: "number",
        },
        object: {
            title: "Object (no required items)",
            badge: "warning",
            badgeDescription: "Warning message",
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
            badge: "warning",
            badgeDescription: "Warning message",
            items: {
                title: "String item",
                type: "string",
            },
        },
        stringWithDefault: {
            title: "Textarea",
            badge: "info",
            badgeDescription: "More information is provided",
            type: "string",
            default: "Hello world",
        },
        booleanWithDefault: {
            title: "Checkbox",
            badge: "warning",
            badgeDescription: "Warning message",
            type: "boolean",
            default: true,
        },
        enumWithDefault: {
            title: "Select",
            badge: "locked",
            badgeDescription: "This field is locked",
            type: "string",
            enum: ["span", "button"],
            default: "button",
        },
        numberWithDefault: {
            title: "Numberfield",
            badge: "info",
            badgeDescription: "More information is provided",
            type: "number",
            default: 42,
        },
        objectWithDefault: {
            title: "Object (no required items)",
            badge: "warning",
            badgeDescription: "Warning message",
            type: "object",
            properties: {
                number: {
                    type: "number",
                },
            },
            default: {
                number: 100,
            },
        },
        arrayWithDefault: {
            title: "Array",
            type: "array",
            badge: "warning",
            badgeDescription: "Warning message",
            items: {
                title: "String item",
                type: "string",
            },
            default: ["foo", "bar"],
        },
        constWithDefault: {
            title: "Display using const",
            badge: "locked",
            badgeDescription: "This field is locked",
            type: "string",
            const: "A",
            default: "B",
        },
        selectWithSingleItemWithDefault: {
            title: "Display using single enum",
            badge: "locked",
            badgeDescription: "This field is locked",
            type: "string",
            enum: ["A"],
            default: "B",
        },
        children: Object.assign(Object.assign({}, linkedDataSchema), { badge: "warning", badgeDescription: "Warning message" }),
        childrenWithDefault: Object.assign(Object.assign({}, linkedDataSchema), { badge: "warning", badgeDescription: "Warning message", default: {
                id: "textField",
                props: {
                    text: "Hello world",
                },
            } }),
    },
};
