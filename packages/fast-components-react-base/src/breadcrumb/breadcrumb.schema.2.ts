import { linkedDataSchema } from "@microsoft/fast-tooling";

/**
 * Complies with FAST Tooling 2.0
 */
export default {
    $schema: "http://json-schema.org/schema#",
    title: "Breadcrumb",
    description: "A breadcrumb component's schema definition.",
    type: "object",
    id: "@microsoft/fast-components-react-base/breadcrumb",
    formPluginId: "@microsoft/fast-components-react-base/breadcrumb",
    properties: {
        label: {
            title: "label",
            type: "string",
        },
        children: {
            ...linkedDataSchema,
            formPluginId: "@microsoft/fast-components-react-base/breadcrumb/children",
        },
        separator: {
            ...linkedDataSchema,
            formPluginId:
                "@microsoft/fast-components-react-base/badbreadcrumbge/separator",
            pluginId: "@microsoft/fast-components-react-base/breadcrumb/separator",
        },
    },
};
