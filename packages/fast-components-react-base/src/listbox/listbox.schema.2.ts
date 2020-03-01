import { linkedDataSchema } from "@microsoft/fast-tooling";

/**
 * Complies with FAST Tooling 2.0
 */
export default {
    $schema: "http://json-schema.org/schema#",
    title: "Listbox",
    description: "A listbox component's schema definition.",
    type: "object",
    id: "@microsoft/fast-components-react-base/listbox",
    formPluginId: "@microsoft/fast-components-react-base/listbox",
    properties: {
        typeAheadPropertyKey: {
            title: "Type ahead property key",
            type: "string",
        },
        labelledBy: {
            title: "Labelled by",
            type: "string",
        },
        multiselectable: {
            title: "Multi-selectable",
            type: "boolean",
        },
        selectedItems: {
            title: "Selected items",
            type: "string",
        },
        defaultSelection: {
            title: "Default selection",
            type: "string",
        },
        focusItemOnMount: {
            title: "Focus item on mount",
            type: "boolean",
        },
        disabled: {
            title: "Disabled",
            type: "boolean",
        },
        children: {
            ...linkedDataSchema,
            formPluginId: "@microsoft/fast-components-react-base/listbox/children",
        },
    },
};
