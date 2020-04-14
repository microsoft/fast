/**
 * Complies with FAST Tooling 1.0
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
    },
    reactProperties: {
        children: {
            title: "Children",
            type: "children",
            formPluginId: "@microsoft/fast-components-react-msft/neutral-button/children",
            defaults: ["text"],
            examples: ["Lorem"],
        },
        beforeContent: {
            title: "Before content",
            type: "children",
            formPluginId:
                "@microsoft/fast-components-react-msft/neutral-button/beforeContent",
            pluginId:
                "@microsoft/fast-components-react-msft/neutral-button/beforeContent",
        },
        afterContent: {
            title: "After content",
            type: "children",
            formPluginId:
                "@microsoft/fast-components-react-msft/neutral-button/afterContent",
            pluginId: "@microsoft/fast-components-react-msft/neutral-button/afterContent",
        },
    },
    required: ["children"],
};
