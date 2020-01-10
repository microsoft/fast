import { childrenSchema, ChildrenType } from "@microsoft/fast-tooling";

/**
 * Complies with FAST Tooling 2.0
 */
export default {
    $schema: "http://json-schema.org/schema#",
    title: "Pivot",
    description: "A pivot component's schema definition.",
    type: "object",
    id: "@microsoft/fast-components-react-msft/pivot",
    formPluginId: "@microsoft/fast-components-react-msft/pivot",
    properties: {
        activeId: {
            title: "Active pivot ID",
            type: "string",
        },
        label: {
            title: "HTML aria-label attribute",
            type: "string",
        },
        orientation: {
            title: "HTML aria-orientation attribute",
            type: "string",
            enum: ["horizontal", "vertical"],
        },
        items: {
            title: "Items",
            type: "array",
            items: {
                title: "Item",
                type: "object",
                properties: {
                    id: {
                        title: "HTML id attribute",
                        type: "string",
                    },
                    tab: {
                        ...childrenSchema,
                        title: "Pivot tab",
                        formPluginId:
                            "@microsoft/fast-components-react-msft/pivot/items/tab",
                        pluginId: "@microsoft/fast-components-react-msft/pivot/items/tab",
                        allowTypes: [ChildrenType.string, ChildrenType.component],
                    },
                    content: {
                        ...childrenSchema,
                        title: "Pivot content",
                        formPluginId:
                            "@microsoft/fast-components-react-msft/pivot/items/content",
                        pluginId:
                            "@microsoft/fast-components-react-msft/pivot/items/content",
                        allowTypes: [ChildrenType.string, ChildrenType.component],
                    },
                },
                required: ["tab", "content", "id"],
            },
        },
    },
};
