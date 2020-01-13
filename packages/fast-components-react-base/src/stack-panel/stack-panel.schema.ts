export default {
    $schema: "http://json-schema.org/schema#",
    title: " stack panel",
    description: "A  stack panel component's schema definition.",
    type: "object",
    id: "@microsoft/fast-components-react-base/stack-panel",
    properties: {
        enableVirtualization: {
            title: "Enable virtualization",
            type: "boolean",
        },
        neverVirtualizeIndexes: {
            title: "Indexes of items not to virtualize",
            type: "array",
        },
        defaultItemSpan: {
            title: "Default item span",
            type: "number",
        },
        itemSpanOverrides: {
            title: "Item span overrides",
            type: "array",
        },
        preloadBufferLength: {
            title: "Preload buffer length",
            type: "number",
        },
        orientation: {
            title: "Orientation",
            type: "string",
            default: "horizontal",
            enum: ["horizontal", "vertical"],
        },
        nextItemPeek: {
            title: "Next item peek",
            type: "number",
        },
        enableSmoothScrolling: {
            title: "Enable smooth scrolling",
            type: "boolean",
        },
        scrollDuration: {
            title: "Scroll duration",
            type: "number",
        },
        initiallyVisibleItemIndex: {
            title: "Initially visible item index",
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
};
