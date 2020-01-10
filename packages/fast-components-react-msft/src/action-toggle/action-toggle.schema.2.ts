import { childrenSchema, ChildrenType } from "@microsoft/fast-tooling";

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
            ...childrenSchema,
            title: "Selected glyph",
            formPluginId:
                "@microsoft/fast-components-react-msft/action-toggle/selectedGlyph",
            pluginId: "@microsoft/fast-components-react-msft/action-toggle/selectedGlyph",
            allowTypes: [ChildrenType.component],
        },
        unselectedGlyph: {
            ...childrenSchema,
            title: "Unselected glyph",
            formPluginId:
                "@microsoft/fast-components-react-msft/action-toggle/unselectedGlyph",
            pluginId:
                "@microsoft/fast-components-react-msft/action-toggle/unselectedGlyph",

            allowTypes: [ChildrenType.component],
        },
        selectedContent: {
            ...childrenSchema,
            title: "Selected content",
            formPluginId:
                "@microsoft/fast-components-react-msft/action-toggle/selectedContent",
            allowTypes: [ChildrenType.component],
        },
        unselectedContent: {
            ...childrenSchema,
            title: "Unselected content",
            formPluginId:
                "@microsoft/fast-components-react-msft/action-toggle/unselectedContent",
            allowTypes: [ChildrenType.component],
        },
    },
};
