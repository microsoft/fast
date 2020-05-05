export default {
    $schema: "http://json-schema.org/schema#",
    title: "Data grid row",
    description: "A data grid row's schema definition.",
    type: "object",
    id: "@edge-web-ui/browser-ring-one/data-grid-row",
    formPluginId: "@edge-web-ui/browser-ring-one/data-grid-row",
    properties: {
        rowData: {
            title: "Row data",
            type: "array",
        },
        gridTemplateColumns: {
            title: "Grid template columns",
            type: "string",
        },
        gridRowTop: {
            title: "Grid row top",
            type: "number",
        },
        rowIndex: {
            title: "Row index",
            type: "number",
        },
    },
    reactProperties: {
        children: {
            title: "Children",
            type: "children",
            defaults: ["text"],
        },
    },
    required: ["rowData", "gridTemplateColumns", "gridRowTop", "rowIndex"],
};
