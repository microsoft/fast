export default {
    $schema: "http://json-schema.org/schema#",
    title: "Data grid cell",
    description: "A data grid cell's schema definition.",
    type: "object",
    id: "@edge-web-ui/browser-ring-one/data-grid-cell",
    formPluginId: "@edge-web-ui/browser-ring-one/data-grid-cell",
    properties: {
        rowData: {
            title: "Row data",
            type: "array",
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
                    type: "string",
                },
                columnWidth: {
                    title: "Column Width",
                    type: "number",
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
