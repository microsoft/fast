import { linkedDataSchema } from "@microsoft/fast-tooling";

/**
 * Complies with FAST Tooling 2.0
 */
export default {
    $schema: "http://json-schema.org/schema#",
    title: "Hypertext",
    description: "A hypertext component's schema definition.",
    type: "object",
    id: "@microsoft/fast-components-react-base/hypertext",
    formPluginId: "@microsoft/fast-components-react-base/hypertext",
    properties: {
        href: {
            title: "HTML href attribute",
            type: "string",
        },
        children: {
            ...linkedDataSchema,
            formPluginId: "@microsoft/fast-components-react-base/hypertext/children",
        },
    },
};
