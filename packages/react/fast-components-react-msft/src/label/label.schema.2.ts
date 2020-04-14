import { linkedDataSchema } from "@microsoft/fast-tooling";

/**
 * Complies with FAST Tooling 2.0
 */
export default {
    $schema: "http://json-schema.org/schema#",
    title: "Label",
    description: "A label component's schema definition.",
    type: "object",
    id: "@microsoft/fast-components-react-msft/label",
    formPluginId: "@microsoft/fast-components-react-msft/label",
    properties: {
        tag: {
            title: "HTML tag",
            type: "string",
            enum: ["label", "legend"],
            default: "label",
        },
        hidden: {
            title: "Hidden",
            type: "boolean",
        },
        children: {
            ...linkedDataSchema,
            formPluginId: "@microsoft/fast-components-react-msft/label/children",
            examples: ["Lorem ipsum"],
        },
    },
    required: ["label"],
};
