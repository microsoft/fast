import { linkedDataSchema } from "@microsoft/fast-tooling";

/**
 * Complies with FAST Tooling 2.0
 */
export default {
    $schema: "http://json-schema.org/schema#",
    title: "Call to action",
    description: "A call to action component's schema definition.",
    type: "object",
    id: "@microsoft/fast-components-react-msft/call-to-action",
    formPluginId: "@microsoft/fast-components-react-msft/call-to-action",
    properties: {
        href: {
            title: "HTML href attribute",
            type: "string",
        },
        appearance: {
            title: "Appearance",
            type: "string",
            default: "primary",
            enum: ["justified", "lightweight", "outline", "primary", "stealth"],
        },
        disabled: {
            title: "Disabled",
            type: "boolean",
        },
        children: {
            ...linkedDataSchema,
            formPluginId: "@microsoft/fast-components-react-msft/call-to-action/children",
            examples: ["Lorem ipsum sit"],
        },
    },
    required: ["children"],
};
