export default {
    $schema: "https://json-schema.org/schema#",
    title: "Component with null",
    description: "A test component's schema definition.",
    type: "object",
    id: "nullKeyword",
    properties: {
        optionalNull: {
            title: "optional null",
            type: "null",
        },
        requiredNull: {
            title: "required null",
            type: "null",
        },
    },
    required: ["requiredNull"],
};
