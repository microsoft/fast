/**
 * Complies with FAST Tooling 1.0
 */
export default {
    $schema: "http://json-schema.org/schema#",
    title: "AutoSuggest",
    description: "An auto suggest component's schema definition.",
    type: "object",
    id: "auto-suggest",
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
        filterSuggestions: {
            title: "Filter suggestions",
            type: "boolean",
            default: "false",
        },
    },
    reactProperties: {
        children: {
            title: "Building blocks",
            type: "children",
            defaults: ["text"],
        },
    },
    required: ["listboxId"],
};
