import { linkedDataSchema } from "@microsoft/fast-tooling";

/**
 * Complies with FAST Tooling 2.0
 */
export default {
    $schema: "http://json-schema.org/schema#",
    title: "Tree view",
    description: "A tree view schema definition.",
    type: "object",
    id: "@microsoft/fast-components-react-base/tree-view",
    formPluginId: "@microsoft/fast-components-react-base/tree-view",
    properties: {
        children: {
            ...linkedDataSchema,
            title: "Child nodes",
            ids: ["@microsoft/fast-components-react-base/tree-view-item"],
        },
    },
};
