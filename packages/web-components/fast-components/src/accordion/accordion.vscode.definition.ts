export default {
    version: 1.1,
    tags: [
        {
            name: "fast-accordion",
            title: "Accordion",
            description: "The FAST accordion element",
            attributes: [
                {
                    name: "expand-mode",
                    title: "Expand mode",
                    description: "The way items are allowed to expand",
                    type: "string",
                    values: [
                        {
                            name: "single",
                        },
                        {
                            name: "multi",
                        },
                    ],
                    default: "multi",
                    required: false,
                },
            ],
            slots: [
                {
                    name: "",
                    title: "Default slot",
                    description: "The default slot for accordion items",
                },
            ],
        },
    ],
};
