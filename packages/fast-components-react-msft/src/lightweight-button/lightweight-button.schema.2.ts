import { linkedDataSchema } from "@microsoft/fast-tooling";

/**
 * Complies with FAST Tooling 2.0
 */
export default {
    $schema: "http://json-schema.org/schema#",
    title: "Lightweight button",
    description: "A lightweight button component's schema definition.",
    type: "object",
    id: "@microsoft/fast-components-react-msft/lightweight-button",
    formPluginId: "@microsoft/fast-components-react-msft/lightweight-button",
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
            formPluginId:
                "@microsoft/fast-components-react-msft/lightweight-button/children",

            examples: ["Lorem"],
        },
        beforeContent: {
            ...linkedDataSchema,
            title: "Before content",

            formPluginId:
                "@microsoft/fast-components-react-msft/lightweight-button/beforeContent",
            pluginId:
                "@microsoft/fast-components-react-msft/lightweight-button/beforeContent",
        },
        afterContent: {
            ...linkedDataSchema,
            title: "After content",

            formPluginId:
                "@microsoft/fast-components-react-msft/lightweight-button/afterContent",
            pluginId:
                "@microsoft/fast-components-react-msft/lightweight-button/afterContent",
        },
    },
    required: ["children"],
};
