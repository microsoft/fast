export default {
    version: 1.1,
    tags: [
        {
            name: "fast-picker-menu-option",
            title: "Picker menu item",
            description: "The FAST picker-menu-option element",
            attributes: [
                {
                    name: "value",
                    description: "The value attribute",
                    default: "",
                    required: true,
                    type: "string",
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
