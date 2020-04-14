import { linkedDataSchema } from "@microsoft/fast-tooling";

/**
 * Complies with FAST Tooling 2.0
 */
export default {
    $schema: "http://json-schema.org/schema#",
    title: "Button",
    description: "A button component's schema definition.",
    type: "object",
    id: "@microsoft/fast-components-react-base/button",
    formPluginId: "@microsoft/fast-components-react-base/button",
    properties: {
        disabled: {
            title: "Disabled",
            type: "boolean",
        },
        href: {
            title: "HTML href attribute",
            type: "string",
        },
        children: {
            ...linkedDataSchema,
            formPluginId: "@microsoft/fast-components-react-base/button/children",
        },
    },
};
