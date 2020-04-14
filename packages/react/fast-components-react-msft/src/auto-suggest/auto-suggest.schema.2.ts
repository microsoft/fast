import { linkedDataSchema } from "@microsoft/fast-tooling";

/**
 * Complies with FAST Tooling 2.0
 */
export default {
    $schema: "http://json-schema.org/schema#",
    title: "Auto suggest",
    description: "An auto suggest component's schema definition.",
    type: "object",
    id: "@microsoft/fast-components-react-msft/auto-suggest",
    properties: {
        placeholder: {
            title: "Placeholder",
            type: "string",
        },
        disabled: {
            title: "Disabled",
            type: "boolean",
        },
        isMenuOpen: {
            title: "Is menu open",
            type: "boolean",
        },
        initialValue: {
            title: "Initial value",
            type: "string",
        },
        value: {
            title: "Value",
            type: "string",
        },
        label: {
            title: "Label",
            type: "string",
        },
        listboxId: {
            title: "Listbox Id",
            type: "string",
        },
        filterSuggestions: {
            title: "Filter suggestions",
            type: "boolean",
            default: "false",
        },
        children: {
            ...linkedDataSchema,
            title: "Building blocks",
        },
    },
    required: ["listboxId"],
};
