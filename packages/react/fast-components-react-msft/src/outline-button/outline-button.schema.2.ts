import { linkedDataSchema } from "@microsoft/fast-tooling";

/**
 * Complies with FAST Tooling 2.0
 */
export default {
    $schema: "http://json-schema.org/schema#",
    title: "Outline button",
    description: "An outline button component's schema definition.",
    type: "object",
    id: "@microsoft/fast-components-react-msft/outline-button",
    formPluginId: "@microsoft/fast-components-react-msft/outline-button",
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
            formPluginId: "@microsoft/fast-components-react-msft/outline-button/children",
            examples: ["Lorem"],
        },
        beforeContent: {
            ...linkedDataSchema,
            title: "Before content",
            formPluginId:
                "@microsoft/fast-components-react-msft/outline-button/beforeContent",
            pluginId:
                "@microsoft/fast-components-react-msft/outline-button/beforeContent",
        },
        afterContent: {
            ...linkedDataSchema,
            title: "After content",
            formPluginId:
                "@microsoft/fast-components-react-msft/outline-button/afterContent",
            pluginId: "@microsoft/fast-components-react-msft/outline-button/afterContent",
        },
    },
    required: ["children"],
};
