export default {
    $schema: "http://json-schema.org/schema#",
    title: "Toolbar",
    description: "A toolbar component's schema definition.",
    type: "object",
    id: "@microsoft/fast-components-react-base/toolbar",
    formPluginId: "@microsoft/fast-components-react-base/toolbar",
    properties: {
        initialFocusIndex: {
            title: "Initial focus index",
            type: "array",
        },
        orientation: {
            title: "Orientation",
            type: "string",
            default: "horizontal",
            enum: ["horizontal", "vertical"],
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
