import { linkedDataSchema } from "@microsoft/fast-tooling";

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
        object: {
            title: "Nested object",
            type: "object",
            properties: {
                cssWithOverrides2: {
                    title: "CSS 2",
                    type: "string",
                    formControlId: "custom-controls/css",
                },
            },
        },
        children: {
            title: "Children",
            ...linkedDataSchema,
        },
    },
};
