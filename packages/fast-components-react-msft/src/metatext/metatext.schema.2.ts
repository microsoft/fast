import { linkedDataSchema } from "@microsoft/fast-tooling";

/**
 * Complies with FAST Tooling 2.0
 */
export default {
    $schema: "http://json-schema.org/schema#",
    title: "Metatext",
    description: "A metatext component's schema definition.",
    type: "object",
    id: "@microsoft/fast-components-react-msft/metatext",
    formPluginId: "@microsoft/fast-components-react-msft/metatext",
    properties: {
        tag: {
            title: "HTML tag",
            type: "string",
            enum: ["p", "span"],
        },
        children: {
            ...linkedDataSchema,
            formPluginId: "@microsoft/fast-components-react-msft/metatext/children",

            examples: ["Lorem ipsum"],
        },
    },
    required: ["children"],
};
