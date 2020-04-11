import { linkedDataSchema } from "@microsoft/fast-tooling";

/**
 * Complies with FAST Tooling 2.0
 */
export default {
    $schema: "http://json-schema.org/schema#",
    title: "Select option",
    description: "A select option component's schema definition.",
    type: "object",
    id: "@microsoft/fast-components-react-msft/select-option",
    formPluginId: "@microsoft/fast-components-react-msft/select-option",
    properties: {
        disabled: {
            title: "Disabled",
            type: "boolean",
        },
        displayString: {
            title: "Display string",
            type: "string",
        },
        id: {
            title: "Unique ID",
            type: "string",
        },
        value: {
            title: "Value",
            type: "string",
        },
        children: {
            ...linkedDataSchema,
            formPluginId: "@microsoft/fast-components-react-msft/select-option/children",
            defaults: ["text"],
        },
        glyph: {
            ...linkedDataSchema,
            title: "Glyph",

            formPluginId: "@microsoft/fast-components-react-msft/select-option/glyph",
            pluginId: "@microsoft/fast-components-react-msft/select-option/glyph",
        },
    },
    required: ["id", "value"],
};
