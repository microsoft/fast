import { childrenSchema, ChildrenType } from "@microsoft/fast-tooling";

/**
 * Complies with FAST Tooling 2.0
 */
export default {
    $schema: "http://json-schema.org/schema#",
    title: "Hypertext",
    description: "A hypertext component's schema definition.",
    type: "object",
    id: "@microsoft/fast-components-react-msft/hypertext",
    formPluginId: "@microsoft/fast-components-react-msft/hypertext",
    properties: {
        href: {
            title: "HTML href attribute",
            type: "string",
            examples: ["#", "http://microsoft.com"],
        },
        children: {
            ...childrenSchema,
            formPluginId: "@microsoft/fast-components-react-msft/hypertext/children",
            allowTypes: [ChildrenType.string, ChildrenType.component],
            examples: ["Lorem ipsum"],
        },
    },
    required: ["children"],
};
