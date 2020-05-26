/**
 * Complies with FAST Tooling 1.0
 */
export default {
    $schema: "http://json-schema.org/schema#",
    title: "Data grid row",
    description: "A data grid row's schema definition.",
    type: "object",
    id: "@microsoft/fast-components-react-base/data-grid-row",
    formPluginId: "@microsoft/fast-components-react-base/data-grid-row",
    properties: {
        rowData: {
            title: "Row data",
            type: "object",
        },
        gridTemplateColumns: {
            title: "Grid template columns",
            type: "string",
        },
        rowIndex: {
            title: "Row index",
            type: "number",
        },
    },
    required: ["rowData", "gridTemplateColumns", "rowIndex"],
};
