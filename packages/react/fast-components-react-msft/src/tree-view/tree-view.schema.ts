/**
 * Complies with FAST Tooling 1.0
 */
export default {
    $schema: "http://json-schema.org/schema#",
    title: "Tree view",
    description: "A tree view schema definition.",
    type: "object",
    id: "@microsoft/fast-components-react-msft/tree-view",
    formPluginId: "@microsoft/fast-components-react-msft/tree-view",
    properties: {},
    reactProperties: {
        children: {
            title: "Child nodes",
            type: "children",
            ids: ["@microsoft/fast-components-react-msft/tree-view-item"],
        },
    },
};
