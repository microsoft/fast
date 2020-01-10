import { childrenSchema, ChildrenType } from "@microsoft/fast-tooling";

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
            ...childrenSchema,
            title: "Child nodes",
            allowTypes: [ChildrenType.string, ChildrenType.component],
            defaults: ["@microsoft/fast-components-react-msft/tree-view-item"],
        },
        beforeContent: {
            ...childrenSchema,
            title: "Before content",
            allowTypes: [ChildrenType.component],
            formPluginId:
                "@microsoft/fast-components-react-msft/tree-view-item/beforeContent",
            pluginId:
                "@microsoft/fast-components-react-msft/tree-view-item/beforeContent",
        },
        afterContent: {
            ...childrenSchema,
            title: "After content",
            allowTypes: [ChildrenType.component],
            formPluginId:
                "@microsoft/fast-components-react-msft/tree-view-item/afterContent",
            pluginId: "@microsoft/fast-components-react-msft/tree-view-item/afterContent",
        },
        expandCollapseGlyph: {
            ...childrenSchema,
            title: "Expand / Collapse glyph",
            allowTypes: [ChildrenType.component],
            formPluginId:
                "@microsoft/fast-components-react-msft/tree-view-item/expandCollapseGlyph",
            pluginId:
                "@microsoft/fast-components-react-msft/tree-view-item/expandCollapseGlyph",
        },
        titleContent: {
            ...childrenSchema,
            title: "Title content",
            allowTypes: [ChildrenType.component],
            formPluginId:
                "@microsoft/fast-components-react-msft/tree-view-item/titleContent",
            pluginId: "@microsoft/fast-components-react-msft/tree-view-item/titleContent",
        },
    },
    required: ["titleContent"],
};
