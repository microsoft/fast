export default {
    $schema: "http://json-schema.org/schema#",
    title: "Toolbar item group",
    description: "A toolbar item group component's schema definition.",
    type: "object",
    id: "@microsoft/fast-components-react-base/toolbar-item-group",
    formPluginId: "@microsoft/fast-components-react-base/toolbar-item-group",
    properties: {
        itemPath: {
            title: "Item path",
            type: "array",
        },
    },
    reactProperties: {
        children: {
            title: "Children",
            type: "children",
            formPluginId: "@microsoft/fast-components-react-base/toolbar/children",
            ids: [],
        },
    },
};
