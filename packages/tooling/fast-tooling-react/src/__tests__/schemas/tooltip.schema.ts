export default {
    $schema: "http://json-schema.org/schema#",
    title: "Component with tooltips",
    description: "A test component's schema definition.",
    type: "object",
    id: "tooltip",
    properties: {
        labelOnStandardControl: {
            title: "My label 1",
            description: "My label's tooltip 1",
            type: "string",
        },
        labelOnSingleLineControl: {
            title: "My label 2",
            description: "My label's tooltip 2",
            type: "boolean",
        },
    },
};
