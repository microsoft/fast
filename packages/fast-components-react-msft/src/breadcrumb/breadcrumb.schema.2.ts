import { linkedDataSchema } from "@microsoft/fast-tooling";

/**
 * Complies with FAST Tooling 2.0
 */
export default {
    $schema: "http://json-schema.org/schema#",
    title: "Breadcrumb",
    description: "A breadcrumb component's schema definition.",
    type: "object",
    id: "@microsoft/fast-components-react-msft/breadcrumb",
    formPluginId: "@microsoft/fast-components-react-msft/breadcrumb",
    properties: {
        label: {
            title: "label",
            type: "string",
        },
        children: {
            ...linkedDataSchema,
            examples: ["Lorem"],
        },
        separator: {
            ...linkedDataSchema,
            title: "Separator",
            pluginId: "@microsoft/fast-components-react-msft/breadcrumb/separator",
            formPluginId: "@microsoft/fast-components-react-msft/breadcrumb/separator",
        },
    },
    required: ["children"],
};
