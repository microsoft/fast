export default {
    $schema: "http://json-schema.org/schema#",
    title: "Data grid cell",
    description: "A data grid cell's schema definition.",
    type: "object",
    id: "@microsoft/fast-components-react-base/data-grid-cell",
    formPluginId: "@microsoft/fast-components-react-base/data-grid-cell",
    properties: {
        rowData: {
            title: "Row data",
            type: "object",
        },
        columnIndex: {
            title: "Column index",
            type: "number",
        },
        columnDefinition: {
            title: "Column definition",
            type: "object",
            properties: {
                columnDataKey: {
                    title: "Column data key",
                    type: "string",
                },
                title: {
                    title: "Title",
                    type: "object",
                },
                columnWidth: {
                    title: "Column Width",
                    type: "string",
                },
            },
        },
    },
    reactProperties: {
        children: {
            title: "Children",
            type: "children",
            defaults: ["text"],
        },
    },
    required: ["rowData", "columnIndex", "columnDefinition"],
};
