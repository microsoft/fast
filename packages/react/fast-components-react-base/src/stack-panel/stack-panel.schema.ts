export default {
    $schema: "http://json-schema.org/schema#",
    title: "Stack panel",
    description: "A  stack panel component's schema definition.",
    type: "object",
    id: "@microsoft/fast-components-react-base/stack-panel",
    properties: {
        virtualize: {
            title: "Enable virtualization",
            type: "boolean",
            default: true,
        },
        neverVirtualizeIndexes: {
            title: "Indexes of items not to virtualize",
            type: "array",
        },
        itemSpan: {
            title: "Default item span",
            type: "number | array",
            default: 100,
        },
        preloadBufferLength: {
            title: "Preload buffer length",
            type: "number",
            default: 1,
        },
        orientation: {
            title: "Orientation",
            type: "string",
            default: "vertical",
            enum: ["horizontal", "vertical"],
        },
        nextItemPeek: {
            title: "Next item peek",
            type: "number",
            default: 50,
        },
        enableSmoothScrolling: {
            title: "Enable smooth scrolling",
            type: "boolean",
            default: true,
        },
        scrollDuration: {
            title: "Scroll duration",
            type: "number",
            default: 500,
        },
        initiallyVisibleItemIndex: {
            title: "Initially visible item index",
            type: "number",
        },
        scrollLayoutUpdateDelay: {
            title: "Delay in ms before viewport contents updated after scrolling stops",
            type: "number",
            default: 50,
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
