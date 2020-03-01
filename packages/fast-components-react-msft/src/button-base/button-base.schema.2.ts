import { linkedDataSchema } from "@microsoft/fast-tooling";

/**
 * Complies with FAST Tooling 2.0
 */
export default {
    $schema: "http://json-schema.org/schema#",
    title: "Button base",
    description: "A MSFT button base component's schema definition.",
    type: "object",
    id: "@microsoft/fast-components-react-msft/button-base",
    formPluginId: "@microsoft/fast-components-react-msft/button-base",
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
            formPluginId: "@microsoft/fast-components-react-msft/button-base/children",
            examples: ["Lorem"],
        },
        beforeContent: {
            ...linkedDataSchema,
            title: "Before content",
            formPluginId:
                "@microsoft/fast-components-react-msft/button-base/beforeContent",
            pluginId: "@microsoft/fast-components-react-msft/button-base/beforeContent",
        },
        afterContent: {
            ...linkedDataSchema,
            title: "After content",
            formPluginId:
                "@microsoft/fast-components-react-msft/button-base/afterContent",
            pluginId: "@microsoft/fast-components-react-msft/button-base/afterContent",
        },
    },
    required: ["children"],
};
