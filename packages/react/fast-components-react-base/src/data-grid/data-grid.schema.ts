export default {
    $schema: "http://json-schema.org/schema#",
    title: "Data grid",
    description: "A data grid component's schema definition.",
    type: "object",
    id: "@microsoft/fast-components-react-base/data-grid",
    formPluginId: "@microsoft/fast-components-react-base/data-grid",
    properties: {
        gridData: {
            title: "Array of data (objects by row) to be rendered",
            type: "array",
        },
        stableRangeEndIndex: {
            title: "Stable range end index",
            type: "number",
        },
        pageSize: {
            title: "Data page size",
            type: "number",
        },
        virtualizeItems: {
            title: "Virtualize items",
            type: "boolean",
        },
        dataRowKey: {
            title: "Data row key",
            type: "string",
        },
        columnDefinitions: {
            title: "Array of columndefinitions",
            type: "array",
        },
        itemHeight: {
            title: "Item height",
            type: "number",
        },
        defaultFocusRowKey: {
            title: "Default focus row key",
            type: "string",
        },
        defaultFocusColumnKey: {
            title: "Default focus column key",
            type: "string",
        },
    },
    required: ["gridData", "dataRowKey", "columnDefinitions"],
};
