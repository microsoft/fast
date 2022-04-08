export default {
    version: 1.1,
    tags: [
        {
            name: "fast-data-grid-cell",
            title: "Data grid cell",
            description: "The FAST data grid cell element",
            attributes: [
                {
                    name: "cell-type",
                    title: "Cell type",
                    description: "The type of cell",
                    type: "string",
                    values: [
                        { name: "default" },
                        { name: "columnheader" },
                        { name: "rowheader" },
                    ],
                    required: false,
                },
                {
                    name: "grid-column",
                    title: "Grid column",
                    description: "Positions the cell in the column layout.",
                    type: "string",
                    required: false,
                },
            ],
            slots: [
                {
                    name: "",
                    title: "Default slot",
                    description: "The cell content",
                },
            ],
        },
    ],
};
