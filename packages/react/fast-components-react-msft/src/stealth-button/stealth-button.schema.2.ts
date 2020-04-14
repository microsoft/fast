import { linkedDataSchema } from "@microsoft/fast-tooling";

/**
 * Complies with FAST Tooling 2.0
 */
export default {
    $schema: "http://json-schema.org/schema#",
    title: "Stealth button",
    description: "A stealth button component's schema definition.",
    type: "object",
    id: "@microsoft/fast-components-react-msft/stealth-button",
    formPluginId: "@microsoft/fast-components-react-msft/stealth-button",
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
            formPluginId: "@microsoft/fast-components-react-msft/stealth-button/children",

            examples: ["Lorem"],
        },
        beforeContent: {
            ...linkedDataSchema,
            title: "Before content",

            formPluginId:
                "@microsoft/fast-components-react-msft/stealth-button/beforeContent",
            pluginId:
                "@microsoft/fast-components-react-msft/stealth-button/beforeContent",
        },
        afterContent: {
            ...linkedDataSchema,
            title: "After content",

            formPluginId:
                "@microsoft/fast-components-react-msft/stealth-button/afterContent",
            pluginId: "@microsoft/fast-components-react-msft/stealth-button/afterContent",
        },
    },
    required: ["children"],
};
