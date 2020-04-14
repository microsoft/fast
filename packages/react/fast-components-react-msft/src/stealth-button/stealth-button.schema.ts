/**
 * Complies with FAST Tooling 1.0
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
    },
    reactProperties: {
        children: {
            title: "Children",
            type: "children",
            formPluginId: "@microsoft/fast-components-react-msft/stealth-button/children",
            defaults: ["text"],
            examples: ["Lorem"],
        },
        beforeContent: {
            title: "Before content",
            type: "children",
            formPluginId:
                "@microsoft/fast-components-react-msft/stealth-button/beforeContent",
            pluginId:
                "@microsoft/fast-components-react-msft/stealth-button/beforeContent",
        },
        afterContent: {
            title: "After content",
            type: "children",
            formPluginId:
                "@microsoft/fast-components-react-msft/stealth-button/afterContent",
            pluginId: "@microsoft/fast-components-react-msft/stealth-button/afterContent",
        },
    },
    required: ["children"],
};
