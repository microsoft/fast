import { childrenSchema, ChildrenType } from "@microsoft/fast-tooling";

/**
 * Complies with FAST Tooling 2.0
 */
export default {
    $schema: "http://json-schema.org/schema#",
    title: "Tree view",
    description: "A tree view schema definition.",
    type: "object",
    id: "@microsoft/fast-components-react-msft/tree-view",
    formPluginId: "@microsoft/fast-components-react-msft/tree-view",
    properties: {
        children: {
            ...childrenSchema,
            title: "Child nodes",
            allowTypes: [ChildrenType.component],
            ids: ["@microsoft/fast-components-react-msft/tree-view-item"],
        },
    },
};
