export default {
    $schema: "http://json-schema.org/schema#",
    title: "Component with custom CSS controls",
    description: "A test component's schema definition.",
    type: "object",
    id: "controlPluginCss",
    properties: {
        css: {
            title: "CSS",
            type: "string",
            formControlId: "custom-controls/css",
        },
    },
};
