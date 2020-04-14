import { linkedDataSchema } from "@microsoft/fast-tooling";

/**
 * Complies with FAST Tooling 2.0
 */
export default {
    $schema: "http://json-schema.org/schema#",
    title: "Tab",
    description: "A tab component's schema definition.",
    type: "object",
    id: "@microsoft/fast-components-react-base/tab",
    formPluginId: "@microsoft/fast-components-react-base/tab",
    properties: {
        slot: {
            title: "Slot",
            type: "string",
            default: "tab",
        },
        children: {
            ...linkedDataSchema,
            formPluginId: "@microsoft/fast-components-react-base/tab/children",
        },
    },
    required: ["slot"],
};
