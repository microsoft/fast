export default {
    $schema: "http://json-schema.org/schema#",
    title: "Component with text-field",
    description: "A test component's schema definition.",
    type: "object",
    id: "textField",
    properties: {
        tag: {
            title: "Tag",
            type: "string",
            enum: ["span", "button"],
            default: "button",
        },
        textWithExamples: {
            title: "Text with examples",
            type: "string",
            examples: ["Example text"],
        },
        textWithDefault: {
            title: "Text with default",
            type: "string",
            default: "Default value",
        },
        optionalTextWithExamples: {
            title: "Optional text with examples",
            type: "string",
            examples: ["Example text"],
        },
        optionalTextWithDefault: {
            title: "Optional text with default",
            type: "string",
            default: "Default value",
        },
        optionalTag: {
            title: "Optional tag",
            type: "string",
            enum: ["span", "button"],
            default: "button",
        },
        disabledTag: {
            title: "Disabled tag",
            type: "string",
            enum: ["span", "button"],
            default: "button",
            disabled: true,
        },
        disabledText: {
            title: "Disabled text area",
            type: "string",
            examples: ["Example text"],
            disabled: true,
        },
    },
    required: ["tag", "textWithDefault", "textWithExamples", "disabledText"],
};
