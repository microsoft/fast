export default {
    version: 1.1,
    tags: [
        {
            name: "fast-picker",
            title: "Picker",
            description: "The FAST picker element",
            attributes: [
                {
                    name: "selection",
                    description: "The selection attribute",
                    default: "",
                    required: false,
                    type: "string",
                },
                {
                    name: "options",
                    description: "The options attribute",
                    required: false,
                    type: "string",
                    default: "",
                },
                {
                    name: "filter-selected",
                    description: "The filter-selected attribute",
                    type: "boolean",
                    default: true,
                    required: false,
                },
                {
                    name: "filter-query",
                    description: "The filter-query attribute",
                    type: "boolean",
                    default: true,
                    required: false,
                },
                {
                    name: "max-selected",
                    description: "The max-selected attribute",
                    type: "number",
                    default: "",
                    required: false,
                },
                {
                    name: "no-suggestions-text",
                    description: "The no-suggestions-text attribute",
                    type: "string",
                    default: "",
                    required: false,
                },
                {
                    name: "suggestions-available-text",
                    description: "The suggestions-available-text attribute",
                    type: "string",
                    default: "",
                    required: false,
                },
                {
                    name: "loading-text",
                    description: "The loading-text attribute",
                    type: "string",
                    default: "",
                    required: false,
                },
                {
                    name: "label",
                    description: "The label attribute",
                    type: "string",
                    default: "",
                    required: false,
                },
                {
                    name: "labelledby",
                    description: "The labelledby attribute",
                    type: "string",
                    default: "",
                    required: false,
                },
                {
                    name: "menu-placement",
                    description: "The menu-placement attribute",
                    type: "string",
                    default: "",
                    required: false,
                },
                {
                    name: "placeholder",
                    description: "The placeholder attribute",
                    type: "string",
                    default: "",
                    required: false,
                },
            ],
            slots: [
                {
                    name: "list-region",
                    description: "The list-region slot",
                },
                {
                    name: "menu-region",
                    description: "The menu-region slot",
                },
                {
                    name: "no-options-region",
                    description: "The no-options-region slot",
                },
                {
                    name: "loading-region",
                    description: "The loading-region slot",
                },
            ],
        },
    ],
};
