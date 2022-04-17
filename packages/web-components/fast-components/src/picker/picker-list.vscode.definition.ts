export default {
    version: 1.1,
    tags: [
        {
            name: "fast-picker-list",
            title: "Picker list",
            description: "The FAST picker-list element",
            attributes: [
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
            ],
            slots: [
                {
                    name: "",
                    description: "The default slot",
                },
            ],
        },
    ],
};
