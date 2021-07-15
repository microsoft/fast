export default {
    $schema: "http://json-schema.org/schema#",
    title: "Component with horizontal alignment",
    description: "A test component's schema definition.",
    type: "object",
    id: "alignHorizontal",
    properties: {
        alignHorizontal: {
            title: "Horizontal alignment",
            type: "string",
            enum: ["left", "center", "right"],
        },
    },
    required: ["alignHorizontal"],
};
