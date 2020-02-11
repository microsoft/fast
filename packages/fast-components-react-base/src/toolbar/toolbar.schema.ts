export default {
    $schema: "http://json-schema.org/schema#",
    title: "Toolbar",
    description: "A toolbar component's schema definition.",
    type: "object",
    id: "@microsoft/fast-components-react-base/toolbar",
    formPluginId: "@microsoft/fast-components-react-base/toolbar",
    properties: {
        enableAutoFocus: {
            title: "Enable auto focus",
            type: "boolean",
            default: "false",
        },
        initialFocusIndex: {
            title: "Initial focus index",
            type: "number",
        },
        orientation: {
            title: "Orientation",
            type: "string",
            default: "horizontal",
            enum: ["horizontal", "vertical"],
        },
        focusableRoles: {
            title: "Focusable roles",
            type: "array",
            items: {
                type: "string",
            },
        },
        allowFocusOnDisabledItems: {
            title: "Allow focus on disabled items",
            type: "boolean",
            default: "true",
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
