import { linkedDataSchema } from "@microsoft/fast-tooling";

/**
 * Complies with FAST Tooling 2.0
 */
export default {
    $schema: "http://json-schema.org/schema#",
    title: "Tab panel",
    description: "A tab panel component's schema definition.",
    type: "object",
    id: "@microsoft/fast-components-react-base/tab-panel",
    formPluginId: "@microsoft/fast-components-react-base/tab-panel",
    properties: {
        slot: {
            title: "Slot",
            type: "string",
            default: "tab-panel",
        },
        children: {
            ...linkedDataSchema,
            formPluginId: "@microsoft/fast-components-react-base/tab-panel/children",
        },
    },
    required: ["slot"],
};
