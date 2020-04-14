import { linkedDataSchema } from "@microsoft/fast-tooling";

/**
 * Complies with FAST Tooling 2.0
 */
export default {
    $schema: "http://json-schema.org/schema#",
    title: "Caption",
    description: "A caption component's schema definition.",
    type: "object",
    id: "@microsoft/fast-components-react-msft/caption",
    formPluginId: "@microsoft/fast-components-react-msft/caption",
    properties: {
        tag: {
            title: "HTML tag",
            type: "string",
            enum: ["p", "span", "caption", "figcaption"],
            default: "p",
        },
        size: {
            title: "Size",
            type: "number",
            enum: [1, 2],
            default: 1,
        },
        children: {
            ...linkedDataSchema,
            formPluginId: "@microsoft/fast-components-react-msft/caption/children",
            examples: ["Lorem ipsum dolor sit amet."],
        },
    },
    required: ["children"],
};
