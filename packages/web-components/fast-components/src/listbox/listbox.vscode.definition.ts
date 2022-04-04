export default {
    version: 1.1,
    tags: [
        {
            name: "fast-listbox",
            title: "Listbox",
            description: "The FAST listbox element",
            attributes: [
                {
                    name: "disabled",
                    title: "Disabled",
                    description: "Sets the disabled state of the listbox",
                    type: "boolean",
                    default: false,
                    required: false,
                },
                {
                    name: "multiple",
                    title: "Multiple",
                    description: "Indicates if the listbox is in multi-selection mode",
                    type: "boolean",
                    default: false,
                    required: false,
                },
                {
                    name: "size",
                    title: "Size",
                    description: "The maximum number of visible options",
                    type: "string",
                    required: false,
                },
            ],
            slots: [
                {
                    name: "",
                    title: "Default slot",
                    description: "Supports fast-option or option elements",
                },
            ],
        },
    ],
};
