import { linkedDataSchema } from "@microsoft/fast-tooling";

/**
 * Complies with FAST Tooling 2.0
 */
export default {
    $schema: "http://json-schema.org/schema#",
    title: "Paragraph",
    description: "A paragraph component's schema definition.",
    type: "object",
    id: "@microsoft/fast-components-react-msft/paragraph",
    formPluginId: "@microsoft/fast-components-react-msft/paragraph",
    properties: {
        size: {
            title: "Size",
            type: "number",
            enum: [1, 2, 3],
        },
        children: {
            ...linkedDataSchema,
            formPluginId: "@microsoft/fast-components-react-msft/paragraph/children",

            examples: [
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam risus erat, tincidunt a lectus sit amet, commodo vulputate sem.",
            ],
        },
    },
    required: ["children"],
};
