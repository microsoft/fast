import { linkedDataSchema } from "@microsoft/fast-tooling";

/**
 * Complies with FAST Tooling 2.0
 */
export default {
    $schema: "http://json-schema.org/schema#",
    title: "Action toggle",
    description: "An action toggle component's schema definition.",
    type: "object",
    id: "@microsoft/fast-components-react-msft/action-toggle",
    formPluginId: "@microsoft/fast-components-react-msft/action-toggle",
    properties: {
        appearance: {
            title: "Appearance",
            type: "string",
            default: "primary",
            enum: ["justified", "lightweight", "outline", "primary", "stealth"],
        },
        disabled: {
            title: "Disabled",
            type: "boolean",
        },
        selected: {
            title: "Selected",
            type: "boolean",
        },
        selectedLabel: {
            title: "Selected HTML aria-label attribute",
            type: "string",
        },
        unselectedLabel: {
            title: "Unselected HTML aria-label attribute",
            type: "string",
        },
        selectedGlyph: {
            ...linkedDataSchema,
            title: "Selected glyph",
            formPluginId:
                "@microsoft/fast-components-react-msft/action-toggle/selectedGlyph",
            pluginId: "@microsoft/fast-components-react-msft/action-toggle/selectedGlyph",
        },
        unselectedGlyph: {
            ...linkedDataSchema,
            title: "Unselected glyph",
            formPluginId:
                "@microsoft/fast-components-react-msft/action-toggle/unselectedGlyph",
            pluginId:
                "@microsoft/fast-components-react-msft/action-toggle/unselectedGlyph",
        },
        selectedContent: {
            ...linkedDataSchema,
            title: "Selected content",
            formPluginId:
                "@microsoft/fast-components-react-msft/action-toggle/selectedContent",
        },
        unselectedContent: {
            ...linkedDataSchema,
            title: "Unselected content",
            formPluginId:
                "@microsoft/fast-components-react-msft/action-toggle/unselectedContent",
        },
    },
};
