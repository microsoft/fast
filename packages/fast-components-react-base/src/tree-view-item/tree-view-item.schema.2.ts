import { childrenSchema, ChildrenType } from "@microsoft/fast-tooling";

/**
 * Complies with FAST Tooling 2.0
 */
export default {
    $schema: "http://json-schema.org/schema#",
    title: "Tree view item",
    description: "A tree view item schema definition.",
    type: "object",
    id: "@microsoft/fast-components-react-base/tree-view-item",
    formPluginId: "@microsoft/fast-components-react-base/tree-view-item",
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
            defaults: ["@microsoft/fast-components-react-base/tree-view-item"],
            allowTypes: [ChildrenType.string, ChildrenType.component],
        },
        expandCollapseGlyph: {
            ...childrenSchema,
            title: "Expand / Collapse glyph",
            formPluginId:
                "@microsoft/fast-components-react-base/tree-view-item/expandCollapseGlyph",
            pluginId:
                "@microsoft/fast-components-react-base/tree-view-item/expandCollapseGlyph",
            allowTypes: [ChildrenType.component],
        },
        titleContent: {
            ...childrenSchema,
            title: "Title content",
            formPluginId:
                "@microsoft/fast-components-react-base/tree-view-item/titleContent",
            pluginId: "@microsoft/fast-components-react-base/tree-view-item/titleContent",
            allowTypes: [ChildrenType.component],
        },
    },
    required: ["titleContent"],
};
