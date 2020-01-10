/**
 * Complies with FAST Tooling 1.0
 */
export default {
    $schema: "http://json-schema.org/schema#",
    title: "Radio",
    description: "A radio component's schema definition",
    type: "object",
    id: "@microsoft/fast-components-react-msft/radio",
    formPluginId: "@microsoft/fast-components-react-msft/radio",
    properties: {
        inputId: {
            title: "Unique Id",
            type: "string",
            examples: ["radio01"],
        },
        checked: {
            title: "Checked",
            type: "boolean",
        },
        disabled: {
            title: "Disabled",
            type: "boolean",
        },
        name: {
            title: "Name",
            type: "string",
            examples: ["name"],
        },
    },
    reactProperties: {
        children: {
            title: "Children",
            type: "children",
            formPluginId: "@microsoft/fast-components-react-msft/radio/children",
            defaults: ["text"],
        },
        label: {
            title: "Label",
            type: "children",
            formPluginId: "@microsoft/fast-components-react-msft/radio/label",
            pluginId: "@microsoft/fast-components-react-msft/radio/label",
        },
    },
    required: ["inputId"],
};
