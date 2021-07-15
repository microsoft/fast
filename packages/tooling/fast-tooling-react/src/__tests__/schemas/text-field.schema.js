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
        text: {
            title: "Text",
            type: "string",
            examples: ["Example text"],
        },
    },
    required: ["tag", "text"],
};
