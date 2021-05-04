export default {
    $schema: "http://json-schema.org/schema#",
    title: "Component with custom CSS controls with overrides",
    description: "A test component's schema definition.",
    type: "object",
    id: "controlPluginCssWithOverrides",
    properties: {
        cssWithOverrides: {
            title: "CSS with overrides",
            type: "string",
            formControlId: "custom-controls/css-with-overrides",
        },
    },
};
