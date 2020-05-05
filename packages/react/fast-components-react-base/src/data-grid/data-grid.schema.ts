export default {
    $schema: "http://json-schema.org/schema#",
    title: "Data grid",
    description: "A dialog component's schema definition.",
    type: "object",
    id: "@edge-web-ui/browser-ring-one/data-grid",
    formPluginId: "@edge-web-ui/browser-ring-one/data-grid",
    properties: {
        gridData: {
            title: "Array of data to be rendered",
            type: "array",
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
        preloadBufferLength: {
            title: "preloadBufferLength",
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
    required: ["gridData", "dataRowKey", "columnDefinitions"],
};
