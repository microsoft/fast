import { linkedDataSchema } from "@microsoft/fast-tooling";

/**
 * Complies with FAST Tooling 2.0
 */
export default {
    $schema: "http://json-schema.org/schema#",
    title: "Neutral button",
    description: "A neutral button component's schema definition.",
    type: "object",
    id: "@microsoft/fast-components-react-msft/neutral-button",
    formPluginId: "@microsoft/fast-components-react-msft/neutral-button",
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
            formPluginId: "@microsoft/fast-components-react-msft/neutral-button/children",

            examples: ["Lorem"],
        },
        beforeContent: {
            ...linkedDataSchema,
            title: "Before content",
            formPluginId:
                "@microsoft/fast-components-react-msft/neutral-button/beforeContent",
            pluginId:
                "@microsoft/fast-components-react-msft/neutral-button/beforeContent",
        },
        afterContent: {
            ...linkedDataSchema,
            title: "After content",
            formPluginId:
                "@microsoft/fast-components-react-msft/neutral-button/afterContent",
            pluginId: "@microsoft/fast-components-react-msft/neutral-button/afterContent",
        },
    },
    required: ["children"],
};
