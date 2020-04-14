import { linkedDataSchema } from "@microsoft/fast-tooling";

/**
 * Complies with FAST Tooling 2.0
 */
export default {
    $schema: "http://json-schema.org/schema#",
    title: "Tree view item",
    description: "A tree view item schema definition.",
    type: "object",
    id: "@microsoft/fast-components-react-msft/tree-view-item",
    formPluginId: "@microsoft/fast-components-react-msft/tree-view-item",
    properties: {
        defaultExpanded: {
            title: "Default expanded state",
            type: "boolean",
            default: false,
        },
        selected: {
            title: "Selected state",
            type: "boolean",
        },
        children: {
            ...linkedDataSchema,
            title: "Child nodes",

            defaults: ["@microsoft/fast-components-react-msft/tree-view-item"],
        },
        beforeContent: {
            ...linkedDataSchema,
            title: "Before content",

            formPluginId:
                "@microsoft/fast-components-react-msft/tree-view-item/beforeContent",
            pluginId:
                "@microsoft/fast-components-react-msft/tree-view-item/beforeContent",
        },
        afterContent: {
            ...linkedDataSchema,
            title: "After content",

            formPluginId:
                "@microsoft/fast-components-react-msft/tree-view-item/afterContent",
            pluginId: "@microsoft/fast-components-react-msft/tree-view-item/afterContent",
        },
        expandCollapseGlyph: {
            ...linkedDataSchema,
            title: "Expand / Collapse glyph",

            formPluginId:
                "@microsoft/fast-components-react-msft/tree-view-item/expandCollapseGlyph",
            pluginId:
                "@microsoft/fast-components-react-msft/tree-view-item/expandCollapseGlyph",
        },
        titleContent: {
            ...linkedDataSchema,
            title: "Title content",

            formPluginId:
                "@microsoft/fast-components-react-msft/tree-view-item/titleContent",
            pluginId: "@microsoft/fast-components-react-msft/tree-view-item/titleContent",
        },
    },
    required: ["titleContent"],
};
