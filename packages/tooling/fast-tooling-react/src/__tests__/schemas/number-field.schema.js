export default {
    $schema: "http://json-schema.org/schema#",
    title: "Component with number-field",
    description: "A test component's schema definition.",
    type: "object",
    id: "numberField",
    properties: {
        level: {
            title: "Level",
            type: "number",
            enum: [1, 2, 3, 4],
            default: 1,
        },
        quantity: {
            title: "Quantity",
            type: "number",
            examples: [10],
            minimum: 0,
            maximum: 50,
            multipleOf: 5,
        },
        defaultNumber: {
            title: "Default number",
            type: "number",
            default: 5,
        },
        optionalNumber: {
            title: "Optional number field",
            type: "number",
        },
        disabledNumber: {
            title: "Disabled number field",
            type: "number",
            disabled: true,
        },
    },
    required: ["level", "quantity"],
};
