/**
 * Complies with FAST Tooling 1.0
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
    },
    reactProperties: {
        children: {
            title: "Children",
            type: "children",
            formPluginId:
                "@microsoft/fast-components-react-msft/lightweight-button/children",
            defaults: ["text"],
            examples: ["Lorem"],
        },
        beforeContent: {
            title: "Before content",
            type: "children",
            formPluginId:
                "@microsoft/fast-components-react-msft/lightweight-button/beforeContent",
            pluginId:
                "@microsoft/fast-components-react-msft/lightweight-button/beforeContent",
        },
        afterContent: {
            title: "After content",
            type: "children",
            formPluginId:
                "@microsoft/fast-components-react-msft/lightweight-button/afterContent",
            pluginId:
                "@microsoft/fast-components-react-msft/lightweight-button/afterContent",
        },
    },
    required: ["children"],
};
