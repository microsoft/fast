/**
 * Complies with FAST Tooling 1.0
 */
export default {
    $schema: "http://json-schema.org/schema#",
    title: "Checkbox",
    description: "A checkbox component's schema definition.",
    type: "object",
    id: "@microsoft/fast-components-react-base/checkbox",
    formPluginId: "@microsoft/fast-components-react-base/checkbox",
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
        ariaLabel: {
            title: "Aria-label",
            type: "string",
            examples: ["label"],
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
            formPluginId: "@microsoft/fast-components-react-base/checkbox/children",
        },
        label: {
            title: "Label",
            type: "children",
            formPluginId: "@microsoft/fast-components-react-base/checkbox/label",
            pluginId: "@microsoft/fast-components-react-base/checkbox/label",
        },
    },
};
