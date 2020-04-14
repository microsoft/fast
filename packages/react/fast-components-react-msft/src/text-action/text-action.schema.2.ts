import { linkedDataSchema } from "@microsoft/fast-tooling";

/**
 * Complies with FAST Tooling 2.0
 */
export default {
    $schema: "http://json-schema.org/schema#",
    title: "Text action",
    description: "A text action component's schema definition.",
    type: "object",
    id: "@microsoft/fast-components-react-msft/text-action",
    formPluginId: "@microsoft/fast-components-react-msft/text-action",
    properties: {
        disabled: {
            title: "Disabled",
            type: "boolean",
        },
        placeholder: {
            title: "Placeholder",
            type: "string",
        },
        appearance: {
            title: "Appearance",
            type: "string",
            enum: ["filled", "outline"],
        },
        beforeGlyph: {
            ...linkedDataSchema,
            title: "Before glyph",

            formPluginId: "@microsoft/fast-components-react-msft/text-action/beforeGlyph",
            pluginId: "@microsoft/fast-components-react-msft/text-action/beforeGlyph",
        },
        button: {
            ...linkedDataSchema,

            title: "Button",
            formPluginId: "@microsoft/fast-components-react-msft/text-action/button",
            pluginId: "@microsoft/fast-components-react-msft/text-action/button",
        },
        afterGlyph: {
            ...linkedDataSchema,
            title: "After glyph",

            formPluginId: "@microsoft/fast-components-react-msft/text-action/afterGlyph",
            pluginId: "@microsoft/fast-components-react-msft/text-action/afterGlyph",
        },
    },
};
