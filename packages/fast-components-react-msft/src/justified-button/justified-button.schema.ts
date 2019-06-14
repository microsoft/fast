export default {
    $schema: "http://json-schema.org/schema#",
    title: "Justified button",
    description: "A justified button component's schema definition.",
    type: "object",
    id: "@microsoft/fast-components-react-msft/justified-button",
    formPluginId: "@microsoft/fast-components-react-msft/justified-button",
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
                "@microsoft/fast-components-react-msft/justified-button/children",
            defaults: ["text"],
            examples: ["Lorem"],
        },
        beforeContent: {
            title: "Before content",
            type: "children",
            formPluginId:
                "@microsoft/fast-components-react-msft/justified-button/beforeContent",
            pluginId:
                "@microsoft/fast-components-react-msft/justified-button/beforeContent",
        },
        afterContent: {
            title: "After content",
            type: "children",
            formPluginId:
                "@microsoft/fast-components-react-msft/justified-button/afterContent",
            pluginId:
                "@microsoft/fast-components-react-msft/justified-button/afterContent",
        },
    },
    required: ["children"],
};
