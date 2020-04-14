/**
 * Complies with FAST Tooling 1.0
 */
export default {
    $schema: "http://json-schema.org/schema#",
    title: "Progress",
    description: "A progress component's schema definition.",
    type: "object",
    id: "@microsoft/fast-components-react-msft/progress",
    formPluginId: "@microsoft/fast-components-react-msft/progress",
    properties: {
        value: {
            title: "HTML value attribute",
            type: "number",
        },
        minValue: {
            title: "HTML minValue attribute",
            type: "number",
        },
        maxValue: {
            title: "HTML maxValue attribute",
            type: "number",
        },
        circular: {
            title: "Circular",
            type: "boolean",
            default: false,
        },
        paused: {
            title: "Paused",
            type: "boolean",
            default: false,
        },
        size: {
            title: "Circular progress size",
            type: "string",
            enum: ["control", "container", "page"],
            default: "container",
        },
    },
    reactProperties: {
        children: {
            title: "Children",
            type: "children",
            formPluginId: "@microsoft/fast-components-react-msft/progress/children",
        },
    },
};
