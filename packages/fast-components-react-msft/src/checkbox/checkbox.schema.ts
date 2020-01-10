/**
 * Complies with FAST Tooling 1.0
 */
export default {
    $schema: "http://json-schema.org/schema#",
    title: "Checkbox",
    description: "A checkbox component's schema definition.",
    type: "object",
    id: "@microsoft/fast-components-react-msft/checkbox",
    formPluginId: "@microsoft/fast-components-react-msft/checkbox",
    properties: {
        checked: {
            title: "Checked",
            type: "boolean",
        },
        disabled: {
            title: "Disabled",
            type: "boolean",
        },
        indeterminate: {
            title: "Indeterminate",
            type: "boolean",
        },
        inputId: {
            title: "Input element ID",
            type: "string",
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
            formPluginId: "@microsoft/fast-components-react-msft/checkbox/children",
        },
        label: {
            title: "Label",
            type: "children",
            formPluginId: "@microsoft/fast-components-react-msft/checkbox/label",
            pluginId: "@microsoft/fast-components-react-msft/checkbox/label",
        },
    },
};
