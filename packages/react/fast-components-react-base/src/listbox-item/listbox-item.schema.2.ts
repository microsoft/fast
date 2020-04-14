import { linkedDataSchema } from "@microsoft/fast-tooling";

/**
 * Complies with FAST Tooling 2.0
 */
export default {
    $schema: "http://json-schema.org/schema#",
    title: "Listbox item",
    description: "A listbox item component's schema definition.",
    type: "object",
    id: "@microsoft/fast-components-react-base/listbox-item",
    formPluginId: "@microsoft/fast-components-react-base/listbox-item",
    properties: {
        disabled: {
            title: "Disabled",
            type: "boolean",
        },
        displayString: {
            title: "Display string",
            type: "string",
        },
        id: {
            title: "Unique ID",
            type: "string",
        },
        value: {
            title: "Value",
            type: "string",
        },
        children: {
            ...linkedDataSchema,
            formPluginId: "@microsoft/fast-components-react-base/listbox-item/children",
        },
    },
    required: ["id", "value"],
};
