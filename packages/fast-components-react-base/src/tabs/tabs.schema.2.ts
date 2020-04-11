import { linkedDataSchema } from "@microsoft/fast-tooling";

/**
 * Complies with FAST Tooling 2.0
 */
export default {
    $schema: "http://json-schema.org/schema#",
    title: "Tabs",
    description: "A tabs component's schema definition.",
    type: "object",
    id: "@microsoft/fast-components-react-base/tabs",
    formPluginId: "@microsoft/fast-components-react-base/tabs",
    properties: {
        activeId: {
            title: "Active tab ID",
            type: "string",
        },
        label: {
            title: "HTML aria-label attribute",
            type: "string",
        },
        orientation: {
            title: "HTML aria-orientation attribute",
            type: "string",
            enum: ["horizontal", "vertical"],
        },
        tabItemSlot: {
            title: "Tab item slot",
            type: "string",
            default: "tab-item",
        },
        tabPanelSlot: {
            title: "Tab panel slot",
            type: "string",
            default: "tab-panel",
        },
        tabSlot: {
            title: "Tab slot",
            type: "string",
            default: "tab",
        },
        children: {
            ...linkedDataSchema,
            formPluginId: "@microsoft/fast-components-react-base/tabs/children",
            ids: ["tab-item"],
        },
    },
    required: ["label"],
};
