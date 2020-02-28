import { linkedDataSchema } from "@microsoft/fast-tooling";

/**
 * Complies with FAST Tooling 2.0
 */
export default {
    $schema: "http://json-schema.org/schema#",
    title: "Subheading",
    description: "A Subheading component's schema definition",
    type: "object",
    id: "@microsoft/fast-components-react-msft/subheading",
    formPluginId: "@microsoft/fast-components-react-msft/subheading",
    properties: {
        tag: {
            title: "HTML Tag",
            type: "string",
            enum: ["h1", "h2", "h3", "h4", "h5", "h6", "p"],
            default: "h3",
        },
        size: {
            title: "Size",
            type: "number",
            enum: [1, 2, 3, 4, 5, 6, 7],
            default: 1,
        },
        children: {
            ...linkedDataSchema,
            formPluginId: "@microsoft/fast-components-react-msft/subheading/children",

            examples: ["Lorem ipsum sit amet"],
        },
    },
    required: ["children"],
};
