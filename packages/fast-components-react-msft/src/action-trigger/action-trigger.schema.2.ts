import { linkedDataSchema } from "@microsoft/fast-tooling";

/**
 * Complies with FAST Tooling 2.0
 */
export default {
    $schema: "http://json-schema.org/schema#",
    title: "Action trigger",
    description: "An action trigger component's schema definition.",
    type: "object",
    id: "@microsoft/fast-components-react-msft/action-trigger",
    formPluginId: "@microsoft/fast-components-react-msft/action-trigger",
    properties: {
        disabled: {
            title: "Disabled",
            type: "boolean",
        },
        href: {
            title: "HTML href attribute",
            type: "string",
        },
        appearance: {
            title: "Appearance",
            type: "string",
            default: "primary",
            enum: ["justified", "lightweight", "outline", "primary", "stealth"],
        },
        children: {
            ...linkedDataSchema,
            formPluginId: "@microsoft/fast-components-react-msft/action-trigger/children",
            examples: ["Lorem ipsum"],
        },
        glyph: {
            ...linkedDataSchema,
            title: "Glyph",
            pluginId: "@microsoft/fast-components-react-msft/action-trigger/glyph",
            formPluginId: "@microsoft/fast-components-react-msft/action-trigger/glyph",
            examples: [
                {
                    id: "svg-svg-element",
                    props: {},
                },
            ],
        },
    },
    required: ["children", "glyph"],
};
